// =========================================================
// FILE: /api/cs-answer-list.js
// PURPOSE: List approved answers for a question
// =========================================================

import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // CORS
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(503).json({ error: 'List not configured (missing Supabase env vars).' });
  }

  const questionId = parseInt(req.query.question_id || '0', 10);
  if (!questionId || Number.isNaN(questionId)) {
    return res.status(400).json({ error: 'Invalid question id.' });
  }

  const limit = Math.max(1, Math.min(200, parseInt(req.query.limit || '50', 10)));

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    const { data, error } = await supabase
      .from('cs_answers')
      .select('id, message, created_at, question_id')
      .eq('status', 'approved')
      .eq('question_id', questionId)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('Supabase query error:', error);
      return res.status(500).json({ error: 'Failed to load answers' });
    }

    return res.status(200).json({ ok: true, items: data || [] });
  } catch (e) {
    console.error('List failed:', e);
    return res.status(500).json({ error: 'List failed' });
  }
}
