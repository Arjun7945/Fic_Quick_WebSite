# Ficcado Backlink & Organic Authority Plan

> **Scope:** Organic Link Building, Domain Authority, Symmetrical Entity Signals, and Webmaster Verification  
> **Brand:** Ficcado (F-I-C-C-A-D-O)  
> **Authority Entity URL:** `https://ficcado.store`  
> **Leadership:** Sinan MS (CEO), Ganga Lakshmi (Operations & Creative), Rohith Murali (CFO)  
> **Lead Architect & Developer:** Arjun PS  
> **Compliance:** Strict adherence to Google Search Essentials and Anti-Spam Guidelines. No PBNs, automated link farms, or paid link schemes.

---

## 1. Principles of Legitimate Domain Authority

In modern search algorithms and AI search engines (ChatGPT Search, Perplexity, Claude, Google SGE), synthetic or paid backlinks create high risk of algorithmic penalties. Ficcado's authority is built on **genuine citations**, **symmetrical entity links**, and **organic editorial mentions**.

Symmetrical entity linking means:
- The website links to the external entity via Schema.org `sameAs` in `src/app/layout.tsx`.
- The external entity links back to `https://ficcado.store` in its bio or website field.

---

## 2. Foundational Entity Links (Owned Channels)

These must be configured and maintained symmetrically:

1. **Instagram Official Profile:**
   - **Official Handle:** `https://instagram.com/ficcado.store`
   - **Schema Status:** Embedded in `Organization.sameAs` in `src/app/layout.tsx`.
   - **Action Required:** Ensure the Instagram bio link points directly to `https://ficcado.store`.
   - **Drop Stories:** Use story stickers linking to specific category drops (e.g. `https://ficcado.store/categories/t-shirts`).

2. **Google Business Profile (Merchant & Local Entity):**
   - Create a Google Business Profile under **"Ficcado"** specifying retail/apparel.
   - Verify ownership via postcard/video verification.
   - Set primary website to `https://ficcado.store`.
   - Add catalog products with direct links to `https://ficcado.store/categories/t-shirts`.

3. **LinkedIn Company Page:**
   - Establish company page **"Ficcado"** citing founders Sinan MS, Ganga Lakshmi, and Rohith Murali.
   - List Arjun PS as Lead Full-Stack Architect & Developer.
   - Set website URL to `https://ficcado.store`.

4. **Technical & Developer Credits:**
   - Symmetrically linked via `https://ficcado.store/humans.txt` crediting the engineering team and developer fingerprint (**Arjun PS**).
   - Developer GitHub / portfolio linking back to `https://ficcado.store`.

5. **Pinterest & Behance / Visual Design Portfolio:**
   - Curate aesthetic lookbooks, typography boards, and 240 GSM textile photography with outbound links back to `https://ficcado.store/categories/t-shirts` and `https://ficcado.store/journal`.

---

## 3. High-Quality Editorial & Industry Backlinks

1. **Independent Streetwear & Fashion Publications:**
   - Pitch authentic founder stories (e.g. how three friends founded Ficcado in 2024 focusing on 240 GSM combed cotton unisex t-shirts and refusing fast-fashion shortcuts) to Indian fashion/lifestyle platforms (Homegrown, Grazia India, LBB, Youth Incorporated, Rolling Stone India).
2. **Local Business & Startup Databases:**
   - Register on verified, non-spam Indian startup directories (YourStory, Inc42 directories, Startup India, Tracxn).
3. **Collaborative Capsule Drops:**
   - Partner with emerging visual artists, graphic designers, or indie musicians for limited graphic t-shirt capsules. The collaborating artist links to their Ficcado capsule page from their portfolio and social channels.
4. **Authentic Micro-Influencer Unboxing:**
   - Send curated drops to micro-creators who share genuine unboxing reviews with link-in-bio or story swipe-ups to `https://ficcado.store`.

---

## 4. Search Engine Console & Webmaster Verification

To track crawling, indexation, click-through rates, and schema validation:

### 4.1 Google Search Console (GSC) Setup
1. Visit [Google Search Console](https://search.google.com/search-console).
2. Select **Domain** property (`ficcado.store`) via DNS verification:
   - Add the TXT record supplied by Google to your domain DNS provider (e.g. Cloudflare, Namecheap, GoDaddy).
3. Alternatively, if using HTML tag verification, configure the token in `.env.local`:
   ```bash
   GOOGLE_SITE_VERIFICATION=your-google-verification-token
   ```
4. Once verified, submit your dynamic sitemap:
   - Sitemap URL: `https://ficcado.store/sitemap.xml`
5. Inspect the following priority URLs to request initial indexing:
   - `https://ficcado.store/`
   - `https://ficcado.store/categories/t-shirts`
   - `https://ficcado.store/categories`
   - `https://ficcado.store/faq`
   - `https://ficcado.store/about`
   - `https://ficcado.store/journal`
   - `https://ficcado.store/humans.txt`
   - `https://ficcado.store/llms.txt`

### 4.2 Bing Webmaster Tools
1. Visit [Bing Webmaster Tools](https://www.bing.com/webmasters).
2. Import directly from Google Search Console (instant verification).
3. Verify that `https://ficcado.store/sitemap.xml` is listed and processed.

---

## 5. Rich Social Sharing (OpenGraph Verification)

Whenever links are shared on WhatsApp, iMessage, Twitter/X, or LinkedIn:
1. Ensure the item cards have high-resolution images (`image-1.webp`).
2. Verify previews with:
   - WhatsApp link preview
   - [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
   - [Twitter/X Card Validator]

---

## 6. Maintenance & Link Health Checklist

- [ ] Inspect 404 errors quarterly in Google Search Console.
- [ ] Keep category pages live even between drops so incoming backlinks never hit a 404 broken link.
- [ ] Monitor incoming referral domains in analytics to verify no spam link networks are targeting the domain.
- [ ] Keep `Organization.sameAs` in sync whenever new official social handles are created.
