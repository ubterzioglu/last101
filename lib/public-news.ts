import 'server-only';

import { unstable_noStore as noStore } from 'next/cache';
import { createClient } from '@supabase/supabase-js';
import {
  buildStableNewsSlug,
  buildWhatsAppShareText,
  clampNewsLimit,
  createNewsCursor,
  formatNewsDate,
  getNewsCategoryLabel,
  maybeExtractIdFromLegacySlug,
  normalizeNewsCategory,
  parseNewsCursor,
} from '@/lib/news/shared';
import type {
  NewsCategory,
  NewsListItem,
  PublicNewsArticle,
  PublicNewsListResponse,
} from '@/types/news';
import { CANONICAL_SITE_URL } from '@/lib/utils/constants';

interface NewsRow {
  id: string;
  slug: string | null;
  title: string | null;
  category: string | null;
  summary: string | null;
  content: string | null;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  cover_image_credit: string | null;
  source_name: string | null;
  source_url: string | null;
  source_published_at: string | null;
  reading_minutes: number | null;
  whatsapp_share_text: string | null;
  relevance_score: number | null;
  relevance_reason: string | null;
  published_at: string | null;
  created_at: string | null;
  is_featured: boolean | null;
  featured_rank: number | null;
  show_in_carousel: boolean | null;
}

function normalizeEnvValue(value: unknown): string {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
    return raw.slice(1, -1).trim();
  }
  return raw;
}

function createNewsReadClient() {
  const supabaseUrl = normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL);
  const keyCandidates = [
    process.env.SUPABASE_ANON_KEY,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
    process.env.SUPABASE_PUBLISHABLE_KEY,
  ].map(normalizeEnvValue);
  const accessKey = keyCandidates.find(Boolean) || '';

  if (!supabaseUrl || !accessKey) return null;

  return createClient(supabaseUrl, accessKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function mapRowToListItem(row: NewsRow): NewsListItem {
  const title = String(row.title || 'Başlıksız haber').trim();
  const slug = String(row.slug || '').trim() || buildStableNewsSlug(title, row.id);
  const category = normalizeNewsCategory(row.category);
  const summary = String(row.summary || '').trim();
  const publishedAt = row.published_at || row.created_at || new Date().toISOString();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || CANONICAL_SITE_URL;

  return {
    id: row.id,
    slug,
    title,
    summary,
    coverImageUrl: String(row.cover_image_url || '/og.png').trim(),
    coverImageAlt: String(row.cover_image_alt || title).trim(),
    category,
    categoryLabel: getNewsCategoryLabel(category),
    publishedAt,
    publishedLabel: formatNewsDate(publishedAt),
    sourceName: String(row.source_name || 'Almanya101').trim(),
    sourceUrl: String(row.source_url || '').trim() || undefined,
    sourcePublishedAt: row.source_published_at,
    sourcePublishedLabel: row.source_published_at ? formatNewsDate(row.source_published_at, true) : undefined,
    readingMinutes: Math.max(1, Number(row.reading_minutes || 3)),
    whatsappShareText: String(row.whatsapp_share_text || '').trim() || buildWhatsAppShareText({
      title,
      summary,
      slug,
      siteUrl,
    }),
  };
}

function mapRowToArticle(row: NewsRow): PublicNewsArticle {
  const item = mapRowToListItem(row);
  return {
    ...item,
    content: row.content || null,
    coverImageCredit: String(row.cover_image_credit || '').trim() || undefined,
    relevanceScore: row.relevance_score,
    relevanceReason: row.relevance_reason,
  };
}

async function fetchPublishedNewsRows(options?: {
  limit?: number;
  cursor?: string | null;
  category?: NewsCategory | 'all';
  excludeId?: string | null;
  onlyCarousel?: boolean;
}): Promise<PublicNewsListResponse> {
  noStore();

  const supabase = createNewsReadClient();
  if (!supabase) return { items: [], nextCursor: null };

  const limit = clampNewsLimit(options?.limit, options?.onlyCarousel ? 12 : 12, 48);
  const offset = parseNewsCursor(options?.cursor);

  let query = supabase
    .from('news_posts')
    .select('id, slug, title, category, summary, content, cover_image_url, cover_image_alt, cover_image_credit, source_name, source_url, source_published_at, reading_minutes, whatsapp_share_text, relevance_score, relevance_reason, published_at, created_at, is_featured, featured_rank, show_in_carousel')
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit);

  if (options?.category && options.category !== 'all') query = query.eq('category', options.category);
  if (options?.excludeId) query = query.neq('id', options.excludeId);
  if (options?.onlyCarousel) query = query.eq('show_in_carousel', true);

  const { data, error } = await query;
  if (error) {
    console.error('fetchPublishedNewsRows failed:', error);
    return { items: [], nextCursor: null };
  }

  const rows = Array.isArray(data) ? (data as NewsRow[]) : [];
  const nextCursor = rows.length > limit ? createNewsCursor(offset + limit) : null;
  const usableRows = rows.slice(0, limit);

  return {
    items: usableRows.map(mapRowToListItem),
    nextCursor,
  };
}

