import crypto from 'crypto';
import { NextRequest } from 'next/server';

const CORNER_RATE_LIMIT_MAX_ATTEMPTS = 12;
const CORNER_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const CORNER_RATE_LIMIT_BLOCK_MS = 30 * 60 * 1000;

interface RateLimitBucket {
  attempts: number;
  windowStartedAt: number;
  blockedUntil: number;
}

const cornerAttemptStore = new Map<string, RateLimitBucket>();

export interface CornerAuthResult {
  ok: boolean;
  reason: string;
  status: number;
  retryAfterSeconds?: number;
}

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
  for (const [key, bucket] of cornerAttemptStore.entries()) {
    if (
      bucket.windowStartedAt + CORNER_RATE_LIMIT_WINDOW_MS < now &&
      (!bucket.blockedUntil || bucket.blockedUntil < now)
    ) {
      cornerAttemptStore.delete(key);
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
  return `${getClientIp(req)}:${req.nextUrl.pathname}:corner`;
}

function checkAndConsumeAttempt(req: NextRequest): { allowed: boolean; retryAfterSeconds: number } {
  cleanupRateLimitStore();
  const key = getRateLimitBucketKey(req);
  const now = Date.now();
  const current = cornerAttemptStore.get(key);

  if (current?.blockedUntil && current.blockedUntil > now) {
    return { allowed: false, retryAfterSeconds: Math.ceil((current.blockedUntil - now) / 1000) };
  }

  if (!current || current.windowStartedAt + CORNER_RATE_LIMIT_WINDOW_MS < now) {
    cornerAttemptStore.set(key, { attempts: 0, windowStartedAt: now, blockedUntil: 0 });
  }

  return { allowed: true, retryAfterSeconds: 0 };
}

function registerFailedAttempt(req: NextRequest) {
  const key = getRateLimitBucketKey(req);
  const now = Date.now();
  const bucket = cornerAttemptStore.get(key) || { attempts: 0, windowStartedAt: now, blockedUntil: 0 };

  if (bucket.windowStartedAt + CORNER_RATE_LIMIT_WINDOW_MS < now) {
    bucket.attempts = 0;
    bucket.windowStartedAt = now;
    bucket.blockedUntil = 0;
  }

  bucket.attempts += 1;
  if (bucket.attempts >= CORNER_RATE_LIMIT_MAX_ATTEMPTS) {
    bucket.blockedUntil = now + CORNER_RATE_LIMIT_BLOCK_MS;
  }
  cornerAttemptStore.set(key, bucket);
}

function resetAttempts(req: NextRequest) {
  cornerAttemptStore.delete(getRateLimitBucketKey(req));
}

function timingSafeEqualText(a: string, b: string): boolean {
  if (!a || !b) return false;
  const left = Buffer.from(a, 'utf8');
  const right = Buffer.from(b, 'utf8');
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

function normalizeProvidedCornerKey(req: NextRequest): string {
  return (
    req.headers.get('x-corner-admin-key') ||
    req.headers.get('x-corner-admin-password') ||
    (() => {
      const auth = req.headers.get('authorization') || '';
      return auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
    })() ||
    ''
  ).trim();
}

export async function isCornerAdminAuthorized(req: NextRequest): Promise<CornerAuthResult> {
  const rateLimit = checkAndConsumeAttempt(req);
  if (!rateLimit.allowed) {
    return {
      ok: false,
      reason: 'Too many failed corner admin login attempts',
      status: 429,
      retryAfterSeconds: rateLimit.retryAfterSeconds,
    };
  }

  const expectedPassword = normalizeEnvValue(process.env.CORNER_ADMIN_PASSWORD || '');
  if (!expectedPassword) {
    return { ok: false, reason: 'Corner admin auth not configured', status: 503 };
  }

  const providedKey = normalizeProvidedCornerKey(req);
  if (!providedKey || !timingSafeEqualText(providedKey, expectedPassword)) {
    registerFailedAttempt(req);
    return { ok: false, reason: 'Unauthorized', status: 401 };
  }

  resetAttempts(req);
  return { ok: true, reason: '', status: 200 };
}
