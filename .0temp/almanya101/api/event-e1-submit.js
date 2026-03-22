import { createClient } from '@supabase/supabase-js';

const MAX_NAME_LENGTH = 80;
const ALLOWED_DATE_KEYS = new Set(['tarih1', 'tarih2', 'tarih3']);

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

function cleanName(value) {
  return String(value || '')
    .normalize('NFC')
    .replace(/\r?\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_NAME_LENGTH);
}

function getClientIp(req) {
  const forwarded = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  const realIp = String(req.headers['x-real-ip'] || '').trim();
  const remoteAddress = String(req.connection?.remoteAddress || '').trim();
  return forwarded || realIp || remoteAddress || '';
}

function normalizeDateChoices(value) {
  const source = Array.isArray(value) ? value : [value];
  const unique = new Set();

  for (const item of source) {
    const parts = String(item || '')
      .split(/[|,]/)
      .map((part) => part.trim().toLowerCase())
      .filter(Boolean);

    for (const part of parts) {
      if (ALLOWED_DATE_KEYS.has(part)) unique.add(part);
    }
  }

  return Array.from(unique).slice(0, 3);
}

function mapInsertError(error) {
  const message = String(error?.message || '').toLowerCase();
  if (message.includes('event_e1_date_votes') && message.includes('does not exist')) {
    return 'event_e1_date_votes tablosu bulunamadi. Supabase migration calistirin.';
  }
  return 'Failed to save vote';
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
  const fullName = cleanName(body.full_name);
  const selectedDates = normalizeDateChoices(body.selected_dates);

  if (!anonymous && !fullName) {
    return res.status(400).json({ error: 'Ad soyad zorunlu (anonim degilse).' });
  }
  if (!selectedDates.length) {
    return res.status(400).json({ error: 'En az bir tarih secimi zorunlu.' });
  }

  const normalizedFullName = anonymous ? null : cleanSingleLine(fullName, MAX_NAME_LENGTH);
  const ip = getClientIp(req);
  const ipHash = ip ? Buffer.from(ip).toString('base64').slice(0, 16) : null;
  const userAgent = String(req.headers['user-agent'] || '').slice(0, 255);
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    const { data, error } = await supabase
      .from('event_e1_date_votes')
      .insert([
        {
          full_name: normalizedFullName,
          anonymous,
          selected_dates: selectedDates,
          ip_hash: ipHash,
          user_agent: userAgent,
        },
      ])
      .select('id')
      .single();

    if (error) {
      console.error('event-e1-submit insert failed:', error);
      return res.status(500).json({ error: mapInsertError(error) });
    }

    return res.status(200).json({ ok: true, id: data?.id || null });
  } catch (error) {
    console.error('event-e1-submit failed:', error);
    return res.status(500).json({ error: 'Submit failed' });
  }
}
