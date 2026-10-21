import { NextResponse } from 'next/server';
import { withAdmin } from '@/lib/admin/withAuth';
import { getNewsPipelineSettings, updateNewsPipelineSettings } from '@/lib/news/admin';
import { newsErrorResponse } from '@/lib/news/errors';

export const GET = withAdmin(async (request) => {
  try {
    const item = await getNewsPipelineSettings();
    return NextResponse.json({ item });
  } catch (error) {
    return newsErrorResponse(error, 'admin/news/settings');
  }
});

export const PATCH = withAdmin(async (request) => {
  try {
    const body = await request.json();
    const item = await updateNewsPipelineSettings(body);
    return NextResponse.json({ item });
  } catch (error) {
    return newsErrorResponse(error, 'admin/news/settings');
  }
});
