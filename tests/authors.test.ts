import { describe, expect, it } from 'vitest';
import {
  SITE_AUTHOR,
  SITE_AUTHOR_SLUG,
  SYSTEM_AUTHOR_SLUGS,
  authorProfileHref,
  resolveArticleAuthor,
} from '@/lib/authors';
import { SEO_SITE_NAME } from '@/lib/utils/constants';

describe('SITE_AUTHOR', () => {
  it('is the editorial organisation named after the site brand', () => {
    expect(SITE_AUTHOR.kind).toBe('Organization');
    expect(SITE_AUTHOR.name).toBe(SEO_SITE_NAME);
    expect(SITE_AUTHOR.slug).toBe(SITE_AUTHOR_SLUG);
    expect(SITE_AUTHOR.href).toBe('/blog/yazar/almanya101');
  });
});

describe('resolveArticleAuthor', () => {
  it('falls back to the site author when there is no columnist', () => {
    expect(resolveArticleAuthor()).toBe(SITE_AUTHOR);
    expect(resolveArticleAuthor(null)).toBe(SITE_AUTHOR);
    expect(resolveArticleAuthor({ slug: '', displayName: 'Boş' })).toBe(SITE_AUTHOR);
  });

  it('maps every system author slug to the site author, case-insensitively', () => {
    for (const slug of SYSTEM_AUTHOR_SLUGS) {
      expect(resolveArticleAuthor({ slug, displayName: 'Başka Ad' })).toBe(SITE_AUTHOR);
    }
    expect(resolveArticleAuthor({ slug: ' ALMANYA101 ', displayName: 'Başka Ad' })).toBe(SITE_AUTHOR);
  });

  it('keeps a real columnist as a Person with a profile link', () => {
    const author = resolveArticleAuthor({ slug: 'ayse', displayName: 'Ayşe Yılmaz', avatarImageUrl: '/a.jpg' });

    expect(author).toEqual({
      slug: 'ayse',
      name: 'Ayşe Yılmaz',
      href: authorProfileHref('ayse'),
      kind: 'Person',
      avatarUrl: '/a.jpg',
    });
    expect(author.href).toBe('/blog/yazar/ayse');
  });

  it('omits avatarUrl when the columnist has none', () => {
    const author = resolveArticleAuthor({ slug: 'ayse', displayName: 'Ayşe', avatarImageUrl: null });

    expect(author.kind).toBe('Person');
    expect('avatarUrl' in author).toBe(false);
  });
});
