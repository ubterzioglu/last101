import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';

const ADMIN_KEYS_TABLE = 'admin_api_keys';
const ADMIN_RATE_LIMIT_MAX_ATTEMPTS = 12;
const ADMIN_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const ADMIN_RATE_LIMIT_BLOCK_MS = 30 * 60 * 1000;
const DEFAULT_KEY_HASH_ITERATIONS = 210000;

interface RateLimitBucket {
  attempts: number;
  windowStartedAt: number;
  blockedUntil: number;
}

const adminAttemptStore = new Map<string, RateLimitBucket>();

function normalizeEnvValue(value: string | undefined): string {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
    return raw.slice(1, -1).trim();
  }
  return raw;
}

function cleanupRateLimitStore() {
  const now = Date.now();
  for (const [key, bucket] of adminAttemptStore.entries()) {
    if (
      bucket.windowStartedAt + ADMIN_RATE_LIMIT_WINDOW_MS < now &&
      (!bucket.blockedUntil || bucket.blockedUntil < now)
    ) {
      adminAttemptStore.delete(key);
    }
  }
}

function getClientIp(req: NextRequest): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  const xrip = req.headers.get('x-real-ip');
  if (xrip) return xrip.trim();
  return 'unknown';
}

function getRateLimitBucketKey(req: NextRequest): string {
  return `${getClientIp(req)}:${req.nextUrl.pathname}`;
}

function checkAndConsumeAttempt(req: NextRequest): { allowed: boolean; retryAfterSeconds: number } {
  cleanupRateLimitStore();
  const key = getRateLimitBucketKey(req);
  const now = Date.now();
  const current = adminAttemptStore.get(key);

  if (current?.blockedUntil && current.blockedUntil > now) {
    return { allowed: false, retryAfterSeconds: Math.ceil((current.blockedUntil - now) / 1000) };
  }

  if (!current || current.windowStartedAt + ADMIN_RATE_LIMIT_WINDOW_MS < now) {
    adminAttemptStore.set(key, { attempts: 0, windowStartedAt: now, blockedUntil: 0 });
  }

  return { allowed: true, retryAfterSeconds: 0 };
}

function registerFailedAttempt(req: NextRequest) {
  const key = getRateLimitBucketKey(req);
  const now = Date.now();
  const bucket = adminAttemptStore.get(key) || { attempts: 0, windowStartedAt: now, blockedUntil: 0 };

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

function resetAttempts(req: NextRequest) {
  adminAttemptStore.delete(getRateLimitBucketKey(req));
}

function pbkdf2Hex(value: string, salt: string, iterations: number): string {
  const safeIterations = Number.isFinite(iterations) && iterations > 1000 ? iterations : DEFAULT_KEY_HASH_ITERATIONS;
  return crypto.pbkdf2Sync(value, salt, safeIterations, 32, 'sha256').toString('hex');
}

function timingSafeEqualHex(leftHex: string, rightHex: string): boolean {
  if (!leftHex || !rightHex) return false;
  const left = Buffer.from(leftHex, 'hex');
  const right = Buffer.from(rightHex, 'hex');
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

function timingSafeEqualText(a: string, b: string): boolean {
  if (!a || !b) return false;
  const left = Buffer.from(a, 'utf8');
  const right = Buffer.from(b, 'utf8');
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

function normalizeProvidedAdminKey(req: NextRequest): string {
  return (
    req.headers.get('x-admin-key') ||
    req.headers.get('x-admin-password') ||
    req.headers.get('x-admin-token') ||
    (() => {
      const auth = req.headers.get('authorization') || '';
      return auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
    })() ||
    ''
  ).trim();
}

export interface AdminAuthResult {
  ok: boolean;
  reason: string;
  status: number;
  retryAfterSeconds?: number;
}

export async function isAdminAuthorized(req: NextRequest): Promise<AdminAuthResult> {
  const rateLimit = checkAndConsumeAttempt(req);
  if (!rateLimit.allowed) {
    return { ok: false, reason: 'Too many failed admin login attempts', status: 429, retryAfterSeconds: rateLimit.retryAfterSeconds };
  }

  const providedKey = normalizeProvidedAdminKey(req);
  if (!providedKey) {
    registerFailedAttempt(req);
    return { ok: false, reason: 'Unauthorized', status: 401 };
  }

  // Simple mode: single env var password
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

  // DB mode: admin_api_keys table
  const supabaseUrl = normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const serviceRoleKey = normalizeEnvValue(process.env.SUPABASE_SERVICE_ROLE_KEY || '');
  if (!supabaseUrl || !serviceRoleKey) {
    return { ok: false, reason: 'Service not configured', status: 503 };
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await supabase.from(ADMIN_KEYS_TABLE).select('*').limit(500);
  if (error) {
    const msg = String(error?.message || '').toLowerCase();
    console.error('[admin-auth] Supabase error:', error?.message, error?.code);
    if (msg.includes('admin_api_keys') && msg.includes('does not exist')) {
      return { ok: false, reason: 'Admin auth table not configured', status: 503 };
    }
    return { ok: false, reason: `Admin auth check failed: ${error?.message}`, status: 500 };
  }

  const now = Date.now();
  const rows = (Array.isArray(data) ? data : []).filter((row) => {
    if (row?.is_active === false) return false;
    if (!row?.expires_at) return true;
    const exp = Date.parse(String(row.expires_at));
    return !Number.isFinite(exp) || exp > now;
  });

  if (rows.length === 0) {
    return { ok: false, reason: 'Admin auth table has no active key', status: 503 };
  }

  for (const row of rows) {
    const salt = String(row?.key_salt || '').trim();
    const expectedHash = String(row?.key_hash || '').trim().toLowerCase();
    const iterations = parseInt(String(row?.hash_iterations || ''), 10);
    if (!salt || !expectedHash) continue;

    const computedHash = pbkdf2Hex(providedKey, salt, iterations).toLowerCase();
    if (timingSafeEqualHex(computedHash, expectedHash)) {
      resetAttempts(req);
      if (row?.id) {
        await supabase.from(ADMIN_KEYS_TABLE).update({ last_used_at: new Date().toISOString() }).eq('id', row.id);
      }
      return { ok: true, reason: '', status: 200 };
    }
  }

  registerFailedAttempt(req);
  return { ok: false, reason: 'Unauthorized', status: 401 };
}
