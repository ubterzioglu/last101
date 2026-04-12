import type { Metadata } from 'next';
import {
  DEFAULT_KEYWORDS,
  DEFAULT_META,
  DEFAULT_OG_IMAGE,
  SEO_SITE_NAME,
  SITE_URL,
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

  const url = new URL(path || '/', SITE_URL).toString();
  const imageUrl = image.startsWith('http://') || image.startsWith('https://') ? image : `${SITE_URL}${image}`;
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
 */
export function createArticleMetadata(options: {
  title: string;
  description: string;
  publishedTime: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
  path: string;
  image?: string;
}): Metadata {
  const {
    title,
    description,
    publishedTime,
    modifiedTime,
    authors = [SEO_SITE_NAME],
    tags = [],
    path,
    image = DEFAULT_OG_IMAGE,
  } = options;

  const baseMetadata = createMetadata({ title, description, path, image, openGraphType: 'article' });

  return {
    ...baseMetadata,
    openGraph: {
      ...baseMetadata.openGraph!,
      publishedTime,
      modifiedTime,
      authors,
      tags,
    },
  };
}
