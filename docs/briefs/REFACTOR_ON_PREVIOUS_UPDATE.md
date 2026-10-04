# REFACTOR ON PREVIOUS UPDATE: Ficcado – Audit Fixes, Google Sheets Backbone, Server-Verified WhatsApp Orders

> **Brand name (read this first): the brand is spelled F-I-C-C-A-D-O → "Ficcado".**
> The previous briefs and your previous output used the wrong spelling "Fikado" / "FKD". That is an error and must be fixed everywhere (Section B6).
>
> **Authority:** This brief supersedes `AGENT_BRIEF.md` and `AGENT_BRIEF_2_WHATSAPP_ORDERING_REFACTOR.md` wherever they conflict.
>
> **Goal of this round:** make the site **fast, correct, tamper-resistant and honest**. Users on slow mobile networks, with 1,000+ visitors at the same time, must get pages and order responses as quickly as possible.

---

## 0. Ground Rules

1. **Evidence over claims.** In the previous round the report ticked every checkbox and declared "zero errors", "fully tested", "all images optimized" without showing scores, logs or numbers. This round, **every claim in your completion report must be backed by pasted command output, measured numbers, or a file path**. If you did not run it, say "not run". Unticked and honest beats ticked and false.
2. **Verify before fixing.** The findings in Part A were derived from reading your two reports (`EXPANSION.md` and `REFACTOR_AND_UPDATION_COMPLETED.md`), not from re-reading the code. For each finding: confirm it in the code, then fix it, or write "not applicable, because …" with proof.
3. **Do not redesign the UI.** Same look, spacing, branding. Only the changes in this brief.
4. **No guessing on business rules.** Anything ambiguous goes into "Open Questions" (Part E). Proceed with the stated default and flag it.
5. **Speed is a feature.** Every change must be checked against the performance budgets in Part C.

---

# PART A: Audit of the Previous Update (Mistakes & Risks)

Each finding has an ID. Your completion report must list every ID with status: **Fixed / Not applicable (proof) / Deferred (reason)**.

## A1. CRITICAL

| ID | Finding | Why it matters | Required fix |
|----|---------|----------------|--------------|
| **C1** | **Brand misspelled** as "Fikado" / "FKD" in the WhatsApp message header ("New Order – Fikado"), the Order ID prefix (`FKD-…`), the bag storage key (`fikado-bag-v2`), docs, footer/brand copy, and report text. | Wrong brand name in customer-facing messages and metadata. | Section B6. |
| **C2** | **Prices and totals are trusted from the browser.** The Bag stores `price` in `localStorage`; the WhatsApp text is built client-side from that. | Anyone can open dev tools, change a price or total, and send a fake order. | Server must recompute everything from the catalog (Section B4). Client prices are display-only. |
| **C3** | **Order ID is generated randomly in the browser** (`FKD-YYMMDD-XXXX`). | Not unique (collisions), not sequential, forgeable, and not the format the client wants. | Server-assigned sequential reference `FIC-A0001` style (Section B5). |
| **C4** | **Google Sheets integration looks optional and inconsistent.** The report lists `GOOGLE_SHEET_ID` / `GOOGLE_APPS_SCRIPT_URL` as "(Optional)" and says to add products to "the Products tab **or `products.snapshot.json`**". `EXPANSION.md` says service-account env vars (`GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`); the report says `GOOGLE_APPS_SCRIPT_URL`. | The live site may be silently running on the committed snapshot or `mockData.ts`, so sheet edits would never appear. Two different write mechanisms are documented. | Prove products actually load from Sheets in production mode. Pick **one** documented mechanism per direction (read/write). Delete `mockData.ts` from the runtime path. Section B3. |
| **C5** | **Rate limiting is in-memory per IP** ("in-memory sliding window"). | On Netlify (serverless), every function instance has its own memory and cold starts reset it. This provides almost no protection under a burst. | Use platform-level or shared-state protection (see B4.7). Remove the false claim from docs. |
| **C6** | **Contradictory Netlify configuration.** `netlify.toml` uses `cd ficcado-website-frontend && npm run build` and `publish = ficcado-website-frontend/.next`, while the deployment notes also set *Base directory = ficcado-website-frontend*. | With a base directory set, the `cd` command points to a folder that no longer exists from that location, and a manual `publish` for Next.js can conflict with Netlify's Next.js runtime. The deploy can fail or misbehave. | Define the base directory **once** (`[build] base = …` in `netlify.toml`), use plain `npm run build`, and let the Netlify Next.js runtime manage publish output. Verify against current Netlify Next.js docs and run a real `netlify build` (or CLI dry run) if possible. |
| **C7** | **Over-claimed verification.** Pre-launch checklist fully ticked; no Lighthouse before/after numbers (both briefs required them); load-test script created but never reported as run; "keyboard navigation fully tested", "zero ESLint warnings", "26 routes" with no logs. | The client cannot trust the report. | Re-run and record evidence (Part D). |

