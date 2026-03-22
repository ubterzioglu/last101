// =========================================================
// FILE: /api/cs-admin-list.js
// PURPOSE: Admin list for questions and answers
// =========================================================

import { createClient } from '@supabase/supabase-js';
import { isAdminAuthorized } from './_devuser-admin.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const auth = await isAdminAuthorized(req);
  if (!auth.ok) return res.status(auth.status).json({ error: auth.reason });

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(503).json({ error: 'Admin list not configured (missing Supabase env vars).' });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    const [qRes, aRes] = await Promise.all([
      supabase.from('cs_questions').select('id, question, created_at, answer_count').order('created_at', { ascending: false }).limit(200),
      supabase.from('cs_answers').select('id, question_id, message, created_at').order('created_at', { ascending: false }).limit(500)
    ]);

    if (qRes.error) throw qRes.error;
    if (aRes.error) throw aRes.error;

    return res.status(200).json({ ok: true, questions: qRes.data || [], answers: aRes.data || [] });
  } catch (e) {
    console.error('Admin list failed:', e);
    return res.status(500).json({ error: 'Admin list failed' });
  }
}
