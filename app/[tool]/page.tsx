// ─────────────────────────────────────────────────────────────────────────────
// app/[tool]/page.tsx — Individual tool pages (Static Site Generation)
//
// Every tool gets its own fully-rendered HTML page at build time:
//   /compress-pdf  → <title>Compress PDF Online Free...</title> + content
//   /merge-pdf     → <title>Merge PDF Files Online Free...</title> + content
//   etc.
//
// Google indexes each page as a separate document with unique:
//   - <title>
//   - <meta name="description">
//   - <h1>, <h2>, <h3> headings
//   - JSON-LD SoftwareApplication + FAQPage schema
//   - Canonical URL
//   - Internal links to related tools
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TOOLS, getTool, getAllToolSlugs } from '@/lib/tools';
import ClientApp from '@/components/ClientApp';
import ToolPageContent from '@/components/ToolPageContent';
import { CONFIG } from '@/lib/config';

interface PageProps {
  params: { tool: string };
}

// ─── Static paths — generates a page for every tool at build time ─────────────
export async function generateStaticParams() {
  return getAllToolSlugs().map(slug => ({ tool: slug }));
}

// ─── Per-tool metadata ────────────────────────────────────────────────────────
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const tool = getTool(params.tool);
  if (!tool) return {};

  return {
    title:       tool.seo.title,
    description: tool.seo.desc,
    alternates: {
      canonical: `/${tool.id}`,
    },
    openGraph: {
      type:        'website',
      title:       tool.seo.title,
      description: tool.seo.desc,
      url:         `${CONFIG.SITE_URL}/${tool.id}`,
      images: [{
        url:    `/og/${tool.id}.png`,
        width:  1200,
        height: 630,
        alt:    tool.seo.title,
      }],
    },
    twitter: {
      card:        'summary_large_image',
      title:       tool.seo.title,
      description: tool.seo.desc,
      images:      [`/og/${tool.id}.png`],
    },
  };
}

// ─── Related tools logic ───────────────────────────────────────────────────────
function getRelatedTools(tool: ReturnType<typeof getTool>) {
  if (!tool) return [];
  // Same category tools, excluding self — up to 4
  const sameCat = TOOLS.filter(t => t.cat === tool.cat && t.id !== tool.id).slice(0, 4);
  // Also include the "reverse" tool if it exists
  const reverseMap: Record<string, string> = {
    'pdf-to-word':   'word-to-pdf',
    'word-to-pdf':   'pdf-to-word',
    'pdf-to-jpg':    'jpg-to-pdf',
    'jpg-to-pdf':    'pdf-to-jpg',
    'pdf-to-excel':  'excel-to-pdf',
    'excel-to-pdf':  'pdf-to-excel',
    'pdf-to-png':    'png-to-pdf',
    'png-to-pdf':    'pdf-to-png',
    'pdf-to-powerpoint': 'powerpoint-to-pdf',
    'powerpoint-to-pdf': 'pdf-to-powerpoint',
    'protect-pdf':   'unlock-pdf',
    'unlock-pdf':    'protect-pdf',
    'merge-pdf':     'split-pdf',
    'split-pdf':     'merge-pdf',
    'compress-pdf':  'merge-pdf',
  };
  const reverse = reverseMap[tool.id] ? getTool(reverseMap[tool.id]) : null;
  const results = [...sameCat];
  if (reverse && !results.find(t => t.id === reverse.id)) {
    results.unshift(reverse);
  }
  return results.slice(0, 4);
}

