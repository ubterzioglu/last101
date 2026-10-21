import { describe, expect, it } from 'vitest';
import {
  categoryAnchor,
  countDocuments,
  documentFacts,
  plainText,
} from '@/app/(site)/belgeler/belgeler-helpers';
import { belgelerData } from '@/app/(site)/belgeler/data';

describe('belgeler helpers', () => {
  it('strips Markdown emphasis markers and trims spacing', () => {
    expect(plainText('**24+ yaş 46 €**, **24 yaş altı 27,60 €** ')).toBe('24+ yaş 46 €, 24 yaş altı 27,60 €');
    expect(plainText('İkamet adres kaydı / *Anmeldung der Wohnung*')).toBe('İkamet adres kaydı / Anmeldung der Wohnung');
    expect(plainText(undefined)).toBe('');
  });

  it('counts every document across categories', () => {
    const expected = belgelerData.reduce((sum, category) => sum + category.documents.length, 0);
    expect(countDocuments(belgelerData)).toBe(expected);
    expect(countDocuments([])).toBe(0);
  });

  it('builds unique 1-based category anchors', () => {
    const anchors = belgelerData.map((_, index) => categoryAnchor(index));
    expect(anchors[0]).toBe('belge-kategori-1');
    expect(new Set(anchors).size).toBe(belgelerData.length);
  });

  it('returns labelled facts in a fixed order and skips empty fields', () => {
    expect(
      documentFacts({ name: 'Test', who: 'A+B.', authority: ' ', cost: '**13 €**. ' }).map((fact) => fact.label)
    ).toEqual(['Kimler', 'Ücret']);
    expect(documentFacts({ name: 'Test', cost: '**13 €**. ' })[0].value).toBe('13 €.');
  });
});
