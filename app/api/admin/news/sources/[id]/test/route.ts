import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthorized } from '@/lib/admin/adminAuth';
import { getNewsServiceClient } from '@/lib/news/admin';

interface RouteContext {
  params: Promise<{ id: string }>;
}

function collectFeedPreview(xml: string) {
  const itemMatches = [...xml.matchAll(/<item\b[\s\S]*?<\/item>/gi)].slice(0, 3);
  return itemMatches.map((match) => {
    const block = match[0];
    const getText = (tag: string) => {
      const tagMatch = block.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, 'i'));
      return tagMatch ? tagMatch[1].replace(/<!\[CDATA\[|\]\]>/g, '').trim() : '';
    };
    return {
      title: getText('title'),
      link: getText('link'),
      publishedAt: getText('pubDate'),
    };
  });
}

export async function POST(request: NextRequest, context: RouteContext) {
  const auth = await isAdminAuthorized(request);
  if (!auth.ok) return NextResponse.json({ error: auth.reason }, { status: auth.status });
  const { id } = await context.params;

  try {
    const client = getNewsServiceClient();
    const { data, error } = await client
      .from('news_sources')
      .select('id, name, feed_url, source_type')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (!data.feed_url) return NextResponse.json({ error: 'Source has no feed_url' }, { status: 400 });

    const response = await fetch(data.feed_url, {
      headers: { 'user-agent': 'almanya101-news-ingest/1.0' },
      cache: 'no-store',
    });
    const text = await response.text();
    const preview = collectFeedPreview(text);

    return NextResponse.json({
      ok: response.ok,
      status: response.status,
      preview,
      contentLength: text.length,
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || 'Internal server error' }, { status: 500 });
  }
}
