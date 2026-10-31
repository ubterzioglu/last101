import { createElement } from 'react';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { load } from 'cheerio';
import { describe, expect, it, vi } from 'vitest';

// Plain <img> so the markup only reflects the layout's own props, not
// next/image internals (srcset, inline styles) that change between versions.
vi.mock('next/image', async () => {
  const { createElement } = await import('react');

  return {
    default: ({ src, alt, width, height, fill, priority, sizes, className }: Record<string, unknown>) =>
      createElement('img', {
        src,
        alt,
        width,
        height,
        sizes,
        className,
        'data-fill': fill ? 'true' : undefined,
        'data-priority': priority ? 'true' : undefined,
      }),
  };
});

// The ui Container is restyled by another stream; keep this test independent of it.
vi.mock('@/components/ui/Container', async () => {
  const { createElement } = await import('react');

  return {
    Container: ({ children, className }: { children: ReactNode; className?: string }) =>
      createElement('div', { 'data-container': 'true', className }, children),
  };
});

import { AuthSplitLayout } from '@/components/auth/AuthSplitLayout';

type LayoutProps = Parameters<typeof AuthSplitLayout>[0];

function render(props: Omit<LayoutProps, 'children'>): string {
  const child = createElement('form', { id: 'auth-form' }, createElement('button', { type: 'submit' }, 'Giriş Yap'));
  return renderToStaticMarkup(createElement(AuthSplitLayout, props as LayoutProps, child));
}

/** One tag per line, so a markup change shows up as a readable diff. */
function pretty(html: string): string {
  return html.replace(/></g, '>\n<');
}

/** Fragment mode: no html/head/body wrapper around the rendered markup. */
function parse(html: string) {
  return load(html, null, false);
}

const ADMIN_PROPS = {
  title: 'Admin Paneli',
  subtitle: 'Tüm yönetim bölümlerine tek şifreyle giriş yapın.',
  accent: 'yellow',
} as const;

describe('AuthSplitLayout default (dark) tone for admin and the author panel', () => {
  it('keeps the original dark markup when no tone is passed', () => {
    expect(pretty(render(ADMIN_PROPS))).toMatchInlineSnapshot(`
      "<link rel="preload" as="image" href="/almanya101.png"/>
      <div class="grid min-h-screen grid-cols-1 bg-black text-white lg:grid-cols-2">
      <aside class="relative hidden overflow-hidden bg-gradient-to-br lg:flex lg:flex-col lg:justify-between from-google-yellow/25 via-black to-google-red/20">
      <div class="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full blur-3xl bg-google-yellow/30" aria-hidden="true">
      </div>
      <div class="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-white/5 blur-3xl" aria-hidden="true">
      </div>
      <div class="relative p-10">
      <img src="/almanya101.png" alt="Almanya101 logosu" width="180" height="48" class="h-10 w-auto object-contain" data-priority="true"/>
      </div>
      <div class="relative max-w-lg p-10">
      <h2 class="text-4xl font-black leading-tight tracking-tight md:text-5xl">Almanya101</h2>
      <p class="mt-5 text-base leading-8 text-white/75 md:text-lg">Almanya yolculuğun için ihtiyacın olan tüm araçlar tek yerde.</p>
      <ul class="mt-8 space-y-3 text-sm text-white/70">
      <li class="flex items-center gap-3">
      <span class="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="h-3 w-3">
      <path d="M20 6 9 17l-5-5">
      </path>
      </svg>
      </span>Ücretsiz interaktif Almanya araçları</li>
      <li class="flex items-center gap-3">
      <span class="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="h-3 w-3">
      <path d="M20 6 9 17l-5-5">
      </path>
      </svg>
      </span>Topluluk, köşe yazıları ve güncel haberler</li>
      <li class="flex items-center gap-3">
      <span class="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="h-3 w-3">
      <path d="M20 6 9 17l-5-5">
      </path>
      </svg>
      </span>Kişisel planlama ve karar destek</li>
      </ul>
      </div>
      <div class="relative p-10 text-xs text-white/45">© almanya101 — Almanya&#x27;da yaşayan Türkler için.</div>
      </aside>
      <div class="flex min-h-screen items-center justify-center px-4 py-12 sm:px-8">
      <div class="w-full max-w-md">
      <div class="mb-8 flex justify-center lg:hidden">
      <img src="/almanya101.png" alt="Almanya101 logosu" width="160" height="42" class="h-9 w-auto object-contain" data-priority="true"/>
      </div>
      <div class="mb-8 text-center lg:text-left">
      <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">Admin Paneli</h1>
      <p class="mt-3 text-sm leading-7 text-white/60">Tüm yönetim bölümlerine tek şifreyle giriş yapın.</p>
      </div>
      <form id="auth-form">
      <button type="submit">Giriş Yap</button>
      </form>
      </div>
      </div>
      </div>"
    `);
  });

  it('renders identical markup for tone="dark" and the default', () => {
    for (const accent of ['blue', 'green', 'yellow'] as const) {
      const props = {
        title: 'Köşe Girişi',
        subtitle: '/ornek paneline giriş yapın.',
        accent,
        heroTitle: 'Arkadaşın Köşesi',
        heroSubtitle: 'Kendi köşende yazılarını yaz.',
      };

      expect(render({ ...props, tone: 'dark' })).toBe(render(props));
    }
  });

  it('keeps the accent gradient and glow of every accent', () => {
    expect(render({ title: 'x' })).toContain('from-google-blue/30 via-black to-google-green/20');
    expect(render({ title: 'x', accent: 'green' })).toContain('from-google-green/30 via-black to-google-blue/20');
    expect(render({ title: 'x', accent: 'green' })).toContain('bg-google-green/30');
    expect(render({ title: 'x', accent: 'yellow' })).toContain('bg-google-yellow/30');
  });
});

