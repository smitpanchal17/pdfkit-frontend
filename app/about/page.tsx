import type { Metadata } from 'next';
import { CONFIG } from '@/lib/config';

export const metadata: Metadata = {
  title: 'About GetPDFKit — Free Browser-Based PDF Tools',
  description: 'GetPDFKit provides 40+ free browser-based PDF tools. Learn about our mission, privacy commitment, and India-first approach to document productivity.',
  alternates: {
    canonical: `${CONFIG.SITE_URL}/about`,
  },
};

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'GetPDFKit',
  url: CONFIG.SITE_URL,
  logo: `${CONFIG.SITE_URL}/og-image.png`,
  description: 'GetPDFKit provides 40+ free browser-based PDF tools including compress, merge, split, convert, sign, and edit. No installation required.',
  foundingDate: '2024',
  areaServed: 'IN',
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 24px', lineHeight: 1.8, color: 'inherit' }}>
        <h1>About GetPDFKit</h1>

        <p>
          GetPDFKit is a free, browser-based PDF toolkit with 40+ tools — compress, merge, split, convert,
          sign, edit, OCR, watermark, protect, and more. No installation required. No account needed for
          basic use.
        </p>

        <h2>Our Mission</h2>
        <p>
          We believe PDF tools should be fast, free, and private. Most PDF utilities either demand a subscription
          upfront or sacrifice your document privacy by storing files indefinitely. GetPDFKit was built to be
          different: every file you process is automatically deleted within 60 minutes of your session ending.
          We never read, sell, or retain your document content.
        </p>

        <h2>Why GetPDFKit?</h2>
        <ul>
          <li><strong>40+ tools in one place</strong> — organize, convert, secure, edit, and optimize, without jumping between websites</li>
          <li><strong>India-first pricing</strong> — Pro plans from ₹249/month, billed in INR, no USD conversion hassle</li>
          <li><strong>Privacy-first processing</strong> — files are processed on secure servers and permanently deleted after your session</li>
          <li><strong>No installation, no signup for free tools</strong> — works entirely in your browser on desktop and mobile</li>
          <li><strong>Dark mode</strong> — easy on the eyes for long document sessions</li>
        </ul>

        <h2>Privacy and Security</h2>
        <p>
          All file transfers use HTTPS encryption. Uploaded files are stored in isolated cloud buckets and
          are never accessible to other users. Files are automatically and permanently deleted within
          60 minutes of processing — not archived, not indexed, not shared. Our servers never access
          the content of your documents.
        </p>
        <p>
          For full details, see our <a href="/privacy">Privacy Policy</a>.
        </p>

        <h2>Our Tools</h2>
        <p>
          GetPDFKit covers every common PDF task:
        </p>
        <ul>
          <li><strong>Compression:</strong> <a href="/compress-pdf">Compress PDF</a> — reduce file size by up to 90%</li>
          <li><strong>Organization:</strong> <a href="/merge-pdf">Merge</a>, <a href="/split-pdf">Split</a>, <a href="/rotate-pdf">Rotate</a>, <a href="/reorder-pages">Reorder pages</a></li>
          <li><strong>Conversion:</strong> <a href="/pdf-to-word">PDF to Word</a>, <a href="/pdf-to-excel">PDF to Excel</a>, <a href="/pdf-to-jpg">PDF to JPG</a>, <a href="/word-to-pdf">Word to PDF</a>, and 15+ more formats</li>
          <li><strong>Security:</strong> <a href="/protect-pdf">Password protect</a>, <a href="/unlock-pdf">Remove password</a>, <a href="/redact-pdf">Redact sensitive content</a></li>
          <li><strong>Editing:</strong> <a href="/edit-pdf">Annotate and highlight</a>, <a href="/sign-pdf">Electronic signature</a>, <a href="/watermark-pdf">Add watermark</a></li>
        </ul>

        <h2>Plans and Pricing</h2>
        <p>
          Basic tools are completely free — no account, no watermark, up to 25 MB per file and 3 operations
          per day. For users who need more, Pro plans start at ₹249/month with 200 MB files and 50 daily
          operations. Pro+ (₹399/month) removes all limits. Business (₹799/month) adds API access and team
          seats.
        </p>
        <p>
          <a href="/pricing">See all plans and pricing →</a>
        </p>

        <h2>Contact</h2>
        <p>
          For support, billing questions, or general enquiries, please use the in-app chat or reach us via
          the feedback button on any tool page. We aim to respond within 1 business day.
        </p>
      </main>
    </>
  );
}
