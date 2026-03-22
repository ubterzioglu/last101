import { createClient } from '@supabase/supabase-js';

const ALLOWED_TOPIC_KEYS = new Set([
  'ai-tools',
  'industry-trends',
  'ai-vs-coding',
  'nonprofit',
  'ai-collaboration',
  'app-testing',
  'state-groups',
  'ai-usage',
  'working-conditions',
  'project-presentations',
  'mutual-support'
]);

function parseLimit(value) {
  const parsed = Number.parseInt(String(value || ''), 10);
  if (!Number.isFinite(parsed)) return 2000;
  return Math.min(Math.max(parsed, 1), 5000);
}

function normalizeSelectedTopics(value) {
  const source = Array.isArray(value) ? value : [];
  const selected = source
    .map((item) => String(item || '').trim().toLowerCase())
    .filter((item) => ALLOWED_TOPIC_KEYS.has(item));
  return Array.from(new Set(selected));
}

function mapQueryError(error) {
  const message = String(error?.message || '').toLowerCase();
  if (message.includes('event_e2_topic_votes') && message.includes('does not exist')) {
    return 'event_e2_topic_votes tablosu bulunamadi. Supabase migration calistirin.';
  }
  return 'Failed to fetch results';
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
      .from('event_e2_topic_votes')
      .select('selected_topics')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('event-e2-results query failed:', error);
      return res.status(500).json({ error: mapQueryError(error) });
    }

    const counts = {
      'ai-tools': 0,
      'industry-trends': 0,
      'ai-vs-coding': 0,
      'nonprofit': 0,
      'ai-collaboration': 0,
      'app-testing': 0,
      'state-groups': 0,
      'ai-usage': 0,
      'working-conditions': 0,
      'project-presentations': 0,
      'mutual-support': 0,
    };
    let totalSubmissions = 0;
    let totalVotes = 0;

    for (const row of data || []) {
      totalSubmissions += 1;
      const selectedTopics = normalizeSelectedTopics(row.selected_topics);
      for (const key of selectedTopics) {
        counts[key] += 1;
        totalVotes += 1;
      }
    }

    return res.status(200).json({
      ok: true,
      stats: {
        total_submissions: totalSubmissions,
        total_votes: totalVotes,
        counts,
      },
    });
  } catch (error) {
    console.error('event-e2-results failed:', error);
    return res.status(500).json({ error: 'Result list failed' });
  }
}
