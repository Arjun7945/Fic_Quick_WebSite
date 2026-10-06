# AGENT BRIEF: Fikado Team – Audit, Optimize & Convert to Google Sheets + Netlify

> **Read this entire file before touching any code.**
> You are working inside an existing **Next.js** project for **Fikado Team**: a portfolio + e-commerce website that sells clothing (t-shirts, shirts, etc.). Your job has three phases: **Understand → Plan (write `EXPANSION.md`) → Implement**.

---

## 1. Background & Business Context

- The project was originally designed to use a backend (Spring Boot) and a database.
- **The client has asked for a simpler setup:** no custom backend, no database. The site will be hosted on **Netlify** and later connected to a **GoDaddy** domain.
- **Google Sheets replaces the database.**
  - Products shown on the site are currently hard-coded in the code → they must come from Google Sheets.
  - Inquiries / requests / orders submitted by visitors must be **saved into Google Sheets**.
- After launch, the site must handle **1,000+ concurrent users** without slowdowns, broken images, layout shifts, or missing fonts.

**Hard rule:** Do **not** redesign the UI. Keep the current look, layout, branding, and copy. We are changing the data layer, asset handling, performance, and deployment only.

---

## 2. Phase 1 – Understand the Project (do this first)

Before planning or editing, fully scan the repository and build an accurate mental model. Inspect at minimum:

1. `package.json` – Next.js version, router type (**App Router vs Pages Router**), dependencies, scripts.
2. `next.config.*`, `tsconfig.json` / `jsconfig.json`, `tailwind.config.*`, `postcss.config.*`, ESLint config.
3. Every route/page, layout, and component (home, product listing, product detail, cart, checkout, contact/inquiry, portfolio, about, etc.).
4. All **hard-coded data** (product arrays, constants, JSON files, mock data).
5. All **hard-coded images**: `<img>` tags, `next/image` usage, CSS `background-image`, remote URLs, base64 blobs, images in `public/`, `src/assets/`, etc.
6. All **API calls / fetch / axios / server actions / route handlers** – especially anything pointing to a Spring Boot backend or `localhost`.
7. State management (Context, Redux, Zustand, etc.), forms, validation, and cart logic.
8. Fonts (Google Fonts via `<link>`, CSS `@import`, local fonts, `next/font`).
9. Third-party scripts (analytics, chat widgets, pixels).
10. Environment variables currently used (`.env*`).

**Output of Phase 1:** a short written summary (in chat) of what you found, plus an inventory table:

| Item | Location(s) | Current state | Action needed |
|------|-------------|---------------|---------------|

Flag anything ambiguous and ask me **before** proceeding if a decision could break functionality.

---

## 3. Phase 2 – Create `EXPANSION.md` (mandatory deliverable)

In the project root, create **`EXPANSION.md`** *before* making large changes. It must explain, in clear language, the following sections:

1. **Current Architecture Summary** – what the app is today, what you found in Phase 1.
2. **Target Architecture** – Next.js on Netlify + Google Sheets as data store (include a simple diagram in Mermaid or ASCII).
3. **List of Planned Changes** – grouped by: Data layer, Images/assets, Performance, Forms/Inquiries, Security, Deployment, Cleanup.
4. **Google Sheets Design** – tabs, column schemas, how reads and writes work (see Section 5).
5. **Image & Asset Strategy** – folder structure, naming rules, formats, how to add new products (see Section 4).
6. **Performance Plan** – techniques, budgets, and how each is verified (see Section 6).
7. **High-Traffic Plan (1,000+ concurrent users)** – caching layers, rate-limit protection, failure fallbacks (see Section 7).
8. **Netlify Deployment Plan** – config, env vars, build settings (see Section 8).
9. **GoDaddy Domain Plan** – DNS steps (see Section 9).
10. **Risks & Trade-offs** – e.g., Google Sheets API quotas, no real-time inventory, spam risk.
11. **Pre-Launch Checklist** – with checkboxes you tick off as you complete them.
12. **Changelog** – every file added, changed, or deleted.

Keep `EXPANSION.md` updated as you work. It is the single source of truth for what was done and why.

---

## 4. Phase 3A – Images & Asset Structure

### 4.1 Remove all hard-coded / temporary images
- Remove placeholder images, remote stock URLs, base64-embedded images, and any image paths pointing to non-existent files.
- Replace each usage with a proper reference to the new asset system below.
- Where a real image isn't available yet, use a **single shared neutral placeholder** (optimized, with blur data) so the UI never breaks. List all placeholders in `EXPANSION.md` so I know which real images to supply.

