import { NextRequest, NextResponse } from 'next/server';
import { getPublishedNewsArticleBySlug } from '@/lib/public-news';

interface RouteContext {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  const { slug } = await context.params;
  const article = await getPublishedNewsArticleBySlug(slug);

  if (!article) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(article, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
