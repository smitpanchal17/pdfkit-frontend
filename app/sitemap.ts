import { MetadataRoute } from 'next';
import { TOOLS } from '@/lib/tools';
import { CONFIG } from '@/lib/config';

const COMPRESS_SIZES = ['100kb', '200kb', '500kb', '1mb', '2mb'];

// Static last-modified dates — update these manually when page content changes.
// Do NOT use new Date() here; identical dates on every page causes
// Google to stop trusting the lastmod signal entirely.
const STATIC_DATES = {
  homepage:   '2026-04-05',
  tools:      '2026-04-05',
  comparison: '2026-04-05',
  sizepages:  '2026-04-05',
  about:      '2026-04-05',
  pricing:    '2026-04-05',
  legal:      '2026-01-01', // rarely changes
};

export default function sitemap(): MetadataRoute.Sitemap {
  const base = CONFIG.SITE_URL;

  // Static marketing / trust pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`,                     lastModified: STATIC_DATES.homepage,   changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/pricing`,              lastModified: STATIC_DATES.pricing,    changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/ilovepdf-alternative`, lastModified: STATIC_DATES.comparison, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/about`,                lastModified: STATIC_DATES.about,      changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/privacy`,              lastModified: STATIC_DATES.legal,      changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${base}/terms`,                lastModified: STATIC_DATES.legal,      changeFrequency: 'yearly',  priority: 0.3 },
  ];

  // One entry per tool — compress-pdf comes through here from TOOLS,
  // NOT added separately in staticPages (avoids the previous duplicate).
  const toolPages: MetadataRoute.Sitemap = TOOLS.map(tool => ({
    url:             `${base}/${tool.id}`,
    lastModified:    STATIC_DATES.tools,
    changeFrequency: 'monthly' as const,
    priority:        0.9,
  }));

  const programmaticPages: MetadataRoute.Sitemap = COMPRESS_SIZES.map(size => ({
    url:             `${base}/compress-pdf-to-${size}`,
    lastModified:    STATIC_DATES.sizepages,
    changeFrequency: 'monthly' as const,
    priority:        0.8,
  }));

  return [...staticPages, ...toolPages, ...programmaticPages];
}
