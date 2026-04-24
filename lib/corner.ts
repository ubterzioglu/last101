import 'server-only';

import { unstable_noStore as noStore } from 'next/cache';
import { createClient } from '@supabase/supabase-js';

export interface CornerAuthorProfile {
  id: string;
  displayName: string;
  shortBio: string;
  bioContent: string;
  avatarImageUrl: string;
  updatedAt: string | null;
}

export interface PublicCornerPost {
  id: string;
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

interface CornerProfileRow {
  id: string;
  display_name: string | null;
  short_bio: string | null;
  bio_content: string | null;
  avatar_image_url: string | null;
  updated_at: string | null;
}

interface CornerPostRow {
  id: string;
  title: string | null;
  summary: string | null;
  content: string | null;
  cover_image_url: string | null;
  reading_minutes: number | null;
  published_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

const DEFAULT_PROFILE: CornerAuthorProfile = {
  id: 'default',
  displayName: 'Arkadaşın Köşesi',
  shortBio: 'Almanya yolculuğunu, gündelik hayatı ve kişisel notları samimi bir dille paylaşan özel köşe.',
  bioContent: '## Ben kimim?\n\nBu alan yakında güncellenecek.',
  avatarImageUrl: '/images/profil.jpg',
  updatedAt: null,
};

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

function buildCornerSlug(row: Pick<CornerPostRow, 'id' | 'title'>): string {
  const titlePart = slugify(String(row.title || 'yazi'));
  return `${titlePart || 'yazi'}--${row.id}`;
}

function getIdFromCornerSlug(slug: string): string {
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

function mapProfileRow(row?: CornerProfileRow | null): CornerAuthorProfile {
  if (!row) return DEFAULT_PROFILE;

  return {
    id: row.id,
    displayName: String(row.display_name || DEFAULT_PROFILE.displayName).trim(),
    shortBio: String(row.short_bio || DEFAULT_PROFILE.shortBio).trim(),
    bioContent: String(row.bio_content || DEFAULT_PROFILE.bioContent).trim(),
    avatarImageUrl: String(row.avatar_image_url || DEFAULT_PROFILE.avatarImageUrl).trim(),
    updatedAt: row.updated_at,
  };
}

function mapPostRow(row: CornerPostRow): PublicCornerPost {
  const title = String(row.title || 'Başlıksız yazı').trim();
  const publishedAt = row.published_at || row.created_at || new Date().toISOString();
  const slug = buildCornerSlug(row);

  return {
    id: row.id,
    slug,
    href: `/yazi-dizisi/${slug}`,
    title,
    summary: String(row.summary || '').trim(),
    content: row.content || null,
    coverImageUrl: String(row.cover_image_url || '/images/hero-background.jpg').trim(),
    readingMinutes: Math.max(1, Number(row.reading_minutes || 3)),
    publishedAt,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    dateLabel: formatCornerDate(publishedAt),
  };
}

export async function getCornerAuthorProfile(): Promise<CornerAuthorProfile> {
  noStore();

  const supabase = createCornerReadClient();
  if (!supabase) return DEFAULT_PROFILE;

  const { data, error } = await supabase
    .from('corner_author_profile')
    .select('id, display_name, short_bio, bio_content, avatar_image_url, updated_at')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('getCornerAuthorProfile failed:', error);
    return DEFAULT_PROFILE;
  }

  return mapProfileRow(data as CornerProfileRow | null);
}

async function fetchPublishedCornerRows(limit = 24): Promise<CornerPostRow[]> {
  noStore();

  const supabase = createCornerReadClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('corner_posts')
    .select('id, title, summary, content, cover_image_url, reading_minutes, published_at, created_at, updated_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('fetchPublishedCornerRows failed:', error);
    return [];
  }

  return Array.isArray(data) ? (data as CornerPostRow[]) : [];
}

export async function getPublishedCornerPosts(limit = 24): Promise<PublicCornerPost[]> {
  const rows = await fetchPublishedCornerRows(limit);
  return rows.map(mapPostRow);
}

export async function getPublishedCornerPostBySlug(slug: string): Promise<PublicCornerPost | undefined> {
  const id = getIdFromCornerSlug(slug);
  if (!id) return undefined;

  noStore();

  const supabase = createCornerReadClient();
  if (!supabase) return undefined;

  const { data, error } = await supabase
    .from('corner_posts')
    .select('id, title, summary, content, cover_image_url, reading_minutes, published_at, created_at, updated_at')
    .eq('id', id)
    .eq('status', 'published')
    .maybeSingle();

  if (error || !data) {
    if (error) console.error('getPublishedCornerPostBySlug failed:', error);
    return undefined;
  }

  return mapPostRow(data as CornerPostRow);
}
