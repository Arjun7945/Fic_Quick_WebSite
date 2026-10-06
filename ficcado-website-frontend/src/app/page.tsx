// =============================================================================
// Home Storefront — /
// Server Component: fetches live catalog from Google Sheets 'Item Management' in real-time
// =============================================================================

import { getProducts } from '@/lib/products';
import { HomeView } from '@/components/home/HomeView';

export const revalidate = 60;

export default async function HomePage() {
  const products = await getProducts();
  return <HomeView initialProducts={products} />;
}
