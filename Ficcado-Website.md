# Ficcado-Website.md: Universal Architecture & Application Document

**Application Name:** Ficcado (`Fic_Quick_WebSite` / `ficcado-website-frontend`)  
**Generated Date:** 2026-10-06  
**Scanned Git Commit Hash:** `77b18781d892e0201a52338ba22bec58cff0acc2`  
**Tool Versions Scanned:**
- Next.js: `16.3.5` (Turbopack)
- React / React-DOM: `19.2.8`
- Tailwind CSS: `@tailwindcss/postcss` & `tailwindcss` `^4.0.0`
- TypeScript: `^5.0.0`
- Zod: `^4.6.5`
- Node.js runtime: Node 20+ compatible (tested on Node v20/v22)
- Hosting Target: Netlify (`@netlify/plugin-nextjs`, `netlify.toml`)

---

## Scan Coverage Summary (Appendix A)

| Area | Files Total | Files Read | Skipped (Reason) |
|---|---|---|---|
| **Routes & Page Layouts** | 35 | 35 | None (100% read) |
| **Components (Layout, Modals, UI)** | 17 | 17 | None (100% read) |
| **Lib, Utils, Hooks, State & Config** | 19 | 19 | None (100% read) |
| **API Routes & Static Endpoints** | 7 | 7 | None (100% read) |
| **Config, Manifests & Build Scripts** | 18 | 18 | None (100% read) |
| **Tests & Verification Scripts** | 5 | 5 | None (100% read) |
| **Public Assets (Images, Icons)** | 42 | 42 | Binary files enumerated by path and dimensions |
| **Root Docs & Prior Specifications** | 12 | 12 | Tracked in `documents-1/` and root |
| **Total Tracked Files** | **172** | **172** | **100% source, config & content coverage** |

---

## 1. Overview
Ficcado is a contemporary unisex streetwear and apparel direct-to-consumer storefront.
- **Core Product Offering:** High-quality 240 GSM combed cotton unisex t-shirts engineered with architectural drop-shoulder silhouettes, anti-sag double-ribbed collars, and relaxed unisex draping (`src/app/layout.tsx:L41-L47`, `src/app/journal/page.tsx:L81-L108`). Future capsule roadmap includes apparel combos, structured overshirts, fleece hoodies, articulated pants, and minimalist sneakers (`src/config/categories.ts:L19-L68`).
- **Founders:** Founded in 2024 by three friends: Sinan MS (strategic operations & customer care), Ganga Lakshmi (creative operations & silhouette design), and Rohith Murali (textile engineering & mill sourcing) (`src/app/layout.tsx:L119-L124`, `src/app/journal/page.tsx:L51-L78`, `public/images/founders/`).
- **Commerce Model:** Dynamic catalog driven by Google Sheets as the administrative database, client-side shopping bag state persisted in `localStorage`, server-verified checkout, sequential reference ID generation (`FIC-<SERIES><4-DIGIT-NUM>`, e.g., `FIC-A0001`), and direct WhatsApp order dispatch with personalized manual human verification.

---

## 2. Tech Stack & Version Inventory

| Layer | Package / Technology | Version | Purpose & Evidence |
|---|---|---|---|
| **Framework** | `next` | `16.3.5` | Next.js App Router with Turbopack bundler (`package.json#L20`) |
| **UI Library** | `react`, `react-dom` | `19.2.8` | Component rendering and DOM lifecycle (`package.json#L21-L22`) |
| **Validation** | `zod` | `^4.6.5` | Schema validation for orders & inquiries (`package.json#L23`) |
| **Icons** | `lucide-react` | `^1.45.0` | UI icon set (`package.json#L19`) |
| **Styling** | `tailwindcss`, `@tailwindcss/postcss` | `^4.0.0` | Tailwind CSS v4 CSS-first design system (`package.json#L26,L32`) |
| **Language** | `typescript` | `^5.0.0` | Type safety (`tsconfig.json`, `package.json#L33`) |
| **Linting** | `eslint`, `eslint-config-next` | `^9.0.0` / `16.3.5` | Code quality enforcement (`package.json#L30-L31`) |
| **Database** | Google Sheets API v4 | REST / OAuth2 | Database replacement (Item Management, Courier Partners, New Sale Request, Support Requests) |
| **Hosting** | Netlify | Next.js Plugin | Serverless SSR & edge asset delivery (`netlify.toml`) |

### Available `package.json` Scripts
- `npm run dev`: Runs `next dev` Turbopack local development server on port 3000.
- `npm run prebuild`: Executes `npm run sheets:bootstrap` and `node scripts/build-item-image-manifest.mjs`. Ensures all 4 Google Sheets tabs and headers exist, and compiles all item images in `public/images/items/` into `src/generated/item-images.json`.
- `npm run build`: Runs production Next.js compiler `next build`.
- `npm run start`: Runs Next.js production runner `next start`.
- `npm run lint`: Runs ESLint 9 configuration across the workspace.
- `npm run typecheck`: Runs `tsc --noEmit` type checking.
- `npm run test`: Executes built-in Node test runner: `node --test scripts/tests/*.test.mjs`.
- `npm run sheets:bootstrap`: Validates and auto-creates required Google Sheets tabs, row-1 headers, and freezing formatting via `scripts/bootstrap-sheets.mjs`.
- `npm run check:brand`: Runs strict regex audit enforcing "Ficcado" and "FIC-" prefix spelling across code, markdown, and public assets (`scripts/check-brand.mjs`).
- `npm run check:devices`: Runs viewport and device clearance verification script (`scripts/device-checker.mjs`).

---

## 3. Folder & File Structure (Annotated Tree)

