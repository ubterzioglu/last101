import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const ADMIN_KEYS_TABLE = 'admin_api_keys';
const ADMIN_RATE_LIMIT_MAX_ATTEMPTS = 12;
const ADMIN_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const ADMIN_RATE_LIMIT_BLOCK_MS = 30 * 60 * 1000; // 30 minutes
const DEFAULT_KEY_HASH_ITERATIONS = 210000;
const adminAttemptStore = new Map();

function normalizeEnvValue(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
    return raw.slice(1, -1).trim();
  }
  return raw;
}

function nowMs() {
  return Date.now();
}

function cleanupRateLimitStore() {
  const now = nowMs();
  for (const [bucketKey, bucket] of adminAttemptStore.entries()) {
    const expiredWindow = bucket.windowStartedAt + ADMIN_RATE_LIMIT_WINDOW_MS < now;
    const expiredBlock = !bucket.blockedUntil || bucket.blockedUntil < now;
    if (expiredWindow && expiredBlock) {
      adminAttemptStore.delete(bucketKey);
    }
  }
}

function getClientIp(req) {
  const xff = req.headers['x-forwarded-for'];
  if (typeof xff === 'string' && xff.trim()) {
    return xff.split(',')[0].trim();
  }

  const xrip = req.headers['x-real-ip'];
  if (typeof xrip === 'string' && xrip.trim()) {
    return xrip.trim();
  }

  return 'unknown';
}

function getRateLimitBucketKey(req) {
  return `${getClientIp(req)}:${String(req.url || '').slice(0, 120)}`;
}

function checkAndConsumeAttempt(req) {
  cleanupRateLimitStore();

  const key = getRateLimitBucketKey(req);
  const now = nowMs();
  const current = adminAttemptStore.get(key);

  if (current && current.blockedUntil && current.blockedUntil > now) {
    return { allowed: false, retryAfterSeconds: Math.ceil((current.blockedUntil - now) / 1000) };
  }

  if (!current || current.windowStartedAt + ADMIN_RATE_LIMIT_WINDOW_MS < now) {
    adminAttemptStore.set(key, {
      attempts: 0,
      windowStartedAt: now,
      blockedUntil: 0,
    });
  }

  return { allowed: true, retryAfterSeconds: 0 };
}

function registerFailedAttempt(req) {
  const key = getRateLimitBucketKey(req);
  const now = nowMs();
  const bucket = adminAttemptStore.get(key) || {
    attempts: 0,
    windowStartedAt: now,
    blockedUntil: 0,
  };

  if (bucket.windowStartedAt + ADMIN_RATE_LIMIT_WINDOW_MS < now) {
    bucket.attempts = 0;
    bucket.windowStartedAt = now;
    bucket.blockedUntil = 0;
  }

  bucket.attempts += 1;
  if (bucket.attempts >= ADMIN_RATE_LIMIT_MAX_ATTEMPTS) {
    bucket.blockedUntil = now + ADMIN_RATE_LIMIT_BLOCK_MS;
  }

  adminAttemptStore.set(key, bucket);
}

function resetAttempts(req) {
  const key = getRateLimitBucketKey(req);
  adminAttemptStore.delete(key);
}

function pbkdf2Hex(value, salt, iterations) {
  const safeIterations = Number.isFinite(iterations) && iterations > 1000 ? iterations : DEFAULT_KEY_HASH_ITERATIONS;
  return crypto.pbkdf2Sync(value, salt, safeIterations, 32, 'sha256').toString('hex');
}

