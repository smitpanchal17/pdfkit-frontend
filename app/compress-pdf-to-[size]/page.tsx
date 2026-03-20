// ─────────────────────────────────────────────────────────────────────────────
// app/compress-pdf-to-[size]/page.tsx
// Programmatic pages: /compress-pdf-to-100kb, /compress-pdf-to-1mb etc.
// Each ranks for highly specific keywords with low competition.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ClientApp from '@/components/ClientApp';
import { CONFIG } from '@/lib/config';

const SIZE_PAGES: Record<string, {
  label:   string;
  bytes:   string;
  desc:    string;
  useCase: string;
  tips:    string[];
  volume:  string;
}> = {
  '100kb': {
    label:   '100KB',
    bytes:   '100,000 bytes',
    desc:    'Reduce your PDF to under 100KB online for free. Perfect for government portal uploads, online forms, and applications with strict size limits.',
    useCase: 'Many government portals (NTA, passport applications, UPSC, IBPS) require PDFs under 100KB. This tool compresses your document to fit within that limit without losing readability.',
    tips:    [
      'Use "Maximum" compression mode for the smallest possible output',
      'If your PDF contains high-resolution images, they will be downscaled to reduce size',
      'For scanned documents, ensure the scan resolution is 150 DPI or lower before compressing',
      'If 100KB is not achievable in one pass, try splitting the PDF first, then compressing each part',
    ],
    volume:  '70,000 searches/month',
  },
  '200kb': {
    label:   '200KB',
    bytes:   '200,000 bytes',
    desc:    'Compress your PDF to under 200KB online for free. Ideal for online job applications, UPSC uploads, and forms with size restrictions.',
    useCase: 'A 200KB limit is common in job applications, university admissions, and government examinations. Compress your CV, certificates, or application documents to meet this requirement.',
    tips:    [
      'Try "Balanced" compression first — it usually achieves 200KB for typical documents',
      'Remove unnecessary pages before compressing to reduce file size further',
      'Images in PDFs are the biggest size contributors — "Maximum" mode reduces them aggressively',
    ],
    volume:  '28,000 searches/month',
  },
  '500kb': {
    label:   '500KB',
    bytes:   '500,000 bytes',
    desc:    'Reduce your PDF to under 500KB online for free. Suitable for email attachments, online submissions, and sharing via messaging apps.',
    useCase: 'A 500KB PDF is easy to share via Gmail, Outlook, and most web forms. Compress your document to stay within email attachment policies and platform upload limits.',
    tips:    [
      '"Balanced" compression usually brings most PDFs under 500KB',
      'For multi-page documents, try "Light" compression to preserve quality while still meeting the limit',
      'ZIP archives are not required — 500KB PDFs share easily via WhatsApp and Telegram',
    ],
    volume:  '22,000 searches/month',
  },
  '1mb': {
    label:   '1MB',
    bytes:   '1,048,576 bytes',
    desc:    'Compress your PDF to under 1MB online for free. The most common file size limit for emails, portals, and online submissions.',
    useCase: 'The 1MB limit appears in countless email services, recruitment portals, and online forms. Compress your PDF to stay within this universal standard without compromising document quality.',
    tips:    [
      '"Balanced" mode reduces most PDFs to under 1MB while keeping text sharp and readable',
      'PDFs with many embedded images benefit most from compression',
      'Combine compression with page deletion to remove unnecessary content first',
    ],
    volume:  '90,000 searches/month',
  },
  '2mb': {
    label:   '2MB',
    bytes:   '2,097,152 bytes',
    desc:    'Compress PDF to under 2MB online for free. Works for most email clients and document management systems.',
    useCase: 'A 2MB limit is common in HR portals, LMS platforms, and content management systems. Use this tool when 1MB compression degrades quality too much but 2MB is the maximum allowed.',
    tips:    [
      '"Light" compression typically keeps PDFs under 2MB while preserving maximum quality',
      'Ideal for design files, brochures, and documents where image quality matters',
    ],
    volume:  '12,000 searches/month',
  },
};

interface PageProps {
  params: { size: string };
}

