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

// Removed SEO partner links: none of these may come back.
const removedPartnerLinks = [
  ['spindorai.com', 'Spindora'],
  ['corteqs.net', 'Diasporayı Birleştiren Platform'],
  ['chatio.com.tr', 'Canlı Destek Yazılımı'],
  ['tekhurdametal.com', 'Hurda'],
  ['lionerotik.com', 'Erotik'],
  ['ufuksoynakliyat.com.tr', 'Nakliyat'],
  ['dragomanseakayak.com', 'Sea Kayak'],
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

  it('renders none of the removed SEO partner links', () => {
    const { html, $ } = renderFooter();
    const footerText = $('footer').text();

    for (const [domain, text] of removedPartnerLinks) {
      expect(html, domain).not.toContain(domain);
      expect(footerText, text).not.toContain(text);
    }
  });

  it('links only to internal pages', () => {
    const { $ } = renderFooter();
    const external = $('footer a[href^="http"], footer a[target="_blank"]');

    expect(external).toHaveLength(0);
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
    expect(html).toMatch(/\btext-sm\b/);
  });

  it('uses the light palette and no em-dash in visible text', () => {
    const { html, $ } = renderFooter();

    expect(html).not.toMatch(/bg-black|text-white|text-gray-|border-white\//);
    expect($('footer').text()).not.toContain('—');
  });
});
