import { createElement } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import {
  BriefcaseBusiness,
  Calculator,
  FileText,
  House,
  MapPin,
  MessageCircle,
  Newspaper,
  Plane,
} from 'lucide-react';

vi.mock('@/components/ui/Container', async () => {
  const { createElement } = await import('react');

  return {
    Container: ({ children, className }: { children: ReactNode; className?: string }) =>
      createElement('div', { 'data-container': '', className }, children),
  };
});

import { Accordion } from '@/components/site/Accordion';
import { ColorTile } from '@/components/site/ColorTile';
import { IntentStrip } from '@/components/site/IntentStrip';
import { MediaCard } from '@/components/site/MediaCard';
import { PhotoCard } from '@/components/site/PhotoCard';
import { PhotoTile } from '@/components/site/PhotoTile';
import { ServiceGrid } from '@/components/site/ServiceGrid';
import type { ServiceGroup } from '@/components/site/ServiceGrid';
import { ServiceTile } from '@/components/site/ServiceTile';
import type { ServiceItem } from '@/components/site/ServiceTile';
import { ShortcutTile } from '@/components/site/ShortcutTile';
import { TONE_STYLES, toneAt } from '@/components/site/tones';

const EXTERNAL_HREF = 'https://chat.whatsapp.com/almanya101';

const render = (element: ReactElement): string => renderToStaticMarkup(element);

const countMatches = (html: string, pattern: RegExp): number =>
  (html.match(pattern) ?? []).length;

/** Opening tags such as `<details ...>`, in document order. */
const openingTags = (html: string, tag: string): string[] =>
  html.match(new RegExp(`<${tag}\\b[^>]*>`, 'g')) ?? [];

const classesOf = (openTag: string): string[] =>
  /\sclass="([^"]*)"/.exec(openTag)?.[1].split(/\s+/) ?? [];

/** Class list of every element with the given tag, in document order. */
const classListsOf = (html: string, tag: string): string[][] =>
  openingTags(html, tag).map(classesOf);

/** True when any element carries exactly this class token. */
const hasClass = (html: string, token: string): boolean =>
  [...html.matchAll(/\sclass="([^"]*)"/g)].some((match) => match[1].split(/\s+/).includes(token));

const isOpen = (openTag: string): boolean => /\sopen(?:=""|\s|>)/.test(openTag);

const anchorCount = (html: string): number => countMatches(html, /<a\s/g);

const expectNewTab = (html: string, href: string): void => {
  const anchor = openingTags(html, 'a').find((tag) => tag.includes(`href="${href}"`));
  expect(anchor).toBeDefined();
  expect(anchor).toContain('target="_blank"');
  expect(anchor).toContain('rel="noopener noreferrer"');
};

/** Effective top/left hairline on mobile (base) and desktop (lg) for one grid cell. */
const hairlines = (classes: string[]) => {
  const edge = (side: 't' | 'l') => {
    const base = classes.includes(`border-${side}`);
    const lg = classes.includes(`lg:border-${side}`)
      ? true
      : classes.includes(`lg:border-${side}-0`)
        ? false
        : base;
    return { base, lg };
  };

  return { top: edge('t'), left: edge('l') };
};

const faqItems = [
  { id: 'soru-1', title: 'Anmeldung nedir?', content: 'Adres kaydıdır.' },
  { title: 'Steuer-ID ne zaman gelir?', content: 'Birkaç hafta içinde postayla gelir.' },
  { title: 'Banka hesabı nasıl açılır?', content: 'Online bankalarla birkaç dakikada.' },
  { title: 'Sağlık sigortası zorunlu mu?', content: 'Evet, Almanya’da zorunludur.' },
  { title: 'Ehliyet çevrilir mi?', content: 'Belirli şartlarla çevrilir.' },
];

