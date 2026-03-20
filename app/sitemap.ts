import { MetadataRoute } from 'next';
import { TOOLS } from '@/lib/tools';
import { CONFIG } from '@/lib/config';

const COMPRESS_SIZES = ['100kb', '200kb', '500kb', '1mb', '2mb'];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = CONFIG.SITE_URL;
  const now  = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    { url: base,                              lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/ilovepdf-alternative`,   lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/compress-pdf`,            lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
  ];

  const toolPages: MetadataRoute.Sitemap = TOOLS.map(tool => ({
    url:             `${base}/${tool.id}`,
    lastModified:    now,
    changeFrequency: 'monthly' as const,
    priority:        0.9,
  }));

  const programmaticPages: MetadataRoute.Sitemap = COMPRESS_SIZES.map(size => ({
    url:             `${base}/compress-pdf-to-${size}`,
    lastModified:    now,
    changeFrequency: 'monthly' as const,
    priority:        0.8,
  }));

  return [...staticPages, ...toolPages, ...programmaticPages];
}
