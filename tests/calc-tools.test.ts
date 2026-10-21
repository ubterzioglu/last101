import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { load } from 'cheerio';
import { describe, expect, it } from 'vitest';

import { INITIAL_MAAS_FORM, toSalaryInput } from '@/app/(site)/maas-hesaplama/maas-form-state';
import { MaasResults } from '@/app/(site)/maas-hesaplama/MaasResults';
import { INITIAL_STEPSTONE_FORM, buildResult } from '@/app/(site)/stepstone-karsilastirma/stepstone-compare';
import { ModeSelect } from '@/app/(site)/vatandaslik-testi/ModeSelect';
import { QuizQuestion } from '@/app/(site)/vatandaslik-testi/QuizQuestion';
import { formatSure, shuffleArray, type Soru } from '@/app/(site)/vatandaslik-testi/vatandaslik-data';
import { SegmentedControl } from '@/components/calc/SegmentedControl';
import { efficiencyTone, formatDateLabel, stripLeadingEmoji } from '@/components/holiday/holiday-format';
import { calculateSalary } from '@/lib/salary/calculator';
import {
  COMPANY_SIZE_OPTIONS,
  EXPERIENCE_OPTIONS,
  getSortedCities,
  getSortedJobGroups,
} from '@/lib/salary/stepstone-data';
import { calculateEfficiency } from '@/lib/utils/holiday-calculator';

const noop = () => undefined;

describe('maaş form state', () => {
  it('maps the default form to the same SalaryInput the old client built', () => {
    expect(toSalaryInput(INITIAL_MAAS_FORM)).toEqual({
      amount: 5000,
      period: 'monthly',
      type: 'gross',
      taxClass: '1',
      state: 'NRW',
      hasChildren: false,
      childrenCount: 0,
      childrenUnder25Count: 0,
      age23Plus: true,
      churchTax: false,
      childAllowance: 0,
      insuranceType: 'gkv',
      kvBase: 14.6,
      kvZusatz: 2.5,
      pkvPremium: 0,
      ppvPremium: 0,
      companyCar: {
        enabled: false,
        listPrice: 40000,
        rate: 0.01,
        commuteEnabled: false,
        commuteKm: 10,
        commuteMode: 'monthly',
        commuteDays: 15,
      },
    });
  });

  it('passes children under 25 as childrenUnder25Count', () => {
    const input = toSalaryInput({ ...INITIAL_MAAS_FORM, hasChildren: true, childrenCount: 2, childrenUnder25: 1 });
    expect(input.childrenCount).toBe(2);
    expect(input.childrenUnder25Count).toBe(1);
  });
});

describe('MaasResults', () => {
  const result = calculateSalary(toSalaryInput(INITIAL_MAAS_FORM));
  const $ = load(renderToStaticMarkup(createElement(MaasResults, { result })));

  it('renders the six result labels as headings', () => {
    const headings = $('h3')
      .map((_, el) => $(el).text())
      .get();
    expect(headings).toEqual([
      'Net Maaş (Aylık)',
      'Net Maaş (Yıllık)',
      'Brüt Maaş (Aylık)',
      'Brüt Maaş (Yıllık)',
      'Toplam Kesinti (Aylık)',
      'Toplam Kesinti (Yıllık)',
    ]);
  });

  it('exposes data-pw hooks on the value containers used by e2e', () => {
    expect($('[data-pw="maas-net-monthly"]').text()).toMatch(/€/);
    expect($('[data-pw="maas-gross-monthly"]').text()).toMatch(/€/);
    expect($('[data-pw="maas-deductions-yearly"]')).toHaveLength(1);
  });

  it('keeps the breakdown toggles as collapsed buttons', () => {
    const toggle = $('button').filter((_, el) => $(el).text() === 'Aylık Kesintiler');
    expect(toggle.attr('aria-expanded')).toBe('false');
    expect($('dl')).toHaveLength(0);
  });
});

describe('stepstone comparison', () => {
  it('lists every missing field for an empty form', () => {
    const out = buildResult(INITIAL_STEPSTONE_FORM);
    expect(out.result).toBeUndefined();
    expect(out.missing).toHaveLength(9);
    expect(out.missing[0]).toBe('Aylık Brüt Maaş');
  });

  it('builds the yearly gross and ten comparison rows for a full form', () => {
    const out = buildResult({
      grossMonthly: '4500',
      state: 'BE',
      jobGroup: getSortedJobGroups()[0],
      experience: EXPERIENCE_OPTIONS[0].value,
      city: getSortedCities()[0],
      companySize: COMPANY_SIZE_OPTIONS[0].value,
      education: 'yes',
      responsibility: 'no',
      gender: 'f',
    });
    expect(out.missing).toEqual([]);
    expect(out.result?.grossYearly).toBe(54000);
    expect(out.result?.rows).toHaveLength(10);
    expect(out.result?.picks.Eyalet).toBe('Berlin');
  });
});