const services: ServiceItem[] = [
  { href: '/maas-hesaplama', icon: Calculator, title: 'Maaş hesaplama', description: 'Brütten nete hesapla' },
  { href: '/is-ilanlari', icon: BriefcaseBusiness, title: 'İş ilanları', description: 'Güncel ilanlar' },
  { href: '/belgeler', icon: FileText, title: 'Yararlı belgeler' },
  { href: '/almanya-yolunu-sec', icon: Plane, title: 'Almanya yolunu seç' },
  { href: '/banka-secim', icon: House, title: 'Banka seçimi' },
  { href: EXTERNAL_HREF, icon: MessageCircle, title: 'WhatsApp topluluğu' },
];

describe('Accordion', () => {
  it('renders one native <details> per item, all sharing the same name', () => {
    const html = render(createElement(Accordion, { name: 'sss', items: faqItems }));
    const details = openingTags(html, 'details');

    expect(details).toHaveLength(faqItems.length);
    for (const tag of details) {
      expect(tag).toContain('name="sss"');
    }
    expect(countMatches(html, /<summary\b/g)).toBe(faqItems.length);
    for (const item of faqItems) {
      expect(html).toContain(item.title);
      expect(html).toContain(item.content);
    }
    expect(details[0]).toContain('id="soru-1"');
  });

  it('keeps every item closed by default and opens only defaultOpenIndex', () => {
    const closed = openingTags(render(createElement(Accordion, { name: 'sss', items: faqItems })), 'details');
    expect(closed.filter(isOpen)).toHaveLength(0);

    const opened = openingTags(
      render(createElement(Accordion, { name: 'sss', items: faqItems, defaultOpenIndex: 2 })),
      'details'
    );
    expect(opened.filter(isOpen)).toHaveLength(1);
    expect(isOpen(opened[2])).toBe(true);
  });

  it('cycles the firmascope tone text colours and dots through the titles with toneCycle', () => {
    const html = render(createElement(Accordion, { name: 'sss', items: faqItems, toneCycle: true }));
    const rows = html.split('<summary').slice(1);

    expect(rows).toHaveLength(faqItems.length);
    rows.forEach((row, index) => {
      const tone = TONE_STYLES[toneAt(index)];
      const nextTone = TONE_STYLES[toneAt(index + 1)];
      expect(hasClass(row, tone.text)).toBe(true);
      expect(hasClass(row, tone.solid)).toBe(true);
      expect(hasClass(row, nextTone.text)).toBe(false);
    });
  });

  it('uses plain ink titles without toneCycle and applies root and item classes', () => {
    const html = render(
      createElement(Accordion, {
        name: 'sss',
        items: faqItems,
        className: 'faq-section',
        itemClassName: 'faq-item',
      })
    );

    expect(html).not.toMatch(/text-alm-/);
    expect(hasClass(html, 'faq-section')).toBe(true);
    expect(classListsOf(html, 'details').every((classes) => classes.includes('faq-item'))).toBe(true);
    expect(html).toContain('lucide-chevron-down');
  });
});

describe('ServiceTile', () => {
  it('shows the icon on its tone tint with an h3 title and the description', () => {
    const html = render(
      createElement(ServiceTile, {
        href: '/maas-hesaplama',
        icon: Calculator,
        title: 'Maaş hesaplama',
        description: 'Brütten nete hesapla',
        tone: 'green',
      })
    );

    expect(hasClass(html, TONE_STYLES.green.tint)).toBe(true);
    expect(hasClass(html, TONE_STYLES.green.text)).toBe(true);
    expect(html).toMatch(/<h3\b[^>]*>Maaş hesaplama<\/h3>/);
    expect(html).toContain('Brütten nete hesapla');
    expect(html).toContain('href="/maas-hesaplama"');
    expect(html).not.toContain('target=');
    expect(anchorCount(html)).toBe(1);
  });

  it('opens external tiles in a new tab', () => {
    const html = render(
      createElement(ServiceTile, { href: EXTERNAL_HREF, icon: MessageCircle, title: 'WhatsApp topluluğu' })
    );

    expectNewTab(html, EXTERNAL_HREF);
  });
});

