import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isAdminAuthorized } from '@/lib/admin/adminAuth';

interface FounderRow {
  id: string;
  full_name: string;
  project_name: string;
  whatsapp: string;
  status: string;
}

interface VoteRow {
  id: string;
  founder_submission_id: string;
  selected_slot_ids: string[];
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface SlotRow {
  id: string;
  title: string | null;
  starts_at: string;
  ends_at: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string | null;
  updated_at: string | null;
}

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
  const auth = await isAdminAuthorized(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.reason }, { status: auth.status });
  }

  const supabaseUrl = normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const serviceRoleKey = normalizeEnvValue(process.env.SUPABASE_SERVICE_ROLE_KEY);
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: 'Service not configured' }, { status: 503 });
  }

  const supabase: any = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  try {
    const [slotResult, voteResult, founderResult] = await Promise.all([
      supabase
        .from('founder_event_slots')
        .select('id, title, starts_at, ends_at, is_active, sort_order, created_at, updated_at')
        .order('sort_order', { ascending: true })
        .order('starts_at', { ascending: true }),
      supabase
        .from('founder_event_votes')
        .select('id, founder_submission_id, selected_slot_ids, notes, created_at, updated_at')
        .order('updated_at', { ascending: false }),
      supabase
        .from('founder_submissions')
        .select('id, full_name, project_name, whatsapp, status')
        .order('created_at', { ascending: false }),
    ]);

    if (slotResult.error) throw slotResult.error;
    if (voteResult.error) throw voteResult.error;
    if (founderResult.error) throw founderResult.error;

    const slots: SlotRow[] = Array.isArray(slotResult.data) ? slotResult.data : [];
    const votes: VoteRow[] = Array.isArray(voteResult.data) ? voteResult.data : [];
    const founders: FounderRow[] = Array.isArray(founderResult.data) ? founderResult.data : [];

    const founderMap = new Map(founders.map((founder) => [founder.id, founder]));
    const voteCounts = new Map<string, number>();

    for (const vote of votes) {
      const selected = Array.isArray(vote.selected_slot_ids) ? vote.selected_slot_ids : [];
      for (const slotId of selected) {
        const normalizedSlotId = String(slotId || '').trim();
        if (!normalizedSlotId) continue;
        voteCounts.set(normalizedSlotId, Number(voteCounts.get(normalizedSlotId) || 0) + 1);
      }
    }

    return NextResponse.json({
      ok: true,
      slots,
      slot_vote_stats: slots.map((slot) => ({
        slot_id: slot.id,
        vote_count: Number(voteCounts.get(slot.id) || 0),
      })),
      votes: votes.map((vote) => {
        const founder = founderMap.get(vote.founder_submission_id);
        return {
          id: vote.id,
          founder_submission_id: vote.founder_submission_id,
          founder_full_name: founder?.full_name || '-',
          founder_project_name: founder?.project_name || '-',
          founder_whatsapp: founder?.whatsapp || '',
          founder_status: founder?.status || 'pending',
          selected_slot_ids: Array.isArray(vote.selected_slot_ids) ? vote.selected_slot_ids : [],
          notes: vote.notes || null,
          created_at: vote.created_at || null,
          updated_at: vote.updated_at || null,
        };
      }),
      stats: {
        total_slots: slots.length,
        active_slots: slots.filter((slot) => slot.is_active).length,
        total_votes: votes.length,
        approved_founders: founders.filter((founder) => String(founder.status || '') === 'approved').length,
      },
    });
  } catch (error) {
    console.error('founder-event-admin-list GET failed:', error);
    return NextResponse.json({ error: (error as Error)?.message || 'Founder survey verileri yüklenemedi.' }, { status: 500 });
  }
}
