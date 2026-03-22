import { createClient } from '@supabase/supabase-js';
import { isAdminAuthorized } from './_devuser-admin.js';

const MARKER = '[DEVUSER_DIS_V1]';

function readBody(req) {
  if (!req.body) return {};
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return null;
    }
  }
  return req.body;
}

function normalizeAction(value) {
  const safe = String(value || '').trim().toLowerCase();
  if (safe === 'approve' || safe === 'pending' || safe === 'delete') return safe;
  return null;
}

async function updateStatusWithFallback(supabase, id, statuses) {
  let lastError = null;

  for (const status of statuses) {
    const { data, error } = await supabase
      .from('feedback_submissions')
      .update({ status })
      .eq('id', id)
      .select('id, status')
      .single();

    if (!error) {
      return { data, error: null };
    }
    lastError = error;
  }

  return { data: null, error: lastError || new Error('Status update failed') };
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const body = readBody(req);
  if (body === null) return res.status(400).json({ error: 'Invalid JSON body' });

  const auth = await isAdminAuthorized(req);
  if (!auth.ok) return res.status(auth.status).json({ error: auth.reason });

  const id = String(body.id || '').trim();
  const action = normalizeAction(body.action);

  if (!id) return res.status(400).json({ error: 'id is required' });
  if (!action) return res.status(400).json({ error: 'Invalid action' });

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(503).json({ error: 'Service not configured' });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    const { data: targetRow, error: targetError } = await supabase
      .from('feedback_submissions')
      .select('id, message, status')
      .eq('id', id)
      .maybeSingle();

    if (targetError) {
      return res.status(500).json({ error: targetError.message || 'Fetch failed' });
    }
    if (!targetRow) {
      return res.status(404).json({ error: 'Record not found' });
    }
    if (!String(targetRow.message || '').startsWith(`${MARKER}\n`)) {
      return res.status(400).json({ error: 'This record does not belong to devuser dis flow' });
    }

    if (action === 'delete') {
      const { error } = await supabase
        .from('feedback_submissions')
        .delete()
        .eq('id', id);

      if (error) {
        return res.status(500).json({ error: error.message || 'Delete failed' });
      }

      return res.status(200).json({ ok: true, action: 'delete', id });
    }

    if (action === 'pending') {
      const { data, error } = await updateStatusWithFallback(supabase, id, ['pending']);
      if (error) {
        return res.status(500).json({ error: error.message || 'Update failed' });
      }
      return res.status(200).json({ ok: true, action: 'pending', id, status: data?.status || 'pending' });
    }

    const { data, error } = await updateStatusWithFallback(supabase, id, ['read', 'reviewed', 'resolved', 'approved']);
    if (error) {
      return res.status(500).json({ error: error.message || 'Approve failed' });
    }
    return res.status(200).json({ ok: true, action: 'approve', id, status: data?.status || 'read' });
  } catch (error) {
    console.error('devuser-dis-admin-action failed:', error);
    return res.status(500).json({ error: 'Action failed' });
  }
}