describe('ServiceGrid', () => {
  it('renders every item as a tile link inside a list', () => {
    const html = render(createElement(ServiceGrid, { items: services }));

    for (const service of services) {
      expect(html).toContain(`href="${service.href}"`);
      expect(html).toContain(service.title);
    }
    expect(anchorCount(html)).toBe(services.length);
    expect(countMatches(html, /<li\b/g)).toBe(services.length);
    expectNewTab(html, EXTERNAL_HREF);
  });

  it('rotates firmascope tones through untoned items and keeps explicit tones', () => {
    const toned: ServiceItem[] = services.map((service, index) =>
      index === 1 ? { ...service, tone: 'red' } : service
    );
    const html = render(createElement(ServiceGrid, { items: toned }));
    // Word boundary: lucide icons contain <line> elements.
    const cells = html.split(/<li\b/).slice(1);

    expect(cells).toHaveLength(toned.length);
    cells.forEach((cell, index) => {
      const tone = index === 1 ? 'red' : toneAt(index);
      expect(hasClass(cell, TONE_STYLES[tone].tint)).toBe(true);
    });
  });

  it('draws hairlines only between tiles for 2 mobile and 4 desktop columns', () => {
    const html = render(createElement(ServiceGrid, { items: services }));
    const [list] = classListsOf(html, 'ul');

    expect(list).toEqual(expect.arrayContaining(['grid-cols-2', 'lg:grid-cols-4']));
    expect(list.some((token) => token.startsWith('border'))).toBe(false);
    expect(classListsOf(html, 'li').map(hairlines)).toEqual([
      { top: { base: false, lg: false }, left: { base: false, lg: false } },
      { top: { base: false, lg: false }, left: { base: true, lg: true } },
      { top: { base: true, lg: false }, left: { base: false, lg: true } },
      { top: { base: true, lg: false }, left: { base: true, lg: true } },
      { top: { base: true, lg: true }, left: { base: false, lg: false } },
      { top: { base: true, lg: true }, left: { base: true, lg: true } },
    ]);
  });

  it('keeps hairlines correct for 3 desktop columns with an incomplete last row', () => {
    const html = render(createElement(ServiceGrid, { items: services.slice(0, 5), columns: 3 }));
    const [list] = classListsOf(html, 'ul');

    expect(list).toContain('lg:grid-cols-3');
    expect(classListsOf(html, 'li').map(hairlines)).toEqual([
      { top: { base: false, lg: false }, left: { base: false, lg: false } },
      { top: { base: false, lg: false }, left: { base: true, lg: true } },
      { top: { base: true, lg: false }, left: { base: false, lg: true } },
      { top: { base: true, lg: true }, left: { base: true, lg: false } },
      { top: { base: true, lg: true }, left: { base: false, lg: true } },
    ]);
  });

  it('renders groups with a toned dot, a heading and the group tone on untoned tiles', () => {
    const groups: ServiceGroup[] = [
      { title: 'Araçlar', tone: 'blue', items: services.slice(0, 3) },
      { title: 'Topluluk ve biz', tone: 'green', items: services.slice(3) },
    ];
    const html = render(createElement(ServiceGrid, { groups }));
    const [firstGroup, secondGroup] = html.split('Topluluk ve biz');

    expect(html).toMatch(/<h3\b[^>]*>[\s\S]*?Araçlar<\/h3>/);
    expect(html).toMatch(/<h3\b[^>]*>[\s\S]*?Topluluk ve biz<\/h3>/);
    for (const service of services) {
      expect(html).toContain(`href="${service.href}"`);
    }
    expect(hasClass(html, TONE_STYLES.blue.solid)).toBe(true);
    expect(hasClass(html, TONE_STYLES.green.solid)).toBe(true);
    expect(hasClass(firstGroup, TONE_STYLES.blue.tint)).toBe(true);
    expect(hasClass(firstGroup, TONE_STYLES.green.tint)).toBe(false);
    expect(hasClass(secondGroup, TONE_STYLES.green.tint)).toBe(true);
    expect(countMatches(html, /<ul\b/g)).toBe(groups.length);
  });
});

