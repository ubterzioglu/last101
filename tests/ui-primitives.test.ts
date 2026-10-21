import { createElement } from 'react';
import type { ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { load } from 'cheerio';
import { describe, expect, it } from 'vitest';

import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { TONE_STYLES } from '@/components/site/tones';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import type { ButtonVariant, CardVariant } from '@/types';

function render(element: ReactElement) {
  return load(renderToStaticMarkup(element));
}

function classesOf(element: ReactElement, selector: string): string[] {
  const $ = render(element);
  return ($(selector).first().attr('class') ?? '').split(/\s+/).filter(Boolean);
}

describe('Container', () => {
  it('uses the 1280px Corteqs container with 16/24/36px gutters by default', () => {
    const classes = classesOf(createElement(Container, null, 'içerik'), 'div');

    expect(classes).toEqual(
      expect.arrayContaining(['mx-auto', 'w-full', 'max-w-[1280px]', 'px-4', 'sm:px-6', 'lg:px-9']),
    );
  });

  it('keeps the narrower size names working', () => {
    const sizes = { sm: 'max-w-4xl', md: 'max-w-5xl', lg: 'max-w-6xl', full: 'max-w-full' } as const;

    for (const [size, maxWidth] of Object.entries(sizes)) {
      const classes = classesOf(
        createElement(Container, { size: size as keyof typeof sizes }, 'içerik'),
        'div',
      );
      expect(classes, size).toContain(maxWidth);
      expect(classes, size).not.toContain('max-w-[1280px]');
    }
  });
});

describe('Section', () => {
  it('renders a contained section with the 64px rhythm and no background by default', () => {
    const $ = render(createElement(Section, null, 'içerik'));
    const classes = ($('section').attr('class') ?? '').split(/\s+/);

    expect(classes).toContain('py-16');
    expect(classes.some((name) => name.startsWith('bg-'))).toBe(false);
    expect($('section > div').attr('class')).toContain('max-w-[1280px]');
  });

  it('maps every tone to its surface', () => {
    const tones = {
      page: ['bg-page'],
      band: ['bg-band'],
      white: ['bg-white'],
      ink: ['bg-ink', 'text-white'],
    } as const;

    for (const [tone, expected] of Object.entries(tones)) {
      const classes = classesOf(
        createElement(Section, { tone: tone as keyof typeof tones }, 'içerik'),
        'section',
      );
      expect(classes, tone).toEqual(expect.arrayContaining([...expected]));
    }
  });

  it('lets className override the default padding and skips the Container when not contained', () => {
    const $ = render(createElement(Section, { contained: false, className: 'py-20' }, 'içerik'));
    const classes = ($('section').attr('class') ?? '').split(/\s+/);

    expect(classes).toContain('py-20');
    expect(classes).not.toContain('py-16');
    expect($('section > div')).toHaveLength(0);
  });
});

describe('Button', () => {
  it('renders a brand primary Corteqs button by default', () => {
    const classes = classesOf(createElement(Button, null, 'Gönder'), 'button');

    expect(classes).toEqual(
      expect.arrayContaining(['bg-brand-700', 'hover:bg-brand-800', 'text-white', 'rounded-btn', 'min-h-[44px]']),
    );
  });

  it('maps every legacy variant name onto the new palette', () => {
    const expected: Record<ButtonVariant, string[]> = {
      primary: ['bg-brand-700', 'text-white'],
      secondary: ['bg-ink', 'text-white'],
      outline: ['border', 'border-line', 'bg-white', 'text-ink', 'hover:border-ink'],
      ghost: ['text-ink', 'underline', 'hover:text-brand-700'],
      danger: ['bg-alm-red-ink', 'text-white'],
      success: ['bg-alm-green-ink', 'text-white'],
    };

    for (const [variant, classes] of Object.entries(expected)) {
      const html = renderToStaticMarkup(
        createElement(Button, { variant: variant as ButtonVariant }, 'Etiket'),
      );
      const rendered = (load(html)('button').attr('class') ?? '').split(/\s+/);

      expect(rendered, variant).toEqual(expect.arrayContaining(classes));
      expect(html, variant).not.toMatch(/google-|focus:outline-none/);
    }
  });

  it('keeps every size name', () => {
    for (const size of ['sm', 'md', 'lg', 'xl'] as const) {
      const classes = classesOf(createElement(Button, { size }, 'Etiket'), 'button');
      expect(classes.some((name) => name.startsWith('min-h-')), size).toBe(true);
    }
  });

  it('appends a decorative ArrowUpRight icon when arrow is set', () => {
    const $ = render(createElement(Button, { arrow: true }, 'Üye Ol'));
    const icon = $('button > svg');

    expect(icon).toHaveLength(1);
    expect(icon.attr('aria-hidden')).toBe('true');
    expect(icon.attr('class')).toContain('lucide-arrow-up-right');
    expect($('button').text()).toBe('Üye Ol');
  });

  it('renders a link for asChild + href and forwards data and aria attributes', () => {
    const $ = render(
      createElement(
        Button,
        { asChild: true, href: '/giris', 'aria-label': 'Üye ol', 'data-pw': 'signup' } as never,
        'Üye Ol',
      ),
    );
    const link = $('a');

    expect($('button')).toHaveLength(0);
    expect(link.attr('href')).toBe('/giris');
    expect(link.attr('aria-label')).toBe('Üye ol');
    expect(link.attr('data-pw')).toBe('signup');
    expect(link.attr('class')).toContain('bg-brand-700');
  });

  it('renders a button when no href is given', () => {
    const $ = render(createElement(Button, { asChild: true, disabled: true }, 'Bekle'));

    expect($('button').attr('disabled')).toBeDefined();
    expect($('a')).toHaveLength(0);
  });
});

describe('Card', () => {
  it('uses the white 12px hairline surface with default padding', () => {
    const classes = classesOf(createElement(Card, null, 'içerik'), 'div');

    expect(classes).toEqual(
      expect.arrayContaining(['rounded-card', 'border', 'border-line', 'bg-white', 'p-6']),
    );
  });

  it('maps every variant name', () => {
    const expected: Record<CardVariant, string[]> = {
      default: ['rounded-card', 'border-line'],
      hoverable: ['rounded-card', 'hover:border-ink/30', 'transition-colors'],
      featured: ['rounded-card', 'shadow-float'],
      bordered: ['rounded-card', 'border-line'],
    };

    for (const [variant, classes] of Object.entries(expected)) {
      const rendered = classesOf(
        createElement(Card, { variant: variant as CardVariant }, 'içerik'),
        'div',
      );
      expect(rendered, variant).toEqual(expect.arrayContaining(classes));
    }
  });

  it('drops the padding with noPadding', () => {
    const classes = classesOf(createElement(Card, { noPadding: true }, 'içerik'), 'div');

    expect(classes).not.toContain('p-6');
  });
});

describe('Badge', () => {
  it('uses the chip look with tone tint and AA text colours', () => {
    const classes = classesOf(createElement(Badge, { color: 'blue' }, 'Yeni'), 'span');

    expect(classes).toEqual(
      expect.arrayContaining([
        'rounded-full',
        'font-semibold',
        TONE_STYLES.blue.tint,
        TONE_STYLES.blue.text,
      ]),
    );
  });

  it('renders gray as the neutral chip', () => {
    const classes = classesOf(createElement(Badge, { color: 'gray' }, 'Etiket'), 'span');

    expect(classes).toEqual(expect.arrayContaining(['border', 'border-line', 'bg-white', 'text-ink']));
  });

  it('keeps every colour and size name', () => {
    for (const color of ['blue', 'red', 'yellow', 'green', 'gray'] as const) {
      for (const size of ['sm', 'md', 'lg'] as const) {
        const html = renderToStaticMarkup(createElement(Badge, { color, size }, 'Etiket'));
        expect(html, `${color}/${size}`).toContain('rounded-full');
      }
    }
  });
});

describe('Breadcrumb', () => {
  const items = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'Rehber', href: '/rehber' },
    { label: 'Anmeldung' },
  ];

  it('renders an ordered list inside a Breadcrumb navigation', () => {
    const $ = render(createElement(Breadcrumb, { items }));

    expect($('nav[aria-label="Breadcrumb"] > ol > li')).toHaveLength(3);
  });

  it('links the ancestors in muted text and marks the current page in ink', () => {
    const $ = render(createElement(Breadcrumb, { items }));
    const current = $('[aria-current="page"]');

    expect($('a[href="/"]').attr('class')).toContain('text-muted');
    expect($('a[href="/rehber"]').text()).toBe('Rehber');
    expect(current).toHaveLength(1);
    expect(current.text()).toBe('Anmeldung');
    expect(current.attr('class')).toContain('text-ink');
  });

  it('separates the items with decorative slashes', () => {
    const $ = render(createElement(Breadcrumb, { items }));
    const separators = $('[aria-hidden="true"]');

    expect(separators).toHaveLength(2);
    expect(separators.first().text()).toBe('/');
  });
});
