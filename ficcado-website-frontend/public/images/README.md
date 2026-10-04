# Ficcado Storefront — Asset & Image Structure Guide

This directory holds all static and product image assets for the Ficcado web application.

## Directory Structure

```text
public/
  images/
    brand/            # Logo, favicon sources, and Open Graph share cards
    hero/             # Responsive homepage campaign drops & banners
    products/         # Product-specific folders keyed by product slug
      <product-slug>/ # e.g. colorado-heavyweight-tee/
        main.webp     # Main hero display image
        flat.webp     # Flat lay thumbnail for shopping bag & invoices
        alt-1.webp    # Detail angles / model styling
        alt-2.webp
    categories/       # Category directory preview tiles (6 silhouettes)
    placeholders/     # Shared neutral fallback SVG/WebP and blurDataURLs
```

## Naming & Formatting Rules
1. **Lower-case kebab-case only**:
   - Correct: `colorado-heavyweight-tee/main.webp`, `categories/t-shirts.jpg`
   - Incorrect: `Colorado Heavyweight Tee/Main.JPEG`
2. **Standardized Dimensions**:
   - Product Main: `1200 x 1600 px` (Aspect ratio: `3:4`)
   - Product Flat Thumbnail: `600 x 600 px` (Aspect ratio: `1:1`)
   - Hero Banners: `1920 x 800 px` (Desktop), `750 x 500 px` (Mobile)
   - Category Cards: `600 x 800 px` (Aspect ratio: `3:4`)
3. **Format & Budgets**:
   - Preferred Format: **WebP** / **AVIF**
   - Max file size for Product Main: `< 180 KB`
   - Max file size for Product Thumbnail: `< 60 KB`
   - Max file size for Hero Banners: `< 250 KB`

## Image Optimization Script
To batch optimize newly added source images:
```bash
npm run optimize:images
```
This script reads source images, converts them to WebP, strips metadata, and ensures dimension limits.
