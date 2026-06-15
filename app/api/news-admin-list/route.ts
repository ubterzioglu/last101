import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthorized } from '@/lib/admin/adminAuth';
import { listAdminPosts, mapAdminPostToLegacy } from '@/lib/news/admin';

export async function GET(request: NextRequest) {
  const auth = await isAdminAuthorized(request);
  if (!auth.ok) return NextResponse.json({ error: auth.reason }, { status: auth.status });

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
    return NextResponse.json({ error: (error as Error).message || 'Internal server error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
