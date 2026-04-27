import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isUuid } from '@/lib/founder';

function normalizeEnvValue(value: unknown): string {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
    return raw.slice(1, -1).trim();
  }
  return raw;
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function GET(request: NextRequest) {
  const supabaseUrl = normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const serviceRoleKey = normalizeEnvValue(process.env.SUPABASE_SERVICE_ROLE_KEY);

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: 'Service not configured' }, { status: 503 });
  }

  const founderId = String(request.nextUrl.searchParams.get('founder') || '').trim();
  if (!isUuid(founderId)) {
    return NextResponse.json({ error: 'Geçersiz founder linki.' }, { status: 400 });
  }

  const supabase: any = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  try {
    const { data: founder, error: founderError } = await supabase
      .from('founder_submissions')
      .select('id, full_name, project_name, status')
      .eq('id', founderId)
      .single();

    if (founderError || !founder) {
      return NextResponse.json({ error: 'Founder kaydı bulunamadı.' }, { status: 404 });
    }
    if (String(founder.status || '') !== 'approved') {
      return NextResponse.json({ error: 'Bu founder için anket henüz aktif değil.' }, { status: 403 });
    }

    const [{ data: slotRows, error: slotError }, { data: voteRow, error: voteError }] = await Promise.all([
      supabase
        .from('founder_event_slots')
        .select('id, title, starts_at, ends_at, is_active, sort_order')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .order('starts_at', { ascending: true }),
      supabase
        .from('founder_event_votes')
        .select('id, selected_slot_ids, updated_at')
        .eq('founder_submission_id', founderId)
        .maybeSingle(),
    ]);

    if (slotError) throw slotError;
    if (voteError) throw voteError;

    return NextResponse.json({
      ok: true,
      founder: {
        id: founder.id,
        full_name: founder.full_name,
        project_name: founder.project_name,
      },
      slots: Array.isArray(slotRows) ? slotRows : [],
      existing_vote: voteRow
        ? {
            id: voteRow.id,
            selected_slot_ids: Array.isArray(voteRow.selected_slot_ids) ? voteRow.selected_slot_ids : [],
            updated_at: voteRow.updated_at ?? null,
          }
        : null,
    });
  } catch (error) {
    console.error('founder-event-slots GET failed:', error);
    return NextResponse.json({ error: (error as Error)?.message || 'Slotlar yüklenemedi.' }, { status: 500 });
  }
}
