// ─────────────────────────────────────────────────────────────────────────────
// components/ToolPageContent.tsx — Server Component
// Pure HTML, no JS. Google sees this immediately.
// ─────────────────────────────────────────────────────────────────────────────
import type { Tool } from '@/lib/tools';

interface Props {
  tool:         Tool;
  relatedTools: Tool[];
  faqs:         Array<{ q: string; a: string }>;
}

// Verb+object content map for common tools
const TOOL_CONTENT: Record<string, { steps: string[]; whyUse: string; tips: string[] }> = {
  'compress-pdf': {
    steps: [
      'Upload your PDF by clicking the upload area or dragging it in',
      'Choose a compression level: Light (best quality), Balanced (recommended), or Maximum (smallest file)',
      'Click "Compress PDF" and wait a few seconds',
      'Download your compressed PDF — typically 40–90% smaller',
    ],
    whyUse: 'Large PDF files cause problems when emailing, uploading to government portals, or sharing on WhatsApp. Compressing reduces file size without visible quality loss, making files easier to share and store.',
    tips: [
      'Use "Balanced" for most documents — it halves file size with no visible quality difference',
      'For scanned documents, "Maximum" compression can reduce size by up to 90%',
      'If quality matters (e.g. print-ready files), use "Light" compression',
      'Compress before merging multiple PDFs to keep the combined file manageable',
    ],
  },
  'merge-pdf': {
    steps: [
      'Click the upload area or drag multiple PDF files into the dropzone',
      'Drag files to reorder them — the final PDF will follow this order',
      'Click "Merge PDFs" to combine all files',
      'Download your merged PDF as a single file',
    ],
    whyUse: 'Combining multiple PDFs into one makes documents easier to share, archive, and submit. Ideal for combining chapters, reports, invoices, or any multi-part documents.',
    tips: [
      'You can merge up to 10 PDFs on the free plan (20 on Pro, 50 on Pro+)',
      'Files are merged in the order shown — drag to reorder before processing',
      'Compressed PDFs merge faster — compress first if files are large',
    ],
  },
  'pdf-to-word': {
    steps: [
      'Upload your PDF file',
      'Click "Convert to Word" — PDFKit processes your document',
      'Download the .docx file when ready',
      'Open in Microsoft Word, Google Docs, or LibreOffice',
    ],
    whyUse: 'PDF files are not directly editable. Converting to Word (DOCX) lets you edit text, update content, reformat the document, or extract information for use elsewhere.',
    tips: [
      'Text-based PDFs convert most accurately — scanned PDFs may need manual cleanup',
      'Tables and multi-column layouts are preserved in most cases',
      'Use the converted Word file as a starting point, then adjust formatting as needed',
    ],
  },
};

function getContent(toolId: string) {
  return TOOL_CONTENT[toolId] || {
    steps: [
      `Upload your file using the upload area`,
      `Configure any options if required`,
      `Click the process button to start`,
      `Download your result when processing is complete`,
    ],
    whyUse: `This tool helps you work with PDF files quickly and efficiently, directly in your browser without installing any software.`,
    tips: [
      'All files are processed securely and deleted automatically after 1 hour',
      'Works on desktop, tablet, and mobile browsers',
      'No account required for free use (up to 3 tasks per day)',
    ],
  };
}

