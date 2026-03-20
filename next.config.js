/** @type {import('next').NextConfig} */
const nextConfig = {
  // Trailing slash: false = /compress-pdf not /compress-pdf/
  trailingSlash: false,

  // Image optimization (Vercel handles this)
  images: { unoptimized: false },

  // Security + cache headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options',   value: 'nosniff' },
          { key: 'X-Frame-Options',           value: 'DENY' },
          { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',        value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        // Immutable cache for Next.js static assets + our SPA bundle
        source: '/_next/static/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        // Cache SPA assets aggressively (they're versioned by content)
        source: '/(pdfkit-app.js|pdfkit-app.css)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' }],
      },
    ];
  },
};

module.exports = nextConfig;
