import { NextRequest, NextResponse } from 'next/server';
import { getPublishedNewsFeed } from '@/lib/public-news';
import { normalizeNewsCategory } from '@/lib/news/shared';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categoryParam = searchParams.get('category');
    const category = !categoryParam || categoryParam === 'all'
      ? 'all'
      : normalizeNewsCategory(categoryParam);
    const limit = searchParams.get('limit');
    const cursor = searchParams.get('cursor');
    const excludeId = searchParams.get('excludeId');

    const response = await getPublishedNewsFeed({
      category,
      limit: limit ? Number.parseInt(limit, 10) : undefined,
      cursor,
      excludeId,
    });

    return NextResponse.json(response, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    const message = (error as Error).message || 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
