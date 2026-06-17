import type { MetadataRoute } from 'next';
import { getAllPublishedNewsEntriesForSitemap } from '@/lib/public-news';
import { getAllRehberArticlesForSitemap } from '@/lib/rehber-articles';
import { CANONICAL_SITE_URL } from '@/lib/utils/constants';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = CANONICAL_SITE_URL;
  const [newsEntries, rehberArticles] = await Promise.all([
    getAllPublishedNewsEntriesForSitemap(),
    getAllRehberArticlesForSitemap(),
  ]);

  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/almanyada-yasam`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/is-ilanlari`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/rehber`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/topluluk`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/hakkimizda`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/haberler`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/iletisim`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/kariyer`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/gizlilik-politikasi`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.4,
    },
    {
      url: `${baseUrl}/kullanim-sartlari`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.4,
    },
    {
      url: `${baseUrl}/kvkk-gdpr-ccpa`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.4,
    },
    {
      url: `${baseUrl}/cerez-politikasi`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.4,
    },
  ];

  return [
    ...routes,
    ...newsEntries.map((entry) => ({
      url: `${baseUrl}/haberler/${entry.slug}`,
      lastModified: new Date(entry.updatedAt),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    })),
    ...rehberArticles.map((article) => ({
      url: `${baseUrl}/rehber/${article.slug}`,
      lastModified: new Date(article.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ];
}
