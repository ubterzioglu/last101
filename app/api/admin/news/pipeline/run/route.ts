import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthorized } from '@/lib/admin/adminAuth';

export async function POST(request: NextRequest) {
  const auth = await isAdminAuthorized(request);
  if (!auth.ok) return NextResponse.json({ error: auth.reason }, { status: auth.status });

  try {
    const body = await request.json().catch(() => ({}));
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
    const pipelineSecret = process.env.NEWS_PIPELINE_SECRET || '';
    if (!supabaseUrl || !serviceRoleKey) throw new Error('Service not configured');

    const response = await fetch(`${supabaseUrl}/functions/v1/news-ingest`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${serviceRoleKey}`,
        'x-pipeline-secret': pipelineSecret,
      },
      body: JSON.stringify({
        trigger: 'manual',
        sourceId: body?.sourceId ?? null,
        maxItems: body?.maxItems ?? undefined,
      }),
    });
    const payload = await response.json().catch(() => ({}));
    return NextResponse.json(payload, { status: response.status });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || 'Internal server error' }, { status: 500 });
  }
}
