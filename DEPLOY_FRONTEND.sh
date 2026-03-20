#!/bin/bash
# ═══════════════════════════════════════════════════════════
# PDFKit Frontend — One-Command Deploy
# Run AFTER DEPLOY_NOW.sh finishes. Needs backend URL.
# ═══════════════════════════════════════════════════════════
set -e
G='\033[0;32m'; Y='\033[1;33m'; C='\033[0;36m'; B='\033[1m'; NC='\033[0m'

echo -e "${B}🚀 PDFKit Frontend — Deploying...${NC}\n"

echo -e "${Y}Paste your backend URL from DEPLOY_NOW.sh output:${NC}"
read -p "Backend URL: " BACKEND_URL
[[ "$BACKEND_URL" != https://* ]] && BACKEND_URL="https://$BACKEND_URL"
echo -e "${G}✅ Backend: $BACKEND_URL${NC}"

# Update .env.local
cat > .env.local << ENV
NEXT_PUBLIC_API_URL=$BACKEND_URL
NEXT_PUBLIC_SUPABASE_URL=https://snhcniagvrblgkwpafsw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNuaGNuaWFndnJibGdrd3BhZnN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5OTY4MjEsImV4cCI6MjA4OTU3MjgyMX0.sOL1IqFTgssvlBACEYN9CDY6jEAFcxPhiATdtHqM56M
NEXT_PUBLIC_RAZORPAY_KEY=rzp_live_SPQF7pVYaGRfqj
NEXT_PUBLIC_SITE_URL=https://allinonepdfmaker.com
ENV

# Regenerate SPA bundle with backend URL baked in
echo -e "\n${C}Regenerating SPA bundle...${NC}"
node scripts/generate-bundle.js
echo -e "${G}✅ Bundle updated with backend URL${NC}"

# Install deps
[ ! -d node_modules ] && npm install

# Build
echo -e "\n${C}Building 40 static pages...${NC}"
npm run build
echo -e "${G}✅ Build complete${NC}"

# Vercel CLI
if ! command -v vercel &>/dev/null; then npm install -g vercel; fi

TEAM="team_s5Pu1e9BoyngtUBrBfLDBOwr"

# Deploy as NEW project named pdfkit-frontend
echo -e "\n${C}Creating new Vercel project: pdfkit-frontend...${NC}"
DEPLOY_URL=$(vercel deploy --prod --yes --team $TEAM --name pdfkit-frontend 2>&1 | grep "https://" | tail -1)

# Set Vercel env vars
echo -e "\n${C}Setting environment variables...${NC}"
ev() {
  vercel env rm "$1" production --yes --team $TEAM 2>/dev/null || true
  printf '%s' "$2" | vercel env add "$1" production --yes --team $TEAM
  echo -e "${G}  ✅ $1${NC}"
}
ev "NEXT_PUBLIC_API_URL"            "$BACKEND_URL"
ev "NEXT_PUBLIC_SUPABASE_URL"       "https://snhcniagvrblgkwpafsw.supabase.co"
ev "NEXT_PUBLIC_SUPABASE_ANON_KEY"  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNuaGNuaWFndnJibGdrd3BhZnN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5OTY4MjEsImV4cCI6MjA4OTU3MjgyMX0.sOL1IqFTgssvlBACEYN9CDY6jEAFcxPhiATdtHqM56M"
ev "NEXT_PUBLIC_RAZORPAY_KEY"       "rzp_live_SPQF7pVYaGRfqj"
ev "NEXT_PUBLIC_SITE_URL"           "https://allinonepdfmaker.com"

# Final redeploy with env vars
vercel deploy --prod --yes --team $TEAM --name pdfkit-frontend

echo ""
echo -e "${B}════════════════════════════════════════${NC}"
echo -e "${B}${G}✅ Frontend LIVE!${NC}"
echo -e "${B}Frontend URL: ${C}$DEPLOY_URL${NC}"
echo -e "${B}════════════════════════════════════════${NC}"
echo ""
echo -e "${Y}3 final steps:${NC}"
echo -e "  1. Add domain: ${C}vercel.com → pdfkit-frontend → Settings → Domains → allinonepdfmaker.com${NC}"
echo -e "  2. Razorpay webhook: ${C}$BACKEND_URL/api/payments/webhook${NC}"
echo -e "  3. Google Search Console: ${C}https://allinonepdfmaker.com/sitemap.xml${NC}"
