'use client';

// =============================================================================
// RouteTitleSync — Client-side Navigation Tab Title Synchronizer
// Enforces the standard:
// - Home: "Ficcado Clothings"
// - All other routes/sections: "Ficcado Clothings | [Page Name]"
// =============================================================================

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const ROUTE_TITLES: Record<string, string> = {
  '/': 'Ficcado Clothings',
  '/support': 'Ficcado Clothings | Support',
  '/faq': "Ficcado Clothings | FAQ's",
  '/about': 'Ficcado Clothings | About Us',
  '/journal': 'Ficcado Clothings | Journal',
  '/blob': 'Ficcado Clothings | Journal',
  '/blog': 'Ficcado Clothings | Journal',
  '/settings': 'Ficcado Clothings | Settings',
  '/search': 'Ficcado Clothings | Search',
  '/categories': 'Ficcado Clothings | Categories',
  '/categories/t-shirts': 'Ficcado Clothings | High Quality T-Shirts',
  '/categories/combos': 'Ficcado Clothings | Streetwear Combos',
  '/checkout': 'Ficcado Clothings | Checkout',
  '/checkout/whatsapp-continue': 'Ficcado Clothings | WhatsApp Continue',
  '/terms': 'Ficcado Clothings | Terms & Conditions',
  '/privacy': 'Ficcado Clothings | Privacy Policy',
  '/shipping-delivery': 'Ficcado Clothings | Shipping & Delivery',
  '/returns-refunds': 'Ficcado Clothings | Returns & Refunds',
  '/replacements-damages': 'Ficcado Clothings | Replacements & Damages',
  '/onboarding': 'Ficcado Clothings | Welcome',
};

export function RouteTitleSync() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    if (ROUTE_TITLES[pathname]) {
      document.title = ROUTE_TITLES[pathname];
      return;
    }

    if (pathname.startsWith('/categories/')) {
      const slug = pathname.replace('/categories/', '');
      const formatted = slug
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      document.title = `Ficcado Clothings | ${formatted}`;
      return;
    }

    const segment = pathname.split('/').filter(Boolean).pop();
    if (segment) {
      const formatted = segment
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      document.title = `Ficcado Clothings | ${formatted}`;
    } else {
      document.title = 'Ficcado Clothings';
    }
  }, [pathname]);

  return null;
}
