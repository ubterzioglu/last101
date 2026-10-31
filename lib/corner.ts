import 'server-only';

import { unstable_noStore as noStore } from 'next/cache';
import { createClient } from '@supabase/supabase-js';

import { SYSTEM_AUTHOR_SLUGS, authorProfileHref, isSystemAuthorSlug } from '@/lib/authors';
import { DEFAULT_COVER_IMAGE } from '@/lib/utils/constants';

export interface PublicCornerAuthor {
  id: string;
  slug: string;
  href: string;
  displayName: string;
  shortBio: string;
  bioContent: string;
  avatarImageUrl: string;
  displayOrder: number;
  updatedAt: string | null;
  posts?: PublicCornerPost[];
}

export interface PublicCornerPost {
  id: string;
  authorId: string | null;
  authorSlug?: string;
  authorName?: string;
  authorAvatarImageUrl?: string;
  slug: string;
  href: string;
  title: string;
  summary: string;
  content: string | null;
  coverImageUrl: string;
  readingMinutes: number;
  publishedAt: string;
  createdAt: string | null;
  updatedAt: string | null;
  dateLabel: string;
}

/** Lightweight entry for sitemap generation (no content, no limit). */
export interface CornerSitemapEntry {
  slug: string;
  href: string;
  publishedAt: string;
  updatedAt: string | null;
  authorSlug?: string;
}

export interface CornerAuthorRow {
  id: string;
  slug: string | null;
  display_name: string | null;
  short_bio: string | null;
  bio_content: string | null;
  avatar_image_url: string | null;
  display_order?: number | null;
  is_active?: boolean | null;
  updated_at: string | null;
}

export interface CornerPostRow {
  id: string;
  author_id: string | null;
  status?: string | null;
  title: string | null;
  summary: string | null;
  content?: string | null;
  cover_image_url: string | null;
  reading_minutes: number | null;
  published_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  corner_authors?: CornerAuthorRow | CornerAuthorRow[] | null;
}

/** Minimal row shape needed to decide public visibility. */
export type CornerVisibilityRow = Pick<CornerPostRow, 'author_id' | 'status' | 'corner_authors'>;

const DEFAULT_AVATAR = '/almanya101.png';
const SUPABASE_PAGE_SIZE = 1000;

const AUTHOR_COLUMNS = 'id, slug, display_name, short_bio, bio_content, avatar_image_url, display_order, updated_at';
const AUTHOR_JOIN = `corner_authors(${AUTHOR_COLUMNS}, is_active)`;
const POST_SUMMARY_COLUMNS = 'id, author_id, status, title, summary, cover_image_url, reading_minutes, published_at, created_at, updated_at';
const POST_FULL_COLUMNS = 'id, author_id, status, title, summary, content, cover_image_url, reading_minutes, published_at, created_at, updated_at';

function normalizeEnvValue(value: unknown): string {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
    return raw.slice(1, -1).trim();
  }
  return raw;
}

function createCornerReadClient() {
  const supabaseUrl = normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL);
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

const POST_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const TURKISH_SLUG_CHARS: Record<string, string> = {
  ç: 'c',
  ğ: 'g',
  ı: 'i',
  ö: 'o',
  ş: 's',
  ü: 'u',
};

