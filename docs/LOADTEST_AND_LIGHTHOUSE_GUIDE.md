# Load Testing & Lighthouse Run Guide — Ficcado

**Purpose:** Comprehensive instructions for executing automated load tests and client performance audits against staging environments.  
**Status in Local Environment:**
- **Lighthouse:** `NOT RUN: Headless Chrome / Lighthouse CLI not configured in local Node runner`.
- **k6 Load Test:** `NOT RUN: k6 binary not installed in local environment; production Google Sheet must never be targeted by load testing`.

---

## 1. Google Lighthouse Audit Run Guide

Execute Lighthouse audits against your live Netlify preview URL (or local `next start` server) using either the Google Chrome DevTools UI or the Lighthouse CLI.

### Option A: Using Chrome DevTools (Recommended for Mobile)
1. Open Google Chrome.
2. Navigate to your deployed preview URL (e.g., `https://deploy-preview-123--ficcado.netlify.app`).
3. Press `F12` (or `Cmd+Option+I` on macOS) to open Chrome DevTools.
4. Click the **Lighthouse** tab in the top tab strip.
5. In the configuration panel:
   - **Mode:** Navigation
   - **Device:** **Mobile** (Critical: tests 4G throttling and mobile CPU)
   - **Categories:** Performance, Accessibility, Best Practices, SEO.
6. Click **Analyze page load**.
7. Target scores:
   - Performance: ≥ 90
   - Accessibility: ≥ 95
   - Best Practices: 100
   - SEO: 100

### Option B: Using Lighthouse CLI (Headless)
Run the automated CLI report in an environment with Chrome installed:

```bash
# Install Lighthouse globally
npm install -g lighthouse

# Run mobile audit against preview URL
lighthouse https://deploy-preview-123--ficcado.netlify.app \
  --preset=desktop \
  --output=html \
  --output-path=./docs/lighthouse-report.html \
  --view
```

---

## 2. k6 Staging Load Testing Guide

> **CRITICAL RULE:** NEVER run load tests against the production spreadsheet (`1U1bdFZH68Seg3OcV3Wtucmsqg8JL5i3MIGECglu_hfs`). Load testing against production will exhaust the Google Sheets quota (60 requests/minute) and interrupt real customer orders.

### Step 1: Install k6
- **Windows (winget):** `winget install k6 --source winget`
- **macOS (Homebrew):** `brew install k6`
- **Linux:** `sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E10B46872F26AB43CA3EE5 && sudo apt-get update && sudo apt-get install k6`

### Step 2: Run Against Isolated Staging Server
1. Start your local or staging server with a dedicated test spreadsheet:
   ```bash
   cd ficcado-website-frontend
   export GOOGLE_SHEET_ID=$TEST_GOOGLE_SHEET_ID
   npm run start
   ```

2. Run the capsule drop load simulation:
   ```bash
   k6 run --env SITE_URL=http://localhost:3000 scripts/loadtest/k6-loadtest.js
   ```

### Step 3: Run Order Concurrency Stress Test
Run the parallel orders benchmark script:
```bash
cd ficcado-website-frontend
node scripts/loadtest/parallel-orders.mjs
```
Expected output: 20 parallel order dispatches yield 20 strictly distinct Reference IDs with zero race conditions or duplicates.
