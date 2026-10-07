// =============================================================================
// Site & Brand Configuration — /src/config/site.ts
// Single source of truth for brand metadata, defaults, and static content.
// =============================================================================

import type { FilterState, WalkthroughSlide } from '@/types';
import { getSiteUrl } from '@/lib/siteUrl';

export const BRAND = {
  name: 'Ficcado',
  tagline: 'High Quality Unisex Wears',
  logo: '/images/brand_logo/Ficcado Brand Logo.jpeg',
  description:
    'Ficcado crafts signature high quality unisex streetwear with 230 GSM combed cotton. Direct WhatsApp ordering and verified pan-India dispatch.',
  get url() {
    return getSiteUrl();
  },
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
  'Echoes of the Empire',
  'Frame The Bloom',
  'Silent Sentinel',
  'The Watchers',
  '230 GSM Cotton',
  'Oversized Drop',
];

export const WALKTHROUGH_DATA: WalkthroughSlide[] = [
  {
    title: 'Ficcado T-Shirt Drops',
    subtitle:
      'Explore curated high quality unisex t-shirts today with signature architectural drapes and premium comfort.',
    img: '/images/walkthrough/ficcado_walkthrough_1.jpg',
  },
  {
    title: 'Engineered For Contemporary Living',
    subtitle:
      'Premium high quality 230 GSM cotton, precision tailored silhouettes, and unisex comfort crafted for longevity.',
    img: '/images/walkthrough/ficcado_walkthrough_2.jpg',
  },
  {
    title: 'Direct WhatsApp Ordering',
    subtitle:
      'Browse our drops, configure your bag, and connect directly with our team on WhatsApp for sizing care and fulfillment.',
    img: '/images/walkthrough/ficcado_walkthrough_3.jpg',
  },
];
