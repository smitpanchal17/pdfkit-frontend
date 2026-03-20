# PDFKit — Deployment Guide

## Overview
PDFKit has two parts to deploy. Do them in order:
1. **Backend** (Express API) → Vercel
2. **Frontend** (Next.js + SPA) → Vercel

Your Supabase database is already live at `https://snhcniagvrblgkwpafsw.supabase.co` with all 13 tables created.

---

## Part 1 — Deploy the Backend

```bash
cd pdfkit-backend
npm install
npx vercel login          # sign in to Vercel
npx vercel --prod         # deploy — note the URL it gives you (e.g. pdfkit-backend.vercel.app)
```

Then go to **Vercel dashboard → your backend project → Settings → Environment Variables** and add:

| Variable | Value |
|----------|-------|
| `SUPABASE_URL` | `https://snhcniagvrblgkwpafsw.supabase.co` |
| `SUPABASE_ANON_KEY` | (see .env.example) |
| `SUPABASE_SERVICE_KEY` | Supabase → Settings → API → service_role key |
| `RAZORPAY_KEY_ID` | Razorpay → Settings → API Keys |
| `RAZORPAY_KEY_SECRET` | Razorpay → Settings → API Keys |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay → Webhooks → create webhook → copy secret |
| `ALLOWED_ORIGIN` | `https://allinonepdfmaker.com` (your frontend URL) |
| `ANTHROPIC_API_KEY` | console.anthropic.com → API Keys |
| `UPSTASH_REDIS_REST_URL` | console.upstash.com → Create DB → REST API |
| `UPSTASH_REDIS_REST_TOKEN` | console.upstash.com → Create DB → REST API |
| `NODE_ENV` | `production` |
| `STORAGE_BUCKET_UPLOADS` | `pdf-uploads` |
| `STORAGE_BUCKET_OUTPUTS` | `pdf-outputs` |

> **Important:** Vercel Pro required for `maxDuration: 300` (OCR support). Hobby plan times out at 10s.

After adding env vars: **Redeploy** once so they take effect.

Also in Razorpay dashboard:
- Go to Settings → Webhooks → Add webhook URL: `https://your-backend.vercel.app/api/payments/webhook`
- Select events: `payment.captured`, `payment.failed`, `subscription.cancelled`

---

## Part 2 — Deploy the Frontend

```bash
cd pdfkit-next
cp .env.local.example .env.local
```

Open `.env.local` and fill in:
```bash
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app   # ← from Part 1
NEXT_PUBLIC_RAZORPAY_KEY=rzp_live_xxxxxxxxxxxx        # ← your Razorpay live key
# (Supabase values are already filled in)
```

Then regenerate the SPA bundle with the new API URL and deploy:

```bash
node scripts/generate-bundle.js   # updates public/pdfkit-app.js with new config
npm run build                     # builds Next.js (also runs generate-bundle.js via prebuild)
npx vercel --prod                 # deploy
```

Add the same env vars to **Vercel dashboard → frontend project → Environment Variables**:
```
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app
NEXT_PUBLIC_SUPABASE_URL=https://snhcniagvrblgkwpafsw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...  (same as .env.local)
NEXT_PUBLIC_RAZORPAY_KEY=rzp_live_...
NEXT_PUBLIC_SITE_URL=https://allinonepdfmaker.com
```

---

## Part 3 — After deploying both

1. **Set custom domain:** Vercel → frontend project → Settings → Domains → add `allinonepdfmaker.com`
2. **Update ALLOWED_ORIGIN** in backend Vercel env vars to your real domain
3. **Submit sitemap to Google Search Console:**
   - Go to https://search.google.com/search-console
   - Add property → your domain
   - Sitemaps → enter `https://allinonepdfmaker.com/sitemap.xml`
4. **Update index.html API constant** to the real backend URL, then re-export the bundle

---

## Updating the SPA (index.html)

Every time you edit `index.html`, regenerate the bundle before deploying:

```bash
node scripts/generate-bundle.js   # sync changes to public/pdfkit-app.js
npm run build && npx vercel --prod
```

The `npm run build` command automatically runs `generate-bundle.js` first (via `prebuild` script).
