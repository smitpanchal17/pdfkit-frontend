// ─────────────────────────────────────────────────────────────────────────────
// lib/tools.ts — Single source of truth for all 40 PDFKit tools
// Used by: static page generation, tool modal, sitemap, SEO metadata
// ─────────────────────────────────────────────────────────────────────────────

export interface Tool {
  id: string;
  name: string;
  sub: string;
  icon: string;
  color: string;
  accept: string;
  multiple: boolean;
  opts: string;
  btnLabel: string;
  isAI?: boolean;
  cat: string;
  endpoint: string;
  seo: { title: string; desc: string };
}

export const TOOLS: Tool[] = [
  // ── FILE PROCESSING ──────────────────────────────────────────────────────
  { id:'compress-pdf',       name:'Compress PDF',           sub:'Shrink file size without losing quality',               icon:'🗜️', color:'#3BAFFF', accept:'.pdf',                   multiple:false, opts:'compress',  btnLabel:'Compress PDF',       cat:'optimize',  endpoint:'compress',
    seo:{title:'Compress PDF Online Free – Reduce PDF Size | PDFKit',           desc:'Compress PDF files online for free. Reduce PDF size by up to 90% without losing quality. No signup. Works on any device.'}},
  { id:'merge-pdf',          name:'Merge PDFs',             sub:'Combine multiple PDFs into one file',                   icon:'📄', color:'#C6FF00', accept:'.pdf',                   multiple:true,  opts:'none',      btnLabel:'Merge PDFs',         cat:'organize',  endpoint:'merge',
    seo:{title:'Merge PDF Files Online Free – Combine PDFs | PDFKit',           desc:'Merge multiple PDF files into one online for free. Drag, drop and combine up to 20 PDFs instantly. No registration required.'}},
  { id:'split-pdf',          name:'Split PDF',              sub:'Extract pages or split into multiple files',            icon:'✂️', color:'#FF4D2E', accept:'.pdf',                   multiple:false, opts:'split',     btnLabel:'Split PDF',          cat:'organize',  endpoint:'split',
    seo:{title:'Split PDF Online Free – Extract PDF Pages | PDFKit',            desc:'Split PDF files online for free. Extract pages, split by range or split every page. Fast, secure, no signup needed.'}},
  { id:'rotate-pdf',         name:'Rotate PDF',             sub:'Flip any page to the right orientation',               icon:'↩️', color:'#00E5A0', accept:'.pdf',                   multiple:false, opts:'rotate',    btnLabel:'Rotate PDF',         cat:'organize',  endpoint:'rotate',
    seo:{title:'Rotate PDF Pages Online Free | PDFKit',                          desc:'Rotate PDF pages online for free. Fix orientation of any PDF instantly. 90°, 180° or 270° rotation. No software needed.'}},
  { id:'delete-pdf-pages',   name:'Delete Pages',           sub:'Remove any unwanted pages from your PDF',              icon:'🗑️', color:'#FF4D2E', accept:'.pdf',                   multiple:false, opts:'pageinput', btnLabel:'Delete Pages',       cat:'organize',  endpoint:'delete-pages',
    seo:{title:'Delete Pages from PDF Online Free | PDFKit',                     desc:'Remove unwanted pages from PDF files online for free. Delete single or multiple pages instantly. No signup needed.'}},
  { id:'extract-pdf-pages',  name:'Extract Pages',          sub:'Pull specific pages into a new PDF file',              icon:'📤', color:'#C6FF00', accept:'.pdf',                   multiple:false, opts:'pageinput', btnLabel:'Extract Pages',      cat:'organize',  endpoint:'extract-pages',
    seo:{title:'Extract Pages from PDF Online Free | PDFKit',                    desc:'Extract specific pages from PDF files online for free. Download selected pages as a new PDF instantly.'}},
  { id:'reorder-pages',      name:'Reorder Pages',          sub:'Drag & arrange pages any way you want',               icon:'🗂️', color:'#FF3CAC', accept:'.pdf',                   multiple:false, opts:'reorder',   btnLabel:'Reorder Pages',      cat:'organize',  endpoint:'reorder-pages',
    seo:{title:'Reorder PDF Pages Online Free | PDFKit',                         desc:'Rearrange and reorder pages in PDF files online for free. Drag and drop ordering. Fast, no signup needed.'}},
  { id:'add-blank-pages',    name:'Add Blank Pages',        sub:'Insert empty pages anywhere in your PDF',             icon:'📋', color:'#3BAFFF', accept:'.pdf',                   multiple:false, opts:'pagenum',   btnLabel:'Add Blank Pages',    cat:'organize',  endpoint:'add-blank-pages',
    seo:{title:'Add Blank Pages to PDF Online Free | PDFKit',                    desc:'Insert blank pages anywhere in PDF files online for free. Add empty pages between existing content instantly.'}},
  { id:'insert-pages',       name:'Insert Pages',           sub:'Insert pages from another PDF at any position',       icon:'📥', color:'#00E5A0', accept:'.pdf',                   multiple:true,  opts:'pageinput', btnLabel:'Insert Pages',       cat:'organize',  endpoint:'insert-pages',
    seo:{title:'Insert Pages into PDF Online Free | PDFKit',                     desc:'Insert pages from another PDF into your document online for free. Merge at any position instantly.'}},
  { id:'add-page-numbers',   name:'Add Page Numbers',       sub:'Number pages with custom position & style',           icon:'🔢', color:'#C6FF00', accept:'.pdf',                   multiple:false, opts:'pagenum',   btnLabel:'Add Page Numbers',   cat:'organize',  endpoint:'add-page-numbers',
    seo:{title:'Add Page Numbers to PDF Online Free | PDFKit',                   desc:'Add page numbers to PDF files online for free. Custom position, style and format. Instant, no signup needed.'}},
  { id:'repair-pdf',         name:'Repair PDF',             sub:'Fix corrupt or damaged PDF files',                    icon:'🔧', color:'#FFD600', accept:'.pdf',                   multiple:false, opts:'none',      btnLabel:'Repair PDF',         cat:'optimize',  endpoint:'repair',
    seo:{title:'Repair PDF Online Free – Fix Corrupted PDF | PDFKit',            desc:'Repair and fix corrupted or damaged PDF files online for free. Recover unreadable PDFs instantly.'}},

  // ── CONVERT ──────────────────────────────────────────────────────────────
  { id:'pdf-to-word',        name:'PDF to Word',            sub:'Convert PDF to editable DOCX',                        icon:'📝', color:'#3BAFFF', accept:'.pdf',                   multiple:false, opts:'none',      btnLabel:'Convert to Word',    cat:'convert',   endpoint:'pdf-to-word',
    seo:{title:'PDF to Word Converter Free Online – Keep Formatting | PDFKit',   desc:'Convert PDF to Word (DOCX) online for free. Accurate conversion with layout preserved. No signup. Instant download.'}},
  { id:'word-to-pdf',        name:'Word to PDF',            sub:'Turn Word docs into perfectly formatted PDFs',        icon:'🔄', color:'#FF3CAC', accept:'.doc,.docx',             multiple:false, opts:'none',      btnLabel:'Convert to PDF',     cat:'convert',   endpoint:'word-to-pdf',
    seo:{title:'Word to PDF Converter Free Online | PDFKit',                     desc:'Convert Word documents to PDF online for free. Perfect formatting every time. Instant, secure, no software needed.'}},
  { id:'pdf-to-excel',       name:'PDF to Excel',           sub:'Pull tables from PDFs into editable sheets',         icon:'📐', color:'#00E5A0', accept:'.pdf',                   multiple:false, opts:'none',      btnLabel:'Convert to Excel',   cat:'convert',   endpoint:'pdf-to-excel',
    seo:{title:'PDF to Excel Converter Free Online | PDFKit',                    desc:'Convert PDF tables to Excel (XLSX) online for free. Extract data accurately. No signup, instant download.'}},
  { id:'excel-to-pdf',       name:'Excel to PDF',           sub:'Spreadsheets to PDF, pixel-perfect',                icon:'📊', color:'#FFD600', accept:'.xls,.xlsx',             multiple:false, opts:'none',      btnLabel:'Convert to PDF',     cat:'convert',   endpoint:'excel-to-pdf',
    seo:{title:'Excel to PDF Converter Free Online | PDFKit',                    desc:'Convert Excel spreadsheets to PDF online for free. Pixel-perfect formatting. No software installation needed.'}},
  { id:'pdf-to-powerpoint',  name:'PDF to PowerPoint',      sub:'Turn any PDF into editable slides instantly',        icon:'📑', color:'#FF8800', accept:'.pdf',                   multiple:false, opts:'none',      btnLabel:'Convert to PPT',     cat:'convert',   endpoint:'pdf-to-powerpoint',
    seo:{title:'PDF to PowerPoint Converter Free Online | PDFKit',               desc:'Convert PDF to PowerPoint (PPTX) slides online for free. Editable slides instantly. No signup required.'}},
  { id:'powerpoint-to-pdf',  name:'PowerPoint to PDF',      sub:'Save presentations as perfectly-rendered PDFs',     icon:'🎤', color:'#FF4D2E', accept:'.ppt,.pptx',             multiple:false, opts:'none',      btnLabel:'Convert to PDF',     cat:'convert',   endpoint:'powerpoint-to-pdf',
    seo:{title:'PowerPoint to PDF Converter Free Online | PDFKit',               desc:'Convert PowerPoint presentations to PDF online for free. Perfect rendering. Instant, no software needed.'}},
  { id:'pdf-to-jpg',         name:'PDF to JPG',             sub:'Convert PDF pages to hi-res images',                icon:'🖼️', color:'#3BAFFF', accept:'.pdf',                   multiple:false, opts:'imgformat', btnLabel:'Convert to JPG',     cat:'convert',   endpoint:'pdf-to-images',
    seo:{title:'PDF to JPG Converter Free Online – High Quality | PDFKit',       desc:'Convert PDF pages to JPG images online for free. High resolution output. Download all pages as ZIP instantly.'}},
  { id:'jpg-to-pdf',         name:'JPG to PDF',             sub:'Pack images into a single clean PDF',               icon:'📸', color:'#FF3CAC', accept:'image/*,.jpg,.jpeg',     multiple:true,  opts:'imgformat', btnLabel:'Convert to PDF',     cat:'convert',   endpoint:'images-to-pdf',
    seo:{title:'JPG to PDF Converter Free Online | PDFKit',                      desc:'Convert JPG images to PDF online for free. Combine multiple images into one PDF. Fast, secure, no watermark.'}},
  { id:'pdf-to-png',         name:'PDF to PNG',             sub:'Export every page as a crisp PNG image',            icon:'📷', color:'#7b3fd4', accept:'.pdf',                   multiple:false, opts:'imgformat', btnLabel:'Convert to PNG',     cat:'convert',   endpoint:'pdf-to-images',
    seo:{title:'PDF to PNG Converter Free Online | PDFKit',                      desc:'Convert PDF pages to PNG images online for free. High quality export. Download all pages instantly.'}},
  { id:'png-to-pdf',         name:'PNG to PDF',             sub:'Combine PNG images into a clean PDF file',          icon:'🖼️', color:'#00E5A0', accept:'image/*,.png',           multiple:true,  opts:'imgformat', btnLabel:'Convert to PDF',     cat:'convert',   endpoint:'images-to-pdf',
    seo:{title:'PNG to PDF Converter Free Online | PDFKit',                      desc:'Convert PNG images to PDF online for free. Combine multiple PNGs into one clean PDF. Fast and secure.'}},
  { id:'pdf-to-text',        name:'PDF to Text',            sub:'Extract all text from any PDF in seconds',          icon:'📃', color:'#3BAFFF', accept:'.pdf',                   multiple:false, opts:'none',      btnLabel:'Extract Text',       cat:'convert',   endpoint:'pdf-to-text',
    seo:{title:'PDF to Text Converter Free Online | PDFKit',                     desc:'Extract text from PDF files online for free. Copy-paste ready plain text output. Works on any PDF instantly.'}},
  { id:'pdf-to-html',        name:'PDF to HTML',            sub:'Convert PDFs into clean, web-ready HTML',           icon:'🌍', color:'#3BAFFF', accept:'.pdf',                   multiple:false, opts:'none',      btnLabel:'Convert to HTML',    cat:'convert',   endpoint:'pdf-to-html',
    seo:{title:'PDF to HTML Converter Free Online | PDFKit',                     desc:'Convert PDF to HTML webpage online for free. Clean, web-ready HTML output. No signup, instant conversion.'}},
  { id:'html-to-pdf',        name:'HTML to PDF',            sub:'Web pages to PDF in a single click',               icon:'🌐', color:'#FF3CAC', accept:'.html,.htm',             multiple:false, opts:'none',      btnLabel:'Convert to PDF',     cat:'convert',   endpoint:'html-to-pdf',
    seo:{title:'HTML to PDF Converter Free Online | PDFKit',                     desc:'Convert HTML web pages to PDF online for free. Perfect for saving web content. Instant, no software needed.'}},
  { id:'url-to-pdf',         name:'URL to PDF',             sub:'Capture any webpage as a PDF instantly',           icon:'🌐', color:'#C6FF00', accept:'none',                   multiple:false, opts:'url',       btnLabel:'Capture Page',       cat:'convert',   endpoint:'url-to-pdf',
    seo:{title:'URL to PDF – Capture Any Webpage as PDF | PDFKit',              desc:'Convert any URL or webpage to PDF online for free. Instant screenshot-quality capture. No signup required.'}},
  { id:'pdf-to-pdfa',        name:'PDF to PDF/A',           sub:'Archive-ready format for legal & government',      icon:'🏛️', color:'#7b3fd4', accept:'.pdf',                   multiple:false, opts:'none',      btnLabel:'Convert to PDF/A',   cat:'convert',   endpoint:'pdf-to-pdfa',
    seo:{title:'PDF to PDF/A Converter Free Online | PDFKit',                    desc:'Convert PDF to PDF/A archival format online for free. Required for government and legal document archiving.'}},
  { id:'pdf-to-notion',      name:'PDF to Notion',          sub:'Export PDFs as clean, editable Notion pages',      icon:'📓', color:'#aaa',    accept:'.pdf',                   multiple:false, opts:'none',      btnLabel:'Export to Notion',   cat:'convert',   endpoint:'pdf-to-notion',
    seo:{title:'PDF to Notion – Export PDF as Notion Pages | PDFKit',           desc:'Convert PDF files to editable Notion pages online. Export content directly to your Notion workspace.'}},

  // ── EDITING ──────────────────────────────────────────────────────────────
  { id:'edit-pdf',           name:'Edit PDF',               sub:'Add text, shapes & annotations to any PDF',         icon:'✏️', color:'#7b3fd4', accept:'.pdf',                   multiple:false, opts:'none',      btnLabel:'Edit PDF',           cat:'edit',      endpoint:'__editor__',
    seo:{title:'Edit PDF Online Free – Add Text & Annotations | PDFKit',         desc:'Edit PDF files online for free. Add text, shapes, highlights and annotations. No software needed. Works in browser.'}},
  { id:'highlight-pdf',      name:'Highlight Text',         sub:'Mark up text with colors, underline & more',       icon:'🖊️', color:'#FFD600', accept:'.pdf',                   multiple:false, opts:'none',      btnLabel:'Highlight PDF',      cat:'edit',      endpoint:'__editor__',
    seo:{title:'Highlight PDF Text Online Free | PDFKit',                        desc:'Highlight text in PDF files online for free. Mark up, underline and annotate any PDF. No signup needed.'}},
  { id:'draw-on-pdf',        name:'Draw on PDF',            sub:'Freehand draw, sketch and annotate freely',        icon:'🖌️', color:'#FF4D2E', accept:'.pdf',                   multiple:false, opts:'none',      btnLabel:'Draw on PDF',        cat:'edit',      endpoint:'__editor__',
    seo:{title:'Draw on PDF Online Free – Annotate & Sketch | PDFKit',           desc:'Draw and annotate PDF files online for free. Freehand drawing, shapes and sketches. Works on any device.'}},
  { id:'fill-pdf-forms',     name:'Fill PDF Forms',         sub:'Type into any PDF form field with ease',           icon:'📝', color:'#00E5A0', accept:'.pdf',                   multiple:false, opts:'none',      btnLabel:'Fill Form',          cat:'edit',      endpoint:'__editor__',
    seo:{title:'Fill PDF Forms Online Free | PDFKit',                            desc:'Fill out PDF forms online for free. Type into any PDF form field. Fast, secure, no software needed.'}},
  { id:'add-images-to-pdf',  name:'Add Images to PDF',      sub:'Drop photos, logos, and graphics into any PDF',   icon:'🏞️', color:'#3BAFFF', accept:'.pdf,.jpg,.jpeg,.png',   multiple:true,  opts:'none',      btnLabel:'Add Images',         cat:'edit',      endpoint:'images-to-pdf',
    seo:{title:'Add Images to PDF Online Free | PDFKit',                         desc:'Insert photos, logos and images into PDF files online for free. Place images anywhere on any page. Instant.'}},

  // ── SECURITY ─────────────────────────────────────────────────────────────
  { id:'protect-pdf',        name:'Protect PDF',            sub:'Password-protect your sensitive files',            icon:'🔒', color:'#FF3CAC', accept:'.pdf',                   multiple:false, opts:'protect',   btnLabel:'Protect PDF',        cat:'security',  endpoint:'protect',
    seo:{title:'Password Protect PDF Online Free – Encrypt PDF | PDFKit',        desc:'Password protect PDF files online for free. AES-256 encryption. Secure your sensitive documents instantly.'}},
  { id:'unlock-pdf',         name:'Unlock PDF',             sub:'Remove password protection instantly',            icon:'🔓', color:'#3BAFFF', accept:'.pdf',                   multiple:false, opts:'unlock',    btnLabel:'Unlock PDF',         cat:'security',  endpoint:'unlock',
    seo:{title:'Unlock PDF – Remove PDF Password Online Free | PDFKit',          desc:'Remove password from PDF files online for free. Unlock encrypted PDFs instantly. No software needed.'}},
  { id:'sign-pdf',           name:'Sign PDF',               sub:'Draw or upload your signature, done',             icon:'✍️', color:'#C6FF00', accept:'.pdf',                   multiple:false, opts:'sign',      btnLabel:'Sign PDF',           cat:'security',  endpoint:'sign',
    seo:{title:'Sign PDF Online Free – eSign Documents | PDFKit',                desc:'Sign PDF documents online for free. Draw, type or upload your signature. Legally binding. No signup needed.'}},
  { id:'add-watermark',      name:'Add Watermark',          sub:'Stamp text or image watermarks on pages',         icon:'💧', color:'#FFD600', accept:'.pdf',                   multiple:false, opts:'watermark', btnLabel:'Add Watermark',      cat:'security',  endpoint:'watermark',
    seo:{title:'Add Watermark to PDF Online Free | PDFKit',                      desc:'Add text or image watermarks to PDF files online for free. Custom position, opacity and style. Instant download.'}},
  { id:'remove-watermark',   name:'Remove Watermark',       sub:'Clean watermarks from any PDF document',          icon:'🚿', color:'#00E5A0', accept:'.pdf',                   multiple:false, opts:'none',      btnLabel:'Remove Watermark',   cat:'security',  endpoint:'remove-watermark',
    seo:{title:'Remove Watermark from PDF Online Free | PDFKit',                 desc:'Remove watermarks from PDF files online for free. Clean and professional output. Fast, no signup needed.'}},
  { id:'redact-pdf',         name:'Redact PDF',             sub:'Permanently black out sensitive information',     icon:'🔏', color:'#FF4D2E', accept:'.pdf',                   multiple:false, opts:'none',      btnLabel:'Redact PDF',         cat:'security',  endpoint:'redact',
    seo:{title:'Redact PDF Online Free – Black Out Text | PDFKit',               desc:'Redact sensitive information from PDF files online for free. Permanent black-out. GDPR compliant, secure.'}},
  { id:'digital-signature',  name:'Verify Signature',       sub:'Validate digital signatures & certificates',      icon:'🔐', color:'#7b3fd4', accept:'.pdf',                   multiple:false, opts:'sign',      btnLabel:'Verify Signature',   cat:'security',  endpoint:'sign',
    seo:{title:'Verify Digital Signature PDF Online Free | PDFKit',              desc:'Verify and validate digital signatures in PDF files online for free. Check certificate authenticity instantly.'}},
  { id:'certificate-signing',name:'Certificate Signing',    sub:'Sign PDFs with a digital certificate (PKCS)',    icon:'📜', color:'#FF8800', accept:'.pdf',                   multiple:false, opts:'none',      btnLabel:'Sign with Cert',     cat:'security',  endpoint:'sign',
    seo:{title:'Sign PDF with Digital Certificate Online | PDFKit',              desc:'Sign PDF documents with a digital certificate (PKCS) online for free. Legally valid, secure signing.'}},
];

// Map: tool id → endpoint
export const ENDPOINT_MAP: Record<string, string> = Object.fromEntries(
  TOOLS.map(t => [t.id, t.endpoint])
);

// Get tool by id
export function getTool(id: string): Tool | undefined {
  return TOOLS.find(t => t.id === id);
}

// Get all tool slugs (for static generation)
export function getAllToolSlugs(): string[] {
  return TOOLS.map(t => t.id);
}

// Tools by category
export function getToolsByCategory(cat: string): Tool[] {
  return TOOLS.filter(t => t.cat === cat);
}

export const CAT_ORDER = ['organize','convert','edit','security','optimize'] as const;
export const CAT_LABELS: Record<string, string> = {
  organize: '📁 Organize',
  convert:  '🔄 Convert',
  edit:     '✏️ Edit',
  security: '🔒 Security',
  optimize: '⚡ Optimize',
};
