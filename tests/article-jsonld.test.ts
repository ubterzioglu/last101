import type { ReactElement } from 'react';
import { describe, expect, it } from 'vitest';
import {
  OrganizationJsonLd,
  WebPageJsonLd,
  buildArticleJsonLd,
  buildCollectionPageJsonLd,
  buildProfilePageJsonLd,
  buildWebPageJsonLd,
  organizationRef,
} from '@/components/seo/JsonLd';
import { SITE_AUTHOR, resolveArticleAuthor } from '@/lib/authors';
import { DEFAULT_COVER_IMAGE, DEFAULT_OG_IMAGE, SEO_SITE_NAME, SITE_URL } from '@/lib/utils/constants';

type Node = Record<string, unknown>;

const PAGE_URL = `${SITE_URL}/blog/baslik--11111111-1111-1111-1111-111111111111`;
const COLUMNIST = resolveArticleAuthor({ slug: 'ayse', displayName: 'Ayşe Yılmaz', avatarImageUrl: '/ayse.jpg' });
const COLUMNIST_URL = `${SITE_URL}/blog/yazar/ayse`;

const baseArticle = {
  title: 'Anmeldung nasıl yapılır?',
  description: 'Adım adım Anmeldung.',
  datePublished: '2026-10-01T10:00:00.000Z',
  url: PAGE_URL,
};

function dataOf(element: ReactElement): Node {
  return (element.props as { data: Node }).data;
}

/** Collects every `@id` -> set of `name`s found anywhere in the given nodes. */
function namesById(...roots: unknown[]): Map<string, Set<string>> {
  const result = new Map<string, Set<string>>();
  const visit = (value: unknown): void => {
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    if (!value || typeof value !== 'object') return;
    const node = value as Node;
    if (typeof node['@id'] === 'string' && typeof node.name === 'string') {
      const names = result.get(node['@id']) ?? new Set<string>();
      names.add(node.name);
      result.set(node['@id'], names);
    }
    Object.values(node).forEach(visit);
  };
  roots.forEach(visit);
  return result;
}

describe('organizationRef', () => {
  it('is a self-contained Organization node', () => {
    const org = organizationRef() as Node;

    expect(org['@type']).toBe('Organization');
    expect(org['@id']).toBe(`${SITE_URL}/#organization`);
    expect(org.name).toBe(SEO_SITE_NAME);
    expect(org.url).toBe(SITE_URL);
    expect(org.alternateName).toEqual(['almanya101']);
    expect(org.logo).toMatchObject({ '@type': 'ImageObject', url: `${SITE_URL}/almanya101.png` });
  });
});

