import { createElement, Fragment } from 'react';
import type { ComponentType, ReactElement, ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { load } from 'cheerio';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/components/ui/Container', async () => {
  const { createElement } = await import('react');

  return {
    Container: ({ children, className }: { children: ReactNode; className?: string }) =>
      createElement('div', { 'data-container': 'true', className }, children),
  };
});

import { ArrowLink } from '@/components/site/ArrowLink';
import type { ArrowLinkProps } from '@/components/site/ArrowLink';
import { Chip } from '@/components/site/Chip';
import { CtaRow } from '@/components/site/CtaRow';
import { DarkBand } from '@/components/site/DarkBand';
import { Eyebrow } from '@/components/site/Eyebrow';
import { FilterPanel } from '@/components/site/FilterPanel';
import { HeadingAccent } from '@/components/site/HeadingAccent';
import { HeroDots } from '@/components/site/HeroDots';
import { PageHead } from '@/components/site/PageHead';
import { SectionHeader } from '@/components/site/SectionHeader';
import { SplitHero } from '@/components/site/SplitHero';
import { StatRow } from '@/components/site/StatRow';
import { StepList } from '@/components/site/StepList';

function render(element: ReactElement) {
  const html = renderToStaticMarkup(element);
  return { html, $: load(html, null, false) };
}

function classList(value: string | undefined): string[] {
  return (value ?? '').split(/\s+/).filter(Boolean);
}

/** createElement for blocks whose props require `children` (passed as arguments, per react/no-children-prop). */
function withChildren<P extends object>(
  type: ComponentType<P>,
  props: Omit<P, 'children'>,
  ...children: ReactNode[]
): ReactElement {
  return createElement(type, props as P, ...children);
}

const marker = (testId: string, text = '') => createElement('span', { 'data-testid': testId }, text);

const STEPS = [
  { title: 'Grubunu bul', description: 'Şehrindeki WhatsApp grubunu seç.' },
  { title: 'Profilini aktar' },
  { title: 'Hemen başla', description: 'Sorularını toplulukla paylaş.' },
];

const STATS = [
  { value: '20', label: 'soru' },
  { value: '5 dk', label: 'süre' },
  { value: 'Ücretsiz', label: 'kullanım' },
];

describe('Eyebrow', () => {
  it('renders a div with the uppercase eyebrow treatment in ink', () => {
    const { $ } = render(withChildren(Eyebrow, {}, 'Günlük hayatın için'));
    const eyebrow = $.root().children().first();

    expect(eyebrow.is('div')).toBe(true);
    expect(eyebrow.text()).toBe('Günlük hayatın için');
    expect(classList(eyebrow.attr('class'))).toEqual(
      expect.arrayContaining(['text-[13px]', 'font-bold', 'uppercase', 'tracking-[0.13em]', 'text-ink'])
    );
  });

  it('switches to white text on the dark band', () => {
    const { $ } = render(withChildren(Eyebrow, { tone: 'light' }, 'Topluluk'));
    const classes = classList($.root().children().first().attr('class'));

    expect(classes).toContain('text-white');
    expect(classes).not.toContain('text-ink');
  });
});

describe('HeadingAccent', () => {
  it('renders a brand-600 span that dark surfaces can swap to brand-500', () => {
    const light = render(withChildren(HeadingAccent, {}, 'daha kolay.'));
    expect(light.$('span').text()).toBe('daha kolay.');
    expect(classList(light.$('span').attr('class'))).toContain('text-brand-600');

    const dark = render(withChildren(HeadingAccent, { className: 'text-brand-500' }, 'x'));
    const darkClasses = classList(dark.$('span').attr('class'));
    expect(darkClasses).toContain('text-brand-500');
    expect(darkClasses).not.toContain('text-brand-600');
  });
});

