import { SEO_SITE_NAME } from '@/lib/utils/constants';

/** Slug of the editorial (organisation) author used for anonymous content. */
export const SITE_AUTHOR_SLUG = 'almanya101';

/**
 * Author slugs owned by the system. Their rows can be edited (name, bio,
 * avatar) but never renamed, deactivated or deleted: deleting the row would
 * cascade-delete every post attributed to it.
 */
export const SYSTEM_AUTHOR_SLUGS: readonly string[] = [SITE_AUTHOR_SLUG];

export type ArticleAuthorKind = 'Person' | 'Organization';

export interface ArticleAuthorRef {
  slug: string;
  name: string;
  /** Internal profile URL (path), e.g. /blog/yazar/almanya101. */
  href: string;
  kind: ArticleAuthorKind;
  avatarUrl?: string;
}

/** Minimal shape of a real columnist, kept independent of lib/corner (server-only). */
export interface ColumnistLike {
  slug: string;
  displayName: string;
  avatarImageUrl?: string | null;
}

export const SITE_AUTHOR: ArticleAuthorRef = {
  slug: SITE_AUTHOR_SLUG,
  name: SEO_SITE_NAME,
  href: `/blog/yazar/${SITE_AUTHOR_SLUG}`,
  kind: 'Organization',
  avatarUrl: '/almanya101.png',
};

export const SITE_AUTHOR_SHORT_BIO =
  'almanya101 editör ekibi: Almanya\'da yaşam, vize, iş ve günlük işlemler üzerine rehberleri ve haberleri hazırlar ve günceller.';

export function authorProfileHref(slug: string): string {
  return `/blog/yazar/${slug}`;
}

export function isSystemAuthorSlug(slug: string | null | undefined): boolean {
  return Boolean(slug) && SYSTEM_AUTHOR_SLUGS.includes(String(slug).trim().toLowerCase());
}

/**
 * Single place that decides who an article is attributed to. A real columnist
 * stays a Person; anything without an author (guides, news, posts with no
 * author) is attributed to the site's editorial organisation.
 */
export function resolveArticleAuthor(columnist?: ColumnistLike | null): ArticleAuthorRef {
  if (!columnist || !columnist.slug || isSystemAuthorSlug(columnist.slug)) {
    return SITE_AUTHOR;
  }

  return {
    slug: columnist.slug,
    name: columnist.displayName,
    href: authorProfileHref(columnist.slug),
    kind: 'Person',
    ...(columnist.avatarImageUrl ? { avatarUrl: columnist.avatarImageUrl } : {}),
  };
}
