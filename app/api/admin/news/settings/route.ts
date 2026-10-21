import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthorized } from '@/lib/admin/adminAuth';
import { getNewsPipelineSettings, updateNewsPipelineSettings } from '@/lib/news/admin';
import { newsErrorResponse } from '@/lib/news/errors';

export async function GET(request: NextRequest) {
  const auth = await isAdminAuthorized(request);
  if (!auth.ok) return NextResponse.json({ error: auth.reason }, { status: auth.status });

  try {
    const item = await getNewsPipelineSettings();
    return NextResponse.json({ item });
  } catch (error) {
    return newsErrorResponse(error, 'admin/news/settings');
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await isAdminAuthorized(request);
  if (!auth.ok) return NextResponse.json({ error: auth.reason }, { status: auth.status });

  try {
    const body = await request.json();
    const item = await updateNewsPipelineSettings(body);
    return NextResponse.json({ item });
  } catch (error) {
    return newsErrorResponse(error, 'admin/news/settings');
  }
}
