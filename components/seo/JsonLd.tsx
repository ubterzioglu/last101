/**
 * JSON-LD Schema.org Structured Data
 * Renders JSON-LD script tags for SEO
 */

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

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface WebPageJsonLdProps {
  title: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
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
    '@id': `${SITE_URL}/#organization`,
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
    '@id': `${SITE_URL}/#website`,
    name: SEO_SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_META_DESCRIPTION,
    inLanguage: 'tr',
    publisher: { '@id': `${SITE_URL}/#organization` },
  };

  return <JsonLd data={data} />;
}

export function WebPageJsonLd({ title, description, url, datePublished, dateModified }: WebPageJsonLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': url,
    name: title,
    description,
    url,
    inLanguage: 'tr',
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified }),
    isPartOf: { '@id': `${SITE_URL}/#website` },
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
  /** Yazar gerçek bir kişiyse 'Person' verilir; varsayılan 'Organization'. */
  authorType?: 'Person' | 'Organization';
  /** Yazar sayfasının mutlak URL'i (E-E-A-T için). */
  authorUrl?: string;
  url: string;
  image?: string;
  /** Sayfadaki görünür "Kaynak" bloğuyla eşleşen kaynak adı/bağlantısı. */
  sourceName?: string;
  sourceUrl?: string;
}

export function ArticleJsonLd({
  title,
  description,
  datePublished,
  dateModified,
  author = SEO_SITE_NAME,
  authorType = 'Organization',
  authorUrl,
  url,
  image = `${SITE_URL}${DEFAULT_OG_IMAGE}`,
  sourceName,
  sourceUrl,
}: ArticleJsonLdProps) {
  const imageUrl = image.startsWith('http://') || image.startsWith('https://') ? image : `${SITE_URL}${image}`;
  const isSiteOrganization =
    author.toLowerCase() === SEO_SITE_NAME.toLowerCase() || author.toLowerCase() === SITE_NAME.toLowerCase();

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: imageUrl,
    datePublished,
    dateModified: dateModified || datePublished,
    ...(sourceName || sourceUrl
      ? {
          citation: {
            '@type': 'CreativeWork',
            ...(sourceName ? { name: sourceName } : {}),
            ...(sourceUrl ? { url: sourceUrl } : {}),
          },
        }
      : {}),
    author: isSiteOrganization
      ? { '@id': `${SITE_URL}/#organization` }
      : {
          '@type': authorType,
          name: author,
          ...(authorUrl ? { url: authorUrl } : {}),
        },
    publisher: { '@id': `${SITE_URL}/#organization` },
    url,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };

  return <JsonLd data={data} />;
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



export function SpeakableJsonLd({ xpath, cssSelector }: { xpath?: string[]; cssSelector?: string[] }) {
  const speakable: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'SpeakableSpecification',
  };
  if (xpath) speakable.xpath = xpath;
  if (cssSelector) speakable.cssSelector = cssSelector;

  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: SEO_SITE_NAME,
    url: SITE_URL,
    speakable,
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
