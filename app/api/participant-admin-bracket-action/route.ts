import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isAdminAuthorized } from '@/lib/admin/adminAuth';

const BRACKET_TABLE_BY_CATEGORY: Record<string, string> = {
  tavla: 'tavla_bracket',
  typing: 'typing_bracket',
};

const PARTICIPANT_TABLE_BY_CATEGORY: Record<string, string> = {
  tavla: 'tavla_participants',
  typing: 'typing_participants',
};

const ACTIONS = new Set(['add', 'remove_participant', 'toggle_winner', 'clear_slot']);
const SLOT_LIMIT = 30;

function getSupabaseAdminClient() {
  const supabaseUrl = String(process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
  const serviceRoleKey = String(process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
  if (!supabaseUrl || !serviceRoleKey) return null;
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function normalizeCategory(value: unknown): string {
  const category = String(value || '').trim().toLowerCase();
  return Object.prototype.hasOwnProperty.call(BRACKET_TABLE_BY_CATEGORY, category) ? category : '';
}

function normalizeAction(value: unknown): string {
  const action = String(value || '').trim().toLowerCase();
  return ACTIONS.has(action) ? action : '';
}

function parseSlotIndex(value: unknown): number | null {
  if (typeof value === 'number' && Number.isInteger(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number.parseInt(value.trim(), 10);
    if (Number.isInteger(parsed)) return parsed;
  }
  return null;
}

function isValidSlotIndex(slotIndex: number | null): slotIndex is number {
  return Number.isInteger(slotIndex) && (slotIndex as number) >= 0 && (slotIndex as number) < SLOT_LIMIT;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function findFirstEmptySlot(supabase: any, bracketTable: string): Promise<number> {
  const { data, error } = await supabase
    .from(bracketTable)
    .select('slot_index')
    .order('slot_index', { ascending: true });

  if (error) throw error;

  const used = new Set(
    (Array.isArray(data) ? data : [])
      .map((row: Record<string, unknown>) => Number.parseInt(String(row?.slot_index ?? ''), 10))
      .filter((slotIndex: number) => Number.isInteger(slotIndex))
  );

  for (let slotIndex = 0; slotIndex < SLOT_LIMIT; slotIndex += 1) {
    if (!used.has(slotIndex)) return slotIndex;
  }
  return -1;
}

async function ensureParticipantExistsAndApproved(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  participantTable: string,
  participantId: string
): Promise<{ ok: boolean; status: number; error: string }> {
  const { data, error } = await supabase
    .from(participantTable)
    .select('id, approved')
    .eq('id', participantId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return { ok: false, status: 404, error: 'Participant not found' };
  if (!data.approved) return { ok: false, status: 400, error: 'Participant is not approved' };
  return { ok: true, status: 200, error: '' };
}

async function addToBracket(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  category: string,
  participantId: string,
  requestedSlotIndex: number | null
): Promise<{ ok: boolean; status: number; error?: string; data?: unknown }> {
  const participantTable = PARTICIPANT_TABLE_BY_CATEGORY[category];
  const bracketTable = BRACKET_TABLE_BY_CATEGORY[category];

  const participantCheck = await ensureParticipantExistsAndApproved(supabase, participantTable, participantId);
  if (!participantCheck.ok) {
    return { ok: false, status: participantCheck.status, error: participantCheck.error };
  }

  const { data: participantRows, error: participantCheckError } = await supabase
    .from(bracketTable)
    .select('id')
    .eq('participant_id', participantId)
    .limit(1);
  if (participantCheckError) throw participantCheckError;
  if (Array.isArray(participantRows) && participantRows.length > 0) {
    return { ok: false, status: 409, error: 'Participant is already in bracket' };
  }

  let slotIndex = requestedSlotIndex;
  if (!isValidSlotIndex(slotIndex)) {
    slotIndex = await findFirstEmptySlot(supabase, bracketTable);
  }
  if (!isValidSlotIndex(slotIndex)) {
    return { ok: false, status: 409, error: 'Bracket is full' };
  }

  const { data: occupiedRows, error: occupiedError } = await supabase
    .from(bracketTable)
    .select('id')
    .eq('slot_index', slotIndex)
    .limit(1);
  if (occupiedError) throw occupiedError;
  if (Array.isArray(occupiedRows) && occupiedRows.length > 0) {
    return { ok: false, status: 409, error: 'Slot is already occupied' };
  }

  const { data, error } = await supabase
    .from(bracketTable)
    .insert({
      slot_index: slotIndex,
      participant_id: participantId,
      winner: false,
    })
    .select('*')
    .single();

  if (error) throw error;
  return { ok: true, status: 200, data };
}

async function removeParticipantFromBracket(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  category: string,
  participantId: string
): Promise<{ ok: boolean; status: number }> {
  const bracketTable = BRACKET_TABLE_BY_CATEGORY[category];
  const { error } = await supabase
    .from(bracketTable)
    .delete()
    .eq('participant_id', participantId);
  if (error) throw error;
  return { ok: true, status: 200 };
}

async function toggleBracketWinner(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  category: string,
  slotIndex: number
): Promise<{ ok: boolean; status: number; error?: string; data?: unknown }> {
  const bracketTable = BRACKET_TABLE_BY_CATEGORY[category];

  const { data: slot, error: slotError } = await supabase
    .from(bracketTable)
    .select('id, winner')
    .eq('slot_index', slotIndex)
    .maybeSingle();
  if (slotError) throw slotError;
  if (!slot) return { ok: false, status: 404, error: 'Slot not found' };

  const { data, error } = await supabase
    .from(bracketTable)
    .update({ winner: !slot.winner })
    .eq('id', slot.id)
    .select('*')
    .single();

  if (error) throw error;
  return { ok: true, status: 200, data };
}

async function clearBracketSlot(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  category: string,
  slotIndex: number
): Promise<{ ok: boolean; status: number }> {
  const bracketTable = BRACKET_TABLE_BY_CATEGORY[category];
  const { error } = await supabase
    .from(bracketTable)
    .delete()
    .eq('slot_index', slotIndex);
  if (error) throw error;
  return { ok: true, status: 200 };
}

export async function POST(request: NextRequest) {
  const auth = await isAdminAuthorized(request);
  if (!auth.ok) return NextResponse.json({ error: auth.reason }, { status: auth.status });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const category = normalizeCategory(body.category);
  const action = normalizeAction(body.action);
  const participantId = String(body.participantId || '').trim();
  const slotIndex = parseSlotIndex(body.slotIndex);

  if (!category) return NextResponse.json({ error: 'category is required' }, { status: 400 });
  if (!action) return NextResponse.json({ error: 'action is required' }, { status: 400 });

  if (action === 'add' || action === 'remove_participant') {
    if (!participantId) return NextResponse.json({ error: 'participantId is required' }, { status: 400 });
  }

  if (action === 'toggle_winner' || action === 'clear_slot') {
    if (!isValidSlotIndex(slotIndex)) return NextResponse.json({ error: 'slotIndex is required' }, { status: 400 });
  }

  if (action === 'add' && slotIndex !== null && !isValidSlotIndex(slotIndex)) {
    return NextResponse.json({ error: 'slotIndex is invalid' }, { status: 400 });
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) return NextResponse.json({ error: 'Service not configured' }, { status: 503 });

  try {
    if (action === 'add') {
      const result = await addToBracket(supabase, category, participantId, slotIndex);
      if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
      return NextResponse.json({ ok: true, data: result.data || null });
    }

    if (action === 'remove_participant') {
      const result = await removeParticipantFromBracket(supabase, category, participantId);
      if (!result.ok) return NextResponse.json({ error: 'remove failed' }, { status: result.status });
      return NextResponse.json({ ok: true });
    }

    if (action === 'toggle_winner') {
      const result = await toggleBracketWinner(supabase, category, slotIndex as number);
      if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
      return NextResponse.json({ ok: true, data: result.data || null });
    }

    if (action === 'clear_slot') {
      const result = await clearBracketSlot(supabase, category, slotIndex as number);
      if (!result.ok) return NextResponse.json({ error: 'clear failed' }, { status: result.status });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: 'Unsupported action' }, { status: 400 });
  } catch (error) {
    console.error('participant-admin-bracket-action failed:', error);
    const e = error as Error;
    return NextResponse.json({ error: e.message || 'Internal server error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
