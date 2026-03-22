// =========================================================
// FILE: /api/bookmarks-submit.js
// PURPOSE: Submit user bookmarks
// STORAGE: Supabase (bookmark_submissions table)
// =========================================================

import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // CORS basic (same-origin default; keep it simple)
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(503).json({ error: "Service not configured" });
  }

  let body = {};
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
  } catch {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  const title = String(body.title || "").trim().slice(0, 140);
  const url = String(body.url || "").trim().slice(0, 500);
  const note = String(body.note || "").trim().slice(0, 800);
  const category = String(body.category || "tools").trim().slice(0, 60);
  const img = String(body.img || "").trim().slice(0, 500);

  if (!title || !url) {
    return res.status(400).json({ error: "Title and URL are required." });
  }
  if (!/^https?:\/\//i.test(url)) {
    return res.status(400).json({ error: "URL must start with http:// or https:// (client adds https:// automatically)." });
  }

  // simple bot trap (optional)
  if (body.website) {
    return res.status(400).json({ error: "Nope." });
  }

  // Create Supabase client
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // Get IP and user agent
  const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.connection?.remoteAddress || '';
  const userAgent = req.headers['user-agent'] || '';
  const ipHash = ip ? Buffer.from(ip).toString('base64').slice(0, 16) : null;

  const item = {
    title,
    url,
    description: note || null,
    category,
    submitted_by: null,
    ip_hash: ipHash,
    user_agent: userAgent.slice(0, 255),
    status: 'pending'
  };

  try {
    const { data, error } = await supabase
      .from('bookmark_submissions')
      .insert([item])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: "Failed to save bookmark", details: error.message });
    }

    return res.status(200).json({ ok: true, id: data.id });
  } catch (e) {
    console.error('Submit failed:', e);
    return res.status(500).json({ error: "Submit failed" });
  }
}
