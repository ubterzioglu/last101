import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { JsonLd, buildArticleJsonLd, serializeJsonLd } from '@/components/seo/JsonLd';

const HOSTILE = '</script><script>alert(1)</script>';

describe('serializeJsonLd', () => {
  it('escapes markup characters and keeps the payload valid JSON', () => {
    const data = { headline: `${HOSTILE} & <b>bold</b>`, nested: { name: 'a\u2028b\u2029c' } };
    const out = serializeJsonLd(data);

    expect(out).not.toMatch(/[<>&\u2028\u2029]/);
    expect(JSON.parse(out)).toEqual(data);
  });

  it('is what the JsonLd component writes into the page', () => {
    const html = renderToStaticMarkup(createElement(JsonLd, { data: { headline: HOSTILE } }));

    // The only closing tag is the component's own.
    expect(html.match(/<\/script>/g)).toHaveLength(1);
    expect(html).not.toContain('<script>alert');
  });

  it('is inert for article nodes built from author controlled fields', () => {
    const node = buildArticleJsonLd({
      title: HOSTILE,
      description: HOSTILE,
      datePublished: '2026-10-01T10:00:00Z',
      url: 'https://almanya101.de/blog/x--00000000-0000-0000-0000-000000000000',
      type: 'BlogPosting',
    });
    const html = renderToStaticMarkup(createElement(JsonLd, { data: node }));

    expect(html.match(/<\/script>/g)).toHaveLength(1);
    expect(JSON.parse(serializeJsonLd(node)).headline).toBe(HOSTILE);
  });
});
