// =========================================================
// FILE: /api/supabase-config.js
// PURPOSE: Serve Supabase config to frontend securely
// NOTE: Anon key is safe to expose, this just centralizes config
// =========================================================

const CONFIG_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
};
const KEY_PROBE_CACHE_TTL_MS = 5 * 60 * 1000;
let keyProbeCache = {
  url: '',
  key: '',
  expiresAt: 0,
};

function normalizeKey(value) {
  return String(value || '').trim();
}

async function isWorkingPublishableKey(supabaseUrl, publishableKey) {
  if (!supabaseUrl || !publishableKey) return false;

  try {
    const response = await fetch(`${supabaseUrl}/auth/v1/settings`, {
      method: 'GET',
      headers: {
        apikey: publishableKey,
      },
    });

    if (response.status === 401 || response.status === 403) {
      return false;
    }

    return response.ok || response.status === 429;
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  Object.entries(CONFIG_CACHE_HEADERS).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const origin = req.headers.origin || req.headers.referer || '';
  const allowedOrigins = [
    'https://almanya101.de',
    'https://www.almanya101.de',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ];

  const isAllowed = allowedOrigins.some((o) => origin.startsWith(o));
  const isProduction = process.env.VERCEL_ENV === 'production';
  if (isProduction && !isAllowed) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }

  const supabaseUrl = normalizeKey(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL);

  const revokedPublicKeys = new Set([
    'sb_publishable_vBFFGmqZ3eKr5oqm_dbfMA_5euLMj2x',
  ]);

  const rawCandidates = [
    process.env.SUPABASE_ANON_KEY,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
    process.env.SUPABASE_PUBLISHABLE_KEY,
    // Static fallback (publishable key) for bootstrap if env is incomplete.
    'sb_publishable_mqX5A9NdO66oM2GjvPJwNw_C7MhIDcI',
  ];

  const candidateKeys = Array.from(
    new Set(
      rawCandidates
        .map(normalizeKey)
        .filter((key) => key && !revokedPublicKeys.has(key))
    )
  );

  const now = Date.now();
  let supabaseAnonKey = null;
  const hasValidCache =
    keyProbeCache.url === supabaseUrl &&
    keyProbeCache.expiresAt > now &&
    candidateKeys.includes(keyProbeCache.key);

  if (hasValidCache) {
    supabaseAnonKey = keyProbeCache.key;
  } else {
    for (const key of candidateKeys) {
      // Pick first key that Supabase accepts. This avoids stale/revoked env vars.
      if (await isWorkingPublishableKey(supabaseUrl, key)) {
        supabaseAnonKey = key;
        break;
      }
    }
  }

  if (!supabaseAnonKey) {
    // Fallback if runtime connectivity check is temporarily unavailable.
    supabaseAnonKey = candidateKeys[0] || null;
  }

  if (supabaseAnonKey) {
    keyProbeCache = {
      url: supabaseUrl,
      key: supabaseAnonKey,
      expiresAt: now + KEY_PROBE_CACHE_TTL_MS,
    };
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    res.status(500).json({ error: 'Configuration missing' });
    return;
  }

  res.status(200).json({
    url: supabaseUrl,
    anonKey: supabaseAnonKey,
  });
}
