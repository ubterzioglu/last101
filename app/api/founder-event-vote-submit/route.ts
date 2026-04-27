import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isUuid, sanitizeText, sanitizeUuidArray } from '@/lib/founder';

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

export async function POST(request: NextRequest) {
  const supabaseUrl = normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const serviceRoleKey = normalizeEnvValue(process.env.SUPABASE_SERVICE_ROLE_KEY);

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: 'Service not configured' }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Geçersiz istek gövdesi.' }, { status: 400 });
  }

  const founderSubmissionId = String(body.founder_submission_id || '').trim();
  const selectedSlotIds = sanitizeUuidArray(body.selected_slot_ids, 20);
  const notes = sanitizeText(body.notes, 500);

  if (!isUuid(founderSubmissionId)) {
    return NextResponse.json({ error: 'Geçersiz founder kaydı.' }, { status: 400 });
  }
  if (selectedSlotIds.length === 0) {
    return NextResponse.json({ error: 'En az bir tarih seçmelisiniz.' }, { status: 400 });
  }

  const supabase: any = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  try {
    const { data: founder, error: founderError } = await supabase
      .from('founder_submissions')
      .select('id, status')
      .eq('id', founderSubmissionId)
      .single();

    if (founderError || !founder) {
      return NextResponse.json({ error: 'Founder kaydı bulunamadı.' }, { status: 404 });
    }
    if (String(founder.status || '') !== 'approved') {
      return NextResponse.json({ error: 'Bu founder için anket henüz aktif değil.' }, { status: 403 });
    }

    const { data: activeSlotRows, error: slotError } = await supabase
      .from('founder_event_slots')
      .select('id')
      .eq('is_active', true)
      .in('id', selectedSlotIds);

    if (slotError) throw slotError;

    const activeSlotIds = new Set(
      (Array.isArray(activeSlotRows) ? activeSlotRows : []).map((row: { id: string }) => row.id)
    );
    const invalidSelections = selectedSlotIds.filter((id) => !activeSlotIds.has(id));
    if (invalidSelections.length > 0) {
      return NextResponse.json({ error: 'Seçtiğiniz tarihlerden bazıları artık aktif değil.' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('founder_event_votes')
      .upsert(
        [
          {
            founder_submission_id: founderSubmissionId,
            selected_slot_ids: selectedSlotIds,
            notes: notes || null,
            updated_at: now,
          },
        ],
        { onConflict: 'founder_submission_id' }
      )
      .select('id, updated_at')
      .single();

    if (error) throw error;

    return NextResponse.json({
      ok: true,
      id: data?.id ?? null,
      updated_at: data?.updated_at ?? now,
    });
  } catch (error) {
    console.error('founder-event-vote-submit POST failed:', error);
    return NextResponse.json({ error: (error as Error)?.message || 'Oy kaydı yapılamadı.' }, { status: 500 });
  }
}
