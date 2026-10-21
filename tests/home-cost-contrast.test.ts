import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { load } from 'cheerio';
import { describe, expect, it } from 'vitest';
import { HomeCostSection } from '@/components/home/HomeCostSection';

describe('HomeCostSection source links', () => {
  it('use brand-800 on the band background (brand-700 is only 4.26:1 there)', () => {
    const $ = load(renderToStaticMarkup(createElement(HomeCostSection)));
    const links = $('section a').toArray();

    expect(links.length).toBeGreaterThan(0);
    for (const link of links) {
      const className = $(link).attr('class') ?? '';
      expect(className).toContain('text-brand-800');
      expect(className).not.toMatch(/(^|\s)text-brand-700(\s|$)/);
    }
  });
});
