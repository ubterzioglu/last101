import { createClient } from '@supabase/supabase-js';

const ALLOWED_ORIGINS = new Set([
  'https://almanya101.de',
  'https://www.almanya101.de',
  'http://localhost:3000',
  'http://localhost:5173',
]);

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 10;
const rateLimitStore = new Map();

function normalizeOrigin(origin) {
  if (!origin || typeof origin !== 'string') return null;
  try {
    const parsed = new URL(origin);
    return `${parsed.protocol}//${parsed.host}`.toLowerCase();
  } catch {
    return null;
  }
}

function isAllowedOrigin(origin) {
  if (!origin) return true;
  if (ALLOWED_ORIGINS.has(origin)) return true;
  return origin.startsWith('https://') && origin.endsWith('.vercel.app');
}

function getClientIp(req) {
  const xff = req.headers['x-forwarded-for'];
  if (typeof xff === 'string' && xff.trim()) return xff.split(',')[0].trim();

  const xrip = req.headers['x-real-ip'];
  if (typeof xrip === 'string' && xrip.trim()) return xrip.trim();

  return 'unknown';
}

function checkRateLimit(req) {
  const now = Date.now();
  const key = `meeting-survey:${getClientIp(req)}`;
  const current = rateLimitStore.get(key);

  if (!current || now - current.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitStore.set(key, { windowStart: now, count: 1 });
    return { ok: true, retryAfterSeconds: 0 };
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    const retryAfterMs = RATE_LIMIT_WINDOW_MS - (now - current.windowStart);
    return { ok: false, retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000)) };
  }

  current.count += 1;
  rateLimitStore.set(key, current);
  return { ok: true, retryAfterSeconds: 0 };
}

function parseBody(req) {
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return null;
    }
  }
  if (req.body && typeof req.body === 'object' && !Array.isArray(req.body)) {
    return req.body;
  }
  return null;
}

function toBoolean(value, fallback = false) {
  if (typeof value === 'boolean') return value;
  if (value === 'true') return true;
  if (value === 'false') return false;
  return fallback;
}

function sanitizeArray(value, maxItems = 10) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => typeof item === 'string')
    .map((item) => item.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim())
    .filter(Boolean)
    .slice(0, maxItems);
}

function sanitizeName(value) {
  if (typeof value !== 'string') return '';
  return value.replace(/[\x00-\x1F\x7F]/g, '').trim().slice(0, 120);
}

function sanitizeWhatsapp(value) {
  if (typeof value !== 'string') return '';
  return value.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim().slice(0, 32);
}

function setCorsHeaders(req, res) {
  const origin = normalizeOrigin(req.headers.origin);
  if (origin && isAllowedOrigin(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req, res) {
  setCorsHeaders(req, res);

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const origin = normalizeOrigin(req.headers.origin);
  if (!isAllowedOrigin(origin)) {
    return res.status(403).json({ error: 'Origin not allowed' });
  }

  const rateLimit = checkRateLimit(req);
  if (!rateLimit.ok) {
    res.setHeader('Retry-After', String(rateLimit.retryAfterSeconds));
    return res.status(429).json({ error: 'Too many requests' });
  }

  const body = parseBody(req);
  if (!body) return res.status(400).json({ error: 'Invalid JSON body' });

  const fullName = sanitizeName(body.full_name);
  if (!fullName) {
    return res.status(400).json({ error: 'Ad soyad gerekli' });
  }

  const whatsapp = sanitizeWhatsapp(body.whatsapp);
  if (!whatsapp) {
    return res.status(400).json({ error: 'WhatsApp numarasi gerekli' });
  }

  const wantsMeeting = toBoolean(body.wants_meeting, false);
  const availableDates = sanitizeArray(body.available_dates, 10);

  if (wantsMeeting && availableDates.length === 0) {
    return res.status(400).json({ error: 'Tarih secimi gerekli' });
  }

  const supabaseUrl = String(process.env.SUPABASE_URL || '').trim();
  const serviceRoleKey = String(process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(503).json({ error: 'Service not configured' });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  try {
    const { data, error } = await supabase
      .from('meeting_surveys')
      .insert([{
        full_name: fullName,
        whatsapp: whatsapp,
        wants_meeting: wantsMeeting,
        available_dates: wantsMeeting ? availableDates : []
      }])
      .select('id')
      .single();

    if (error) throw error;
    return res.status(201).json({ ok: true, id: data?.id || null });
  } catch (error) {
    console.error('meeting-survey-submit failed:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
