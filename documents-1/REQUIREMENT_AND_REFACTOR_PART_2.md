# PART 2 – REQUIREMENT & REFACTOR: Ficcado Production Readiness

> **Brand:** **Ficcado** (F-I-C-C-A-D-O). Never write "Fikado" or "FKD".
> **Authority:** This brief supersedes earlier briefs wherever they conflict. Earlier briefs: `AGENT_BRIEF.md`, `AGENT_BRIEF_2_WHATSAPP_ORDERING_REFACTOR.md`, `REFACTOR_ON_PREVIOUS_UPDATE.md`.
> **Timeline:** The owner pushes to production **today**. Phase 1 must be production-ready on its own. Phase 2 starts **only after the owner approves** (see Section 9).
> **Do not push, deploy, or publish anything yourself.** Stop after the report; the owner pushes.

---

## 0. Anti-Hallucination Protocol (mandatory, read twice)

The previous rounds produced invented content (for example: "arranges instant payment via UPI", "2025 genesis" brand story, "tailored fabric engineering" copy, dummy phone number, dummy customer "Arjun Sharma", fake product names, fake reviews) and over-claimed verification. **This must not happen again.**

1. **Never invent business facts.** This includes: founding year, brand story, fabric/GSM/material claims, payment methods, return/refund/replacement windows, delivery areas, delivery times, prices, discounts, offers, contact details, addresses, team names, social media links, reviews, ratings, awards, certifications.
2. **Allowed sources of truth, in this order:** (a) Google Sheets data, (b) environment variables, (c) text already written by the owner in this repo's policy pages, (d) facts stated in this brief, (e) the owner's replies to your questions. Anything else is **not a fact**.
3. If you need a fact you don't have: **leave it out** and add it to the report under `OWNER_INPUT_NEEDED`, or ask the owner a short question. Do not guess. Do not use "typical industry" values.
4. **Only claim what you ran.** Every claim in the report ("build passes", "no mock data", "images load") must be backed by pasted command output, grep results, or measured numbers. If you could not run something (for example, no Google credentials in your environment), write **"NOT VERIFIED: reason"**. Never tick a checkbox without proof.
5. **Prove before deleting.** Before removing any file/function/dependency: grep for references, confirm nothing imports it, delete it, then confirm the build still passes. If purpose is unclear, put it under `NEEDS_DECISION` instead of deleting.
6. **Stay in scope.** No UI redesign. No new features beyond this brief. No renaming of things not mentioned.
7. **Work method:** Inventory → Plan (short, posted in chat) → Implement in small steps → Verify (commands) → Report. If the repo is under git, work on a local branch with small checkpoint commits. **Never push.** Do not rewrite git history.
8. **"Commits/commit messages" ambiguity:** the owner's request mentions removing unwanted "commits"; this is interpreted as **comments and commented-out code**. If you believe something else was meant, ask. Do not alter git history.

---

# PHASE 1: Production Cleanup & Data Integrity

Owner's requirement numbers (R1–R7) are kept so the report can map one-to-one. (The owner's list repeated the "Google Sheets only" requirement twice; they are merged into R5.)

| # | Requirement |
|---|-------------|
| R1 | Remove all boilerplate, hard-coded, mock and dummy values/logic/comments |
| R2 | New item image folder structure inside the project (`public`) |
| R3 | Remove all image-optimization code |
| R4 | Delivery speed options come **only** from the Courier Partners sheet |
| R5 | All sheet-managed values come **only** from Google Sheets, with no dummy fallbacks |
| R6 | FAQ section (large, AI-friendly, accurate) |
| R7 | Production gate + detailed report |

---

## R1. Remove Boilerplate, Hard-Coded, Mock & Dummy Content