describe('MediaCard', () => {
  const card = {
    href: '/haberler/yeni-vatandaslik-yasasi',
    title: 'Yeni vatandaşlık yasası',
    description: 'Değişiklikler bu ay yürürlüğe girdi.',
  };

  it('renders the photo on top when an image is given, with exactly one link', () => {
    const html = render(
      createElement(MediaCard, {
        ...card,
        image: { src: '/images/site/berlin-spree.webp', alt: 'Spree kıyısı' },
        fallback: { icon: Newspaper, tone: 'orange' },
        linkLabel: 'Haberi oku',
      })
    );

    expect(html).toMatch(/<img\b[^>]*alt="Spree kıyısı"/);
    expect(html).toMatch(/images(?:%2F|\/)site(?:%2F|\/)berlin-spree\.webp/);
    expect(html).not.toContain('lucide-newspaper');
    expect(anchorCount(html)).toBe(1);
    expect(html).toContain(`href="${card.href}"`);
    expect(html).toContain(card.description);
    expect(html).toContain('Haberi oku');
  });

  it('renders the toned icon fallback tile when there is no image', () => {
    const html = render(createElement(MediaCard, { ...card, fallback: { icon: Newspaper, tone: 'orange' } }));

    expect(html).not.toContain('<img');
    expect(html).toContain('lucide-newspaper');
    expect(hasClass(html, TONE_STYLES.orange.tint)).toBe(true);
    expect(anchorCount(html)).toBe(1);
  });

  it('makes the whole card clickable through a stretched title link', () => {
    const html = render(createElement(MediaCard, card));
    const [anchor] = classListsOf(html, 'a');
    const [article] = classListsOf(html, 'article');

    expect(html).toMatch(/<h3\b[^>]*><a\s[^>]*>Yeni vatandaşlık yasası<\/a><\/h3>/);
    expect(anchor).toEqual(expect.arrayContaining(['after:absolute', 'after:inset-0']));
    expect(article).toEqual(expect.arrayContaining(['relative', 'rounded-card', 'border-line', 'bg-white']));
    expect(anchorCount(html)).toBe(1);
  });

  it('renders the tag, meta and opens external cards in a new tab', () => {
    const html = render(
      createElement(MediaCard, {
        ...card,
        href: 'https://www.tagesschau.de/haber',
        tag: { label: 'Haber', tone: 'blue' },
        meta: createElement('span', null, '21 Ekim 2026'),
      })
    );

    expect(html).toContain('Haber');
    expect(hasClass(html, TONE_STYLES.blue.text)).toBe(true);
    expect(html).toContain('21 Ekim 2026');
    expectNewTab(html, 'https://www.tagesschau.de/haber');
    expect(anchorCount(html)).toBe(1);
  });
});

describe('PhotoCard', () => {
  it('renders the photo with a white pill chip link and the inset footer bar', () => {
    const html = render(
      createElement(PhotoCard, {
        src: '/images/site/berlin-brandenburger-tor.webp',
        alt: 'Brandenburger Tor',
        chip: { label: 'Berlin rehberi', href: '/almanyada-yasam', icon: MapPin },
        footer: createElement('span', null, 'Yakınında bir topluluk var'),
        priority: true,
      })
    );

    expect(html).toMatch(/<img\b[^>]*alt="Brandenburger Tor"/);
    expect(html).toContain('Berlin rehberi');
    expect(html).toContain('href="/almanyada-yasam"');
    expect(html).toContain('lucide-map-pin');
    expect(html).toContain('Yakınında bir topluluk var');
    expect(hasClass(html, 'rounded-card')).toBe(true);
    expect(hasClass(html, 'aspect-[3/2]')).toBe(true);
  });

  it('renders a plain chip without a link and omits empty slots', () => {
    const withChip = render(
      createElement(PhotoCard, { src: '/images/site/berlin-spree.webp', alt: 'Spree', chip: { label: 'Berlin' } })
    );
    expect(withChip).toContain('Berlin');
    expect(anchorCount(withChip)).toBe(0);

    const bare = render(createElement(PhotoCard, { src: '/images/site/berlin-spree.webp', alt: 'Spree' }));
    expect(anchorCount(bare)).toBe(0);
    expect(countMatches(bare, /<img\b/g)).toBe(1);
  });

  it('supports the wide and tall aspects and external chip links', () => {
    const wide = render(createElement(PhotoCard, { src: '/images/site/ofis-ekip.webp', alt: 'Ekip', aspect: 'wide' }));
    const tall = render(createElement(PhotoCard, { src: '/images/site/ofis-ekip.webp', alt: 'Ekip', aspect: 'tall' }));
    const external = render(
      createElement(PhotoCard, {
        src: '/images/site/ofis-ekip.webp',
        alt: 'Ekip',
        chip: { label: 'Topluluk', href: EXTERNAL_HREF },
      })
    );

    expect(hasClass(wide, 'aspect-[16/9]')).toBe(true);
    expect(hasClass(tall, 'aspect-[4/5]')).toBe(true);
    expectNewTab(external, EXTERNAL_HREF);
  });
});

