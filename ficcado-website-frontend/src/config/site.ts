// =============================================================================
// Site & Brand Configuration — /src/config/site.ts
// Single source of truth for brand metadata, defaults, and static content.
// =============================================================================

import type { FilterState, WalkthroughSlide } from '@/types';

export const BRAND = {
  name: 'Ficcado',
  tagline: 'Heavyweight T-Shirts (All Wears in Future)',
  description:
    'Ficcado sells signature heavyweight T-shirts now. All other apparel categories and wears will be available in future drops.',
  support: 'support@ficcado.store',
  phone: '+91 94971 44795',
  whatsapp: '919497144795',
  instagram: 'https://instagram.com/ficcado.store',
};

export const DEFAULT_FILTER_STATE: FilterState = {
  priceRange: [1000, 5000],
  categories: [],
  sizes: [],
  colors: [],
  inStockOnly: false,
  sortBy: 'featured',
};

export const TRENDING_TAGS: string[] = [
  'Heavyweight T-Shirt',
  'Oversized Drop',
  'Upcoming Combos',
  'Boxy Fit',
  'Combed Cotton',
  'Citrus Tee',
];

export const WALKTHROUGH_DATA: WalkthroughSlide[] = [
  {
    title: 'Ficcado T-Shirt Drops',
    subtitle:
      'Explore curated heavyweight unisex t-shirts today. All other apparel silhouettes and wears will be available in future drops.',
    img: '/assets/ficcado_walkthrough_1.jpg',
  },
  {
    title: 'Engineered For Contemporary Living',
    subtitle:
      'Premium heavyweight cotton, precision tailored silhouettes, and unisex comfort crafted for longevity.',
    img: '/assets/ficcado_walkthrough_2.jpg',
  },
  {
    title: 'Direct WhatsApp Ordering',
    subtitle:
      'Browse our drops, configure your bag, and connect directly with our team on WhatsApp for sizing care and fulfillment.',
    img: '/assets/ficcado_walkthrough_3.jpg',
  },
];
