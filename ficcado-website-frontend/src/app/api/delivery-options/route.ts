import { NextResponse } from 'next/server';
import { getCourierPartners } from '@/lib/couriers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const options = await getCourierPartners();
    return NextResponse.json(
      { ok: true, options },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    );
  } catch {
    return NextResponse.json(
      { ok: false, options: [], error: 'Failed to fetch delivery options' },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  }
}
