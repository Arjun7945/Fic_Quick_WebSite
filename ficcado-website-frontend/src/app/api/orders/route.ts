// =============================================================================
// Orders API Endpoint — /src/app/api/orders/route.ts
// Server-Verified WhatsApp Order Processing & Google Sheets Persistence
// Refactored per REQUIREMENT_AND_REFACTOR_PART_2.md Section R4 & R5
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getProducts } from '@/lib/products';
import { getCourierPartnerById } from '@/lib/couriers';
import {
  getNextReferenceId,
  generateOfflineReferenceId,
  isValidReferenceId,
} from '@/lib/referenceId';
import {
  buildOrderMessage,
  buildWhatsAppUrl,
  formatISTDate,
  VerifiedOrderItem,
} from '@/lib/whatsapp';
import {
  getSheetValues,
  appendSheetValues,
  sanitizeCell,
} from '@/lib/sheets/client';
import { getEnsuredSheetSchema } from '@/lib/sheets/schema';

// Normalization helpers
function cleanIndianMobile(val: unknown): string {
  if (typeof val !== 'string') return '';
  let digits = val.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    digits = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith('0')) {
    digits = digits.slice(1);
  }
  return digits;
}

function cleanPincode(val: unknown): string {
  if (typeof val !== 'string') return '';
  return val.replace(/\D/g, '').trim();
}

