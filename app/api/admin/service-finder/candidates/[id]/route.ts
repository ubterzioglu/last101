import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthorized } from '@/lib/admin/adminAuth';
import {
  buildProviderPayloadFromCandidate,
  getServiceFinderClient,
  SERVICE_FINDER_CANDIDATE_SELECT,
  type ServiceFinderCandidateRecord,
} from '@/lib/serviceFinder/admin';

interface RouteContext {
  params: Promise<{ id: string }>;
}

const ALLOWED_ACTIONS = new Set(['approve', 'reject', 'pending']);

// Aday onay/red. Onay -> providers'a (source=scraper, status=active) yaz, candidate'e provider_id bağla.
export async function PATCH(request: NextRequest, context: RouteContext) {
  const auth = await isAdminAuthorized(request);
  if (!auth.ok) return NextResponse.json({ error: auth.reason }, { status: auth.status });
  const { id } = await context.params;

  try {
    const body = await request.json().catch(() => ({}));
    const action = String(body?.action || '').trim().toLowerCase();
    const note = String(body?.note || '').trim().slice(0, 1000) || null;
    if (!ALLOWED_ACTIONS.has(action)) {
      return NextResponse.json({ error: 'Geçersiz işlem.' }, { status: 400 });
    }

    const client = getServiceFinderClient();
    const { data: candidate, error: fetchError } = await client
      .from('service_finder_candidates')
      .select(SERVICE_FINDER_CANDIDATE_SELECT)
      .eq('id', id)
      .maybeSingle();
    if (fetchError) throw fetchError;
    if (!candidate) return NextResponse.json({ error: 'Aday bulunamadı.' }, { status: 404 });

    if (action === 'reject') {
      const { error } = await client
        .from('service_finder_candidates')
        .update({ review_status: 'rejected', review_notes: note, reviewed_at: new Date().toISOString(), updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
      return NextResponse.json({ ok: true, review_status: 'rejected' });
    }

    if (action === 'pending') {
      const { error } = await client
        .from('service_finder_candidates')
        .update({ review_status: 'pending', review_notes: note, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
      return NextResponse.json({ ok: true, review_status: 'pending' });
    }

    // approve
    const record = candidate as ServiceFinderCandidateRecord;
    let providerId = record.provider_id;
    const providerPayload = buildProviderPayloadFromCandidate(record);

    if (providerId) {
      const { error: updErr } = await client.from('providers').update(providerPayload).eq('id', providerId);
      if (updErr) throw updErr;
    } else {
      const { data: inserted, error: insErr } = await client
        .from('providers')
        .insert(providerPayload)
        .select('id')
        .single();
      if (insErr) throw insErr;
      providerId = String(inserted?.id || '');
    }

    const { error: candErr } = await client
      .from('service_finder_candidates')
      .update({
        review_status: 'published',
        review_notes: note,
        provider_id: providerId,
        published_at: new Date().toISOString(),
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);
    if (candErr) throw candErr;

    return NextResponse.json({ ok: true, review_status: 'published', provider_id: providerId });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || 'Internal server error' }, { status: 500 });
  }
}
