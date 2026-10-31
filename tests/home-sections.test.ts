import { createElement } from 'react';
import type { ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { load } from 'cheerio';
import type { CheerioAPI } from 'cheerio';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { getPublishedNewsItemsMock } = vi.hoisted(() => ({ getPublishedNewsItemsMock: vi.fn() }));

vi.mock('@/lib/public-news', () => ({ getPublishedNewsItems: getPublishedNewsItemsMock }));

import HomePage, { metadata as homeMetadata } from '@/app/page';
import { ContactChannelCard } from '@/components/home/ContactChannelCard';
import { HomeFaqSection } from '@/components/home/HomeFaqSection';
import { HomeHero } from '@/components/home/HomeHero';
import { HomeServicesSection } from '@/components/home/HomeServicesSection';
import { NewsCarousel } from '@/components/sections/NewsCarousel';
import { CONTACT_CHANNELS } from '@/constants/contact-channels';
import { HOMEPAGE_FAQ_ITEMS, HOMEPAGE_ITEMS, HOME_INTENT_ITEMS } from '@/constants/home-data';

const WHATSAPP_HREF = 'https://chat.whatsapp.com/JXzMvjJoc57EKDDABSB0jo';

const SAMPLE_NEWS = [
  {
    id: 'n1',
    slug: 'yeni-vize-kurallari',
    href: '/haberler/yeni-vize-kurallari',
    title: 'Almanya yeni vize kurallarını açıkladı',
    excerpt: 'Nitelikli göç için başvuru adımları sadeleşiyor.',
    image: 'https://cdn.example.com/haber.jpg',
    date: '20 Ekim 2026',
    publishedAt: new Date().toISOString(),
    category: 'Göç',
  },
  {
    id: 'n2',
    slug: 'kira-artislari',
    href: '/haberler/kira-artislari',
    title: 'Büyük şehirlerde kira artışı sürüyor',
    excerpt: '',
    image: '',
    date: '19 Ekim 2026',
    publishedAt: new Date().toISOString(),
  },
];

function render(element: ReactElement): CheerioAPI {
  return load(renderToStaticMarkup(element), null, false);
}

async function renderHomePage(): Promise<CheerioAPI> {
  return render(await HomePage());
}

function classTokens($: CheerioAPI): string[] {
  return $('[class]')
    .map((_, el) => ($(el).attr('class') ?? '').split(/\s+/).filter(Boolean))
    .get();
}

function jsonLdPayloads($: CheerioAPI): Array<Record<string, unknown>> {
  return $('script[type="application/ld+json"]')
    .map((_, el) => JSON.parse($(el).html() ?? '{}') as Record<string, unknown>)
    .get();
}

beforeEach(() => {
  getPublishedNewsItemsMock.mockReset();
  getPublishedNewsItemsMock.mockResolvedValue(SAMPLE_NEWS);
});

describe('HomeHero', () => {
  const hero = () => render(createElement(HomeHero, { whatsappHref: WHATSAPP_HREF }));

  it('is a .home-hero section with the three-line h1 and its brand accent', () => {
    const $ = hero();
    // The priority photo adds a hoisted <link rel="preload"> before the section.
    const section = $.root().children('section');

    expect(section).toHaveLength(1);
    expect(section.hasClass('home-hero')).toBe(true);
    expect($('h1')).toHaveLength(1);
    expect($('h1').text()).toBe("Almanya'da Yaşam ve İş İçin Türkçe Rehber");
    expect($('h1 > span.block')).toHaveLength(3);
    expect($('h1 .text-brand-600').text()).toBe('Yaşam ve İş');
  });

  it('keeps the eyebrow and the intro paragraph that Speakable reads (.home-hero p)', () => {
    const $ = hero();

    expect($.root().text()).toContain('Yaşam rehberi, iş fırsatları ve güçlü topluluk bağlantıları');
    expect($('.home-hero p').first().text()).toMatch(
      /^Almanya101, bu ülkeye taşınmayı planlayan veya burada yaşayan Türkler için.*bir sonraki adımınızı netleştirmenizi sağlar\.$/
    );
  });

  it('links the CTA, the news link, the photo footer and both shortcut tiles', () => {
    const $ = hero();
    const whatsapp = $(`a[href="${WHATSAPP_HREF}"]`);

    expect($('a[href="/is-ilanlari"]').text()).toBe('İşe Alım Firmaları');
    expect($('a[href="/is-ilanlari"] svg')).toHaveLength(1);
    expect($('a[href="/haberler"]').text()).toBe('Güncel Haberleri Oku');
    expect($('a[href="/topluluk"]').text()).toBe('Topluluğa katıl');
    expect($('a[href="/maas-hesaplama"]').text()).toContain('Brütten nete maaş hesapla');
    expect(whatsapp.text()).toContain('WhatsApp topluluğuna katıl');
    expect(whatsapp.attr('target')).toBe('_blank');
    expect(whatsapp.attr('rel')).toBe('noopener noreferrer');
  });

  it('shows the Brandenburger Tor photo with a Turkish alt text, the Berlin chip and the footer strip', () => {
    const $ = hero();
    const image = $('img');

    expect(image).toHaveLength(1);
    expect(image.attr('src')).toContain('berlin-brandenburger-tor.webp');
    expect(image.attr('alt')).toContain('Brandenburg Kapısı');
    expect($.root().text()).toContain('Berlin');
    expect($.root().text()).toContain('Yalnız değilsin! almanya101 seninle.');
  });

  it('drops the WhatsApp shortcut when there is no invite link', () => {
    const $ = render(createElement(HomeHero, {}));

    expect($.root().text()).not.toContain('WhatsApp topluluğuna katıl');
    expect($('a[href="/maas-hesaplama"]')).toHaveLength(1);
  });
});

describe('HomeServicesSection', () => {
  it('shows the section head with the link to all tools', () => {
    const $ = render(createElement(HomeServicesSection));

    expect($('h2').text()).toBe('Yalnız değilsin! Araçlarımız ve bir sürü içerik seninle!');
    expect($('h2 .text-brand-600').text()).toBe('Araçlarımız ve bir sürü içerik seninle!');
    expect($.root().text()).toContain('Araçlar ve içerikler');
    expect($('a[href="/almanya-araclari"]').text()).toBe('Tüm araçlar');
  });

  it('renders every home item exactly once under the three group titles', () => {
    const $ = render(createElement(HomeServicesSection));

    expect($('h3').map((_, el) => $(el).text()).get()).toEqual(['Araçlar', 'İçerik ve rehber', 'Topluluk ve biz']);
    expect($('h4')).toHaveLength(HOMEPAGE_ITEMS.length);
    for (const item of HOMEPAGE_ITEMS) {
      const link = $(`a[href="${item.href}"]`);

      expect(link, item.href).toHaveLength(1);
      expect(link.find('h4').text()).toBe(item.title);
      expect(link.find('p').text()).toBe(item.description);
    }
  });

  it('clamps the tile descriptions to one line', () => {
    const $ = render(createElement(HomeServicesSection));

    expect(classTokens($)).toContain('[&_p]:line-clamp-1');
  });
});

describe('NewsCarousel', () => {
  it('renders the news as media cards in a scroll-snap row with round prev/next buttons', () => {
    const $ = render(createElement(NewsCarousel, { items: SAMPLE_NEWS }));
    const cards = $('article');

    expect($('ul').first().attr('class')).toContain('snap-x');
    expect($('ul > li')).toHaveLength(2);
    expect(cards).toHaveLength(2);
    expect($('a[href="/haberler/yeni-vize-kurallari"]').text()).toBe('Almanya yeni vize kurallarını açıkladı');
    expect(cards.eq(0).find('img').attr('src')).toContain('cdn.example.com');
    expect(cards.eq(0).text()).toContain('Göç');
    expect(cards.eq(0).text()).toContain('20 Ekim 2026');
    expect(cards.eq(0).text()).toContain('Devamını Oku');
    expect($('button[aria-label="Önceki haberler"]').hasClass('rounded-full')).toBe(true);
    expect($('button[aria-label="Sonraki haberler"]').hasClass('rounded-full')).toBe(true);
  });

  it('shows a Newspaper icon tile when a news item has no image', () => {
    const $ = render(createElement(NewsCarousel, { items: SAMPLE_NEWS }));
    const second = $('article').eq(1);

    expect(second.find('img')).toHaveLength(0);
    expect(second.find('svg.lucide-newspaper')).toHaveLength(1);
  });

  it('keeps the empty-state text when nothing is published', () => {
    const $ = render(createElement(NewsCarousel, { items: [] }));

    expect($.root().text()).toContain('Henüz yayında haber bulunmuyor.');
    expect($.root().text()).toContain('Admin panelinden yayınlanan haberler burada otomatik olarak görünecek.');
    expect($('button')).toHaveLength(0);
  });
});

describe('HomeFaqSection', () => {
  it('is a .faq-section with the same heading and a single-open accordion', () => {
    const $ = render(createElement(HomeFaqSection));
    const section = $.root().children().first();

    expect(section.is('section')).toBe(true);
    expect(section.hasClass('faq-section')).toBe(true);
    expect($('h2').text()).toBe("Almanya'ya Taşınırken En Çok Merak Edilen Sorular");
    expect($('details[name="home-faq"]')).toHaveLength(HOMEPAGE_FAQ_ITEMS.length);
    expect($('details[open]')).toHaveLength(0);
  });

  it('puts every question in a summary and every answer in a paragraph Speakable can read', () => {
    const $ = render(createElement(HomeFaqSection));
    const paragraphs = $('.faq-section p').map((_, el) => $(el).text()).get();
    const summaries = $('summary').map((_, el) => $(el).text()).get();

    expect(summaries).toEqual(HOMEPAGE_FAQ_ITEMS.map((item) => item.question));
    for (const item of HOMEPAGE_FAQ_ITEMS) {
      expect(paragraphs).toContain(item.answer);
    }
  });
});

describe('ContactChannelCard', () => {
  const BANNED = /google-|shadow-|drop-shadow|backdrop-blur|bg-black|text-white|border-white|bg-white\/|gradient|translate/;

  it('renders every channel as a light 48px icon tile in the icon-only variant', () => {
    for (const channel of CONTACT_CHANNELS) {
      const $ = render(createElement(ContactChannelCard, { channel, iconOnly: true }));
      const link = $('a');
      const classes = (link.attr('class') ?? '').split(/\s+/);

      expect(link.attr('href')).toBe(channel.href);
      expect(link.attr('aria-label')).toBe(channel.label);
      expect(classes).toEqual(
        expect.arrayContaining(['h-12', 'w-12', 'rounded-btn', 'border', 'border-line', 'bg-white', 'text-ink', 'hover:border-ink/40'])
      );
      expect(link.find('svg')).toHaveLength(1);
      expect(link.attr('target')).toBe(channel.external ? '_blank' : undefined);
      expect(link.attr('rel')).toBe(channel.external ? 'noopener noreferrer' : undefined);
      expect(link.attr('class')).not.toMatch(BANNED);
    }
  });

  it('renders the labelled variants on the light palette with a 44px icon tile', () => {
    const channel = CONTACT_CHANNELS[0];

    for (const compact of [false, true]) {
      const $ = render(createElement(ContactChannelCard, { channel, compact }));
      const html = $.html();

      expect($('a').attr('class')).toContain('border-line');
      expect($('a').attr('class')).toContain('bg-white');
      expect($('h3').text()).toBe(channel.label);
      expect($('p').text()).toBe(channel.description);
      expect($('a > span[aria-hidden="true"]').attr('class')).toContain('h-11');
      expect(html).not.toMatch(BANNED);
      expect(html).not.toContain(channel.bgColor);
    }
  });
});

describe('HomePage', () => {
  it('loads 12 news items and renders a single h1', async () => {
    const $ = await renderHomePage();

    expect(getPublishedNewsItemsMock).toHaveBeenCalledWith(12);
    expect($('h1')).toHaveLength(1);
    expect($('article')).toHaveLength(SAMPLE_NEWS.length);
  });

  it('keeps the five JSON-LD blocks and points both Speakable selectors at real elements', async () => {
    const $ = await renderHomePage();
    const payloads = jsonLdPayloads($);
    const speakable = payloads.find((payload) => 'speakable' in payload)?.speakable as { cssSelector: string[] };

    expect(payloads.map((payload) => payload['@type'])).toEqual(['WebPage', 'BreadcrumbList', 'FAQPage', 'HowTo', 'WebPage']);
    expect(speakable.cssSelector).toEqual(['.home-hero p', '.faq-section p']);
    for (const selector of speakable.cssSelector) {
      expect($(selector).length, selector).toBeGreaterThan(0);
    }
  });

  it('keeps the RSS alternate next to the canonical in the home metadata', () => {
    expect(homeMetadata.alternates?.canonical).toMatch(/\/$/);
    expect(homeMetadata.alternates?.types).toEqual({
      'application/rss+xml': expect.stringMatching(/\/feed\.xml$/),
    });
  });

  it('does not repeat the unsourced numeric claims in visible copy or FAQ JSON-LD', async () => {
    const $ = await renderHomePage();
    const text = [$.root().text(), ...HOMEPAGE_FAQ_ITEMS.map((item) => item.answer)].join(' ');

    for (const claim of ['2-4 hafta', '50-80', '~3,5 milyon', "%60'ı"]) {
      expect(text, claim).not.toContain(claim);
    }
    expect(text).toContain('Destatis Mikrozensus 2025');
    expect(text).toContain('Eylül 2026 itibarıyla %6,4');
  });

  it('keeps the JSON-LD values', async () => {
    const [webPage, breadcrumb, faq, howTo] = jsonLdPayloads(await renderHomePage());

    expect(webPage).toMatchObject({
      name: "Almanya'da Yaşam ve İş İçin Türkçe Rehber",
      datePublished: '2026-01-01',
      dateModified: '2026-10-24',
    });
    expect(breadcrumb.itemListElement).toEqual([
      expect.objectContaining({ position: 1, name: 'Ana Sayfa' }),
    ]);
    expect(faq.mainEntity).toEqual(
      HOMEPAGE_FAQ_ITEMS.map((item) =>
        expect.objectContaining({ name: item.question, acceptedAnswer: expect.objectContaining({ text: item.answer }) })
      )
    );
    expect(howTo.name).toBe("Almanya'da Düzen Kurmak İçin İlk 6 Adım");
    expect((howTo.step as Array<{ name: string }>).map((step) => step.name)).toEqual([
      'Adres kaydı (Anmeldung)',
      'Vergi numarası (Steuernummer)',
      'Sağlık sigortası (Krankenversicherung)',
      'Banka hesabı açma',
      'Telefon hattı ve internet',
      'Oturum izni (Aufenthaltstitel)',
    ]);
  });

  it('links every home card, every intent and at least as many internal pages as before', async () => {
    const $ = await renderHomePage();
    const internalHrefs = $('a[href^="/"]').map((_, el) => $(el).attr('href')).get();

    for (const item of [...HOMEPAGE_ITEMS, ...HOME_INTENT_ITEMS]) {
      expect(internalHrefs, item.href).toContain(item.href);
    }
    expect($.root().text()).toContain('Bugün neyi halledelim?');
    expect(internalHrefs.length).toBeGreaterThanOrEqual(31 + HOME_INTENT_ITEMS.length);
  });

  it('keeps the section headings in page order', async () => {
    const $ = await renderHomePage();
    const headings = $('h2').map((_, el) => $(el).text()).get();

    expect(headings).toEqual([
      'Yalnız değilsin! Araçlarımız ve bir sürü içerik seninle!',
      'Almanya Haberleri Neleri Takip Etmeli?',
      "Almanya'da Düzen Kurmak İçin Nereden Başlamalı?",
      "Almanya'da Yaşam Maliyeti Ne Kadar?",
      "Almanya'ya Taşınırken En Çok Merak Edilen Sorular",
      'Almanya101 Topluluğuna Nasıl Katılabilirsiniz?',
      'Bize Nasıl Ulaşabilirsiniz?',
    ]);
  });

  it('keeps the guide accordion, the cost table and the community band content', async () => {
    const $ = await renderHomePage();
    const text = $.root().text();

    expect($('details[name="home-guide"]')).toHaveLength(4);
    expect($('details[name="home-guide"] summary').map((_, el) => $(el).text()).get()).toEqual([
      "Almanya'da Yaşam Rehberi Nedir, Neden Gerekli?",
      "Almanya'da İş Bulma Süreci Nasıl İşler?",
      "Almanya'da Türk Topluluğuyla Bağ Kurmak Neden Önemli?",
      'Almanya İçin Hangi Belgeler Hazırlanmalı?',
    ]);
    expect(text).toContain('hizmet rehberi gibi kaynaklardan');
    expect(text).toContain('maaş hesaplama sayfaları birlikte kullanıldığında');
    expect($('ol li')).toHaveLength(6);
    expect($('table tbody tr')).toHaveLength(6);
    expect($('table tbody tr').last().find('td').last().text()).toBe('€879 – €1.590');
    expect($('table tbody tr').last().find('td').last().hasClass('text-brand-700')).toBe(true);
    expect($('a[href="https://www.destatis.de"]')).toHaveLength(1);
    expect(text).toContain("Almanya'da networking çoğu zaman doğru çevreye görünür olmakla başlar.");
    expect($('img[src*="yeniherologo"]').closest('.bg-ink')).toHaveLength(1);
    expect($('.bg-ink a[aria-label]')).toHaveLength(CONTACT_CHANNELS.length);
    expect($(`.bg-ink a[href="${WHATSAPP_HREF}"]`).first().text()).toContain('WhatsApp Topluluğuna Katıl');
  });

  it('keeps the publication line and a small back-to-top link', async () => {
    const $ = await renderHomePage();
    const backToTop = $('a[aria-label="Yukarı git"]');

    expect($.root().text()).toContain('Yayın tarihi: Ocak 2026 · Son güncelleme: 24 Ekim 2026');
    expect($('time[datetime="2026-01-01"]')).toHaveLength(1);
    expect($('time[datetime="2026-10-24"]')).toHaveLength(1);
    expect(backToTop.attr('href')).toBe('#');
    expect((backToTop.attr('class') ?? '').split(/\s+/)).toEqual(
      expect.arrayContaining(['fixed', 'rounded-full', 'border-line', 'bg-white', 'shadow-float'])
    );
  });

  it('shows the empty news state when nothing is published', async () => {
    getPublishedNewsItemsMock.mockResolvedValue([]);
    const $ = await renderHomePage();

    expect($.root().text()).toContain('Henüz yayında haber bulunmuyor.');
  });

  it('uses none of the retired dark-theme classes and keeps white text on dark or brand fills', async () => {
    const $ = await renderHomePage();
    const banned = [
      /^bg-black$/,
      /^border-white\//,
      /google-/,
      /^shadow-glow/,
      /^bg-(aurora|grid|noise)$/,
      /^neon-border$/,
      /^text-gradient-tech$/,
      /^reveal/,
      /^font-display$/,
      /gradient/,
      /backdrop-blur/,
      /^animate-/,
      /^drop-shadow/,
    ];
    const utilities = classTokens($).map((token) => token.split(':').pop() ?? token);

    expect(utilities.filter((token) => banned.some((pattern) => pattern.test(token)))).toEqual([]);
    $('[class~="text-white"]').each((_, el) => {
      expect($(el).closest('.bg-ink, .bg-brand-700').length, $(el).attr('class')).toBeGreaterThan(0);
    });
  });

  it('has no em dash in the visible text', async () => {
    const $ = await renderHomePage();
    $('script').remove();

    expect($.root().text()).not.toContain('—');
  });
});
