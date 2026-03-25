import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL, DEFAULT_META } from '@/lib/utils/constants';

/**
 * Create metadata for a page
 */
export function createMetadata(options: {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const { title, description, path = '', image = '/images/og-default.jpg', noIndex = false } = options;

  const url = `${SITE_URL}${path}`;
  const imageUrl = image.startsWith('http://') || image.startsWith('https://') ? image : `${SITE_URL}${image}`;
  const fullTitle = `${title} | ${SITE_NAME}`;

  return {
    ...DEFAULT_META,
    title: fullTitle,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      ...DEFAULT_META.openGraph,
      title: fullTitle,
      description,
      url,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      ...DEFAULT_META.twitter,
      title: fullTitle,
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
    authors = ['almanya101'],
    tags = [],
    path,
    image = '/images/og-default.jpg',
  } = options;

  const baseMetadata = createMetadata({ title, description, path, image });

  return {
    ...baseMetadata,
    openGraph: {
      ...baseMetadata.openGraph!,
      type: 'article',
      publishedTime,
      modifiedTime,
      authors,
      tags,
    },
  };
}
