import { NextResponse } from 'next/server';
import { withAdmin } from '@/lib/admin/withAuth';
import { createNewsSource, listNewsSources } from '@/lib/news/admin';
import { newsErrorResponse } from '@/lib/news/errors';

export const GET = withAdmin(async (request) => {
  try {
    const items = await listNewsSources();
    return NextResponse.json({ items });
  } catch (error) {
    return newsErrorResponse(error, 'admin/news/sources');
  }
});

export const POST = withAdmin(async (request) => {
  try {
    const body = await request.json();
    const item = await createNewsSource(body);
    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    return newsErrorResponse(error, 'admin/news/sources');
  }
});
