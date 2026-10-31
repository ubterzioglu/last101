import { getPublishedCornerPostSummaries } from '@/lib/corner';
import type { PublicCornerPost } from '@/lib/corner';
import { SITE_AUTHOR } from '@/lib/authors';
import { CANONICAL_SITE_URL, SEO_SITE_NAME } from '@/lib/utils/constants';

export const revalidate = 1800;

const FEED_LIMIT = 30;
const FEED_DESCRIPTION = 'Almanya üzerine köşe yazıları.';

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

function buildItem(post: PublicCornerPost): string {
  const link = new URL(post.href, CANONICAL_SITE_URL).toString();

  return [
    '    <item>',
    `      <title>${escapeXml(post.title)}</title>`,
    `      <link>${escapeXml(link)}</link>`,
    `      <guid isPermaLink="true">${escapeXml(link)}</guid>`,
    `      <pubDate>${toRfc822(post.publishedAt)}</pubDate>`,
    `      <dc:creator>${escapeXml(post.authorName ?? SITE_AUTHOR.name)}</dc:creator>`,
    '      <category>Köşe Yazıları</category>',
    `      <description>${escapeXml(post.summary || post.title)}</description>`,
    '    </item>',
  ].join('\n');
}

export async function GET(): Promise<Response> {
  let posts: PublicCornerPost[] = [];
  try {
    posts = await getPublishedCornerPostSummaries(FEED_LIMIT);
  } catch (error: unknown) {
    console.error('blog/feed.xml: yazılar alınamadı', error);
  }

  const feedUrl = `${CANONICAL_SITE_URL}/blog/feed.xml`;
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(`${SEO_SITE_NAME} Blog`)}</title>
    <link>${escapeXml(`${CANONICAL_SITE_URL}/blog`)}</link>
    <description>${escapeXml(FEED_DESCRIPTION)}</description>
    <language>tr</language>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
${posts.map(buildItem).join('\n')}
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
