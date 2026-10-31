import { NextRequest } from 'next/server';
import { CORNER_AUTHOR_KEY_HEADERS, readProvidedKey } from '@/lib/admin/headers';
import { verifyPasswordHash } from '@/lib/admin/cornerPasswords';
import { tryCreateServiceClient } from '@/lib/supabase/admin';

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

/**
 * Slugs that must never be handed to an author: every top-level URL segment
 * served by the app or public/ (tests/reserved-author-slugs.test.ts keeps the
 * app/ part in sync) plus planned/system names.
 */
export const RESERVED_AUTHOR_SLUGS = new Set([
  // Panels, API and auth
  'admin',
  'api',
  'auth',
  'giris',
  'authors',
  'devuser',
  'kose-giris',
  'kose-panel',
  // Blog and authorship (yazi-dizisi stays reserved for the legacy redirect)
  'blog',
  'yazar',
  'yazi-dizisi',
  'almanya101',
  'haberler',
  'rehber',
  // Public pages
  'hakkimizda',
  'iletisim',
  'topluluk',
  'belgeler',
  'software-hub',
  'tatil',
  'hizmet-rehberi',
  'is-ilanlari',
  'kariyer',
  'ekibimize-katil',
  'almanyada-yasam',
  'almanya-araclari',
  'yeniarachub',
  // Legal pages
  'impressum',
  'gizlilik-politikasi',
  'kullanim-sartlari',
  'kvkk-gdpr-ccpa',
  'cerez-politikasi',
  // Tools
  'maas-hesaplama',
  'vatandaslik-testi',
  'banka-secim',
  'sigorta-secim',
  'para-transferi',
  'vize-secim',
  'stepstone-karsilastirma',
  'almanya-maas-beklentisi',
  'almanya-yasam-tarzi-uyumu',
  'almanya-yolunu-sec',
  'almanyada-is-bulma-olasiligi',
  'almanyaya-hazir-misin',
  'hangi-sehir-sana-uygun',
  'ilk-90-gun-planlayici',
  'kariyer-ve-egitim-rotasi',
  'once-hangi-sorunu-cozmelisin',
  'topluluk-ve-danismanlik',
  // Static and metadata files / public directories
  'ai',
  'images',
  'article-old',
  'rehber-old',
  'feed.xml',
  'llms.txt',
  'robots.txt',
  'sitemap.xml',
  'icon.svg',
]);
export function isReservedAuthorSlug(slug: string) {
  return RESERVED_AUTHOR_SLUGS.has(slug);
}

function getProvidedPassword(req: NextRequest): string {
  return readProvidedKey(req.headers, CORNER_AUTHOR_KEY_HEADERS);
}

export async function getSupabaseServiceClient() {
  return tryCreateServiceClient();
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
