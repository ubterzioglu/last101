import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthorized } from '@/lib/admin/adminAuth';
import {
  buildJobPayload,
  getServiceFinderClient,
  SERVICE_FINDER_JOB_SELECT,
} from '@/lib/serviceFinder/admin';

export async function GET(request: NextRequest) {
  const auth = await isAdminAuthorized(request);
  if (!auth.ok) return NextResponse.json({ error: auth.reason }, { status: auth.status });

  try {
    const client = getServiceFinderClient();
    const { data, error } = await client
      .from('service_finder_jobs')
      .select(SERVICE_FINDER_JOB_SELECT)
      .order('created_at', { ascending: false })
      .limit(100);
    if (error) throw error;
    return NextResponse.json({ items: data || [] });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await isAdminAuthorized(request);
  if (!auth.ok) return NextResponse.json({ error: auth.reason }, { status: auth.status });

  try {
    const body = await request.json().catch(() => ({}));
    const client = getServiceFinderClient();

    // Şablon seçildiyse varsayılanları yükle.
    let template: Record<string, unknown> | null = null;
    if (body?.template_id) {
      const { data } = await client
        .from('service_finder_profession_templates')
        .select('*')
        .eq('id', String(body.template_id))
        .maybeSingle();
      template = data ?? null;
    }

    const payload = buildJobPayload(body, template);
    if (!payload.provider_type || !payload.location_label) {
      return NextResponse.json({ error: 'provider_type ve location_label zorunlu.' }, { status: 400 });
    }

    const { data, error } = await client
      .from('service_finder_jobs')
      .insert(payload)
      .select(SERVICE_FINDER_JOB_SELECT)
      .single();
    if (error) throw error;
    return NextResponse.json({ ok: true, job: data });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || 'Internal server error' }, { status: 500 });
  }
}