### R1.1 What must be removed
- **Mock/dummy data:** `src/data/mockData.ts` and anything like it, `INITIAL_*` arrays, fake products, fake reviews, fake orders, fake users, fake addresses, fake phone numbers/emails (`example.com`, `9876543210`, `919876543210`, `98765 43210`), fake customer names.
- **Committed sample data:** the committed catalog snapshot, seed CSVs containing sample items, and any `SEED_SAMPLE_DATA` seeding code path. Replace seed CSVs with **header-only templates** (`docs/templates/item-management.csv`, `courier-partners.csv`, `new-sale-request.csv`) with column names only.
- **Create-Next-App boilerplate:** default `next.svg`, `vercel.svg`, `file.svg`, `globe.svg`, `window.svg`, default README text, unused default fonts/CSS, default metadata ("Create Next App"), unused starter components.
- **Simulation logic:** `setTimeout` used to fake loading/payment/processing, `Math.random()` used for business data, any fake "success" paths.
- **Comments:** commented-out code, stale `TODO`/`FIXME`, narrative comments that restate the code, comments referencing removed features (auth, wishlist, OTP, payment, Spring Boot, old delivery options). Keep only comments that explain **why**.
- **Dead code:** unused components, hooks, contexts, types, utils, CSS, routes, images, env vars, npm dependencies (run `depcheck`/`knip`, paste output).
- **Invented marketing/brand claims** not provided by the owner (founding year, fabric claims, "premium", "heavyweight", "tailored engineering", UPI/payment statements, delivery-time promises, "free shipping" promos). Remove them or replace them with neutral wording that states only facts allowed by Section 0.
- **Invented announcements/banners:** review `src/data/announcements.ts`. If its text was not supplied by the owner, remove the banner. If you think a banner is useful, ask the owner for the text.
- **Debug leftovers:** `console.log`, debug flags, test pages, stray `.env` values, sandbox routes.
- **Stale docs:** correct or delete statements in `EXPANSION.md`, `docs/*`, README that describe removed or false behavior. Earlier brief files must not be served from `public/`; move them to `docs/briefs/`.

### R1.2 What is allowed to stay hard-coded (allowlist)
- UI labels and static page text written by the owner (policy pages, About copy) **unchanged unless it contradicts the new behavior** (flag contradictions, do not rewrite policies).
- `config/categories.ts` (the six categories and their live/coming-soon status).
- Brand constants (name "Ficcado") and values read from environment variables (`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_WHATSAPP_NUMBER`).
- The FAQ content file (R6), which is editorial content.
- A single shared neutral **placeholder image** (not a fake product).

**Everything else the owner edits regularly must come from Google Sheets** (items, prices, sizes, ratings, review counts, courier partners, orders).

### R1.3 Required sweep (paste results in the report)
Search the whole repo (source, config, docs, public, scripts) and resolve each hit (fix, delete, or justify):

`mockData`, `INITIAL_`, `dummy`, `sample`, `lorem`, `placeholder` (text), `example.com`, `9876543210`, `98765`, `Arjun`, `unsplash`, `picsum`, `https://` image URLs, `setTimeout(`, `Math.random(`, `localhost`, `TODO`, `FIXME`, `console.log`, `fikado`, `fkd`, `149`, `299`, `Indian Post`, `Speed Post`, `DTDC`, `UPI`, `COD`, `razorpay`, `stripe`, `OTP`, `wishlist`, `login`, `signin`, `springboot`, `SEED_SAMPLE_DATA`, `optimize`, `sharp`, `blurDataURL`.

Also list every file in `public/` and state for each: **used / unused (deleted) / needs decision**.

### R1.4 Production safeguards
- Add a build-time check that **fails the production build** if `NEXT_PUBLIC_WHATSAPP_NUMBER` is missing, is not digits-only international format, or matches a known dummy pattern (`919876543210`, `9876543210`, repeated digits).
- Fail the production build if `NEXT_PUBLIC_SITE_URL` is missing or not `https://`.
- Scan the repo for committed secrets (`.env*`, private keys, tokens). If any secret was ever committed, **tell the owner so it can be rotated**.
- `.gitignore` covers `.env*` (except `.env.example`), `.next`, generated files.

---

## R2. Item Image Structure (Images Live in the Project, Not in Sheets)

### R2.1 Structure
Each item has **one folder named after the item**, containing its images numbered `image-1`, `image-2`, `image-3`, … (an item has multiple images; there is no fixed limit, support at least 10).