describe('holiday format helpers', () => {
  it('drops the leading emoji of every efficiency badge', () => {
    expect(stripLeadingEmoji('🚀 Çok verimli kaçamak')).toBe('Çok verimli kaçamak');
    expect(stripLeadingEmoji('☀️ Verimli tatil')).toBe('Verimli tatil');
    expect(stripLeadingEmoji('Klasik izin planı')).toBe('Klasik izin planı');
    for (const [leave, total] of [[0, 3], [1, 4], [1, 3], [5, 7]]) {
      expect(stripLeadingEmoji(calculateEfficiency(leave, total).badge)).toMatch(/^[A-ZÇĞİÖŞÜa-z]/);
    }
  });

  it('maps efficiency ratios to the original colour thresholds', () => {
    expect(efficiencyTone(3.2)).toBe('green');
    expect(efficiencyTone(2.4)).toBe('blue');
    expect(efficiencyTone(1.5)).toBe('neutral');
  });

  it('formats German holiday labels', () => {
    expect(formatDateLabel('2026-10-03')).toBe('03.10.26 (Cmt)');
  });
});

describe('vatandaşlık helpers', () => {
  it('formats the timer as mm:ss', () => {
    expect(formatSure(3600)).toBe('60:00');
    expect(formatSure(65)).toBe('01:05');
  });

  it('shuffles without mutating or losing items', () => {
    const items = [1, 2, 3, 4, 5];
    const shuffled = shuffleArray(items);
    expect(items).toEqual([1, 2, 3, 4, 5]);
    expect([...shuffled].sort()).toEqual(items);
  });
});

describe('vatandaşlık mode cards', () => {
  const $ = load(
    renderToStaticMarkup(createElement(ModeSelect, { seciliEyalet: '', onEyaletChange: noop, onStart: noop }))
  );

  it('renders three start buttons, state modes disabled without a state', () => {
    const buttons = $('button').filter((_, el) => $(el).text() === 'Sınava Başla');
    expect(buttons).toHaveLength(3);
    expect(buttons.filter((_, el) => $(el).attr('disabled') !== undefined)).toHaveLength(2);
  });

  it('keeps select and start button inside the nearest div around each heading (e2e scoping)', () => {
    const heading = $('h3').filter((_, el) => $(el).text().startsWith('Eyalet Soruları'));
    const card = heading.parent();
    expect(card.is('div')).toBe(true);
    expect(card.find('select')).toHaveLength(1);
    expect(card.find('button').text()).toBe('Sınava Başla');
  });
});

describe('vatandaşlık question', () => {
  const soru: Soru = {
    id: 1,
    soru_almanca: 'Frage?',
    soru_turkce: 'Soru?',
    secenekler: { a: 'Eins', b: 'Zwei' },
    dogru_cevap: 'b',
    eyalet: 'Berlin',
  };
  const base = {
    soru,
    index: 0,
    total: 10,
    timerAktif: false,
    kalanSure: 0,
    onAnswer: noop,
    onNext: noop,
    onReset: noop,
  };

  it('keeps the progress text and option names that start with the letter', () => {
    const $ = load(renderToStaticMarkup(createElement(QuizQuestion, { ...base, cevapVerildi: false, secilenCevap: null })));
    expect($('body').text()).toContain('Soru 1 / 10');
    const options = $('[data-pw="vatandaslik-option"]');
    expect(options.first().text()).toMatch(/^A\) Eins/);
    expect($('button').filter((_, el) => $(el).text() === 'Sonraki Soru').attr('disabled')).toBeDefined();
  });

  it('shows text cues after a wrong answer and disables the options', () => {
    const $ = load(renderToStaticMarkup(createElement(QuizQuestion, { ...base, cevapVerildi: true, secilenCevap: 'a' })));
    const options = $('[data-pw="vatandaslik-option"]');
    expect(options.first().text()).toContain('Yanlış');
    expect(options.last().text()).toContain('Doğru cevap');
    expect(options.first().attr('disabled')).toBeDefined();
  });
});

describe('SegmentedControl', () => {
  it('marks the selected option with aria-pressed', () => {
    const $ = load(
      renderToStaticMarkup(
        createElement(SegmentedControl<'gross' | 'net'>, {
          id: 'tip',
          label: 'Tip',
          options: [
            { value: 'gross', label: 'Brüt' },
            { value: 'net', label: 'Net' },
          ],
          value: 'net',
          onChange: noop,
        })
      )
    );
    expect($('button[aria-pressed="true"]').text()).toBe('Net');
    expect($('[role="group"]').attr('aria-labelledby')).toBe('tip-label');
  });
});
