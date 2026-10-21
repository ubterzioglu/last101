import { NextResponse } from 'next/server';
import { getAdminActor } from '@/lib/admin/adminAuth';
import { setAdminPostFeatured } from '@/lib/news/admin';
import { newsErrorResponse } from '@/lib/news/errors';
import { withAdmin } from '@/lib/admin/withAuth';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export const POST = withAdmin<RouteContext>(async (request, context, auth) => {
  const { id } = await context.params;

  try {
    const body = await request.json().catch(() => ({}));
    const post = await setAdminPostFeatured(getAdminActor(auth), id, {
      isFeatured: Boolean(body?.is_featured ?? body?.isFeatured ?? true),
      featuredRank: body?.featured_rank ?? body?.featuredRank ?? 1,
    });
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ item: post });
  } catch (error) {
    return newsErrorResponse(error, 'admin/news/posts/[id]/feature');
  }
});
