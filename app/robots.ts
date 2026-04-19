import type { MetadataRoute } from 'next';
import { CANONICAL_SITE_URL } from '@/lib/utils/constants';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/', '/private/'],
    },
    sitemap: `${CANONICAL_SITE_URL}/sitemap.xml`,
  };
}
