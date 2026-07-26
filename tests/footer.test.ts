import { createElement } from 'react';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/components/ui/Container', async () => {
  const { createElement } = await import('react');

  return {
    Container: ({ children }: { children: ReactNode }) =>
      createElement('div', null, children),
  };
});

import { Footer } from '@/components/layout/Footer';

const expectedLinks = [
  ['/hakkimizda', 'Hakkımızda'],
  ['/blog', 'Blog'],
  ['/iletisim', 'İletişim'],
  ['/kariyer', 'Kariyer'],
  ['/gizlilik-politikasi', 'Gizlilik Politikası'],
  ['/kullanim-sartlari', 'Kullanım Şartları'],
  ['/kvkk-gdpr-ccpa', 'KVKK / GDPR / CCPA'],
  ['/cerez-politikasi', 'Çerez Politikası'],
  ['/impressum', 'Impressum'],
  ['https://www.spindorai.com', 'Seo Aracı'],
  ['https://www.corteqs.net', 'Corteqs'],
  ['https://chatio.com.tr/', 'Canlı Destek Yazılımı'],
  ['https://www.spindorai.com/seo/en-iyi-seo-ajansi', 'Seo Ajansı'],
  ['https://tekhurdametal.com/istanbul-hurdaci/', 'İstanbul Hurdacı'],
  ['https://lionerotik.com/urunler/fetis-urunleri', 'Antalya Seks Shop'],
  ['https://ufuksoynakliyat.com.tr', 'Evden Eve Nakliyat'],
  ['https://dragomanseakayak.com', 'Deniz Kayağı Turları'],
] as const;

describe('Footer', () => {
  it('renders every footer link', () => {
    const html = renderToStaticMarkup(createElement(Footer));

    for (const [href, label] of expectedLinks) {
      expect(html).toContain(`href="${href}"`);
      expect(html).toContain(label);
    }
  });

  it('uses a visible 8px type treatment throughout the footer', () => {
    const html = renderToStaticMarkup(createElement(Footer));

    expect(html).toContain('text-[8px]');
    expect(html).not.toMatch(/text-(?:xs|sm|base)|text-\[0\.82rem\]/);
    expect(html).not.toContain('text-gray-700');
  });
});
