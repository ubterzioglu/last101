import { createClient } from '@supabase/supabase-js';

function parseLimit(value) {
  const parsed = Number.parseInt(String(value || ''), 10);
  if (!Number.isFinite(parsed)) return 60;
  return Math.min(Math.max(parsed, 1), 300);
}

function mapQueryError(error) {
  const message = String(error?.message || '').toLowerCase();
  if (message.includes('event_e2_questions') && message.includes('does not exist')) {
    return 'event_e2_questions tablosu bulunamadi. Supabase migration calistirin.';
  }
  return 'Failed to fetch questions';
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(503).json({ error: 'Service not configured' });
  }

  const limit = parseLimit(req.query?.limit);
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    const { data, error } = await supabase
      .from('event_e2_questions')
      .select('id, question, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('event-e2-question-list query failed:', error);
      return res.status(500).json({ error: mapQueryError(error) });
    }

    return res.status(200).json({ ok: true, items: data || [] });
  } catch (error) {
    console.error('event-e2-question-list failed:', error);
    return res.status(500).json({ error: 'List failed' });
  }
}
