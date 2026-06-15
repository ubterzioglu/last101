import 'server-only';

import { unstable_noStore as noStore } from 'next/cache';
import { createClient } from '@supabase/supabase-js';

export interface PublicRehberArticle {
  id: string;
  slug: string;
  href: string;
  title: string;
  summary: string;
  content: string | null;
  coverImageUrl: string;
  category: string;
  readingMinutes: number;
  publishedAt: string;
  createdAt: string | null;
  updatedAt: string | null;
  dateLabel: string;
}

interface RehberArticleRow {
  id: string;
  slug: string | null;
  title: string | null;
  summary: string | null;
  content: string | null;
  cover_image_url: string | null;
  category: string | null;
  reading_minutes: number | null;
  published_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

const DEFAULT_COVER = '/images/hero-background.jpg';
const REHBER_TABLE = 'rehber_articles';
const ARTICLE_SELECT =
  'id, slug, title, summary, content, cover_image_url, category, reading_minutes, published_at, created_at, updated_at';

function normalizeEnvValue(value: unknown): string {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
    return raw.slice(1, -1).trim();
  }
  return raw;
}

function createRehberReadClient() {
  const supabaseUrl = normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL);
  const keyCandidates = [
    process.env.SUPABASE_ANON_KEY,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
    process.env.SUPABASE_PUBLISHABLE_KEY,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  ].map(normalizeEnvValue);
  const accessKey = keyCandidates.find(Boolean) || '';

  if (!supabaseUrl || !accessKey) return null;

  return createClient(supabaseUrl, accessKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function slugify(value: string): string {
  return value
    .toLocaleLowerCase('tr-TR')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function buildArticleSlug(row: Pick<RehberArticleRow, 'id' | 'title' | 'slug'>): string {
  const explicit = String(row.slug || '').trim();
  if (explicit) return explicit;
  const titlePart = slugify(String(row.title || 'rehber'));
  return `${titlePart || 'rehber'}--${row.id}`;
}

function getIdFromArticleSlug(slug: string): string {
  const separatorIndex = slug.lastIndexOf('--');
  if (separatorIndex === -1) return '';
  return slug.slice(separatorIndex + 2).trim();
}

function formatRehberDate(dateValue: string | null): string {
  if (!dateValue) return 'Tarih belirtilmedi';
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return 'Tarih belirtilmedi';

  return parsed.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function mapArticleRow(row: RehberArticleRow): PublicRehberArticle {
  const title = String(row.title || 'Başlıksız rehber').trim();
  const publishedAt = row.published_at || row.created_at || new Date().toISOString();
  const slug = buildArticleSlug(row);

  return {
    id: row.id,
    slug,
    href: `/rehber/${slug}`,
    title,
    summary: String(row.summary || '').trim(),
    content: row.content || null,
    coverImageUrl: String(row.cover_image_url || DEFAULT_COVER).trim(),
    category: String(row.category || 'Rehber').trim(),
    readingMinutes: Math.max(1, Number(row.reading_minutes || 5)),
    publishedAt,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    dateLabel: formatRehberDate(publishedAt),
  };
}

export async function getPublishedRehberArticles(limit = 100): Promise<PublicRehberArticle[]> {
  noStore();

  const supabase = createRehberReadClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from(REHBER_TABLE)
    .select(ARTICLE_SELECT)
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('getPublishedRehberArticles failed:', error);
    return [];
  }

  return (Array.isArray(data) ? (data as RehberArticleRow[]) : []).map(mapArticleRow);
}

export async function getPublishedRehberArticleBySlug(slug: string): Promise<PublicRehberArticle | undefined> {
  noStore();

  const supabase = createRehberReadClient();
  if (!supabase) return undefined;

  // Önce açık slug ile dene
  const bySlug = await supabase
    .from(REHBER_TABLE)
    .select(ARTICLE_SELECT)
    .eq('slug', slug)
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .maybeSingle();

  if (bySlug.data) return mapArticleRow(bySlug.data as RehberArticleRow);
  if (bySlug.error) console.error('getPublishedRehberArticleBySlug (slug) failed:', bySlug.error);

  // title--id biçimindeki türetilmiş slug için id ile dene
  const id = getIdFromArticleSlug(slug);
  if (!id) return undefined;

  const byId = await supabase
    .from(REHBER_TABLE)
    .select(ARTICLE_SELECT)
    .eq('id', id)
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .maybeSingle();

  if (byId.error || !byId.data) {
    if (byId.error) console.error('getPublishedRehberArticleBySlug (id) failed:', byId.error);
    return undefined;
  }

  return mapArticleRow(byId.data as RehberArticleRow);
}

export async function getAllRehberArticlesForSitemap(): Promise<Array<{ slug: string; updatedAt: string }>> {
  noStore();

  const supabase = createRehberReadClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from(REHBER_TABLE)
    .select('id, slug, title, updated_at, published_at, created_at')
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false, nullsFirst: false });

  if (error) {
    console.error('getAllRehberArticlesForSitemap failed:', error);
    return [];
  }

  return (Array.isArray(data) ? (data as RehberArticleRow[]) : []).map((row) => ({
    slug: buildArticleSlug(row),
    updatedAt: row.updated_at || row.published_at || row.created_at || new Date().toISOString(),
  }));
}
