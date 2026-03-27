import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isAdminAuthorized } from '@/lib/admin/adminAuth';

const ALLOWED_ACTIONS = new Set(['approve', 'reject', 'pending', 'delete']);

function normalizeEnvValue(value: unknown): string {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
    return raw.slice(1, -1).trim();
  }
  return raw;
}

function truncate(value: unknown, maxLength: number) {
  return String(value || '').trim().slice(0, maxLength);
}

function buildProviderNotes(submission: Record<string, unknown>) {
  const parts = ['Topluluktan gelen öneri üzerinden eklendi.'];

  const note = truncate(submission.note, 1200);
  const tagLabels = truncate(submission.tag_labels, 240);
  const website = truncate(submission.website, 300);

  if (tagLabels) parts.push(`Etiket/uzmanlık notu: ${tagLabels}.`);
  if (note) parts.push(`Öneri notu: ${note}.`);
  if (website) parts.push(`Kaynak/website: ${website}.`);

  return parts.join(' ');
}

function buildProviderPayload(submission: Record<string, unknown>) {
  return {
    type: truncate(submission.type, 60),
    display_name: truncate(submission.display_name, 160),
    city: truncate(submission.city, 120),
    address: truncate(submission.address, 240) || null,
    phone: truncate(submission.phone, 60) || null,
    website: truncate(submission.website, 400) || null,
    notes_public: buildProviderNotes(submission),
    status: 'active',
    google_maps_url: truncate(submission.google_maps_url, 400) || null,
    google_place_id: truncate(submission.google_place_id, 140) || null,
  };
}

export async function POST(request: NextRequest) {
  const auth = await isAdminAuthorized(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.reason }, { status: auth.status });
  }

  const supabaseUrl = normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const serviceRoleKey = normalizeEnvValue(
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_SERVICE_KEY ||
      process.env.SUPABASE_SECRET_KEY ||
      ''
  );

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: 'Service not configured' }, { status: 503 });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  try {
    const body = await request.json();
    const action = String(body?.action || '').trim().toLowerCase();
    const id = String(body?.id || '').trim();
    const adminComment = truncate(body?.adminComment, 1000);

    if (!ALLOWED_ACTIONS.has(action) || !id) {
      return NextResponse.json({ error: 'Geçersiz işlem.' }, { status: 400 });
    }

    if (action === 'delete') {
      const { error } = await supabase.from('provider_submissions').delete().eq('id', id);
      if (error) throw error;
      return NextResponse.json({ ok: true });
    }

    const { data: submission, error: fetchError } = await supabase
      .from('provider_submissions')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !submission) {
      return NextResponse.json({ error: 'Kayıt bulunamadı.' }, { status: 404 });
    }

    if (action === 'approve') {
      let approvedProviderId = String(submission.approved_provider_id || '').trim();
      const providerPayload = buildProviderPayload(submission as Record<string, unknown>);

      if (approvedProviderId) {
        const { error: updateProviderError } = await supabase
          .from('providers')
          .update(providerPayload)
          .eq('id', approvedProviderId);
        if (updateProviderError) throw updateProviderError;
      } else {
        const { data: providerInsert, error: insertProviderError } = await supabase
          .from('providers')
          .insert(providerPayload)
          .select('id')
          .single();
        if (insertProviderError) throw insertProviderError;
        approvedProviderId = String(providerInsert?.id || '');
      }

      const { error: updateSubmissionError } = await supabase
        .from('provider_submissions')
        .update({
          status: 'approved',
          admin_comment: adminComment || null,
          approved_provider_id: approvedProviderId || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (updateSubmissionError) throw updateSubmissionError;

      return NextResponse.json({ ok: true, approvedProviderId });
    }

    const nextStatus = action === 'reject' ? 'rejected' : 'pending';
    const { error: updateError } = await supabase
      .from('provider_submissions')
      .update({
        status: nextStatus,
        admin_comment: adminComment || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (updateError) throw updateError;

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('provider-submissions-admin-action failed:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
