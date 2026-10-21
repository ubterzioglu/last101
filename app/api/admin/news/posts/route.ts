import { NextResponse } from 'next/server';
import { getAdminActor } from '@/lib/admin/adminAuth';
import { createAdminPost, listAdminPosts } from '@/lib/news/admin';
import { newsErrorResponse } from '@/lib/news/errors';
import { withAdmin } from '@/lib/admin/withAuth';

export const GET = withAdmin(async (request) => {
  try {
    const payload = await listAdminPosts({ request });
    return NextResponse.json(payload);
  } catch (error) {
    return newsErrorResponse(error, 'admin/news/posts');
  }
});

export const POST = withAdmin(async (request, _context, auth) => {
  try {
    const body = await request.json();
    const post = await createAdminPost(getAdminActor(auth), body);
    return NextResponse.json({ item: post }, { status: 201 });
  } catch (error) {
    return newsErrorResponse(error, 'admin/news/posts');
  }
});