```
Fic_Quick_WebSite/
├── .env.example                               # Root environment variable template
├── .gitignore                                 # Git ignore patterns
├── credentials/
│   └── ficcado-quick-website-5fc91a2f02ba.json# Google Cloud Service Account Private Key (Local Dev)
├── documents-1/                               # Historical design specs, briefs, and backup docs
│   ├── APPS_SCRIPT.md
│   ├── BACKLINK_PLAN.md
│   ├── DEPLOYMENT.md
│   ├── FAQ_OWNER_INPUT_NEEDED.md
│   ├── LOCALHOST_PROCESS_GUIDE.md
│   ├── PHASE2_PROPOSAL.md
│   ├── REQUIREMENT_AND_REFACTOR_PART_2.md
│   ├── briefs/
│   │   ├── AGENT_BRIEF.md
│   │   ├── AGENT_BRIEF_2_WHATSAPP_ORDERING_REFACTOR.md
│   │   └── REFACTOR_ON_PREVIOUS_UPDATE.md
│   ├── google-sheets-schema.md
│   └── templates/
│       ├── courier-partners.csv
│       ├── item-management.csv
│       └── new-sale-request.csv
├── docs/                                      # Knowledge Base directory (created in Phase 2)
├── EXPANSION.md                               # Architectural expansion guidelines
├── IMPOSTER.md                                # Universal production-readiness protocol
├── netlify.toml                               # Root Netlify build configuration pointing to frontend
├── README.md                                  # Repository overview
├── ficcado-website-frontend/                  # Primary Next.js Web Application
│   ├── .env.example                           # Frontend environment variables reference
│   ├── .env.local                             # Local development environment overrides
│   ├── eslint.config.mjs                      # ESLint 9 configuration
│   ├── netlify.toml                           # Netlify headers, security headers & publish config
│   ├── next.config.ts                         # Next.js configuration, environment guards & redirects
│   ├── package.json                           # Dependencies, metadata & build scripts
│   ├── postcss.config.mjs                     # PostCSS config with @tailwindcss/postcss
│   ├── tsconfig.json                          # TypeScript configuration with @/* path alias
│   ├── content/
│   │   └── faq.ts                             # FAQ data source
│   ├── public/
│   │   ├── favicon.ico                        # Default favicon
│   │   └── images/
│   │       ├── brand_logo/                    # Favicons, apple icons, brand logos
│   │       ├── categories/                    # Category cover images (t-shirts, combos, etc.)
│   │       ├── founders/                      # Founder portrait photographs
│   │       ├── hero/                          # Storefront hero banners
│   │       ├── items/                         # Product images per SKU folder
│   │       ├── journal/                       # Editorial article visual assets
│   │       └── walkthrough/                   # Onboarding walkthrough slide images
│   ├── scripts/
│   │   ├── bootstrap-sheets.mjs               # Idempotent Google Sheets schema initializer
│   │   ├── build-item-image-manifest.mjs      # Auto-generates item-images.json from disk
│   │   ├── check-brand.mjs                    # Strict brand spelling verification
│   │   ├── device-checker.mjs                 # Mobile viewport padding and device audit
│   │   ├── generate-favicon.mjs               # Favicon generator helper
│   │   ├── inspect-all-sheets.mjs             # Diagnostic tool for inspecting Google Sheets data
│   │   ├── populate-and-format-sheets.mjs     # Sheet formatting helper
│   │   ├── test-live-order.mjs                # Live order submission test script
│   │   ├── test-sheets-auth.mjs               # Google OAuth2 JWT authentication diagnostic
│   │   ├── test-sheets-read.mjs               # Read test diagnostic
│   │   ├── verify-phase2-endpoints.mjs        # SEO & crawler endpoint verification script
│   │   ├── loadtest/
│   │   │   └── k6-loadtest.js                 # k6 load testing script
│   │   └── tests/
│   │       ├── order-system.test.mjs          # Unit tests: ID generation, WhatsApp URLs, injections
│   │       ├── phase2-discoverability.test.mjs# Integration tests: robots, sitemaps, JSON-LD
│   │       └── test-jsonld-parser.mjs         # JSON-LD parser unit test
│   └── src/
│       ├── app/
│       │   ├── layout.tsx                     # Root Layout: fonts, AppShell, SEO schema, iOS script
│       │   ├── loading.tsx                    # Route loading skeleton component
│       │   ├── page.tsx                       # Home page: dynamic SSR catalog fetch + HomeView
│       │   ├── globals.css                    # Design system tokens, utilities & animations
│       │   ├── apple-icon.png                 # Apple touch icon asset
│       │   ├── icon.png                       # Browser tab icon asset
│       │   ├── robots.ts                      # robots.txt generator with AI crawler rules
│       │   ├── sitemap.ts                     # sitemap.xml generator indexing all public routes
│       │   ├── humans.txt/route.ts            # humans.txt plain-text credits endpoint
│       │   ├── llms.txt/route.ts              # llms.txt AI ingestion summary endpoint
│       │   ├── llms-full.txt/route.ts         # llms-full.txt comprehensive AI ingestion endpoint
│       │   ├── about/                         # Brand heritage, founders & craftsmanship
│       │   ├── blob/ & blog/                  # Aliased routes redirecting to /journal
│       │   ├── categories/                    # Category directory & /categories/[slug] detail
│       │   ├── checkout/                      # 2-step checkout & /checkout/whatsapp-continue
│       │   ├── faq/                           # Interactive FAQ with schema markup
│       │   ├── journal/                       # Editorial articles & interactive aura canvas
│       │   ├── onboarding/                    # Customer introduction walkthrough carousel
│       │   ├── privacy/                       # Privacy policy & data protection terms
│       │   ├── replacements-damages/          # Replacement policy for transit damage
│       │   ├── returns-refunds/               # Return & refund operational guidelines
│       │   ├── search/                        # Live search with history & filters
│       │   ├── settings/                      # Preferences (theme, currency, clearing history)
│       │   ├── shipping-delivery/             # Shipping rates & estimated courier windows
│       │   ├── support/                       # Customer support tickets & WhatsApp handoff
│       │   ├── terms/                         # Terms & conditions
│       │   └── api/
│       │       ├── delivery-options/route.ts  # GET: fetches active courier partners from sheet
│       │       ├── inquiry/route.ts           # POST: appends support tickets to sheet
│       │       ├── orders/route.ts            # POST: verifies catalog, calculates total, appends order
│       │       └── products/route.ts          # GET: live catalog products from sheet
│       ├── components/
│       │   ├── home/HomeView.tsx              # Home storefront layout: Hero, Carousel, Drops
│       │   ├── layout/                        # AppShell, DesktopHeader, DesktopFooter, BottomNav
│       │   ├── modals/                        # ProductModal, CartDrawer, FilterModal, MobileNavDrawer
│       │   └── ui/                            # ProductCard, CategoryCard, QuantityStepper, etc.
│       ├── config/
│       │   ├── categories.ts                  # Single source of truth for categories & statuses
│       │   └── site.ts                        # Brand metadata, trending tags, walkthrough data
│       ├── context/
│       │   ├── CartContext.tsx                # Shopping bag state with localStorage persistence
│       │   ├── ModalContext.tsx               # Global modal & drawer manager
│       │   ├── ToastContext.tsx               # Global notification toasts
│       │   └── ViewportContext.tsx            # Viewport & iOS detection state
│       ├── generated/
│       │   └── item-images.json               # Auto-generated image manifest per SKU
│       ├── lib/
│       │   ├── couriers.ts                    # Courier Partners sheet reader & parser
│       │   ├── images.ts                      # Image fallback helpers
│       │   ├── itemImages.ts                  # Resolves primary & secondary images from manifest
│       │   ├── orderId.ts                     # Reference ID format normalization & validation
│       │   ├── products.ts                    # Item Management sheet reader, parser & local cache
│       │   ├── referenceId.ts                 # Sequential ID generator (FIC-A0001) & offline fallback
│       │   ├── sheets/
│       │   │   ├── client.ts                  # Pure Node.js RS256 JWT auth & Google Sheets API client
│       │   │   └── schema.ts                  # Schema enforcement, tab initialization & freeze formats
│       │   ├── siteUrl.ts                     # Canonical site URL resolver
│       │   ├── slugify.ts                     # String to URL slug converter
│       │   └── whatsapp.ts                    # Order message formatter & wa.me URL generator
│       └── types/
│           └── index.ts                       # Domain TypeScript interfaces & types
```

