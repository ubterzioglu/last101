/**
 * JSON-LD Schema.org Structured Data
 * Renders JSON-LD script tags for SEO
 */

import { realCoverUrl } from '@/components/news/cover';
import { hasMeaningfulUpdate } from '@/lib/articles/headings';
import { SITE_AUTHOR_SLUG } from '@/lib/authors';
import type { ArticleAuthorRef } from '@/lib/authors';
import {
  CONTACT_INFO,
  DEFAULT_META_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  SEO_SITE_NAME,
  SITE_NAME,
  SITE_URL,
  SOCIAL_LINKS,
} from '@/lib/utils/constants';

type JsonLdProps = {
  data: Record<string, unknown>;
};

type JsonLdNode = Record<string, unknown>;

interface BreadcrumbItem {
  name: string;
  url: string;
}

/** Schema.org page types the generic WebPage builder is used for. */
export type WebPageType = 'WebPage' | 'CollectionPage' | 'ProfilePage' | 'AboutPage' | 'ContactPage';

interface WebPageJsonLdProps {
  title: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  /** Schema.org @type; defaults to 'WebPage'. */
  type?: WebPageType;
  /** Optional main entity node (Person, Organization, ItemList...). */
  mainEntity?: JsonLdNode;
}

interface FaqItem {
  question: string;
  answer: string;
}

const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const ORGANIZATION_ALTERNATE_NAMES: readonly string[] = ['almanya101'];

function isAbsoluteUrl(value: string): boolean {
  return value.startsWith('http://') || value.startsWith('https://');
}

/** Absolute URL for a site path; absolute URLs pass through. */
function absoluteUrl(value: string): string {
  return isAbsoluteUrl(value) ? value : new URL(value, SITE_URL).toString();
}

/** Site-relative path of an image URL (absolute URLs of this site are stripped to a path). */
function toSitePath(value: string): string {
  const prefix = SITE_URL.replace(/\/+$/, '');
  return value.startsWith(`${prefix}/`) ? value.slice(prefix.length) : value;
}

/**
 * JSON for an inline <script>. `JSON.stringify` leaves `<`, `>` and `&` as is, so a
 * title such as `</script><script>...` would close the block and run markup. Escaping
 * them (and the JS line separators) keeps the payload valid JSON and inert in HTML.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data, null, 2)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(new RegExp('\\u2028', 'g'), '\\u2028')
    .replace(new RegExp('\\u2029', 'g'), '\\u2029');
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: serializeJsonLd(data),
      }}
    />
  );
}

/**
 * Self-contained Organization node. Article author (site author), publisher and
 * ProfilePage.mainEntity inline this so crawlers that parse a single block never
 * meet a dangling `@id` reference.
 */
export function organizationRef(): JsonLdNode {
  return {
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: SEO_SITE_NAME,
    alternateName: [...ORGANIZATION_ALTERNATE_NAMES],
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/almanya101.png`,
    },
  };
}

/**
 * Person node for a real columnist. The `@id` is the author page URL plus
 * `#person`, so the article author and the ProfilePage main entity merge.
 */
export function personRef(author: ArticleAuthorRef, extra: { description?: string } = {}): JsonLdNode {
  const profileUrl = absoluteUrl(author.href);

  return {
    '@type': 'Person',
    '@id': `${profileUrl}#person`,
    name: author.name,
    url: profileUrl,
    ...(extra.description ? { description: extra.description } : {}),
    ...(author.avatarUrl ? { image: absoluteUrl(author.avatarUrl) } : {}),
  };
}

function isSiteAuthor(author: ArticleAuthorRef): boolean {
  return author.kind === 'Organization' && author.slug === SITE_AUTHOR_SLUG;
}

/** JSON-LD node for any resolved author (site Organization, other Organization or Person). */
export function authorNode(author: ArticleAuthorRef, extra: { description?: string } = {}): JsonLdNode {
  if (isSiteAuthor(author)) return organizationRef();
  if (author.kind === 'Organization') {
    return { '@type': 'Organization', name: author.name, url: absoluteUrl(author.href) };
  }
  return personRef(author, extra);
}

/**
 * Organization Schema
 */
export function OrganizationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    ...organizationRef(),
    description: DEFAULT_META_DESCRIPTION,
    sameAs: Object.values(SOCIAL_LINKS),
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: CONTACT_INFO.phone,
      contactType: 'customer service',
      email: CONTACT_INFO.email,
      availableLanguage: ['Turkish', 'German', 'English'],
    },
  };

  return <JsonLd data={data} />;
}