function slugify(value: string): string {
  return value
    .toLocaleLowerCase('tr-TR')
    .replace(/[çğıöşü]/g, (char) => TURKISH_SLUG_CHARS[char] ?? char)
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function buildPostSlug(row: Pick<CornerPostRow, 'id' | 'title'>): string {
  const titlePart = slugify(String(row.title || 'yazi'));
  return `${titlePart || 'yazi'}--${row.id}`;
}

function getIdFromPostSlug(slug: string): string {
  const separatorIndex = slug.lastIndexOf('--');
  if (separatorIndex === -1) return '';
  return slug.slice(separatorIndex + 2).trim();
}

function formatCornerDate(dateValue: string | null): string {
  if (!dateValue) return 'Tarih belirtilmedi';
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return 'Tarih belirtilmedi';

  return parsed.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function firstRelatedAuthor(value: CornerPostRow['corner_authors']): CornerAuthorRow | undefined {
  if (Array.isArray(value)) return value[0];
  return value || undefined;
}

/**
 * Single source of truth for public visibility of a post (hub, related posts,
 * sitemap and detail page). A post is visible when it is published and either
 * has no author (falls back to the site author on the page) or its author is
 * visible and active in the join. Posts of passive authors stay hidden.
 */
export function isCornerPostPubliclyVisible(row: CornerVisibilityRow): boolean {
  if (row.status !== 'published') return false;
  if (!row.author_id) return true;

  const author = firstRelatedAuthor(row.corner_authors);
  return Boolean(author) && author?.is_active !== false;
}

/** Authors shown on author showcases; system authors (almanya101) are excluded. */
export function isShowcaseCornerAuthor(author: Pick<PublicCornerAuthor, 'slug'>): boolean {
  return !isSystemAuthorSlug(author.slug);
}

export function mapCornerAuthorRow(row: CornerAuthorRow, posts?: PublicCornerPost[]): PublicCornerAuthor {
  const slug = String(row.slug || '').trim();

  return {
    id: row.id,
    slug,
    href: authorProfileHref(slug),
    displayName: String(row.display_name || '').trim(),
    shortBio: String(row.short_bio || '').trim(),
    bioContent: String(row.bio_content || '').trim(),
    avatarImageUrl: String(row.avatar_image_url || DEFAULT_AVATAR).trim(),
    displayOrder: Number(row.display_order ?? 1000),
    updatedAt: row.updated_at,
    posts,
  };
}

export function mapCornerPostRow(
  row: CornerPostRow,
  author?: Pick<PublicCornerAuthor, 'slug' | 'displayName' | 'avatarImageUrl'>,
): PublicCornerPost {
  const title = String(row.title || 'Başlıksız yazı').trim();
  const publishedAt = row.published_at || row.created_at || new Date().toISOString();
  const slug = buildPostSlug(row);

  return {
    id: row.id,
    authorId: row.author_id,
    authorSlug: author?.slug || undefined,
    authorName: author?.displayName || undefined,
    authorAvatarImageUrl: author?.avatarImageUrl,
    slug,
    href: `/blog/${slug}`,
    title,
    summary: String(row.summary || '').trim(),
    content: row.content || null,
    coverImageUrl: String(row.cover_image_url || DEFAULT_COVER_IMAGE).trim(),
    readingMinutes: Math.max(1, Number(row.reading_minutes || 3)),
    publishedAt,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    dateLabel: formatCornerDate(publishedAt),
  };
}

function mapVisiblePostRow(row: CornerPostRow): PublicCornerPost {
  const authorRow = firstRelatedAuthor(row.corner_authors);
  const author = authorRow ? mapCornerAuthorRow(authorRow) : undefined;
  return mapCornerPostRow(row, author);
}

// Cacheable (no noStore): the hub renders with ISR and admin writes call revalidatePath.
async function fetchShowcaseAuthors(limit: number, logLabel: string): Promise<PublicCornerAuthor[]> {
  const supabase = createCornerReadClient();
  if (!supabase) return [];

  // Over-fetch by the number of system authors, then drop them (they can sort first).
  const { data, error } = await supabase
    .from('corner_authors')
    .select(AUTHOR_COLUMNS)
    .eq('is_active', true)
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: true })
    .limit(limit + SYSTEM_AUTHOR_SLUGS.length);

  if (error) {
    console.error(`${logLabel} failed:`, error);
    return [];
  }

  return (Array.isArray(data) ? (data as CornerAuthorRow[]) : [])
    .map((author) => mapCornerAuthorRow(author))
    .filter(isShowcaseCornerAuthor)
    .slice(0, limit);
}

export async function getFeaturedCornerAuthors(limit = 5): Promise<PublicCornerAuthor[]> {
  return fetchShowcaseAuthors(limit, 'getFeaturedCornerAuthors');
}

export async function getPublishedCornerAuthors(limit = 48): Promise<PublicCornerAuthor[]> {
  return fetchShowcaseAuthors(limit, 'getPublishedCornerAuthors');
}

async function fetchVisiblePosts(columns: string, limit: number, logLabel: string): Promise<PublicCornerPost[]> {
  const supabase = createCornerReadClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('corner_posts')
    .select(`${columns}, ${AUTHOR_JOIN}`)
    .eq('status', 'published')
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error(`${logLabel} failed:`, error);
    return [];
  }

  return (Array.isArray(data) ? (data as unknown as CornerPostRow[]) : [])
    .filter(isCornerPostPubliclyVisible)
    .map(mapVisiblePostRow);
}

/**
 * Newest-first list of visible posts without `content`. Cacheable (no noStore),
 * so ISR (`revalidate`) can be used by the hub and related-post lists.
 */
