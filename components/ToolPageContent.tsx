// ─────────────────────────────────────────────────────────────────────────────
// components/ToolPageContent.tsx — Server Component
// Pure HTML, no JS. Google sees this immediately.
// ─────────────────────────────────────────────────────────────────────────────
import type { Tool } from '@/lib/tools';
import AdUnit from './AdUnit';

interface Props {
  tool:         Tool;
  relatedTools: Tool[];
  faqs:         Array<{ q: string; a: string }>;
}

// Verb+object content map for all 40 tools
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
  'split-pdf': {
    steps: [
      'Upload the PDF you want to split',
      'Choose how to split: by page range, every N pages, or extract all as individual files',
      'Click "Split PDF" to process',
      'Download a ZIP file containing your split documents',
    ],
    whyUse: 'Splitting a large PDF lets you share only the relevant pages, reduce file size for email, or extract specific sections like chapters, invoices, or form pages.',
    tips: [
      'Use page ranges like "1-3, 5, 7-9" to extract specific pages',
      'Split every page to get individual page files — useful for image conversion workflows',
      'Combine Split PDF with Compress PDF to keep individual files small',
    ],
  },
  'rotate-pdf': {
    steps: [
      'Upload your PDF file',
      'Select which pages to rotate — all pages or specific ones',
      'Choose rotation angle: 90°, 180°, or 270°',
      'Download the corrected PDF instantly',
    ],
    whyUse: 'Scanned documents and photos often come out sideways or upside down. Rotating fixes orientation so the PDF displays and prints correctly on any device.',
    tips: [
      'Rotate all pages at once for documents scanned in the wrong direction',
      'Rotate individual pages when only some are sideways',
      '180° rotation flips a page upside down — useful for double-sided scan corrections',
    ],
  },
  'delete-pdf-pages': {
    steps: [
      'Upload your PDF file',
      'Enter the page numbers you want to remove (e.g. "2, 5, 8-10")',
      'Click "Delete Pages"',
      'Download the PDF with those pages removed',
    ],
    whyUse: 'Remove blank pages, cover sheets, advertisements, or any unwanted content before sharing a PDF. This also reduces file size and makes documents cleaner.',
    tips: [
      'Preview the PDF before deleting to confirm page numbers',
      'You can delete multiple pages in one go — separate with commas',
      'Removing pages does not affect the quality of remaining pages',
    ],
  },
  'extract-pdf-pages': {
    steps: [
      'Upload your PDF file',
      'Enter the page range to extract (e.g. "3-7" or "1, 4, 9")',
      'Click "Extract Pages"',
      'Download the new PDF containing only those pages',
    ],
    whyUse: 'Extract a specific chapter, report section, or form from a large PDF without sharing the entire document. Perfect for legal contracts, academic papers, and business reports.',
    tips: [
      'Extracting pages creates a brand new PDF — the original is unchanged',
      'Use commas for non-consecutive pages: "1, 5, 9"',
      'For consecutive pages, use a range: "3-10"',
    ],
  },
  'reorder-pages': {
    steps: [
      'Upload your PDF file',
      'Drag and drop the page thumbnails to the order you want',
      'Click "Save Order" to apply changes',
      'Download your reordered PDF',
    ],
    whyUse: 'Fix the page order of scanned documents, reorganize presentation slides, or rearrange chapters in a report — all without reprinting or rescanning.',
    tips: [
      'Thumbnail previews show each page so you know exactly where to move them',
      'You can combine reordering with delete to clean up documents in one step',
      'Large PDFs may take a moment to load thumbnails — wait for all pages to appear',
    ],
  },
  'add-blank-pages': {
    steps: [
      'Upload your PDF file',
      'Enter the position where you want to insert blank pages (before or after a page number)',
      'Choose how many blank pages to add',
      'Download the updated PDF',
    ],
    whyUse: 'Insert blank pages as separators between sections, add space for handwritten notes, or create a template with placeholder pages for content to be added later.',
    tips: [
      'Adding a blank page at position 1 inserts it before the first page',
      'Use blank pages as section dividers in multi-chapter documents',
      'Blank pages add minimal file size to the PDF',
    ],
  },
  'insert-pages': {
    steps: [
      'Upload the main PDF you want to insert pages into',
      'Upload the second PDF containing the pages to insert',
      'Choose the position to insert (after which page)',
      'Download the combined result',
    ],
    whyUse: 'Combine content from two PDFs at a specific location — useful for adding a signature page, inserting an appendix, or merging in-page updates without full re-merge.',
    tips: [
      'Insert at position 0 to prepend pages at the start',
      'You can insert multiple pages from the second PDF at once',
      'This is faster than merging and reordering for targeted insertions',
    ],
  },
  'add-page-numbers': {
    steps: [
      'Upload your PDF file',
      'Choose number position (bottom center, top right, etc.) and starting number',
      'Select font size and style',
      'Download the numbered PDF',
    ],
    whyUse: 'Page numbers are essential for professional documents, academic submissions, legal filings, and printed reports. They make navigation easy and help readers reference specific sections.',
    tips: [
      'Start numbering from a page other than 1 if your document has a cover sheet',
      'Bottom center is the most common position for printed documents',
      'Add Roman numerals for table of contents pages, then Arabic numerals for main content',
    ],
  },
  'repair-pdf': {
    steps: [
      'Upload the damaged or corrupted PDF',
      'Click "Repair PDF" — PDFKit attempts to recover the file structure',
      'Download the repaired PDF if recovery is successful',
    ],
    whyUse: 'PDFs can become corrupted due to incomplete downloads, interrupted transfers, or disk errors. Repair recovers documents that won\'t open normally in PDF readers.',
    tips: [
      'Repair works best on partially corrupted files where content is still present',
      'Severely damaged files may only partially recover — some pages may be missing',
      'After repair, compress or re-save the PDF to clean up any remaining artifacts',
    ],
  },
  'word-to-pdf': {
    steps: [
      'Upload your Word file (.doc or .docx)',
      'Click "Convert to PDF"',
      'Download the PDF — formatting is preserved exactly',
      'Open with any PDF reader or share directly',
    ],
    whyUse: 'PDFs look the same on every device and operating system, unlike Word files that can reflow or display differently. Convert Word to PDF before sharing, printing, or submitting official documents.',
    tips: [
      'All fonts, tables, images, and formatting are preserved in the output',
      'Password-protected Word files must be unlocked before converting',
      'Convert to PDF/A format if you need long-term archival (use the PDF to PDF/A tool after)',
    ],
  },
  'pdf-to-excel': {
    steps: [
      'Upload your PDF containing tables or data',
      'Click "Convert to Excel"',
      'Download the .xlsx file',
      'Open in Microsoft Excel, Google Sheets, or LibreOffice Calc',
    ],
    whyUse: 'PDFs lock data in place — you can\'t sort, filter, or calculate. Converting to Excel lets you work with the data: run formulas, create charts, and analyse figures.',
    tips: [
      'Works best on PDFs with clean, bordered tables',
      'Multi-page tables spanning several PDF pages are combined into one sheet',
      'Verify cell data after conversion — some merged cells may need manual adjustment',
    ],
  },
  'excel-to-pdf': {
    steps: [
      'Upload your Excel file (.xls or .xlsx)',
      'Click "Convert to PDF"',
      'Download the PDF with all sheets rendered',
      'Every row, column, and formula result is preserved as-is',
    ],
    whyUse: 'Share spreadsheet data without giving recipients edit access. Excel to PDF conversion ensures the layout prints exactly as intended and looks consistent across all devices.',
    tips: [
      'Each Excel sheet becomes a separate page or section in the PDF',
      'Fit wide spreadsheets to page width in Excel before converting for cleaner output',
      'Charts and graphs are rendered as images in the PDF',
    ],
  },
  'pdf-to-powerpoint': {
    steps: [
      'Upload your PDF file',
      'Click "Convert to PowerPoint"',
      'Download the .pptx file',
      'Open in PowerPoint, Keynote, or Google Slides',
    ],
    whyUse: 'Convert PDF presentations back to editable slides so you can update content, change themes, or repurpose the material for a new audience.',
    tips: [
      'Each PDF page becomes one slide in the output',
      'Images and text boxes are editable in PowerPoint after conversion',
      'Complex slide backgrounds may convert as images — check each slide after converting',
    ],
  },
  'powerpoint-to-pdf': {
    steps: [
      'Upload your PowerPoint file (.ppt or .pptx)',
      'Click "Convert to PDF"',
      'Download the PDF',
      'All slides, animations as static, and speaker notes are preserved',
    ],
    whyUse: 'Share presentations without requiring PowerPoint. PDF ensures slides look exactly right on every screen and projector, with no font substitution or layout shifts.',
    tips: [
      'Animations are rendered as final-state images in the PDF',
      'Use "Print layout" in PowerPoint before converting if you want notes included',
      'PDFs of presentations are much smaller than .pptx files for email sharing',
    ],
  },
  'pdf-to-jpg': {
    steps: [
      'Upload your PDF file',
      'Choose the image quality/resolution',
      'Click "Convert to JPG"',
      'Download a ZIP file containing one JPG per PDF page',
    ],
    whyUse: 'Convert PDF pages to images for use on websites, social media, in presentations, or anywhere that doesn\'t support PDFs. JPG images are universally viewable.',
    tips: [
      'Higher resolution produces larger files but sharper images',
      '150 DPI is fine for screen use; use 300 DPI for printing',
      'Extract specific pages first if you only need images of certain pages',
    ],
  },
  'jpg-to-pdf': {
    steps: [
      'Upload one or more JPG images',
      'Drag to reorder if needed',
      'Click "Convert to PDF"',
      'Download a single PDF containing all images',
    ],
    whyUse: 'Combine multiple photos into a single shareable PDF document — ideal for submitting scanned documents, portfolios, photo reports, or receipts.',
    tips: [
      'You can upload multiple JPGs at once — they become separate pages',
      'Drag to set the page order before converting',
      'Compress the output PDF if you need a smaller file size',
    ],
  },
  'pdf-to-png': {
    steps: [
      'Upload your PDF file',
      'Choose output resolution',
      'Click "Convert to PNG"',
      'Download the ZIP file with one PNG per page',
    ],
    whyUse: 'PNG images support transparency and are lossless — ideal for presentations, web graphics, or any use where image quality must be pixel-perfect.',
    tips: [
      'PNG files are larger than JPG but have no quality loss',
      'Use PNG when the PDF has transparent backgrounds or line art',
      'For photos, JPG is usually a better choice to reduce file size',
    ],
  },
  'png-to-pdf': {
    steps: [
      'Upload one or more PNG images',
      'Arrange the order if needed',
      'Click "Convert to PDF"',
      'Download the resulting PDF',
    ],
    whyUse: 'Combine PNG screenshots, diagrams, or artwork into a single PDF document for easy sharing, printing, or archiving.',
    tips: [
      'PNG transparency is converted to white background in the PDF',
      'Multiple PNGs become multiple pages — one image per page',
      'Best for diagrams, charts, and screenshots that need crisp text',
    ],
  },
  'pdf-to-text': {
    steps: [
      'Upload your PDF file',
      'Click "Extract Text"',
      'Download the .txt file with all extracted text',
      'Copy-paste into any document or application',
    ],
    whyUse: 'Extract all text from a PDF for search, analysis, or reuse — without manually copying. Useful for research, data extraction, content migration, and accessibility.',
    tips: [
      'Text-based PDFs extract perfectly; scanned PDFs need OCR (use the OCR PDF tool)',
      'Formatting like columns and tables is simplified to plain text',
      'Use the extracted text as input for AI tools, databases, or content management systems',
    ],
  },
  'pdf-to-html': {
    steps: [
      'Upload your PDF file',
      'Click "Convert to HTML"',
      'Download the .html file',
      'Open in a browser or drop into your website',
    ],
    whyUse: 'Publish PDF content on the web without losing it behind a download link. HTML content is searchable by Google, accessible on mobile, and embeddable in any website.',
    tips: [
      'Complex layouts may simplify — check the output in a browser after conversion',
      'Use the HTML as a content draft to edit in a CMS or website builder',
      'Tables and headings are preserved as proper HTML elements',
    ],
  },
  'html-to-pdf': {
    steps: [
      'Upload your HTML file',
      'Click "Convert to PDF"',
      'Download the rendered PDF',
      'All styling and layout is preserved as it appears in a browser',
    ],
    whyUse: 'Create PDFs from web pages, email templates, or HTML reports. HTML to PDF is commonly used for generating invoices, certificates, and printable reports from web applications.',
    tips: [
      'External fonts and images must be accessible for full rendering',
      'Use print-friendly CSS (media query: print) for the cleanest output',
      'For live web pages, use the URL to PDF tool instead',
    ],
  },
  'url-to-pdf': {
    steps: [
      'Paste the full URL (starting with https://) into the input field',
      'Click "Capture Page"',
      'Wait while PDFKit renders the page in a browser',
      'Download the PDF snapshot of the webpage',
    ],
    whyUse: 'Save any webpage as a PDF for offline reading, archiving, or sharing. Great for saving news articles, product pages, reports, or any web content.',
    tips: [
      'The page is captured as it renders in a browser — JavaScript-loaded content is included',
      'Login-gated pages cannot be captured — save locally first if authentication is needed',
      'For repeatable capturing, use our API or browser extension',
    ],
  },
  'pdf-to-pdfa': {
    steps: [
      'Upload your PDF file',
      'Click "Convert to PDF/A"',
      'Download the PDF/A file',
      'Use for government submissions, legal archives, or long-term storage',
    ],
    whyUse: 'PDF/A is the ISO standard for long-term archiving. Courts, tax authorities, and government agencies often require PDF/A format because it embeds all fonts and resources for future-proof readability.',
    tips: [
      'PDF/A-1b is the most widely accepted variant for document archiving',
      'Encrypted PDFs must be unlocked before converting to PDF/A',
      'PDF/A files are slightly larger because all fonts are embedded',
    ],
  },
  'pdf-to-notion': {
    steps: [
      'Upload your PDF file',
      'Connect your Notion account if prompted',
      'Click "Export to Notion"',
      'Find your content in Notion as an editable page',
    ],
    whyUse: 'Import PDF content directly into Notion for editing, collaboration, and linking with other notes. Ideal for converting research papers, reports, and documentation into your knowledge base.',
    tips: [
      'Headings and paragraphs are preserved as Notion blocks',
      'Images in the PDF are embedded as image blocks in Notion',
      'Long PDFs are split into logical sections as separate blocks',
    ],
  },
  'edit-pdf': {
    steps: [
      'Upload your PDF file',
      'Use the toolbar to add text, draw shapes, or annotate',
      'Click anywhere on the page to add or edit content',
      'Save and download your edited PDF',
    ],
    whyUse: 'Edit any PDF directly without converting it to Word first. Add missing text, correct errors, annotate documents, or fill in information that was left blank.',
    tips: [
      'Use "Add Text" to insert new text anywhere on the page',
      'Existing text in the PDF can be annotated but not directly rewritten (use PDF to Word for full text editing)',
      'Use highlight and sticky note tools for review and feedback workflows',
    ],
  },
  'highlight-pdf': {
    steps: [
      'Upload your PDF file',
      'Select the highlight tool and choose a colour',
      'Click and drag over the text you want to highlight',
      'Download the PDF with highlights saved',
    ],
    whyUse: 'Highlight key passages in research papers, legal documents, or study materials for review, annotation, or sharing. Highlights are preserved when the PDF is opened in any reader.',
    tips: [
      'Use different highlight colours to categorise information (e.g. yellow = important, green = action items)',
      'Combine highlights with sticky note comments for detailed annotations',
      'Highlighted PDFs work in all PDF readers including Adobe, Preview, and browser viewers',
    ],
  },
  'draw-on-pdf': {
    steps: [
      'Upload your PDF file',
      'Select the drawing tool and choose pen size and colour',
      'Draw freely on any page',
      'Download the annotated PDF',
    ],
    whyUse: 'Add handwritten notes, circle important areas, sketch diagrams, or provide visual feedback on contracts, designs, or presentations directly on the PDF.',
    tips: [
      'Use a stylus on tablets for handwriting-quality drawings',
      'Draw circles or arrows to highlight areas of interest',
      'Combine drawing with text annotations for clear, detailed feedback',
    ],
  },
  'fill-pdf-forms': {
    steps: [
      'Upload your PDF form',
      'Click on any form field to start typing',
      'Fill in all required fields',
      'Download the completed form as a PDF',
    ],
    whyUse: 'Fill PDF forms digitally without printing, scanning, or handwriting. Works on government forms, job applications, tax forms, invoices, and any fillable PDF.',
    tips: [
      'Interactive form fields are detected automatically and clickable',
      'For non-interactive PDFs, use the Add Text tool to type over the blank areas',
      'Save the filled form before closing — download immediately after completing',
    ],
  },
  'add-images-to-pdf': {
    steps: [
      'Upload your PDF file',
      'Use the image tool to insert photos, logos, or graphics',
      'Drag to position and resize the image',
      'Download the updated PDF',
    ],
    whyUse: 'Add your company logo to a contract, insert a photo into a report, or embed a signature image into a form — all without leaving your browser.',
    tips: [
      'PNG images with transparent backgrounds blend cleanly into the PDF',
      'Resize images by dragging the corner handles',
      'For signatures, use the Sign PDF tool which has dedicated signature features',
    ],
  },
  'protect-pdf': {
    steps: [
      'Upload your PDF file',
      'Set a password (you\'ll need this to open the file later)',
      'Click "Protect PDF"',
      'Download the encrypted, password-protected PDF',
    ],
    whyUse: 'Add password protection to sensitive documents before emailing or sharing. Prevents unauthorised access to contracts, medical records, financial documents, and confidential reports.',
    tips: [
      'Use a strong password — combine letters, numbers, and symbols',
      'Store the password safely — PDFKit cannot recover it if lost',
      'AES-256 encryption is used — the same standard as online banking',
    ],
  },
  'unlock-pdf': {
    steps: [
      'Upload your password-protected PDF',
      'Enter the password when prompted',
      'Click "Unlock PDF"',
      'Download the unlocked, unrestricted PDF',
    ],
    whyUse: 'Remove password protection from your own PDFs so you can open, share, and print them freely without entering the password every time.',
    tips: [
      'You must know the original password to unlock the PDF — this tool removes user restrictions only',
      'Owner-locked PDFs (print/copy restrictions) may unlock without a password',
      'After unlocking, re-protect with a new password if you want to change the access credentials',
    ],
  },
  'sign-pdf': {
    steps: [
      'Upload your PDF document',
      'Draw your signature, type it, or upload a signature image',
      'Place the signature on the page and resize as needed',
      'Download the signed PDF',
    ],
    whyUse: 'Sign contracts, agreements, consent forms, and any official document electronically. Digital signatures via PDFKit are legally valid in India, the US, EU, and most countries under e-signature laws.',
    tips: [
      'Draw your signature with a mouse or touchscreen for a natural look',
      'Upload a scanned signature image (PNG with transparent background) for best results',
      'Add date and initials alongside the signature for multi-page documents',
    ],
  },
  'add-watermark': {
    steps: [
      'Upload your PDF file',
      'Type your watermark text (e.g. "CONFIDENTIAL", "DRAFT") or upload an image',
      'Adjust position, opacity, rotation, and size',
      'Download the watermarked PDF',
    ],
    whyUse: 'Watermarks protect intellectual property, mark documents as drafts or confidential, and identify ownership. Essential for sharing proofs, previews, and proprietary documents.',
    tips: [
      'Set opacity to 20–30% for a subtle background watermark',
      'Diagonal placement at 45° is the most tamper-resistant layout',
      'Use a logo image watermark to brand your PDF documents',
    ],
  },
  'remove-watermark': {
    steps: [
      'Upload your watermarked PDF',
      'Click "Remove Watermark"',
      'PDFKit detects and removes the watermark layer',
      'Download the clean PDF',
    ],
    whyUse: 'Remove watermarks from your own documents — useful when a "DRAFT" watermark was added and the document is now final, or when updating old branded documents.',
    tips: [
      'Works best on text watermarks added as a separate layer',
      'Image watermarks burned directly into the page content may not fully remove',
      'If removal isn\'t perfect, use the Edit PDF tool to cover remaining marks',
    ],
  },
  'redact-pdf': {
    steps: [
      'Upload your PDF file',
      'Select the redaction tool and draw over content to black out',
      'Click "Apply Redactions" to permanently remove the selected content',
      'Download the redacted PDF',
    ],
    whyUse: 'Permanently remove sensitive information — names, addresses, account numbers, or personal data — from PDFs before sharing. Essential for GDPR compliance, legal disclosure, and government records.',
    tips: [
      'Redaction is permanent — the underlying content cannot be recovered from the output file',
      'Do not rely on black highlighting — only proper redaction permanently removes data',
      'Review the redacted PDF in a PDF reader before sending to confirm content is gone',
    ],
  },
  'digital-signature': {
    steps: [
      'Upload a PDF with a digital signature',
      'Click "Verify Signature"',
      'PDFKit checks the certificate chain and signature validity',
      'View the verification result and certificate details',
    ],
    whyUse: 'Verify that a signed PDF has not been altered and that the signer\'s certificate is genuine. Required for legal, government, and financial documents that use digital certificates.',
    tips: [
      'A valid signature means the document hasn\'t changed since it was signed',
      'Certificate trust depends on the issuing CA — government-issued certificates show highest trust',
      'An expired certificate does not automatically invalidate the signature if it was valid when signed',
    ],
  },
  'certificate-signing': {
    steps: [
      'Upload your PDF file',
      'Upload your digital certificate file (.pfx or .p12)',
      'Enter your certificate password',
      'Download the digitally signed PDF with a verifiable certificate',
    ],
    whyUse: 'Apply a cryptographic digital signature using your own certificate for legal binding. Required for official document submission to courts, tax authorities, and regulated industries.',
    tips: [
      'PFX/P12 certificates are issued by authorised Certificate Authorities (CAs)',
      'DSC (Digital Signature Certificate) holders in India can sign directly with their certificate',
      'The signed PDF shows a blue ribbon in Adobe Reader when the certificate is trusted',
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

      {/* ── AdSense display ad — between steps and why-use (high engagement) */}
      <div style={{ margin: '8px 0 32px', minHeight: '100px' }}>
        <AdUnit slot="1946157625" />
      </div>

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

      {/* ── AdSense display ad — after FAQ (post-read, high intent) ────── */}
      <div style={{ margin: '0 0 32px', minHeight: '100px' }}>
        <AdUnit slot="1946157625" />
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
