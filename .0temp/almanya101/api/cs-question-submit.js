// =========================================================
// FILE: /api/cs-question-submit.js
// PURPOSE: Receive anonymous questions
// STORAGE: Supabase (cs_questions table)
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
  console.log('cs-question-submit request:', { method: req.method, hasBody: !!req.body });
  
  // CORS
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  console.log('Environment check:', {
    hasSupabaseUrl: !!SUPABASE_URL,
    hasSupabaseKey: !!SUPABASE_SERVICE_ROLE_KEY
  });

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing Supabase environment variables');
    return res.status(503).json({ error: 'Submissions not configured (missing Supabase env vars).' });
  }

  let body = {};
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    console.log('Parsed body:', { question: body.question?.slice(0, 50) + '...' });
  } catch (parseError) {
    console.error('JSON parse error:', parseError);
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  // Honeypot
  if (body.website || body.email) {
    return res.status(400).json({ error: 'Nope.' });
  }

  const question = stripTags(body.question || '').trim();
  if (!question) return res.status(400).json({ error: 'Question is required.' });
  if (question.length < 10) return res.status(400).json({ error: 'Question too short (min 10 characters).' });
  if (question.length > 1000) return res.status(400).json({ error: 'Question too long (max 1000 characters).' });

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const ip = getIp(req);
  const item = {
    question,
    ip_hash: hashIp(ip),
    user_agent: String(req.headers['user-agent'] || '').slice(0, 255),
    status: 'approved'
  };

  try {
    console.log('Inserting question:', { questionLength: question.length, hasIpHash: !!item.ip_hash });
    const { data, error } = await supabase
      .from('cs_questions')
      .insert([item])
      .select('id')
      .single();

    if (error) {
      console.error('Supabase insert error:', { message: error.message, code: error.code, details: error.details });
      return res.status(500).json({ error: 'Failed to save question', details: error.message });
    }

    console.log('Question inserted successfully with ID:', data.id);
    return res.status(200).json({ ok: true, id: data.id });
  } catch (e) {
    console.error('Submit failed:', e);
    return res.status(500).json({ error: 'Submit failed', details: e.message });
  }
}