export async function getFeaturedNewsArticle(): Promise<PublicNewsArticle | undefined> {
  noStore();

  const supabase = createNewsReadClient();
  if (!supabase) return undefined;

  const baseSelect = 'id, slug, title, category, summary, content, cover_image_url, cover_image_alt, cover_image_credit, source_name, source_url, source_published_at, reading_minutes, whatsapp_share_text, relevance_score, relevance_reason, published_at, created_at, is_featured, featured_rank, show_in_carousel';

  const featuredResult = await supabase
    .from('news_posts')
    .select(baseSelect)
    .eq('status', 'published')
    .eq('is_featured', true)
    .lte('published_at', new Date().toISOString())
    .order('featured_rank', { ascending: true, nullsFirst: false })
    .order('published_at', { ascending: false, nullsFirst: false })
    .limit(1)
    .maybeSingle();

  if (featuredResult.data) return mapRowToArticle(featuredResult.data as NewsRow);

  const fallbackResult = await supabase
    .from('news_posts')
    .select(baseSelect)
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (fallbackResult.error || !fallbackResult.data) {
    if (fallbackResult.error) console.error('getFeaturedNewsArticle fallback failed:', fallbackResult.error);
    return undefined;
  }

  return mapRowToArticle(fallbackResult.data as NewsRow);
}

export async function getPublishedNewsFeed(options?: {
  category?: NewsCategory | 'all';
  limit?: number;
  cursor?: string | null;
  excludeId?: string | null;
}): Promise<PublicNewsListResponse> {
  return fetchPublishedNewsRows(options);
}

export async function getPublishedNewsArticles(limit = 24): Promise<PublicNewsArticle[]> {
  const response = await fetchPublishedNewsRows({ limit });
  return response.items.map((item) => ({
    ...item,
    content: null,
  }));
}

export async function getPublishedNewsItems(limit = 12): Promise<Array<{
  id: string;
  slug: string;
  href: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category?: string;
}>> {
  const response = await fetchPublishedNewsRows({ limit, onlyCarousel: true });
  return response.items.map((item) => ({
    id: item.id,
    slug: item.slug,
    href: `/haberler/${item.slug}`,
    title: item.title,
    excerpt: item.summary,
    image: item.coverImageUrl,
    date: item.publishedLabel,
    category: item.categoryLabel,
  }));
}

export async function getPublishedNewsArticleBySlug(slug: string): Promise<PublicNewsArticle | undefined> {
  noStore();

  const supabase = createNewsReadClient();
  if (!supabase) return undefined;

  const select = 'id, slug, title, category, summary, content, cover_image_url, cover_image_alt, cover_image_credit, source_name, source_url, source_published_at, reading_minutes, whatsapp_share_text, relevance_score, relevance_reason, published_at, created_at, is_featured, featured_rank, show_in_carousel';

  const { data, error } = await supabase
    .from('news_posts')
    .select(select)
    .eq('slug', slug)
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .maybeSingle();

  if (data) return mapRowToArticle(data as NewsRow);
  if (error) console.error('getPublishedNewsArticleBySlug failed:', error);

  const legacyId = maybeExtractIdFromLegacySlug(slug);
  if (!legacyId) return undefined;

  const fallback = await supabase
    .from('news_posts')
    .select(select)
    .eq('id', legacyId)
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .maybeSingle();

  if (!fallback.data) {
    if (fallback.error) console.error('getPublishedNewsArticleBySlug legacy fallback failed:', fallback.error);
    return undefined;
  }

  return mapRowToArticle(fallback.data as NewsRow);
}

export async function getRelatedPublishedNewsArticles(currentId: string, limit = 3): Promise<PublicNewsArticle[]> {
  noStore();

  const supabase = createNewsReadClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('news_posts')
    .select('id, slug, title, category, summary, content, cover_image_url, cover_image_alt, cover_image_credit, source_name, source_url, source_published_at, reading_minutes, whatsapp_share_text, relevance_score, relevance_reason, published_at, created_at, is_featured, featured_rank, show_in_carousel')
    .eq('status', 'published')
    .neq('id', currentId)
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('getRelatedPublishedNewsArticles failed:', error);
    return [];
  }

  return (Array.isArray(data) ? data : []).map((row) => mapRowToArticle(row as NewsRow));
}

export async function getAllPublishedNewsEntriesForSitemap(): Promise<Array<{ slug: string; updatedAt: string }>> {
  noStore();

  const supabase = createNewsReadClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('news_posts')
    .select('id, slug, title, updated_at, published_at, created_at')
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false, nullsFirst: false });

  if (error) {
    console.error('getAllPublishedNewsEntriesForSitemap failed:', error);
    return [];
  }

  return (Array.isArray(data) ? data : []).map((row: any) => ({
    slug: String(row.slug || '').trim() || buildStableNewsSlug(String(row.title || 'haber'), row.id),
    updatedAt: row.updated_at || row.published_at || row.created_at || new Date().toISOString(),
  }));
}
