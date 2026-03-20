#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# PDFKit Next.js — One-command deployment script
# Run this on your local machine (not the build environment)
# ─────────────────────────────────────────────────────────────────────────────
set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

log()  { echo -e "${GREEN}✅ $1${NC}"; }
warn() { echo -e "${YELLOW}⚠️  $1${NC}"; }
err()  { echo -e "${RED}❌ $1${NC}"; exit 1; }
info() { echo -e "${CYAN}→  $1${NC}"; }
h1()   { echo -e "\n${BOLD}$1${NC}\n"; }

h1 "PDFKit Next.js Deployment"
echo "This script will:"
echo "  1. Check prerequisites (Node 18+, npm)"
echo "  2. Install dependencies"
echo "  3. Check your .env.local"
echo "  4. Build the static site"
echo "  5. Deploy to Vercel"
echo ""

# ── Step 1: Check Node version ─────────────────────────────────────────────
h1 "Step 1/5 — Checking prerequisites"
NODE_VERSION=$(node --version 2>/dev/null | sed 's/v//' | cut -d. -f1)
if [ -z "$NODE_VERSION" ] || [ "$NODE_VERSION" -lt 18 ]; then
    err "Node.js 18+ required. Install from https://nodejs.org/en/download"
fi
log "Node $(node --version) ✓"
log "npm $(npm --version) ✓"

# ── Step 2: Install dependencies ───────────────────────────────────────────
h1 "Step 2/5 — Installing dependencies"
npm install
log "Dependencies installed"

# ── Step 3: Check .env.local ───────────────────────────────────────────────
h1 "Step 3/5 — Checking environment variables"

if [ ! -f ".env.local" ]; then
    warn ".env.local not found — creating from example"
    cp .env.local.example .env.local
    echo ""
    echo -e "${YELLOW}${BOLD}⚠️  ACTION REQUIRED: Fill in .env.local before deploying!${NC}"
    echo ""
    echo "Open .env.local and set:"
    echo "  NEXT_PUBLIC_API_URL          → your backend URL (e.g. https://pdfkit-api.vercel.app)"
    echo "  NEXT_PUBLIC_SUPABASE_URL     → from Supabase project settings"
    echo "  NEXT_PUBLIC_SUPABASE_ANON_KEY → from Supabase project settings"
    echo "  NEXT_PUBLIC_RAZORPAY_KEY     → your live Razorpay key (rzp_live_...)"
    echo "  NEXT_PUBLIC_SITE_URL         → your domain (e.g. https://pdfkit.com)"
    echo ""
    read -p "Have you filled in .env.local? (y/N) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        warn "Please fill in .env.local first, then re-run this script"
        exit 0
    fi
fi

# Check key env vars are not empty
source .env.local 2>/dev/null || true
MISSING=""
[ -z "$NEXT_PUBLIC_API_URL" ]           && MISSING="$MISSING\n  • NEXT_PUBLIC_API_URL"
[ -z "$NEXT_PUBLIC_SUPABASE_URL" ]      && MISSING="$MISSING\n  • NEXT_PUBLIC_SUPABASE_URL"
[ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ] && MISSING="$MISSING\n  • NEXT_PUBLIC_SUPABASE_ANON_KEY"
[ -z "$NEXT_PUBLIC_RAZORPAY_KEY" ]      && MISSING="$MISSING\n  • NEXT_PUBLIC_RAZORPAY_KEY"

if [ -n "$MISSING" ]; then
    warn "These env vars are still empty in .env.local:$MISSING"
    warn "The site will build but tools won't work until they're set"
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo ""
    [[ ! $REPLY =~ ^[Yy]$ ]] && exit 0
else
    log "All required env vars set"
fi

# ── Step 4: Build ─────────────────────────────────────────────────────────
h1 "Step 4/5 — Building static site"
info "This generates 49 static HTML pages (homepage + 40 tool pages + 5 compress pages + alternative page + sitemap + robots)"
npm run build
log "Build complete"

echo ""
info "Pages generated:"
ls .next/server/app/ 2>/dev/null | head -20 || true
echo ""

# ── Step 5: Deploy ─────────────────────────────────────────────────────────
h1 "Step 5/5 — Deploying to Vercel"

if ! command -v vercel &> /dev/null; then
    info "Installing Vercel CLI..."
    npm install -g vercel
fi

echo ""
echo "Deploying to Vercel..."
echo "(First deploy will ask you to login and link a project)"
echo ""
vercel --prod

echo ""
log "🎉 Deployment complete!"
echo ""
echo -e "${BOLD}Next steps:${NC}"
echo "  1. Set env vars in Vercel dashboard: vercel.com/your-project/settings/environment-variables"
echo "  2. Add your domain: vercel.com/your-project/settings/domains"
echo "  3. Submit sitemap to Google Search Console: https://your-domain.com/sitemap.xml"
echo "  4. Verify all 40 tool pages are indexed: site:your-domain.com in Google"