// Strict payload validation schema with resilient input normalization
const OrderRequestSchema = z.object({
  submission_id: z.string().min(6).max(64),
  customer: z.object({
    fullName: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
    mobile: z.preprocess(
      cleanIndianMobile,
      z
        .string()
        .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number')
    ),
    email: z.string().trim().email('Please enter a valid email address').max(120),
  }),
  address: z.object({
    addressLine1: z.string().trim().min(3, 'Address line 1 is too short (min 3 characters)').max(200),
    addressLine2: z.string().trim().max(200).nullish().transform((v) => v || ''),
    city: z.string().trim().min(2, 'City is required (min 2 characters)').max(100),
    state: z.string().trim().min(2, 'State is required (min 2 characters)').max(100),
    pincode: z.preprocess(
      cleanPincode,
      z
        .string()
        .regex(/^[1-9][0-9]{5}$/, 'Please enter a valid 6-digit Indian PIN code')
    ),
    landmark: z.string().trim().max(150).nullish().transform((v) => v || ''),
  }),
  courier_partner_id: z.string().trim().min(1, 'Please select a delivery courier option'),
  items: z
    .array(
      z.object({
        id: z.union([z.number(), z.string()]),
        size: z
          .string()
          .trim()
          .nullish()
          .transform((v) => (v && v.trim() !== '' ? v.trim() : 'Free Size')),
        color: z
          .string()
          .trim()
          .nullish()
          .transform((v) => (v && v.trim() !== '' ? v.trim() : 'Standard')),
        qty: z.coerce.number().int().min(1, 'Quantity must be at least 1').max(10, 'Max 10 per item'),
      })
    )
    .min(1, 'Shopping bag cannot be empty')
    .max(20, 'Maximum 20 distinct items per order'),
});

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    const rawBody = await req.json();
    const parseResult = OrderRequestSchema.safeParse(rawBody);

    if (!parseResult.success) {
      const firstIssue = parseResult.error.issues[0];
      const fieldPath = firstIssue?.path?.join('.') || 'order';
      const friendlyError = firstIssue?.message || 'Invalid order information provided.';

      console.warn(
        `[POST /api/orders] Validation failed on field "${fieldPath}": ${friendlyError}`,
        JSON.stringify(parseResult.error.flatten(), null, 2)
      );

      return NextResponse.json(
        {
          success: false,
          error: friendlyError,
          field: fieldPath,
          details: parseResult.error.format(),
        },
        { status: 400 }
      );
    }

    const { submission_id, customer, address, courier_partner_id, items } = parseResult.data;

    // Abuse check: total quantity across items
    const totalQty = items.reduce((sum, i) => sum + i.qty, 0);
    if (totalQty > 50) {
      return NextResponse.json(
        { error: 'Order exceeds maximum quantity limit (50 items).' },
        { status: 400 }
      );
    }

    // 1. Fetch live product catalog to verify pricing and availability
    const catalog = await getProducts();
    const catalogMap = new Map<string, (typeof catalog)[0]>();
    for (const p of catalog) {
      catalogMap.set(String(p.id), p);
    }

    const verifiedItems: VerifiedOrderItem[] = [];
    let subtotal = 0;

    for (const item of items) {
      const product = catalogMap.get(String(item.id));
      if (!product) {
        return NextResponse.json(
          { error: `Item with ID "${item.id}" is no longer available in our catalog.` },
          { status: 400 }
        );
      }

      if (!product.inStock) {
        return NextResponse.json(
          { error: `"${product.name}" is currently out of stock.` },
          { status: 400 }
        );
      }

      const unitPrice = product.price;
      const lineTotal = unitPrice * item.qty;
      subtotal += lineTotal;

      verifiedItems.push({
        id: product.id,
        name: product.name,
        slug: product.slug,
        category: product.category,
        type: product.type || product.category,
        size: item.size,
        color: item.color,
        qty: item.qty,
        unitPrice,
        lineTotal,
      });
    }

    // 2. Server lookup: resolve courier partner and recompute delivery charge (R4.3)
    const partner = await getCourierPartnerById(courier_partner_id);
    if (!partner) {
      return NextResponse.json(
        { error: 'Selected courier partner is invalid or no longer active. Please choose an available delivery option.' },
        { status: 400 }
      );
    }

    const deliveryCharge = partner.rate;
    const deliveryOptionName = partner.name;
    const courierPartnerId = partner.id;
    const courierPartnerName = partner.name;

    const customerDetails = {
      fullName: customer.fullName,
      mobile: customer.mobile,
      email: customer.email,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      landmark: address.landmark,
    };

    const total = subtotal + deliveryCharge;
    const now = new Date();
    const created_at_ist = formatISTDate(now);

    const sheetId = process.env.GOOGLE_SHEET_ID;

    // Timeout-guarded Sheets operation (8-second max)
    const sheetsPromise = (async () => {
      if (!sheetId) throw new Error('GOOGLE_SHEET_ID not set');

      // Ensure schema is verified on instance cold-start
      await getEnsuredSheetSchema();

      // Read recent rows to check idempotency and determine next reference ID
      // Read with header row
      const existingRows = await getSheetValues(sheetId, "'New Sale Request'!A1:Z1000");

      let headers: string[] = [];
      let dataRows: string[][] = [];

      if (existingRows && existingRows.length > 0) {
        headers = existingRows[0].map((h) => h.trim().toLowerCase());
        dataRows = existingRows.slice(1);
      }

      const getColIdx = (name: string) => headers.indexOf(name.toLowerCase());
      const refIdIdx = getColIdx('reference_id') !== -1 ? getColIdx('reference_id') : 0;
      const subIdIdx = getColIdx('submission_id');
      const subtotalColIdx = getColIdx('subtotal');
      const delChargeColIdx = getColIdx('delivery_charge');
      const totalColIdx = getColIdx('total_amount');

      // Idempotency check: see if submission_id already exists
      if (subIdIdx !== -1) {
        for (const row of dataRows) {
          const rowSubmissionId = row[subIdIdx]?.trim();
          if (rowSubmissionId && rowSubmissionId === submission_id) {
            const existingRefId = row[refIdIdx]?.trim();
            const existingTotal = totalColIdx !== -1 ? parseFloat(row[totalColIdx]) || total : total;
            const existingSubtotal = subtotalColIdx !== -1 ? parseFloat(row[subtotalColIdx]) || subtotal : subtotal;
            const existingDeliveryCharge = delChargeColIdx !== -1 ? parseFloat(row[delChargeColIdx]) || deliveryCharge : deliveryCharge;

            const whatsappMessage = buildOrderMessage({
              referenceId: existingRefId,
              customer: customerDetails,
              items: verifiedItems,
              deliveryOptionName,
              deliveryCharge: existingDeliveryCharge,
              subtotal: existingSubtotal,
              total: existingTotal,
              date: now,
            });

            return {
              referenceId: existingRefId,
              whatsappUrl: buildWhatsAppUrl(whatsappMessage),
              subtotal: existingSubtotal,
              deliveryCharge: existingDeliveryCharge,
              total: existingTotal,
              idempotent: true,
            };
          }
        }
      }

      // Determine highest existing Reference ID
      let highestRefId: string | null = null;
      for (const row of dataRows) {
        const refId = row[refIdIdx]?.trim();
        if (refId && isValidReferenceId(refId) && !refId.startsWith('FIC-T')) {
          if (!highestRefId || refId > highestRefId) {
            highestRefId = refId;
          }
        }
      }

      const assignedReferenceId = getNextReferenceId(highestRefId);

      // Prepare human-readable items summary
      const itemsSummary = verifiedItems
        .map(
          (item, idx) =>
            `${idx + 1}) ${item.name} | Size ${item.size} | Color ${item.color} | Qty ${item.qty} | ₹${item.unitPrice} each | ₹${item.lineTotal}`
        )
        .join('\n');

      const itemsJson = JSON.stringify(verifiedItems);

      // Default ordered columns if headers row was missing
      const standardColumns = [
        'reference_id',
        'created_at',
        'status',
        'final_order_id',
        'customer_name',
        'customer_email',
        'customer_phone',
        'address_line1',
        'address_line2',
        'city',
        'state',
        'pincode',
        'landmark',
        'courier_partner_id',
        'courier_partner_name',
        'delivery_charge',
        'subtotal',
        'total_amount',
        'item_count',
        'items_summary',
        'items_json',
        'submission_id',
      ];

      const effectiveHeaders = headers.length > 0 ? headers : standardColumns;

      // Build row data dynamically matching exact header names
      const rowData = effectiveHeaders.map((header) => {
        switch (header) {
          case 'reference_id':
            return sanitizeCell(assignedReferenceId);
          case 'created_at':
            return sanitizeCell(created_at_ist);
          case 'status':
            return sanitizeCell('NEW');
          case 'final_order_id':
            return '';
          case 'customer_name':
            return sanitizeCell(customer.fullName);
          case 'customer_email':
            return sanitizeCell(customer.email);
          case 'customer_phone':
            return sanitizeCell(customer.mobile);
          case 'address_line1':
            return sanitizeCell(address.addressLine1);
          case 'address_line2':
            return sanitizeCell(address.addressLine2 || '');
          case 'city':
            return sanitizeCell(address.city);
          case 'state':
            return sanitizeCell(address.state);
          case 'pincode':
            return sanitizeCell(address.pincode);
          case 'landmark':
            return sanitizeCell(address.landmark || '');
          case 'courier_partner_id':
            return sanitizeCell(courierPartnerId);
          case 'courier_partner_name':
            return sanitizeCell(courierPartnerName);
          case 'delivery_charge':
            return deliveryCharge;
          case 'subtotal':
            return subtotal;
          case 'total_amount':
            return total;
          case 'item_count':
            return totalQty;
          case 'items_summary':
            return sanitizeCell(itemsSummary);
          case 'items_json':
            return sanitizeCell(itemsJson);
          case 'submission_id':
            return sanitizeCell(submission_id);
          default:
            return '';
        }
      });

      // Append row to Google Sheets
      await appendSheetValues(sheetId, "'New Sale Request'!A2", [rowData]);

      const whatsappMessage = buildOrderMessage({
        referenceId: assignedReferenceId,
        customer: customerDetails,
        items: verifiedItems,
        deliveryOptionName,
        deliveryCharge,
        subtotal,
        total,
        date: now,
      });

      return {
        referenceId: assignedReferenceId,
        whatsappUrl: buildWhatsAppUrl(whatsappMessage),
        subtotal,
        deliveryCharge,
        total,
        idempotent: false,
      };
    })();

    // 8-second timeout racer
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Google Sheets write timed out after 8s')), 8000)
    );

    try {
      const orderResult = await Promise.race([sheetsPromise, timeoutPromise]);
      const latencyMs = Date.now() - startTime;
      console.info(`[Order API] Success: ${orderResult.referenceId} created in ${latencyMs}ms`);

      return NextResponse.json({
        success: true,
        referenceId: orderResult.referenceId,
        whatsappUrl: orderResult.whatsappUrl,
        subtotal: orderResult.subtotal,
        deliveryCharge: orderResult.deliveryCharge,
        total: orderResult.total,
        latencyMs,
      });
    } catch (sheetError) {
      // Offline fallback path
      console.warn('[Order API] Sheets unreachable/timeout, initiating offline fallback:', (sheetError as Error).message);

      const offlineRefId = generateOfflineReferenceId();
      const offlineWhatsappMessage = buildOrderMessage({
        referenceId: offlineRefId,
        customer: customerDetails,
        items: verifiedItems,
        deliveryOptionName,
        deliveryCharge,
        subtotal,
        total,
        date: now,
        isOfflineFallback: true,
      });

      return NextResponse.json({
        success: true,
        referenceId: offlineRefId,
        whatsappUrl: buildWhatsAppUrl(offlineWhatsappMessage),
        subtotal,
        deliveryCharge,
        total,
        isOffline: true,
        message: 'Order placed via offline fallback.',
      });
    }
  } catch (err) {
    console.error('[Order API] Unhandled server error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred while processing your order. Please try again.' },
      { status: 500 }
    );
  }
}
