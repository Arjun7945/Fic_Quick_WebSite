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
    default: 'Ficcado Clothings',
    template: 'Ficcado Clothings | %s',
  },
  description:
    'Ficcado crafts signature high quality unisex streetwear with 230 GSM combed cotton. Direct WhatsApp ordering and verified pan-India dispatch.',
  keywords: [
    'Ficcado',
    'high quality t-shirts',
    'unisex t-shirts',
    '230 gsm cotton',
    'streetwear',
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
    title: 'Ficcado Clothings',
    description:
      'Ficcado crafts signature high quality unisex streetwear with 230 GSM combed cotton. Direct WhatsApp ordering from Ficcado Clothings.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ficcado Clothings',
    description: 'Ficcado crafts signature high quality unisex streetwear with 230 GSM combed cotton.',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/images/brand_logo/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/brand_logo/favicon-rounded.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/images/brand_logo/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
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
      suppressHydrationWarning
    >
      <head>
        <meta charSet="utf-8" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
              try {
                var search = window.location.search || '';
                var ua = navigator.userAgent || '';
                var platform = navigator.platform || '';

                // Explicit Android detection — ensure clearance is always 0px on Android
                var isAndroid = /Android/i.test(ua) || search.indexOf('_mvua=mv-android') !== -1;
                if (isAndroid) {
                  document.documentElement.classList.remove('is-ios');
                  document.documentElement.removeAttribute('data-platform');
                  document.documentElement.style.setProperty('--ios-bottom-bar-clearance', '0px');
                  try { sessionStorage.removeItem('fc_is_ios'); } catch(e){}
                  return;
                }

                // iOS detection: real iPhones/iPads, simulator extensions, and Mac touch
                var isIOS = /iPad|iPhone|iPod/i.test(ua) || 
                            (platform === 'MacIntel' && navigator.maxTouchPoints > 1) ||
                            search.indexOf('_mvua=mv-ios') !== -1 ||
                            (window.name && /iphone|ios|ipad/i.test(window.name)) ||
                            (function(){ try { return sessionStorage.getItem('fc_is_ios') === '1'; } catch(e){ return false; } })();

                if (isIOS) {
                  document.documentElement.classList.add('is-ios');
                  document.documentElement.setAttribute('data-platform', 'ios');
                  document.documentElement.style.setProperty('--ios-bottom-bar-clearance', '5.5rem');
                  try { sessionStorage.setItem('fc_is_ios', '1'); } catch(e){}
                }
              } catch(e) {}
            })();`,
          }}
        />
      </head>
      <body className="min-h-full bg-[var(--bg-page)] antialiased" suppressHydrationWarning>
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
