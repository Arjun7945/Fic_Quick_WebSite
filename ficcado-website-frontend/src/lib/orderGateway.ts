// =============================================================================
// Order Gateway Client — /src/lib/orderGateway.ts
// Handles atomic order processing via Google Apps Script (Option A) or sheet-row (Option B).
// Enforces 8-second execution timeout guard with cryptographic offline FIC-T fallback per D1.
// =============================================================================

import { generateOfflineReferenceId, isValidReferenceId } from './referenceId.ts';
import { appendSheetValues, getSheetValues, sanitizeCell } from './sheets/client.ts';
import { getEnsuredSheetSchema } from './sheets/schema.ts';

export interface OrderRowData {
  reference_id?: string;
  submission_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  pincode: string;
  landmark: string;
  courier_partner_id: string;
  courier_partner_name: string;
  delivery_charge: number;
  subtotal: number;
  total_amount: number;
  item_count: number;
  items_summary: string;
  items_json: string;
  created_at: string;
  status: string;
}

export interface GatewayOrderResult {
  referenceId: string;
  isDuplicate: boolean;
  isOffline: boolean;
  mode: 'gateway' | 'sheet-row' | 'offline';
}

/**
 * Validates production environment configuration for Order ID generation.
 * Production must fail if neither Apps Script gateway nor explicit sheet-row mode is configured.
 */
export function validateOrderConfiguration(): void {
  const gatewayUrl = process.env.ORDER_GATEWAY_URL;
  const gatewaySecret = process.env.ORDER_GATEWAY_SECRET;
  const idMode = process.env.ORDER_ID_MODE;

  if (process.env.NODE_ENV === 'production') {
    const hasGateway = Boolean(gatewayUrl && gatewaySecret);
    const hasSheetRow = idMode === 'sheet-row';

    if (!hasGateway && !hasSheetRow) {
      throw new Error(
        'Production order configuration error: Neither ORDER_GATEWAY_URL/ORDER_GATEWAY_SECRET nor ORDER_ID_MODE=sheet-row is configured.'
      );
    }
  }
}

/**
 * Dispatches order row to Google Apps Script Gateway (atomic LockService + PropertiesService).
 */
