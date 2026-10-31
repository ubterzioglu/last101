import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { load } from 'cheerio';
import { describe, expect, it } from 'vitest';

import { AuthorBox } from '@/components/articles/AuthorBox';
import { ArticleShell } from '@/components/news/ArticleShell';
import { SITE_AUTHOR, SITE_AUTHOR_SHORT_BIO } from '@/lib/authors';

function renderShell(author: { name: string; href?: string }) {
  return load(
    renderToStaticMarkup(
      createElement(ArticleShell, {
        breadcrumb: [{ label: 'Ana Sayfa', href: '/' }, { label: 'Yazı' }],
        eyebrow: 'Blog',
        title: 'Başlık',
        publishedAt: '2026-10-01T10:00:00.000Z',
        readingMinutes: 3,
        author,
        aside: null,
      }),
    ),
  );
}

describe('ArticleShell byline', () => {
  it('links the author name with rel="author" when href is given', () => {
    const $ = renderShell({ name: 'Ayşe Yılmaz', href: '/blog/yazar/ayse' });
    const link = $('header a[rel="author"]');

    expect(link).toHaveLength(1);
    expect(link.attr('href')).toBe('/blog/yazar/ayse');
    expect(link.text()).toBe('Ayşe Yılmaz');
  });

  it('writes plain text without a link when there is no href', () => {
    const $ = renderShell({ name: 'Ayşe Yılmaz' });

    expect($('header a[rel="author"]')).toHaveLength(0);
    expect($('header').text()).toContain('Ayşe Yılmaz');
  });
});

describe('AuthorBox', () => {
  it('renders the corporate variant with logo, short bio, profile and policy links', () => {
    const $ = load(
      renderToStaticMarkup(
        createElement(AuthorBox, { name: SITE_AUTHOR.name, href: SITE_AUTHOR.href, kind: 'Organization' }),
      ),
    );

    expect($('a[rel="author"]').attr('href')).toBe('/blog/yazar/almanya101');
    expect($('a[href="/hakkimizda"]').text()).toBe('Yayın ilkeleri');
    expect($('section').text()).toContain(SITE_AUTHOR_SHORT_BIO);
    expect($('img').attr('src')).toContain('almanya101.png');
  });

  it('renders a person without the policy link and falls back to an initial badge', () => {
    const $ = load(
      renderToStaticMarkup(createElement(AuthorBox, { name: 'Ayşe Yılmaz', href: '/blog/yazar/ayse', bio: 'Berlin.' })),
    );

    expect($('a[href="/hakkimizda"]')).toHaveLength(0);
    expect($('img')).toHaveLength(0);
    expect($('section').text()).toContain('Berlin.');
    expect($('section').text()).toContain('A');
  });
});
