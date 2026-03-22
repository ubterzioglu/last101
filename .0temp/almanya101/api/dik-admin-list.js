// =========================================================
// FILE: /api/dik-admin-list.js
// PURPOSE: List feedback submissions for admin panel
// AUTH: Central admin_api_keys table (via _devuser-admin helper)
// =========================================================

import { createClient } from '@supabase/supabase-js';
import { isAdminAuthorized } from './_devuser-admin.js';

export default async function handler(req, res) {
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const auth = await isAdminAuthorized(req);
  if (!auth.ok) {
    return res.status(auth.status).json({ error: auth.reason });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(503).json({ error: "Service not configured" });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const status = req.query.status || 'all';
  const limit = Math.min(parseInt(req.query.limit) || 100, 500);

  try {
    let query = supabase
      .from('feedback_submissions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase query error:', error);
      return res.status(500).json({ error: "Failed to fetch feedback", details: error.message });
    }

    return res.status(200).json({ ok: true, items: data || [], count: (data || []).length });
  } catch (e) {
    console.error('List failed:', e);
    return res.status(500).json({ error: "List failed" });
  }
}
