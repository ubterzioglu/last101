import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import MarkdownPreview from '@/components/MarkdownPreview';

type PreviewProps = Parameters<typeof MarkdownPreview>[0];

const SAMPLE = [
  '# Başlık',
  '',
  'Paragraf ve [bağlantı](https://example.com).',
  '',
  '> Alıntı',
  '',
  '---',
  '',
  '| Konu | Not |',
  '| --- | --- |',
  '| Anmeldung | 14 gün |',
  '',
  '![Berlin](/images/site/berlin-spree.webp)',
].join('\n');

function render(props: PreviewProps): string {
  return renderToStaticMarkup(createElement(MarkdownPreview, props));
}

// React 19 hoists `<link rel="preload" as="image">` for images ahead of the
// root element, so look for the first div instead of anchoring at the start.
function rootClass(html: string): string {
  return html.match(/<div class="([^"]*)"/)?.[1] ?? '';
}

describe('MarkdownPreview', () => {
  it('renders nothing without content', () => {
    expect(render({ content: '' })).toBe('');
  });

  it('keeps the dark admin look by default', () => {
    const html = render({ content: SAMPLE });

    expect(rootClass(html).split(' ')).toEqual(['prose', 'prose-invert', 'max-w-none']);
    expect(html).toContain('class="text-[#7fd5ff] hover:underline"');
    expect(html).toContain('class="border-l-4 border-white/20 pl-4 italic text-white/80 my-4"');
    expect(html).toContain('<h1 class="text-3xl font-bold mb-4">Başlık</h1>');
  });

  it('renders tone="dark" exactly like the default', () => {
    expect(render({ content: SAMPLE, tone: 'dark' })).toBe(render({ content: SAMPLE }));
  });

  it('passes className through in both tones', () => {
    expect(rootClass(render({ content: SAMPLE, className: 'mt-4' }))).toContain('mt-4');
    expect(rootClass(render({ content: SAMPLE, tone: 'light', className: 'mt-4' }))).toContain('mt-4');
  });

  it('uses light prose with ink text and brand links for tone="light"', () => {
    const html = render({ content: SAMPLE, tone: 'light' });
    const classes = rootClass(html).split(' ');

    expect(classes).toContain('prose');
    expect(classes).not.toContain('prose-invert');
    expect(classes).toContain('text-ink');
    expect(html).toMatch(/<h1 class="[^"]*font-extrabold[^"]*text-ink[^"]*">Başlık<\/h1>/);
    expect(html).toMatch(/<a href="https:\/\/example\.com" class="[^"]*text-brand-700[^"]*underline[^"]*"/);
    expect(html).toMatch(/<hr class="[^"]*border-line[^"]*"\/>/);
    expect(html).toMatch(/<div class="[^"]*overflow-x-auto[^"]*"><table/);
    expect(classes).toContain('prose-img:rounded-card');
  });

  it('does not leak dark-theme colours into the light tone', () => {
    const html = render({ content: SAMPLE, tone: 'light' });

    expect(html).not.toContain('#7fd5ff');
    expect(html).not.toContain('text-white');
    expect(html).not.toContain('border-white');
    expect(html).not.toContain('bg-white/10');
  });

  it('keeps external link safety and sanitizing in the light tone', () => {
    const html = render({
      content: '[x](https://example.com)\n\n<script>alert(1)</script><p onclick="steal()">ok</p>',
      tone: 'light',
    });

    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).not.toContain('<script');
    expect(html).not.toContain('onclick');
  });
});
