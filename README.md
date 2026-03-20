# PDFKit — Next.js SSG/SSR

Converted from SPA → Next.js App Router with Static Site Generation.
Every tool now has its own pre-rendered HTML page, indexed by Google independently.

## Architecture

```
SPA (before)          Next.js (after)
─────────────         ──────────────────────────────────────────
/ (all tools)    →    / (homepage, server rendered)
                 →    /compress-pdf  (static HTML + JSON-LD)
                 →    /merge-pdf     (static HTML + JSON-LD)
                 →    /pdf-to-word   (static HTML + JSON-LD)
                 →    ... 37 more tool pages
                 →    /sitemap.xml   (auto-generated)
                 →    /robots.txt    (auto-generated)
```

Each tool page gets:
- Unique `<title>` optimised for CTR
- Unique `<meta name="description">`
- `<h1>` → `<h2>` → `<h3>` heading structure
- `SoftwareApplication` JSON-LD schema
- `FAQPage` JSON-LD schema
- Related tools internal links
- Canonical URL

## Quick Start

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # Static build
```

## Deploy to Vercel

```bash
npm i -g vercel
vercel --prod
```

## Environment Variables

Create `.env.local`:
```
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_RAZORPAY_KEY=rzp_live_xxx
NEXT_PUBLIC_SITE_URL=https://pdfkit.com
```

## File Structure

```
app/
  layout.tsx          ← Root layout, fonts, global metadata
  page.tsx            ← Homepage (server component)
  [tool]/
    page.tsx          ← Tool pages (SSG — 40 static HTML files)
  sitemap.ts          ← Auto sitemap.xml
  robots.ts           ← Auto robots.txt

components/
  ToolPageContent.tsx ← Server component: H1-H3, FAQ, related tools (SEO HTML)
  ClientApp.tsx       ← Client component: loads full interactive SPA

lib/
  tools.ts            ← All 40 tools: IDs, names, endpoints, SEO metadata
  pricing.ts          ← Geo-aware pricing
  config.ts           ← Runtime config via env vars

public/
  pdfkit-app.js       ← Full interactive SPA (from original index.html)
  pdfkit-app.css      ← Full app styles

styles/
  globals.css         ← Minimal base styles for SSR HTML
```

## How It Works

1. **Build time**: Next.js calls `generateStaticParams()` which returns all 40 tool slugs
2. **For each tool**: `generateMetadata()` returns unique title/description/OG tags
3. **`ToolPageContent`** renders real HTML with H1, steps, FAQ, related links — **no JS required**
4. **Google crawls** each `/compress-pdf`, `/merge-pdf` etc. as a separate page
5. **Users load the page**: `ClientApp` hydrates, loads `pdfkit-app.js`, opens the tool modal

## SEO Impact

Before (SPA): Google sees 1 page at `/` with all tools hidden in JavaScript
After (SSG): Google sees 42 separate pages (homepage + 40 tools + sitemap)

Each tool page targets:
- Primary keyword: "compress pdf online free" (1.8M/mo)
- Long-tail keywords: "compress pdf without losing quality" (120K/mo)
- FAQ keywords: "how to compress pdf" (150K/mo)
