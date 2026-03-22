import { createClient } from '@supabase/supabase-js';

const MARKER = '[DEVUSER_DIS_V1]';
const MAX_NAME_LENGTH = 80;
const MAX_TOPIC_LENGTH = 250;
const MIN_TOPIC_LENGTH = 3;

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

function asBoolean(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    return normalized === 'true' || normalized === '1' || normalized === 'yes';
  }
  return false;
}

function cleanSingleLine(value, maxLength) {
  return String(value || '')
    .normalize('NFC')
    .replace(/\r?\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function cleanTopic(value) {
  return String(value || '')
    .normalize('NFC')
    .replace(/\r\n/g, '\n')
    .trim()
    .slice(0, MAX_TOPIC_LENGTH);
}

function buildMessage({ topic, fullName, anonymous }) {
  return [
    MARKER,
    `anonim:${anonymous ? '1' : '0'}`,
    `ad_soyad:${anonymous ? '' : fullName}`,
    'konu:',
    topic,
  ].join('\n');
}

function getClientIp(req) {
  const forwarded = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  const realIp = String(req.headers['x-real-ip'] || '').trim();
  const remoteAddress = String(req.connection?.remoteAddress || '').trim();
  return forwarded || realIp || remoteAddress || '';
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

  const anonymous = asBoolean(body.anonymous);
  const fullName = cleanSingleLine(body.full_name, MAX_NAME_LENGTH);
  const topic = cleanTopic(body.topic);

  if (!anonymous && !fullName) {
    return res.status(400).json({ error: 'Ad soyad zorunlu (anonim degilse).' });
  }

  if (!topic) {
    return res.status(400).json({ error: 'Konu zorunlu.' });
  }

  if (topic.length < MIN_TOPIC_LENGTH) {
    return res.status(400).json({ error: `Konu cok kisa (min ${MIN_TOPIC_LENGTH} karakter).` });
  }

  const message = buildMessage({ topic, fullName, anonymous });
  const ip = getClientIp(req);
  const ipHash = ip ? Buffer.from(ip).toString('base64').slice(0, 16) : null;
  const userAgent = String(req.headers['user-agent'] || '').slice(0, 255);

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    const { data, error } = await supabase
      .from('feedback_submissions')
      .insert([
        {
          message,
          ip_hash: ipHash,
          user_agent: userAgent,
          status: 'pending',
        },
      ])
      .select('id')
      .single();

    if (error) {
      console.error('devuser-dis-submit insert failed:', error);
      return res.status(500).json({ error: 'Failed to save topic' });
    }

    return res.status(200).json({ ok: true, id: data?.id || null });
  } catch (error) {
    console.error('devuser-dis-submit failed:', error);
    return res.status(500).json({ error: 'Submit failed' });
  }
}
