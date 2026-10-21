import { createElement } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: ComponentProps<'a'> & { href: string }) =>
    createElement('a', { href, ...rest }, children as ReactNode),
}));

import { HomeFooterNav } from '@/components/home/HomeFooterNav';

const expectedInternalLinks = [
  ['/hakkimizda', 'Hakkımızda'],
  ['/blog', 'Blog'],
  ['/iletisim', 'İletişim'],
  ['/kariyer', 'Kariyer'],
  ['/gizlilik-politikasi', 'Gizlilik Politikası'],
  ['/kullanim-sartlari', 'Kullanım Şartları'],
  ['/kvkk-gdpr-ccpa', 'KVKK / GDPR / CCPA'],
  ['/cerez-politikasi', 'Çerez Politikası'],
  ['/impressum', 'Impressum'],
] as const;

const removedExternalHrefs = [
  'https://www.spindorai.com',
  'https://www.corteqs.net',
  'https://chatio.com.tr/',
  'https://www.spindorai.com/seo/en-iyi-seo-ajansi',
  'https://tekhurdametal.com/istanbul-hurdaci/',
  'https://lionerotik.com/urunler/fetis-urunleri',
  'https://ufuksoynakliyat.com.tr',
  'https://dragomanseakayak.com',
] as const;

describe('HomeFooterNav', () => {
  const html = renderToStaticMarkup(createElement(HomeFooterNav));

  it('renders every internal link with its label', () => {
    for (const [href, label] of expectedInternalLinks) {
      expect(html).toContain(`href="${href}"`);
      expect(html).toContain(label);
    }
  });

  it('groups links under Kurumsal and Yasal Bilgiler headings', () => {
    expect(html).toContain('Kurumsal');
    expect(html).toContain('Yasal Bilgiler');
  });

  it('uses a semantic nav landmark', () => {
    expect(html).toContain('<nav');
    expect(html).toContain('aria-label=');
  });

  it('contains no external links', () => {
    for (const href of removedExternalHrefs) {
      expect(html).not.toContain(href);
    }
  });

  it('uses readable type instead of the old 8px treatment', () => {
    expect(html).toContain('text-sm');
    expect(html).not.toContain('text-[8px]');
  });
});
