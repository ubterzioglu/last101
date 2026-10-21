import { describe, expect, it } from 'vitest';
import {
  decideLanguage,
  detectLanguage,
  normalizeAllowedLanguages,
  normalizeLanguageCode,
} from '../supabase/functions/news-ingest/language';

describe('detectLanguage', () => {
  it('detects English headlines', () => {
    expect(detectLanguage('Latest news bulletin | October 20th, 2026 – Evening')).toBe('en');
    expect(detectLanguage('IRGC mines set tankers ablaze as Tehran threatens expanded attacks')).toBe('en');
    expect(detectLanguage("France's Macron begins state visit to Qatar as part of wider Gulf tour")).toBe('en');
  });

  it('detects Turkish headlines', () => {
    expect(detectLanguage('Almanya’da yeni vatandaşlık yasası için başvurular başladı')).toBe('tr');
    expect(detectLanguage('Cumhurbaşkanı Erdoğan açıkladı')).toBe('tr');
  });

  it('detects German headlines', () => {
    expect(detectLanguage('Bundesregierung beschließt neue Regeln für die Einbürgerung')).toBe('de');
    expect(detectLanguage('Die Bahn streikt und der Verkehr ist nicht gesichert')).toBe('de');
  });

  it('returns null without evidence', () => {
    expect(detectLanguage('')).toBeNull();
    expect(detectLanguage('   ')).toBeNull();
    expect(detectLanguage('XJ-9000 Berlin')).toBeNull();
  });
});

describe('decideLanguage', () => {
  const allowed = ['tr', 'de'] as const;

  it('rejects clearly English content even when the source hint is Turkish', () => {
    const decision = decideLanguage({
      title: 'Qatar revamped its entire defence system in six hours, says the intelligence chief',
      description: '',
      sourceLanguage: 'tr',
      allowedLanguages: allowed,
    });
    expect(decision).toEqual({ language: 'en', allowed: false });
  });

  it('does not let a single shared word override a German source', () => {
    const decision = decideLanguage({
      title: 'Streik in Berlin: Merz trifft Macron',
      description: '',
      sourceLanguage: 'de',
      allowedLanguages: allowed,
    });
    expect(decision).toEqual({ language: 'de', allowed: true });
  });

  it('keeps a Turkish source when one English-looking word appears', () => {
    const decision = decideLanguage({
      title: 'Bakan açıkladı: Yeni dönem başlıyor | Latest',
      description: '',
      sourceLanguage: 'tr',
      allowedLanguages: allowed,
    });
    expect(decision.allowed).toBe(true);
  });

  it('rejects stopword-free English headlines from an English source', () => {
    const decision = decideLanguage({
      title: 'Heavy rain causes widespread flooding in France’s Marseille',
      description: '',
      sourceLanguage: 'en',
      allowedLanguages: allowed,
    });
    expect(decision).toEqual({ language: 'en', allowed: false });
  });

  it('falls back to the source language when detection fails', () => {
    const decision = decideLanguage({
      title: 'XJ-9000',
      description: '',
      sourceLanguage: 'en',
      allowedLanguages: allowed,
    });
    expect(decision).toEqual({ language: 'en', allowed: false });
  });

  it('lets items through when neither content nor source reveal a language', () => {
    const decision = decideLanguage({
      title: 'XJ-9000',
      description: '',
      sourceLanguage: null,
      allowedLanguages: allowed,
    });
    expect(decision).toEqual({ language: null, allowed: true });
  });

  it('allows German and Turkish by default', () => {
    expect(
      decideLanguage({
        title: 'Die Bahn streikt und der Verkehr ist nicht gesichert',
        description: '',
        allowedLanguages: allowed,
      }).allowed
    ).toBe(true);
    expect(
      decideLanguage({
        title: 'Almanya’da yeni vatandaşlık yasası için başvurular başladı',
        description: '',
        allowedLanguages: allowed,
      }).allowed
    ).toBe(true);
  });

  it('does not reject German items over English loanwords', () => {
    expect(
      decideLanguage({ title: '„The Voice of Germany“: Jury steht fest', description: '', sourceLanguage: 'de', allowedLanguages: allowed })
    ).toEqual({ language: 'de', allowed: true });
    expect(
      decideLanguage({ title: 'Netflix News: Squid Game Staffel 3 startet', description: '', sourceLanguage: null, allowedLanguages: allowed })
    ).toEqual({ language: null, allowed: true });
    expect(
      decideLanguage({ title: 'Tesla: New Model Y kommt', description: '', sourceLanguage: null, allowedLanguages: allowed }).allowed
    ).toBe(true);
  });

  it('keeps a Turkish item quoting an English sentence when the description is Turkish', () => {
    const decision = decideLanguage({
      title: 'Trump: "This is the end of the war" dedi',
      description: 'ABD Başkanı Trump savaşın sona erdiğini açıkladı',
      sourceLanguage: 'tr',
      allowedLanguages: allowed,
    });
    expect(decision).toEqual({ language: 'tr', allowed: true });
  });

  it('does not let Turkish names turn an English article into Turkish', () => {
    const decision = decideLanguage({
      title: 'Beşiktaş beat Galatasaray in Istanbul derby as Kılıçdaroğlu watches',
      description: '',
      sourceLanguage: 'en',
      allowedLanguages: allowed,
    });
    expect(decision).toEqual({ language: 'en', allowed: false });
  });

  it('prefers the item language over the source language', () => {
    const decision = decideLanguage({
      title: 'XJ-9000',
      description: '',
      sourceLanguage: 'tr',
      itemLanguage: 'English',
      allowedLanguages: allowed,
    });
    expect(decision).toEqual({ language: 'en', allowed: false });
  });

  it('honours a Turkish-only allow list', () => {
    const decision = decideLanguage({
      title: 'Die Bahn streikt und der Verkehr ist nicht gesichert',
      description: '',
      allowedLanguages: ['tr'],
    });
    expect(decision).toEqual({ language: 'de', allowed: false });
  });
});

describe('normalizers', () => {
  it('normalizes language codes', () => {
    expect(normalizeLanguageCode('TR')).toBe('tr');
    expect(normalizeLanguageCode('en-US')).toBe('en');
    expect(normalizeLanguageCode('fr')).toBeNull();
    expect(normalizeLanguageCode(null)).toBeNull();
    expect(normalizeLanguageCode('Turkish')).toBe('tr');
    expect(normalizeLanguageCode('english')).toBe('en');
    expect(normalizeLanguageCode('energy')).toBeNull();
    expect(normalizeLanguageCode('deutsch')).toBeNull();
  });

  it('falls back to defaults for invalid allow lists', () => {
    expect(normalizeAllowedLanguages(undefined)).toEqual(['tr', 'de']);
    expect(normalizeAllowedLanguages([])).toEqual(['tr', 'de']);
    expect(normalizeAllowedLanguages(['fr'])).toEqual(['tr', 'de']);
    expect(normalizeAllowedLanguages(['tr', 'tr', 'EN'])).toEqual(['tr', 'en']);
  });
});
