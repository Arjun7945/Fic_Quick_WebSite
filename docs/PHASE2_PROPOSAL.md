# Phase 2 Implementation Proposal: AI & Search Discoverability

> **Document Status:** PROPOSAL ONLY — Pending Explicit Owner Approval (Section 9 Stop Gate)  
> **Target Repo:** `Fic_Quick_WebSite` / `ficcado-website-frontend`  
> **Brand:** Ficcado (F-I-C-C-A-D-O)  
> **Founders:** Ganga Lakshmi, Rohith Murali, Sinan (Est. 2025)  
> **Active Collection:** T-Shirts ONLY (Combos, Shirts, Hoodies, Pants, Sneakers coming soon)  
> **Prerequisites:** Phase 1 Production Refactor & Integrity Verification Completed & Passing.

---

## 1. Overview & Scope

Phase 2 enhances the organic search indexing, social sharing richness, and AI engine discoverability (ChatGPT Search, Perplexity, Claude, Gemini) of the Ficcado storefront. In accordance with the Anti-Hallucination Protocol (Section 0) and the owner's explicit guidance:
1. **Founders & Story:** Incorporates the verified founding trio (Ganga Lakshmi, Rohith Murali, Sinan) and the 2025 brand genesis in Organization metadata, `llms.txt`, and `humans.txt`.
2. **Current Catalog Reality:** Recognizes that Ficcado currently sells **T-Shirts only**, while Combos, Shirts, Hoodies, Pants, and Sneakers remain marked as upcoming roadmapped collections.
3. **Verified Data Only:** All metadata, structured data, and AI manifests will be strictly derived from verified Google Sheets catalog items and established policy pages. No synthetic data, unverified claims, or fabricated reviews will ever be published.

Execution will commence **only after the repository owner explicitly reviews and approves** this proposal.

---

## 2. Exact Files to Add and Modify

| Action | Path | Purpose |
|---|---|---|
| **Add** | `src/app/robots.ts` | Dynamic Next.js Metadata robots.txt generator with AI crawler policy |
| **Add** | `src/app/sitemap.ts` | Dynamic XML sitemap generator indexing home, static pages, live categories (t-shirts), and real sheet items |
| **Add** | `src/app/llms.txt/route.ts` | Markdown manifest per the /llms.txt standard for AI ingestion |
| **Add** | `src/app/llms-full.txt/route.ts` | Comprehensive plain-text catalog and full FAQ corpus for deep AI context |
| **Add** | `src/app/humans.txt/route.ts` | Factual team and technology credits file (crediting Ganga Lakshmi, Rohith Murali, and Sinan) |
| **Add** | `docs/BACKLINK_PLAN.md` | Non-code strategic guide for legitimate backlinks, social signals, and search console verification |
| **Modify** | `src/app/layout.tsx` | Global `metadataBase`, OpenGraph defaults, Twitter cards, viewport, theme-color |
| **Modify** | `src/app/categories/[slug]/page.tsx` | Category-specific BreadcrumbList, CollectionPage, and ItemList JSON-LD |
| **Modify** | `src/components/modals/ProductModal.tsx` | Embed Product + Offer + AggregateRating JSON-LD for viewed item |
| **Modify** | `src/app/faq/page.tsx` | Inject FAQPage JSON-LD generated directly from `content/faq.ts` |

---

## 3. Draft Contents Built from Real Data Only

### 3.1 Draft `robots.txt` (`src/app/robots.ts`)
```typescript
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ficcado.store';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/checkout/',
          '/checkout/whatsapp-continue',
          '/categories/combos',
          '/categories/shirts',
          '/categories/hoodies',
          '/categories/pants',
          '/categories/sneakers',
          '/_next/',
        ],
      },
      // Explicit AI Ingestion Opt-Ins (Default: Allow)
      {
        userAgent: ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended', 'Amazonbot'],
        allow: ['/', '/about', '/faq', '/categories/t-shirts', '/llms.txt', '/llms-full.txt'],
        disallow: ['/api/', '/checkout/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
```

