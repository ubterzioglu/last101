// =========================================================
// FILE: /api/dik-submit.js
// PURPOSE: Receive anonymous feedback (Dilek, Istek, Sikayet)
// STORAGE: Supabase (feedback_submissions table)
// =========================================================

import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // CORS
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(503).json({ error: "Submissions not configured (missing Supabase env vars)." });
  }

  let body = {};
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
  } catch {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  const message = String(body.message || "").trim().slice(0, 5000);

  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  if (message.length < 10) {
    return res.status(400).json({ error: "Message too short (min 10 characters)." });
  }

  // Simple bot trap (honeypot)
  if (body.website || body.email) {
    return res.status(400).json({ error: "Nope." });
  }

  // Create Supabase client
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // Get IP and user agent (optional)
  const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.connection?.remoteAddress || '';
  const userAgent = req.headers['user-agent'] || '';
  
  // Simple hash for IP (for privacy)
  const ipHash = ip ? Buffer.from(ip).toString('base64').slice(0, 16) : null;

  const item = {
    message,
    ip_hash: ipHash,
    user_agent: userAgent.slice(0, 255),
    status: 'pending'
  };

  try {
    const { data, error } = await supabase
      .from('feedback_submissions')
      .insert([item])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: "Failed to save feedback", details: error.message });
    }

    return res.status(200).json({ ok: true, id: data.id });
  } catch (e) {
    console.error('Submit failed:', e);
    return res.status(500).json({ error: "Submit failed" });
  }
}
