# Updation on Demo: Client Change Requests (Post 1st Demo)

> **Read this entire file before touching any code.** Every section is mandatory. Do not skip, merge, shorten or "assume done" any requirement. If something is unclear, inspect the codebase to find the real answer instead of guessing.

---

## 0. Context

- The client reviewed our first demo and sent **6 change requests** (Requirements 1 to 6 in Section 3).
- We also have **2 platform requirements** (Requirements 7 and 8 in Section 3): remove Netlify completely and wire CI/CD to Vercel.
- **Hosting platform change:** the application was originally built to be hosted on Netlify. It has now been **switched to Vercel and is hosted only on Vercel**. From now on, the codebase, configuration, CI and documentation must treat Vercel as the single and only deployment platform. No trace of Netlify may remain.
- The application is deployed on **Vercel** and must be **production grade**.
- Expected real-world load: **thousands to tens of thousands of concurrent users**.
- The failures we must prevent in production:
  1. Slow or delayed image loading.
  2. Slow or delayed content rendering (product lists, category pages, item pages).
  3. Slow, failed, duplicated or lost **order placement**.
- Every change in this task must be judged against those three risks. If a change makes any of them worse, redo it.

---

## 1. Operating Rules for the Agent (Non-Negotiable)

### 1.1 Do not hallucinate
- Never invent file names, components, env vars, sheet column names, brand facts, URLs, phone numbers, addresses or social links. **Read the codebase and the data source first** and use only what exists.
- If a fact you need (for example the brand's legal name, domain, logo path) is not in the repo, check `package.json`, `.env.example`, layout/metadata files, README, and the sheet-reading code. If it is still missing, use a clearly marked `TODO` env var, and list it in the report under "Open items". Never fabricate a value.
- Never claim something works without having actually run/verified it. Report results honestly, including failures.

### 1.2 Do not skip
- Work through requirements **1 to 8 in order**. Track each in the task list and mark complete only after its acceptance criteria (Section 3) pass.
- Do not stop at the first fix. Each requirement has an investigation step, an implementation step and a verification step.

### 1.3 Code quality standards
- **No boilerplate, no dead code, no placeholder logic, no commented-out code, no `console.log` debugging** left behind (structured server-side logging for real operational events is fine).
- **No unwanted files.** Do not create scratch files, duplicate components, backup copies, test fixtures you don't need, or unused assets. Only create a new file when it is genuinely required (for example `llms.txt`, `humans.txt`, the report). Edit existing files where possible.
- Reuse existing utilities, components, types and design tokens. Follow the existing folder structure, naming, formatting and lint rules.
- Strict TypeScript (if the project uses it): no `any`, no `@ts-ignore` without a written reason.
- Remove anything that becomes unused because of your changes (imports, components, CSS, env vars, dependencies).
- Do not add a new dependency unless it is clearly necessary. Prefer platform/Next.js built-ins. If you add one, justify it in the report.
- Accessibility (keyboard, focus, ARIA, contrast, reduced motion) and mobile-first responsiveness are part of "done".

### 1.4 Production and performance standards (Vercel, high traffic)
Apply these to everything you touch, and fix violations you find in the code paths related to the six requirements:

**Images (delay prevention)**
- Use `next/image` (or the project's existing optimized equivalent) everywhere, with correct `width`/`height` or `fill` + `sizes`, so there is **no layout shift** and no oversized downloads.
- Above-the-fold or LCP images: `priority`. Everything else: lazy loading. Use blur/low-quality placeholders or fixed aspect-ratio boxes where practical.
- Make sure remote image hosts are configured in `next.config` (`images.remotePatterns`), modern formats (AVIF/WebP) are enabled, and `minimumCacheTTL` is sensible so the Vercel image CDN caches aggressively.
- Never ship full-resolution originals to list/grid views. Full resolution is only for the close-up/zoom view.

**Content and data (delay prevention)**
- Product/category data coming from the sheet must **not** be fetched fresh from the source on every user request. Use caching appropriate to the project's Next.js version (ISR / `revalidate`, `fetch` cache tags, `unstable_cache` / `use cache`, or cached route handlers), plus CDN cache headers (`s-maxage`, `stale-while-revalidate`) on `GET /api/products` and similar read endpoints.
- Avoid request waterfalls and N+1 reads: batch sheet reads, fetch once, share the result.
- Respect upstream quotas (for example the Google Sheets API read/write limits per minute). Thousands of users must **never** each trigger a direct sheet read.
- Keep client JS small: server components by default, `dynamic()` import heavy or rarely used client components (zoom viewer, cookie preferences modal, etc.), no large libraries for small jobs.
- Static or prerendered pages wherever the data allows. Add `loading.tsx`/Suspense boundaries where a segment can stream.

**Order placement (reliability)**
- Order creation must be **fast, idempotent and safe under concurrency**: no duplicate order references, no overwritten rows, no lost orders when many users order at the same time.
- Validate input on the server (schema validation), sanitize, rate limit the endpoint per IP/session, return clear error codes, and never leave the user on an endless spinner (client timeout plus retry-safe handling).
- Do not hold requests open on slow third-party calls longer than necessary. Respect Vercel function duration limits; use `maxDuration` deliberately.
- Log failures with enough context (order ref, stage, duration) to debug, never log personal data such as phone or address in plain form.

**General**
- Run `lint`, `typecheck` and a **production build** (`next build`) at the end. Zero errors; investigate and fix new warnings you introduced.
- Check bundle/route sizes in the build output and confirm that nothing you added caused an unexplained jump.
- Never hard-code secrets. Use environment variables, and document any new one in `.env.example`.

---

## 2. Before You Start (Discovery)

1. Read the project structure, `package.json` (Next.js version, scripts), `next.config.*`, root `layout`, and the existing **progress markdown file** (find it, for example `PROGRESS.md` / `progress.md`; do not create a second one).
2. Identify: how product/item data is read from the sheet, how orders are written, where the splash screen, cookie banner, category filter and item/image viewer live.
3. Find everything Netlify-related and the existing CI workflow (`.github/workflows/ci.yml` or `ci.yaml`; if it lives elsewhere, find it, and do not create a second pipeline). See Requirements 7 and 8.
4. Create a task list: one task per requirement (1 to 8), plus tasks for "final verification" and "progress and report files".

---

## 3. Client Requirements

### Requirement 1: Cookie approval logic and permissions: verify real vs dummy

**Client ask:** Check whether the cookie approval logic and the permissions are functional or just dummy. Confirm they work properly.

**What to do**
1. Audit the cookie banner/consent component and everything connected to it. Determine for each consent category (necessary, analytics, marketing, preferences, and any other that exists) and for each permission (for example notifications, location, camera, or any browser permission the app requests) whether it is **actually wired** to behaviour or only a UI toggle.
2. Verify, by reading code **and** by running the app:
   - Choice is **persisted** (cookie or localStorage) and survives reload and new sessions, with a sensible expiry.
   - **No non-essential script, tag, pixel or cookie loads or is set before consent** (check analytics, ad, chat, embed and font/third-party scripts, and the Network and Application tabs).
   - **Accept all**, **Reject non-essential** and **custom/save preferences** each do what their label says. Reject must be as easy and as prominent as Accept.
   - Changing consent later (a "Cookie settings" re-open link, for example in the footer) works, and withdrawing consent stops the related scripts and removes their cookies.
   - Banner does not flash on every page load for returning users, does not cause layout shift, and is keyboard/screen-reader accessible.
   - Permission prompts (if any) are requested only in response to a user action or clear need, and denial is handled gracefully.
3. **If any part is dummy or broken, implement it properly** (real gating of scripts by consent, real persistence, real preference re-opening). Keep it lightweight; do not add a heavy consent library unless the project already uses one.
4. Make sure the privacy/cookie policy text matches what the app really does.

**Acceptance criteria**
- A written table in the report: *each consent category/permission → functional or dummy (before) → status after fix → how it was verified*.
- Demonstrated: with consent denied, the Network tab shows no non-essential third-party requests and no non-essential cookies.

---

### Requirement 2: Diagnose and fix the order and sheet-row warning

**Client ask:** Identify why this error occurred and fix it properly.

```
GET /api/products 200 in 14ms (next.js: 4ms, application-code: 9ms)
[Orders] Using WEAKER sheet-row mode. Requires protected rows and strictly never deleting rows.
[Order API] Order completed: ref=FIC-A1018 mode=sheet-row (1518ms)
```

**What to do**
1. Find where the message `Using WEAKER sheet-row mode` is logged. Read the full order-write logic and determine **exactly why** the code fell back to the "weaker" mode (for example a missing env var or credential, a missing Apps Script/atomic-append endpoint, a missing capability or a failed feature check). **State the real root cause with evidence from the code; do not guess.**
2. Understand what "weaker" means here in terms of risk: reference/ID generation by reading row counts, race conditions between simultaneous orders, duplicate refs (such as `FIC-A1018`), overwritten or shifted rows if rows are ever deleted or sorted.
3. **Fix it properly** so that production uses the **strong, concurrency-safe mode** and never silently degrades:
   - Make the strong path the default and correctly configured (document any required env var or deployment setting in `.env.example` and the report).
   - Use atomic append and a collision-proof order reference (for example a locked/atomic counter or a unique-ID strategy) so two simultaneous orders can never get the same ref or write to the same row.
   - If a fallback must remain, it must be explicit, safe, rate limited, and logged at the correct level with a clear actionable message. In production, a missing strong-mode configuration should fail loudly at startup or in health checks, not quietly degrade.
   - Ensure the order write is **idempotent** (retry or double-click safe, for example via an idempotency key) and validated on the server.
4. Investigate the **1518 ms** order duration. Identify where the time goes (auth, sheet read, sheet write, notification/email, and so on). Reduce it: remove redundant sheet reads, parallelise independent work, move non-critical work (notifications, secondary logging) off the critical path where the platform allows, and cache auth clients/tokens across invocations. Report before and after timings.
5. Clean the log output: keep one concise, meaningful line per event, with no noisy or misleading warnings.
6. Load-test the order flow locally with a simple concurrent script (for example 20 to 50 parallel orders against a test sheet or mock). Confirm: no duplicate refs, no lost orders, no row overwrites. **Do not commit the script** unless the project already has a place for such scripts. Record results in the report.

**Acceptance criteria**
- Root cause is documented in the report.
- The `WEAKER` warning no longer appears in a correctly configured environment, and the strong mode is confirmed active.
- Concurrency test shows zero duplicates or losses.
- Order latency measurably improved, with numbers.

---

### Requirement 3: Splash screen: show only when the app is actually slow

**Client ask:** Change the splash screen logic from "display 2 sec first, then navigate to home" to "only show when the app is delayed or loading when the user clicks the app link and visits the website for the first time".

**What to do**
1. Locate the current splash logic and **remove the fixed 2-second timer** and any artificial delay or redirect-to-home pattern.
2. New behaviour:
   - The splash appears **only on a user's first visit** (per browser, tracked with a small persistent flag) **and only if the app is genuinely slow to become ready**. Use a short grace threshold (for example ~400 to 800 ms; choose one and justify it in the report). If the app is ready before the threshold, the splash **never renders**.
   - If shown, it disappears **immediately** when the app is ready (critical content and fonts/hero rendered). Add a small minimum visible time only to prevent a distracting flash, and keep it very short.
   - Returning visitors never see it, even on a slow connection.
   - It must never block or delay the content for a fast load, never cause layout shift or flicker, and must never trap the user. Add a hard timeout failsafe so it always dismisses.
   - Works with SSR/hydration without hydration-mismatch warnings (decide visibility on the client, or via a tiny inline script that avoids a flash for returning users).
   - Respect `prefers-reduced-motion`, and make it accessible (`aria-busy`/`role="status"` where appropriate).
3. Remove any now-unused splash code, state, CSS and assets.

**Acceptance criteria**
- Fast network, first visit: no splash.
- Throttled network (DevTools "Slow 3G"), first visit: splash shows, then dismisses as soon as the content is ready.
- Return visit on a throttled network: no splash.
- No console hydration warnings. Lighthouse performance is not worse than before.

---

### Requirement 4: Category filter must be 100% functional and data-driven

**Client ask:** In the category section the filter option must be fully functional. All colors must come from the item sheets and be displayed in the filter. The price range should start from 1. Confirm the filter works.

**What to do**
1. Audit the whole filter feature (UI, state, URL handling and the data layer) and fix every defect.
2. **Colors:**
   - Build the color list **dynamically from the item sheet data** (the color field of the actual items in that category/page context). No hard-coded or dummy color list.
   - Normalise (trim, case-insensitive match, de-duplicate), handle multiple colors per item if the sheet allows it, handle empty/missing values safely, and show an accurate swatch for each color (map names to swatch colors in one place; unknown names get a sensible, accessible fallback).
   - Selecting colors filters products correctly (multi-select behaviour should be clear and consistent).
3. **Price range:**
   - **Minimum starts at 1** (not 0). Maximum is derived from the highest real price in the data. Handle the single-price and empty-category edge cases.
   - Slider/inputs are validated (min ≤ max, numeric only, no negative or NaN), and both ends filter correctly.
4. Verify every other filter control present (size, brand, sort, availability, and so on) works and combines correctly with the others (AND logic across groups, as users expect).
5. UX and state: show active filters with a clear/reset action, show a helpful empty state ("no items match"), show the result count, keep filter state in the **URL query string** (shareable, back-button safe), debounce the price input, and keep it smooth on mobile (drawer/sheet that is usable and accessible).
6. Performance: filtering on thousands of items must be fast. Memoise derived data, avoid re-fetching the product list on each filter change, and do not re-render the entire grid unnecessarily.

**Acceptance criteria**
- Colors shown in the filter exactly match those present in the sheet data for the category (verified against the data).
- Price min is 1, max equals the highest item price.
- Each filter alone and in combination returns correct results (list the test cases you ran in the report).
- Filter state survives reload and is shareable via URL.

---

### Requirement 5: SEO alignment (all files and metadata aligned to the brand)

**Client ask:** Make sure `sitemap.xml`, `llms.txt`, `robots.txt`, `humans.txt` and, most importantly, meta objects, JSON-LD and meta keywords are all perfectly aligned to the brand and our application.

**What to do**
1. Extract the true brand facts from the codebase (name, tagline/description, domain, logo, contact details, social profiles, categories, product types, locale, currency, location). **Use only real values**; unknown ones go through env vars and the report's open-items list.
2. Define the canonical site URL **once** (env var such as `NEXT_PUBLIC_SITE_URL`) and use it everywhere (metadataBase, sitemap, robots, canonical tags, JSON-LD).
3. **`sitemap.xml`**: generate dynamically with the Next.js metadata route (`app/sitemap.ts`). Include the home page, category pages and all product/item pages from the real data, with correct absolute URLs and `lastModified`. Exclude cart/checkout/api/admin and other private routes. If the URL count can grow beyond 50,000, split the sitemap.
4. **`robots.txt`**: via `app/robots.ts`. Allow public pages, disallow private/API/checkout routes, reference the sitemap URL.
5. **`llms.txt`**: a concise, accurate, brand-aligned description for AI crawlers: who we are, what we sell, key URLs (categories, key pages), contact and policies. Real facts only. Serve it from `public/` or a route.
6. **`humans.txt`**: team/credits/site/tech info that is accurate. Serve it from `public/`.
7. **Metadata (`generateMetadata` / `metadata`)**: for the root layout and every route type (home, category, item, and the static pages):
   - Unique, brand-aligned `title` (with a title template) and `description` of proper length.
   - `keywords` that are relevant to the brand and, on category/item pages, the specific category/item (no keyword stuffing or irrelevant terms).
   - `alternates.canonical`, `openGraph` (title, description, url, siteName, locale, image), `twitter` card, `robots` directives (index/follow on public pages, `noindex` on private pages), icons, `themeColor`, `viewport`, and `manifest` if the app is installable.
   - Open Graph images that exist, are correctly sized and are served optimized.
8. **JSON-LD structured data** (inject as a `<script type="application/ld+json">`, safely serialised, escaping `<`):
   - Site-wide: `Organization` (or `LocalBusiness`/`Store` if that fits the brand) and `WebSite` (with `SearchAction` only if site search really exists).
   - Item pages: `Product` with `name`, `image`, `description`, `sku`, `brand`, `offers` (price, `priceCurrency`, `availability`, `url`). **Only include `aggregateRating`/`review` if real review data exists.**
   - Category pages: `ItemList`/`CollectionPage`. Pages with depth: `BreadcrumbList`.
   - Validate for correctness (valid types/properties, values match visible page content).
9. Make sure heading structure (one `h1` per page), semantic HTML, image `alt` text, `lang` attribute and internal links support SEO.
10. Ensure all of the above stays **cached and fast** (generated at build/ISR, not computed per request).

**Acceptance criteria**
- `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/humans.txt` all load with HTTP 200 and correct content on the production build.
- Metadata and JSON-LD verified on home, a category page and an item page (view-source), with brand/URL consistency across all of them.
- No placeholder or fabricated values anywhere.

---

### Requirement 6: First-time hand gesture hint on the item image (tap for close look)

**Client ask:** When a user opens an item, they view the image and details. The app already supports tapping the image again to get a full/close-up view, but most users are unaware. On the first item open, show a hand gesture hint on the first image, once, so users learn to tap the image for detail.

**What to do**
1. Locate the item detail page and its existing tap-to-zoom/full-view behaviour. **Do not break or rewrite that feature**, only add the hint on top of it.
2. Implement a small animated **hand/tap gesture hint** overlaid on the **first/main item image**:
   - Shows **once per user** (the first time they open any item), tracked by a persistent flag (localStorage, wrapped in try/catch for private mode).
   - Include a short label such as "Tap image for a closer look" (match the app's tone and language).
   - It is **dismissed permanently** when the user taps the image (and opens the full view), taps the hint, scrolls away, or after a short timeout (about 4 to 6 seconds). After any dismissal, the flag is set so it never shows again.
   - The hint must not block taps: use `pointer-events: none` on the decorative layer, or make sure the tap passes through and still opens the full view.
   - Lightweight: use CSS animation with an inline SVG icon or an existing icon (no new heavy library, no large GIF or Lottie). Animate only `transform`/`opacity`. Respect `prefers-reduced-motion` (use a static icon and label instead).
   - Must not cause layout shift, must not delay the LCP image, and render only on the client after hydration (no hydration mismatch).
   - Accessible: the label text is available to screen readers (or is clearly decorative with `aria-hidden` plus an equivalent accessible hint), and the hint does not steal focus.
   - Works on mobile (primary) and desktop (cursor/hand variant or the same hint).
3. Keep the code isolated in one small component plus a tiny hook if needed, with no duplication.

**Acceptance criteria**
- First item open (fresh storage): hint appears on the first image and the tap opens the full view and dismisses the hint forever.
- Second item open or reload: no hint.
- With reduced motion enabled: static, non-animated hint.
- No layout shift and no hydration warnings.

---

### Requirement 7: Remove Netlify permanently (Vercel is the only platform)

**Ask:** The app moved from Netlify to Vercel. All Netlify-dedicated files and every Netlify-related title, heading or content must be permanently removed. The application must be hosted only on Vercel.

**What to do**
1. **Search the whole repository, case-insensitively,** for `netlify` (and related terms: `.netlify`, `NETLIFY_`, `@netlify`, `netlify.toml`, `_redirects`, `_headers`, `netlify/functions`, `netlify-cli`, `deploy-preview`, `context.deploy`). Include source, config, scripts, workflows, README and all markdown docs (including the progress file), `.env*` files, `.gitignore`, `package.json` scripts, comments, UI text and metadata.
2. **Before deleting, migrate any behaviour that Netlify provided**, so that nothing breaks on Vercel. Check for:
   - Redirects, rewrites and custom headers (`netlify.toml`, `_redirects`, `_headers`) → move to `next.config.*` (`redirects`, `rewrites`, `headers`) or `vercel.json` only if Next.js config cannot express it.
   - Netlify Functions / Edge Functions / scheduled or background functions → port to Next.js route handlers (with a deliberate `runtime` and `maxDuration`) or Vercel Cron. If the logic is now unused, delete it.
   - Netlify-specific env var detection (for example `process.env.NETLIFY`, `URL`, `DEPLOY_URL`, `CONTEXT`) → replace with the single site URL env var (see Requirement 5) and Vercel's system env vars (for example `VERCEL_ENV`, `VERCEL_URL`) where truly needed.
   - Netlify plugins and adapters (for example `@netlify/plugin-nextjs`, `@netlify/functions`, `netlify-cli`) → remove from `package.json`, then regenerate the lockfile with the project's package manager so no Netlify package remains in it.
3. **Delete permanently** (do not rename, archive or comment out): `netlify.toml`, the `.netlify/` directory, `netlify/` folders, `_redirects`/`_headers` files that exist only for Netlify, Netlify build scripts, Netlify badges/links, and Netlify entries in `.gitignore` and `.env.example`.
4. **Rewrite documentation** (README, deployment notes, the progress file, code comments) so it describes Vercel only. Do not leave "migrated from Netlify" notes in the app or docs. (The removal log in `UPDATE_REPORT.md` may name the removed files, and that is the only allowed place.)
5. Add a `vercel.json` **only if something really needs it** (for example cron jobs or function settings that cannot live in `next.config`). Do not add an empty or boilerplate one. Do not add the Vercel project ID, org ID or token anywhere; those are handled through secrets (Requirement 8).
6. Confirm the production build still passes and the redirects, headers and any ported function behave the same as before.

**Acceptance criteria**
- `grep -ri netlify` over the repository (excluding `node_modules`, build output and `.git`) returns **zero** matches, and the lockfile has no Netlify packages. The report includes the command and its empty output.
- Everything Netlify used to provide still works on Vercel (redirects, headers, functions), verified on the production build.
- No Netlify-related files, headings, titles, comments or UI text remain.

---

### Requirement 8: CI/CD: auto-deploy to Vercel after all tests pass

**Ask:** Update the existing `ci.yml` so that, once all checks pass, the application is automatically deployed to Vercel. The Vercel IDs and details have **not** been added yet, so do not hard-code or invent them.

**What to do**
1. Open the existing CI workflow and **update it in place** (keep its current checks). Remove any Netlify steps, secrets or references from it.
2. Structure the pipeline as **two jobs**:
   - **`test` job** (runs on every push and pull request): checkout, setup Node with the version the project uses (read it from `package.json` engines or `.nvmrc`), install dependencies with the lockfile (`npm ci` / `pnpm install --frozen-lockfile` / `yarn --frozen-lockfile`, matching the project), dependency caching, **lint, typecheck, tests (if any) and `next build`**.
   - **`deploy` job**: `needs: test`, so it runs **only if every test and build step succeeded**. It deploys to **production only on pushes to the main branch** (use the project's real default branch name). Pull requests may get a **preview** deployment, if that is simple to do safely; otherwise PRs just run `test`.
3. Deploy with the **Vercel CLI** inside the workflow, using the standard prebuilt flow:
   - `vercel pull --yes --environment=production --token=$VERCEL_TOKEN`
   - `vercel build --prod --token=$VERCEL_TOKEN`
   - `vercel deploy --prebuilt --prod --token=$VERCEL_TOKEN`
   (Use `--environment=preview` and no `--prod` for PR previews.) Pin or install the CLI deliberately (for example via `npx vercel@<version>`), not an unpinned global install.
4. Read credentials **only from GitHub Actions secrets**: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`. **Do not put real or placeholder-looking IDs into the file.** The values will be added by the owner later. Document these three secret names in the README deployment section and in the report, with a one-line explanation of where to get each.
5. Production hygiene for the workflow:
   - Least-privilege `permissions:` block at the top (for example `contents: read`).
   - `concurrency` group per ref, so two deploys never race (cancel in-progress for PRs; **do not cancel an in-progress production deploy**; queue it).
   - Sensible `timeout-minutes` on jobs. Pin action versions (major version tags at least).
   - The deploy job must **fail loudly with a clear message** if any of the three secrets is missing, rather than silently skipping the deployment.
   - Never echo secrets. Never run the deploy job from forked-PR contexts where secrets are not available.
   - Output the deployment URL in the job summary.
6. Note in the report and README (briefly): to avoid **double deployments**, the Vercel project's own Git auto-deploy should be turned off once this workflow is the deployment path (or the workflow should be the only one deploying). Leave the choice and instructions to the owner, since it is a Vercel dashboard setting.
7. Validate the YAML (valid syntax, correct indentation, `needs` and `if` conditions correct). If `actionlint` is available, run it. State clearly in the report that the deploy step itself could not be exercised until the secrets are added.

**Acceptance criteria**
- `ci.yml` contains the test job and a deploy job that depends on it and runs on the main branch only.
- No Netlify content, and no hard-coded Vercel IDs or tokens, anywhere in the workflow.
- The workflow passes syntax validation, and the required secrets are documented.

---

## 4. Final Verification Checklist (do all before finishing)

- [ ] `lint`, `typecheck` and `next build` pass with **zero errors**. No new warnings.
- [ ] Production build run locally (`next start`) and all six requirements manually verified there, not just in dev mode.
- [ ] Image loading verified on a throttled network: correct sizes, lazy loading and `priority` on the LCP image, no layout shift.
- [ ] `GET /api/products` returns with caching headers and is not hitting the sheet on every request.
- [ ] Order placement tested: success path, validation failure, double-submit and concurrent orders. No duplicates and no lost rows.
- [ ] Lighthouse (mobile) checked on home, category and item pages. Report performance, accessibility, best-practices and SEO scores. Fix any regression caused by this task.
- [ ] No unused files, imports, dependencies, env vars or commented-out code remain. `git status` shows only intentional changes.
- [ ] New env vars documented in `.env.example`.
- [ ] Case-insensitive search for `netlify` across the repository returns zero matches (excluding `node_modules`, `.next` and `.git`). No Netlify files, packages, headings or content remain.
- [ ] `ci.yml` validated: test job runs lint, typecheck, tests and build; deploy job depends on it and targets Vercel production on main only; secrets are referenced, not hard-coded.
- [ ] README deployment section describes Vercel only and lists the three required GitHub secrets.

---

## 5. Required Deliverables After the Work Is Complete

### 5.1 Update the existing progress file
- Find the **existing** progress markdown file in the project and **update it**. Do not create a new progress file.
- Follow its current format. Add an entry for this task (date: 2026-10-11) listing each of the 8 requirements with its status (done/partial/blocked), plus any remaining open items or follow-ups.

### 5.2 Create the report file
- Create **one new file** named `UPDATE_REPORT.md` in the project root (unless the project already has a `docs/` or reports convention, in which case follow that).
- It must be detailed enough that someone who did not watch the work can fully understand it. Include:
  1. **Summary**: what was requested and the overall outcome.
  2. **Per requirement (1 to 8)**:
     - *Findings*: what was discovered (for example the dummy-or-functional table for cookies, the root cause for the order warning).
     - *Changes made*: what was changed **and how/why** (approach, key decisions, trade-offs), with the list of files created/modified/deleted.
     - *Verification*: exactly how it was tested and the results (commands, scenarios, before and after numbers).
  3. **Performance and production-readiness notes**: caching strategy, image optimization decisions, order-flow reliability measures, and measured results (Lighthouse scores, order latency before and after, concurrency test outcome).
  4. **Files changed**: a complete list grouped as added, modified, removed.
  5. **Configuration changes**: new or changed env vars and deployment steps for Vercel.
  6. **Open items and risks**: anything unresolved, assumptions made, and values that need client input. Must include: the Vercel secrets still to be added (`VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`) and the dashboard setting about Vercel Git auto-deploy.
  7. **Netlify removal log**: every Netlify file, package, config entry and mention that was removed, any behaviour that was migrated to Vercel/Next.js, and the empty result of the final `netlify` search.
  8. **CI/CD summary**: what the updated `ci.yml` does, job by job, and how deployment is triggered.
  9. **How to verify**: short steps the team can follow to re-check each requirement.
- Be honest: report anything that could not be completed or verified, and why.

---

## 6. Definition of Done

The task is complete only when all eight requirements (the six client requests plus Netlify removal and Vercel CI/CD) meet their acceptance criteria, the final checklist is fully ticked, the progress file is updated, and `UPDATE_REPORT.md` is created. If any item cannot be done, say so explicitly in the report. Do not mark it as done.
