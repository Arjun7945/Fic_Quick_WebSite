import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/products';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json(products, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
  } catch (err) {
    console.error('[GET /api/products] Error fetching products:', err);
    return NextResponse.json([], {
      status: 500,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    });
  }
}
