import { createClient } from '@supabase/supabase-js';
import { isAdminAuthorized } from './_devuser-admin.js';

const ALLOWED_STATUSES = new Set(['all', 'draft', 'published']);
const ALLOWED_CATEGORIES = new Set(['Almanya', 'Türkiye', 'Avrupa', 'Dünya']);

function normalizeEnvValue(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
    return raw.slice(1, -1).trim();
  }
  return raw;
}

function normalizeStatus(value) {
  const safe = String(value || 'all').trim().toLowerCase();
  return ALLOWED_STATUSES.has(safe) ? safe : 'all';
}

function normalizeCategory(value) {
  const safe = String(value || 'all').trim();
  if (!safe) return 'all';
  return ALLOWED_CATEGORIES.has(safe) ? safe : 'all';
}

function normalizeLimit(value) {
  const parsed = Number.parseInt(String(value || ''), 10);
  if (!Number.isFinite(parsed)) return 300;
  return Math.min(Math.max(parsed, 1), 1000);
}

function normalizeSearch(value) {
  return String(value || '').trim().slice(0, 120);
}

async function countNews(supabase, category, status) {
  let query = supabase.from('news_posts').select('id', { count: 'exact', head: true });
  if (category !== 'all') query = query.eq('category', category);
  if (status !== 'all') query = query.eq('status', status);
  const { count, error } = await query;
  if (error) throw error;
  return Number(count || 0);
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const auth = await isAdminAuthorized(req);
  if (!auth.ok) return res.status(auth.status).json({ error: auth.reason });

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

  const status = normalizeStatus(req.query?.status);
  const category = normalizeCategory(req.query?.category);
  const limit = normalizeLimit(req.query?.limit);
  const search = normalizeSearch(req.query?.q);

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  try {
    let query = supabase
      .from('news_posts')
      .select('id, category, title, summary, cover_image_url, source_name, source_url, reading_minutes, published_at, created_at, status')
      .order('published_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })
      .limit(limit);

    if (status !== 'all') query = query.eq('status', status);
    if (category !== 'all') query = query.eq('category', category);
    if (search) query = query.ilike('title', `%${search}%`);

    const [{ data, error }, total, draft, published] = await Promise.all([
      query,
      countNews(supabase, category, 'all'),
      countNews(supabase, category, 'draft'),
      countNews(supabase, category, 'published'),
    ]);

    if (error) throw error;

    return res.status(200).json({
      ok: true,
      items: Array.isArray(data) ? data : [],
      stats: {
        total,
        draft,
        published,
      },
    });
  } catch (error) {
    console.error('news-admin-list failed:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
