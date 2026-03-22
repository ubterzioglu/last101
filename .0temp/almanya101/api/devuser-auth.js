// =========================================================
// FILE: /api/devuser-auth.js
// PURPOSE: Authenticate devuser list access using email + 6-digit pin
// =========================================================

import {
  createSessionToken,
  isValidEmail,
  isValidPin,
  normalizeEmail,
  verifyPin,
} from './_devuser-auth.js';

const ALLOWED_ORIGINS = new Set([
  'https://almanya101.de',
  'https://www.almanya101.de',
  'http://localhost:3000',
  'http://localhost:5173',
]);

const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 10;

function normalizeOrigin(origin) {
  if (!origin || typeof origin !== 'string') return null;
  try {
    const parsed = new URL(origin);
    return `${parsed.protocol}//${parsed.host}`.toLowerCase();
  } catch {
    return null;
  }
}

function parseBody(req) {
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return null;
    }
  }
  if (req.body && typeof req.body === 'object') return req.body;
  return null;
}

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  const firstIp = typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : null;
  return firstIp || req.headers['x-real-ip'] || req.socket?.remoteAddress || 'unknown';
}

function checkRateLimit(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) return false;
  record.count += 1;
  return true;
}

function buildSupabaseHeaders(serviceRoleKey) {
  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    'Content-Type': 'application/json',
  };
}

async function getUserByEmail({ supabaseUrl, headers, email }) {
  const url = new URL(`${supabaseUrl}/rest/v1/devuser`);
  url.searchParams.set('select', 'id,ad_soyad,login_email,login_pin_hash,login_pin_salt');
  url.searchParams.set('login_email', `eq.${email}`);
  url.searchParams.set('limit', '1');

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json().catch(() => []);
  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }

  return data[0];
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const origin = normalizeOrigin(req.headers.origin || req.headers.referer || null);
  if (origin && !ALLOWED_ORIGINS.has(origin)) {
    return res.status(403).json({ error: 'Unauthorized origin' });
  }

  const ip = getClientIp(req);
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Too many attempts. Please retry later.' });
  }

  const body = parseBody(req);
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const email = normalizeEmail(body.email);
  const pin = typeof body.pin === 'string' ? body.pin.trim() : '';

  if (!isValidEmail(email) || !isValidPin(pin)) {
    return res.status(400).json({ error: 'Email or pin format is invalid' });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(503).json({ error: 'Service not configured' });
  }

  try {
    const headers = buildSupabaseHeaders(SUPABASE_SERVICE_ROLE_KEY);
    const user = await getUserByEmail({
      supabaseUrl: SUPABASE_URL,
      headers,
      email,
    });

    if (!user || !user.login_pin_hash || !user.login_pin_salt) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = verifyPin(pin, user.login_pin_salt, user.login_pin_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = createSessionToken({
      email,
      userId: user.id,
    });

    if (!token) {
      return res.status(503).json({ error: 'Auth secret is not configured' });
    }

    return res.status(200).json({
      ok: true,
      token,
      user: {
        id: user.id,
        email,
        name: user.ad_soyad || '',
      },
    });
  } catch (error) {
    console.error('devuser-auth failed:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
