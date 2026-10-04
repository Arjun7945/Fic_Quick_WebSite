import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

// Contexts
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/context/ToastContext';
import { ModalProvider } from '@/context/ModalContext';
import { ViewportProvider } from '@/context/ViewportContext';

// Shell
import { AppShell } from '@/components/layout/AppShell';

// ---------------------------------------------------------------------------
// Font — Plus Jakarta Sans
// ---------------------------------------------------------------------------
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-plus-jakarta',
  display: 'swap',
  preload: true,
});

// ---------------------------------------------------------------------------
// SEO Metadata (Unisex, WhatsApp Ordering)
// ---------------------------------------------------------------------------
export const metadata: Metadata = {
  title: {
    default: 'Ficcado Clothings — Heavyweight T-Shirts (All Wears in Future)',
    template: '%s | Ficcado Clothings',
  },
  description:
    'Ficcado sells signature heavyweight T-shirts now. All other apparel wears will be available in future drops. Direct WhatsApp ordering and verified pan-India dispatch.',
  keywords: [
    'Ficcado',
    'heavyweight t-shirts',
    'unisex t-shirts',
    '380 gsm cotton',
    'future wears',
    'combos coming soon',
    'hoodies coming soon',
    'limited drops',
  ],
  authors: [{ name: 'Ficcado Clothings', url: 'https://www.ficcado.store' }],
  creator: 'Ficcado Clothings',
  metadataBase: new URL('https://www.ficcado.store'),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.ficcado.store',
    siteName: 'Ficcado Clothings',
    title: 'Ficcado Clothings — Heavyweight T-Shirts (All Wears in Future)',
    description:
      'Ficcado sells signature heavyweight T-shirts now. All other apparel wears will be available in future drops. Direct WhatsApp ordering from Ficcado Clothings.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ficcado Clothings — Heavyweight T-Shirts',
    description: 'Ficcado sells T-shirts now. All other wears coming in future drops.',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#2B62C6',
};

// ---------------------------------------------------------------------------
// Root Layout
// ---------------------------------------------------------------------------
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${plusJakartaSans.variable} h-full`}
    >
      <head>
        <meta charSet="utf-8" />
      </head>
      <body className="min-h-full bg-[var(--bg-page)] antialiased">
        <ViewportProvider>
          <ToastProvider>
            <CartProvider>
              <ModalProvider>
                <AppShell>{children}</AppShell>
              </ModalProvider>
            </CartProvider>
          </ToastProvider>
        </ViewportProvider>
      </body>
    </html>
  );
}
