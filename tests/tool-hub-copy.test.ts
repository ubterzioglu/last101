import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Route } from 'lucide-react';
import { describe, expect, it } from 'vitest';
import { groupToolsByCategory } from '@/app/(site)/almanya-araclari/tool-hub-data';
import { ServiceTile } from '@/components/site/ServiceTile';
import { TOOL_CATALOG } from '@/lib/tools/catalog';

describe('tool hub keeps each tool card copy', () => {
  it('maps question count, spotlight and CTA label from the catalog', () => {
    const items = groupToolsByCategory(TOOL_CATALOG).flatMap((group) => group.items);

    for (const tool of TOOL_CATALOG) {
      const item = items.find((entry) => entry.title === tool.title);
      expect(item, tool.slug).toBeDefined();
      expect(item?.meta).toBe(`${tool.questionCount} soru`);
      expect(item?.detail).toEqual({ label: 'Bu araç sana ne verir?', text: tool.spotlight });
      expect(item?.cta).toBe(tool.ctaLabel);
    }
  });

  it('renders meta, the spotlight block and the CTA label on the tile', () => {
    const html = renderToStaticMarkup(
      createElement(ServiceTile, {
        href: '/almanya-yolunu-sec',
        icon: Route,
        title: 'Almanya Yolunu Seç',
        meta: '20 soru',
        detail: { label: 'Bu araç sana ne verir?', text: 'Hangi ana yoldan başlaman gerektiğini netleştirir.' },
        cta: 'Yolunu belirle',
      }),
    );

    expect(html).toContain('20 soru');
    expect(html).toContain('Bu araç sana ne verir?');
    expect(html).toContain('Hangi ana yoldan başlaman gerektiğini netleştirir.');
    expect(html).toContain('Yolunu belirle');
  });
});