export async function getPublishedCornerPostSummaries(limit = 100): Promise<PublicCornerPost[]> {
  return fetchVisiblePosts(POST_SUMMARY_COLUMNS, limit, 'getPublishedCornerPostSummaries');
}

/** Kept for existing callers; newest first, `content` is null (use the detail getter for the body). */
export async function getPublishedCornerPosts(limit = 100): Promise<PublicCornerPost[]> {
  noStore();
  return fetchVisiblePosts(POST_SUMMARY_COLUMNS, limit, 'getPublishedCornerPosts');
}

/** All visible posts for the sitemap: no limit (paged internally), no content. */
export async function getAllCornerPostsForSitemap(): Promise<CornerSitemapEntry[]> {
  const supabase = createCornerReadClient();
  if (!supabase) return [];

  const entries: CornerSitemapEntry[] = [];
  for (let from = 0; ; from += SUPABASE_PAGE_SIZE) {
    const { data, error } = await supabase
      .from('corner_posts')
      .select(`${POST_SUMMARY_COLUMNS}, ${AUTHOR_JOIN}`)
      .eq('status', 'published')
      .order('published_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })
      .order('id', { ascending: true })
      .range(from, from + SUPABASE_PAGE_SIZE - 1);

    if (error) {
      console.error('getAllCornerPostsForSitemap failed:', error);
      return entries;
    }

    const rows = Array.isArray(data) ? (data as unknown as CornerPostRow[]) : [];
    for (const row of rows.filter(isCornerPostPubliclyVisible)) {
      const post = mapVisiblePostRow(row);
      entries.push({
        slug: post.slug,
        href: post.href,
        publishedAt: post.publishedAt,
        updatedAt: post.updatedAt,
        authorSlug: post.authorSlug,
      });
    }

    if (rows.length < SUPABASE_PAGE_SIZE) return entries;
  }
}

/** Active author without posts: cheap enough for redirect shells and bio lookups. */
export async function getPublishedCornerAuthorProfileBySlug(slug: string): Promise<PublicCornerAuthor | undefined> {
  const supabase = createCornerReadClient();
  if (!supabase) return undefined;

  const { data, error } = await supabase
    .from('corner_authors')
    .select(AUTHOR_COLUMNS)
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error('getPublishedCornerAuthorProfileBySlug failed:', error);
    return undefined;
  }

  return mapCornerAuthorRow(data as CornerAuthorRow);
}

/** Active author with their published posts (summary columns: no `content`), oldest first. */
export async function getPublishedCornerAuthorBySlug(slug: string): Promise<PublicCornerAuthor | undefined> {
  const supabase = createCornerReadClient();
  if (!supabase) return undefined;

  const { data: authorData, error: authorError } = await supabase
    .from('corner_authors')
    .select(AUTHOR_COLUMNS)
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  if (authorError || !authorData) {
    if (authorError) console.error('getPublishedCornerAuthorBySlug failed:', authorError);
    return undefined;
  }

  const author = mapCornerAuthorRow(authorData as CornerAuthorRow);
  const { data: postsData, error: postsError } = await supabase
    .from('corner_posts')
    .select(POST_SUMMARY_COLUMNS)
    .eq('author_id', author.id)
    .eq('status', 'published')
    .order('published_at', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: true });

  if (postsError) {
    console.error('getPublishedCornerAuthorBySlug posts failed:', postsError);
    return { ...author, posts: [] };
  }

  // The author was fetched as active above, so its published posts are visible.
  const posts = (Array.isArray(postsData) ? (postsData as CornerPostRow[]) : []).map((post) => mapCornerPostRow(post, author));
  return { ...author, posts };
}

export async function getPublishedCornerPostBySlug(slug: string): Promise<PublicCornerPost | undefined> {
  const id = getIdFromPostSlug(slug);
  // A non-UUID id would only make Postgres fail (22P02) and flood the logs.
  if (!id || !POST_ID_PATTERN.test(id)) return undefined;

  noStore();

  const supabase = createCornerReadClient();
  if (!supabase) return undefined;

  const { data, error } = await supabase
    .from('corner_posts')
    .select(`${POST_FULL_COLUMNS}, ${AUTHOR_JOIN}`)
    .eq('id', id)
    .eq('status', 'published')
    .maybeSingle();

  if (error || !data) {
    if (error) console.error('getPublishedCornerPostBySlug failed:', error);
    return undefined;
  }

  const row = data as unknown as CornerPostRow;
  if (!isCornerPostPubliclyVisible(row)) return undefined;
  return mapVisiblePostRow(row);
}
