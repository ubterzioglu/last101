import { NextRequest, NextResponse } from 'next/server';
import { getAdminActor, isAdminAuthorized } from '@/lib/admin/adminAuth';
import { setAdminPostStatus } from '@/lib/news/admin';
import { newsErrorResponse } from '@/lib/news/errors';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, context: RouteContext) {
  const auth = await isAdminAuthorized(request);
  if (!auth.ok) return NextResponse.json({ error: auth.reason }, { status: auth.status });
  const { id } = await context.params;

  try {
    const body = await request.json().catch(() => ({}));
    const post = await setAdminPostStatus(getAdminActor(auth), id, 'published', String(body?.note || '').trim() || null);
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ item: post });
  } catch (error) {
    return newsErrorResponse(error, 'admin/news/posts/[id]/publish');
  }
}