export async function generateStaticParams() {
  return Object.keys(SIZE_PAGES).map(size => ({ size }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const page = SIZE_PAGES[params.size];
  if (!page) return {};

  const title = `Compress PDF to ${page.label} Online Free — No Quality Loss | PDFKit`;
  return {
    title,
    description: page.desc,
    alternates: { canonical: `/compress-pdf-to-${params.size}` },
    openGraph: {
      title,
      description: page.desc,
      url: `${CONFIG.SITE_URL}/compress-pdf-to-${params.size}`,
    },
  };
}

export default function CompressPdfToSizePage({ params }: PageProps) {
  const page = SIZE_PAGES[params.size];
  if (!page) notFound();

  const adjacentSizes = Object.keys(SIZE_PAGES).filter(s => s !== params.size);

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: `Compress PDF to ${page.label} — PDFKit`,
      url: `${CONFIG.SITE_URL}/compress-pdf-to-${params.size}`,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Web Browser',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: `How do I compress a PDF to under ${page.label}?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `Upload your PDF to PDFKit, select "Maximum" compression level, then click Compress PDF. Most documents compress to under ${page.label} in seconds. Download the result immediately — no signup required.`,
          },
        },
        {
          '@type': 'Question',
          name: `What if my PDF is still over ${page.label} after compression?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `Try splitting the PDF into smaller sections first, then compressing each part. Alternatively, reduce the number of pages or remove high-resolution images using the Edit PDF tool before compressing.`,
          },
        },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main
        id="tool-seo-content"
        style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px 60px',
                 fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
      >
        <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif",
                     fontSize: 'clamp(24px,4vw,42px)', fontWeight: 800,
                     lineHeight: 1.1, marginBottom: '12px' }}>
          Compress PDF to {page.label} Online Free
        </h1>
        <p style={{ color: '#9090a8', fontSize: '15px', marginBottom: '32px', lineHeight: 1.7 }}>
          {page.desc}
        </p>

        {/* CTA */}
        <a
          href="/compress-pdf"
          style={{ background: '#C6FF00', color: '#000', fontWeight: 700, fontSize: '15px',
                   padding: '14px 28px', borderRadius: '100px', border: '2.5px solid #000',
                   display: 'inline-block', textDecoration: 'none', marginBottom: '40px',
                   boxShadow: '4px 4px 0 #000' }}
        >
          🗜️ Compress PDF to {page.label} — Free
        </a>

        <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '12px' }}>
          Why compress a PDF to {page.label}?
        </h2>
        <p style={{ color: '#ccc', fontSize: '14px', lineHeight: 1.8, marginBottom: '28px' }}>
          {page.useCase}
        </p>

        <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '12px' }}>
          How to compress PDF to {page.label} in 3 steps
        </h2>
        <ol style={{ paddingLeft: '24px', lineHeight: 2.2, fontSize: '14px', color: '#ccc', marginBottom: '28px' }}>
          <li>Open the <a href="/compress-pdf" style={{ color: '#C6FF00' }}>PDF Compressor</a> and upload your file</li>
          <li>Select <strong style={{ color: '#fff' }}>Maximum</strong> compression for the smallest output size</li>
          <li>Click <strong style={{ color: '#fff' }}>Compress PDF</strong> and download your {page.label} file</li>
        </ol>

        <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '12px' }}>Tips for {page.label} compression</h2>
        <ul style={{ paddingLeft: '24px', lineHeight: 2.2, fontSize: '14px', color: '#ccc', marginBottom: '36px' }}>
          {page.tips.map((tip, i) => <li key={i}>{tip}</li>)}
        </ul>

        {/* FAQ */}
        <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '16px' }}>Frequently asked questions</h2>
        <details style={{ background: '#0f0f1e', border: '1px solid #22223a', borderRadius: '10px', marginBottom: '8px', overflow: 'hidden' }}>
          <summary style={{ padding: '14px 18px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
            How do I compress a PDF to under {page.label}?
          </summary>
          <p style={{ padding: '0 18px 14px', color: '#888', fontSize: '13px', lineHeight: 1.7 }}>
            Upload your PDF to PDFKit, select "Maximum" compression, then click Compress PDF.
            Most documents reach under {page.label} in seconds. No signup required.
          </p>
        </details>
        <details style={{ background: '#0f0f1e', border: '1px solid #22223a', borderRadius: '10px', marginBottom: '8px', overflow: 'hidden' }}>
          <summary style={{ padding: '14px 18px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
            What if my PDF is still over {page.label} after compression?
          </summary>
          <p style={{ padding: '0 18px 14px', color: '#888', fontSize: '13px', lineHeight: 1.7 }}>
            Split the PDF into smaller sections first, then compress each part. Or remove unnecessary
            pages using the <a href="/delete-pdf-pages" style={{ color: '#C6FF00' }}>Delete Pages</a> tool before compressing.
          </p>
        </details>

        {/* Related size pages — internal linking chain */}
        <h2 style={{ fontSize: '20px', fontWeight: 800, margin: '32px 0 16px' }}>Other size targets</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {adjacentSizes.map(s => (
            <a
              key={s}
              href={`/compress-pdf-to-${s}`}
              style={{ background: '#0f0f1e', border: '2px solid #22223a', borderRadius: '8px',
                       padding: '8px 16px', textDecoration: 'none', color: '#e8e8f2',
                       fontSize: '13px', fontWeight: 600 }}
            >
              Compress to {SIZE_PAGES[s].label}
            </a>
          ))}
          <a
            href="/compress-pdf"
            style={{ background: '#C6FF0022', border: '2px solid #C6FF0044', borderRadius: '8px',
                     padding: '8px 16px', textDecoration: 'none', color: '#C6FF00',
                     fontSize: '13px', fontWeight: 600 }}
          >
            ← Back to Compress PDF
          </a>
        </div>
      </main>

      <ClientApp initialPage="tool" initialToolId="compress-pdf" />
    </>
  );
}
