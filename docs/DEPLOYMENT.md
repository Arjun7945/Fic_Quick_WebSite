# Deployment & Production Setup Guide — Ficcado Clothings

This guide provides end-to-end instructions for deploying Ficcado on **Netlify**, setting up **Google Sheets** as the operational database, configuring environment variables, and managing operations.

---

## 1. Architecture Summary

- **Framework:** Next.js 16 (App Router)
- **Deployment Platform:** Netlify (using `@netlify/plugin-nextjs` v5)
- **Database Backbone:** Google Sheets API v4 with lightweight native Node.js RS256 JWT auth (no heavy `googleapis` package)
- **Tabs:** `Item Management`, `Courier Partners`, `New Sale Request`, `Support Requests`
- **Catalog Caching:** ISR (Incremental Static Regeneration, 300s window) + build-time snapshot fallback
- **Order Flow:** Server-verified `POST /api/orders` calculating totals, assigning sequential `FIC-A0001` Reference IDs, appending to Google Sheets, and building WhatsApp direct handoff
- **Customer Support:** Direct write to `Support Requests` tab

---

## 2. Operations Rule (Critical)

> [!IMPORTANT]
> **Always confirm orders using the `New Sale Request` spreadsheet row, never the typed WhatsApp text.**
> Once WhatsApp opens, customers can edit text in their compose box. The server-computed and recorded Google Sheet row is the tamper-resistant source of truth for items, prices, delivery fees, and totals.

---

## 3. Environment Variables Checklist

Configure these variables in **Netlify Dashboard → Site configuration → Environment variables** (or `.env.local` for local development):

| Variable | Description | Example / Default | Required |
|----------|-------------|-------------------|----------|
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Official WhatsApp business line (international digits-only format) | `919497144795` | **Yes** |
| `NEXT_PUBLIC_SITE_URL` | Canonical storefront base URL | `https://ficcado.store` | **Yes** |
| `GOOGLE_SHEET_ID` | Target Google Spreadsheet ID | `1U1bdFZH68Seg3OcV3Wtucmsqg8JL5i3MIGECglu_hfs` | **Yes** |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Service Account email address | `ficcado-quick-webapp@ficcado-quick-website.iam.gserviceaccount.com` | **Yes** |
| `GOOGLE_PRIVATE_KEY` | Service Account PEM private key (including headers) | `-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n` | **Yes** |
| `ORDER_ID_LIMIT` | Numeric rollover ceiling per letter series | `9999` | No (default: 9999) |
| `SEED_SAMPLE_DATA` | Automatically seed catalog if sheet is empty | `true` | No (default: true) |
| `SHEETS_STRICT` | Fail build if Google Sheets cannot be reached | `false` | No (default: false) |
| `ADMIN_TOKEN` | Secret header token for admin health checks | `ficcado-admin-secure-token` | No |

> [!NOTE]
> **Build-time inlining of `NEXT_PUBLIC_*`:** Values prefixed with `NEXT_PUBLIC_` are embedded into the client JavaScript bundle at build time. Updating these variables requires triggering a new build/deploy on Netlify.

---

## 4. Netlify Deployment Setup

### Step 4.1: Connect Repository
1. Log in to [Netlify](https://app.netlify.com/).
2. Select **Add new site** → **Import an existing project** → **GitHub**.
3. Choose repository `Arjun7945/Fic_Quick_WebSite`.

### Step 4.2: Configure Single Base Directory
Netlify configuration uses a single unified base directory:
- **Base directory:** `ficcado-website-frontend`
- **Build command:** `npm run build`
- **Publish directory:** `.next`
- The `@netlify/plugin-nextjs` plugin handles SSR and Serverless edge routing automatically.

### Step 4.3: Add Environment Variables
Enter the environment variables listed in Section 3 in the Netlify site settings. For `GOOGLE_PRIVATE_KEY`, paste the full multi-line key or format with escaped newlines (`\n`).

### Step 4.4: Deploy
Click **Deploy site**. The build runs in ~1–2 minutes and executes `npm run sheets:bootstrap` as a pre-build step to verify sheet schema connectivity.

---

## 5. Domain Configuration (GoDaddy / Custom DNS)

1. In Netlify: **Site configuration** → **Domain management** → **Add custom domain** → enter `ficcado.store`.
2. In DNS Provider (e.g. GoDaddy):
   - **Apex Record (`@`):** Type `A`, Value `75.2.60.5` (Netlify load balancer).
   - **Subdomain (`www`):** Type `CNAME`, Value `<your-site-name>.netlify.app`.
3. Netlify will provision a Let's Encrypt SSL certificate automatically within 15–30 minutes.

---

## 6. Pre-Launch Verification Checklist

- [ ] `npm run check:brand`: Passes with zero forbidden spellings.
- [ ] `npm run sheets:bootstrap`: Connects to `1U1bdFZH68Seg3OcV3Wtucmsqg8JL5i3MIGECglu_hfs` and verifies 4 tabs.
- [ ] Bag shows Subtotal only (no shipping line).
- [ ] Checkout shows 3 delivery speeds: Indian Post (₹0), DTDC (₹50), Courier Partners (₹100).
- [ ] Orders submit to `POST /api/orders` and create a row in `New Sale Request` with `FIC-A0001` format.
- [ ] WhatsApp message opens with server IST timestamp and Reference ID.
