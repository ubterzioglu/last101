import type { MetadataRoute } from 'next';
import { getAllPublishedNewsEntriesForSitemap } from '@/lib/public-news';
import { getAllRehberArticlesForSitemap } from '@/lib/rehber-articles';
import { CANONICAL_SITE_URL } from '@/lib/utils/constants';
import { TOOL_PREFIXES } from '@/lib/utils/gated-routes';

type StaticRoute = {
  path: string;
  changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  priority: number;
};

// Statik rotalarda gerçek bir içerik güncelleme tarihi bilinmediği için
// lastModified bilinçli olarak kullanılmıyor; sahte "şimdi" damgası
// güncellik sinyalini bozuyor (bkz. docs/plans/seo-geo-2026-10-21.md P1).
// Araç URL'leri indekslenebilir: anonim istek 200 ile sunucudan render edilen
// tanıtım içeriği döndürür, bu yüzden TOOL_PREFIXES sitemap'e dahildir.
// Üye alanı girişleri (MEMBER_AREA_PREFIXES, ör. /software-hub) yönlenir ve
// açık içerik sunmaz; sitemap'e alınmaz.
const STATIC_ROUTES: StaticRoute[] = [
  { path: '/', changeFrequency: 'daily', priority: 1 },
  { path: '/almanyada-yasam', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/is-ilanlari', changeFrequency: 'daily', priority: 0.9 },
  { path: '/rehber', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/topluluk', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/hakkimizda', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/haberler', changeFrequency: 'daily', priority: 0.9 },
  { path: '/iletisim', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/ekibimize-katil', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/tatil', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/tatil/almanya', changeFrequency: 'weekly', priority: 0.6 },
  { path: '/tatil/turkiye', changeFrequency: 'weekly', priority: 0.6 },
  // İnteraktif araç ve rehber merkezleri (herkese açık SEO girişleri)
  { path: '/hizmet-rehberi', changeFrequency: 'daily', priority: 0.9 },
  { path: '/almanya-araclari', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/yeniarachub', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/belgeler', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/yazi-dizisi', changeFrequency: 'weekly', priority: 0.6 },
  { path: '/blog', changeFrequency: 'weekly', priority: 0.6 },
  { path: '/kariyer', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/gizlilik-politikasi', changeFrequency: 'yearly', priority: 0.4 },
  { path: '/kullanim-sartlari', changeFrequency: 'yearly', priority: 0.4 },
  { path: '/kvkk-gdpr-ccpa', changeFrequency: 'yearly', priority: 0.4 },
  { path: '/cerez-politikasi', changeFrequency: 'yearly', priority: 0.4 },
  { path: '/impressum', changeFrequency: 'yearly', priority: 0.4 },
  // İndekslenebilir interaktif araçlar: anonim ziyaretçiye 200 ile tanıtım
  // içeriği, oturum açmış kullanıcıya aynı adreste etkileşimli araç.
  ...TOOL_PREFIXES.map((path) => ({
    path,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  })),
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = CANONICAL_SITE_URL;
  const [newsEntries, rehberArticles] = await Promise.all([
    getAllPublishedNewsEntriesForSitemap(),
    getAllRehberArticlesForSitemap(),
  ]);

  const routes = STATIC_ROUTES.map((route) => ({
    url: route.path === '/' ? baseUrl : `${baseUrl}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

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
