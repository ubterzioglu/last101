import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthorized } from '@/lib/admin/adminAuth';
import { createNewsSource, listNewsSources } from '@/lib/news/admin';
import { newsErrorResponse } from '@/lib/news/errors';

export async function GET(request: NextRequest) {
  const auth = await isAdminAuthorized(request);
  if (!auth.ok) return NextResponse.json({ error: auth.reason }, { status: auth.status });

  try {
    const items = await listNewsSources();
    return NextResponse.json({ items });
  } catch (error) {
    return newsErrorResponse(error, 'admin/news/sources');
  }
}

export async function POST(request: NextRequest) {
  const auth = await isAdminAuthorized(request);
  if (!auth.ok) return NextResponse.json({ error: auth.reason }, { status: auth.status });

  try {
    const body = await request.json();
    const item = await createNewsSource(body);
    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    return newsErrorResponse(error, 'admin/news/sources');
  }
}
