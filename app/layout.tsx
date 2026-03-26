import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { CONFIG } from '@/lib/config';
import '@/styles/globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(CONFIG.SITE_URL),
  title: { template: '%s | PDFKit', default: 'Free PDF Tools Online – Compress, Merge, Convert & More | PDFKit' },
  description: '40+ browser-based PDF tools — compress, merge, split, convert, sign, and edit any PDF. No installation. No account needed.',
  keywords: ['pdf tools', 'compress pdf', 'merge pdf', 'pdf to word', 'free pdf editor online', 'pdf converter', 'split pdf', 'pdf compressor'],
  authors: [{ name: 'PDFKit' }],
  creator: 'PDFKit',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    siteName: 'PDFKit',
    locale: 'en_US',
    url: CONFIG.SITE_URL,
    title: 'Free PDF Tools Online – Compress, Merge, Convert & More | PDFKit',
    description: '40+ free PDF tools — compress, merge, split, convert, sign, and edit any PDF. No installation. No account needed.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'PDFKit - Free PDF Tools Online' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free PDF Tools Online | PDFKit',
    description: '40+ free PDF tools — compress, merge, convert, sign, edit. No signup.',
    images: ['/og-image.png'],
  },
  icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },
  manifest: '/site.webmanifest',
};

export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#080810' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <script dangerouslySetInnerHTML={{__html: "(function(){var t=localStorage.getItem('theme');document.documentElement.setAttribute('data-theme',t||'dark');if(!t)localStorage.setItem('theme','dark');})();"}} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        <script src="https://checkout.razorpay.com/v1/checkout.js" async />
        <script src="/auth-patch.js" defer />
      </head>
      <body>
        <div id="pdfkit-loading" aria-hidden="true" />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
