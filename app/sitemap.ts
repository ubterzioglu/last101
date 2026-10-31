import type { MetadataRoute } from 'next';
import { hasMeaningfulUpdate } from '@/lib/articles/headings';
import { SITE_AUTHOR_SLUG } from '@/lib/authors';
import { getAllCornerPostsForSitemap } from '@/lib/corner';
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

type SitemapEntry = MetadataRoute.Sitemap[number];
type CornerSitemapPost = Awaited<ReturnType<typeof getAllCornerPostsForSitemap>>[number];

function toValidDate(value: string | null | undefined): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

/** lastModified only when the update is meaningful; otherwise the publish date. */
function postLastModified(post: CornerSitemapPost): Date | undefined {
  const useUpdate = hasMeaningfulUpdate(post.publishedAt, post.updatedAt);
  return toValidDate(useUpdate ? post.updatedAt : post.publishedAt);
}

function newestDate(dates: readonly (Date | undefined)[]): Date | undefined {
  return dates.reduce<Date | undefined>(
    (newest, date) => (date && (!newest || date > newest) ? date : newest),
    undefined,
  );
}

function buildBlogEntries(baseUrl: string, posts: readonly CornerSitemapPost[]): SitemapEntry[] {
  // Never invent a date: /blog gets lastModified only when a post date exists.
  const blogLastModified = newestDate(posts.map((post) => toValidDate(post.publishedAt)));
  const blogIndex: SitemapEntry = {
    url: `${baseUrl}/blog`,
    ...(blogLastModified ? { lastModified: blogLastModified } : {}),
    changeFrequency: 'weekly',
    priority: 0.8,
  };

  const postEntries = posts.map((post): SitemapEntry => {
    const lastModified = postLastModified(post);
    return {
      url: `${baseUrl}${post.href}`,
      ...(lastModified ? { lastModified } : {}),
      changeFrequency: 'monthly',
      priority: 0.7,
    };
  });

  // Only authors that own at least one published post; the editorial author
  // always has guide and news content, so its profile is always listed.
  const authorSlugs = new Set<string>([SITE_AUTHOR_SLUG]);
  for (const post of posts) {
    if (post.authorSlug) authorSlugs.add(post.authorSlug);
  }
  const authorEntries = [...authorSlugs].map((slug): SitemapEntry => ({
    url: `${baseUrl}/blog/yazar/${slug}`,
    changeFrequency: 'weekly',
    priority: 0.5,
  }));

  return [blogIndex, ...postEntries, ...authorEntries];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = CANONICAL_SITE_URL;
  const [newsResult, rehberResult, cornerResult] = await Promise.allSettled([
    getAllPublishedNewsEntriesForSitemap(),
    getAllRehberArticlesForSitemap(),
    getAllCornerPostsForSitemap(),
  ]);

  const newsEntries = newsResult.status === 'fulfilled' ? newsResult.value : [];
  const rehberArticles = rehberResult.status === 'fulfilled' ? rehberResult.value : [];
  const cornerPosts = cornerResult.status === 'fulfilled' ? cornerResult.value : [];

  for (const result of [newsResult, rehberResult, cornerResult]) {
    if (result.status === 'rejected') console.error('sitemap: dynamic source failed:', result.reason);
  }

  const routes = STATIC_ROUTES.map((route) => ({
    url: route.path === '/' ? baseUrl : `${baseUrl}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  return [
    ...routes,
    ...buildBlogEntries(baseUrl, cornerPosts),
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