## A2. HIGH

| ID | Finding | Required fix |
|----|---------|--------------|
| **H1** | Delivery options were invented (`standard ₹0 / express ₹149 / sameday ₹299`) and the **Bag shows a hard-coded "Shipping: Free"** line. | Sections B1, B2. |
| **H2** | Support page validates Order ID with `^FKD-\d{6}-[A-Z0-9]{4}$`: tied to the wrong brand and the random format. | Section B7. |
| **H3** | **Hard-coded / mock data remnants.** `src/data/mockData.ts` and `src/data/announcements.ts` were in the original audit and are not listed as deleted. `ReviewsModal` likely contains fake review text. `src/lib/images.ts` maps to "local/**remote**" URLs, meaning remote hard-coded images may still exist. Placeholder inconsistency: plan says `product-placeholder.webp`, report says `.svg`. | Grep and remove every mock/remote asset (Part C.3). Reviews are now only **average rating + review count** from the sheet. No fabricated review text. |
| **H4** | **Sheet schema documented two different ways** (`EXPANSION.md §4.1` vs report §7: different columns). | One schema, defined in B3, regenerated in `docs/google-sheets-schema.md`; delete the older descriptions from `EXPANSION.md`. |
| **H5** | WhatsApp sample shows each item linking to a **category page** (`/categories/t-shirts`), not the product page, and the domain `https://ficcado.store` looks hard-coded. | Per-item product URL; base URL from `NEXT_PUBLIC_SITE_URL`. |
| **H6** | Order date in the message is taken from the **customer's device clock**. | Use the server timestamp in IST. |
| **H7** | Redirects are configured in **both** `next.config.ts` and `netlify.toml`. | Keep one source (prefer `next.config.ts` unless Netlify edge redirects are measurably faster; document the choice). |
| **H8** | Route hygiene: both `/blob` ("Journal" link) and `/blog` exist; `/onboarding` and `/settings` were not reviewed for leftover auth/account/preferences logic; the original audit listed an **"Accessories"** department but the removal list only names Men/Women/Kids. | Decide the single journal route (`/blog`) and redirect `/blob`; audit `/onboarding` and `/settings` and remove or reduce them if they only served accounts; confirm Accessories is gone everywhere. |
| **H9** | The report says changing `NEXT_PUBLIC_WHATSAPP_NUMBER` "automatically updates" everything. `NEXT_PUBLIC_*` values are inlined **at build time**, so a **redeploy is required**. `EXPANSION.md` also contains a dummy number (`+91 98765 43210`) in the diagram and env list. | Correct the docs. Remove dummy numbers from docs (use `<WHATSAPP_NUMBER>`). |
| **H10** | **Sheets read pattern risk.** With ISR, each page may revalidate separately, multiplying reads. The `googleapis` npm package is very heavy for serverless cold starts. In-memory caches are not shared across instances. | One shared catalog fetch per revalidation window (single cached function/tag used by all pages). Use lightweight auth + REST (or Apps Script JSON) instead of `googleapis`. |

## A3. MEDIUM / PERFORMANCE (verify in code)

