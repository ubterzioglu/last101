// =========================================================
// FILE: /api/_supabase-user.js
// PURPOSE: Verify Supabase access tokens on server-side
// =========================================================

const REVOKED_PUBLIC_KEYS = new Set([
  'sb_publishable_vBFFGmqZ3eKr5oqm_dbfMA_5euLMj2x',
]);

let cachedWorkingKey = '';

function readBearerToken(req) {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) return null;
  return authHeader.slice(7).trim();
}

function normalize(value) {
  return String(value || '').trim();
}

function getSupabaseAuthConfig() {
  const supabaseUrl = normalize(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL);
  const orderedCandidates = [
    // Prefer server-only keys first to avoid publishable-key mismatch after key rotation.
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    process.env.SUPABASE_SERVICE_KEY,
    process.env.SUPABASE_ANON_KEY,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
    process.env.SUPABASE_PUBLISHABLE_KEY,
  ];

  const keys = Array.from(
    new Set(
      orderedCandidates
        .map(normalize)
        .filter((key) => key && !REVOKED_PUBLIC_KEYS.has(key))
    )
  );

  if (!supabaseUrl || keys.length === 0) return null;
  return { supabaseUrl, keys };
}

async function fetchUserWithKey({ supabaseUrl, token, apiKey }) {
  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    method: 'GET',
    headers: {
      apikey: apiKey,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) return null;
  const user = await response.json().catch(() => null);
  if (!user || !user.id || !user.email) return null;
  return { token, user };
}

export async function getSupabaseUserFromRequest(req) {
  const token = readBearerToken(req);
  if (!token) return null;

  const cfg = getSupabaseAuthConfig();
  if (!cfg) return null;

  try {
    if (cachedWorkingKey && cfg.keys.includes(cachedWorkingKey)) {
      const cachedResult = await fetchUserWithKey({
        supabaseUrl: cfg.supabaseUrl,
        token,
        apiKey: cachedWorkingKey,
      });
      if (cachedResult) return cachedResult;
    }

    for (const key of cfg.keys) {
      if (!key || key === cachedWorkingKey) continue;
      const result = await fetchUserWithKey({
        supabaseUrl: cfg.supabaseUrl,
        token,
        apiKey: key,
      });
      if (result) {
        cachedWorkingKey = key;
        return result;
      }
    }

    return null;
  } catch {
    return null;
  }
}
