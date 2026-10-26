# Deployment & Production Setup Guide — Ficcado Clothing

This guide provides end-to-end instructions for deploying Ficcado on **Vercel**, setting up **Google Sheets** as the operational database, configuring environment variables, and managing operations.

---

## 1. Architecture Summary

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Deployment Platform:** Vercel (Edge network, global CDN, native Next.js optimization)
- **Database Backbone:** Google Sheets API v4 with lightweight native Node.js RS256 JWT auth (no heavy `googleapis` package)
- **Tabs:** `Item Management`, `Courier Partners`, `New Sale Request`, `Support Requests`, `Drop Notification List`
- **Catalog Caching:** ISR (Incremental Static Regeneration, 60s/300s window) + build-time snapshot fallback
- **Order Flow:** Server-verified `POST /api/orders` calculating totals, assigning sequential `FIC-A0001` Reference IDs, appending to Google Sheets, and building WhatsApp direct handoff
- **Customer Support:** Direct write to `Support Requests` tab

---

## 2. Operations Rule (Critical)

> [!IMPORTANT]
> **Always confirm orders using the `New Sale Request` spreadsheet row, never the typed WhatsApp text.**
> Once WhatsApp opens, customers can edit text in their compose box. The server-computed and recorded Google Sheet row is the tamper-resistant source of truth for items, prices, delivery fees, and totals.

---

## 3. Environment Variables Checklist

Configure these variables in **Vercel Project Settings → Environment Variables** (or `.env.local` for local development):

| Variable | Description | Example / Default | Required |
|----------|-------------|-------------------|----------|
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Official WhatsApp business line (international digits-only format) | `916282000729` | **Yes** |
| `NEXT_PUBLIC_SITE_URL` | Canonical storefront base URL | `https://ficcado.in` | **Yes** |
| `NEXT_PUBLIC_PRIVACY_EMAIL` | Privacy & customer contact email address | `ficcado.clothing@gmail.com` | **Yes** |
| `GOOGLE_SHEET_ID` | Target Google Spreadsheet ID | `1U1bdFZH68Seg3OcV3Wtucmsqg8JL5i3MIGECglu_hfs` | **Yes** |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Service Account email address | `ficcado-quick-webapp@ficcado-quick-website.iam.gserviceaccount.com` | **Yes** |
| `GOOGLE_PRIVATE_KEY` | Service Account PEM private key (including headers) | `-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n` | **Yes** |
| `ORDER_ID_LIMIT` | Numeric rollover ceiling per letter series | `9999` | No (default: 9999) |
| `ORDER_ID_MODE` | Order dispatcher mode (`sheet-row` or gateway) | `sheet-row` | No (default: sheet-row) |
| `RATE_LIMIT_STORE` | Rate limiter backend (`memory` or `upstash`) | `memory` | **Yes** |
| `SHEETS_STRICT` | Fail build if Google Sheets cannot be reached | `false` | No (default: false) |
| `ADMIN_TOKEN` | Secret header token for admin health checks | `ficcado-admin-secure-token` | No |

> [!NOTE]
> **Build-time inlining of `NEXT_PUBLIC_*`:** Values prefixed with `NEXT_PUBLIC_` are embedded into the client JavaScript bundle at build time. Updating these variables requires triggering a new build/deploy on Vercel.

---

## 4. Vercel Deployment Setup

### Step 4.1: Connect Repository
1. Log in to [Vercel](https://vercel.com/).
2. Select **Add New...** → **Project** → **Import Git Repository**.
3. Choose repository `Arjun7945/Fic_Quick_WebSite`.

### Step 4.2: Configure Root Directory
Configure the project root directory:
- **Root Directory:** `ficcado-website-frontend`
- **Framework Preset:** Next.js
- **Build Command:** `npm run build`
- **Output Directory:** Automatically set to Next.js default (`.next`)

### Step 4.3: Add Environment Variables
Enter the environment variables listed in Section 3 in the Vercel Project Settings. For `GOOGLE_PRIVATE_KEY`, paste the full multi-line key or format with escaped newlines (`\n`).

### Step 4.4: Deploy
Click **Deploy**. The build runs in ~1–2 minutes and executes `npm run sheets:bootstrap` as a pre-build step to verify sheet schema connectivity.

---

## 5. Domain Configuration (Custom DNS)

1. In Vercel: **Project Settings** → **Domains** → Add custom domain `ficcado.in`.
2. In DNS Provider:
   - **Apex Record (`@`):** Type `A`, Value `76.76.21.21` (Vercel Anycast IP).
   - **Subdomain (`www`):** Type `CNAME`, Value `cname.vercel-dns.com`.
3. Vercel will provision an SSL certificate automatically within minutes.

---

## 6. Pre-Launch Verification Checklist

- [ ] `npm run check:brand`: Passes with zero forbidden spellings.
- [ ] `npm run sheets:bootstrap`: Connects to `1U1bdFZH68Seg3OcV3Wtucmsqg8JL5i3MIGECglu_hfs` and verifies sheet tabs.
- [ ] Bag shows Subtotal only (no shipping line).
- [ ] Checkout shows configured delivery speeds: Indian Post (₹0), DTDC (₹50), Courier Partners (₹100).
- [ ] Orders submit to `POST /api/orders` and create a row in `New Sale Request` with `FIC-A0001` format.
- [ ] WhatsApp message opens with server IST timestamp and Reference ID.