describe('ShortcutTile', () => {
  it('fills the brand tile with brand-700 and white text', () => {
    const html = render(
      createElement(ShortcutTile, { href: '/maas-hesaplama', icon: Calculator, label: 'Brütten nete maaş hesapla', tone: 'brand' })
    );
    const [anchor] = classListsOf(html, 'a');

    expect(anchor).toEqual(expect.arrayContaining(['bg-brand-700', 'text-white']));
    expect(anchor).not.toContain('bg-band');
    expect(html).toContain('Brütten nete maaş hesapla');
    expect(html).toContain('href="/maas-hesaplama"');
    expect(html).toContain('lucide-arrow-up-right');
    expect(html).not.toContain('target=');
  });

  it('uses the band surface with ink text and opens external links in a new tab', () => {
    const html = render(
      createElement(ShortcutTile, { href: EXTERNAL_HREF, icon: MessageCircle, label: 'WhatsApp topluluğuna katıl', tone: 'band' })
    );
    const [anchor] = classListsOf(html, 'a');

    expect(anchor).toEqual(expect.arrayContaining(['bg-band', 'text-ink']));
    expect(anchor).not.toContain('bg-brand-700');
    expect(anchor).not.toContain('text-white');
    expectNewTab(html, EXTERNAL_HREF);
  });
});

describe('IntentStrip', () => {
  const items = [
    { label: 'Almanya yoluna çıkıyorum', href: '/almanya-yolunu-sec' },
    { label: 'İş arıyorum', href: '/is-ilanlari' },
    { label: 'Maaşımı hesaplayacağım', href: '/maas-hesaplama' },
    { label: 'Belgelerimi hazırlıyorum', href: '/belgeler' },
  ];

  it('renders the bold label and every intent link with a brand arrow', () => {
    const html = render(createElement(IntentStrip, { label: 'Bugün neyi halledelim?', items }));

    expect(html).toContain('Bugün neyi halledelim?');
    for (const item of items) {
      expect(html).toContain(`href="${item.href}"`);
      expect(html).toContain(item.label);
    }
    expect(anchorCount(html)).toBe(items.length);
    expect(countMatches(html, /lucide-arrow-up-right/g)).toBe(items.length);
    expect(hasClass(html, 'text-brand-700')).toBe(true);
  });

  it('spans the page between hairlines with 2 columns on mobile', () => {
    const html = render(
      createElement(IntentStrip, { label: 'Bugün neyi halledelim?', items: [...items, { label: 'Topluluk', href: EXTERNAL_HREF }] })
    );
    const [strip] = classListsOf(html, 'nav');
    const [list] = classListsOf(html, 'ul');

    expect(strip).toEqual(expect.arrayContaining(['border-y', 'border-line']));
    expect(list).toContain('grid-cols-2');
    expect(html).toContain('data-container');
    expectNewTab(html, EXTERNAL_HREF);
  });
});

