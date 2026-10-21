import { describe, expect, it } from 'vitest';
import {
  TOOL_CATEGORY_ORDER,
  groupToolsByCategory,
  slugifyCategory,
} from '@/app/(site)/almanya-araclari/tool-hub-data';
import { TOOL_CATALOG } from '@/lib/tools/catalog';
import type { ToolCatalogItem } from '@/lib/tools/types';

describe('tool hub grouping', () => {
  it('keeps the old Turkish anchor slugs', () => {
    expect(TOOL_CATEGORY_ORDER.map(slugifyCategory)).toEqual([
      'rota-ve-strateji',
      'kariyer-ve-gelir',
      'hazirlik-ve-yerlesim',
      'yasam-ve-destek',
    ]);
  });

  it('lists every catalog tool exactly once, in category order', () => {
    const groups = groupToolsByCategory(TOOL_CATALOG);
    const hrefs = groups.flatMap((group) => group.items.map((item) => item.href));

    expect(groups.map((group) => group.title)).toEqual([...TOOL_CATEGORY_ORDER]);
    expect(hrefs).toHaveLength(TOOL_CATALOG.length);
    expect(new Set(hrefs)).toEqual(new Set(TOOL_CATALOG.map((tool) => `/${tool.slug}`)));
  });

  it('maps tools to service tiles with the category tone and an icon', () => {
    const [first] = groupToolsByCategory(TOOL_CATALOG);
    const tool = TOOL_CATALOG.find((item) => item.category === first.title);

    expect(first.items[0]).toMatchObject({
      title: tool?.title,
      description: tool?.description,
      tone: first.tone,
    });
    expect(first.items.every((item) => item.icon)).toBe(true);
  });

  it('drops empty categories and falls back to the category icon', () => {
    const unknownTool: ToolCatalogItem = {
      slug: 'yeni-arac',
      title: 'Yeni Araç',
      description: 'Açıklama',
      ctaLabel: 'Aç',
      category: 'Kariyer ve Gelir',
      questionCount: 10,
      spotlight: 'Not',
    };
    const groups = groupToolsByCategory([unknownTool]);

    expect(groups).toHaveLength(1);
    expect(groups[0]).toMatchObject({ id: 'kariyer-ve-gelir', tone: 'green' });
    expect(groups[0].items[0].icon).toBeDefined();
    expect(groups[0].items[0].href).toBe('/yeni-arac');
  });

  it('does not mutate the input list', () => {
    const copy = [...TOOL_CATALOG];
    groupToolsByCategory(TOOL_CATALOG);
    expect(TOOL_CATALOG).toEqual(copy);
  });
});