describe('SectionHeader', () => {
  const props = {
    eyebrow: 'Günlük hayatın için',
    title: 'Yalnız değilsin!',
    accent: 'Araçlarımız seninle!',
    description: 'Almanya hayatın için hazırladığımız her şey.',
    link: { href: '/almanya-araclari', label: 'Tüm araçlar' },
  };

  it('renders an h2 by default with the title and a brand-600 accent line', () => {
    const { $ } = render(createElement(SectionHeader, props));
    const heading = $('h2');

    expect($('h1')).toHaveLength(0);
    expect(heading).toHaveLength(1);
    expect(heading.text()).toContain('Yalnız değilsin!');
    expect(classList(heading.attr('class'))).toEqual(
      expect.arrayContaining(['text-[clamp(2rem,3.5vw,2.8rem)]', 'font-extrabold', 'leading-[1.12]', 'tracking-[-0.04em]', 'text-ink'])
    );

    const accent = heading.find('.text-brand-600');
    expect(accent.text()).toBe('Araçlarımız seninle!');
    expect(classList(accent.attr('class'))).toContain('block');
  });

  it('renders an h1 with the given id when as="h1"', () => {
    const { $ } = render(createElement(SectionHeader, { ...props, as: 'h1' as const, id: 'araclar-baslik' }));

    expect($('h2')).toHaveLength(0);
    expect($('h1').attr('id')).toBe('araclar-baslik');
  });

  it('renders the eyebrow, description and a text link aligned right on desktop', () => {
    const { $ } = render(createElement(SectionHeader, props));
    const wrapper = $.root().children().first();
    const link = $('a[href="/almanya-araclari"]');

    expect(wrapper.text()).toContain('Günlük hayatın için');
    expect($('p').text()).toBe('Almanya hayatın için hazırladığımız her şey.');
    expect(link.text()).toContain('Tüm araçlar');
    expect(link.find('svg')).toHaveLength(1);
    expect(classList(wrapper.attr('class'))).toEqual(
      expect.arrayContaining(['flex-col', 'md:flex-row', 'md:items-end', 'md:justify-between'])
    );
  });

  it('leaves out optional parts that are not given', () => {
    const { $ } = render(createElement(SectionHeader, { title: 'Sadece başlık' }));

    expect($('a')).toHaveLength(0);
    expect($('p')).toHaveLength(0);
    expect($('.text-brand-600')).toHaveLength(0);
    expect($('h2').text()).toBe('Sadece başlık');
  });

  it('uses white text, a brand-500 accent and a light link on dark surfaces', () => {
    const { $ } = render(createElement(SectionHeader, { ...props, tone: 'light' as const }));
    const headingClasses = classList($('h2').attr('class'));

    expect(headingClasses).toContain('text-white');
    expect(headingClasses).not.toContain('text-ink');
    expect($('h2 .text-brand-500').text()).toBe('Araçlarımız seninle!');
    expect(classList($('a').attr('class'))).toContain('text-white');
  });

  it('centres everything when align="center"', () => {
    const { $ } = render(createElement(SectionHeader, { ...props, align: 'center' as const }));
    const classes = classList($.root().children().first().attr('class'));

    expect(classes).toEqual(expect.arrayContaining(['items-center', 'text-center']));
    expect(classes).not.toContain('md:flex-row');
  });
});

describe('ArrowLink', () => {
  it('renders internal links with a relative href, no target and a hidden arrow', () => {
    const { $ } = render(withChildren(ArrowLink, { href: '/maas-hesaplama' }, 'Maaşını hesapla'));
    const link = $('a');

    expect(link.attr('href')).toBe('/maas-hesaplama');
    expect(link.attr('target')).toBeUndefined();
    expect(link.attr('rel')).toBeUndefined();
    expect(link.text()).toBe('Maaşını hesapla');
    expect(link.find('svg').attr('aria-hidden')).toBe('true');
  });

  it('opens http links in a new tab with noopener noreferrer', () => {
    const { $ } = render(
      withChildren(ArrowLink, { href: 'https://www.make-it-in-germany.com/tr' }, 'Make it in Germany')
    );

    expect($('a').attr('href')).toBe('https://www.make-it-in-germany.com/tr');
    expect($('a').attr('target')).toBe('_blank');
    expect($('a').attr('rel')).toBe('noopener noreferrer');
  });

  it('lets the external prop override the automatic detection', () => {
    const forcedExternal = render(withChildren(ArrowLink, { href: '/belgeler/form.pdf', external: true }, 'PDF'));
    expect(forcedExternal.$('a').attr('target')).toBe('_blank');
    expect(forcedExternal.$('a').attr('rel')).toBe('noopener noreferrer');

    const forcedInternal = render(
      withChildren(ArrowLink, { href: 'https://almanya101.de/rehber', external: false }, 'Rehber')
    );
    expect(forcedInternal.$('a').attr('target')).toBeUndefined();
  });

  it('keeps the Corteqs text-link look with a 44px tap target', () => {
    const { $ } = render(withChildren(ArrowLink, { href: '/haberler' }, 'Tüm haberler'));

    expect(classList($('a').attr('class'))).toEqual(
      expect.arrayContaining([
        'min-h-[44px]',
        'text-sm',
        'font-semibold',
        'underline',
        'underline-offset-4',
        'text-ink',
        'hover:text-brand-700',
      ])
    );
  });

  it('supports brand and light tones', () => {
    const brand = render(withChildren(ArrowLink, { href: '/x', tone: 'brand' }, 'x'));
    const light = render(withChildren(ArrowLink, { href: '/x', tone: 'light' }, 'x'));

    expect(classList(brand.$('a').attr('class'))).toContain('text-brand-700');
    expect(classList(light.$('a').attr('class'))).toContain('text-white');
  });

  it('passes extra anchor attributes such as data-pw through', () => {
    const props = { href: '/vize-secim', 'data-pw': 'tool-link', 'aria-label': 'Vize aracı' };
    const { $ } = render(withChildren(ArrowLink, props as Omit<ArrowLinkProps, 'children'>, 'Vize'));

    expect($('a').attr('data-pw')).toBe('tool-link');
    expect($('a').attr('aria-label')).toBe('Vize aracı');
  });
});