describe('buildArticleJsonLd', () => {
  it('uses the Article type by default and BlogPosting on request', () => {
    expect(buildArticleJsonLd(baseArticle)['@type']).toBe('Article');
    expect(buildArticleJsonLd({ ...baseArticle, type: 'BlogPosting' })['@type']).toBe('BlogPosting');
  });

  it('writes language, section, keywords and word count when given', () => {
    const data = buildArticleJsonLd({
      ...baseArticle,
      articleSection: 'Köşe Yazıları',
      keywords: ['anmeldung', 'berlin'],
      wordCount: 840,
    });

    expect(data.inLanguage).toBe('tr');
    expect(data.articleSection).toBe('Köşe Yazıları');
    expect(data.keywords).toEqual(['anmeldung', 'berlin']);
    expect(data.wordCount).toBe(840);
  });

  it('omits optional fields that were not given', () => {
    const data = buildArticleJsonLd(baseArticle);

    expect('articleSection' in data).toBe(false);
    expect('keywords' in data).toBe(false);
    expect('wordCount' in data).toBe(false);
  });

  it('inlines the Organization for the site author and for the publisher', () => {
    const data = buildArticleJsonLd({ ...baseArticle, author: SITE_AUTHOR });
    const author = data.author as Node;
    const publisher = data.publisher as Node;

    expect(author).toMatchObject({
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: SEO_SITE_NAME,
      url: SITE_URL,
    });
    expect(publisher).toMatchObject({
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: SEO_SITE_NAME,
      url: SITE_URL,
    });
  });

  it('treats the legacy string author "almanya101" as the inline Organization', () => {
    const data = buildArticleJsonLd({ ...baseArticle, author: 'Almanya101' });

    expect(data.author).toMatchObject({ '@type': 'Organization', '@id': `${SITE_URL}/#organization`, name: SEO_SITE_NAME });
  });

  it('models a real columnist as a Person with a profile-page @id', () => {
    const data = buildArticleJsonLd({ ...baseArticle, author: COLUMNIST });

    expect(data.author).toEqual({
      '@type': 'Person',
      '@id': `${COLUMNIST_URL}#person`,
      name: 'Ayşe Yılmaz',
      url: COLUMNIST_URL,
      image: `${SITE_URL}/ayse.jpg`,
    });
  });

  it('supports the legacy string author with authorUrl', () => {
    const data = buildArticleJsonLd({
      ...baseArticle,
      author: 'Ayşe Yılmaz',
      authorType: 'Person',
      authorUrl: COLUMNIST_URL,
    });

    expect(data.author).toMatchObject({ '@type': 'Person', name: 'Ayşe Yılmaz', url: COLUMNIST_URL });
  });

  it('links the page via mainEntityOfPage and url', () => {
    const data = buildArticleJsonLd(baseArticle);

    expect(data.mainEntityOfPage).toEqual({ '@type': 'WebPage', '@id': PAGE_URL });
    expect(data.url).toBe(PAGE_URL);
  });

  describe('dateModified', () => {
    it('is omitted when there is no update', () => {
      expect('dateModified' in buildArticleJsonLd(baseArticle)).toBe(false);
    });

    it('is omitted for a same-day edit (not a meaningful update)', () => {
      const data = buildArticleJsonLd({ ...baseArticle, dateModified: '2026-10-01T18:00:00.000Z' });

      expect('dateModified' in data).toBe(false);
    });

    it('is omitted for an unparseable update date', () => {
      expect('dateModified' in buildArticleJsonLd({ ...baseArticle, dateModified: 'abc' })).toBe(false);
    });

    it('is written when the update is at least a day after publishing', () => {
      const data = buildArticleJsonLd({ ...baseArticle, dateModified: '2026-10-05T10:00:00.000Z' });

      expect(data.dateModified).toBe('2026-10-05T10:00:00.000Z');
    });
  });

  describe('image', () => {
    it('is an array with an absolute URL for a real cover', () => {
      const data = buildArticleJsonLd({ ...baseArticle, image: '/uploads/kapak.webp' });

      expect(data.image).toEqual([`${SITE_URL}/uploads/kapak.webp`]);
    });

    it('never equals the placeholder cover (relative or absolute)', () => {
      const relative = buildArticleJsonLd({ ...baseArticle, image: DEFAULT_COVER_IMAGE });
      const absolute = buildArticleJsonLd({ ...baseArticle, image: `${SITE_URL}${DEFAULT_COVER_IMAGE}` });
      const legacyJpg = buildArticleJsonLd({ ...baseArticle, image: '/images/hero-background.jpg' });

      for (const data of [relative, absolute, legacyJpg]) {
        expect(data.image).toEqual([`${SITE_URL}${DEFAULT_OG_IMAGE}`]);
      }
    });

    it('falls back to the OG banner when no image is given', () => {
      expect(buildArticleJsonLd(baseArticle).image).toEqual([`${SITE_URL}${DEFAULT_OG_IMAGE}`]);
    });
  });

  it('cites the source when given', () => {
    const data = buildArticleJsonLd({ ...baseArticle, sourceName: 'DW', sourceUrl: 'https://dw.com/x' });

    expect(data.citation).toEqual({ '@type': 'CreativeWork', name: 'DW', url: 'https://dw.com/x' });
  });
});

