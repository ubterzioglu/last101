// =========================================================
// FILE: /api/cs-answer-submit.js
// PURPOSE: Receive anonymous answers/comments
// STORAGE: Supabase (cs_answers table)
// =========================================================

import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

function getIp(req) {
  return (
    req.headers['x-forwarded-for'] ||
    req.headers['x-real-ip'] ||
    req.connection?.remoteAddress ||
    ''
  );
}

function hashIp(ip) {
  if (!ip) return null;
  const salt = process.env.IP_HASH_SALT || '';
  return crypto.createHash('sha256').update(String(ip) + salt).digest('hex').slice(0, 16);
}

function stripTags(text) {
  return String(text || '').replace(/<[^>]*>/g, '');
}

export default async function handler(req, res) {
  // CORS
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(503).json({ error: 'Submissions not configured (missing Supabase env vars).' });
  }

  let body = {};
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  // Honeypot
  if (body.website || body.email) {
    return res.status(400).json({ error: 'Nope.' });
  }

  const questionId = parseInt(body.question_id, 10);
  if (!questionId || Number.isNaN(questionId)) {
    return res.status(400).json({ error: 'Invalid question id.' });
  }

  const message = stripTags(body.message || '').trim();
  if (!message) return res.status(400).json({ error: 'Message is required.' });
  if (message.length < 3) return res.status(400).json({ error: 'Message too short (min 3 characters).' });
  if (message.length > 1000) return res.status(400).json({ error: 'Message too long (max 1000 characters).' });

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const ip = getIp(req);
  const item = {
    question_id: questionId,
    message,
    ip_hash: hashIp(ip),
    user_agent: String(req.headers['user-agent'] || '').slice(0, 255),
    status: 'approved'
  };

  try {
    const { data, error } = await supabase
      .from('cs_answers')
      .insert([item])
      .select('id')
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: 'Failed to save answer', details: error.message });
    }

    // Increment answer count (best effort, non-atomic)
    const { data: qRow } = await supabase
      .from('cs_questions')
      .select('answer_count')
      .eq('id', questionId)
      .single();
    if (qRow && typeof qRow.answer_count === 'number') {
      await supabase
        .from('cs_questions')
        .update({ answer_count: qRow.answer_count + 1 })
        .eq('id', questionId);
    }

    return res.status(200).json({ ok: true, id: data.id });
  } catch (e) {
    console.error('Submit failed:', e);
    return res.status(500).json({ error: 'Submit failed' });
  }
}
