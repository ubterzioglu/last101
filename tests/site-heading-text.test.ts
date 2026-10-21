import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Accordion } from '@/components/site/Accordion';
import { PageHead } from '@/components/site/PageHead';
import { SectionHeader } from '@/components/site/SectionHeader';

function headingText(html: string, tag: 'h1' | 'h2'): string {
  const match = html.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  return (match?.[1] ?? '').replace(/<[^>]+>/g, '');
}

describe('Accordion heading level', () => {
  it('renders item titles as headings when headingAs is set', () => {
    const html = renderToStaticMarkup(
      createElement(Accordion, {
        name: 'guide',
        headingAs: 'h3',
        items: [{ title: 'Almanya için hangi belgeler?', content: 'İçerik' }],
      }),
    );
    expect(html).toMatch(/<summary[^>]*>[\s\S]*<h3[^>]*>[\s\S]*Almanya için hangi belgeler\?[\s\S]*<\/h3>/);
  });

  it('keeps titles as plain text by default', () => {
    const html = renderToStaticMarkup(
      createElement(Accordion, { name: 'faq', items: [{ title: 'Soru', content: 'Cevap' }] }),
    );
    expect(html).not.toMatch(/<h[1-6]/);
  });
});

describe('two-line headings keep a word break between the lines', () => {
  it('SectionHeader separates title and accent with a space', () => {
    const html = renderToStaticMarkup(
      createElement(SectionHeader, { title: 'Bize Nasıl', accent: 'Ulaşabilirsiniz?' }),
    );
    expect(headingText(html, 'h2')).toBe('Bize Nasıl Ulaşabilirsiniz?');
  });

  it('PageHead separates title and accent with a space', () => {
    const html = renderToStaticMarkup(
      createElement(PageHead, { title: 'Bize Nasıl', accent: 'Ulaşabilirsiniz?' }),
    );
    expect(headingText(html, 'h1')).toBe('Bize Nasıl Ulaşabilirsiniz?');
  });
});
