import type { Metadata } from 'next';
import { CONFIG } from '@/lib/config';
import '@/styles/globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(CONFIG.SITE_URL),
  title: {
    template: '%s | PDFKit',
    default:  'Free PDF Tools Online – Compress, Merge, Convert | PDFKit',
  },
  description:
    'PDFKit is a free online PDF toolkit. Compress, merge, split, convert, sign, and edit PDFs — no installation, no signup, works on any device.',
  keywords: ['pdf tools', 'compress pdf', 'merge pdf', 'pdf to word', 'free pdf editor online'],
  authors:   [{ name: 'PDFKit' }],
  creator:   'PDFKit',
  robots:    { index: true, follow: true },
  openGraph: {
    type:        'website',
    siteName:    'PDFKit',
    locale:      'en_IN',
    url:          CONFIG.SITE_URL,
    title:       'Free PDF Tools Online | PDFKit',
    description: '40+ free PDF tools — compress, merge, convert, sign, edit. No signup.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card:    'summary_large_image',
    title:   'Free PDF Tools Online | PDFKit',
    images:  ['/og-image.png'],
  },
  icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },
  manifest: '/site.webmanifest',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#080810',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* Loading spinner — shown until SPA injects and adds .spa-loaded */}
        <div id="pdfkit-loading" aria-hidden="true">
          <div style={{
            width: 40, height: 40,
            border: '3px solid #22223a',
            borderTopColor: '#C6FF00',
            borderRadius: '50%',
            animation: 'spin .8s linear infinite',
          }} />
        </div>

        {/* Page content — Server Component renders SEO HTML here */}
        {children}
      </body>
    </html>
  );
}