### 4.2 Create a clean folder structure
Use a structure like this (adapt to the project's router style, but keep it organized and documented):

```
public/
  images/
    brand/            # logo, favicon sources, og-image
    hero/             # homepage banners
    products/
      <product-slug>/ # e.g. classic-white-tee/
        main.webp
        alt-1.webp
        alt-2.webp
    portfolio/        # portfolio / lookbook images
    placeholders/     # shared fallback + blur placeholders
  fonts/              # only if self-hosting local fonts
```

Rules:
- Folder and file names: **lowercase, kebab-case, no spaces**.
- Product images are referenced by **product slug**, so the Google Sheet only needs the slug (or a filename), not a full path.
- Create a small helper (e.g., `lib/images.ts`) that resolves slug → image paths and falls back to the placeholder if a file is missing.
- Add `public/images/README.md` explaining naming rules, recommended dimensions, and max file sizes.

### 4.3 Image performance rules
- Use **`next/image`** everywhere (no raw `<img>` unless unavoidable, e.g., in emails).
- Always set `width`/`height` (or `fill` with a sized parent) to **prevent layout shift (CLS)**.
- Set accurate **`sizes`** props for responsive images.
- Use **`priority`** only on the above-the-fold hero / LCP image(s); lazy-load everything else.
- Provide **`placeholder="blur"`** (with `blurDataURL`) for hero and product card images.
- Target formats: **AVIF/WebP**. Configure `images.formats` in `next.config`.
- Add an **image-optimization script** (e.g., using `sharp`) in `scripts/optimize-images.mjs` that:
  - converts source images to WebP,
  - resizes to max widths (e.g., 1600px hero, 1200px product main, 600px thumbnails),
  - strips metadata,
  - runs via `npm run optimize:images`.
- Budgets: product card image ≤ ~80 KB, product detail main ≤ ~200 KB, hero ≤ ~250 KB (after optimization).
- Configure long-lived cache headers for static assets (see Section 8).

---

## 5. Phase 3B – Google Sheets as the Database

### 5.1 Sheet design
Create a documented schema (also place a copy in `docs/google-sheets-schema.md`).

**Tab: `Products`**

| Column | Notes |
|--------|-------|
| id | unique, stable |
| slug | kebab-case, matches image folder |
| name | |
| category | e.g., T-Shirts, Shirts |
| price | number |
| currency | e.g., INR |
| description | |
| sizes | comma-separated (S,M,L,XL) |
| colors | comma-separated |
| image_main | filename inside `products/<slug>/` (or empty → convention `main.webp`) |
| image_gallery | comma-separated filenames |
| featured | TRUE/FALSE (show on homepage) |
| in_stock | TRUE/FALSE |
| sort_order | number |
| active | TRUE/FALSE (hide without deleting) |

**Tab: `Inquiries`** (append-only)

| Column | Notes |
|--------|-------|
| timestamp | ISO, server-generated |
| inquiry_id | server-generated unique ID |
| type | contact / product-inquiry / order-request |
| name, email, phone | |
| product_slug, size, quantity | optional |
| message | |
| status | default `NEW` |
| source_page | |

**Optional tab: `Settings`** – site-wide text (announcement bar, contact info) if the current code hard-codes these.

Migrate **all existing hard-coded product data** into the Products tab format and provide a **seed CSV** (`docs/products-seed.csv`) I can import directly into the sheet.

### 5.2 Reading data (products) – NEVER on the visitor's request path
Google Sheets API has strict quotas. With 1,000+ users, reading the sheet per visit **will fail**. Therefore:

- Fetch products **on the server** using the Google Sheets API (service account) or a published-CSV fallback, and **cache the result**.
- Prefer **static generation with ISR** (`revalidate`, e.g., 300–600 seconds) or `fetch` with `next: { revalidate }` / cache tags, so visitors are served pre-built pages from Netlify's CDN.
- Add an optional **on-demand revalidation endpoint** (secured by a secret token) so editing the sheet can trigger a refresh (e.g., via Apps Script `onEdit` → webhook).
- Add a **build-time snapshot**: at build, write `data/products.snapshot.json`. If Sheets is unreachable at runtime or build, **fall back to the last snapshot** so the site never goes blank.
- Validate all sheet data with a schema (e.g., **zod**): trim strings, coerce numbers/booleans, skip invalid rows with a logged warning (don't crash the page).

### 5.3 Writing data (inquiries/orders)
- Create a server-side **route handler / server action** (e.g., `app/api/inquiry/route.ts`) that appends a row to the `Inquiries` tab.
- Credentials (service account) live **only in environment variables** – never in client code, never committed.
- Required protections:
  - **Server-side validation** (zod) + length limits.
  - **Honeypot field** + basic **rate limiting** (per IP) to block spam bots.
  - Optional: Cloudflare Turnstile / reCAPTCHA hook (leave a clean integration point; ask me before enabling).
  - Sanitize values to prevent **spreadsheet formula injection** (prefix cells beginning with `=`, `+`, `-`, `@` with `'`).
  - Return friendly success/error responses; **retry with exponential backoff** on Google 429/5xx errors.
- **Alternative to evaluate and document in `EXPANSION.md`:** a **Google Apps Script web app** as the write endpoint (uses `LockService` to avoid concurrent-write collisions, avoids service-account setup). Recommend one approach with reasons, then implement it.
- Because many users may submit at once, design for **write bursts** (Sheets allows limited writes per minute): batch/queue if appropriate, and make the form show a success state quickly without blocking on the sheet response if you implement a queue. Document the limits honestly.
- Optional: send an email notification to the Fikado team on new inquiry (only if I confirm which service to use).

### 5.4 Remove the old backend assumptions
- Delete or disable all Spring Boot / `localhost` API calls, axios base URLs, and unused backend-related code.
- Remove unused dependencies. Keep `package.json` lean.
- If cart/checkout depended on backend persistence, **simplify**: the cart lives in client state (localStorage-safe, hydration-safe), and "checkout" becomes an **order request** saved to the `Inquiries` sheet (unless I tell you a payment gateway is required). Ask me before changing checkout behavior significantly.

---

## 6. Phase 3C – Performance Optimization (target: "100%")

Aim for **Lighthouse ≥ 95 on Performance, Accessibility, Best Practices, SEO** (mobile profile) on the home, product list, and product detail pages. Core Web Vitals targets: **LCP < 2.5s, CLS < 0.1, INP < 200ms, TTFB low via CDN**.

Do all of the following where applicable:

**Rendering & data**
- Use **Server Components / SSG / ISR** by default; add `"use client"` only where interactivity requires it (App Router).
- Avoid client-side data fetching for product lists; pass pre-fetched data down.
- Use `generateStaticParams` for product detail pages.
- Add loading states (`loading.tsx` / skeletons) and error boundaries.

**JavaScript**
- Analyze the bundle (`@next/bundle-analyzer`); remove heavy/unused libraries.
- **Dynamic import** (`next/dynamic`) for below-the-fold or interaction-only components (modals, carousels, cart drawer).
- Avoid large icon libraries imported whole; import individual icons.
- Defer third-party scripts using `next/script` (`afterInteractive` / `lazyOnload`).

**Fonts**
- Use **`next/font`** (Google or local) with `display: swap`, subsetting, and only the weights actually used. Remove any CSS `@import` / `<link>` font loading.
- Preload only critical fonts.

**CSS**
- Remove unused CSS; keep Tailwind purge/content paths correct.
- No render-blocking external stylesheets.

**Images** – see Section 4.3.

**Navigation**
- Use `next/link` with prefetching for key routes.

**SEO & metadata (also part of the score)**
- Per-page `metadata` (title, description), Open Graph + Twitter images, canonical URLs.
- `sitemap.xml`, `robots.txt`, structured data (`Product` JSON-LD on product pages).
- Semantic HTML, alt text on all images, proper heading order, accessible color contrast and focus states.

**Quality gates**
- `npm run build` must pass with **zero errors** and no ESLint/TypeScript errors.
- Remove `console.log`s and dead code.
- Run Lighthouse (or document how I should) and record before/after scores in `EXPANSION.md`.

---

## 7. High-Traffic Plan (1,000+ simultaneous users)

The architecture must make sure **visitors almost never trigger work on your servers or Google**:

1. **CDN-first:** pages, JS, CSS, fonts, and images served from Netlify's global CDN with long cache lifetimes. Hashed static assets: `Cache-Control: public, max-age=31536000, immutable`.
2. **Static + ISR for all product/portfolio pages** – no per-request Sheets reads.
3. **Sheets protection layers:** ISR cache → in-memory cache (short TTL) → build-time JSON snapshot fallback.
4. **Image optimization at the edge** via Netlify's image CDN / `next/image` (so no image is processed per visit more than once).
5. **Inquiry endpoint** is the only dynamic write path: keep it light, rate-limited, validated, and resilient (retry/backoff, graceful errors).
6. **Graceful degradation:** if Google Sheets is down, the site still loads (snapshot), and inquiry forms show a helpful message with a fallback contact method (email/WhatsApp from config).
7. **No layout shift / no font flash / no broken images** under load: fixed image dimensions, `next/font`, skeletons, placeholders.
8. Include a **load-test plan** in `EXPANSION.md` (e.g., k6 or Artillery script in `scripts/loadtest/`) targeting the home page and product pages, plus the guidance that the inquiry endpoint should be tested at a realistic (lower) rate. Do **not** run load tests against production Google Sheets without telling me.

Be honest in `EXPANSION.md` about the **Google Sheets API quota limits** and where this architecture is safe vs. where it would need a real database in the future.

---

## 8. Netlify Deployment Preparation

- Confirm the Next.js version works with Netlify's current Next.js runtime (OpenNext-based adapter). Check Netlify's current docs rather than assuming; if a plugin or version pin is needed, add it.
- Create **`netlify.toml`** with:
  - build command and publish settings appropriate to the project,
  - Node version pin,
  - security + caching headers (static assets immutable; HTML short/revalidate; `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`/frame-ancestors, a sensible CSP if feasible without breaking the app),
  - redirects (`www` ↔ apex consistency, trailing slash policy).
- Create **`.env.example`** listing every required variable with comments (never real secrets), e.g.:
  - `GOOGLE_SHEET_ID`
  - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
  - `GOOGLE_PRIVATE_KEY` (note about `\n` handling)
  - `REVALIDATE_SECRET`
  - `NEXT_PUBLIC_SITE_URL`
  - (any Apps Script URL / captcha keys if used)
- Make sure `.gitignore` excludes `.env*` (except `.env.example`), `.next`, `node_modules`.
- Write **`docs/DEPLOYMENT.md`**: step-by-step for me (push to GitHub → connect repo in Netlify → add env vars → deploy → verify), including how to set up the Google Cloud service account and share the sheet with it.
- Provide a **post-deploy smoke test checklist** (home loads, products show, inquiry saves to sheet, images/fonts load, 404 page works, sitemap reachable).

---

## 9. GoDaddy Domain Connection (document only)

In `docs/DEPLOYMENT.md`, include clear steps for connecting the custom domain:

1. Add the custom domain in Netlify (Domain management).
2. In GoDaddy DNS: set the records Netlify instructs for the apex domain and a **CNAME for `www`** pointing to the Netlify site subdomain. **Use the exact values shown in the Netlify dashboard / current Netlify docs** – do not hard-code IPs from memory.
3. Remove conflicting default GoDaddy records (parked A record, etc.).
4. Enable HTTPS (Netlify's automatic certificate) and force HTTPS.
5. Set the primary domain (apex or `www`) and redirect the other.
6. Note DNS propagation time and how to verify.
7. Mention the alternative of delegating DNS to Netlify DNS and its trade-offs.

---

## 10. Working Rules for You (the Agent)

1. **Phase order matters:** understand → write `EXPANSION.md` → implement → verify.
2. **Don't guess.** If something is unclear (e.g., checkout behavior, payment needs, which notification service), ask me a concise question and continue with other work meanwhile.
3. **Preserve the UI and functionality** unless a change is listed here.
4. Make **small, logical commits/steps** and explain each in the changelog.
5. **Never commit secrets.** Never put secrets in client-side code.
6. Prefer **TypeScript types** and shared schemas for products and inquiries.
7. Add concise code comments only where the "why" isn't obvious.
8. After implementation, run: install → lint → type-check → build → (optional) Lighthouse, and report results.
9. If a requirement here conflicts with the codebase reality, explain the conflict and propose the best alternative.

---

## 11. Final Deliverables Checklist

- [ ] Phase 1 summary + inventory table posted
- [ ] `EXPANSION.md` created and complete
- [ ] All hard-coded/temporary images removed; structured `public/images/` system in place
- [ ] `lib/images` helper + placeholders + `public/images/README.md`
- [ ] `scripts/optimize-images.mjs` + npm script
- [ ] Products load from Google Sheets (ISR + snapshot fallback + zod validation)
- [ ] Inquiry/order form writes to Google Sheets (validation, rate limit, honeypot, formula-injection protection, retries)
- [ ] `docs/google-sheets-schema.md` + `docs/products-seed.csv`
- [ ] Spring Boot / backend / localhost code and unused dependencies removed
- [ ] `next/font`, `next/image`, dynamic imports, script deferral applied
- [ ] SEO: metadata, sitemap, robots, JSON-LD, alt text
- [ ] `netlify.toml`, `.env.example`, `.gitignore` verified
- [ ] `docs/DEPLOYMENT.md` (Netlify + Google service account + GoDaddy)
- [ ] Load-test plan/scripts in `scripts/loadtest/`
- [ ] Clean `npm run build` with zero errors
- [ ] Before/after performance scores recorded in `EXPANSION.md`

**Begin with Phase 1 now. Do not modify code until you have posted your understanding summary and created `EXPANSION.md`.**
