import { NextResponse } from 'next/server';
import { withAdmin } from '@/lib/admin/withAuth';
import { listNewsPipelineRuns } from '@/lib/news/admin';
import { newsErrorResponse } from '@/lib/news/errors';

export const GET = withAdmin(async (request) => {
  try {
    const items = await listNewsPipelineRuns();
    return NextResponse.json({ items });
  } catch (error) {
    return newsErrorResponse(error, 'admin/news/pipeline/runs');
  }
});
