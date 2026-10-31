import { createElement } from 'react';
import { fileURLToPath } from 'node:url';
import { renderToStaticMarkup } from 'react-dom/server';
import { load } from 'cheerio';
import { afterEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  pathname: '/',
  authStatus: 'anon' as 'loading' | 'authed' | 'anon',
}));

vi.mock('next/navigation', () => ({
  usePathname: () => mocks.pathname,
  useRouter: () => ({ refresh: () => undefined }),
}));

vi.mock('@/hooks/useAuthUser', () => ({
  useAuthUser: () => ({
    user: null,
    status: mocks.authStatus,
    signOut: async () => undefined,
  }),
}));

import { Header } from '@/components/layout/Header';
import { HeaderDrawer } from '@/components/layout/HeaderDrawer';
import { getTrapTarget } from '@/components/layout/useDrawerA11y';
import { CONTACT_CHANNELS } from '@/constants/contact-channels';
import { collectAppRoutes } from './helpers/app-routes';
import { DRAWER_CATEGORIES, DRAWER_ITEMS, HEADER_PRIMARY_LINKS } from '@/constants/navigation';

const APP_DIR = fileURLToPath(new URL('../app', import.meta.url));
const WHATSAPP_HREF = CONTACT_CHANNELS.find((channel) => channel.id === 'whatsapp')?.href;

function renderHeader() {
  const html = renderToStaticMarkup(createElement(Header));
  return { html, $: load(html) };
}

function renderDrawer(authStatus: 'loading' | 'authed' | 'anon' = 'anon', pathname = '/') {
  const html = renderToStaticMarkup(
    createElement(HeaderDrawer, {
      pathname,
      authStatus,
      whatsappHref: WHATSAPP_HREF ?? '',
      onClose: () => undefined,
      onSignOut: () => undefined,
      returnFocusRef: { current: null },
    }),
  );
  return { html, $: load(html) };
}

afterEach(() => {
  mocks.pathname = '/';
  mocks.authStatus = 'anon';
});

describe('HEADER_PRIMARY_LINKS', () => {
  it('lists the six primary destinations in order', () => {
    expect(HEADER_PRIMARY_LINKS.map(({ href, label }) => [href, label])).toEqual([
      ['/almanya-araclari', 'Araçlar'],
      ['/haberler', 'Haberler'],
      ['/blog', 'Blog'],
      ['/belgeler', 'Yararlı Belgeler'],
      ['/topluluk', 'Topluluk'],
      ['/iletisim', 'İletişim'],
    ]);
  });

  it('reuses labels that already exist in the drawer navigation', () => {
    const knownLabels = new Set([
      ...DRAWER_ITEMS.map((item) => item.label),
      ...Object.values(DRAWER_CATEGORIES).map((category) => category.label),
    ]);

    for (const link of HEADER_PRIMARY_LINKS) {
      expect(knownLabels.has(link.label), link.label).toBe(true);
    }
  });

  it('points every header and drawer link at an existing app route', () => {
    const routes = new Set(collectAppRoutes(APP_DIR));

    for (const { href } of [...HEADER_PRIMARY_LINKS, ...DRAWER_ITEMS]) {
      expect(routes.has(href), href).toBe(true);
    }
  });
});

describe('Header', () => {
  it('renders a sticky header landmark with the logo linking home', () => {
    const { $ } = renderHeader();
    const header = $('header');
    const logo = header.find('img[alt="almanya101"]');

    expect(header).toHaveLength(1);
    expect(header.attr('class')).toContain('sticky');
    expect(logo.attr('src')).toContain('yeniherologo.png');
    expect(logo.closest('a').attr('href')).toBe('/');
  });

  it('sits on the dark ink background that the mascot logo is made for', () => {
    const { $ } = renderHeader();
    const headerClass = $('header').attr('class') ?? '';

    expect(headerClass).toMatch(/\bbg-ink\b/);
    expect(headerClass).not.toMatch(/\bbg-page\b/);
  });

  it('renders the six primary links inside the main navigation', () => {
    const { $ } = renderHeader();
    const links = $('header nav[aria-label="Ana menü"] a')
      .toArray()
      .map((element) => [$(element).attr('href'), $(element).text()]);

    expect(links).toEqual(HEADER_PRIMARY_LINKS.map(({ href, label }) => [href, label]));
  });

  it('marks the current section with aria-current, including nested pages', () => {
    mocks.pathname = '/haberler/bir-haber';
    const { $ } = renderHeader();
    const current = $('header nav a[aria-current="page"]')
      .toArray()
      .map((element) => $(element).attr('href'));

    expect(current).toEqual(['/haberler']);
  });

  it('shows the WhatsApp community link from CONTACT_CHANNELS in a new tab', () => {
    const { $ } = renderHeader();
    const whatsapp = $(`header a[href="${WHATSAPP_HREF}"]`);

    expect(WHATSAPP_HREF).toBeTruthy();
    expect(whatsapp).toHaveLength(1);
    expect(whatsapp.text()).toContain('WhatsApp');
    expect(whatsapp.attr('target')).toBe('_blank');
    expect(whatsapp.attr('rel')).toContain('noopener');
  });

  it('offers Giriş yap and Üye Ol to visitors', () => {
    const { $ } = renderHeader();
    const authLinks = $('header a[href="/giris"]')
      .toArray()
      .map((element) => $(element).text().trim());

    expect(authLinks).toEqual(['Giriş yap', 'Üye Ol']);
    expect($('header').text()).not.toContain('Çıkış');
  });

  it('replaces the visitor actions with Çıkış when signed in', () => {
    mocks.authStatus = 'authed';
    const { $ } = renderHeader();
    const signOut = $('header button').filter((_, element) => $(element).text().trim() === 'Çıkış');

    expect(signOut).toHaveLength(1);
    expect($('header a[href="/giris"]')).toHaveLength(0);
  });

  it('renders a closed Menü trigger and no drawer markup', () => {
    const { $ } = renderHeader();
    const trigger = $('header button[aria-haspopup="dialog"]');

    expect(trigger.text().trim()).toBe('Menü');
    expect(trigger.attr('aria-expanded')).toBe('false');
    expect($('[role="dialog"]')).toHaveLength(0);
  });

  it('uses no emoji and none of the legacy dark theme classes', () => {
    const { html } = renderHeader();

    expect(html).not.toMatch(/\p{Extended_Pictographic}/u);
    expect(html).not.toMatch(/bg-black|border-white\/|google-/);
  });
});