describe('buildProfilePageJsonLd', () => {
  it('describes the columnist with the same Person @id the articles use', () => {
    const profile = buildProfilePageJsonLd({ author: COLUMNIST, url: COLUMNIST_URL });
    const article = buildArticleJsonLd({ ...baseArticle, author: COLUMNIST });
    const person = profile.mainEntity as Node;

    expect(profile['@type']).toBe('ProfilePage');
    expect(profile.url).toBe(COLUMNIST_URL);
    expect(person['@type']).toBe('Person');
    expect(person['@id']).toBe((article.author as Node)['@id']);
    expect(person.name).toBe((article.author as Node).name);
  });

  it('uses the inline Organization for the site author', () => {
    const profile = buildProfilePageJsonLd({ author: SITE_AUTHOR, url: `${SITE_URL}${SITE_AUTHOR.href}` });

    expect(profile.mainEntity).toEqual(organizationRef());
  });

  it('adds description and avatar to the Person when given', () => {
    const profile = buildProfilePageJsonLd({
      author: COLUMNIST,
      url: COLUMNIST_URL,
      description: 'Berlin\'de yaşayan yazar.',
    });
    const person = profile.mainEntity as Node;

    expect(person.description).toBe('Berlin\'de yaşayan yazar.');
    expect(person.image).toBe(`${SITE_URL}/ayse.jpg`);
  });
});

describe('one @id, one name', () => {
  it('keeps the Organization name identical across article, publisher, profile and OrganizationJsonLd', () => {
    const article = buildArticleJsonLd({ ...baseArticle, author: SITE_AUTHOR });
    const profile = buildProfilePageJsonLd({ author: SITE_AUTHOR, url: `${SITE_URL}${SITE_AUTHOR.href}` });
    const organization = dataOf(OrganizationJsonLd() as ReactElement);

    const names = namesById(article, profile, organization).get(`${SITE_URL}/#organization`);

    expect(names).toEqual(new Set([SEO_SITE_NAME]));
  });

  it('keeps the Person name identical between article and profile page', () => {
    const article = buildArticleJsonLd({ ...baseArticle, author: COLUMNIST });
    const profile = buildProfilePageJsonLd({ author: COLUMNIST, url: COLUMNIST_URL });

    expect(namesById(article, profile).get(`${COLUMNIST_URL}#person`)).toEqual(new Set(['Ayşe Yılmaz']));
  });
});

describe('buildWebPageJsonLd / WebPageJsonLd', () => {
  const page = { title: 'Başlık', description: 'Açıklama', url: `${SITE_URL}/x` };

  it('defaults to WebPage and keeps the existing shape', () => {
    const data = buildWebPageJsonLd(page);

    expect(data['@type']).toBe('WebPage');
    expect(data['@id']).toBe(page.url);
    expect(data.isPartOf).toEqual({ '@id': `${SITE_URL}/#website` });
    expect(dataOf(WebPageJsonLd(page) as ReactElement)).toEqual(data);
  });

  it('accepts a custom @type', () => {
    expect(buildWebPageJsonLd({ ...page, type: 'CollectionPage' })['@type']).toBe('CollectionPage');
  });
});

describe('buildCollectionPageJsonLd', () => {
  it('lists the items as an ItemList with absolute URLs and positions', () => {
    const data = buildCollectionPageJsonLd({
      title: 'Blog',
      description: 'Köşe yazıları',
      url: `${SITE_URL}/blog`,
      items: [
        { url: '/blog/a--1', name: 'A' },
        { url: `${SITE_URL}/blog/b--2`, name: 'B' },
      ],
    });
    const list = data.mainEntity as Node;

    expect(data['@type']).toBe('CollectionPage');
    expect(list['@type']).toBe('ItemList');
    expect(list.numberOfItems).toBe(2);
    expect(list.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, url: `${SITE_URL}/blog/a--1`, name: 'A' },
      { '@type': 'ListItem', position: 2, url: `${SITE_URL}/blog/b--2`, name: 'B' },
    ]);
  });
});
