import type { NextConfig } from "next";
import path from "path";

// =============================================================================
// Production Safeguards — Section R1.4
// Validates essential environment configurations during production build.
// =============================================================================
const isProd = process.env.NODE_ENV === 'production';
const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

if (isProd) {
  // 1. WhatsApp Number Validation
  if (!whatsappNumber || typeof whatsappNumber !== 'string') {
    throw new Error(
      '[CRITICAL BUILD ERROR] NEXT_PUBLIC_WHATSAPP_NUMBER is required for production builds.'
    );
  }
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
  if (!/^\d{10,15}$/.test(cleanNumber)) {
    throw new Error(
      `[CRITICAL BUILD ERROR] NEXT_PUBLIC_WHATSAPP_NUMBER ("${whatsappNumber}") must contain international digits only (e.g. 919497144795).`
    );
  }
  const dummyPatterns = [
    '919876543210',
    '9876543210',
    '911234567890',
    '1234567890',
    '0000000000',
    '910000000000',
  ];
  if (dummyPatterns.includes(cleanNumber)) {
    throw new Error(
      `[CRITICAL BUILD ERROR] NEXT_PUBLIC_WHATSAPP_NUMBER matches a known dummy placeholder: "${cleanNumber}". Use a real business phone number.`
    );
  }

  // 2. Site URL Validation
  if (!siteUrl || typeof siteUrl !== 'string' || !siteUrl.startsWith('https://')) {
    throw new Error(
      `[CRITICAL BUILD ERROR] NEXT_PUBLIC_SITE_URL is required and must begin with "https://" in production (got: "${siteUrl}").`
    );
  }
}

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [320, 375, 390, 412, 430, 640, 768, 820, 1024, 1280, 1536, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  async redirects() {
    return [
      {
        source: '/orders/:path*',
        destination: '/support',
        permanent: true,
      },
      {
        source: '/orders',
        destination: '/support',
        permanent: true,
      },
      {
        source: '/track-order',
        destination: '/support',
        permanent: true,
      },
      {
        source: '/favorites',
        destination: '/',
        permanent: true,
      },
      {
        source: '/saved',
        destination: '/',
        permanent: true,
      },
      {
        source: '/auth/:path*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/auth',
        destination: '/',
        permanent: true,
      },
      {
        source: '/men/:path*',
        destination: '/categories',
        permanent: true,
      },
      {
        source: '/men',
        destination: '/categories',
        permanent: true,
      },
      {
        source: '/women/:path*',
        destination: '/categories',
        permanent: true,
      },
      {
        source: '/women',
        destination: '/categories',
        permanent: true,
      },
      {
        source: '/kids/:path*',
        destination: '/categories',
        permanent: true,
      },
      {
        source: '/kids',
        destination: '/categories',
        permanent: true,
      },
      {
        source: '/boys/:path*',
        destination: '/categories',
        permanent: true,
      },
      {
        source: '/boys',
        destination: '/categories',
        permanent: true,
      },
      {
        source: '/girls/:path*',
        destination: '/categories',
        permanent: true,
      },
      {
        source: '/girls',
        destination: '/categories',
        permanent: true,
      },
      {
        source: '/blob/:path*',
        destination: '/journal',
        permanent: true,
      },
      {
        source: '/blob',
        destination: '/journal',
        permanent: true,
      },
      {
        source: '/blog/:path*',
        destination: '/journal',
        permanent: true,
      },
      {
        source: '/blog',
        destination: '/journal',
        permanent: true,
      },
      {
        source: '/accessories/:path*',
        destination: '/categories',
        permanent: true,
      },
      {
        source: '/accessories',
        destination: '/categories',
        permanent: true,
      },
      {
        source: '/collections/:path*',
        destination: '/categories',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
