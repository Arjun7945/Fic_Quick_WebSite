import type { MetadataRoute } from 'next';
import { CATEGORIES_CONFIG } from '@/config/categories';
import { getSiteUrl } from '@/lib/siteUrl';

// =============================================================================
// Dynamic Sitemap Generator — /sitemap.xml
// Indexing home, all category drops, policy pages, FAQ, and journal.
// Excludes private internal routes.
// =============================================================================

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  // 1. Root & Core Directory
  const coreRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/categories`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // 2. All Category Sections per Owner Instruction
  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES_CONFIG.map((cat) => ({
    url: `${siteUrl}/categories/${cat.slug}`,
    changeFrequency: 'weekly',
    priority: cat.status === 'live' ? 0.9 : 0.6,
  }));

  // 3. Static Institutional & Knowledge Pages
  const staticPages = [
    '/about',
    '/faq',
    '/support',
    '/journal',
    '/search',
    '/shipping-delivery',
    '/returns-refunds',
    '/replacements-damages',
    '/privacy',
    '/terms',
  ];

  const institutionalRoutes: MetadataRoute.Sitemap = staticPages.map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: 'monthly',
    priority: path === '/faq' || path === '/about' ? 0.7 : 0.5,
  }));

  return [...coreRoutes, ...categoryRoutes, ...institutionalRoutes];
}
