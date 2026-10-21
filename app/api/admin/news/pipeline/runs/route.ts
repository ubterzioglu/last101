import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthorized } from '@/lib/admin/adminAuth';
import { listNewsPipelineRuns } from '@/lib/news/admin';
import { newsErrorResponse } from '@/lib/news/errors';

export async function GET(request: NextRequest) {
  const auth = await isAdminAuthorized(request);
  if (!auth.ok) return NextResponse.json({ error: auth.reason }, { status: auth.status });

  try {
    const items = await listNewsPipelineRuns();
    return NextResponse.json({ items });
  } catch (error) {
    return newsErrorResponse(error, 'admin/news/pipeline/runs');
  }
}
