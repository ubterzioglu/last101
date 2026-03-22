// =========================================================
// FILE: /api/bookmarks-admin-action.js
// PURPOSE:
// - GET list: bookmarks by status
// - POST actions: approve/reject/restore
// - Requires admin key for POST (x-bookmarks-admin-key)
// STORAGE: Supabase (bookmark_submissions table)
// =========================================================

import { createClient } from '@supabase/supabase-js';
import { isAdminAuthorized } from './_devuser-admin.js';

function ok(res, code, body) {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

function mustSupabase(res) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    ok(res, 503, { error: "Supabase not configured" });
    return false;
  }
  return true;
}

export default async function handler(req, res) {
  if (!mustSupabase(res)) return;

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // ---------------- GET: list ----------------
  if (req.method === "GET") {
    const auth = await isAdminAuthorized(req);
    if (!auth.ok) return ok(res, auth.status, { error: auth.reason });

    const fn = String(req.query.fn || "").trim();
    if (fn !== "list") return ok(res, 400, { error: "Invalid fn" });

    const status = String(req.query.status || "pending").trim(); // pending, approved, rejected
    const limit = Math.min(parseInt(req.query.limit || "200", 10) || 200, 500);

    try {
      let query = supabase
        .from('bookmark_submissions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Supabase query error:', error);
        return ok(res, 500, { error: "Failed to fetch bookmarks", details: error.message });
      }

      return ok(res, 200, { ok: true, items: data || [] });
    } catch (e) {
      return ok(res, 500, { error: e.message || "list failed" });
    }
  }

  // ---------------- POST: actions ----------------
  if (req.method === "POST") {
    const auth = await isAdminAuthorized(req);
    if (!auth.ok) return ok(res, auth.status, { error: auth.reason });

    let body = {};
    try {
      body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    } catch {
      return ok(res, 400, { error: "Invalid JSON" });
    }

    const fn = String(body.fn || "").trim();
    const id = String(body.id || "").trim();
    const adminNotes = body.admin_notes ? String(body.admin_notes).trim() : null;

    if (!id) return ok(res, 400, { error: "Missing id" });

    try {
      let newStatus;
      
      if (fn === "approve" || fn === "move") {
        newStatus = "approved";
      } else if (fn === "reject") {
        newStatus = "rejected";
      } else if (fn === "restore") {
        newStatus = "pending";
      } else {
        return ok(res, 400, { error: "Invalid fn. Use: approve, reject, or restore" });
      }

      const updateData = {
        status: newStatus,
        updated_at: new Date().toISOString()
      };

      if (adminNotes) {
        updateData.admin_notes = adminNotes;
      }

      const { data, error } = await supabase
        .from('bookmark_submissions')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase update error:', error);
        return ok(res, 500, { error: "Failed to update bookmark", details: error.message });
      }

      if (!data) {
        return ok(res, 404, { error: "Bookmark not found" });
      }

      return ok(res, 200, { ok: true, item: data });
    } catch (e) {
      return ok(res, 500, { error: e.message || "action failed" });
    }
  }

  return ok(res, 405, { error: "Method not allowed" });
}