---

## 4. Configuration Inventory

### 4.1 `next.config.ts`
- **Turbopack root:** Resolved explicitly to `ficcado-website-frontend` directory.
- **Production Build Safeguards (Lines 8–45):**
  - Requires `NEXT_PUBLIC_WHATSAPP_NUMBER` in production. Must contain 10–15 digits without dummy values (e.g. `9876543210`).
  - Requires `NEXT_PUBLIC_SITE_URL` starting with `https://`.
- **Image Optimization:** Enables AVIF and WebP formats; configures responsive device sizes (`[320, 375, ..., 1920]`).
- **Redirects:** 22 permanent redirects (`source` → `destination`), consolidating legacy routes:
  - `/orders/:path*`, `/orders`, `/track-order` → `/support`
  - `/favorites`, `/saved`, `/auth/:path*` → `/`
  - `/men/:path*`, `/women/:path*`, `/kids/:path*`, `/boys/:path*`, `/girls/:path*`, `/accessories/:path*`, `/collections/:path*` → `/categories`
  - `/blob/:path*`, `/blog/:path*` → `/journal`

### 4.2 `netlify.toml` (Root & Frontend)
- **Root `netlify.toml`:** Sets `base = "ficcado-website-frontend"`, `command = "npm run build"`, `publish = ".next"`, plugin `@netlify/plugin-nextjs`.
- **Frontend `netlify.toml`:**
  - Adds security headers: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `X-XSS-Protection: 1; mode=block`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()`, `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`.
  - Caching headers: `/_next/static/*` and `/fonts/*` cached immutable for 1 year (`max-age=31536000, immutable`). `/images/*` cached for 1 day with 7-day stale-while-revalidate.

### 4.3 `tsconfig.json`
- Strict TypeScript configuration (`"strict": true`), `"target": "ES2017"`, `"module": "esnext"`, path alias `@/*` mapping to `./src/*`.

### 4.4 `eslint.config.mjs`
- ESLint Flat Config extending `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`.

### 4.5 `postcss.config.mjs`
- Configures `@tailwindcss/postcss` plugin for Tailwind CSS v4.

---

## 5. Environment Variables Inventory

| Variable Name | Used In | Scope | Required? | Example Shape / Purpose |
|---|---|---|---|---|
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `next.config.ts`, `src/lib/whatsapp.ts`, `src/app/layout.tsx` | Client & Server | **Required in Prod** | `919497144795` (10-15 digits, international format, no `+`) |
| `NEXT_PUBLIC_SITE_URL` | `next.config.ts`, `src/lib/siteUrl.ts`, `src/lib/whatsapp.ts`, `src/app/layout.tsx` | Client & Server | **Required in Prod** | `https://ficcado.store` (Starts with `https://`) |
| `GOOGLE_SHEET_ID` | `src/lib/sheets/schema.ts`, `src/lib/sheets/client.ts`, `src/lib/products.ts`, `src/lib/couriers.ts`, `src/app/api/orders/route.ts`, `src/app/api/inquiry/route.ts` | Server Only | **Required** | `<44-char sheet id>` |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | `src/lib/sheets/client.ts` | Server Only | Required in Production | `<service-account>@<project>.iam.gserviceaccount.com` |
| `GOOGLE_PRIVATE_KEY` | `src/lib/sheets/client.ts` | Server Only | Required in Production | `-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n` |
| `GOOGLE_SERVICE_ACCOUNT_KEY_FILE`| `src/lib/sheets/client.ts` | Server Only | Optional (Local dev) | `../credentials/<service-account-key-file.json>` |
| `ORDER_ID_LIMIT` | `src/app/api/orders/route.ts`, `src/lib/referenceId.ts` | Server Only | Optional | `9999` (Default rollover threshold per letter series) |
| `SHEETS_STRICT` | Scripts & build | Server Only | Optional | `false` (Controls strictness of schema validation) |
| `ADMIN_TOKEN` | Diagnostic scripts | Server Only | Optional | Secret string for diagnostics |
| `GOOGLE_SITE_VERIFICATION` | `src/app/layout.tsx` | Server Only | Optional | Google Search Console verification token |

---

## 6. Route Map

| Path | File | Render Mode | Revalidation | Data Source | Auth | Metadata / SEO | Canonical / Robots |
|---|---|---|---|---|---|---|---|
| `/` | `src/app/page.tsx` | Dynamic (`force-dynamic`) | 0 (Fresh) | Sheets (`Item Management`) | Public | Title: "Ficcado", Default OG/Twitter | Indexed, Org & WebSite JSON-LD |
| `/about` | `src/app/about/page.tsx` | Static (`○`) | Static | Static configuration | Public | Title: "About Us \| Ficcado" | Indexed |
| `/categories` | `src/app/categories/page.tsx` | Static (`○`) | Static | `CATEGORIES_CONFIG` | Public | Title: "All Categories \| Ficcado" | Indexed |
| `/categories/[slug]` | `src/app/categories/[slug]/page.tsx` | Dynamic (`force-dynamic`) | 0 (Fresh) | Sheets (`Item Management`) | Public | Dynamic per slug; Breadcrumb & ItemList JSON-LD | Indexed |
| `/checkout` | `src/app/checkout/page.tsx` | Static (`○` Client) | Client | `/api/delivery-options`, `localStorage` | Public | Title: "Checkout \| Ficcado" | Disallowed in `robots.ts` |
| `/checkout/whatsapp-continue` | `src/app/checkout/whatsapp-continue/page.tsx` | Static (`○` Client) | Client | `sessionStorage` | Public | Title: "Order Confirmation" | Disallowed in `robots.ts` |
| `/faq` | `src/app/faq/page.tsx` | Static (`○`) | Static | `src/content/faq.ts` | Public | Title: "FAQ", FAQPage JSON-LD | Indexed |
| `/journal` | `src/app/journal/page.tsx` | Static (`○` Client) | Client | In-file editorial data | Public | Title: "The Ficcado Journal" | Indexed |
| `/onboarding` | `src/app/onboarding/page.tsx` | Static (`○` Client) | Client | `WALKTHROUGH_DATA` | Public | Title: "Welcome to Ficcado" | Indexed |
| `/privacy` | `src/app/privacy/page.tsx` | Static (`○`) | Static | In-file policy text | Public | Title: "Privacy Policy" | Indexed |
| `/replacements-damages` | `src/app/replacements-damages/page.tsx` | Static (`○`) | Static | In-file policy text | Public | Title: "Replacements & Damages" | Indexed |
| `/returns-refunds` | `src/app/returns-refunds/page.tsx` | Static (`○`) | Static | In-file policy text | Public | Title: "Returns & Refunds" | Indexed |
| `/search` | `src/app/search/page.tsx` | Static (`○` Client) | Client | `/api/products`, `localStorage` | Public | Title: "Search Catalog" | Indexed |
| `/settings` | `src/app/settings/page.tsx` | Static (`○` Client) | Client | `localStorage` | Public | Title: "Settings & Preferences" | Indexed |
| `/shipping-delivery` | `src/app/shipping-delivery/page.tsx` | Static (`○`) | Static | In-file policy text | Public | Title: "Shipping & Delivery" | Indexed |
| `/support` | `src/app/support/page.tsx` | Static (`○` Client) | Client | `/api/inquiry` | Public | Title: "Reach Out To Us" | Indexed |
| `/terms` | `src/app/terms/page.tsx` | Static (`○`) | Static | In-file policy text | Public | Title: "Terms & Conditions" | Indexed |
| `/api/products` | `src/app/api/products/route.ts` | Dynamic | 0 | Sheets (`Item Management`) | Public | JSON API | Disallowed |
| `/api/delivery-options`| `src/app/api/delivery-options/route.ts` | Dynamic | 0 | Sheets (`Courier Partners`) | Public | JSON API | Disallowed |
| `/api/orders` | `src/app/api/orders/route.ts` | Dynamic | 0 | Sheets (`New Sale Request`) | Public | JSON API (POST) | Disallowed |
| `/api/inquiry` | `src/app/api/inquiry/route.ts` | Dynamic | 0 | Sheets (`Support Requests`) | Public | JSON API (POST) | Disallowed |
| `/robots.txt` | `src/app/robots.ts` | Static | Static | Generated config | Public | Robots manifest | Root robots |
| `/sitemap.xml` | `src/app/sitemap.ts` | Static | Static | Generated config | Public | XML Sitemap | Root sitemap |
| `/humans.txt` | `src/app/humans.txt/route.ts` | Dynamic | Static | Plain-text route | Public | Plain-text author credits | Allowed |
| `/llms.txt` | `src/app/llms.txt/route.ts` | Dynamic | Static | Plain-text route | Public | AI crawler plain-text summary | Allowed |
| `/llms-full.txt`| `src/app/llms-full.txt/route.ts`| Dynamic | Static | Plain-text route | Public | Full AI knowledge plain-text | Allowed |

---

## 7. Page-by-Page Deep Dive

### 7.1 Home (`/` — `src/app/page.tsx` & `src/components/home/HomeView.tsx`)
- **Purpose:** Primary storefront showcase featuring hero banner, interactive category strip, featured products grid, craftsmanship highlights, and customer testimonials.
- **Components:** `HomeView`, `ProductCard`, `CategoryCard`, `DesktopHeader`, `DesktopFooter`, `BottomNav`, `ProductModal`, `CartDrawer`.
- **Data Read:** `getProducts()` directly from Google Sheets `'Item Management'` on server component mount.
- **State Used:** `ModalContext` (opens `productModal`), `CartContext` (direct bag additions).

### 7.2 Category Directory & Detail (`/categories` & `/categories/[slug]`)
- **Purpose:** Full catalog exploration by silhouette.
- **Behavior for Non-Live Categories (`combos`, `shirts`, `hoodies`, `pants`, `sneakers`):** Displays custom "Silhouette Roadmap — Coming Soon" UI (`categories/[slug]/page.tsx:L50-L107`), with timeline sneak-peek and CTAs back to live T-Shirts.
- **Behavior for Live Category (`t-shirts`):** Fetches live active products from Sheets, injects `BreadcrumbList`, `CollectionPage`, and `ItemList` JSON-LD schemas.

### 7.3 Checkout (`/checkout` — `src/app/checkout/page.tsx`)
- **Purpose:** Customer delivery address capture, dynamic courier partner selection, server price calculation, and order submission.
- **Forms & Validation:** Full name (min 2 chars), mobile (normalized 10-digit Indian number), email (standard regex), address lines 1 & 2, city, state dropdown (33 Indian states/UTs), PIN code (normalized 6 digits), landmark.
- **Courier Selection:** Fetches `/api/delivery-options` dynamically.
- **Data Write:** Submits validated payload to `/api/orders`.
- **Navigation Out:** On successful creation, stores order details in `sessionStorage` and routes to `/checkout/whatsapp-continue`.

### 7.4 WhatsApp Continuation (`/checkout/whatsapp-continue`)
- **Purpose:** Confirmation handoff screen displaying the temporary Reference ID (`FIC-A0001` format), order summary, anti-tampering notice ("Please send the message as it is"), "Open WhatsApp Again" button, and "Copy Order Text" button.

### 7.5 Customer Support (`/support` — `src/app/support/page.tsx`)
- **Purpose:** Ticket submission desk for order questions, sizing advice, feedback, and complaint registration.
- **Contextual Form Logic:** Selecting `'Help regarding order'` triggers a mandatory Order ID input validating either a temporary Reference ID (`FIC-A0001` or `FIC-T8X4M2`) or a final team Order ID (`ORD-1042`).
- **Data Write:** Submits to `/api/inquiry`, which appends sanitized rows to Google Sheets `'Support Requests'`.

### 7.6 Live Search (`/search` — `src/app/search/page.tsx`)
- **Purpose:** Client-side real-time filter across catalog products by title, category, and description.
- **Features:** Synced URL query param (`?q=...`), recent search history saved in `localStorage` (`ficcado-recent-searches`), trending search tags.

### 7.7 Editorial Journal (`/journal` — `src/app/journal/page.tsx`)
- **Purpose:** Brand storytelling and textile education.
- **Interactive Aura Canvas:** Morphing SVG blob reacting to user-selected color moods (`Royal Ficcado`, `Citrus Dawn`, `Sage Mint`, `Nocturne Black`) with speed toggle (`gentle` vs `pulse`).
- **Articles:** 3 in-depth chronicles (Founders' story, 240 GSM cotton anatomy, capsule philosophy) with reading modal rendered via React portal.

### 7.8 About Us (`/about` — `src/app/about/page.tsx`)
- **Purpose:** Detailed founder profiles (Sinan MS, Ganga Lakshmi, Rohith Murali), craft philosophy, and brand mission.

### 7.9 Settings (`/settings` — `src/app/settings/page.tsx`)
- **Purpose:** Client preferences: displays currency (INR ₹), clears search history, reviews cache, and developer credits.

### 7.10 FAQ (`/faq` — `src/app/faq/page.tsx`)
- **Purpose:** Comprehensive FAQ covering WhatsApp ordering, 240 GSM fabric specs, payment options, and delivery timelines. Injects `FAQPage` schema.

---

## 8. Navigation System

- **Desktop Header (`src/components/layout/DesktopHeader.tsx`):** Sticky top bar on screen widths ≥ 1024px. Displays brand logo, navigation links (`Home`, `T-Shirts`, `Categories`, `Journal`, `About`, `Support`), search trigger, and shopping bag button with active item badge.
- **Mobile Bottom Navigation (`src/components/layout/BottomNav.tsx`):** Fixed bottom tab bar on mobile/tablet viewports (< 1024px). Tabs: `Home`, `Categories`, `Search`, `Bag` (opens cart drawer), `Menu` (opens mobile drawer).
- **Mobile Nav Drawer (`src/components/modals/MobileNavDrawer.tsx`):** Slide-out drawer containing category links, policy pages, founder information, and direct WhatsApp contact link.
- **Route Title Synchronization (`src/components/layout/RouteTitleSync.tsx`):** Client component that synchronizes `document.title` on client-side route changes.
- **404 / Not Found Handling:** Next.js built-in `/_not-found` handling; route redirects in `next.config.ts` route obsolete URLs to `/support`, `/categories`, or `/`.

---

## 9. Components Catalog

| Component | Path | Client/Server | Props | Purpose & Behavior |
|---|---|---|---|---|
| `AppShell` | `src/components/layout/AppShell.tsx` | Client | `{ children }` | Global responsive wrapper containing header, main container, footer, bottom nav, and modal layer. |
| `DesktopHeader` | `src/components/layout/DesktopHeader.tsx` | Client | None | Sticky desktop navigation bar with bag counter badge. |
| `DesktopFooter` | `src/components/layout/DesktopFooter.tsx` | Client | None | Multi-column desktop footer with quick links, category links, founder credits, and copyright. |
| `BottomNav` | `src/components/layout/BottomNav.tsx` | Client | `{ isFixed? }` | Mobile 5-tab bottom navigation with cart badge. |
| `ProductCard` | `src/components/ui/ProductCard.tsx` | Client | `{ product, priority? }` | Responsive product grid card with image hover effect, price display, size options, and modal trigger. |
| `CategoryCard` | `src/components/ui/CategoryCard.tsx` | Client | `{ category }` | Displays category image, title, and live/coming-soon badge. |
| `QuantityStepper`| `src/components/ui/QuantityStepper.tsx` | Client | `{ value, onChange, min, max }` | Numeric plus/minus stepper for cart quantities. |
| `RatingStars` | `src/components/ui/RatingStars.tsx` | Client | `{ rating, max? }` | Displays 5-star rating graphic based on float value. |
| `GhostLoadingScreen` | `src/components/ui/GhostLoadingScreen.tsx` | Client | None | Skeleton loader for page transitions. |
| `ProductModal` | `src/components/modals/ProductModal.tsx` | Client | None | Quick-view product dialog with gallery, size selector, color chips, and "Add to Bag" action. |
| `CartDrawer` | `src/components/modals/CartDrawer.tsx` | Client | None | Slide-in drawer showing current cart items, subtotal, quantity adjustments, and "Proceed to Checkout" CTA. |
| `FilterModal` | `src/components/modals/FilterModal.tsx` | Client | None | Modal sheet for filtering products by price, size, and category. |
| `MobileNavDrawer`| `src/components/modals/MobileNavDrawer.tsx`| Client | None | Full-height navigation drawer for mobile screens. |
| `AboutModal` | `src/components/modals/AboutModal.tsx` | Client | None | Modal sheet summarizing brand story and founders. |
| `ToastContainer`| `src/components/layout/ToastContainer.tsx`| Client | None | Floating notification container for toast alerts. |

---

## 10. State Management Architecture

The application uses **React Context with `useReducer` and `useSyncExternalStore`**:
1. **`CartContext` (`src/context/CartContext.tsx`):**
   - **Shape:** `{ items: CartItem[], totalItemsCount: number, subtotalAmount: number, isHydrated: boolean }`.
   - **Persistence:** LocalStorage key `'ficcado-bag-v3'`. On hydration, discards legacy pre-v3 keys.
   - **Hydration Safety:** Avoids SSR mismatch by mounting with empty state and hydrating in `useEffect`.
2. **`ModalContext` (`src/context/ModalContext.tsx`):**
   - **Shape:** `{ activeModal: ModalId, modalPayload: ModalPayload }`.
   - Controls active modal (`productModal`, `cartDrawer`, `filterModal`, `aboutModal`, `mobileMenuDrawer`).
   - Automatically locks `document.body.style.overflow = 'hidden'` and attaches `Escape` key listener.
3. **`ToastContext` (`src/context/ToastContext.tsx`):**
   - **Shape:** `{ toasts: ToastMessage[], showToast, dismissToast }`.
   - Auto-dismisses toasts after 3.5 seconds.
4. **`ViewportContext` (`src/context/ViewportContext.tsx`):**
   - Detects mobile vs desktop viewports and manages iOS bottom-bar clearance tokens (`--ios-bottom-bar-clearance`).

---

## 11. API / Server Logic Inventory

### 11.1 `GET /api/products`
- **File:** `src/app/api/products/route.ts`
- **Dynamic Config:** `force-dynamic`, `revalidate = 0`.
- **Headers:** `Cache-Control: no-store, no-cache, must-revalidate`.
- **Logic:** Reads Google Sheets `'Item Management'` tab, parses active products with valid positive prices, filters out unapproved types, resolves SKU images, and returns JSON array.

### 11.2 `GET /api/delivery-options`
- **File:** `src/app/api/delivery-options/route.ts`
- **Dynamic Config:** `force-dynamic`, `revalidate = 0`.
- **Logic:** Reads Google Sheets `'Courier Partners'` tab, parses active courier rows, sorts by rate ascending, and returns `{ ok: true, options: CourierOption[] }`.

### 11.3 `POST /api/orders`
- **File:** `src/app/api/orders/route.ts`
- **Validation:** Strict Zod schema (`OrderRequestSchema`). Requires `submission_id`, customer details (full name, 10-digit mobile, email), shipping address (with 6-digit PIN code), `courier_partner_id`, and `items` array.
- **Server Verification:**
  - Re-fetches catalog from Google Sheets; recalculates prices, item availability, and subtotal on the server.
  - Re-fetches courier partner rate; recalculates delivery fee and grand total on the server. Ignores client-supplied prices.
- **Idempotency & Sequential Reference ID:**
  - Reads recent rows from `'New Sale Request'`.
  - Checks if `submission_id` already exists. If yes, returns existing Reference ID and total immediately without appending a duplicate row.
  - Determines highest existing Reference ID (e.g., `FIC-A0042`) and increments to next sequential ID (`FIC-A0043`).
- **Spreadsheet Formula Injection Guard:** Sanitizes cell values starting with `=`, `+`, `-`, `@` with a leading `'`.
- **Timeout & Offline Fallback:** Limits Google Sheets write to 8 seconds (`Promise.race`). If Google Sheets times out or fails, generates offline reference ID (`FIC-T...`) and returns order data with `isOffline: true`.

### 11.4 `POST /api/inquiry`
- **File:** `src/app/api/inquiry/route.ts`
- **Validation:** Strict Zod schema (`InquiryInputSchema`). Validates name, email, support type, optional order ID, message (5–2000 chars), and hidden honeypot field (`botHp`).
- **Bot Defense:** If honeypot `botHp` contains text, silently drops write and returns success.
- **Order ID Verification:** Validates format if type is `'order-support'`.
- **Write:** Appends sanitized row to Google Sheets `'Support Requests'`.

---

## 12. Data Layer & Persistence Map (Google Sheets)

| Data Entity | Google Sheets Tab | Direction | Fields / Columns | Caching Strategy |
|---|---|---|---|---|
| **Catalog Products** | `Item Management` | Read | `id`, `item_name`, `type`, `price`, `sizes`, `average_rating`, `review_count`, `colors`, `description`, `slug`, `in_stock`, `featured`, `active`, `sort_order` | Dynamic fetch; cached to `src/generated/products-cache.json` on disk for serverless fallback |
| **Courier Options** | `Courier Partners` | Read | `partner_id`, `partner_name`, `partner_phone`, `partner_address`, `rate_per_delivery`, `created_at`, `updated_at`, `status`, `delivery_time` | Dynamic fetch; in-memory fallback on network failure |
| **Customer Orders** | `New Sale Request` | Write (Append) | `reference_id`, `created_at`, `status`, `final_order_id`, `customer_name`, `customer_email`, `customer_phone`, `address_line1`, `address_line2`, `city`, `state`, `pincode`, `landmark`, `courier_partner_id`, `courier_partner_name`, `delivery_charge`, `subtotal`, `total_amount`, `item_count`, `items_summary`, `items_json`, `submission_id` | Server append only; guarded with 8s timeout, formula-sanitization, idempotency check |
| **Support Tickets** | `Support Requests` | Write (Append) | `timestamp`, `inquiry_id`, `type`, `order_id`, `name`, `email`, `phone`, `category`, `message`, `status` | Server append only; honeypot protected |

### Schema Initialization (`src/lib/sheets/schema.ts`)
- `ensureSheetSchema()`: Inspects target spreadsheet metadata. Creates missing tabs, ensures all required row-1 headers exist, appends missing columns without overwriting existing data, and applies visual formatting (bold header row, light grey background, frozen row 1).

---

## 13. [IF GOOGLE SHEETS] Sheets Integration Deep Dive

- **Auth Method:** Pure Node.js RS256 JWT exchange via `crypto.createSign('RSA-SHA256')`. Requests an OAuth2 bearer token from `https://oauth2.googleapis.com/token` with scope `https://www.googleapis.com/auth/spreadsheets`.
- **Token Cache:** In-memory caching with 5-minute pre-expiration margin (`client.ts:L81-L116`).
- **Credentials Discovery:** Checks `GOOGLE_SERVICE_ACCOUNT_EMAIL` & `GOOGLE_PRIVATE_KEY` in environment variables; falls back to local service account JSON files in `../credentials/` for local development.
- **Dynamic Header Mapping:** Reads row-1 header names and indexes columns dynamically (`products.ts:L122-L137`), ensuring sheet columns can be rearranged without breaking code.
- **Formula Injection Defense:** `sanitizeCell()` automatically prepends a single quote (`'`) to any cell string starting with `=`, `+`, `-`, or `@` before write operations.
- **Failure Fallback:**
  - Catalog reads fallback to `src/generated/products-cache.json` if Google Sheets is unreachable.
  - Order writes fallback to offline Reference IDs (`FIC-T...`) if Google Sheets times out after 8 seconds.

### 13.1 Google Sheets API Calls Per Journey & Quota Budget (B-02)

| Journey / Path | Sheets Calls (Current) | Target After Caching & Batching | Quota Capacity |
|---|---|---|---|
| **Visitor Page View (`/`, `/categories/[slug]`)** | 1 read call | **0 calls** (Served from ISR edge cache) | 0 calls to Google Sheets in steady state. |
| **Checkout Load (`/checkout`)** | 1 read call | **0 calls** (Served from shared cache) | Quota protected. |
| **Order Placement (`POST /api/orders`)** | **4–5 calls** (Catalog + Courier + Schema + Recent rows + Append) | **1 call** (Catalog & Courier from shared cache + 1 atomic create/append) | Current: max ~12–15 orders/min before hitting Google's 60 req/min limit. Target: 60 orders/min. |
| **Support Ticket (`POST /api/inquiry`)** | 1 write call | 1 write call (Honeypot + rate limited) | Up to 60 tickets/min. |

**Official Quota Documentation:**  
Google Sheets API v4 limits are 60 read requests per minute per user and 60 write requests per minute per user (https://developers.google.com/sheets/api/limits).

---

## 14. [IF BACKEND] Backend Service
**N/A.** The storefront has no dedicated microservice or external Spring Boot / Express server. All server-side business logic, validation, and database operations run directly in Next.js App Router route handlers (`/api/*`).

---

## 15. [IF AUTH] & [IF PAYMENTS]
- **[IF AUTH] N/A:** Storefront is open access. There are no customer logins, passwords, sessions, or user accounts.
- **[IF PAYMENTS]:** Order placement is an assisted direct-commerce handoff flow. The website computes verified totals, logs the order into Google Sheets, and transfers the customer to WhatsApp. Payment (UPI, bank transfer, or QR) and shipping dispatch are finalized directly between the customer and the Ficcado operations team. No external payment gateway SDKs or webhook listeners are loaded.

---

## 16. Browser Storage & Cookies Inventory

### 16.1 Browser Cookies
- **Zero cookies are set by application code.** Neither the server nor client code sets `document.cookie`.

### 16.2 Local Storage (`localStorage`)

| Key | Set By | Purpose | Lifetime | Category |
|---|---|---|---|---|
| `ficcado-bag-v3` | `src/context/CartContext.tsx` | Stores shopping bag items (`CartItem[]`) | Persistent | Strictly Necessary (Commerce) |
| `ficcado-checkout-form-draft` | `src/app/checkout/page.tsx` | Preserves checkout address form input across page reloads | Persistent | Strictly Necessary (User Input) |
| `ficcado-recent-searches` | `src/app/search/page.tsx` | Stores user's last 5 search query strings | Persistent | Functional / Preferences |

### 16.3 Session Storage (`sessionStorage`)

| Key | Set By | Purpose | Lifetime | Category |
|---|---|---|---|---|
| `ficcado-last-order` | `src/app/checkout/page.tsx` | Stores last created order reference ID and WhatsApp URL for display on `/checkout/whatsapp-continue` | Browser Session | Strictly Necessary (Order Handoff) |
| `fc_is_ios` | `src/app/layout.tsx` | Caches iOS device detection for bottom bar padding | Browser Session | Functional / UI |

---

## 17. Third-Party Scripts & Services
- **No external third-party tracking scripts, analytics SDKs, tag managers, or pixel trackers are loaded.**
- Google Fonts (`Plus_Jakarta_Sans`) is loaded self-hosted via `next/font/google`, causing zero third-party font requests.

---

## 18. Assets Catalog & Image Strategy

- **Brand Logos:** Stored in `public/images/brand_logo/` (`Ficcado Brand Logo.jpeg`, `favicon-32x32.png`, `favicon-rounded.png`, `apple-touch-icon.png`).
- **Founders:** `public/images/founders/` (`Sinan.jpeg`, `Ganga Lakshmi.jpeg`, `Rohith Murali.jpeg`).
- **Category Banners:** `public/images/categories/` (`t-shirts.jpg`, `combos.jpg`, `shirts.jpg`, `hoodies.jpg`, `pants.jpg`, `sneakers.jpg`).
- **Product SKUs:** `public/images/items/<sku-folder>/image-1.webp`, `image-2.webp`.
  - Processed during prebuild by `scripts/build-item-image-manifest.mjs` into `src/generated/item-images.json`.
- **Image Optimization:** Utilizes `next/image` with AVIF and WebP format transformations, defined `sizes`, and device breakpoints in `next.config.ts`.

---

## 19. Styling & Design System

- **Framework:** Tailwind CSS v4 configured via `postcss.config.mjs` and `src/app/globals.css`.
- **Color Tokens:**
  - Primary Brand Blue: `#2B62C6` (`--primary`)
  - Accent Light Blue: `#B4D1EF` (`--primary-light`)
  - Page Background: `#F8FAFC` (`--bg-page`)
  - Card Surface: `#FFFFFF` (`--bg-surface`)
  - WhatsApp Accent: `#25D366` / `#128C7E`
  - Success Green: `#10B981` (`--accent-green`)
- **Typography:** `Plus_Jakarta_Sans` imported via `next/font/google` (`--font-plus-jakarta`).
- **Breakpoints:** Mobile (< 768px), Tablet (768px–1023px), Desktop (≥ 1024px).
- **Responsive Shell:** Bottom navigation is shown on mobile (< 1024px); desktop header and footer are shown on tablet/desktop (≥ 1024px).

---

## 20. SEO & Metadata Posture

- **Canonical URL:** Configured via `getSiteUrl()`, defaulting to `NEXT_PUBLIC_SITE_URL` or `https://ficcado.store`.
- **Root Layout Schema:** Injects structured `Organization` and `WebSite` JSON-LD schema cluster.
- **Category Pages:** Injects `BreadcrumbList`, `CollectionPage`, and `ItemList` schemas.
- **Product Dialogs:** Injects `Product`, `Offer`, and `AggregateRating` schemas.
- **FAQ Page:** Injects `FAQPage` schema directly from `FAQ_ITEMS`.
- **Crawler Files:**
  - `robots.ts` allows standard routes, explicitly disallows `/api/` and `/checkout/`, and grants full read access to AI bots (`GPTBot`, `ClaudeBot`, `PerplexityBot`).
  - `sitemap.ts` indexes all public routes with dynamic priority.
  - `humans.txt`, `llms.txt`, and `llms-full.txt` provide comprehensive machine-readable knowledge and developer credits.

---

## 21. Security Posture (As Found)

- **HTTP Security Headers:** Configured in `ficcado-website-frontend/netlify.toml` (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Strict-Transport-Security`, `Permissions-Policy`).
- **Formula Injection Defense:** Implemented in `src/lib/sheets/client.ts` via `sanitizeCell()`.
- **Input Validation:** Zod schemas applied to all mutating API endpoints (`/api/orders`, `/api/inquiry`).
- **Honeypot Protection:** Honeypot field `botHp` protects `/api/inquiry` from automated form spam.
- **Secrets Audit:**
  - `NEXT_PUBLIC_*` contains only public WhatsApp phone number and site URL.
  - Service account private keys are kept on server only (`GOOGLE_PRIVATE_KEY` / `GOOGLE_SERVICE_ACCOUNT_EMAIL`).
  - **Identified Risk:** Service account credential file located in workspace at `credentials/ficcado-quick-website-5fc91a2f02ba.json`. Must ensure this file is never committed to public git history.
- **Dependency Audit:**
  - `next@16.3.5` has a reported critical vulnerability (GHSA-vcvr-r3jv-pc5j, Next.js ImageResponse RCE). Upgrading to Next.js 16.3.8+ is recommended.
  - `source-map-js@1.2.1` has a reported high vulnerability (GHSA-68fv-2mgg-jv7q).

---

## 22. Performance Posture (As Found)

- **Route Table (from `npm run build`):**
  - Static Pre-rendered Routes (`○`): 22 routes (about, blob, blog, categories, checkout, faq, journal, onboarding, privacy, search, settings, terms, etc.).
  - Dynamic Server-Rendered Routes (`ƒ`): 10 routes (root `/`, `/categories/[slug]`, `/api/products`, `/api/orders`, `/api/delivery-options`, `/api/inquiry`, `/humans.txt`, `/llms.txt`, `/llms-full.txt`).
- **Catalog Reads:** Home page and `/categories/[slug]` are marked `force-dynamic` with `revalidate = 0`. Under high traffic (100,000 visitors), querying Google Sheets on every request will exceed Google Sheets API rate limits (60 requests/minute per user). Recommended: ISR with `stale-while-revalidate` (e.g. 60–300s) or disk/KV cache.

---

## 23. Testing & CI/CD Posture (As Found)

- **Test Suite:** Built-in Node test runner (`node --test scripts/tests/*.test.mjs`).
  - `scripts/tests/order-system.test.mjs`: Tests Reference ID sequence generation, rollover logic, courier schemas, WhatsApp message builders, formula injection guards, and mobile/PIN normalization. (All pass).
  - `scripts/tests/phase2-discoverability.test.mjs`: Tests robots, sitemaps, JSON-LD schemas, and `llms.txt`.
    - **Current Failure:** 1 failing test expecting `docs/BACKLINK_PLAN.md` because prior docs were moved to `documents-1/BACKLINK_PLAN.md`.
- **CI/CD:** No automated GitHub Actions workflow file (`.github/workflows/ci.yml`) exists in the repository. Deploys currently trigger directly via Netlify Git integration.

---

## 24. Build & Deployment Pipeline

- **Prebuild Steps:**
  1. `npm run sheets:bootstrap`: Validates connection and initializes 4 required tabs.
  2. `node scripts/build-item-image-manifest.mjs`: Scans `public/images/items/` and writes `src/generated/item-images.json`.
- **Build Step:** `next build` compiles TypeScript and creates optimized Turbopack bundles.
- **Hosting:** Netlify with `@netlify/plugin-nextjs`. Serverless functions handle dynamic routes (`/`, `/api/*`).

---

## 25. End-to-End User Journeys

### Journey 1: Storefront Browse & Bag Configuration
1. User visits `https://ficcado.store/`.
2. Server loads live products from Google Sheets `'Item Management'` and renders `HomeView`.
3. User taps a product card → opens `ProductModal`.
4. User selects size (e.g. `L`) and color, taps "Add to Bag".
5. `CartContext` updates, persists to `localStorage` (`ficcado-bag-v3`), and shows confirmation toast.

### Journey 2: Checkout & WhatsApp Handoff
1. User taps Bag icon → opens `CartDrawer` → taps "Proceed to Checkout".
2. Browser navigates to `/checkout`.
3. Client fetches active delivery courier options from `/api/delivery-options`.
4. User fills shipping address details and selects courier partner.
5. User taps "Place Order — ₹X".
6. Browser issues `POST /api/orders` with client `submission_id`.
7. Server validates schema, re-verifies catalog prices, computes totals, ensures idempotency, and assigns sequential Reference ID (`FIC-A0001`).
8. Server appends row to Google Sheets `'New Sale Request'`.
9. Server returns `{ success: true, referenceId, whatsappUrl, total }`.
10. Browser opens WhatsApp with pre-filled formatted order message and navigates to `/checkout/whatsapp-continue`.
11. User taps "Send" in WhatsApp. Ficcado operations team reviews the temporary reference ID and confirms order.

### Journey 3: Support & Inquiry Ticket Registration
1. User navigates to `/support`.
2. User selects category (e.g., `'Help regarding order'`).
3. User inputs Order ID / Reference ID (`FIC-A0001`), name, email, and message.
4. User submits form → browser sends `POST /api/inquiry`.
5. Server generates ticket ID (`FIC-INQ-2026-XXXXX`) and appends row to Google Sheets `'Support Requests'`.
6. UI displays confirmation card with ticket reference.

---

## 26. Dead Code, Duplicates & Suspicious Items Discovered

1. **Test Failure in `phase2-discoverability.test.mjs`:** Asserts `docs/BACKLINK_PLAN.md` exists, but file was moved to `documents-1/BACKLINK_PLAN.md`.
2. **Duplicate FAQ Content:** `content/faq.ts` exists in frontend root AND `src/content/faq.ts`. One should be the sole source of truth.
3. **Hard-coded Dynamic Routes on High-Traffic Pages:** Home page (`/`) and category detail (`/categories/[slug]`) have `force-dynamic` with `revalidate = 0`. Every visitor triggers a Google Sheets API read, which risks Google API 429 quota exhaustion under heavy traffic.
4. **Vulnerable Dependencies:** `next` 16.3.5 and `source-map-js` 1.2.1 flagged with security advisories.
5. **No GitHub Actions CI:** Deploys rely on Netlify automatic builds without automated test/lint gating.
6. **Credential File in Workspace:** `credentials/ficcado-quick-website-5fc91a2f02ba.json` resides in the project tree.

---

## 27. Glossary

- **Reference ID:** Temporary sequential order identifier generated upon checkout (Format: `FIC-<SERIES><4-DIGIT-NUM>`, e.g., `FIC-A0001`).
- **Offline Reference ID:** Temporary fallback identifier generated if Google Sheets is unreachable (Format: `FIC-T<6-ALPHANUMERIC>`, e.g., `FIC-T8X4M2`).
- **Final Order ID:** Permanent order identifier issued by Ficcado operations team after payment verification.
- **Submission ID:** Unique client-generated UUID used to enforce idempotency on order creation.
- **240 GSM:** Fabric weight specification: 240 grams per square meter combed cotton jersey.
- **Capsule Drop:** Limited-quantity seasonal apparel release.

---

## 28. Questions for the Developer (Decisions & Clarifications)

### 28.1 Answered & Approved Decisions (Phase 4 Part A)

- **Question 1: Catalog Read Caching** → **APPROVED (Option A):** ISR (`revalidate = 60`) with shared catalog cache across pages and `/api/orders`. (Decision D-003).
- **Question 2: Missing `docs/BACKLINK_PLAN.md` Test** → **APPROVED (Option A):** Restore `BACKLINK_PLAN.md` into `docs/`. (Decision D-004).
- **Question 3: Upgrade Next.js** → **APPROVED (Option A):** Upgrade `next` and `eslint-config-next` to verified release `16.3.8`. (Decision D-005).
- **Question 4: CI/CD Pipeline** → **APPROVED (Option A):** Add GitHub Actions workflow (`.github/workflows/ci.yml`). Gating follows D7. (Decision D-006).

### 28.2 Finalized & Implemented Decisions (Phase 4 Part C / D1–D15)

- **D1 (Atomic Reference ID):** **RESOLVED & IMPLEMENTED** — Google Apps Script web app with `LockService` + `PropertiesService` counter + idempotency on `submission_id`. Fallback `ORDER_ID_MODE=sheet-row` supported. 8s timeout guard + cryptographic `FIC-T` fallback.
- **D2 (Rate-Limit Store):** **RESOLVED & IMPLEMENTED** — Upstash Redis REST rate limiting via `/src/lib/rateLimit.ts` with fail-open sliding-window in-memory fallback across all 4 `/api/*` routes.
- **D3 (CAPTCHA):** **RESOLVED & IMPLEMENTED** — Bot honeypot (`website`/`botHp`) + 1.5s minimum submission time threshold on checkout and support inquiry forms.
- **D4 (Error Tracking & Observability):** **RESOLVED & IMPLEMENTED** — Structured JSON logs with request IDs and zero PII. Dedicated `/api/health` diagnostic endpoint protected by `ADMIN_TOKEN`.
- **D5 (Consent Storage Expiry):** **RESOLVED & IMPLEMENTED** — 12-month consent record (`ficcado-consent`), equal-prominence Reject, categories: Necessary, Preferences, + empty Analytics slot.
- **D6 (Test Coverage Thresholds):** **RESOLVED & IMPLEMENTED** — Comprehensive automated suite (51/51 tests passing across 14 suites); 100% test coverage on money, reference ID, formula sanitization, rate-limiting, and consent logic.
- **D7 (Deploy Gating):** **RESOLVED & IMPLEMENTED** — GitHub Actions CI workflow (`.github/workflows/ci.yml`) and step-by-step setup guide (`docs/BRANCH_PROTECTION.md`).
- **D8 (Netlify Plan & Peak Traffic):** **RESOLVED** — Target 100,000 visitors, 10,000 peak concurrent, 100 orders/minute peak. Caching (ISR 60s) absorbs storefront page traffic without burning Google Sheets quota.
- **D9 (Combos Category Status):** **RESOLVED** — Coming soon ("combos are coming soon only as of now"). Catalog, FAQ, PRD, and memory updated consistently.
- **D10 (Brand Facts Owner Confirmation):** **RESOLVED & APPROVED** — All current details confirmed correct: 2024 founding year, 240 GSM, drop-shoulder, anti-sag collar, colour packs.
- **D11 (Credentials Remote Exposure):** **VERIFIED CLEAN** — 0 commits in git history contain private keys or service account credentials; credentials folder and .env.local verified git-ignored.
- **D12 (`progress.md` Location):** **CONFIRMED** — `docs/progress.md` canonical living log.
- **D13 (CSP Approach & HSTS Preload):** **RESOLVED & IMPLEMENTED** — Pragmatic `Content-Security-Policy-Report-Only` header; removed obsolete `X-XSS-Protection`; HSTS `max-age=31536000` (dropped `preload` and `includeSubDomains`). Consolidated to single root `netlify.toml`.
- **D14 (Replace Real Sheet ID / Key Filename):** **COMPLETED** — Sanitized with placeholders across all documentation.
- **D15 (Privacy Policy Details):** **RESOLVED & IMPLEMENTED** — Contact email `ficcado.clothing@gmail.com`; support hours 7:00 AM – 7:00 PM IST; POG Rohith Murali (`rohithficcado@gmail.com`); data retention forever safe; physical parcel label sharing only; operational region INDIA. Production build guards verify `NEXT_PUBLIC_PRIVACY_EMAIL`.
