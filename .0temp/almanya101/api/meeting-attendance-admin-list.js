import { createClient } from '@supabase/supabase-js';
import { isAdminAuthorized } from './_devuser-admin.js';

function normalizeEnvValue(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
    return raw.slice(1, -1).trim();
  }
  return raw;
}

function parseLimit(value, fallback = 500) {
  const parsed = Number.parseInt(String(value || ''), 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(Math.max(parsed, 1), 2000);
}

function normalizeDateStats(items) {
  return items
    .map(([dateOption, voteCount]) => ({
      date_option: dateOption,
      vote_count: voteCount,
    }))
    .sort((left, right) => {
      if (right.vote_count !== left.vote_count) return right.vote_count - left.vote_count;
      return String(left.date_option).localeCompare(String(right.date_option), 'tr');
    });
}

function buildDateStats(rows) {
  const counts = new Map();

  for (const row of rows) {
    const dates = Array.isArray(row?.available_dates) ? row.available_dates : [];
    for (const value of dates) {
      const dateOption = String(value || '').trim();
      if (!dateOption) continue;
      counts.set(dateOption, Number(counts.get(dateOption) || 0) + 1);
    }
  }

  return normalizeDateStats(Array.from(counts.entries()));
}

function mapQueryError(error) {
  const message = String(error?.message || '').toLowerCase();
  if (
    message.includes('meeting_attendance') &&
    (message.includes('schema cache') || message.includes('does not exist') || message.includes('could not find'))
  ) {
    return 'meeting_attendance tablosu bulunamadi. Supabase migration calistirin.';
  }
  return 'Failed to fetch meeting attendance records';
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const auth = await isAdminAuthorized(req);
  if (!auth.ok) {
    return res.status(auth.status).json({ error: auth.reason });
  }

  const supabaseUrl = normalizeEnvValue(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL);
  const serviceRoleKey = normalizeEnvValue(
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    ''
  );
  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(503).json({ error: 'Service not configured' });
  }

  const limit = parseLimit(req.query?.limit, 500);
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  try {
    const { data, error, count } = await supabase
      .from('meeting_attendance')
      .select('id, full_name, whatsapp, available_dates, created_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('meeting-attendance-admin-list query failed:', error);
      return res.status(500).json({ error: mapQueryError(error) });
    }

    const items = Array.isArray(data)
      ? data.map((row) => ({
          id: row.id,
          full_name: row.full_name || '',
          whatsapp: row.whatsapp || '',
          available_dates: Array.isArray(row.available_dates) ? row.available_dates : [],
          created_at: row.created_at || null,
        }))
      : [];

    const dateStats = buildDateStats(items);

    return res.status(200).json({
      ok: true,
      items,
      date_stats: dateStats,
      stats: {
        total: Number(count || items.length || 0),
      },
    });
  } catch (error) {
    console.error('meeting-attendance-admin-list failed:', error);
    return res.status(500).json({ error: error.message || 'List failed' });
  }
}
