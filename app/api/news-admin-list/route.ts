import { NextResponse } from 'next/server';
import { withAdmin } from '@/lib/admin/withAuth';
import { listAdminPosts, mapAdminPostToLegacy } from '@/lib/news/admin';
import { newsErrorResponse } from '@/lib/news/errors';

export const GET = withAdmin(async (request) => {
  try {
    const payload = await listAdminPosts({ request });
    return NextResponse.json({
      ok: true,
      items: payload.items.map(mapAdminPostToLegacy),
      stats: {
        total: payload.stats.total,
        draft: payload.stats.pending_review + payload.stats.draft + payload.stats.rejected + payload.stats.archived,
        published: payload.stats.published,
      },
    });
  } catch (error) {
    return newsErrorResponse(error, 'news-admin-list');
  }
});

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