describe('ColorTile', () => {
  it('renders a tinted link tile with kicker, title and arrow', () => {
    const html = render(
      createElement(ColorTile, { href: '/rehber', icon: MapPin, title: 'Şehir rehberi', kicker: 'Rehber', tone: 'yellow' })
    );

    expect(hasClass(html, TONE_STYLES.yellow.tint)).toBe(true);
    expect(html).toContain('Şehir rehberi');
    expect(html).toContain('Rehber');
    expect(html).toContain('lucide-map-pin');
    expect(html).toContain('lucide-arrow-up-right');
    expect(anchorCount(html)).toBe(1);
    expect(html).toContain('href="/rehber"');
  });

  it('renders a static tile without link or arrow when href is omitted', () => {
    const html = render(createElement(ColorTile, { icon: Newspaper, title: 'Haberler', tone: 'teal' }));

    expect(hasClass(html, TONE_STYLES.teal.tint)).toBe(true);
    expect(anchorCount(html)).toBe(0);
    expect(html).not.toContain('lucide-arrow-up-right');
  });

  it('opens external colour tiles in a new tab', () => {
    const html = render(createElement(ColorTile, { href: EXTERNAL_HREF, icon: MessageCircle, title: 'Topluluk', tone: 'green' }));

    expectNewTab(html, EXTERNAL_HREF);
  });
});

describe('PhotoTile', () => {
  it('renders a photo city tile link with white kicker and title', () => {
    const html = render(
      createElement(PhotoTile, {
        href: '/almanyada-yasam',
        src: '/images/site/frankfurt-skyline.webp',
        alt: 'Frankfurt silueti',
        title: 'Frankfurt',
        kicker: 'Hessen',
      })
    );

    expect(anchorCount(html)).toBe(1);
    expect(html).toContain('href="/almanyada-yasam"');
    expect(html).toMatch(/<img\b[^>]*alt="Frankfurt silueti"/);
    expect(html).toContain('Frankfurt');
    expect(html).toContain('Hessen');
    expect(html).toContain('lucide-arrow-up-right');
    expect(hasClass(html, 'text-white')).toBe(true);
  });

  it('opens external photo tiles in a new tab', () => {
    const html = render(
      createElement(PhotoTile, { href: EXTERNAL_HREF, src: '/images/site/berlin-spree.webp', alt: 'Spree', title: 'Berlin' })
    );

    expectNewTab(html, EXTERNAL_HREF);
  });
});

describe('site block style guard', () => {
  it('keeps legacy dark-theme classes, gradients and em dashes out of the blocks', () => {
    const blocks = [
      createElement(Accordion, { name: 'sss', items: faqItems, toneCycle: true }),
      createElement(ServiceGrid, { items: services }),
      createElement(MediaCard, { href: '/haberler', title: 'Haber', fallback: { icon: Newspaper, tone: 'blue' } }),
      createElement(PhotoCard, { src: '/images/site/berlin-spree.webp', alt: 'Spree', chip: { label: 'Berlin', href: '/' } }),
      createElement(ShortcutTile, { href: '/', icon: Calculator, label: 'Hesapla', tone: 'brand' }),
      createElement(IntentStrip, { label: 'Bugün neyi halledelim?', items: [{ label: 'İş', href: '/is-ilanlari' }] }),
      createElement(ColorTile, { href: '/', icon: MapPin, title: 'Rehber', tone: 'blue' }),
    ].map(render);
    const photoTile = render(createElement(PhotoTile, { href: '/', src: '/images/site/berlin-spree.webp', alt: 'Spree', title: 'Berlin' }));
    const forbidden = [
      'bg-black',
      'google-',
      'shadow-glow',
      'bg-aurora',
      'bg-grid',
      'bg-noise',
      'neon-border',
      'text-gradient',
      'reveal',
      'font-display',
      'backdrop-blur',
      'border-white/',
      '—',
    ];

    for (const html of [...blocks, photoTile]) {
      for (const token of forbidden) {
        expect(html).not.toContain(token);
      }
    }
    // Only the photo city tile carries the contract's dark legibility gradient.
    for (const html of blocks) {
      expect(html).not.toContain('gradient');
    }
  });
});
