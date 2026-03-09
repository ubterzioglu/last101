/**
 * JSON-LD Schema.org Structured Data
 * Renders JSON-LD script tags for SEO
 */

type JsonLdProps = {
  data: Record<string, any>;
};

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
    name: 'Almanya101',
    url: 'https://almanya101.com',
    logo: 'https://almanya101.com/logo.png',
    description: "Almanya'da yaşayan veya taşınmayı planlayan Türkler için kapsamlı bilgi rehberi, iş ilanları ve topluluk platformu.",
    sameAs: [
      'https://twitter.com/almanya101',
      'https://facebook.com/almanya101',
      'https://instagram.com/almanya101',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+491234567890',
      contactType: 'customer service',
      email: 'info@almanya101.com',
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
    name: 'Almanya101',
    url: 'https://almanya101.com',
    description: "Almanya'da yaşayan veya taşınmayı planlayan Türkler için kapsamlı bilgi rehberi",
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://almanya101.com/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
    inLanguage: 'tr',
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
}

export function ArticleJsonLd({
  title,
  description,
  datePublished,
  dateModified,
  author = 'Almanya101',
  url,
}: ArticleJsonLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: 'https://almanya101.com/images/og-default.jpg',
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Organization',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Almanya101',
      logo: {
        '@type': 'ImageObject',
        url: 'https://almanya101.com/logo.png',
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
    name: 'Almanya101',
    description: "Almanya'da yaşayan veya taşınmayı planlayan Türkler için kapsamlı bilgi rehberi",
    url: 'https://almanya101.com',
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