| ID | Suspected issue | Fix |
|----|-----------------|-----|
| **M1** | `ViewportContext` + separate Desktop/Mobile component trees suggests **JS-decided layout** (render different trees after hydration). Causes layout shift, double DOM, hydration flash. | Responsive via CSS (Tailwind breakpoints). Remove `ViewportContext` unless used for something CSS cannot do. |
| **M2** | **11 modals** managed by `ModalContext`, likely statically imported at the root. | Load each with `next/dynamic` and mount only when opened. |
| **M3** | Root providers and many pages marked `'use client'`; context values may not be memoized, so every cart change re-renders the tree. | Server Components by default; split cart state/actions contexts; `useMemo`/`useCallback` for provider values; keep client islands small. |
| **M4** | Bag hydrates in `useEffect` → badge/count flashes and shifts. | Use `useSyncExternalStore` or a reserved-size badge until hydrated. |
| **M5** | `AppImage` custom wrapper with "quality fallback": may be a client component with `onError` state on every image, or may pass `unoptimized`. | Make it lean; no `unoptimized`; correct `sizes`; `priority` only for the LCP image. |
| **M6** | `products.snapshot.json` in `src/data/` may be imported into client bundles. | Server-only module (`import 'server-only'`), loaded only on fallback. |
| **M7** | Nav/category link lists duplicated across header, drawer, footer, home. | One `config/navigation.ts` consumed everywhere. |
| **M8** | No automated tests for money, ID and message logic. | Add unit tests (Vitest/Jest): totals, ID sequence, message builder, sheet parsers, delivery fee. |
| **M9** | `EXPANSION.md` changelog links to a local Windows path (`file:///e:/quick_fic_frontend/...`). | Use relative links. |
| **M10** | Dead dependencies after deleting auth/wishlist/payment/OTP code are not evidenced as removed. | Run `depcheck`/`knip`; paste output; remove unused packages. |

---

# PART B: New Changes Requested

## B1. Bag: Remove Shipping Information

- In the **Bag (drawer/page "Your Bag")**, **remove the shipping line completely**. The default currently shows "Shipping: Free".
- The Bag shows **Subtotal only** plus the Checkout button. Do not replace it with "calculated at checkout" text or any shipping wording.
- Delivery charges appear **only on the Checkout page, after the customer chooses a delivery speed.**
- Sweep for stray "Free shipping" / "Free delivery" promotional copy (banners, product pages, FAQ). Keep legal policy content on the Shipping & Delivery policy page unless it contradicts B2 (flag it in Open Questions).

## B2. Delivery Speed: New Options

Replace all existing options and prices with exactly these three:

| Option (display name) | Delivery time | Charge | Source |
|-----------------------|---------------|--------|--------|
| **Indian Post (Speed Post)** | 3–4 days | **₹0 (Free)** | `config/delivery.ts` |
| **DTDC** | 2–3 days | **₹50** | `config/delivery.ts` |
| **Courier Partners** | 1–2 days | **₹100** | Fee from the `Courier Partners` sheet tab (seed value ₹100); fallback to ₹100 from config if the sheet is empty/unreachable |

Rules:
- Default selection: **Indian Post (Speed Post)**; selection is required.
- Show the delivery time and charge on each option ("Free" for ₹0 is fine **inside the delivery selector**).
- Single source of truth for ids, names, ETAs and fees (`config/delivery.ts`). No numbers repeated in components.
- Checkout summary: Subtotal + Delivery charge (selected option) = Total.
- **The server recomputes the delivery charge** (Section B4). The client value is display-only.
- *Courier Partners rate rule:* if all active partners in the sheet share one `rate_per_delivery`, use it. **If rates differ, stop and ask** (proposed default: charge the highest active rate; the team confirms the exact partner in WhatsApp).

## B3. Google Sheets as the Database: Three Tabs + Auto-Bootstrap

### B3.1 Required tabs and columns
Use these **exact tab names**. Column headers in row 1 use snake_case. The code must **read columns by header name, not by position**, so admins can reorder columns safely.

**Tab 1: `Item Management`**

| Column | Type | Rules |
|--------|------|-------|
| `id` | string/number | Required, unique, stable |
| `item_name` | string | Required, 2–100 chars |
| `type` | string | One of the six categories: **T-Shirts, Combos, Shirts, Hoodies, Pants, Sneakers** (jeans = Pants). Validate with a dropdown in the sheet and in code |
| `price` | number | INR, integer ≥ 0. Parse tolerant input like `₹1,499` |
| `sizes` | string | **Comma-separated**: e.g. `XS,S,M,L,XL,XXL` (trim, uppercase, dedupe) |
| `average_rating` | number | 0–5, up to 1 decimal. Shown on item cards and detail pages |
| `review_count` | integer | ≥ 0. **Admin edits this by hand** (e.g., 14 → 50 when customers leave reviews). Shown beside the rating (e.g., "4.6 (50)") |