describe('SplitHero', () => {
  const props = {
    id: 'ana-hero',
    eyebrow: 'Almanya rehberi',
    title: createElement(Fragment, null, "Almanya'da ", withChildren(HeadingAccent, {}, 'Yaşam ve İş'), ' İçin'),
    description: 'Türkçe rehber.',
    actions: marker('hero-action', 'İşe Alım Firmaları'),
    media: marker('hero-media'),
    aside: marker('hero-aside'),
  };

  it('renders a section with the h1, eyebrow, description and actions', () => {
    const { $ } = render(createElement(SplitHero, props));
    const section = $.root().children().first();

    expect(section.is('section')).toBe(true);
    expect(section.attr('id')).toBe('ana-hero');
    expect($('h1')).toHaveLength(1);
    expect($('h1').text()).toBe("Almanya'da Yaşam ve İş İçin");
    expect($('h1 .text-brand-600').text()).toBe('Yaşam ve İş');
    expect(classList($('h1').attr('class'))).toEqual(
      expect.arrayContaining(['text-[clamp(2.5rem,5vw,4.125rem)]', 'font-extrabold', 'leading-[1.04]', 'tracking-[-0.045em]'])
    );
    expect(section.text()).toContain('Almanya rehberi');
    expect($('p').text()).toBe('Türkçe rehber.');
    expect($('[data-testid="hero-action"]')).toHaveLength(1);
  });

  it('puts media and aside in their own column with the aside under the media', () => {
    const { $, html } = render(createElement(SplitHero, props));
    const textColumn = $('h1').parent();
    const mediaColumn = $('[data-testid="hero-media"]').parent();

    expect(textColumn.find('[data-testid="hero-media"]')).toHaveLength(0);
    expect(mediaColumn.find('[data-testid="hero-aside"]')).toHaveLength(1);
    expect(html.indexOf('hero-media')).toBeLessThan(html.indexOf('hero-aside'));
    expect(html).toContain('lg:grid-cols-[1.05fr_1fr]');
    expect(html).toContain('lg:gap-[38px]');
  });

  it('adds the decorative dots only when decorated', () => {
    const plain = render(createElement(SplitHero, props));
    const decorated = render(createElement(SplitHero, { ...props, decorated: true }));

    expect(plain.$('section > [aria-hidden="true"]')).toHaveLength(0);
    expect(decorated.$('section > [aria-hidden="true"]')).toHaveLength(1);
  });
});

describe('HeroDots', () => {
  it('is a static, aria-hidden decoration of small blurred dots', () => {
    const { $ } = render(createElement(HeroDots));
    const root = $.root().children().first();
    const dots = root.children();

    expect(root.attr('aria-hidden')).toBe('true');
    expect(classList(root.attr('class'))).toEqual(
      expect.arrayContaining(['pointer-events-none', 'absolute', 'overflow-hidden'])
    );
    expect(dots.length).toBeGreaterThanOrEqual(8);
    expect(dots.length).toBeLessThanOrEqual(12);
    dots.each((_, dot) => {
      const classes = classList($(dot).attr('class'));
      expect(classes).toEqual(expect.arrayContaining(['rounded-full', 'opacity-25', 'blur-[1px]']));
      expect(classes.some((token) => /^bg-alm-(blue|green|orange|yellow)$/.test(token))).toBe(true);
      expect(classes.some((token) => /^size-(2|3|5)$/.test(token))).toBe(true);
    });
  });
});

