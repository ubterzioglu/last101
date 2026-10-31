import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { load } from 'cheerio';
import { describe, expect, it } from 'vitest';
import { ADMIN_NAV_ITEMS } from '@/constants/adminNav';
import { TONE_STYLES } from '@/components/site/tones';
import { AdminPageHeader } from '@/components/admin/ui/AdminPageHeader';
import { AdminStatCard } from '@/components/admin/ui/AdminStatCard';
import { ADMIN_CONTROL_CLASS, AdminField } from '@/components/admin/ui/AdminField';

/** Fragment mode: no html/head/body wrapper around the rendered markup. */
function parse(element: Parameters<typeof renderToStaticMarkup>[0]) {
  return load(renderToStaticMarkup(element), null, false);
}

describe('AdminPageHeader', () => {
  it('renders eyebrow, a single h1, description and actions', () => {
    const $ = parse(
      createElement(AdminPageHeader, {
        eyebrow: 'Yönetim',
        title: 'Üyeler',
        description: 'Kayıtlı üyeleri yönetin.',
        actions: createElement('button', { type: 'button' }, 'Yenile'),
      }),
    );

    expect($('h1')).toHaveLength(1);
    expect($('h1').text()).toBe('Üyeler');
    expect($('h1').hasClass('text-ink')).toBe(true);
    expect($('h1').hasClass('font-extrabold')).toBe(true);
    expect($.root().text()).toContain('Yönetim');
    expect($.root().text()).toContain('Kayıtlı üyeleri yönetin.');
    expect($('button').text()).toBe('Yenile');
  });

  it('omits eyebrow, description and actions when not given', () => {
    const $ = parse(createElement(AdminPageHeader, { title: 'Sadece başlık' }));

    expect($('h1').text()).toBe('Sadece başlık');
    expect($('p')).toHaveLength(0);
    expect($('button')).toHaveLength(0);
  });

  it('never renders a <main> and uses no dark classes', () => {
    const html = renderToStaticMarkup(createElement(AdminPageHeader, { eyebrow: 'E', title: 'T', description: 'D' }));

    expect(html).not.toContain('<main');
    expect(html).not.toMatch(/bg-black|text-white|border-white|google-|backdrop-blur|bg-gradient/);
  });
});

describe('AdminStatCard', () => {
  it('is a link to the given href with label, value and tone text colour', () => {
    const $ = parse(createElement(AdminStatCard, { label: 'Toplam Üye', value: 42, href: '/admin/uyeler', tone: 'blue' }));
    const link = $('a');

    expect(link).toHaveLength(1);
    expect(link.attr('href')).toBe('/admin/uyeler');
    expect(link.text()).toContain('Toplam Üye');
    expect(link.text()).toContain('42');
    expect(link.find(`.${TONE_STYLES.blue.text}`).text()).toBe('42');
    expect(link.hasClass('bg-white')).toBe(true);
    expect(link.hasClass('border-line')).toBe(true);
    expect(link.hasClass('rounded-card')).toBe(true);
  });

  it('uses the red tone text for a red card', () => {
    const $ = parse(createElement(AdminStatCard, { label: 'Kırık', value: 0, href: '/admin/x', tone: 'red' }));

    expect($(`.${TONE_STYLES.red.text}`).text()).toBe('0');
  });
});

describe('AdminField', () => {
  it('wraps the control in a label with the label text', () => {
    const $ = parse(
      createElement(
        AdminField,
        { label: 'Şifre' },
        createElement('input', { type: 'password', className: ADMIN_CONTROL_CLASS }),
      ),
    );

    expect($('label')).toHaveLength(1);
    expect($('label').text()).toContain('Şifre');
    expect($('label input[type="password"]')).toHaveLength(1);
    expect($('label span').first().hasClass('text-ink')).toBe(true);
  });

  it('shows a hint, and an error as an alert instead of the hint', () => {
    const withHint = parse(createElement(AdminField, { label: 'Ad', hint: 'En az 2 karakter' }, createElement('input')));
    expect(withHint.root().text()).toContain('En az 2 karakter');
    expect(withHint('[role="alert"]')).toHaveLength(0);

    const withError = parse(
      createElement(AdminField, { label: 'Ad', hint: 'En az 2 karakter', error: 'Ad zorunlu' }, createElement('input')),
    );
    expect(withError('[role="alert"]').text()).toBe('Ad zorunlu');
    expect(withError.root().text()).not.toContain('En az 2 karakter');
  });

  it('exposes a control class on the light design system', () => {
    for (const cls of ['bg-white', 'border', 'border-line', 'rounded-btn', 'min-h-[44px]', 'text-ink']) {
      expect(ADMIN_CONTROL_CLASS.split(/\s+/), cls).toContain(cls);
    }
    expect(ADMIN_CONTROL_CLASS).toContain('focus:border-brand-700');
    expect(ADMIN_CONTROL_CLASS).not.toMatch(/white\/|google-|bg-black/);
  });
});

describe('ADMIN_NAV_ITEMS', () => {
  it('maps every tone to a TONE_STYLES entry', () => {
    expect(ADMIN_NAV_ITEMS.length).toBeGreaterThan(0);
    for (const item of ADMIN_NAV_ITEMS) {
      expect(TONE_STYLES[item.tone], `${item.href} tone ${item.tone}`).toBeDefined();
    }
  });

  it('keeps unique hrefs under /admin and the badge keys', () => {
    const hrefs = ADMIN_NAV_ITEMS.map((item) => item.href);

    expect(new Set(hrefs).size).toBe(hrefs.length);
    expect(hrefs.every((href) => href.startsWith('/admin/'))).toBe(true);
    expect(ADMIN_NAV_ITEMS.flatMap((item) => (item.badgeKey ? [item.badgeKey] : [])).sort()).toEqual([
      'broken',
      'hizmet',
      'security',
    ]);
  });
});
