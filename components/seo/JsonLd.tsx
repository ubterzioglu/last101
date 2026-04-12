/**
 * JSON-LD Schema.org Structured Data
 * Renders JSON-LD script tags for SEO
 */

import {
  CONTACT_INFO,
  DEFAULT_META_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  SEO_SITE_NAME,
  SITE_URL,
  SOCIAL_LINKS,
} from '@/lib/utils/constants';

type JsonLdProps = {
  data: Record<string, unknown>;
};

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface WebPageJsonLdProps {
  title: string;
  description: string;
  url: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data, null, 2),
      }}
    />
  );
}

/**
 * Organization Schema
 */
export function OrganizationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SEO_SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/almanya101.png`,
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
    name: SEO_SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_META_DESCRIPTION,
    inLanguage: 'tr',
  };

  return <JsonLd data={data} />;
}

export function WebPageJsonLd({ title, description, url }: WebPageJsonLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url,
    inLanguage: 'tr',
    isPartOf: {
      '@type': 'WebSite',
      name: SEO_SITE_NAME,
      url: SITE_URL,
    },
  };

  return <JsonLd data={data} />;
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
interface ArticleJsonLdProps {
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  url: string;
  image?: string;
}

export function ArticleJsonLd({
  title,
  description,
  datePublished,
  dateModified,
  author = SEO_SITE_NAME,
  url,
  image = `${SITE_URL}${DEFAULT_OG_IMAGE}`,
}: ArticleJsonLdProps) {
  const imageUrl = image.startsWith('http://') || image.startsWith('https://') ? image : `${SITE_URL}${image}`;

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: imageUrl,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Organization',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: SEO_SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/almanya101.png`,
      },
    },
    url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
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