describe('HeaderDrawer', () => {
  it('is a labelled modal dialog with a close button', () => {
    const { $ } = renderDrawer();
    const dialog = $('[role="dialog"]');
    const labelId = dialog.attr('aria-labelledby');

    expect(dialog).toHaveLength(1);
    expect(dialog.attr('aria-modal')).toBe('true');
    expect(labelId).toBeTruthy();
    expect($(`[id="${labelId}"]`).text()).toBe('Menü');
    expect($('button[aria-label="Menüyü kapat"]')).toHaveLength(1);
  });

  it('starts with a Home link that uses an icon instead of an emoji', () => {
    const { html, $ } = renderDrawer();
    const home = $('[role="dialog"] a[href="/"]').first();

    expect(home.text().trim()).toBe('Ana Sayfa');
    expect(home.find('svg')).toHaveLength(1);
    expect(html).not.toMatch(/\p{Extended_Pictographic}/u);
  });

  it('keeps every drawer item grouped under its collapsible category', () => {
    const { $ } = renderDrawer();

    for (const [key, category] of Object.entries(DRAWER_CATEGORIES)) {
      const toggle = $('[role="dialog"] button[aria-controls]').filter(
        (_, element) => $(element).text().trim() === category.label,
      );
      const panel = $(`[id="${toggle.attr('aria-controls')}"]`);
      const hrefs = panel
        .find('a')
        .toArray()
        .map((element) => $(element).attr('href'));

      expect(toggle, category.label).toHaveLength(1);
      expect(toggle.attr('aria-expanded')).toBe('false');
      for (const item of DRAWER_ITEMS.filter((drawerItem) => drawerItem.category === key)) {
        expect(hrefs, item.href).toContain(item.href);
      }
    }
  });

  it('marks the current page inside the drawer', () => {
    const { $ } = renderDrawer('anon', '/belgeler');

    expect($('[role="dialog"] a[aria-current="page"]').attr('href')).toBe('/belgeler');
  });

  it('offers WhatsApp, Giriş yap and Üye Ol to visitors', () => {
    const { $ } = renderDrawer('anon');
    const authLinks = $('[role="dialog"] a[href="/giris"]')
      .toArray()
      .map((element) => $(element).text().trim());

    expect($(`[role="dialog"] a[href="${WHATSAPP_HREF}"]`)).toHaveLength(1);
    expect(authLinks).toEqual(['Giriş yap', 'Üye Ol']);
  });

  it('offers Çıkış instead of the visitor actions when signed in', () => {
    const { $ } = renderDrawer('authed');
    const signOut = $('[role="dialog"] button').filter((_, element) => $(element).text().trim() === 'Çıkış');

    expect(signOut).toHaveLength(1);
    expect($('[role="dialog"] a[href="/giris"]')).toHaveLength(0);
  });
});

describe('getTrapTarget', () => {
  const focusables = ['first', 'middle', 'last'];

  it('wraps Tab from the last element to the first', () => {
    expect(getTrapTarget(focusables, 'last', false)).toBe('first');
  });

  it('wraps Shift+Tab from the first element to the last', () => {
    expect(getTrapTarget(focusables, 'first', true)).toBe('last');
  });

  it('leaves moves between inner elements to the browser', () => {
    expect(getTrapTarget(focusables, 'middle', false)).toBeNull();
    expect(getTrapTarget(focusables, 'middle', true)).toBeNull();
  });

  it('pulls focus back inside when it is outside the panel', () => {
    expect(getTrapTarget(focusables, 'outside', false)).toBe('first');
    expect(getTrapTarget(focusables, null, true)).toBe('last');
  });

  it('returns null when nothing is focusable', () => {
    expect(getTrapTarget([], null, false)).toBeNull();
  });
});
