import type { Metadata } from 'next';
import { hasMeaningfulUpdate } from '@/lib/articles/headings';
import { SITE_AUTHOR } from '@/lib/authors';
import {
  CANONICAL_SITE_URL,
  DEFAULT_KEYWORDS,
  DEFAULT_META,
  DEFAULT_OG_IMAGE,
  SEO_SITE_NAME,
} from '@/lib/utils/constants';

/**
 * Create metadata for a page
 */
export function createMetadata(options: {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  absoluteTitle?: boolean;
  keywords?: readonly string[];
  openGraphType?: 'website' | 'article';
}): Metadata {
  const {
    title,
    description,
    path = '',
    image = DEFAULT_OG_IMAGE,
    noIndex = false,
    absoluteTitle = false,
    keywords = DEFAULT_KEYWORDS,
    openGraphType = 'website',
  } = options;

  const normalizedPath = !path || path === '/' ? '' : path;
  const url = normalizedPath ? new URL(normalizedPath, CANONICAL_SITE_URL).toString() : `${CANONICAL_SITE_URL}/`;
  const imageUrl = image.startsWith('http://') || image.startsWith('https://') ? image : `${CANONICAL_SITE_URL}${image}`;
  const resolvedTitle = absoluteTitle ? title : `${title} | ${SEO_SITE_NAME}`;

  return {
    ...DEFAULT_META,
    title: resolvedTitle,
    description,
    keywords: [...keywords],
    alternates: {
      canonical: url,
    },
    openGraph: {
      ...DEFAULT_META.openGraph,
      type: openGraphType,
      title: resolvedTitle,
      description,
      url,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: resolvedTitle,
          ...(/\.png(\?|$)/.test(imageUrl) ? { type: 'image/png' } : {}),
        },
      ],
    },
    twitter: {
      ...DEFAULT_META.twitter,
      title: resolvedTitle,
      description,
      images: [imageUrl],
    },
    robots: noIndex ? 'noindex, nofollow' : 'index, follow',
  };
}

/**
 * Create metadata for article/content pages
 *
 * `authors` are author profile URLs (absolute or site paths), emitted as
 * `article:author`; they default to the site author profile. `modifiedTime`
 * is only emitted for a meaningful update (see hasMeaningfulUpdate).
 */
export function createArticleMetadata(options: {
  title: string;
  description: string;
  publishedTime: string;
  modifiedTime?: string | null;
  authors?: string[];
  tags?: string[];
  /** Article section, emitted as `article:section`. */
  section?: string;
  path: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const {
    title,
    description,
    publishedTime,
    modifiedTime,
    authors = [SITE_AUTHOR.href],
    tags = [],
    section,
    path,
    image = DEFAULT_OG_IMAGE,
    noIndex = false,
  } = options;

  const baseMetadata = createMetadata({ title, description, path, image, noIndex, openGraphType: 'article' });
  const baseOpenGraph = baseMetadata.openGraph ?? {};
  const openGraph = {
    ...baseOpenGraph,
    type: 'article' as const,
    publishedTime,
    ...(modifiedTime && hasMeaningfulUpdate(publishedTime, modifiedTime) ? { modifiedTime } : {}),
    authors: authors.map((author) => new URL(author, CANONICAL_SITE_URL).toString()),
    tags,
    ...(section ? { section } : {}),
  } satisfies NonNullable<Metadata['openGraph']>;

  return {
    ...baseMetadata,
    openGraph,
  };
}
