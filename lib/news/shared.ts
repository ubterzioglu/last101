import type { NewsCategory, NewsStatus } from '@/types/news';

export const NEWS_CATEGORIES: NewsCategory[] = ['almanya', 'turkiye', 'avrupa', 'dunya', 'duyuru'];
export const NEWS_STATUSES: NewsStatus[] = ['pending_review', 'draft', 'published', 'rejected', 'archived'];

export const NEWS_CATEGORY_LABELS: Record<NewsCategory, string> = {
  almanya: 'Almanya',
  turkiye: 'Türkiye',
  avrupa: 'Avrupa',
  dunya: 'Dünya',
  duyuru: 'Duyuru',
};

export const NEWS_STATUS_LABELS: Record<NewsStatus, string> = {
  pending_review: 'İnceleme Bekliyor',
  draft: 'Taslak',
  published: 'Yayında',
  rejected: 'Reddedildi',
  archived: 'Arşiv',
};

const TURKISH_CHAR_MAP: Record<string, string> = {
  ç: 'c',
  ğ: 'g',
  ı: 'i',
  İ: 'i',
  ö: 'o',
  ş: 's',
  ü: 'u',
  Ç: 'c',
  Ğ: 'g',
  Ö: 'o',
  Ş: 's',
  Ü: 'u',
};

export function normalizeNewsCategory(value: unknown): NewsCategory {
  const raw = String(value || '').trim().toLocaleLowerCase('tr-TR');
  if (raw === 'almanya') return 'almanya';
  if (raw === 'turkiye' || raw === 'türkiye') return 'turkiye';
  if (raw === 'avrupa') return 'avrupa';
  if (raw === 'dunya' || raw === 'dünya') return 'dunya';
  if (raw === 'duyuru') return 'duyuru';
  return 'almanya';
}

export function normalizeNewsStatus(value: unknown): NewsStatus {
  const raw = String(value || '').trim().toLowerCase();
  if (raw === 'pending_review') return 'pending_review';
  if (raw === 'draft') return 'draft';
  if (raw === 'published') return 'published';
  if (raw === 'rejected') return 'rejected';
  if (raw === 'archived') return 'archived';
  return 'draft';
}

export function getNewsCategoryLabel(category: NewsCategory): string {
  return NEWS_CATEGORY_LABELS[category];
}

export function getNewsStatusLabel(status: NewsStatus): string {
  return NEWS_STATUS_LABELS[status];
}

export function slugifyNewsTitle(value: string): string {
  return value
    .trim()
    .replace(/[çğıİöşüÇĞIÖŞÜ]/g, (char) => TURKISH_CHAR_MAP[char] || char)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

export function buildStableNewsSlug(title: string, id: string): string {
  const safeTitle = slugifyNewsTitle(title || 'haber') || 'haber';
  return `${safeTitle}--${id}`;
}

export function maybeExtractIdFromLegacySlug(slug: string): string {
  const separatorIndex = slug.lastIndexOf('--');
  if (separatorIndex === -1) return '';
  return slug.slice(separatorIndex + 2).trim();
}

export function formatNewsDate(dateValue: string | null | undefined, withTime = false): string {
  if (!dateValue) return 'Tarih belirtilmedi';
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return 'Tarih belirtilmedi';

  return parsed.toLocaleDateString('tr-TR', withTime
    ? {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }
    : {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
}

export function createNewsCursor(offset: number): string {
  const value = String(Math.max(offset, 0));
  if (typeof window === 'undefined') {
    return Buffer.from(value, 'utf8').toString('base64url');
  }
  return btoa(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

export function parseNewsCursor(cursor: string | null | undefined): number {
  if (!cursor) return 0;
  try {
    const decoded = typeof window === 'undefined'
      ? Buffer.from(cursor, 'base64url').toString('utf8')
      : atob(cursor.replace(/-/g, '+').replace(/_/g, '/'));
    const parsed = Number.parseInt(decoded, 10);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
  } catch {
    return 0;
  }
}

export function clampNewsLimit(value: unknown, fallback = 12, max = 48): number {
  const parsed = Number.parseInt(String(value || ''), 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(Math.max(parsed, 1), max);
}

export function buildWhatsAppShareText(params: {
  title: string;
  summary?: string | null;
  slug: string;
  siteUrl: string;
}): string {
  const summary = String(params.summary || '').trim();
  const articleUrl = `${params.siteUrl.replace(/\/+$/, '')}/haberler/${params.slug}`;
  return [params.title.trim(), summary, `Devamını oku:\n${articleUrl}`]
    .filter(Boolean)
    .join('\n\n');
}