*Recommended extra columns* (placed **after** the seven above, because the current UI needs them; justify each one you keep in the report, **ask me** if you want to add others): `colors` (comma-separated), `description`, `slug` (or derive from `item_name`; prefer deriving), `in_stock`, `featured`, `active`, `sort_order`. Images follow the folder convention `public/images/products/<slug>/` so no image column is needed.

**Tab 2: `Courier Partners`**

| Column | Type | Rules |
|--------|------|-------|
| `partner_id` | string/number | Required, unique |
| `partner_name` | string | Required |
| `partner_phone` | string | Optional, normalized |
| `partner_address` | string | Optional |
| `rate_per_delivery` | number | INR per delivery (this is the fee for the "Courier Partners" delivery option) |
| `created_at` | datetime | Set when the row is created |
| `updated_at` | datetime | Set whenever the row changes |

*Recommended extra column:* `status` (`ACTIVE`/`INACTIVE`). `updated_at` can't update itself in a plain sheet. Provide a small bound Apps Script `onEdit` trigger in `docs/APPS_SCRIPT.md` that stamps `updated_at` (and `created_at` on new rows), and document the install steps.

**Tab 3: `New Sale Request`** (one row per order; **`reference_id` is the primary key**)

| Column | Notes |
|--------|-------|
| `reference_id` | **Primary key.** Format in B5 |
| `created_at` | Server time, IST |
| `status` | `NEW` by default. Allowed: NEW, CONFIRMED, PACKED, SHIPPED, DELIVERED, CANCELLED |
| `final_order_id` | **Empty on creation**; the Ficcado team fills it after confirming the order |
| `customer_name` | |
| `customer_email` | |
| `customer_phone` | Needed so the team can reach the customer |
| `address_line1`, `address_line2`, `city`, `state`, `pincode` | |
| `landmark` | |
| `delivery_option`, `delivery_charge` | From B2 |
| `subtotal`, `total_amount` | **Computed on the server** |
| `item_count` | Total quantity |
| `items_summary` | Human-readable lines: `1) Item name | Size L | Color Black | Qty 2 | ₹799 each | ₹1,598` (one item per line) |
| `items_json` | Machine-readable JSON array: `id, name, type, size, color, qty, unit_price, line_total` |
| `submission_id` | Client-generated UUID per checkout attempt, used to **prevent duplicate rows** on double-click/retry |

Sanitize every text cell against **spreadsheet formula injection** (prefix cells starting with `=`, `+`, `-`, `@` with `'`).

**Support requests:** the Support page currently writes to an `Inquiries` tab. The client listed only three tabs. **Default:** keep a **fourth tab `Support Requests`** (bootstrapped the same way) because the Support form needs somewhere to go. Flag this in Open Questions.

### B3.2 Startup verification and auto-creation (idempotent, safe)

Implement `ensureSheetSchema()` that does the following **in order**:

1. Validate env vars (`GOOGLE_SHEET_ID` and the chosen credentials). If missing, log a clear error and run in **snapshot mode** (site still works).
2. Authenticate and call the Sheets API to confirm **the spreadsheet exists and is accessible**. If not: log a precise, non-secret error (not found vs. permission denied vs. quota). **Do not auto-create a spreadsheet** (ownership problems) unless `SHEETS_AUTO_CREATE=true`.
3. List existing tabs. **Create any missing required tab** (`addSheet` via one `batchUpdate`). Handle the "already exists" race (two instances starting together) as success.
4. For each tab, read row 1 headers:
   - Empty → write all headers.
   - Partial → **append only the missing headers** at the end. **Never reorder, rename, overwrite or delete** existing headers, rows or values.
5. Apply formatting once: bold, frozen header row, column widths, data validation (dropdowns for `type` and `status`, numeric validation for price/rating/review_count/rate).
6. Seed (only if the tab has **zero data rows** and `SEED_SAMPLE_DATA=true`): `Item Management` from `docs/seed/item-management.csv`. **Do not seed fake courier partners or fake phone numbers.** The "Courier Partners" delivery option falls back to ₹100 from config if the tab is empty.
7. Report a structured result (`ok`, `createdTabs`, `addedColumns`, `warnings`) to logs.