// ─── FAQ content per tool type ────────────────────────────────────────────────
function getFAQ(tool: ReturnType<typeof getTool>): Array<{q: string; a: string}> {
  if (!tool) return [];
  const faqs: Record<string, Array<{q:string;a:string}>> = {
    'compress-pdf': [
      { q:'How do I compress a PDF without losing quality?', a:'Upload your PDF and choose "Balanced" compression. PDFKit removes hidden data and optimises images while keeping visual quality intact. Most PDFs compress by 40–80% with no visible quality loss.' },
      { q:'Is there a file size limit for compression?', a:'Free plan: up to 25MB. Pro plan: up to 200MB. Pro+ and Business: up to 1GB per file.' },
      { q:'Why is my PDF still large after compression?', a:'PDFs with high-resolution scans or embedded fonts can be harder to compress. Try "High" compression mode for maximum size reduction.' },
      { q:'Is it safe to compress my PDF online?', a:'Yes. All files are transferred over HTTPS, stored in encrypted cloud buckets, and automatically deleted 1 hour after processing. PDFKit never reads your document content.' },
    ],
    'merge-pdf': [
      { q:'How many PDFs can I merge at once?', a:'Free plan: up to 10 PDFs. Pro: up to 20. Pro+ and Business: up to 50 PDFs in one merge operation.' },
      { q:'Can I merge password-protected PDFs?', a:'Yes. PDFKit automatically handles encrypted PDFs. You may need to enter the password for each protected file.' },
      { q:'Will merging PDFs reduce quality?', a:'No. PDFKit merges PDFs by combining pages without re-encoding content, so quality is preserved exactly.' },
      { q:'Can I change the order of pages before merging?', a:'Yes. After uploading, drag and drop files to set the merge order. You can also use the Reorder Pages tool after merging.' },
    ],
    'pdf-to-word': [
      { q:'Will the converted Word file keep the original formatting?', a:'PDFKit preserves text layout, tables, columns, and images in most PDFs. Complex layouts with unusual fonts may need minor manual adjustments.' },
      { q:'Can I convert a scanned PDF to Word?', a:'Scanned PDFs (image-based) require OCR technology to extract text. For best results with scanned documents, use a PDF with a text layer.' },
      { q:'What Word format is the output?', a:'PDFKit converts to .docx (Word 2007+), which is compatible with Microsoft Word, Google Docs, LibreOffice, and all modern office suites.' },
      { q:'Is there a limit on how many pages I can convert?', a:'Free plan: up to 25MB file size. For large documents, upgrade to Pro (200MB) or Pro+ (1GB).' },
    ],
  };
  // Return tool-specific FAQ or a generic one
  return faqs[tool.id] || [
    { q:`Is ${tool.name} free to use?`, a:`Yes. ${tool.name} is free for files up to 25MB with up to 3 tasks per day. Upgrade to Pro for unlimited use.` },
    { q:'Do I need to create an account?', a:'No account is needed for free tasks. Sign up to unlock more daily tasks and larger file sizes.' },
    { q:'Is my file secure?', a:'All files are encrypted during transfer and automatically deleted 1 hour after processing. PDFKit never accesses your document content.' },
    { q:'Does this work on mobile?', a:'Yes. PDFKit is fully optimised for iOS and Android browsers. No app download required.' },
  ];
}

// ─── Page component ────────────────────────────────────────────────────────────
export default function ToolPage({ params }: PageProps) {
  const tool = getTool(params.tool);
  if (!tool) notFound();

  const related = getRelatedTools(tool);
  const faqs    = getFAQ(tool);

  // JSON-LD: SoftwareApplication + HowTo + FAQPage
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: `${tool.name} — PDFKit`,
      url: `${CONFIG.SITE_URL}/${tool.id}`,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Web Browser',
      description: tool.seo.desc,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ];

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/*
        ToolPageContent: pure Server Component HTML.
        Fully visible to Google before any JS runs.
        Contains: H1, H2/H3 content, FAQ, related tools, internal links.
        This HTML is what gets indexed and ranked.
      */}
      <ToolPageContent tool={tool} relatedTools={related} faqs={faqs} />

      {/*
        ClientApp: hydrates on the client.
        Opens the tool modal automatically for the current tool.
        Users interact with the tool via React state — no page reload.
      */}
      <ClientApp initialPage="tool" initialToolId={tool.id} />
    </>
  );
}
