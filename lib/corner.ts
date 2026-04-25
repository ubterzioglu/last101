import 'server-only';

import { unstable_noStore as noStore } from 'next/cache';
import { createClient } from '@supabase/supabase-js';

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

interface CornerAuthorRow {
  id: string;
  slug: string | null;
  display_name: string | null;
  short_bio: string | null;
  bio_content: string | null;
  avatar_image_url: string | null;
  display_order?: number | null;
  updated_at: string | null;
}

interface CornerPostRow {
  id: string;
  author_id: string | null;
  title: string | null;
  summary: string | null;
  content: string | null;
  cover_image_url: string | null;
  reading_minutes: number | null;
  published_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  corner_authors?: CornerAuthorRow | CornerAuthorRow[] | null;
}

const DEFAULT_AVATAR = '/images/profil.jpg';
const DEFAULT_COVER = '/images/hero-background.jpg';

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

function slugify(value: string): string {
  return value
    .toLocaleLowerCase('tr-TR')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
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

function mapAuthorRow(row: CornerAuthorRow, posts?: PublicCornerPost[]): PublicCornerAuthor {
  const slug = String(row.slug || '').trim();
  const displayName = String(row.display_name || 'Arkadaşın Köşesi').trim();

  return {
    id: row.id,
    slug,
    href: `/${slug}`,
    displayName,
    shortBio: String(row.short_bio || '').trim(),
    bioContent: String(row.bio_content || '').trim(),
    avatarImageUrl: String(row.avatar_image_url || DEFAULT_AVATAR).trim(),
    displayOrder: Number(row.display_order ?? 1000),
    updatedAt: row.updated_at,
    posts,
  };
}

function mapPostRow(row: CornerPostRow, author?: Pick<PublicCornerAuthor, 'slug' | 'displayName' | 'avatarImageUrl'>): PublicCornerPost {
  const title = String(row.title || 'Başlıksız yazı').trim();
  const publishedAt = row.published_at || row.created_at || new Date().toISOString();
  const slug = buildPostSlug(row);
  const authorSlug = author?.slug;

  return {
    id: row.id,
    authorId: row.author_id,
    authorSlug,
    authorName: author?.displayName,
    authorAvatarImageUrl: author?.avatarImageUrl,
    slug,
    href: `/yazi-dizisi/${slug}`,
    title,
    summary: String(row.summary || '').trim(),
    content: row.content || null,
    coverImageUrl: String(row.cover_image_url || DEFAULT_COVER).trim(),
    readingMinutes: Math.max(1, Number(row.reading_minutes || 3)),
    publishedAt,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    dateLabel: formatCornerDate(publishedAt),
  };
}

function firstRelatedAuthor(value: CornerPostRow['corner_authors']): CornerAuthorRow | undefined {
  if (Array.isArray(value)) return value[0];
  return value || undefined;
}

export async function getFeaturedCornerAuthors(limit = 5): Promise<PublicCornerAuthor[]> {
  noStore();

  const supabase = createCornerReadClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('corner_authors')
    .select('id, slug, display_name, short_bio, bio_content, avatar_image_url, display_order, updated_at')
    .eq('is_active', true)
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('getFeaturedCornerAuthors failed:', error);
    return [];
  }

  return (Array.isArray(data) ? (data as CornerAuthorRow[]) : []).map((author) => mapAuthorRow(author));
}

export async function getPublishedCornerAuthors(limit = 48): Promise<PublicCornerAuthor[]> {
  noStore();

  const supabase = createCornerReadClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('corner_authors')
    .select('id, slug, display_name, short_bio, bio_content, avatar_image_url, display_order, updated_at')
    .eq('is_active', true)
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('getPublishedCornerAuthors failed:', error);
    return [];
  }

  return (Array.isArray(data) ? (data as CornerAuthorRow[]) : []).map((author) => mapAuthorRow(author));
}

export async function getPublishedCornerPosts(limit = 100): Promise<PublicCornerPost[]> {
  noStore();

  const supabase = createCornerReadClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('corner_posts')
    .select('id, author_id, title, summary, content, cover_image_url, reading_minutes, published_at, created_at, updated_at, corner_authors(id, slug, display_name, short_bio, bio_content, avatar_image_url, display_order, updated_at)')
    .eq('status', 'published')
    .order('published_at', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('getPublishedCornerPosts failed:', error);
    return [];
  }

  return (Array.isArray(data) ? (data as unknown as CornerPostRow[]) : [])
    .map((post) => {
      const authorRow = firstRelatedAuthor(post.corner_authors);
      const author = authorRow ? mapAuthorRow(authorRow) : undefined;
      return mapPostRow(post, author);
    })
    .filter((post) => Boolean(post.authorSlug));
}

export async function getPublishedCornerAuthorBySlug(slug: string): Promise<PublicCornerAuthor | undefined> {
  noStore();

  const supabase = createCornerReadClient();
  if (!supabase) return undefined;

  const { data: authorData, error: authorError } = await supabase
    .from('corner_authors')
    .select('id, slug, display_name, short_bio, bio_content, avatar_image_url, display_order, updated_at')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  if (authorError || !authorData) {
    if (authorError) console.error('getPublishedCornerAuthorBySlug failed:', authorError);
    return undefined;
  }

  const author = mapAuthorRow(authorData as CornerAuthorRow);
  const { data: postsData, error: postsError } = await supabase
    .from('corner_posts')
    .select('id, author_id, title, summary, content, cover_image_url, reading_minutes, published_at, created_at, updated_at')
    .eq('author_id', author.id)
    .eq('status', 'published')
    .order('published_at', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: true });

  if (postsError) {
    console.error('getPublishedCornerAuthorBySlug posts failed:', postsError);
    return { ...author, posts: [] };
  }

  const posts = (Array.isArray(postsData) ? (postsData as CornerPostRow[]) : []).map((post) => mapPostRow(post, author));
  return { ...author, posts };
}

export async function getPublishedCornerPostBySlug(slug: string): Promise<PublicCornerPost | undefined> {
  const id = getIdFromPostSlug(slug);
  if (!id) return undefined;

  noStore();

  const supabase = createCornerReadClient();
  if (!supabase) return undefined;

  const { data, error } = await supabase
    .from('corner_posts')
    .select('id, author_id, title, summary, content, cover_image_url, reading_minutes, published_at, created_at, updated_at, corner_authors(id, slug, display_name, short_bio, bio_content, avatar_image_url, display_order, updated_at)')
    .eq('id', id)
    .eq('status', 'published')
    .maybeSingle();

  if (error || !data) {
    if (error) console.error('getPublishedCornerPostBySlug failed:', error);
    return undefined;
  }

  const row = data as unknown as CornerPostRow;
  const authorRow = firstRelatedAuthor(row.corner_authors);
  const author = authorRow ? mapAuthorRow(authorRow) : undefined;
  return mapPostRow(row, author);
}
