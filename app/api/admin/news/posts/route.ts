import { NextRequest, NextResponse } from 'next/server';
import { getAdminActor, isAdminAuthorized } from '@/lib/admin/adminAuth';
import { createAdminPost, listAdminPosts } from '@/lib/news/admin';
import { newsErrorResponse } from '@/lib/news/errors';

export async function GET(request: NextRequest) {
  const auth = await isAdminAuthorized(request);
  if (!auth.ok) return NextResponse.json({ error: auth.reason }, { status: auth.status });

  try {
    const payload = await listAdminPosts({ request });
    return NextResponse.json(payload);
  } catch (error) {
    return newsErrorResponse(error, 'admin/news/posts');
  }
}

export async function POST(request: NextRequest) {
  const auth = await isAdminAuthorized(request);
  if (!auth.ok) return NextResponse.json({ error: auth.reason }, { status: auth.status });

  try {
    const body = await request.json();
    const post = await createAdminPost(getAdminActor(auth), body);
    return NextResponse.json({ item: post }, { status: 201 });
  } catch (error) {
    return newsErrorResponse(error, 'admin/news/posts');
  }
}