describe('StepList', () => {
  it('renders an ordered list with numbered 28px circle badges', () => {
    const { $ } = render(createElement(StepList, { steps: STEPS }));
    const items = $('ol').children('li');

    expect($('ol')).toHaveLength(1);
    expect(items).toHaveLength(3);
    items.each((index, item) => {
      const badge = $(item).find('.rounded-full').first();
      expect(badge.text()).toBe(String(index + 1));
      expect(classList(badge.attr('class'))).toEqual(expect.arrayContaining(['size-7', 'border', 'border-current']));
    });
    expect(items.eq(0).text()).toContain('Grubunu bul');
    expect(items.eq(0).text()).toContain('Şehrindeki WhatsApp grubunu seç.');
  });

  it('shows bold titles and muted descriptions on light surfaces', () => {
    const { $ } = render(createElement(StepList, { steps: STEPS }));

    expect(classList($('li').first().find('p').first().attr('class'))).toContain('font-bold');
    expect(classList($('li').first().find('p').last().attr('class'))).toContain('text-muted');
  });

  it('switches to white text on the dark band', () => {
    const { $ } = render(createElement(StepList, { steps: STEPS, tone: 'light' }));

    expect(classList($('li').first().find('.rounded-full').attr('class'))).toContain('text-white');
    expect($('.text-muted')).toHaveLength(0);
  });

  it('lays inline steps out in a wrapping row with arrows between them', () => {
    const { $ } = render(createElement(StepList, { steps: STEPS, layout: 'inline' }));

    expect(classList($('ol').attr('class'))).toEqual(expect.arrayContaining(['flex', 'flex-wrap']));
    expect($('li')).toHaveLength(3);
    expect($('li svg[aria-hidden="true"]')).toHaveLength(2);
    expect($('li').last().find('svg')).toHaveLength(0);
  });

  it('stacks column steps on mobile and uses three columns from md up', () => {
    const { $ } = render(createElement(StepList, { steps: STEPS, layout: 'columns' }));

    expect(classList($('ol').attr('class'))).toEqual(expect.arrayContaining(['grid', 'md:grid-cols-3']));
  });
});

describe('StatRow', () => {
  it('renders every value with its label', () => {
    const { $ } = render(createElement(StatRow, { stats: STATS }));
    const values = $('dd');
    const labels = $('dt');

    expect($('dl')).toHaveLength(1);
    expect(values.map((_, el) => $(el).text()).get()).toEqual(['20', '5 dk', 'Ücretsiz']);
    expect(labels.map((_, el) => $(el).text()).get()).toEqual(['soru', 'süre', 'kullanım']);
    expect(classList(values.first().attr('class'))).toEqual(expect.arrayContaining(['text-[28px]', 'font-extrabold']));
    expect(classList(labels.first().attr('class'))).toEqual(expect.arrayContaining(['text-sm', 'text-muted']));
  });

  it('renders nothing for an empty list', () => {
    expect(render(createElement(StatRow, { stats: [] })).html).toBe('');
  });

  it('uses white values on the dark band', () => {
    const { $ } = render(createElement(StatRow, { stats: STATS, tone: 'light' }));

    expect(classList($('dd').first().attr('class'))).toContain('text-white');
    expect($('.text-muted')).toHaveLength(0);
  });
});

describe('FilterPanel', () => {
  it('wraps its children in a rounded band panel with an optional heading', () => {
    const { $ } = render(
      withChildren(FilterPanel, { title: 'Filtrele' }, createElement('label', { htmlFor: 'sehir' }, 'Hangi şehir?'))
    );
    const panel = $.root().children().first();

    expect(classList(panel.attr('class'))).toEqual(expect.arrayContaining(['rounded-card', 'bg-band', 'p-5', 'md:p-6']));
    expect($('h2').text()).toBe('Filtrele');
    expect($('label').text()).toBe('Hangi şehir?');
  });

  it('renders no heading without a title', () => {
    const { $ } = render(withChildren(FilterPanel, {}, marker('filters')));

    expect($('h2, h3')).toHaveLength(0);
    expect($('[data-testid="filters"]')).toHaveLength(1);
  });
});

