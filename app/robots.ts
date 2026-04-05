// app/robots.ts — robots.txt
import { MetadataRoute } from 'next';
import { CONFIG } from '@/lib/config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Main rule: allow all crawlers, block only private routes
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboard/'],
      },
      // AI search crawlers — explicitly allow for citation/indexing
      {
        userAgent: 'GPTBot',
        allow: '/',
      },
      {
        userAgent: 'OAI-SearchBot',
        allow: '/',
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
      },
      {
        userAgent: 'Bytespider',
        allow: '/',
      },
      // Block Common Crawl training crawler (not search-oriented)
      {
        userAgent: 'CCBot',
        disallow: '/',
      },
    ],
    sitemap: `${CONFIG.SITE_URL}/sitemap.xml`,
  };
}