export default function ToolPageContent({ tool, relatedTools, faqs }: Props) {
  const content = getContent(tool.id);

  return (
    <main
      id="tool-seo-content"
      style={{
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        maxWidth: '860px',
        margin: '0 auto',
        padding: '40px 24px 60px',
        // This section is visible but blends with the tool UI
        // ClientApp will show the interactive tool modal on top
      }}
    >
      {/* ── H1 — Primary keyword target ─────────────────────────────────── */}
      <h1 style={{ fontSize: 'clamp(24px,4vw,40px)', fontWeight: 800, lineHeight: 1.1, marginBottom: '12px' }}>
        {tool.name} Online — Free &amp; Instant
      </h1>
      <p style={{ fontSize: '16px', color: '#888', marginBottom: '32px', lineHeight: 1.6 }}>
        {tool.seo.desc}
      </p>

      {/* ── Tool action button (visible before JS hydrates) ─────────────── */}
      <div
        id="seo-tool-cta"
        style={{
          background: '#C6FF00',
          color: '#000',
          border: '2.5px solid #000',
          borderRadius: '12px',
          padding: '20px 28px',
          marginBottom: '40px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
          fontWeight: 700,
          fontSize: '16px',
          boxShadow: '4px 4px 0 #000',
        }}
      >
        <span style={{ fontSize: '24px' }}>{tool.icon}</span>
        {tool.btnLabel} — Free, No Signup
      </div>

      {/* ── H2: How to use ──────────────────────────────────────────────── */}
      <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '16px' }}>
        How to {tool.name.toLowerCase()} in {content.steps.length} steps
      </h2>
      <ol style={{ paddingLeft: '24px', lineHeight: 2.2, marginBottom: '32px', fontSize: '15px', color: '#ccc' }}>
        {content.steps.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>

      {/* ── H2: Why use ─────────────────────────────────────────────────── */}
      <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '12px' }}>
        Why {tool.name.toLowerCase()} your PDF?
      </h2>
      <p style={{ fontSize: '15px', color: '#ccc', lineHeight: 1.8, marginBottom: '32px' }}>
        {content.whyUse}
      </p>

      {/* ── H2: Tips ────────────────────────────────────────────────────── */}
      {content.tips.length > 0 && (
        <>
          <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '12px' }}>
            Tips for best results
          </h2>
          <ul style={{ paddingLeft: '24px', lineHeight: 2.2, marginBottom: '40px', fontSize: '15px', color: '#ccc' }}>
            {content.tips.map((tip, i) => <li key={i}>{tip}</li>)}
          </ul>
        </>
      )}

      {/* ── Related tools — internal linking (SEO loop trap) ────────────── */}
      {relatedTools.length > 0 && (
        <>
          <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '16px' }}>
            Related PDF tools
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '12px', marginBottom: '40px' }}>
            {relatedTools.map(related => (
              <a
                key={related.id}
                href={`/${related.id}`}
                style={{
                  background: '#12121a',
                  border: '2px solid #22223a',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  textDecoration: 'none',
                  color: '#e8e8f2',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '14px',
                  fontWeight: 600,
                  transition: 'border-color .2s',
                }}
              >
                <span style={{ fontSize: '20px' }}>{related.icon}</span>
                {related.name}
              </a>
            ))}
          </div>
        </>
      )}

      {/* ── FAQ — FAQPage schema targets ────────────────────────────────── */}
      <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '20px' }}>
        Frequently asked questions
      </h2>
      <div style={{ marginBottom: '40px' }}>
        {faqs.map((faq, i) => (
          <details
            key={i}
            style={{
              background: '#12121a',
              border: '1px solid #22223a',
              borderRadius: '10px',
              marginBottom: '8px',
              overflow: 'hidden',
            }}
          >
            <summary style={{
              padding: '16px 20px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '15px',
              listStyle: 'none',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              {faq.q}
              <span style={{ fontSize: '20px', color: '#888', marginLeft: '12px', flexShrink: 0 }}>+</span>
            </summary>
            <p style={{ padding: '0 20px 16px', fontSize: '14px', color: '#888', lineHeight: 1.7, margin: 0 }}>
              {faq.a}
            </p>
          </details>
        ))}
      </div>

      {/* ── Security trust signals ───────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        gap: '24px',
        flexWrap: 'wrap',
        fontSize: '13px',
        color: '#666',
        borderTop: '1px solid #22223a',
        paddingTop: '20px',
      }}>
        <span>🔒 HTTPS encrypted</span>
        <span>🕐 Files deleted in 60 minutes</span>
        <span>🚫 Never read by humans</span>
        <span>✅ Free, no signup required</span>
      </div>
    </main>
  );
}