describe('AuthSplitLayout tone="light" for the public /giris page', () => {
  const LIGHT_PROPS = {
    tone: 'light',
    title: 'Üye Girişi',
    subtitle: 'Almanya101 araçlarını kullanmak için giriş yapın.',
    heroSubtitle: 'Maaş hesaplama, vize seçimi ve daha fazlası.',
  } as const;

  it('uses the light palette and none of the dark or neon classes', () => {
    const html = render(LIGHT_PROPS);
    // React 19 may prepend an image preload <link>; the layout root is the first div.
    const root = parse(html).root().children('div').first();

    expect(root.hasClass('bg-page')).toBe(true);
    expect(root.hasClass('text-ink')).toBe(true);
    expect(html).not.toMatch(/bg-black|text-white|border-white|google-|bg-gradient|blur-/);
  });

  it('shows the Berlin photo with the brand slogan only from the lg breakpoint', () => {
    const $ = parse(render(LIGHT_PROPS));
    const panel = $('aside');

    expect(panel.hasClass('hidden')).toBe(true);
    expect(panel.hasClass('lg:block')).toBe(true);
    expect(panel.find('img').attr('src')).toBe('/images/site/berlin-brandenburger-tor-aksam.webp');
    expect(panel.text()).toContain('yalnız değilsin! almanya101 seninle!');
    expect(panel.find('h2').text()).toBe('Almanya101');
    expect(panel.text()).toContain('Maaş hesaplama, vize seçimi ve daha fazlası.');
  });

  it('puts the h1 and the form inside a white featured card', () => {
    const $ = parse(render(LIGHT_PROPS));
    const card = $('h1').parent();

    expect($('h1')).toHaveLength(1);
    expect($('h1').text()).toBe('Üye Girişi');
    for (const cls of ['rounded-card', 'border', 'border-line', 'bg-white', 'shadow-float']) {
      expect(card.hasClass(cls), cls).toBe(true);
    }
    expect(card.find('form#auth-form button[type="submit"]').text()).toBe('Giriş Yap');
    expect(card.find('p').first().hasClass('text-muted')).toBe(true);
  });

  it('does not nest a second <main> inside the root layout', () => {
    expect(parse(render(LIGHT_PROPS))('main')).toHaveLength(0);
  });

  it('lists the default highlights when none are passed', () => {
    const $ = parse(render(LIGHT_PROPS));
    const items = $('aside li')
      .map((_, el) => $(el).text())
      .get();

    expect(items).toEqual([
      'Ücretsiz interaktif Almanya araçları',
      'Topluluk, köşe yazıları ve güncel haberler',
      'Kişisel planlama ve karar destek',
    ]);
  });

  it('renders custom highlights instead of the defaults', () => {
    const highlights = ['Üyeler, haberler ve köşe yazıları', 'Hizmet rehberi öneri onayları'] as const;
    const $ = parse(render({ ...LIGHT_PROPS, highlights }));
    const items = $('aside li')
      .map((_, el) => $(el).text())
      .get();

    expect(items).toEqual([...highlights]);
    expect($('aside').text()).not.toContain('Kişisel planlama ve karar destek');
  });

  it('ignores highlights in the dark layout so its markup stays identical', () => {
    const props = { ...ADMIN_PROPS, highlights: ['Özel madde'] };

    expect(render(props)).toBe(render(ADMIN_PROPS));
  });
});
