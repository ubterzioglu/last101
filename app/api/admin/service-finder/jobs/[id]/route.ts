import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthorized } from '@/lib/admin/adminAuth';
import {
  getServiceFinderClient,
  SERVICE_FINDER_CANDIDATE_SELECT,
  SERVICE_FINDER_JOB_SELECT,
} from '@/lib/serviceFinder/admin';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const auth = await isAdminAuthorized(request);
  if (!auth.ok) return NextResponse.json({ error: auth.reason }, { status: auth.status });
  const { id } = await context.params;

  try {
    const client = getServiceFinderClient();
    const [job, candidates, events, sources] = await Promise.all([
      client.from('service_finder_jobs').select(SERVICE_FINDER_JOB_SELECT).eq('id', id).maybeSingle(),
      client
        .from('service_finder_candidates')
        .select(SERVICE_FINDER_CANDIDATE_SELECT)
        .eq('job_id', id)
        .order('confidence_score', { ascending: false }),
      client
        .from('service_finder_job_events')
        .select('id, event_type, event_level, message, created_at')
        .eq('job_id', id)
        .order('created_at', { ascending: false })
        .limit(80),
      client
        .from('service_finder_job_sources')
        .select('id, source_url, source_domain, fetch_status, crawl_allowed')
        .eq('job_id', id)
        .limit(200),
    ]);

    if (job.error) throw job.error;
    if (!job.data) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json({
      job: job.data,
      candidates: candidates.data || [],
      events: events.data || [],
      sources: sources.data || [],
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const auth = await isAdminAuthorized(request);
  if (!auth.ok) return NextResponse.json({ error: auth.reason }, { status: auth.status });
  const { id } = await context.params;

  try {
    const client = getServiceFinderClient();
    const { error } = await client.from('service_finder_jobs').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || 'Internal server error' }, { status: 500 });
  }
}
