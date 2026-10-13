import { getPublishedNewsArticles } from '@/lib/public-news';
import { CANONICAL_SITE_URL, DEFAULT_META_DESCRIPTION, SEO_SITE_NAME } from '@/lib/utils/constants';

export const revalidate = 1800;

const FEED_LIMIT = 30;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toRfc822(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date().toUTCString() : date.toUTCString();
}

export async function GET(): Promise<Response> {
  let articles: Awaited<ReturnType<typeof getPublishedNewsArticles>> = [];
  try {
    articles = await getPublishedNewsArticles(FEED_LIMIT);
  } catch (error: unknown) {
    console.error('feed.xml: haberler alınamadı', error);
  }

  const items = articles
    .map((article) => {
      const link = `${CANONICAL_SITE_URL}/haberler/${article.slug}`;
      return [
        '    <item>',
        `      <title>${escapeXml(article.title)}</title>`,
        `      <link>${escapeXml(link)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(link)}</guid>`,
        `      <pubDate>${toRfc822(article.publishedAt)}</pubDate>`,
        `      <category>${escapeXml(article.categoryLabel)}</category>`,
        `      <description>${escapeXml(article.summary)}</description>`,
        '    </item>',
      ].join('\n');
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${SEO_SITE_NAME} Haberler`)}</title>
    <link>${escapeXml(CANONICAL_SITE_URL)}</link>
    <description>${escapeXml(DEFAULT_META_DESCRIPTION)}</description>
    <language>tr</language>
    <atom:link href="${escapeXml(`${CANONICAL_SITE_URL}/feed.xml`)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
    },
  });
}
