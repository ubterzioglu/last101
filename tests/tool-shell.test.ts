import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { ToolFaq } from '@/components/tools/ToolFaq';
import { ToolHero } from '@/components/tools/ToolHero';
import { ToolInfoBand } from '@/components/tools/ToolInfoBand';
import { ToolOption } from '@/components/tools/ToolOption';
import { ToolPanel } from '@/components/tools/ToolPanel';
import { ToolProgress } from '@/components/tools/ToolProgress';
import { ToolQuestionCard } from '@/components/tools/ToolQuestionCard';

const render = (element: Parameters<typeof renderToStaticMarkup>[0]) =>
  renderToStaticMarkup(element);

describe('ToolHero', () => {
  const steps = ['Soruları yanıtla.', 'Profilini oku.', 'Sonucu gör.'];

  it('renders the title as h1, the default eyebrow and the stats', () => {
    const html = render(
      createElement(ToolHero, {
        title: 'Almanya Yolunu Seç Aracı',
        intro: 'Kısa giriş metni.',
        stats: [{ value: '15', label: 'soru' }],
        howItWorks: steps,
      })
    );

    expect(html).toMatch(/<h1[^>]*>Almanya Yolunu Seç Aracı<\/h1>/);
    expect(html).toContain('Araç');
    expect(html).toContain('Kısa giriş metni.');
    expect(html).toContain('15');
    expect(html).toContain('soru');
  });

  it('shows the default "Nasıl çalışır?" heading with numbered steps', () => {
    const html = render(createElement(ToolHero, { title: 'X', howItWorks: steps }));

    expect(html).toMatch(/<h2[^>]*>Nasıl çalışır\?<\/h2>/);
    expect(html).toContain('<ol');
    steps.forEach((step, index) => {
      expect(html).toContain(step);
      expect(html).toContain(`>${index + 1}<`);
    });
    expect(html).toContain('shadow-float');
  });

  it('accepts a custom how-it-works title and eyebrow', () => {
    const html = render(
      createElement(ToolHero, {
        title: 'X',
        eyebrow: 'Hesaplama',
        howItWorksTitle: 'Nasıl Çalışır?',
        howItWorks: steps,
      })
    );

    expect(html).toContain('Nasıl Çalışır?');
    expect(html).toContain('Hesaplama');
  });
});

describe('ToolProgress', () => {
  it('renders the default "Soru x / y" label and a proportional bar', () => {
    const html = render(createElement(ToolProgress, { current: 3, total: 20 }));

    expect(html).toContain('Soru 3 / 20');
    expect(html).toContain('width:15%');
    expect(html).toContain('bg-brand-500');
    expect(html).not.toContain('<button');
  });

  it('renders a reset button with its test id when onReset is given', () => {
    const html = render(
      createElement(ToolProgress, {
        current: 1,
        total: 4,
        label: 'Soru 1',
        onReset: () => undefined,
        resetTestId: 'tool-reset',
        percent: 40,
      })
    );

    expect(html).toContain('Soru 1');
    expect(html).not.toContain('Soru 1 / 4');
    expect(html).toContain('Sıfırla');
    expect(html).toContain('data-pw="tool-reset"');
    expect(html).toContain('width:40%');
  });
});

describe('ToolPanel and ToolQuestionCard', () => {
  it('wraps content in the band panel', () => {
    const html = render(createElement(ToolPanel, { id: 'arac' }, 'icerik'));

    expect(html).toContain('id="arac"');
    expect(html).toContain('bg-band');
    expect(html).toContain('icerik');
  });

  it('renders the question card root with data-pw and an h2 title', () => {
    const html = render(
      createElement(
        ToolQuestionCard,
        { title: 'Ana amacın nedir?', category: 'Rota', description: 'İpucu' },
        'secenekler'
      )
    );

    expect(html.startsWith('<div data-pw="tool-question-card"')).toBe(true);
    expect(html).toMatch(/<h2[^>]*>Ana amacın nedir\?<\/h2>/);
    expect(html).toContain('Rota');
    expect(html).toContain('İpucu');
    expect(html).toContain('secenekler');
  });
});

describe('ToolOption', () => {
  it('renders an idle option button', () => {
    const html = render(createElement(ToolOption, { selected: false }, 'Evet'));

    expect(html).toContain('type="button"');
    expect(html).toContain('aria-pressed="false"');
    expect(html).toContain('border-line');
    expect(html).not.toContain('bg-brand-50');
  });

  it('marks the selected option', () => {
    const html = render(
      createElement(ToolOption, { selected: true, description: 'Detay', testId: 'tool-option' }, 'Evet')
    );

    expect(html).toContain('aria-pressed="true"');
    expect(html).toContain('border-brand-700');
    expect(html).toContain('bg-brand-50');
    expect(html).toContain('data-pw="tool-option"');
    expect(html).toContain('Detay');
  });
});

describe('ToolInfoBand', () => {
  it('renders why and who-for blocks with default titles', () => {
    const html = render(
      createElement(ToolInfoBand, {
        why: 'Çünkü sıralama önemli.',
        whoFor: ['Yeni gelenler.', 'Öğrenciler.'],
      })
    );

    expect(html).toContain('Bu araç neden var?');
    expect(html).toContain('Bu araç kim için?');
    expect(html).toContain('Çünkü sıralama önemli.');
    expect(html).toContain('Yeni gelenler.');
    expect(html).toContain('Öğrenciler.');
    expect(html).toContain('bg-ink');
  });
});

describe('ToolFaq', () => {
  it('renders the FAQ heading and one details item per question', () => {
    const html = render(
      createElement(ToolFaq, {
        name: 'arac-sss',
        items: [
          { question: 'Soru bir?', answer: 'Cevap bir.' },
          { question: 'Soru iki?', answer: 'Cevap iki.' },
        ],
      })
    );

    expect(html).toMatch(/<h2[^>]*>Sıkça Sorulan Sorular<\/h2>/);
    expect(html).toContain('SSS');
    expect(html.match(/<details/g)).toHaveLength(2);
    expect(html).toContain('name="arac-sss"');
    expect(html).toContain('Soru bir?');
    expect(html).toContain('Cevap iki.');
  });
});