describe('DarkBand', () => {
  const props = {
    id: 'topluluk',
    eyebrow: 'Topluluk',
    title: 'Almanya101 Topluluğuna Nasıl Katılabilirsiniz?',
    description: 'Binlerce kişiyle tanış.',
    aside: marker('band-aside', 'WhatsApp'),
  };
  const extras = marker('band-extra');

  it('renders a full-bleed ink band labelled by its h2', () => {
    const { $ } = render(createElement(DarkBand, props, extras));
    const band = $.root().children().first();

    expect(band.is('section')).toBe(true);
    expect(band.attr('id')).toBe('topluluk');
    expect(classList(band.attr('class'))).toEqual(expect.arrayContaining(['bg-ink', 'text-white']));
    expect($('h2').text()).toBe('Almanya101 Topluluğuna Nasıl Katılabilirsiniz?');
    expect(band.attr('aria-labelledby')).toBe($('h2').attr('id'));
    expect(band.text()).toContain('Binlerce kişiyle tanış.');
  });

  it('renders the aside inside a white floating card and extras in the left column', () => {
    const { $, html } = render(createElement(DarkBand, props, extras));
    const card = $('[data-testid="band-aside"]').parent();

    expect(classList(card.attr('class'))).toEqual(
      expect.arrayContaining(['bg-white', 'rounded-card', 'shadow-float', 'text-ink'])
    );
    expect(card.find('[data-testid="band-extra"]')).toHaveLength(0);

    const leftColumn = $('[data-testid="band-extra"]')
      .parents()
      .filter((_, el) => $(el).find('h2').length > 0)
      .first();
    expect(leftColumn).toHaveLength(1);
    expect(leftColumn.find('[data-testid="band-aside"]')).toHaveLength(0);
    expect(html).toContain('lg:grid-cols-2');
  });

  it('drops the card and the second column without an aside', () => {
    const { $, html } = render(createElement(DarkBand, { ...props, aside: undefined }, extras));

    expect($('.shadow-float')).toHaveLength(0);
    expect(html).not.toContain('lg:grid-cols-2');
    expect($('[data-testid="band-extra"]')).toHaveLength(1);
  });
});

describe('CtaRow', () => {
  it('renders a hairline-topped row with title, description and the action', () => {
    const { $ } = render(
      createElement(CtaRow, {
        eyebrow: 'Ekibimize katıl',
        title: 'Burada hizmet mi veriyorsun?',
        description: 'Profilini oluştur, yeni insanlara ulaş.',
        action: marker('cta-action', 'Başvur'),
      })
    );
    const row = $('h2').closest('.border-t');

    expect(row).toHaveLength(1);
    expect(classList(row.attr('class'))).toContain('border-line');
    expect(classList($('h2').attr('class'))).toEqual(expect.arrayContaining(['text-[28px]', 'font-extrabold']));
    expect(row.text()).toContain('Ekibimize katıl');
    expect(row.text()).toContain('Profilini oluştur, yeni insanlara ulaş.');
    expect(row.find('[data-testid="cta-action"]')).toHaveLength(1);
  });
});

describe('PageHead', () => {
  const props = {
    breadcrumb: [
      { label: 'Ana Sayfa', href: '/' },
      { label: 'Araçlar', href: '/almanya-araclari' },
      { label: 'Banka Seçimi' },
    ],
    eyebrow: 'Finans aracı',
    title: 'Almanya Banka Seçimi',
    accent: 'Sana uygun bankayı bul.',
    description: 'Birkaç soruyla sana uygun bankayı bul.',
    stats: STATS,
    actions: marker('head-action', 'Başla'),
    media: marker('head-media'),
  };

  it('renders breadcrumb links with 44px targets and marks the current page', () => {
    const { $ } = render(createElement(PageHead, props));
    const nav = $('nav');
    const links = nav.find('a');
    const current = nav.find('[aria-current="page"]');

    expect(nav.attr('aria-label')).toBe('Sayfa yolu');
    expect(nav.find('ol > li')).toHaveLength(3);
    expect(links.map((_, el) => $(el).attr('href')).get()).toEqual(['/', '/almanya-araclari']);
    expect(classList(links.first().attr('class'))).toContain('min-h-[44px]');
    expect(current.text()).toBe('Banka Seçimi');
    expect(current.is('a')).toBe(false);
  });

  it('renders the title as the only h1 with a brand-600 accent line', () => {
    const { $ } = render(createElement(PageHead, props));

    expect($('h1')).toHaveLength(1);
    expect($('h1').text()).toContain('Almanya Banka Seçimi');
    expect($('h1 .text-brand-600').text()).toBe('Sana uygun bankayı bul.');
    expect(classList($('h1').attr('class'))).toEqual(
      expect.arrayContaining(['text-[clamp(2.25rem,4vw,3.5rem)]', 'font-extrabold', 'leading-[1.06]', 'tracking-[-0.04em]'])
    );
  });

  it('renders description, stats, actions and media above a bottom hairline', () => {
    const { $, html } = render(createElement(PageHead, props));
    const root = $.root().children().first();
    const textColumn = $('h1').parent();

    expect(classList(root.attr('class'))).toEqual(expect.arrayContaining(['border-b', 'border-line']));
    expect(textColumn.find('p').text()).toBe('Birkaç soruyla sana uygun bankayı bul.');
    expect(textColumn.find('dd').first().text()).toBe('20');
    expect(textColumn.find('[data-testid="head-action"]')).toHaveLength(1);
    expect(textColumn.find('[data-testid="head-media"]')).toHaveLength(0);
    expect($('[data-testid="head-media"]')).toHaveLength(1);
    expect(html).toContain('lg:grid-cols-[1.13fr_1fr]');
  });

  it('renders a single column without breadcrumb, stats or media', () => {
    const { $, html } = render(createElement(PageHead, { title: 'Rehber' }));

    expect($('nav')).toHaveLength(0);
    expect($('dl')).toHaveLength(0);
    expect($('h1').text()).toBe('Rehber');
    expect(html).not.toContain('lg:grid-cols-');
  });
});