**Where it runs (important: Netlify has no always-on server):**
- `npm run sheets:bootstrap`: runs as a pre-build step; **warns but does not fail the build** unless `SHEETS_STRICT=true`.
- `instrumentation.ts` `register()` (Node runtime only): fire-and-forget on cold start, **memoized per instance**, never awaited on a visitor request.
- Lazy guard in the order-write path: if the schema hasn't been verified in this instance, verify first.
- A protected endpoint (e.g., `GET /api/admin/sheets-health`, requires `ADMIN_TOKEN` header) that reports the status without exposing secrets.
- The bootstrap makes only a few API calls and **must never run on the page-render read path**.

### B3.3 Reads and writes

- **Catalog reads (Item Management + Courier Partners):** server-side, **one shared cached fetch** reused by every page (ISR/data cache with tags, ~300 s). Validate with zod; skip invalid rows with a logged warning. Fall back to the last good snapshot if Sheets fails.
- **Optional on-demand revalidation:** secured webhook that a bound Apps Script `onEdit` can call so price/rating/review-count edits appear quickly. Document it.
- **Snapshot:** keep a server-only fallback; regenerate it at build time from Sheets; never import it into client code.
- Use lightweight REST (service-account JWT with a small library, or an Apps Script JSON endpoint). **Do not ship the `googleapis` package.**
- **Rating/review display:** UI shows `average_rating` and `review_count` from the sheet. Remove any fabricated review text.

## B4. Server-Verified WhatsApp Orders (Tamper Protection)

> **Hard truth to document honestly:** once WhatsApp opens with pre-filled text, the customer can edit it in the compose box. **No website can make a `wa.me` message read-only.** The correct defense is **not** to trust the WhatsApp text at all: the **`New Sale Request` row is the source of truth**, created and priced by the server. The WhatsApp message is a convenience that carries the Reference ID; the team always checks the sheet row.

### B4.1 New flow
1. Customer fills the checkout form and picks a delivery option.
2. Client sends `POST /api/orders` with **only**: `submission_id`, customer fields, address fields, `delivery_option_id`, and items as `{ id, size, color, qty }`. **No prices, totals or dates are sent or trusted.**
3. Server:
   - validates every field (zod, length limits, phone/PIN/email rules),
   - loads the cached catalog and **rejects** unknown, inactive, out-of-stock, coming-soon or invalid-size/color items with a clear message,
   - **recomputes** unit prices, line totals, subtotal, delivery charge and total,
   - assigns the **Reference ID** (B5),
   - **appends the row** to `New Sale Request`,
   - builds the **WhatsApp message on the server** from the saved values and returns `{ referenceId, whatsappUrl, total }`.
4. Client navigates to WhatsApp (and to the "Continue on WhatsApp" page). The Bag is cleared **only** after success.

### B4.2 Message content (built server-side; edit the template in one file)
```
*New Order – Ficcado*
Reference ID: FIC-A0001  (temporary)
Date: 02 Oct 2026, 02:45 PM IST

*Customer*
Name: …
Mobile: …
Email: …

*Delivery Address*
…
Landmark: …

*Items*
1) <Item> | Size: L | Color: Black | Qty: 2 | ₹799 each = ₹1,598
   <NEXT_PUBLIC_SITE_URL>/categories/<type-slug>/<item-slug>   ← product page link

Subtotal: ₹…
Delivery (<option name>): ₹…
*Total: ₹…*

Note: This is a temporary reference ID. The Ficcado team will share your final Order ID once your order is confirmed. Our team verifies every order against our records using this reference.
```
Use the real product page URL pattern that exists in the app.

### B4.3 What this protects against
- Edited prices/totals in browser storage or dev tools → ignored by the server.
- Edited text inside WhatsApp → the team compares with the sheet row; the sheet total wins.
- Tell the customer on the Continue page (small text): *"Please send the message as it is. Changing it can delay your order."*
- Write an **operations rule** into `docs/DEPLOYMENT.md` (or a short `docs/OPERATIONS.md`): *always confirm using the `New Sale Request` row, never the typed WhatsApp text.*