async function processViaAppsScriptGateway(
  gatewayUrl: string,
  gatewaySecret: string,
  submissionId: string,
  rowData: OrderRowData,
  timeoutMs = 8000
): Promise<GatewayOrderResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(gatewayUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: gatewaySecret,
        submission_id: submissionId,
        rowData,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Apps Script gateway HTTP ${res.status}: ${errText}`);
    }

    const data = await res.json();
    if (!data.success || !data.referenceId) {
      throw new Error(data.message || 'Apps Script returned failure without referenceId');
    }

    return {
      referenceId: data.referenceId,
      isDuplicate: Boolean(data.duplicate),
      isOffline: false,
      mode: 'gateway',
    };
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

/**
 * Secondary mode: Appends row directly, then derives reference ID from the row number.
 * Weaker guarantee: requires protected columns and strictly "never delete rows".
 */
async function processViaSheetRowMode(
  sheetId: string,
  submissionId: string,
  rowData: OrderRowData
): Promise<GatewayOrderResult> {
  console.warn('[Orders] Using WEAKER sheet-row mode. Requires protected rows and strictly never deleting rows.');

  await getEnsuredSheetSchema();

  // Read existing rows for idempotency check
  const existingRows = await getSheetValues(sheetId, "'New Sale Request'!A1:Z500", { revalidate: 0, cache: 'no-store' });
  if (existingRows && existingRows.length > 1) {
    const headers = existingRows[0].map((h) => h.trim().toLowerCase());
    const subIdIdx = headers.indexOf('submission_id');
    const refIdIdx = headers.indexOf('reference_id');

    if (subIdIdx !== -1 && refIdIdx !== -1) {
      for (let i = 1; i < existingRows.length; i++) {
        const row = existingRows[i];
        if (row[subIdIdx]?.trim() === submissionId) {
          const existingRef = row[refIdIdx]?.trim();
          if (existingRef && isValidReferenceId(existingRef)) {
            return {
              referenceId: existingRef,
              isDuplicate: true,
              isOffline: false,
              mode: 'sheet-row',
            };
          }
        }
      }
    }
  }

  // Row number estimate
  const nextRowNumber = (existingRows?.length || 1) + 1;
  const derivedRefId = `FIC-A${String(1000 + nextRowNumber).padStart(4, '0')}`;
  rowData.reference_id = derivedRefId;

  // Append row
  const rowValues = [
    sanitizeCell(derivedRefId),
    sanitizeCell(rowData.created_at),
    sanitizeCell(rowData.status),
    '', // final_order_id
    sanitizeCell(rowData.customer_name),
    sanitizeCell(rowData.customer_email),
    sanitizeCell(rowData.customer_phone),
    sanitizeCell(rowData.address_line1),
    sanitizeCell(rowData.address_line2),
    sanitizeCell(rowData.city),
    sanitizeCell(rowData.state),
    sanitizeCell(rowData.pincode),
    sanitizeCell(rowData.landmark),
    sanitizeCell(rowData.courier_partner_id),
    sanitizeCell(rowData.courier_partner_name),
    rowData.delivery_charge,
    rowData.subtotal,
    rowData.total_amount,
    rowData.item_count,
    sanitizeCell(rowData.items_summary),
    sanitizeCell(rowData.items_json),
    sanitizeCell(rowData.submission_id),
  ];

  await appendSheetValues(sheetId, "'New Sale Request'!A2", [rowValues]);

  return {
    referenceId: derivedRefId,
    isDuplicate: false,
    isOffline: false,
    mode: 'sheet-row',
  };
}

// In-flight submission locks and recent order cache (idempotency guard)
const inFlightOrders = new Map<string, Promise<GatewayOrderResult>>();
const orderCache = new Map<string, { result: GatewayOrderResult; expiresAt: number }>();

// Mutex for sheet-row mode to prevent concurrent row index calculation races
let sheetRowMutex: Promise<void> = Promise.resolve();

async function runSerializedSheetRow(
  sheetId: string,
  submissionId: string,
  rowData: OrderRowData
): Promise<GatewayOrderResult> {
  const previous = sheetRowMutex;
  let release: () => void = () => {};
  sheetRowMutex = new Promise<void>((resolve) => {
    release = resolve;
  });

  try {
    await previous.catch(() => {});
    return await processViaSheetRowMode(sheetId, submissionId, rowData);
  } finally {
    release();
  }
}

/**
 * Top-level order dispatcher honoring D1:
 * - Tries Apps Script Web App Gateway first (if configured)
 * - Tries Sheet-Row mode if ORDER_ID_MODE=sheet-row
 * - Falls back to offline FIC-T cryptographic reference ID on 8s timeout or network outage
 */
export async function dispatchOrder(
  submissionId: string,
  rowData: OrderRowData
): Promise<GatewayOrderResult> {
  // 1. Check if we already processed this submission recently (cached result)
  const cached = orderCache.get(submissionId);
  if (cached && cached.expiresAt > Date.now()) {
    return { ...cached.result, isDuplicate: true };
  }

  // 2. Check if this exact submission is ALREADY currently in-flight
  if (inFlightOrders.has(submissionId)) {
    const inFlightResult = await inFlightOrders.get(submissionId)!;
    return { ...inFlightResult, isDuplicate: true };
  }

  const executionPromise: Promise<GatewayOrderResult> = (async (): Promise<GatewayOrderResult> => {
    validateOrderConfiguration();

    const gatewayUrl = process.env.ORDER_GATEWAY_URL;
    const gatewaySecret = process.env.ORDER_GATEWAY_SECRET;
    const idMode = process.env.ORDER_ID_MODE;
    const sheetId = process.env.GOOGLE_SHEET_ID;

    // 1. Try Google Apps Script Gateway (Primary Option A)
    if (gatewayUrl && gatewaySecret) {
      try {
        return await processViaAppsScriptGateway(gatewayUrl, gatewaySecret, submissionId, rowData, 8000);
      } catch (err) {
        console.warn(`[Orders] Primary gateway failed (${(err as Error).message}). Falling back to offline fallback.`);
      }
    } else if (idMode === 'sheet-row' && sheetId) {
      // 2. Try Sheet-Row mode (Secondary Option B) with serialization mutex
      try {
        return await runSerializedSheetRow(sheetId, submissionId, rowData);
      } catch (err) {
        console.warn(`[Orders] Sheet-row mode failed (${(err as Error).message}). Falling back to offline fallback.`);
      }
    }

    // 3. Resilient Offline Fallback (8-second timeout or network failure)
    const offlineRefId = generateOfflineReferenceId();
    console.info(`[Orders] Emitted cryptographic offline Reference ID: ${offlineRefId}`);

    return {
      referenceId: offlineRefId,
      isDuplicate: false,
      isOffline: true,
      mode: 'offline',
    };
  })();

  inFlightOrders.set(submissionId, executionPromise);

  try {
    const finalResult = await executionPromise;
    // Cache for 2 minutes to serve identical immediate retries
    orderCache.set(submissionId, { result: finalResult, expiresAt: Date.now() + 120000 });
    return finalResult;
  } finally {
    inFlightOrders.delete(submissionId);
  }
}
