import { createClient } from '@supabase/supabase-js';
import { isAdminAuthorized, parseJsonBody } from './_devuser-admin.js';

const ALLOWED_ACTIONS = new Set(['set_category', 'set_status', 'delete']);
const ALLOWED_CATEGORIES = new Set(['Almanya', 'Türkiye', 'Avrupa', 'Dünya']);
const ALLOWED_STATUSES = new Set(['draft', 'published']);

function normalizeEnvValue(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
    return raw.slice(1, -1).trim();
  }
  return raw;
}

function normalizeAction(value) {
  const safe = String(value || '').trim().toLowerCase();
  return ALLOWED_ACTIONS.has(safe) ? safe : '';
}

function normalizeCategory(value) {
  const safe = String(value || '').trim();
  return ALLOWED_CATEGORIES.has(safe) ? safe : '';
}

function normalizeStatus(value) {
  const safe = String(value || '').trim().toLowerCase();
  return ALLOWED_STATUSES.has(safe) ? safe : '';
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const auth = await isAdminAuthorized(req);
  if (!auth.ok) return res.status(auth.status).json({ error: auth.reason });

  const body = parseJsonBody(req);
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  const id = String(body.id || '').trim();
  const action = normalizeAction(body.action);

  if (!id) return res.status(400).json({ error: 'id is required' });
  if (!action) return res.status(400).json({ error: 'action is required' });

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

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  try {
    if (action === 'delete') {
      const { error } = await supabase.from('news_posts').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true, action: 'delete', id });
    }

    if (action === 'set_category') {
      const category = normalizeCategory(body.category);
      if (!category) return res.status(400).json({ error: 'category is invalid' });

      const { data, error } = await supabase
        .from('news_posts')
        .update({ category })
        .eq('id', id)
        .select('*')
        .maybeSingle();

      if (error) throw error;
      if (!data) return res.status(404).json({ error: 'Record not found' });
      return res.status(200).json({ ok: true, action: 'set_category', data });
    }

    if (action === 'set_status') {
      const status = normalizeStatus(body.status);
      if (!status) return res.status(400).json({ error: 'status is invalid' });

      const updateData =
        status === 'published'
          ? { status, published_at: new Date().toISOString() }
          : { status, published_at: null };

      const { data, error } = await supabase
        .from('news_posts')
        .update(updateData)
        .eq('id', id)
        .select('*')
        .maybeSingle();

      if (error) throw error;
      if (!data) return res.status(404).json({ error: 'Record not found' });
      return res.status(200).json({ ok: true, action: 'set_status', data });
    }

    return res.status(400).json({ error: 'Unsupported action' });
  } catch (error) {
    console.error('news-admin-action failed:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
