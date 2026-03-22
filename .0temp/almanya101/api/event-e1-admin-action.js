import { createClient } from '@supabase/supabase-js';
import { isAdminAuthorized, parseJsonBody } from './_devuser-admin.js';

const ALLOWED_TARGETS = new Set(['vote', 'question']);

function normalizeTarget(value) {
  const normalized = String(value || '').trim().toLowerCase();
  if (ALLOWED_TARGETS.has(normalized)) return normalized;
  return '';
}

function normalizeAction(value) {
  const normalized = String(value || '').trim().toLowerCase();
  if (normalized === 'delete') return normalized;
  return '';
}

function mapDeleteError(error) {
  const message = String(error?.message || '').toLowerCase();
  if (message.includes('event_e1_date_votes') && message.includes('does not exist')) {
    return 'event_e1_date_votes tablosu bulunamadi. Supabase migration calistirin.';
  }
  if (message.includes('event_e1_questions') && message.includes('does not exist')) {
    return 'event_e1_questions tablosu bulunamadi. Supabase migration calistirin.';
  }
  return 'Delete failed';
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const auth = await isAdminAuthorized(req);
  if (!auth.ok) {
    return res.status(auth.status).json({ error: auth.reason });
  }

  const body = parseJsonBody(req);
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  const id = Number.parseInt(String(body.id || ''), 10);
  const target = normalizeTarget(body.target);
  const action = normalizeAction(body.action);

  if (!Number.isFinite(id) || id <= 0) {
    return res.status(400).json({ error: 'id is required' });
  }
  if (!target) {
    return res.status(400).json({ error: 'Invalid target' });
  }
  if (!action) {
    return res.status(400).json({ error: 'Invalid action' });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(503).json({ error: 'Service not configured' });
  }

  const tableName = target === 'vote' ? 'event_e1_date_votes' : 'event_e1_questions';
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    const { data: targetRow, error: targetError } = await supabase
      .from(tableName)
      .select('id')
      .eq('id', id)
      .maybeSingle();

    if (targetError) {
      return res.status(500).json({ error: mapDeleteError(targetError) });
    }
    if (!targetRow) {
      return res.status(404).json({ error: 'Record not found' });
    }

    const { error: deleteError } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id);

    if (deleteError) {
      return res.status(500).json({ error: mapDeleteError(deleteError) });
    }

    return res.status(200).json({
      ok: true,
      action: 'delete',
      target,
      id,
    });
  } catch (error) {
    console.error('event-e1-admin-action failed:', error);
    return res.status(500).json({ error: 'Action failed' });
  }
}