### B4.4 Speed and UX
- Target **p95 under ~1.5 s** for `POST /api/orders` (measure and report). Disable the button on click, show "Preparing your order…", **timeout at ~8 s**.
- Idempotency: same `submission_id` returns the same Reference ID, never a duplicate row.
- Prefetch `/checkout/whatsapp-continue`. Keep the JS for the checkout route small.
- **Navigation after an `await`:** browsers may block `window.open` after async work. Use top-level navigation (`location.assign(whatsappUrl)`) and/or the Continue page with an "Open WhatsApp" button and an automatic attempt. Test on iOS Safari and Android Chrome and document the choice.

### B4.5 When Google Sheets is down
Orders must **not** be lost because of Sheets. If the write fails or times out:
- Show a short notice and still hand off to WhatsApp with a **clearly temporary offline reference** (e.g., `FIC-T` + 6 random characters) and the message line *"Order could not be pre-saved; team to verify manually."*
- Log the failure. Never show raw errors to customers.
- Flag this default in Open Questions.

### B4.6 Bag storage
- Bump the storage key to **`ficcado-bag-v3`** and **discard** old `fikado-bag-v2`/`fikado-*` data.
- Stored prices are **display-only**. On the Checkout page, re-validate every Bag item against the current catalog, refresh prices, and show a clear notice if anything changed or became unavailable.

### B4.7 Abuse protection (replace the in-memory limiter)
- Honeypot field + minimum-time-to-submit check.
- Platform-level rate limiting if the Netlify plan supports it (verify current Netlify docs), plus an optional CAPTCHA hook (Cloudflare Turnstile): **ask me before enabling**.
- Payload size limits, max items/quantities (e.g., max 20 lines, qty ≤ 10), strict zod validation.
- Do not log personal data in plain logs.

## B5. Reference ID Format (Auto-Incrementing, Temporary)

**Format:** `FIC-` + **letters** + **4-digit number**, e.g., `FIC-A0001`, `FIC-A0002` … `FIC-A9999`, then `FIC-B0001` … `FIC-Z9999`, then `FIC-AA0001` (letters continue like spreadsheet columns).

- The numeric limit per letter (**default 9999**) is configurable (`ORDER_ID_LIMIT`).
- Sequence is **server-assigned, atomic, unique and never reused**, even if an admin deletes rows. Do **not** derive it from row count. Acceptable approaches (choose one, justify, measure):
  1. **Google Apps Script web app** with `LockService` + a counter in `PropertiesService`, which appends the row and returns the ID in one call (recommended).
  2. Sheets API approach that is provably atomic and duplicate-free.
- Put the generator and parser in one tested helper (`lib/referenceId.ts`) with unit tests for: first ID, rollover at 9999→B0001, Z→AA rollover, parse/validate.
- **Display rule everywhere** (checkout confirmation, Continue page, WhatsApp text, support page help text): label it **"Reference ID (temporary)"** with this note: *"This is a temporary reference. Once your order is confirmed, the Ficcado team will share your real Order ID."*
- Admins: never delete rows; set `status = CANCELLED`. The team writes the real ID in `final_order_id`.
- **Security note:** sequential IDs are guessable. The website must **never** reveal order details when someone types an ID.

## B6. Brand Spelling Fix: "Ficcado"

- Replace **every** wrong spelling: `Fikado`, `FIKADO`, `fikado`, `Fikado Clothings`, `FKD`, `fikado-bag-v2`, in UI text, metadata, JSON-LD, Open Graph, sitemap, manifest, `alt` text, WhatsApp template, error messages, comments, docs (`EXPANSION.md`, `docs/*`, README), env names, storage keys, sheet text, and file names where applicable.
- Correct spelling is **F-I-C-C-A-D-O**. Order ID prefix is **`FIC`**.
- Case-insensitive grep for `fik`, `fkd`, and also scan for other misspellings such as `ficado`, `ficcdo`, `ficcodo`.
- Do not "fix" the repository folder or domain if they are already correct (`ficcado.store`).
- Add a lint/test step (simple script) that **fails the build if `fikado` or `fkd` appears** in `src/`, `docs/` or `public/`.

## B7. Support Page: Order ID Input Update

