import { describe, expect, it } from 'vitest';
import {
  createHeadingIdGenerator,
  extractHeadings,
  formatArticleDate,
  hasMeaningfulUpdate,
  slugifyHeading,
} from '@/lib/articles/headings';

describe('slugifyHeading', () => {
  it('Türkçe karakterleri ASCII slug yapar', () => {
    expect(slugifyHeading('Gümrük Muafiyeti: Neler Götürülebilir?')).toBe('gumruk-muafiyeti-neler-goturulebilir');
  });

  it('boş sonuçta yedek id döndürür', () => {
    expect(slugifyHeading('???')).toBe('baslik');
  });
});

describe('createHeadingIdGenerator', () => {
  it('tekrarlanan başlıklara sıra numarası ekler', () => {
    const next = createHeadingIdGenerator();
    expect([next('Sorular'), next('Sorular'), next('Sorular')]).toEqual(['sorular', 'sorular-2', 'sorular-3']);
  });
});

describe('extractHeadings', () => {
  it('H2 ve H3 başlıklarını sırayla çıkarır, H1 H2 sayılır', () => {
    const md = ['# Giriş', 'metin', '## Tütün', '### Sigara', '#### Yoksay'].join('\n');
    expect(extractHeadings(md)).toEqual([
      { id: 'giris', text: 'Giriş', level: 2 },
      { id: 'tutun', text: 'Tütün', level: 2 },
      { id: 'sigara', text: 'Sigara', level: 3 },
    ]);
  });

  it('kod bloğu içindeki # satırlarını yok sayar', () => {
    const md = ['## Gerçek', '```', '## Sahte', '```'].join('\n');
    expect(extractHeadings(md).map((h) => h.text)).toEqual(['Gerçek']);
  });

  it('satır içi biçimlendirmeyi temizler', () => {
    expect(extractHeadings('## **Kalın** ve [bağlantı](https://x.de)')[0].text).toBe('Kalın ve bağlantı');
  });

  it('MarkdownPreview ile aynı tekrar kuralını kullanır', () => {
    const ids = extractHeadings('## A\n## A').map((h) => h.id);
    expect(ids).toEqual(['a', 'a-2']);
  });
});

describe('formatArticleDate / hasMeaningfulUpdate', () => {
  it('tarihi Türkçe biçimler', () => {
    expect(formatArticleDate('2026-06-18T10:00:00.000Z')).toBe('18 Haziran 2026');
  });

  it('geçersiz tarihte boş döner', () => {
    expect(formatArticleDate('abc')).toBe('');
    expect(formatArticleDate(null)).toBe('');
  });

  it('yayından en az 1 gün sonraki güncellemeyi anlamlı sayar', () => {
    expect(hasMeaningfulUpdate('2026-06-18T10:00:00Z', '2026-10-20T10:00:00Z')).toBe(true);
    expect(hasMeaningfulUpdate('2026-06-18T10:00:00Z', '2026-06-18T12:00:00Z')).toBe(false);
    expect(hasMeaningfulUpdate('2026-06-18T10:00:00Z', null)).toBe(false);
  });
});
