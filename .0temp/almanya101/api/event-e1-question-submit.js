import { createClient } from '@supabase/supabase-js';

const MAX_QUESTION_LENGTH = 500;
const MIN_QUESTION_LENGTH = 3;

function readBody(req) {
  if (!req.body) return {};
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return null;
    }
  }
  return req.body;
}

function cleanQuestion(value) {
  return String(value || '')
    .normalize('NFC')
    .replace(/\r\n/g, '\n')
    .trim()
    .slice(0, MAX_QUESTION_LENGTH);
}

function getClientIp(req) {
  const forwarded = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  const realIp = String(req.headers['x-real-ip'] || '').trim();
  const remoteAddress = String(req.connection?.remoteAddress || '').trim();
  return forwarded || realIp || remoteAddress || '';
}

function mapInsertError(error) {
  const message = String(error?.message || '').toLowerCase();
  if (message.includes('event_e1_questions') && message.includes('does not exist')) {
    return 'event_e1_questions tablosu bulunamadi. Supabase migration calistirin.';
  }
  return 'Failed to save question';
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(503).json({ error: 'Service not configured' });
  }

  const body = readBody(req);
  if (body === null) {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  if (body.website || body.email) {
    return res.status(400).json({ error: 'Nope.' });
  }

  const question = cleanQuestion(body.question);
  if (!question) {
    return res.status(400).json({ error: 'Soru zorunlu.' });
  }
  if (question.length < MIN_QUESTION_LENGTH) {
    return res.status(400).json({ error: `Soru cok kisa (min ${MIN_QUESTION_LENGTH} karakter).` });
  }

  const ip = getClientIp(req);
  const ipHash = ip ? Buffer.from(ip).toString('base64').slice(0, 16) : null;
  const userAgent = String(req.headers['user-agent'] || '').slice(0, 255);
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    const { data, error } = await supabase
      .from('event_e1_questions')
      .insert([
        {
          question,
          ip_hash: ipHash,
          user_agent: userAgent,
        },
      ])
      .select('id, question, created_at')
      .single();

    if (error) {
      console.error('event-e1-question-submit insert failed:', error);
      return res.status(500).json({ error: mapInsertError(error) });
    }

    return res.status(200).json({ ok: true, item: data || null });
  } catch (error) {
    console.error('event-e1-question-submit failed:', error);
    return res.status(500).json({ error: 'Submit failed' });
  }
}