/**
 * WebSite Schema
 */
export function WebSiteJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: SEO_SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_META_DESCRIPTION,
    inLanguage: 'tr',
    publisher: { '@id': ORGANIZATION_ID },
  };

  return <JsonLd data={data} />;
}

export function buildWebPageJsonLd({
  title,
  description,
  url,
  datePublished,
  dateModified,
  type = 'WebPage',
  mainEntity,
}: WebPageJsonLdProps): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@type': type,
    '@id': url,
    name: title,
    description,
    url,
    inLanguage: 'tr',
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified }),
    isPartOf: { '@id': WEBSITE_ID },
    ...(mainEntity ? { mainEntity } : {}),
  };
}

export function WebPageJsonLd(props: WebPageJsonLdProps) {
  return <JsonLd data={buildWebPageJsonLd(props)} />;
}

interface ProfilePageJsonLdProps {
  author: ArticleAuthorRef;
  /** Absolute URL of the author page. */
  url: string;
  /** Page name; defaults to the author name. */
  title?: string;
  /** Bio shown on the page; also set on the Person node. */
  description?: string;
}

export function buildProfilePageJsonLd({ author, url, title, description }: ProfilePageJsonLdProps): JsonLdNode {
  const mainEntity = authorNode(author, { description });

  return buildWebPageJsonLd({
    title: title ?? author.name,
    description: description ?? author.name,
    url,
    type: 'ProfilePage',
    mainEntity,
  });
}

/** ProfilePage whose main entity is the same Person (or Organization) node the articles use. */
export function ProfilePageJsonLd(props: ProfilePageJsonLdProps) {
  return <JsonLd data={buildProfilePageJsonLd(props)} />;
}

interface CollectionItem {
  /** Absolute URL or site path. */
  url: string;
  name: string;
}

interface CollectionPageJsonLdProps {
  title: string;
  description: string;
  url: string;
  items: readonly CollectionItem[];
}

export function buildCollectionPageJsonLd({ title, description, url, items }: CollectionPageJsonLdProps): JsonLdNode {
  return buildWebPageJsonLd({
    title,
    description,
    url,
    type: 'CollectionPage',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: absoluteUrl(item.url),
        name: item.name,
      })),
    },
  });
}

/** Hub/listing page: CollectionPage with an ItemList of its entries. */
export function CollectionPageJsonLd(props: CollectionPageJsonLdProps) {
  return <JsonLd data={buildCollectionPageJsonLd(props)} />;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <JsonLd data={data} />;
}

