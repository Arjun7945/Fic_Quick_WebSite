// =============================================================================
// Ficcado Special Drops Helper — /src/lib/specialDrops.ts
// Identifies exclusive special release drops (Ronaldo & Messi Legend Oversized tees)
// =============================================================================

export const SPECIAL_DROP_SLUGS = new Set([
  'ficcado-ronaldo-legend-oversized-t-shirt',
  'ficcado-messi-legend-oversized-t-shirt',
]);

export const SPECIAL_DROP_TAG = 'Ficcado Special Drops';

export function isSpecialDrop(
  productOrName?: { name?: string; slug?: string } | string | null
): boolean {
  if (!productOrName) return false;

  if (typeof productOrName === 'string') {
    const clean = productOrName.trim().toLowerCase();
    if (SPECIAL_DROP_SLUGS.has(clean)) return true;
    return (
      (clean.includes('ronaldo') && clean.includes('legend')) ||
      (clean.includes('messi') && clean.includes('legend'))
    );
  }

  const slug = (productOrName.slug || '').toLowerCase();
  if (SPECIAL_DROP_SLUGS.has(slug)) return true;

  const name = (productOrName.name || '').toLowerCase();
  return (
    (name.includes('ronaldo') && name.includes('legend')) ||
    (name.includes('messi') && name.includes('legend'))
  );
}
