import { NextRequest, NextResponse } from 'next/server';
import { isCornerAuthorAuthorized } from '@/lib/admin/cornerAuthorAuth';
import { authFailureResponse } from '@/lib/admin/withAuth';

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug');
  const auth = await isCornerAuthorAuthorized(request, slug);
  if (!auth.ok) return authFailureResponse(auth);
  return NextResponse.json({ ok: true, author: auth.author });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

