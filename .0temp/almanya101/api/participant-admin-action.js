import { createClient } from '@supabase/supabase-js';
import { isAdminAuthorized, parseJsonBody } from './_devuser-admin.js';

const CATEGORY_TABLE = {
  tavla: 'tavla_participants',
  vct: 'vct_participants',
  typing: 'typing_participants',
  promote: 'promote_participants',
  cvopt: 'cvopt_participants',
};

const ACTIONS = new Set([
  'approve',
  'unapprove',
  'delete',
  'linkedin_ok',
  'linkedin_pending',
  'cv_ok',
  'cv_pending',
]);

function normalizeCategory(value) {
  const category = String(value || '').trim().toLowerCase();
  return Object.prototype.hasOwnProperty.call(CATEGORY_TABLE, category) ? category : '';
}

function normalizeAction(value) {
  const action = String(value || '').trim().toLowerCase();
  return ACTIONS.has(action) ? action : '';
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

  const id = String(body.id || '').trim();
  const category = normalizeCategory(body.category);
  const action = normalizeAction(body.action);
  if (!id) return res.status(400).json({ error: 'id is required' });
  if (!category) return res.status(400).json({ error: 'category is required' });
  if (!action) return res.status(400).json({ error: 'action is required' });
  if (category !== 'cvopt' && (action === 'linkedin_ok' || action === 'linkedin_pending' || action === 'cv_ok' || action === 'cv_pending')) {
    return res.status(400).json({ error: 'action is invalid for category' });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(503).json({ error: 'Service not configured' });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const participantTable = CATEGORY_TABLE[category];

  try {
    if (category === 'tavla' || category === 'typing') {
      if (action === 'delete' || action === 'unapprove') {
        const bracketTable = category === 'tavla' ? 'tavla_bracket' : 'typing_bracket';
        const { error: bracketError } = await supabase
          .from(bracketTable)
          .delete()
          .eq('participant_id', id);
        if (bracketError) throw bracketError;
      }
    }

    if (action === 'delete') {
      const { error } = await supabase.from(participantTable).delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true, deleted: true });
    }

    const updates = { updated_at: new Date().toISOString() };
    if (action === 'approve' || action === 'unapprove') {
      updates.approved = action === 'approve';
    } else if (action === 'linkedin_ok' || action === 'linkedin_pending') {
      updates.linkedin_ok = action === 'linkedin_ok';
    } else if (action === 'cv_ok' || action === 'cv_pending') {
      updates.cv_ok = action === 'cv_ok';
    }

    const { data, error } = await supabase
      .from(participantTable)
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    return res.status(200).json({ ok: true, data });
  } catch (error) {
    console.error('participant-admin-action failed:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
