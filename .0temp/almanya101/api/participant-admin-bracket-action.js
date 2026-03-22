import { createClient } from '@supabase/supabase-js';
import { isAdminAuthorized, parseJsonBody } from './_devuser-admin.js';

const BRACKET_TABLE_BY_CATEGORY = {
  tavla: 'tavla_bracket',
  typing: 'typing_bracket',
};

const PARTICIPANT_TABLE_BY_CATEGORY = {
  tavla: 'tavla_participants',
  typing: 'typing_participants',
};

const ACTIONS = new Set(['add', 'remove_participant', 'toggle_winner', 'clear_slot']);
const SLOT_LIMIT = 30;

function getSupabaseAdminClient() {
  const supabaseUrl = String(process.env.SUPABASE_URL || '').trim();
  const serviceRoleKey = String(process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
  if (!supabaseUrl || !serviceRoleKey) return null;
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function normalizeCategory(value) {
  const category = String(value || '').trim().toLowerCase();
  return Object.prototype.hasOwnProperty.call(BRACKET_TABLE_BY_CATEGORY, category) ? category : '';
}

function normalizeAction(value) {
  const action = String(value || '').trim().toLowerCase();
  return ACTIONS.has(action) ? action : '';
}

function parseSlotIndex(value) {
  if (typeof value === 'number' && Number.isInteger(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number.parseInt(value.trim(), 10);
    if (Number.isInteger(parsed)) return parsed;
  }
  return null;
}

function isValidSlotIndex(slotIndex) {
  return Number.isInteger(slotIndex) && slotIndex >= 0 && slotIndex < SLOT_LIMIT;
}

async function findFirstEmptySlot(supabase, bracketTable) {
  const { data, error } = await supabase
    .from(bracketTable)
    .select('slot_index')
    .order('slot_index', { ascending: true });

  if (error) throw error;

  const used = new Set(
    (Array.isArray(data) ? data : [])
      .map((row) => Number.parseInt(String(row?.slot_index ?? ''), 10))
      .filter((slotIndex) => Number.isInteger(slotIndex))
  );

  for (let slotIndex = 0; slotIndex < SLOT_LIMIT; slotIndex += 1) {
    if (!used.has(slotIndex)) return slotIndex;
  }
  return -1;
}

async function ensureParticipantExistsAndApproved(supabase, participantTable, participantId) {
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

async function addToBracket(supabase, category, participantId, requestedSlotIndex) {
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

async function removeParticipantFromBracket(supabase, category, participantId) {
  const bracketTable = BRACKET_TABLE_BY_CATEGORY[category];
  const { error } = await supabase
    .from(bracketTable)
    .delete()
    .eq('participant_id', participantId);
  if (error) throw error;
  return { ok: true, status: 200 };
}

async function toggleBracketWinner(supabase, category, slotIndex) {
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

async function clearBracketSlot(supabase, category, slotIndex) {
  const bracketTable = BRACKET_TABLE_BY_CATEGORY[category];
  const { error } = await supabase
    .from(bracketTable)
    .delete()
    .eq('slot_index', slotIndex);
  if (error) throw error;
  return { ok: true, status: 200 };
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const auth = await isAdminAuthorized(req);
  if (!auth.ok) return res.status(auth.status).json({ error: auth.reason });

  const body = parseJsonBody(req);
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  const category = normalizeCategory(body.category);
  const action = normalizeAction(body.action);
  const participantId = String(body.participantId || '').trim();
  const slotIndex = parseSlotIndex(body.slotIndex);

  if (!category) return res.status(400).json({ error: 'category is required' });
  if (!action) return res.status(400).json({ error: 'action is required' });

  if (action === 'add' || action === 'remove_participant') {
    if (!participantId) return res.status(400).json({ error: 'participantId is required' });
  }

  if (action === 'toggle_winner' || action === 'clear_slot') {
    if (!isValidSlotIndex(slotIndex)) return res.status(400).json({ error: 'slotIndex is required' });
  }

  if (action === 'add' && slotIndex !== null && !isValidSlotIndex(slotIndex)) {
    return res.status(400).json({ error: 'slotIndex is invalid' });
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) return res.status(503).json({ error: 'Service not configured' });

  try {
    if (action === 'add') {
      const result = await addToBracket(supabase, category, participantId, slotIndex);
      if (!result.ok) return res.status(result.status).json({ error: result.error });
      return res.status(200).json({ ok: true, data: result.data || null });
    }

    if (action === 'remove_participant') {
      const result = await removeParticipantFromBracket(supabase, category, participantId);
      if (!result.ok) return res.status(result.status).json({ error: result.error });
      return res.status(200).json({ ok: true });
    }

    if (action === 'toggle_winner') {
      const result = await toggleBracketWinner(supabase, category, slotIndex);
      if (!result.ok) return res.status(result.status).json({ error: result.error });
      return res.status(200).json({ ok: true, data: result.data || null });
    }

    if (action === 'clear_slot') {
      const result = await clearBracketSlot(supabase, category, slotIndex);
      if (!result.ok) return res.status(result.status).json({ error: result.error });
      return res.status(200).json({ ok: true });
    }

    return res.status(400).json({ error: 'Unsupported action' });
  } catch (error) {
    console.error('participant-admin-bracket-action failed:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
