import { readFileSync } from 'node:fs';
import { parseHTML } from 'linkedom';
import { describe, expect, it } from 'vitest';

const analyzerCode = readFileSync(new URL('../seo-analyzer.js', import.meta.url), 'utf8');
const analyzer = new Function('self', `${analyzerCode}\nreturn self.SpindoraSEO;`)({}) as {
  analyzeDocument: (doc: Document, url: string) => {
    score: number;
    parts: {
      imagesAlt: {
        total: number;
        missing: number;
        empty: number;
        described: number;
        missingSources: string[];
        ok: boolean;
      };
      pageDates: {
        published: { present: boolean; raw: string };
        modified: { present: boolean; raw: string };
      };
    };
  };
  analyzeGeo: (doc: Document, url: string) => {
    stats: { imageAltRatio: number; imageAltEmptyCount: number; imageAltMissingCount: number };
  };
  analyzeGeoContent: (doc: Document, url: string) => {
    details: { hasPublished: boolean; hasModified: boolean };
  };
};

const pageUrl = 'https://almanya101.de/';

function documentWith(body: string, head = ''): Document {
  return parseHTML(`<html lang="tr"><head><title>Almanya101 | Almanya'da Yaşam ve İş İçin Türkçe Rehber</title>${head}</head><body><main><h1>Almanya'da Yaşam</h1><p>Almanya'da yaşam rehberi ve güncel bilgiler.</p>${body}</main></body></html>`).document as unknown as Document;
}

describe('seo-analyzer görsel alt niteliği', () => {
  it('görselsiz sayfayı eksiksiz kabul eder', () => {
    const result = analyzer.analyzeDocument(documentWith(''), pageUrl);
    expect(result.parts.imagesAlt).toMatchObject({ total: 0, missing: 0, empty: 0, described: 0, ok: true });
  });

  it('boş alt değerini dekoratif görsel olarak sayar ve puan kırmaz', () => {
    const baseline = analyzer.analyzeDocument(documentWith(''), pageUrl);
    const doc = documentWith('<a href="/rehber"><img src="/kart.webp" alt=""><span>Yaşam rehberi</span></a>');
    const result = analyzer.analyzeDocument(doc, pageUrl);
    expect(result.parts.imagesAlt).toMatchObject({ total: 1, missing: 0, empty: 1, described: 0, ok: true });
    expect(result.score).toBe(baseline.score);
    expect(analyzer.analyzeGeo(doc, pageUrl).stats).toMatchObject({ imageAltRatio: 100, imageAltEmptyCount: 1, imageAltMissingCount: 0 });
  });

  it('yalnızca alt niteliği olmayan görseli eksik sayar', () => {
    const doc = documentWith('<img src="/eksik.webp"><img src="/dekor.webp" alt=""><img src="/logo.webp" alt="Almanya101 logosu">');
    const result = analyzer.analyzeDocument(doc, pageUrl);
    expect(result.parts.imagesAlt).toMatchObject({ total: 3, missing: 1, empty: 1, described: 1, missingSources: ['/eksik.webp'], ok: false });
    expect(analyzer.analyzeGeo(doc, pageUrl).stats).toMatchObject({ imageAltRatio: 67, imageAltEmptyCount: 1, imageAltMissingCount: 1 });
    const complete = analyzer.analyzeDocument(documentWith('<img src="/eksik.webp" alt="">'), pageUrl);
    expect(result.score).toBe(complete.score - 5);
  });
});

describe('seo-analyzer sayfa tarihleri', () => {
  function dates(head: string) {
    const doc = documentWith('', head);
    return {
      page: analyzer.analyzeDocument(doc, pageUrl).parts.pageDates,
      geo: analyzer.analyzeGeoContent(doc, pageUrl).details,
    };
  }

  it('makale meta etiketlerini kabul eder', () => {
    const result = dates('<meta property="article:published_time" content="2026-01-01"><meta property="article:modified_time" content="2026-10-24">');
    expect(result.page.published.raw).toBe('2026-01-01');
    expect(result.geo).toMatchObject({ hasPublished: true, hasModified: true });
  });

  it('sayfanın WebPage JSON-LD tarihlerini kabul eder', () => {
    const result = dates('<script type="application/ld+json">{"@type":"WebPage","url":"https://almanya101.de/","datePublished":"2026-01-01","dateModified":"2026-10-24"}</script>');
    expect(result.page.published.raw).toBe('2026-01-01');
    expect(result.page.modified.raw).toBe('2026-10-24');
    expect(result.geo).toMatchObject({ hasPublished: true, hasModified: true });
  });

  it('meta ve JSON-LD birlikteyse geçerli meta tarihlerini kullanır', () => {
    const result = dates('<meta property="article:published_time" content="2026-02-01"><script type="application/ld+json">{"@type":"WebPage","url":"https://almanya101.de/","datePublished":"2026-01-01","dateModified":"2026-10-24"}</script>');
    expect(result.page.published.raw).toBe('2026-02-01');
    expect(result.page.modified.raw).toBe('2026-10-24');
  });

  it('geçersiz meta tarihi yerine geçerli sayfa JSON-LD tarihini kullanır', () => {
    const result = dates('<meta property="article:published_time" content="geçersiz"><script type="application/ld+json">{"@type":"WebPage","url":"https://almanya101.de/","datePublished":"2026-01-01"}</script>');
    expect(result.page.published.raw).toBe('2026-01-01');
    expect(result.geo.hasPublished).toBe(true);
  });

  it('geçersiz tarihi ve başka URL üzerindeki haber tarihini sayfa tarihi saymaz', () => {
    const result = dates('<meta property="article:published_time" content="geçersiz"><script type="application/ld+json">{"@type":"NewsArticle","url":"https://almanya101.de/haberler/ornek","datePublished":"2026-04-13","dateModified":"2026-04-14"}</script>');
    expect(result.page.published.present).toBe(false);
    expect(result.page.modified.present).toBe(false);
    expect(result.geo).toMatchObject({ hasPublished: false, hasModified: false });
  });

  it('tarih yoksa GEO kontrolünü başarısız bırakır', () => {
    expect(dates('').geo).toMatchObject({ hasPublished: false, hasModified: false });
  });
});
