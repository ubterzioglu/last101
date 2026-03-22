// =========================================================
// FILE: /api/bookmarks-list.js
// PURPOSE: List approved bookmarks
// STORAGE: Supabase (bookmark_submissions table)
// =========================================================

import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return res.status(503).json({ error: "Service not configured" });
  }

  const limit = Math.min(parseInt(req.query.limit || "200", 10) || 200, 500);
  const status = req.query.status || 'approved'; // Default to approved only

  // Create Supabase client with anon key (public access)
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  try {
    const { data, error } = await supabase
      .from('bookmark_submissions')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Supabase query error:', error);
      return res.status(500).json({ error: "Failed to fetch bookmarks", details: error.message });
    }

    return res.status(200).json({ ok: true, items: data || [] });
  } catch (e) {
    console.error('List failed:', e);
    return res.status(500).json({ error: "List failed" });
  }
}