- The "Enter Order ID" field must accept **both**: a **Reference ID** (`FIC-A0001` pattern) and the **final Order ID** issued by the team (format unknown: **ask me**; until answered, accept `^[A-Za-z0-9][A-Za-z0-9-]{3,29}$`, normalized to uppercase).
- Help text under the field: *"Enter the Order ID shared by the Ficcado team, or your temporary Reference ID (starts with FIC-)."*
- Submission continues to work as before and is stored in the Support requests tab. Optionally, the server may look up the ID in `New Sale Request` and store `order_found = yes/no` for the team's convenience. **Never** return order details to the customer.
- Remove the old `FKD-YYMMDD-XXXX` validator and every reference to it.

---

# PART C: Performance & Boilerplate Hunt

The owner wants a **quick, fast application**. Beyond Part A, hunt for boilerplate, hard-coded values and anything that slows the user, and fix it.

## C.1 Budgets (report measured before/after)
- Lighthouse **mobile** ≥ **95** (Performance, Accessibility, Best Practices, SEO) on: home, a category page, a product view, bag, checkout, support.
- **LCP < 2.0 s, CLS < 0.05, INP < 150 ms.**
- First-load JS: record per-route sizes now, then **reduce by at least 20 %** or meet ≈ **≤ 170 kB gzipped** on the home page. Justify any exception.
- `POST /api/orders` p95 ≈ **≤ 1.5 s**. Catalog pages served from CDN cache (no Sheets call on visit).
- No request waterfalls on the home page. Fonts self-hosted via `next/font`, preloaded only for critical weights.

## C.2 Required optimization checks
1. Run `@next/bundle-analyzer`; paste the top 10 largest client modules and what you did about each.
2. Convert unnecessary `'use client'` files to Server Components; keep client islands small.
3. `next/dynamic` for modals, drawers, carousels, filters, and any below-the-fold widget.
4. Remove JS-driven responsive switching (M1).
5. Memoize context values; split cart state and actions; avoid re-rendering the whole tree on bag changes.
6. Icons: import individual icons only; no whole-library imports.
7. Images: all through `next/image` with correct `sizes`, fixed dimensions, `priority` on the single LCP image only, blur placeholders; **no `unoptimized`**; no remote hard-coded image URLs; confirm real product images were migrated into `public/images/products/<slug>/`.
8. Cache headers: immutable for hashed assets; `s-maxage` + `stale-while-revalidate` for catalog data; verify with `curl -I` and paste results.
9. Third-party scripts deferred (`next/script`) or removed.
10. `depcheck`/`knip` output pasted; unused packages removed.
11. Remove `console.log`, dead code, unused CSS and unused types.

## C.3 Boilerplate / hard-code sweep (paste grep results and actions)
Search the whole repo for and eliminate (or justify):

`mockData`, `INITIAL_`, `announcements` (hard-coded banner text: decide if it belongs in config), `unsplash`, `picsum`, `placehold`, `https://` image URLs, `setTimeout(` used to simulate loading/payment, `Math.random(` (IDs), `new Date(` used for business IDs/dates, `149`, `299`, `Free`, `shipping`, `₹` literals in components, phone numbers, email addresses, domain names, `localhost`, `TODO`, `FIXME`, `dangerouslySetInnerHTML`, `useEffect(` that fetches data on the client, duplicated link arrays (header/drawer/footer).

Anything that is rarely-changing configuration may live in `config/*.ts`. Anything the owner edits regularly (items, prices, ratings, review counts, courier rates) must come from Google Sheets.

---

# PART D: Deliverables & Acceptance