export function FaqJsonLd({ items }: { items: FaqItem[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return <JsonLd data={data} />;
}

/**
 * Article Schema (for content pages)
 */
export interface ArticleJsonLdProps {
  title: string;
  description: string;
  datePublished: string;
  /** Written as `dateModified` only when it is a meaningful update (see hasMeaningfulUpdate). */
  dateModified?: string | null;
  /**
   * Resolved author (preferred), or a plain name. The site author / "almanya101"
   * becomes an inline Organization; a real columnist becomes a Person.
   */
  author?: string | ArticleAuthorRef;
  /** Legacy string-author only: 'Person' for a real person; default 'Organization'. */
  authorType?: 'Person' | 'Organization';
  /** Legacy string-author only: absolute URL of the author page. */
  authorUrl?: string;
  url: string;
  /** Cover URL; placeholder covers are replaced with the OG banner. */
  image?: string | null;
  /** 'BlogPosting' for blog posts; default 'Article'. */
  type?: 'Article' | 'BlogPosting';
  articleSection?: string;
  keywords?: readonly string[] | string;
  wordCount?: number;
  /** Sayfadaki görünür "Kaynak" bloğuyla eşleşen kaynak adı/bağlantısı. */
  sourceName?: string;
  sourceUrl?: string;
}

function legacyAuthorNode(
  name: string,
  authorType: 'Person' | 'Organization',
  authorUrl: string | undefined,
): JsonLdNode {
  const lower = name.toLowerCase();
  if (lower === SEO_SITE_NAME.toLowerCase() || lower === SITE_NAME.toLowerCase()) return organizationRef();

  return {
    '@type': authorType,
    ...(authorUrl ? { '@id': `${authorUrl}#${authorType.toLowerCase()}` } : {}),
    name,
    ...(authorUrl ? { url: authorUrl } : {}),
  };
}

function resolveArticleImage(image: string | null | undefined): string {
  const real = image ? realCoverUrl(toSitePath(image)) : null;
  return absoluteUrl(real ?? DEFAULT_OG_IMAGE);
}

export function buildArticleJsonLd({
  title,
  description,
  datePublished,
  dateModified,
  author = SEO_SITE_NAME,
  authorType = 'Organization',
  authorUrl,
  url,
  image,
  type = 'Article',
  articleSection,
  keywords,
  wordCount,
  sourceName,
  sourceUrl,
}: ArticleJsonLdProps): JsonLdNode {
  const authorData = typeof author === 'string' ? legacyAuthorNode(author, authorType, authorUrl) : authorNode(author);

  return {
    '@context': 'https://schema.org',
    '@type': type,
    headline: title,
    description,
    inLanguage: 'tr',
    image: [resolveArticleImage(image)],
    datePublished,
    ...(dateModified && hasMeaningfulUpdate(datePublished, dateModified) ? { dateModified } : {}),
    ...(articleSection ? { articleSection } : {}),
    ...(keywords && keywords.length > 0 ? { keywords: typeof keywords === 'string' ? keywords : [...keywords] } : {}),
    ...(typeof wordCount === 'number' && wordCount > 0 ? { wordCount } : {}),
    ...(sourceName || sourceUrl
      ? {
          citation: {
            '@type': 'CreativeWork',
            ...(sourceName ? { name: sourceName } : {}),
            ...(sourceUrl ? { url: sourceUrl } : {}),
          },
        }
      : {}),
    author: authorData,
    publisher: organizationRef(),
    url,
    isPartOf: { '@id': WEBSITE_ID },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };
}

export function ArticleJsonLd(props: ArticleJsonLdProps) {
  return <JsonLd data={buildArticleJsonLd(props)} />;
}

interface HowToStep {
  name: string;
  text: string;
}

export function HowToJsonLd({ name, description, steps }: { name: string; description: string; steps: HowToStep[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };

  return <JsonLd data={data} />;
}

interface SpeakableJsonLdProps {
  xpath?: string[];
  cssSelector?: string[];
}

export function SpeakableJsonLd({ xpath, cssSelector }: SpeakableJsonLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: SEO_SITE_NAME,
    url: SITE_URL,
    speakable: {
      '@context': 'https://schema.org',
      '@type': 'SpeakableSpecification',
      ...(xpath ? { xpath } : {}),
      ...(cssSelector ? { cssSelector } : {}),
    },
  };

  return <JsonLd data={data} />;
}

/**
 * LocalBusiness Schema (for Germany targeting)
 */
export function LocalBusinessJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: SEO_SITE_NAME,
    description: DEFAULT_META_DESCRIPTION,
    url: SITE_URL,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'DE',
      addressRegion: 'Berlin',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 52.520008,
      longitude: 13.404954,
    },
    areaServed: [
      {
        '@type': 'Country',
        name: 'Germany',
      },
    ],
    availableLanguage: ['Turkish', 'German', 'English'],
  };

  return <JsonLd data={data} />;
}
