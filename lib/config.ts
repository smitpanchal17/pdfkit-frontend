// ─────────────────────────────────────────────────────────────────────────────
// lib/config.ts — Runtime configuration
// ─────────────────────────────────────────────────────────────────────────────

export const CONFIG = {
  // ⚠️ Set these before deploying
  API_URL:          process.env.NEXT_PUBLIC_API_URL          || '',
  SUPABASE_URL:     process.env.NEXT_PUBLIC_SUPABASE_URL     || '',
  SUPABASE_ANON:    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  RAZORPAY_KEY:     process.env.NEXT_PUBLIC_RAZORPAY_KEY     || '',
  SITE_URL:         process.env.NEXT_PUBLIC_SITE_URL         || 'https://pdfkit.com',
  SITE_NAME:        'PDFKit',
  SITE_TAGLINE:     'Free PDF Tools Online',
};

export const PLAN_LIMITS = {
  free:     3,
  pro:      50,
  proPlus:  Infinity,
  business: Infinity,
} as const;

export const FILE_SIZE_LIMITS = {
  free:     25  * 1024 * 1024,  // 25 MB
  pro:      200 * 1024 * 1024,  // 200 MB
  proPlus:  1024 * 1024 * 1024, // 1 GB
  business: 1024 * 1024 * 1024, // 1 GB
} as const;
