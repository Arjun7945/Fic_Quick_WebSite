// =============================================================================
// Ficcado Clothings — Color Utilities & Human-Readable Mapping
// Maps hex color codes and keywords to customer-facing human colorway names.
// =============================================================================

export const COLOR_NAME_MAP: Record<string, string> = {
  '#111827': 'Black',
  '#000000': 'Black',
  '#ffffff': 'White',
  '#fff': 'White',
  '#7b1113': 'Maroon',
  '#d4c4a8': 'Beige',
  '#99badd': 'Air Blue',
  '#1e3a8a': 'Blue',
  '#1d4ed8': 'Blue',
  '#2563eb': 'Royal Blue',
  '#3b82f6': 'Blue',
  '#dc2626': 'Red',
  '#b91c1c': 'Red',
  '#15803d': 'Green',
  '#166534': 'Green',
  '#1b4332': 'Green',
  '#10b981': 'Emerald Green',
  '#6b7280': 'Grey',
  '#9ca3af': 'Light Grey',
};

/**
 * Returns a clean, human-readable color name (e.g. "White", "Black", "Air Blue", "Beige", "Maroon", "Red", "Green", "Blue").
 * Eliminates confusion across the Bag drawer, Checkout order summary, and WhatsApp order messages.
 */
export function getColorName(colorVal?: string | null): string {
  if (!colorVal) return 'Standard';
  const clean = colorVal.trim();
  const lower = clean.toLowerCase();

  // Exact hex lookup
  if (COLOR_NAME_MAP[lower]) {
    return COLOR_NAME_MAP[lower];
  }

  // Keyword-based lookup
  if (lower.includes('maroon') || lower === '#7b1113') return 'Maroon';
  if (lower.includes('beige') || lower === '#d4c4a8') return 'Beige';
  if (lower.includes('air') && lower.includes('blue')) return 'Air Blue';
  if (lower.includes('blue') || lower === '#99badd' || lower === '#1e3a8a' || lower === '#1d4ed8') return 'Blue';
  if (lower.includes('red') || lower === '#dc2626' || lower === '#b91c1c') return 'Red';
  if (lower.includes('green') || lower === '#15803d' || lower === '#166534' || lower === '#1b4332') return 'Green';
  if (lower.includes('black') || lower === '#111827' || lower === '#000000') return 'Black';
  if (lower.includes('white') || lower === '#ffffff' || lower === '#fff') return 'White';

  // If a known non-hex name was passed
  if (!clean.startsWith('#')) {
    return clean
      .split(/[\s-_]+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  // Fallback uppercase hex
  return clean.toUpperCase();
}

/**
 * Helper to get keyword used in item image file naming (e.g. 'air-blue', 'white', 'black', 'maroon', 'beige', 'red', 'green', 'blue')
 */
export function getColorKeyword(colorVal?: string | null): string | null {
  if (!colorVal) return null;
  const lower = colorVal.toLowerCase();
  if (lower === '#111827' || lower.includes('black')) return 'black';
  if (lower === '#ffffff' || lower.includes('white')) return 'white';
  if (lower === '#7b1113' || lower.includes('maroon')) return 'maroon';
  if (lower === '#d4c4a8' || lower.includes('beige')) return 'beige';
  if (lower === '#dc2626' || lower === '#b91c1c' || lower.includes('red')) return 'red';
  if (lower === '#15803d' || lower === '#166534' || lower === '#1b4332' || lower.includes('green')) return 'green';
  if (lower === '#99badd' || lower === '#1e3a8a' || lower === '#1d4ed8' || lower.includes('blue') || lower.includes('air')) return 'blue';
  return null;
}
