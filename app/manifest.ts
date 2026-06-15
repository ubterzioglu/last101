import type { MetadataRoute } from 'next';
import { DEFAULT_META_DESCRIPTION, SEO_SITE_NAME, SITE_NAME } from '@/lib/utils/constants';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SEO_SITE_NAME} | Almanya'da Yaşam, İş ve Türk Topluluğu`,
    short_name: SITE_NAME,
    description: DEFAULT_META_DESCRIPTION,
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#4285F4',
    lang: 'tr',
    dir: 'ltr',
    categories: ['lifestyle', 'education', 'social'],
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
