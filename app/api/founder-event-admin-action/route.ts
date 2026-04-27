import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isAdminAuthorized } from '@/lib/admin/adminAuth';
import { isUuid, sanitizeText } from '@/lib/founder';

function normalizeEnvValue(value: unknown): string {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
    return raw.slice(1, -1).trim();
  }
  return raw;
}

function parseDateInput(value: unknown): string | null {
  const raw = String(value || '').trim();
  if (!raw) return null;
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString();
}

function parseSortOrder(value: unknown): number {
  const parsed = Number.parseInt(String(value || ''), 10);
  if (!Number.isFinite(parsed)) return 100;
  return Math.min(Math.max(parsed, 0), 9999);
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function POST(request: NextRequest) {
  const auth = await isAdminAuthorized(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.reason }, { status: auth.status });
  }

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

  const action = String(body.action || '').trim().toLowerCase();
  const id = String(body.id || '').trim();
  const title = sanitizeText(body.title, 120) || null;
  const startsAt = parseDateInput(body.starts_at);
  const endsAt = parseDateInput(body.ends_at);
  const sortOrder = parseSortOrder(body.sort_order);
  const isActive = typeof body.is_active === 'boolean' ? body.is_active : null;

  const supabase: any = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  try {
    if (action === 'create' || action === 'update') {
      if (action === 'update' && !isUuid(id)) {
        return NextResponse.json({ error: 'Geçersiz slot kimliği.' }, { status: 400 });
      }
      if (!startsAt) {
        return NextResponse.json({ error: 'Başlangıç tarihi gerekli.' }, { status: 400 });
      }
      if (endsAt && new Date(endsAt).getTime() < new Date(startsAt).getTime()) {
        return NextResponse.json({ error: 'Bitiş saati başlangıçtan önce olamaz.' }, { status: 400 });
      }

      const payload = {
        title,
        starts_at: startsAt,
        ends_at: endsAt,
        sort_order: sortOrder,
        updated_at: new Date().toISOString(),
        ...(isActive === null ? {} : { is_active: isActive }),
      };

      const query =
        action === 'create'
          ? supabase.from('founder_event_slots').insert([{ ...payload, is_active: isActive ?? true }])
          : supabase.from('founder_event_slots').update(payload).eq('id', id);

      const { data, error } = await query.select('id').single();
      if (error) throw error;
      return NextResponse.json({ ok: true, id: data?.id ?? id ?? null });
    }

    if (!isUuid(id)) {
      return NextResponse.json({ error: 'Geçersiz slot kimliği.' }, { status: 400 });
    }

    if (action === 'toggle_active') {
      const { data, error } = await supabase
        .from('founder_event_slots')
        .update({
          is_active: isActive ?? false,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select('id, is_active')
        .single();

      if (error) throw error;
      return NextResponse.json({ ok: true, item: data });
    }

    if (action === 'delete') {
      const { data: votes, error: votesError } = await supabase
        .from('founder_event_votes')
        .select('id, selected_slot_ids');

      if (votesError) throw votesError;

      for (const vote of Array.isArray(votes) ? votes : []) {
        const selected = Array.isArray(vote.selected_slot_ids) ? vote.selected_slot_ids : [];
        if (!selected.includes(id)) continue;
        const nextSelected = selected.filter((slotId: string) => slotId !== id);
        const { error: updateVoteError } = await supabase
          .from('founder_event_votes')
          .update({
            selected_slot_ids: nextSelected,
            updated_at: new Date().toISOString(),
          })
          .eq('id', vote.id);
        if (updateVoteError) throw updateVoteError;
      }

      const { error } = await supabase.from('founder_event_slots').delete().eq('id', id);
      if (error) throw error;
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: 'Geçersiz işlem.' }, { status: 400 });
  } catch (error) {
    console.error('founder-event-admin-action POST failed:', error);
    return NextResponse.json({ error: (error as Error)?.message || 'İşlem başarısız.' }, { status: 500 });
  }
}
