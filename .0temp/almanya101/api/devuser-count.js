// =========================================================
// FILE: /api/devuser-count.js
// PURPOSE: Public total count for DevUser registrations
// =========================================================

import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const SUPABASE_URL = String(process.env.SUPABASE_URL || '').trim();
  const SUPABASE_SERVICE_ROLE_KEY = String(process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('devuser-count missing env config', {
      hasSupabaseUrl: Boolean(SUPABASE_URL),
      hasServiceRoleKey: Boolean(SUPABASE_SERVICE_ROLE_KEY),
    });
    return res.status(503).json({ error: 'Service not configured' });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { count, error } = await supabase
      .from('devuser')
      .select('id', { count: 'exact', head: true });

    if (error) {
      throw error;
    }

    res.setHeader('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=300');
    return res.status(200).json({ count: Number(count || 0) });
  } catch (error) {
    console.error('devuser-count failed:', error);
    return res.status(500).json({ error: 'Count unavailable' });
  }
}

