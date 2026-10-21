import { NextResponse } from 'next/server';
import { withAdmin } from '@/lib/admin/withAuth';
import { updateNewsSource } from '@/lib/news/admin';
import { newsErrorResponse } from '@/lib/news/errors';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export const PATCH = withAdmin<RouteContext>(async (request, context) => {
  const { id } = await context.params;

  try {
    const body = await request.json();
    const item = await updateNewsSource(id, body);
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ item });
  } catch (error) {
    return newsErrorResponse(error, 'admin/news/sources/[id]');
  }
});
