import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyPasswordHash } from '@/lib/admin/cornerPasswords';

export interface CornerAuthorAuthResult {
  ok: boolean;
  reason: string;
  status: number;
  author?: {
    id: string;
    slug: string;
    display_name: string | null;
    is_active: boolean | null;
  };
}

interface RateLimitBucket {
  attempts: number;
  windowStartedAt: number;
  blockedUntil: number;
}

const AUTHOR_ATTEMPT_WINDOW_MS = 10 * 60 * 1000;
const AUTHOR_BLOCK_MS = 10 * 60 * 1000;
const AUTHOR_MAX_FAILED_ATTEMPTS = 8;
const authorAttemptStore = new Map<string, RateLimitBucket>();

function normalizeEnvValue(value: unknown): string {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
    return raw.slice(1, -1).trim();
  }
  return raw;
}

function getRateLimitBucketKey(req: NextRequest, slug: string): string {
  const forwardedFor = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const ip = forwardedFor || req.headers.get('x-real-ip') || 'unknown';
  return `${slug}:${ip}`;
}

function checkRateLimit(key: string) {
  const now = Date.now();
  const bucket = authorAttemptStore.get(key);
  if (!bucket) return { ok: true, retryAfterSeconds: 0 };
  if (bucket.blockedUntil > now) {
    return { ok: false, retryAfterSeconds: Math.ceil((bucket.blockedUntil - now) / 1000) };
  }
  if (now - bucket.windowStartedAt > AUTHOR_ATTEMPT_WINDOW_MS) {
    authorAttemptStore.delete(key);
  }
  return { ok: true, retryAfterSeconds: 0 };
}

function recordFailedAttempt(key: string) {
  const now = Date.now();
  const current = authorAttemptStore.get(key);
  const bucket = current && now - current.windowStartedAt <= AUTHOR_ATTEMPT_WINDOW_MS
    ? current
    : { attempts: 0, windowStartedAt: now, blockedUntil: 0 };
  bucket.attempts += 1;
  if (bucket.attempts >= AUTHOR_MAX_FAILED_ATTEMPTS) bucket.blockedUntil = now + AUTHOR_BLOCK_MS;
  authorAttemptStore.set(key, bucket);
}

function clearFailedAttempts(key: string) {
  authorAttemptStore.delete(key);
}

export function normalizeAuthorSlug(value: unknown): string {
  return String(value || '')
    .trim()
    .toLocaleLowerCase('tr-TR')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .slice(0, 80);
}

export const RESERVED_AUTHOR_SLUGS = new Set([
  'admin',
  'api',
  'authors',
  'devuser',
  'haberler',
  'yazi-dizisi',
  'kose-giris',
  'kose-panel',
  'hakkimizda',
  'iletisim',
  'topluluk',
  'belgeler',
  'software-hub',
  'maas-hesaplama',
  'vatandaslik-testi',
  'banka-secim',
  'sigorta-secim',
  'para-transferi',
  'vize-secim',
  'tatil',
  'hizmet-rehberi',
  'is-ilanlari',
  'stepstone-karsilastirma',
  'rehber',
  'robots.txt',
  'sitemap.xml',
  'icon.svg',
]);

export function isReservedAuthorSlug(slug: string) {
  return RESERVED_AUTHOR_SLUGS.has(slug);
}

function getProvidedPassword(req: NextRequest): string {
  return (
    req.headers.get('x-corner-author-key') ||
    req.headers.get('x-corner-author-password') ||
    (() => {
      const auth = req.headers.get('authorization') || '';
      return auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
    })() ||
    ''
  ).trim();
}

export async function getSupabaseServiceClient() {
  const supabaseUrl = normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const serviceRoleKey = normalizeEnvValue(
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_SERVICE_KEY ||
      process.env.SUPABASE_SECRET_KEY ||
      ''
  );
  if (!supabaseUrl || !serviceRoleKey) return null;

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function isCornerAuthorAuthorized(req: NextRequest, slugValue: unknown): Promise<CornerAuthorAuthResult> {
  const slug = normalizeAuthorSlug(slugValue);
  if (!slug) return { ok: false, reason: 'Yazar bulunamadı.', status: 404 };

  const rateLimitKey = getRateLimitBucketKey(req, slug);
  const rateLimit = checkRateLimit(rateLimitKey);
  if (!rateLimit.ok) {
    return { ok: false, reason: 'Too many failed author login attempts', status: 429 };
  }

  const password = getProvidedPassword(req);
  if (!password) return { ok: false, reason: 'Unauthorized', status: 401 };

  const supabase = await getSupabaseServiceClient();
  if (!supabase) return { ok: false, reason: 'Service not configured', status: 503 };

  const { data, error } = await supabase
    .from('corner_authors')
    .select('id, slug, display_name, is_active, password_hash, password_salt, hash_iterations')
    .eq('slug', slug)
    .maybeSingle();

  if (error) return { ok: false, reason: error.message || 'Auth failed', status: 500 };
  if (!data || data.is_active === false) return { ok: false, reason: 'Yazar bulunamadı.', status: 404 };

  const valid = verifyPasswordHash(
    password,
    String(data.password_salt || ''),
    String(data.password_hash || ''),
    Number(data.hash_iterations || 0)
  );
  if (!valid) {
    recordFailedAttempt(rateLimitKey);
    return { ok: false, reason: 'Unauthorized', status: 401 };
  }

  clearFailedAttempts(rateLimitKey);

  return {
    ok: true,
    reason: '',
    status: 200,
    author: {
      id: data.id,
      slug: data.slug,
      display_name: data.display_name,
      is_active: data.is_active,
    },
  };
}
