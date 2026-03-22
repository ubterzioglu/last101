// =========================================================
// FILE: /api/cs-question-list.js
// PURPOSE: List approved questions
// =========================================================

import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  console.log('cs-question-list request:', { method: req.method, query: req.query });
  
  // CORS
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  console.log('Environment check:', {
    hasSupabaseUrl: !!SUPABASE_URL,
    hasSupabaseKey: !!SUPABASE_SERVICE_ROLE_KEY
  });

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing Supabase environment variables');
    return res.status(503).json({ error: 'List not configured (missing Supabase env vars).' });
  }

  const limit = Math.max(1, Math.min(100, parseInt(req.query.limit || '30', 10)));
  const offset = Math.max(0, parseInt(req.query.offset || '0', 10));

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    console.log('Querying cs_questions table with:', { limit, offset });
    const { data, error } = await supabase
      .from('cs_questions')
      .select('id, question, created_at')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Supabase query error:', { message: error.message, code: error.code, details: error.details });
      return res.status(500).json({ error: 'Failed to load questions', details: error.message });
    }

    console.log('Query successful, returning', data?.length || 0, 'items');
    return res.status(200).json({ ok: true, items: data || [] });
  } catch (e) {
    console.error('List failed:', e);
    return res.status(500).json({ error: 'List failed', details: e.message });
  }
}