function timingSafeEqualHex(leftHex, rightHex) {
  if (typeof leftHex !== 'string' || typeof rightHex !== 'string') return false;
  if (!leftHex || !rightHex) return false;

  const left = Buffer.from(leftHex, 'hex');
  const right = Buffer.from(rightHex, 'hex');
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

function timingSafeEqualText(leftText, rightText) {
  if (typeof leftText !== 'string' || typeof rightText !== 'string') return false;
  if (!leftText || !rightText) return false;

  const left = Buffer.from(leftText, 'utf8');
  const right = Buffer.from(rightText, 'utf8');
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

function normalizeProvidedAdminKey(req) {
  const headerKey = req.headers['x-admin-key'];
  const bookmarksHeader = req.headers['x-bookmarks-admin-key'];
  const legacyPasswordHeader = req.headers['x-admin-password'];
  const legacyTokenHeader = req.headers['x-admin-token'];
  const authHeader = req.headers.authorization || '';
  const bearer = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  return (headerKey || bookmarksHeader || legacyPasswordHeader || legacyTokenHeader || bearer || '').toString().trim();
}

async function fetchActiveAdminKeys(supabase) {
  const now = Date.now();
  const { data, error } = await supabase
    .from(ADMIN_KEYS_TABLE)
    .select('*')
    .limit(500);

  if (error) return { data: null, error };

  const rows = Array.isArray(data) ? data : [];
  const filtered = rows.filter((row) => {
    const isActive = row?.is_active !== false;
    if (!isActive) return false;

    const expiresAtRaw = row?.expires_at;
    if (!expiresAtRaw) return true;
    const expiresAtMs = Date.parse(String(expiresAtRaw));
    if (!Number.isFinite(expiresAtMs)) return true;
    return expiresAtMs > now;
  });

  return { data: filtered, error: null };
}

export async function isAdminAuthorized(req) {
  const rateLimit = checkAndConsumeAttempt(req);
  if (!rateLimit.allowed) {
    return {
      ok: false,
      reason: 'Too many failed admin login attempts',
      status: 429,
      retryAfterSeconds: rateLimit.retryAfterSeconds,
    };
  }

  const providedKey = normalizeProvidedAdminKey(req);
  if (!providedKey) {
    registerFailedAttempt(req);
    return { ok: false, reason: 'Unauthorized', status: 401 };
  }

  // Optional simple mode: single admin password from environment variable.
  const envAdminPassword = normalizeEnvValue(
    process.env.ADMIN_PANEL_PASSWORD ||
    process.env.ADMIN_DASHBOARD_PASSWORD ||
    process.env.ADMIN_KEY ||
    ''
  );
  if (envAdminPassword) {
    if (timingSafeEqualText(providedKey, envAdminPassword)) {
      resetAttempts(req);
      return { ok: true, reason: '', status: 200 };
    }
    registerFailedAttempt(req);
    return { ok: false, reason: 'Unauthorized', status: 401 };
  }

  const supabaseUrl = normalizeEnvValue(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL);
  const serviceRoleKey = normalizeEnvValue(
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    ''
  );
  if (!supabaseUrl || !serviceRoleKey) {
    return { ok: false, reason: 'Service not configured', status: 503 };
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: keyRows, error } = await fetchActiveAdminKeys(supabase);
  if (error) {
    const errorMessage = String(error?.message || '').toLowerCase();
    if (
      errorMessage.includes('invalid api key') ||
      errorMessage.includes('unregistered api key') ||
      errorMessage.includes('no api key found')
    ) {
      return { ok: false, reason: 'Supabase service key is invalid', status: 503 };
    }
    if (errorMessage.includes('admin_api_keys') && errorMessage.includes('does not exist')) {
      return { ok: false, reason: 'Admin auth table not configured', status: 503 };
    }
    return { ok: false, reason: 'Admin auth check failed', status: 500 };
  }

  if (!keyRows || keyRows.length === 0) {
    return { ok: false, reason: 'Admin auth table has no active key', status: 503 };
  }

  for (const row of keyRows) {
    const salt = String(row?.key_salt || '').trim();
    const expectedHash = String(row?.key_hash || '').trim().toLowerCase();
    const iterations = Number.parseInt(String(row?.hash_iterations || ''), 10);
    if (!salt || !expectedHash) continue;

    const computedHash = pbkdf2Hex(providedKey, salt, iterations).toLowerCase();
    if (timingSafeEqualHex(computedHash, expectedHash)) {
      resetAttempts(req);
      if (row?.id) {
        await supabase
          .from(ADMIN_KEYS_TABLE)
          .update({ last_used_at: new Date().toISOString() })
          .eq('id', row.id);
      }
      return { ok: true, reason: '', status: 200 };
    }
  }

  registerFailedAttempt(req);
  return { ok: false, reason: 'Unauthorized', status: 401 };
}

export function parseJsonBody(req) {
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