## D.1 Deliverables
1. All code changes for B1–B7 and the fixes for Part A.
2. Updated **`EXPANSION.md`**: remove outdated/contradicting sections, fix links to be relative, remove dummy numbers, add "Phase 3: Refactor on Previous Update" describing the new flow (include a Mermaid diagram of the order flow).
3. Regenerated **`docs/google-sheets-schema.md`** (the three tabs + Support Requests) and **seed CSVs** in `docs/seed/` (`item-management.csv`, optionally `courier-partners.example.csv` marked as example only).
4. **`docs/APPS_SCRIPT.md`** (if used): order gateway script, `onEdit` stamping script, revalidation webhook, install steps.
5. Updated **`docs/DEPLOYMENT.md`** and **`.env.example`**, including: single base-directory setup, all env vars (sheet ID, credentials/Apps Script URL, `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_SITE_URL`, `ORDER_ID_LIMIT`, `SEED_SAMPLE_DATA`, `SHEETS_STRICT`, `ADMIN_TOKEN`, revalidate secret), the note that `NEXT_PUBLIC_*` changes need a redeploy, and the operations rule from B4.3.
6. **Tests** (unit): reference ID sequence/rollover, totals and delivery fee, message builder, sheet parsers/validators, phone/PIN validators.
7. **`REFACTOR_ON_PREVIOUS_UPDATE_COMPLETED.md`** in the project root with:
   - a table of **every Part A finding (C1…M10)** with status and evidence,
   - what changed for **each of B1–B7** (before → after),
   - **real measured numbers**: Lighthouse before/after per page, bundle sizes before/after, `POST /api/orders` latency, command outputs for build/lint/type-check/tests/depcheck,
   - files added / changed / deleted,
   - the bootstrap behavior with a sample log output,
   - a screenshot-free manual test log (what you tested, on which viewport, result),
   - **honest limitations** (including that WhatsApp text remains user-editable and how it is mitigated),
   - Open Questions and the defaults you used.

## D.2 Acceptance Criteria (tick only with evidence)
- [ ] The word "Fikado"/"FKD" appears **nowhere**; the brand test script passes.
- [ ] Bag shows subtotal only, with **no shipping line**.
- [ ] Delivery options are exactly: Indian Post (Speed Post) 3–4 days ₹0, DTDC 2–3 days ₹50, Courier Partners 1–2 days ₹100 (fee from sheet with ₹100 fallback).
- [ ] On first start with an empty spreadsheet, the three tabs + headers are created automatically; with existing data nothing is overwritten; missing columns are appended; column reordering does not break reads.
- [ ] Items, prices, sizes, average rating and review count shown in the UI come from the `Item Management` tab. Editing the sheet changes the site after revalidation.
- [ ] Courier partner data comes from the `Courier Partners` tab.
- [ ] Placing an order creates exactly one `New Sale Request` row with server-computed totals; double-click creates no duplicate.
- [ ] Changing a price in browser storage/dev tools has **no effect** on the saved total.
- [ ] Reference IDs follow `FIC-A0001` and roll over correctly (tests pass); UI and message label them **temporary** and mention the final Order ID will come from the team.
- [ ] WhatsApp opens with the server-built message; works on mobile and desktop; the offline fallback works when Sheets is blocked (simulate).
- [ ] Support page accepts Reference IDs and final Order IDs; no FKD validator remains.
- [ ] No mock/remote/hard-coded data on the runtime path; `mockData.ts` removed.
- [ ] Netlify config verified (single base, no conflicting publish).
- [ ] Performance budgets in C.1 met, or each miss explained with numbers.
- [ ] `npm run lint`, type-check, tests and `npm run build` pass; outputs pasted in the report.

---

# PART E: Open Questions & Defaults

Ask me these (continue with the default in the meantime and flag it in the report):

1. **Final Order ID format** from the team? *Default:* lenient alphanumeric-with-hyphen validation.
2. **Fourth tab for Support requests** (`Support Requests`) in addition to the three requested tabs? *Default:* yes, keep it.
3. **Extra columns** in `Item Management` (`colors`, `description`, `in_stock`, `featured`, `active`, `sort_order`, optional `slug`) and in `Courier Partners` (`status`). *Default:* add them to the right of the required columns.
4. **Courier Partners fee** when partners have different rates. *Default:* use the highest active rate; ₹100 if the sheet is empty.
5. **Offline fallback** when Sheets is down (orders still go to WhatsApp with a `FIC-T…` reference). *Default:* enabled.
6. **Rate-limit/CAPTCHA** (Cloudflare Turnstile). *Default:* not enabled until I confirm.
7. **Shipping & Delivery policy page wording**: update text to match the new delivery options? *Default:* flag mismatches, don't rewrite policy text without approval.
8. Should the six `type` values appear exactly as the sheet dropdown, with "jeans" treated as **Pants**? *Default:* yes.

---

## Final Instruction

Start by posting a short plan that maps every Part A finding to a verification step, then implement B1 → B7 and Part C. Finish with `REFACTOR_ON_PREVIOUS_UPDATE_COMPLETED.md`. **Do not tick a box you have not proven.**
