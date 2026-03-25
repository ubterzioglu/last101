import 'server-only';

import { unstable_noStore as noStore } from 'next/cache';
import { createClient } from '@supabase/supabase-js';

export interface PublicNewsArticle {
  id: string;
  slug: string;
  href: string;
  title: string;
  excerpt: string;
  image: string;
  publishedAt: string;
  createdAt: string | null;
  dateLabel: string;
  category: string;
  readingMinutes: number;
  sourceName?: string;
  sourceUrl?: string;
}

export interface PublicNewsItem {
  id: string;
  slug: string;
  href: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category?: string;
}

interface NewsRow {
  id: string;
  category: string | null;
  title: string | null;
  summary: string | null;
  cover_image_url: string | null;
  source_name: string | null;
  source_url: string | null;
  reading_minutes: number | null;
  published_at: string | null;
  created_at: string | null;
}

function normalizeEnvValue(value: unknown): string {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
    return raw.slice(1, -1).trim();
  }
  return raw;
}

function createNewsServiceClient() {
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

function slugify(value: string): string {
  return value
    .toLocaleLowerCase('tr-TR')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function buildNewsSlug(row: Pick<NewsRow, 'id' | 'title'>): string {
  const titlePart = slugify(String(row.title || 'haber'));
  return `${titlePart || 'haber'}--${row.id}`;
}

function getIdFromNewsSlug(slug: string): string {
  const separatorIndex = slug.lastIndexOf('--');
  if (separatorIndex === -1) return '';
  return slug.slice(separatorIndex + 2).trim();
}

function formatNewsDate(dateValue: string | null): string {
  if (!dateValue) return 'Tarih belirtilmedi';
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return 'Tarih belirtilmedi';

  return parsed.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function mapRowToArticle(row: NewsRow): PublicNewsArticle {
  const title = String(row.title || 'Başlıksız haber').trim();
  const publishedAt = row.published_at || row.created_at || new Date().toISOString();
  const slug = buildNewsSlug(row);

  return {
    id: row.id,
    slug,
    href: `/haberler/${slug}`,
    title,
    excerpt: String(row.summary || '').trim(),
    image: String(row.cover_image_url || '/images/og-default.jpg').trim(),
    publishedAt,
    createdAt: row.created_at,
    dateLabel: formatNewsDate(publishedAt),
    category: String(row.category || 'Almanya').trim(),
    readingMinutes: Math.max(1, Number(row.reading_minutes || 3)),
    sourceName: String(row.source_name || '').trim() || undefined,
    sourceUrl: String(row.source_url || '').trim() || undefined,
  };
}

async function fetchPublishedNewsRows(limit = 24): Promise<NewsRow[]> {
  noStore();

  const supabase = createNewsServiceClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('news_posts')
    .select('id, category, title, summary, cover_image_url, source_name, source_url, reading_minutes, published_at, created_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('fetchPublishedNewsRows failed:', error);
    return [];
  }

  return Array.isArray(data) ? (data as NewsRow[]) : [];
}

export async function getPublishedNewsArticles(limit = 24): Promise<PublicNewsArticle[]> {
  const rows = await fetchPublishedNewsRows(limit);
  return rows.map(mapRowToArticle);
}

export async function getPublishedNewsItems(limit = 12): Promise<PublicNewsItem[]> {
  const articles = await getPublishedNewsArticles(limit);
  return articles.map((article) => ({
    id: article.id,
    slug: article.slug,
    href: article.href,
    title: article.title,
    excerpt: article.excerpt,
    image: article.image,
    date: article.dateLabel,
    category: article.category,
  }));
}

export async function getPublishedNewsArticleBySlug(slug: string): Promise<PublicNewsArticle | undefined> {
  const id = getIdFromNewsSlug(slug);
  if (!id) return undefined;

  noStore();

  const supabase = createNewsServiceClient();
  if (!supabase) return undefined;

  const { data, error } = await supabase
    .from('news_posts')
    .select('id, category, title, summary, cover_image_url, source_name, source_url, reading_minutes, published_at, created_at')
    .eq('id', id)
    .eq('status', 'published')
    .maybeSingle();

  if (error || !data) {
    if (error) console.error('getPublishedNewsArticleBySlug failed:', error);
    return undefined;
  }

  return mapRowToArticle(data as NewsRow);
}

export async function getRelatedPublishedNewsArticles(currentId: string, limit = 3): Promise<PublicNewsArticle[]> {
  const articles = await getPublishedNewsArticles(limit + 6);
  return articles.filter((article) => article.id !== currentId).slice(0, limit);
}
