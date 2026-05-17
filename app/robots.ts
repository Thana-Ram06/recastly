import type { MetadataRoute } from 'next';

const BASE = process.env.NEXT_PUBLIC_APP_URL || 'https://recastly.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/login'],
        disallow: ['/dashboard', '/history', '/settings', '/admin', '/api/'],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
