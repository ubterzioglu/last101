import { NextResponse } from 'next/server';
import { getAdminActor } from '@/lib/admin/adminAuth';
import { getAdminPostDetail, updateAdminPost } from '@/lib/news/admin';
import { newsErrorResponse } from '@/lib/news/errors';
import { withAdmin } from '@/lib/admin/withAuth';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export const GET = withAdmin<RouteContext>(async (request, context) => {
  const { id } = await context.params;

  try {
    const payload = await getAdminPostDetail(id);
    if (!payload) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(payload);
  } catch (error) {
    return newsErrorResponse(error, 'admin/news/posts/[id]');
  }
});

export const PATCH = withAdmin<RouteContext>(async (request, context, auth) => {
  const { id } = await context.params;

  try {
    const body = await request.json();
    const post = await updateAdminPost(getAdminActor(auth), id, body);
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ item: post });
  } catch (error) {
    return newsErrorResponse(error, 'admin/news/posts/[id]');
  }
});
