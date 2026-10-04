// =============================================================================
// Inquiries & Order Support API Route Handler — /api/inquiry
// Appends inquiries, contact tickets, and order support requests to Google Sheets
// 'Support Requests' tab with anti-injection sanitization.
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { isValidAnyOrderId, normalizeOrderId } from '@/lib/referenceId';
import { appendSheetValues, sanitizeCell } from '@/lib/sheets/client';
import { formatISTDate } from '@/lib/whatsapp';

// Request Validation Schema
const InquiryInputSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().trim().email('Please enter a valid email address'),
  phone: z.string().trim().max(25).optional().default(''),
  type: z.enum(['contact', 'product-inquiry', 'order-support', 'complaints', 'issue-on-app', 'other']),
  orderId: z.string().trim().max(35).optional().default(''),
  category: z.string().trim().max(50).optional().default('general'),
  message: z.string().trim().min(5, 'Message must be at least 5 characters').max(2000),
  sourcePage: z.string().trim().max(100).optional().default('/support'),
  // Honeypot field (hidden from genuine users)
  botHp: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Honeypot trap check
    if (body.botHp && body.botHp.trim().length > 0) {
      return NextResponse.json({
        success: true,
        inquiryId: `FIC-INQ-${Date.now().toString().slice(-5)}`,
      });
    }

    // 2. Schema validation
    const parsed = InquiryInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid submission data', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // 3. Validate Order ID if type is order-support
    let normalizedOrderId = '';
    if (data.type === 'order-support' || data.orderId) {
      if (data.orderId) {
        if (!isValidAnyOrderId(data.orderId)) {
          return NextResponse.json(
            { error: 'Please enter a valid Reference ID (starts with FIC-) or final Order ID' },
            { status: 400 }
          );
        }
        normalizedOrderId = normalizeOrderId(data.orderId);
      }
    }

    // 4. Generate Server-Side Ticket ID
    const randomTicketSuffix = Math.floor(10000 + Math.random() * 90000);
    const inquiryId = `FIC-INQ-${new Date().getFullYear()}-${randomTicketSuffix}`;
    const timestampIST = formatISTDate(new Date());

    // 5. Append directly to Google Sheets 'Support Requests' tab
    const sheetId = process.env.GOOGLE_SHEET_ID;
    if (sheetId) {
      try {
        const rowData = [
          sanitizeCell(timestampIST),
          sanitizeCell(inquiryId),
          sanitizeCell(data.type),
          sanitizeCell(normalizedOrderId),
          sanitizeCell(data.name),
          sanitizeCell(data.email),
          sanitizeCell(data.phone || ''),
          sanitizeCell(data.category || data.type),
          sanitizeCell(data.message),
          sanitizeCell('NEW'),
        ];

        await appendSheetValues(sheetId, "'Support Requests'!A2", [rowData]);
      } catch (sheetErr) {
        console.warn('[Support API] Failed to append to Support Requests sheet:', (sheetErr as Error).message);
      }
    }

    return NextResponse.json({
      success: true,
      inquiryId,
      message: 'Support request received successfully.',
    });
  } catch (err) {
    console.error('[Support API] Server error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please reach out via WhatsApp.' },
      { status: 500 }
    );
  }
}