```text
public/
  images/
    items/
      <item-folder-name>/
        image-1.webp      ← primary image (cards, listings, first in gallery)
        image-2.webp
        image-3.webp
        image-4.webp
        image-5.webp
        image-6.webp
      <another-item-folder-name>/
        image-1.webp
        ...
    brand/                ← logo, favicon sources, og image (real brand assets only)
    hero/                 ← real homepage banners only
    placeholder.webp      ← ONE neutral fallback (not a fake product)
```

### R2.2 Folder name rule (exact, deterministic)
The folder name is the **slug of `item_name` from the Item Management sheet**, produced by **one shared function** `slugify()` used for: image folder lookup, product URL, and anywhere else a slug is needed:

1. Trim and convert to lowercase.
2. Normalize Unicode and strip accents.
3. Replace `&` with `and`.
4. Replace every run of characters that are not `a-z` or `0-9` with a single `-`.
5. Trim leading/trailing `-`.

Example: `Colorado Heavyweight Tee` → `colorado-heavyweight-tee`.
**Case matters:** the owner develops on Windows (case-insensitive) but Netlify builds on Linux (case-sensitive). Folder and file names **must be lowercase with no spaces**, otherwise images will work locally and break in production.

### R2.3 File rules
- Names: `image-<number>.<ext>`, numbers start at 1, continuous (no gaps).
- Allowed extensions: `webp`, `jpg`, `jpeg`, `png`, `avif`.
- Sort **numerically** (`image-2` before `image-10`).
- `image-1` is the primary image everywhere.
- Add `public/images/items/README.md` explaining how to add an item:
  1. Add the row in the **Item Management** sheet.
  2. Create the folder named with the item's slug.
  3. Add `image-1`, `image-2`, … files.
  4. Commit and redeploy (images are part of the build).
  5. Renaming an item in the sheet means renaming its folder too.
- Manual guidance only (no code): all images of one item should share the same aspect ratio (recommended 4:5), be reasonably small before upload (recommend ≤ 1600 px on the long side, WebP or JPG, ideally ≤ 250 KB each). Ask the owner for their preferred aspect ratio; default 4:5.

### R2.4 How the app finds the images (no runtime filesystem guessing)
Netlify serves `public/` from its CDN; serverless functions may not have those files. So discover images **at build time**:

- Add a tiny build step (e.g., `scripts/build-item-image-manifest.mjs`, run as `prebuild`) that **only reads directory and file names** and writes a generated, **git-ignored** manifest `src/generated/item-images.json`: `{ "<folder>": ["image-1.webp", "image-2.webp", …] }`. It must **not** open, resize, convert or inspect image contents. No `sharp`.
- `lib/itemImages.ts` (server-only helper): `getItemImages(item_name)` → ordered array of public URLs (`/images/items/<folder>/<file>`), or `[placeholder]` if no folder exists.
- The build step prints a **validation summary**:
  - **Fail the build** for invalid names (uppercase, spaces, unsupported extension, duplicate slugs from two items).
  - **Warn (don't fail)** for: items in the sheet with no image folder, folders with no matching item (orphans), gaps in numbering. A new sheet row must not break a deploy.
- Rendering: use fixed-aspect containers (`aspect-ratio`) so there is no layout shift. Product cards use `image-1` only; product detail shows all images (first image loaded with priority, others lazy). No client-side `onError` fallback logic; fallbacks are resolved at build/render time.

### R2.5 Clean-up
- Move any still-needed existing images into the new structure. Delete unused images (list them in the report). Do not delete a file that is referenced anywhere.
- No remote/hard-coded image URLs may remain.

---

## R3. Remove Image-Optimization Code

Images are now supplied ready-to-use from `public/`. Remove everything **custom** that tried to optimize or transform images:

- `scripts/optimize-images.mjs` and the `optimize:images` npm script.
- `sharp` as a **direct** dependency (verify nothing else needs it; Next.js manages its own optional image tooling).
- Blur-placeholder generators, `blurDataURL` utilities, base64 placeholders.
- The `AppImage` quality/fallback wrapper logic, custom image loaders, custom `remotePatterns`/`domains` entries for removed remote images, and any code resizing images.
- Docs/README sections describing the old pipeline.

**Decision to confirm (default stated):** this brief interprets "no image optimization code" as removing **custom** code. Keeping Next's **built-in `next/image` component** (framework feature, not custom code) is the **default**, because on Netlify it serves appropriately sized images to phones, which matters for speed with 1,000+ users. If the owner wants plain `<img>` instead, the alternative is `images.unoptimized: true`; **ask the owner and report the performance trade-off with measured numbers** before switching. Until answered: keep `next/image` with simple static `src`, `fill`/`sizes`, no custom wrapper.

---

## R4. Delivery Speed: Courier Partners Tab Only

### R4.1 Remove
Delete the three fixed delivery options (**Indian Post / Speed Post, DTDC, "Courier Partners"**), `config/delivery.ts` (or equivalent), their ETAs, their fees, and every reference in UI, server validation, message builder, docs and policy copy that states these specific options or prices (flag policy-page mismatches; don't rewrite policy wording without approval).

### R4.2 New behavior
Delivery options are generated **only** from rows in the `Courier Partners` tab:

- **Each active courier partner row = one delivery option.**
- Option label = `partner_name`. Charge = `rate_per_delivery`.
- **`rate_per_delivery = 0` means free delivery** → display **"Free"** in the delivery selector.
- Optional display of delivery time from a `delivery_time` column (free text, e.g., "2–3 days") **if the column exists and the cell is filled**. Never invent an ETA.
- Rows with missing/invalid/negative rate or missing name are **skipped** and logged as warnings (never defaulted).
- Options are sorted by charge ascending, then name. Pre-select the first option; selection is still required.
- **If the sheet has no valid active partners** (empty tab, or Sheets unreachable with no cached data): do not invent options. Default behavior: checkout shows a clear notice ("Delivery options are currently unavailable. Please contact us on WhatsApp.") with a plain WhatsApp contact link, and **Place Order is disabled**. *(Open Question Q4.)*
- The Bag still shows **no shipping information** (unchanged from the previous round).

### R4.3 Server-side authority (unchanged principle)
`POST /api/orders` accepts `courier_partner_id` only. The server looks up the partner in the cached catalog, **recomputes** the delivery charge and total, and rejects unknown or inactive partners. The client's displayed fee is never trusted.

### R4.4 Sheet schema changes
`Courier Partners` columns: `partner_id`, `partner_name`, `partner_phone`, `partner_address`, `rate_per_delivery`, `created_at`, `updated_at` **(required, as before)** plus recommended extras `status` (`ACTIVE`/`INACTIVE`) and `delivery_time` (optional text). Read by header name.
`New Sale Request`: replace `delivery_option` with `courier_partner_id` + `courier_partner_name`, keep `delivery_charge`.
Update the bootstrap (`ensureSheetSchema`), zod schemas, TypeScript types, `docs/google-sheets-schema.md`, templates, the order message (`Delivery (<partner_name>): ₹X` or `Free`), and tests.

---

## R5. Google Sheets Is the Only Source for Managed Data

### R5.1 Data ownership map (implement and document)

| Data | Source | Notes |
|------|--------|-------|
| Items: id, name, type, price, sizes, average rating, review count (+ approved extras: colors, description, in_stock, featured, active, sort_order) | **Google Sheets: Item Management** | Never hard-coded |
| Courier partners & delivery charges | **Google Sheets: Courier Partners** | Never hard-coded |
| Orders / sale requests | **Google Sheets: New Sale Request** | Written by server |
| Support requests | Google Sheets (support tab) | As already implemented |
| Category list & live/coming-soon status | `config/categories.ts` | Allowed config |
| Brand name, site URL, WhatsApp number | Env vars / constants | Allowed |
| FAQ & policy text | Content files | Allowed editorial content |
| Item images | `public/images/items/<folder>/` | R2 |

### R5.2 No dummy fallbacks, ever
- If a value is missing/invalid in the sheet: **skip that row or hide that UI piece. Do not substitute a made-up value.** Examples: blank price → item not purchasable and hidden from sale (log warning); blank rating or review count → hide the rating UI (never show 0, 4.5, or any default); blank sizes → item not purchasable; `type` not one of the six categories → skip row.
- If Google Sheets is unreachable: serve the **last successfully fetched real data** (build-time snapshot generated from the real sheet, **git-ignored, never committed, never hand-written**). If none exists, show a friendly "catalog temporarily unavailable" state. No fake products.
- Remove any code path that auto-fills sample data into a sheet.
- Review text is not stored anywhere; the site shows only `average_rating` and `review_count` from the sheet. Delete fake reviews and the review-list UI if it only displayed mock text.

### R5.3 Data provenance audit (mandatory report table)
List every dynamic value shown to a visitor (item name, price, sizes, colors, rating, review count, stock, featured flag, category tile counts, delivery options, delivery charge, totals, reference ID, etc.) with: **source (sheet/tab/column or config/env), file that renders it, and how it was verified.**

### R5.4 Verification (no fake proof)
- Use a **test spreadsheet** (never the production sheet with real orders). Put unique marker values (e.g., price `1234`, courier rate `0`) and show they appear on the site, then show changing the sheet changes the site after revalidation. Paste the evidence.
- If you have no Google credentials in your environment, write **NOT VERIFIED: no credentials** and give the owner an exact manual test checklist instead.
- Verify the bootstrap behavior from the previous brief still works with the new schema (empty sheet → tabs/headers created; existing data untouched).

---

## R6. FAQ Section (Large, Accurate, AI-Friendly)

### R6.1 Purpose
A thorough FAQ so customers, search engines and AI assistants can find correct answers about Ficcado quickly. **Accuracy beats volume**: every answer must follow the Section 0 rules.

### R6.2 Page and placement
- New route **`/faq`**, statically rendered (Server Component), fast, no client JS needed for reading.
- Link from the **footer**, the **Support page**, and the **Bag/Checkout help area** (small link). Add to navigation only if it fits without redesign.
- Content source: one typed file `content/faq.ts` → `{ id, group, question, answer }[]`. Groups defined in the same file. Never hard-code FAQ text inside components.
- Use semantic HTML with native `<details>/<summary>` (or equivalent with zero JS) so **all answers are present in the HTML** (crawlable by search engines and AI), with a stable anchor `id` per question (`/faq#how-do-i-place-an-order`), a "jump to group" index at the top, headings per group (`h2`), and a "Last updated" date taken from a constant updated at edit time (do not fabricate).
- Design must match the existing site styling. No new UI library.

### R6.3 Content rules for answers
- Question wording = how real customers (and AI users) ask in natural language ("How do I place an order?", "Do I need an account?").
- First sentence **directly answers** the question; follow with short supporting detail. Each answer is **self-contained** (understandable without the page around it), typically 30–90 words, plain language, brand written "Ficcado".
- **Dynamic facts are never typed into FAQ text.** Delivery partners, charges and times: say "the available delivery options and charges are shown at checkout" or render them live from the sheet. Prices/ratings: never typed.
- Do not invent policies. For returns/refunds/replacements/shipping/privacy/terms answers, **paraphrase the owner's existing policy pages** and link to them. If a policy detail isn't there, don't answer it; add it to `OWNER_INPUT_NEEDED`.
- No marketing superlatives, no unverifiable claims.

### R6.4 Target volume and groups
Aim for **60–100 questions** where facts allow; fewer is fine if the facts don't exist, but then list the unanswered questions for the owner. Suggested groups (drop or merge a group if its facts are missing):

1. **About Ficcado** (what it is; unisex clothing for all genders/ages; how to contact)
2. **Products & Categories** (live categories T-Shirts and Combos; Shirts, Hoodies, Pants, Sneakers coming soon; what "Coming Soon" means; combos)
3. **Sizes & Fit** (sizes shown per item come from the product page; unisex sizing; how to choose; only facts you have)
4. **How to Order** (Bag → Checkout → Place Order opens WhatsApp with the order message; no account/login needed; what the message contains; what to do if WhatsApp doesn't open; mobile and desktop)
5. **Reference ID & Order ID** (reference ID looks like `FIC-A0001`, is **temporary**, final Order ID is shared by the Ficcado team after confirmation; where to enter it on the Support page)
6. **Payment** (the website has **no online payment**; the order is continued with the Ficcado team on WhatsApp; **do not state any payment method (UPI/card/COD) unless the owner confirms**)
7. **Delivery** (delivery options and charges are shown at checkout from available courier partners; a charge of "Free" means no delivery fee; delivery time only if shown; what details are needed)
8. **Returns, Refunds, Replacements & Damages** (summaries of the existing policy pages with links)
9. **Support & Order Help** (how to use "Help regarding order", what Order ID to enter, how the team responds, WhatsApp contact)
10. **Website, Privacy & Data** (no accounts; what details checkout asks for and why; where orders are recorded: only state facts from this brief and the privacy page)
11. **Reviews & Ratings** (what the rating and count on items mean; shown from Ficcado's records)
12. **Care & Materials** (**only if the owner provides facts; otherwise skip the group and list as OWNER_INPUT_NEEDED**)

### R6.5 FAQ deliverables
- `content/faq.ts`, `/faq` page, links added, FAQ count per group in the report.
- `docs/FAQ_OWNER_INPUT_NEEDED.md`: the list of questions you could not answer truthfully, with your proposed question wording, so the owner can supply answers.
- The structure must be reusable by Phase 2 (FAQPage JSON-LD must be generated from the **same** data so visible text and structured data always match).
- Do **not** add FAQPage JSON-LD in Phase 1; it belongs to Phase 2 (after approval).

---

## R7. Production Gate & Report

### R7.1 Production gate (all with pasted output)
- [ ] `npm run lint`, type-check, tests, `npm run build` pass; paste the summaries.
- [ ] All R1.3 sweep results resolved or justified.
- [ ] `depcheck`/`knip` output pasted; unused dependencies removed.
- [ ] Brand check: zero `fikado`/`fkd` hits.
- [ ] Production-env validation (WhatsApp number, site URL) tested with a good and a bad value.
- [ ] Bundle analyzer top-10 client modules listed, before/after if available.
- [ ] Lighthouse mobile scores (home, category, item view, FAQ, checkout) or **NOT RUN: reason**.
- [ ] Item image structure validated by the manifest build step (paste its summary).
- [ ] The order flow still works end to end with the new delivery model (test with a test sheet, or **NOT VERIFIED** plus manual checklist).

### R7.2 The report: `PART2_REPORT.md` (project root)
One file, written **after Phase 1** and **appended after Phase 2**. It must be detailed and honest:

1. **Summary** (what changed, in plain language).
2. **Requirement map:** R1–R7 with status (Done / Partially / Not done) and evidence.
3. **Folder & file structure:**
   - **Before** tree and **After** tree (top 4 levels, plus the full `public/images/` tree, `content/`, `config/`, `scripts/`, `src/generated/`, `docs/`).
   - Tables of **files added / modified / deleted / moved** with a one-line reason each.
4. **Removed code inventory:** every removed mock/dummy/boilerplate/logic/dependency/script/comment-block category with file names and the proof of non-use.
5. **Data provenance table** (R5.3).
6. **Image system:** the rules, manifest validation output, items without images, orphan folders.
7. **Delivery system:** how options are built from the sheet, empty-state behavior, examples using test-sheet data.
8. **FAQ:** group list with question counts, link locations, `OWNER_INPUT_NEEDED` list.
9. **Sheet schema changes** (final columns for all tabs).
10. **Commands & outputs** (lint, type-check, tests, build, depcheck, sweeps, Lighthouse, bundle analysis).
11. **Env vars** required in production (names only; no secret values).
12. **Known limitations, NOT VERIFIED items, and open questions with the defaults used.**
13. **Deploy notes** for the owner (what to set in Netlify, what to check after deploy).

---

## 8. Phase 1 Acceptance Criteria (tick only with evidence)

- [ ] No mock/dummy/boilerplate/demo data or logic remains on any runtime path; sweep results attached.
- [ ] No invented marketing/business claims remain; every remaining claim traces to an allowed source.
- [ ] Items load only from the sheet; no fake fallbacks anywhere.
- [ ] `public/images/items/<slug>/image-N.<ext>` structure works; manifest validation passes; items render with their images; missing images show the single neutral placeholder.
- [ ] No custom image optimization code, scripts or dependencies remain (R3), and the `next/image` decision is documented.
- [ ] Delivery options come only from `Courier Partners`; `0` shows "Free"; Indian Post/DTDC/old options are gone everywhere.
- [ ] Orders recompute delivery and totals on the server from the courier partner row.
- [ ] `/faq` exists with grouped questions, linked from the footer and Support, all answers allowed-source only.
- [ ] `PART2_REPORT.md` exists with all 13 sections including before/after folder trees.
- [ ] Lint, type-check, tests and build pass.

---

# 9. STOP GATE: Phase 1 → Phase 2

When Phase 1 is complete and `PART2_REPORT.md` (Phase 1 portion) is written:

1. **STOP. Do not start Phase 2.**
2. Post in chat: **"Phase 1 complete."** plus a short summary and the list of `OWNER_INPUT_NEEDED` and open questions.
3. Post a **Phase 2 implementation proposal** (also save it as `docs/PHASE2_PROPOSAL.md`) containing: the exact files to add/change, draft contents using **real data only** (draft `llms.txt`, `robots.txt` rules, one sample JSON-LD block for an item built from a real sheet row), the questions in Section 10.5, risks, and estimated impact on performance.
4. **Wait for the owner's explicit approval** (a message like "APPROVED" or approved with edits). Implement only what was approved.

---

# PHASE 2 (After Approval Only): AI & Search Discoverability

> **Not to be started until approved (Section 9).** Phase 1 must be shippable without any of this. Same anti-hallucination rules apply; structured data must reflect only **real, visible** data.

## 10.1 Meta objects (Next.js Metadata API)
- `metadataBase` from `NEXT_PUBLIC_SITE_URL`; title templates ("<Page> | Ficcado"); unique meta description per page built from real data; canonical URLs; Open Graph and Twitter cards; icons; web manifest; `theme-color`; viewport.
- `robots` meta: `noindex` for checkout, continue-on-WhatsApp, API routes, coming-soon category pages, and any internal pages; index everything meant to be found.
- OG/Twitter image: use a **real** brand image or the item's `image-1`; never a generated or stock image. Absolute URLs.

## 10.2 JSON-LD structured data (server-rendered, safely serialized)
Use one `@graph` per page with stable `@id` values so entities link together (this is the "schema cluster"):
- `Organization` (name "Ficcado", url, logo, `sameAs` social profiles, `contactPoint`), **only with facts the owner provides**.
- `WebSite` (add `SearchAction` only if `/search` works with a query parameter).
- `BreadcrumbList` on category and item pages.
- `CollectionPage` + `ItemList` for live category pages.
- `Product` + `Offer` for items: `name`, `image` (absolute URLs from the item folder), `description` (if present in the sheet), `offers.price` (from the sheet), `priceCurrency: INR`, `availability` from `in_stock`. Add **`AggregateRating` only when both `average_rating` and `review_count` are valid and greater than 0**; never add `Review` objects or fabricated ratings.
- `FAQPage` for `/faq`, generated from the **same** `content/faq.ts` so structured data matches visible text exactly.
- Validate: JSON parses, required properties present, no empty fields, URLs absolute. Report what was **not** validated (for example, Google's Rich Results Test needs the live URL).

## 10.3 Crawler & AI files (all generated from real data)
- **`robots.txt`** (`app/robots.ts`): allow public pages; disallow `/api/`, `/checkout`, internal routes; reference the sitemap. **AI crawler policy (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, etc.): ask the owner; default allow**, since the goal is AI discoverability.
- **`sitemap.xml`** (`app/sitemap.ts`): home, static pages, live categories, every active item (from the sheet), FAQ, policy pages. **Exclude** coming-soon categories, checkout, API. Use honest `lastmod` (real change dates if available; otherwise omit; never stamp "now" on everything). Revalidate with the catalog.
- **`llms.txt`** (route handler): markdown per the llms.txt convention: `# Ficcado`, a one-paragraph factual summary, then sections with links (Shop: live categories; Help: FAQ, Support, policies; Ordering: how to order via WhatsApp). Optional **`llms-full.txt`** with the FAQ text and a plain-text catalog (item name, type, sizes, price, rating, review count, URL) generated from the sheet. **State honestly in the report that llms.txt is a proposed convention and not guaranteed to be used by every AI system.**
- **`humans.txt`**: only credits/team/tech details the owner provides. If none provided, ask; do not invent names.
- Correct `Content-Type` and caching headers for each file; verify with `curl -I`.

## 10.4 Clusters, internal linking & backlinks
- **Topic clusters via internal links:** category hub → items → relevant FAQ group → policy pages; breadcrumbs; "related items" within the same type (real sheet data only); footer links to FAQ/policies. Descriptive anchor text.
- **Backlinks cannot be created by code.** Do not add fake, paid or spammy links. Produce `docs/BACKLINK_PLAN.md` with legitimate steps for the owner (own social profiles linking to the site and listed in `sameAs`, business listings, collaborations/press, shareable URLs and OG previews), plus Google Search Console and Bing Webmaster setup steps (verification tokens only via env vars the owner supplies).

## 10.5 Questions the owner must answer in the Phase 2 proposal (don't assume)
1. Official social profile URLs (Instagram etc.) for `sameAs`.
2. Logo file to use for Organization schema and favicon/manifest.
3. Business contact details allowed to be public (email, phone/WhatsApp, address?).
4. AI crawler policy (allow all / block some).
5. Preferred default OG image.
6. Credits/team for `humans.txt` (or skip).
7. Search Console / Bing verification tokens (if the owner wants them wired).
8. Whether `/support` should be indexed.

## 10.6 Phase 2 verification (append to `PART2_REPORT.md`)
- `curl -I` and body samples for `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/llms-full.txt`, `/humans.txt`.
- Sitemap URL check: every URL returns 200; no coming-soon, checkout or API URLs.
- JSON-LD extracted from home, category, item, FAQ pages and validated (parse + required fields); AggregateRating present only with real data.
- Metadata audit table (page → title, description, canonical, robots).
- Lighthouse mobile **SEO ≥ 95** and **no performance regression** versus Phase 1 (numbers).
- Updated folder/file structure tree and added/modified/deleted file tables.
- Updated NOT VERIFIED list.

---

## 11. Open Questions (ask; continue with the default; flag in the report)

| # | Question | Default |
|---|----------|---------|
| Q1 | Keep Next's built-in `next/image` (no custom optimization code) or switch to unoptimized plain images? | Keep `next/image` |
| Q2 | Preferred aspect ratio for item images? | 4:5 |
| Q3 | Add `delivery_time` and `status` columns to `Courier Partners`? | Yes, both optional |
| Q4 | When no courier partner is available, block ordering and show WhatsApp contact? | Yes |
| Q5 | Is there an announcement/banner text the owner wants? | Remove banner |
| Q6 | Which payment methods may be mentioned in the FAQ? | None, until the owner confirms |
| Q7 | Return/refund/replacement details beyond the existing policy pages? | Use existing pages only |
| Q8 | Care/material/fabric facts for the FAQ? | Skip until provided |

---

## Final Instruction

Start with an **inventory** of the repository against R1–R6, post a short plan in chat, then implement Phase 1 step by step, verify with commands, and write `PART2_REPORT.md`. Then **stop** at the gate in Section 9 and wait for the owner's approval before touching Phase 2. **When unsure, ask or mark NOT VERIFIED. Never invent.**
