import { createClient } from '@supabase/supabase-js';
import { isAdminAuthorized } from './_devuser-admin.js';

const CATEGORY_TABLE = {
  tavla: { participants: 'tavla_participants', bracket: 'tavla_bracket' },
  typing: { participants: 'typing_participants', bracket: 'typing_bracket' },
  vct: { participants: 'vct_participants', bracket: '' },
  promote: { participants: 'promote_participants', bracket: '' },
  cvopt: { participants: 'cvopt_participants', bracket: '' },
};

function normalizeCategory(value) {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const category = String(rawValue || '').trim().toLowerCase();
  if (!category || category === 'all') return 'all';
  return Object.prototype.hasOwnProperty.call(CATEGORY_TABLE, category) ? category : '';
}

function getSupabaseAdminClient() {
  const supabaseUrl = String(process.env.SUPABASE_URL || '').trim();
  const serviceRoleKey = String(process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
  if (!supabaseUrl || !serviceRoleKey) return null;
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function loadParticipants(supabase, tableName) {
  const result = await supabase
    .from(tableName)
    .select('*')
    .order('created_at', { ascending: false });
  if (result.error) throw result.error;
  return Array.isArray(result.data) ? result.data : [];
}

async function loadBracket(supabase, tableName) {
  const result = await supabase
    .from(tableName)
    .select('*')
    .order('slot_index', { ascending: true });
  if (result.error) throw result.error;
  return Array.isArray(result.data) ? result.data : [];
}

async function loadCategoryPayload(supabase, category) {
  const tableConfig = CATEGORY_TABLE[category];
  const participants = await loadParticipants(supabase, tableConfig.participants);
  if (!tableConfig.bracket) {
    return { participants };
  }
  const bracket = await loadBracket(supabase, tableConfig.bracket);
  return { participants, bracket };
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const auth = await isAdminAuthorized(req);
  if (!auth.ok) return res.status(auth.status).json({ error: auth.reason });

  const category = normalizeCategory(req.query?.category);
  if (!category) return res.status(400).json({ error: 'category is invalid' });

  const supabase = getSupabaseAdminClient();
  if (!supabase) return res.status(503).json({ error: 'Service not configured' });

  try {
    if (category === 'all') {
      const categories = Object.keys(CATEGORY_TABLE);
      const entries = await Promise.all(
        categories.map(async (item) => {
          const payload = await loadCategoryPayload(supabase, item);
          return [item, payload];
        })
      );
      return res.status(200).json({ ok: true, data: Object.fromEntries(entries) });
    }

    const payload = await loadCategoryPayload(supabase, category);
    return res.status(200).json({ ok: true, data: payload });
  } catch (error) {
    console.error('participant-admin-list failed:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
