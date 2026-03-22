// =========================================================
// FILE: /api/cs-admin-delete-answer.js
// PURPOSE: Admin delete answer
// =========================================================

import { createClient } from '@supabase/supabase-js';
import { isAdminAuthorized } from './_devuser-admin.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const auth = await isAdminAuthorized(req);
  if (!auth.ok) return res.status(auth.status).json({ error: auth.reason });

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(503).json({ error: 'Admin not configured (missing Supabase env vars).' });
  }

  let body = {};
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  const id = parseInt(body.id, 10);
  if (!id || Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    // Find question id for decrement
    const { data: row, error: fetchError } = await supabase
      .from('cs_answers')
      .select('question_id')
      .eq('id', id)
      .single();
    if (fetchError) throw fetchError;

    const { error } = await supabase.from('cs_answers').delete().eq('id', id);
    if (error) throw error;

    if (row && row.question_id) {
      const { data: qRow } = await supabase
        .from('cs_questions')
        .select('answer_count')
        .eq('id', row.question_id)
        .single();
      if (qRow && typeof qRow.answer_count === 'number') {
        await supabase
          .from('cs_questions')
          .update({ answer_count: Math.max(0, qRow.answer_count - 1) })
          .eq('id', row.question_id);
      }
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('Delete answer failed:', e);
    return res.status(500).json({ error: 'Delete failed' });
  }
}
