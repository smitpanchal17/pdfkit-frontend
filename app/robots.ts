// app/robots.ts — robots.txt
import { MetadataRoute } from 'next';
import { CONFIG } from '@/lib/config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboard', '/_next/'],
      },
    ],
    sitemap: `${CONFIG.SITE_URL}/sitemap.xml`,
  };
}
