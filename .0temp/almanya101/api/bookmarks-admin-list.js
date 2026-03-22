// =========================================================
// FILE: /api/bookmarks-admin-list.js
// GET /api/bookmarks-admin-list?status=pending|approved|rejected&limit=200
// Requires: x-bookmarks-admin-key
// =========================================================

import { createClient } from '@supabase/supabase-js';
import { isAdminAuthorized } from './_devuser-admin.js';

function send(res, code, obj) {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(obj));
}

function mustEnv(res) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    send(res, 503, { error: "Supabase env missing" });
    return false;
  }
  return true;
}

export default async function handler(req, res) {
  if (req.method !== "GET") return send(res, 405, { error: "Method not allowed" });
  if (!mustEnv(res)) return;
  const auth = await isAdminAuthorized(req);
  if (!auth.ok) return send(res, auth.status, { error: auth.reason });

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const status = String(req.query.status || "pending").trim();
  const limitRaw = parseInt(String(req.query.limit || "200"), 10);
  const limit = Math.min(Math.max(isNaN(limitRaw) ? 200 : limitRaw, 1), 500);

  // Create Supabase client with service role key (admin access)
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    let query = supabase
      .from('bookmark_submissions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    // Filter by status if specified
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase query error:', error);
      return send(res, 500, { error: "Failed to fetch bookmarks", details: error.message });
    }

    return send(res, 200, { ok: true, items: data || [] });
  } catch (e) {
    console.error('List failed:', e);
    return send(res, 500, { error: e.message || "List failed" });
  }
}