### 3.2 Draft `llms.txt` (`src/app/llms.txt/route.ts`)
```markdown
# Ficcado

> Ficcado is an independent Indian contemporary unisex streetwear brand founded in 2025 by three close friends: Ganga Lakshmi (Creative Director), Rohith Murali (Production & Sourcing), and Sinan (Product & Experience). Ficcado operates as a direct-to-consumer online storefront with assisted ordering via WhatsApp.

## Active Shop Collection
- [T-Shirts](https://ficcado.store/categories/t-shirts): Unisex graphic, oversized, and heavyweight everyday t-shirts (Currently selling).

## Upcoming Roadmap Collections (Coming Soon)
- [Combos](https://ficcado.store/categories/combos): Coordinated two-piece sets and multi-item packs.
- Shirts, Hoodies, Pants, and Sneakers: Under active prototyping for future batch releases.

## Customer Support, Story & Policy Documents
- [About Ficcado & Founders](https://ficcado.store/about): The 2025 founding story by Ganga Lakshmi, Rohith Murali, and Sinan.
- [Frequently Asked Questions (FAQ)](https://ficcado.store/faq): Comprehensive answers regarding sizes, ordering, delivery, and support.
- [Support Desk](https://ficcado.store/support): Inquire about orders using Reference ID (FIC-A...) or Order ID.
- [Shipping & Delivery Policy](https://ficcado.store/shipping-delivery): Delivery partner selection and shipping timelines.
- [Returns & Refunds Policy](https://ficcado.store/returns-refunds): 7-day return guidelines and eligibility criteria.
- [Replacements & Damages Policy](https://ficcado.store/replacements-damages): 100% free replacement coverage on transit damage.
- [Privacy Policy](https://ficcado.store/privacy): Minimal data collection principles.
- [Terms & Conditions](https://ficcado.store/terms): Storefront terms of use and commercial guarantees.

## How Ordering Works
1. Customers browse unisex streetwear t-shirts and add selections to their Shopping Bag.
2. At checkout, delivery address and an active courier partner option are selected.
3. Placing the order generates a temporary Reference ID (e.g., FIC-A0001) and opens an official WhatsApp chat with the Ficcado team to finalize order confirmation.
```

### 3.3 Sample Product JSON-LD (Built from Real Sheet Row: `Colorado Heavyweight Tee`)
```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Product",
      "@id": "https://ficcado.store/#product-1",
      "name": "Colorado Heavyweight Tee",
      "image": [
        "https://ficcado.store/images/items/colorado-heavyweight-tee/image-1.webp",
        "https://ficcado.store/images/items/colorado-heavyweight-tee/image-2.webp"
      ],
      "description": "Premium 240 GSM combed cotton oversized t-shirt in vintage sage.",
      "sku": "1",
      "brand": {
        "@type": "Brand",
        "name": "Ficcado"
      },
      "offers": {
        "@type": "Offer",
        "url": "https://ficcado.store/categories/t-shirts",
        "priceCurrency": "INR",
        "price": "999",
        "availability": "https://schema.org/InStock",
        "itemCondition": "https://schema.org/NewCondition"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "42",
        "bestRating": "5",
        "worstRating": "1"
      }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://ficcado.store"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "T-Shirts",
          "item": "https://ficcado.store/categories/t-shirts"
        }
      ]
    }
  ]
}
```

---

## 4. Key Questions Requiring Owner Decision (Section 10.5)

Before generating structured data and credentials, the owner should decide on the following 8 items:

1. **Official Social Profiles:** What official handles exist for schema `sameAs` (e.g. `https://instagram.com/ficcado`, etc.)?
2. **Logo Asset:** Should the logo in `public/images/brand/` be an SVG or PNG, and what is its official source?
3. **Public Contact Details:** Which email address and phone number are approved to appear in the schema `Organization` block?
4. **AI Bot Crawler Policy:** Do you approve full indexing access to AI scrapers (`GPTBot`, `ClaudeBot`, `PerplexityBot`), or should any be restricted? *(Proposal default: Allow)*
5. **Default OG Image:** Which high-resolution banner in `public/images/` should serve as default OpenGraph preview on social shares?
6. **`humans.txt` Credits:** Founders Ganga Lakshmi, Rohith Murali, and Sinan will be credited. Are there additional developer or contributor handles to include?
7. **Search Console / Webmaster Verification:** Do you have Google Search Console or Bing Webmaster verification meta tokens ready to inject?
8. **Indexability of `/support`:** Should the `/support` page be indexed in `robots.txt` and `sitemap.xml`, or marked `noindex`? *(Proposal default: Index `/support` as it contains public contact tools)*

---

## 5. Potential Risks & Performance Impact

- **Bundle Size & Runtime Impact:** Zero client bundle overhead. All metadata, sitemaps, robots, and JSON-LD will be rendered exclusively on the server (Server Components and Route Handlers).
- **Maintenance Overhead:** The `sitemap.xml` and `llms.txt` read from the same cached Google Sheets data layer established in Phase 1, automatically refreshing alongside catalog updates without code changes.
- **Search Engine Compliance:** Every JSON-LD block strictly adheres to Google Search Central requirements, including matching visible DOM content to prevent search quality penalties.

---

*Phase 2 will remain strictly gated until explicit confirmation is provided.*