describe('Chip', () => {
  it('renders a neutral pill by default', () => {
    const { $ } = render(withChildren(Chip, {}, 'Yeni'));

    expect($('span').text()).toBe('Yeni');
    expect(classList($('span').attr('class'))).toEqual(
      expect.arrayContaining(['rounded-full', 'px-3', 'py-1', 'text-xs', 'font-semibold', 'border', 'border-line', 'bg-white', 'text-ink'])
    );
  });

  it('uses the tone tint and AA text colour for category tones', () => {
    const classes = classList(render(withChildren(Chip, { tone: 'green' }, 'Vize')).$('span').attr('class'));

    expect(classes).toEqual(expect.arrayContaining(['bg-alm-green/10', 'text-alm-green-ink']));
    expect(classes).not.toContain('bg-white');
  });

  it('supports a brand tone', () => {
    const classes = classList(render(withChildren(Chip, { tone: 'brand' }, 'Öne çıkan')).$('span').attr('class'));

    expect(classes).toContain('bg-brand-50');
    expect(classes).not.toContain('bg-white');
  });
});

describe('hard rules across the blocks', () => {
  const BANNED = [
    /^bg-black$/,
    /^border-white\//,
    /google-/,
    /^shadow-glow/,
    /^bg-(aurora|grid|noise)/,
    /^neon-border$/,
    /^text-gradient-tech$/,
    /^reveal/,
    /^font-display$/,
    /gradient/,
    /backdrop-blur/,
    /^animate-/,
  ];

  const allBlocks = createElement(
    Fragment,
    null,
    createElement(SplitHero, {
      decorated: true,
      eyebrow: 'Eyebrow',
      title: 'Başlık',
      description: 'Açıklama',
      media: marker('m'),
      aside: marker('a'),
    }),
    createElement(SectionHeader, { eyebrow: 'E', title: 'T', accent: 'A', link: { href: '/x', label: 'L' } }),
    createElement(StepList, { steps: STEPS, layout: 'inline' }),
    createElement(StepList, { steps: STEPS, layout: 'columns' }),
    createElement(StatRow, { stats: STATS }),
    withChildren(FilterPanel, { title: 'F' }, 'c'),
    createElement(DarkBand, { title: 'D', description: 'd', aside: marker('card') }),
    createElement(CtaRow, { title: 'C', action: marker('action') }),
    createElement(PageHead, { breadcrumb: [{ label: 'Ana Sayfa', href: '/' }, { label: 'X' }], title: 'P', stats: STATS, media: marker('m') }),
    withChildren(Chip, { tone: 'orange' }, 'c')
  );

  function renderedClassTokens(): string[] {
    const { $ } = render(allBlocks);
    return $('[class]')
      .map((_, el) => classList($(el).attr('class')))
      .get();
  }

  it('never emits the banned legacy classes', () => {
    const utilities = renderedClassTokens().map((token) => token.split(':').pop() ?? token);
    const offenders = utilities.filter((token) => BANNED.some((pattern) => pattern.test(token)));

    expect(offenders).toEqual([]);
  });

  it('never uses a multi-column grid without a breakpoint, so mobile stacks', () => {
    const unprefixed = renderedClassTokens().filter((token) => /^grid-cols-(?!1$)/.test(token));

    expect(unprefixed).toEqual([]);
  });
});
