import { createClient } from '@supabase/supabase-js';
import { isAdminAuthorized } from './_devuser-admin.js';

function parseLimit(value, fallback = 300) {
  const parsed = Number.parseInt(String(value || ''), 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(Math.max(parsed, 1), 1000);
}

function normalizeSelectedDates(value) {
  const allowed = new Set(['tarih1', 'tarih2', 'tarih3']);
  const source = Array.isArray(value) ? value : [];
  const normalized = source
    .map((item) => String(item || '').trim().toLowerCase())
    .filter((item) => allowed.has(item));
  return Array.from(new Set(normalized));
}

function mapQueryError(error) {
  const message = String(error?.message || '').toLowerCase();
  if (message.includes('event_e1_date_votes') && message.includes('does not exist')) {
    return 'event_e1_date_votes tablosu bulunamadi. Supabase migration calistirin.';
  }
  if (message.includes('event_e1_questions') && message.includes('does not exist')) {
    return 'event_e1_questions tablosu bulunamadi. Supabase migration calistirin.';
  }
  return 'Failed to fetch records';
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const auth = await isAdminAuthorized(req);
  if (!auth.ok) {
    return res.status(auth.status).json({ error: auth.reason });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(503).json({ error: 'Service not configured' });
  }

  const voteLimit = parseLimit(req.query?.vote_limit, 300);
  const questionLimit = parseLimit(req.query?.question_limit, 300);
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    const [voteResult, questionResult] = await Promise.all([
      supabase
        .from('event_e1_date_votes')
        .select('id, full_name, anonymous, selected_dates, created_at')
        .order('created_at', { ascending: false })
        .limit(voteLimit),
      supabase
        .from('event_e1_questions')
        .select('id, question, created_at')
        .order('created_at', { ascending: false })
        .limit(questionLimit),
    ]);

    if (voteResult.error) {
      console.error('event-e1-admin-list vote query failed:', voteResult.error);
      return res.status(500).json({ error: mapQueryError(voteResult.error) });
    }
    if (questionResult.error) {
      console.error('event-e1-admin-list question query failed:', questionResult.error);
      return res.status(500).json({ error: mapQueryError(questionResult.error) });
    }

    const voteItems = (voteResult.data || []).map((row) => ({
      id: row.id,
      full_name: row.anonymous ? null : (row.full_name || null),
      anonymous: Boolean(row.anonymous),
      selected_dates: normalizeSelectedDates(row.selected_dates),
      created_at: row.created_at,
    }));

    const questionItems = (questionResult.data || []).map((row) => ({
      id: row.id,
      question: String(row.question || ''),
      created_at: row.created_at,
    }));

    return res.status(200).json({
      ok: true,
      vote_items: voteItems,
      question_items: questionItems,
      stats: {
        vote_total: voteItems.length,
        question_total: questionItems.length,
      },
    });
  } catch (error) {
    console.error('event-e1-admin-list failed:', error);
    return res.status(500).json({ error: 'List failed' });
  }
}
