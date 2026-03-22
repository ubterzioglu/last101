// =========================================================
// FILE: /api/devuser-me.js
// PURPOSE: Read authenticated devuser profile (admin-only updates)
// =========================================================

import { getSupabaseUserFromRequest } from './_supabase-user.js';

const ALLOWED_ORIGINS = new Set([
  'https://almanya101.de',
  'https://www.almanya101.de',
  'http://localhost:3000',
  'http://localhost:5173',
]);

function normalizeOrigin(origin) {
  if (!origin || typeof origin !== 'string') return null;
  try {
    const parsed = new URL(origin);
    return `${parsed.protocol}//${parsed.host}`.toLowerCase();
  } catch {
    return null;
  }
}

function getSupabaseHeaders(serviceRoleKey) {
  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    'Content-Type': 'application/json',
  };
}

function stripSensitive(row) {
  if (!row || typeof row !== 'object') return null;
  const { login_pin_hash, login_pin_salt, ...safe } = row;
  return safe;
}

async function fetchRowByUserId({ supabaseUrl, headers, userId }) {
  const url = new URL(`${supabaseUrl}/rest/v1/devuser`);
  url.searchParams.set('select', '*');
  url.searchParams.set('user_id', `eq.${userId}`);
  url.searchParams.set('limit', '1');

  const response = await fetch(url.toString(), { method: 'GET', headers });
  if (!response.ok) return null;

  const rows = await response.json().catch(() => []);
  return Array.isArray(rows) && rows[0] ? rows[0] : null;
}

async function fetchRowByLoginEmail({ supabaseUrl, headers, email }) {
  const url = new URL(`${supabaseUrl}/rest/v1/devuser`);
  url.searchParams.set('select', '*');
  url.searchParams.set('login_email', `eq.${email}`);
  url.searchParams.set('limit', '1');

  const response = await fetch(url.toString(), { method: 'GET', headers });
  if (!response.ok) return null;

  const rows = await response.json().catch(() => []);
  return Array.isArray(rows) && rows[0] ? rows[0] : null;
}

async function patchRow({ supabaseUrl, headers, id, data }) {
  const url = new URL(`${supabaseUrl}/rest/v1/devuser`);
  url.searchParams.set('id', `eq.${id}`);
  url.searchParams.set('select', '*');

  const response = await fetch(url.toString(), {
    method: 'PATCH',
    headers: {
      ...headers,
      Prefer: 'return=representation',
    },
    body: JSON.stringify(data),
  });

  const rows = await response.json().catch(() => []);
  return { ok: response.ok, status: response.status, rows };
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const origin = normalizeOrigin(req.headers.origin || req.headers.referer || null);
  if (origin && !ALLOWED_ORIGINS.has(origin)) {
    return res.status(403).json({ error: 'Unauthorized origin' });
  }

  const auth = await getSupabaseUserFromRequest(req);
  if (!auth) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(503).json({ error: 'Service not configured' });
  }

  const headers = getSupabaseHeaders(SUPABASE_SERVICE_ROLE_KEY);

  try {
    let currentRow = await fetchRowByUserId({
      supabaseUrl: SUPABASE_URL,
      headers,
      userId: auth.user.id,
    });

    if (!currentRow) {
      const byEmail = await fetchRowByLoginEmail({
        supabaseUrl: SUPABASE_URL,
        headers,
        email: (auth.user.email || '').toLowerCase(),
      });

      if (byEmail) {
        const claimResult = await patchRow({
          supabaseUrl: SUPABASE_URL,
          headers,
          id: byEmail.id,
          data: {
            user_id: auth.user.id,
            login_email: (auth.user.email || '').toLowerCase(),
          },
        });

        if (claimResult.ok && Array.isArray(claimResult.rows) && claimResult.rows[0]) {
          currentRow = claimResult.rows[0];
        }
      }
    }

    if (!currentRow) {
      return res.status(404).json({ error: 'Profile not found. Lutfen once kayit formunu doldurun.' });
    }

    return res.status(200).json({ data: stripSensitive(currentRow) });
  } catch (error) {
    console.error('devuser-me failed:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
