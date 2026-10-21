import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { load } from 'cheerio';
import { describe, expect, it } from 'vitest';

import { Footer } from '@/components/layout/Footer';

const legalLinks = [
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

const partnerLinks = [
  ['https://www.spindorai.com', 'Seo Aracı', 've Seo Hizmetleri Spindora'],
  ['https://www.corteqs.net', 'Corteqs', 'Diasporayı Birleştiren Platform'],
  ['https://chatio.com.tr/', 'Canlı Destek Yazılımı', ''],
  ['https://www.spindorai.com/seo/en-iyi-seo-ajansi', 'Seo Ajansı', 'Spindora Tarafından Seosu Yapılmıştır.'],
  ['https://tekhurdametal.com/istanbul-hurdaci/', 'İstanbul Hurdacı', 'Firması Tek Hurda Metal A.Ş'],
  ['https://lionerotik.com/urunler/fetis-urunleri', 'Antalya Seks Shop', 'Lion Erotik'],
  ['https://ufuksoynakliyat.com.tr', 'Evden Eve Nakliyat', 'Şirketi Ufuksoy Nakliyat A.Ş'],
  ['https://dragomanseakayak.com', 'Deniz Kayağı Turları', 'Şirketi Dragoman Sea Kayak & Outdoors'],
] as const;

function renderFooter() {
  const html = renderToStaticMarkup(createElement(Footer));
  return { html, $: load(html) };
}

describe('Footer', () => {
  it('renders a footer landmark with the logo and the slogan', () => {
    const { $ } = renderFooter();

    expect($('footer')).toHaveLength(1);
    expect($('footer img[alt="almanya101"]').attr('src')).toContain('almanya101header.png');
    expect($('footer').text()).toContain('yalnız değilsin! almanya101 seninle!');
  });

  it('renders every legal link with the same href and label', () => {
    const { $ } = renderFooter();

    for (const [href, label] of legalLinks) {
      const link = $(`footer a[href="${href}"]`);
      expect(link, href).toHaveLength(1);
      expect(link.text()).toBe(label);
    }
  });

  it('renders every partner link with the same href, anchor text and description', () => {
    const { $ } = renderFooter();
    const footerText = $('footer').text();

    for (const [href, label, description] of partnerLinks) {
      const link = $(`footer a[href="${href}"]`);
      expect(link, href).toHaveLength(1);
      expect(link.text()).toBe(label);
      expect(footerText).toContain(description);
    }
  });

  it('opens partner links in a new tab with a valid, followed rel', () => {
    const { html, $ } = renderFooter();

    expect(html).not.toContain('dofollow');

    for (const [href] of partnerLinks) {
      const link = $(`footer a[href="${href}"]`);
      const rel = (link.attr('rel') ?? '').split(/\s+/);

      expect(link.attr('target'), href).toBe('_blank');
      expect(rel, href).toContain('noopener');
      expect(rel, href).not.toContain('nofollow');
    }
  });

  it('shows the copyright line for the current year', () => {
    const { $ } = renderFooter();

    expect($('footer').text()).toContain(`© ${new Date().getFullYear()} almanya101`);
  });

  it('uses readable type sizes instead of the old 8px treatment', () => {
    const { html } = renderFooter();
    const arbitraryPixelSizes = [...html.matchAll(/text-\[(\d+(?:\.\d+)?)px\]/g)].map((match) =>
      Number(match[1]),
    );

    expect(html).not.toContain('text-[8px]');
    expect(arbitraryPixelSizes.every((size) => size >= 12)).toBe(true);
    expect(html).toMatch(/\btext-xs\b/);
    expect(html).toMatch(/\btext-sm\b/);
  });

  it('uses the light palette and no em-dash in visible text', () => {
    const { html, $ } = renderFooter();

    expect(html).not.toMatch(/bg-black|text-white|text-gray-|border-white\//);
    expect($('footer').text()).not.toContain('—');
  });
});
