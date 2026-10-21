/**
 * SEO/GEO doğrulama betiği — docs/plans/seo-geo-heading-schema-plan.md
 *
 * Envanter: `sitemap.xml` (statik rotalar + yayımlı haber/rehber makaleleri).
 * Ayrıca üyelik kapısındaki araç rotalarının anonim istekte /giris'e
 * yönlenmeye devam ettiğini ve sitemap'e sızmadığını doğrular.
 *
 * Her indekslenebilir URL için: durum kodu, robots, canonical, title,
 * meta açıklama, html lang, H1–H3 dizisi, iç bağlantı sayısı ve JSON-LD
 * türleri kaydedilir; JSON-LD görünür içerikle karşılaştırılır.
 *
 * Kullanım: SEO_VERIFY_BASE_URL=http://127.0.0.1:3000 npm run verify:seo
 */
import * as cheerio from 'cheerio';

const baseUrl = (process.env.SEO_VERIFY_BASE_URL || 'http://127.0.0.1:3000').replace(/\/$/, '');
const FETCH_TIMEOUT_MS = 30_000;

// lib/utils/gated-routes.ts GATED_PREFIXES ile senkron tutulmalı.
const GATED_PREFIXES = [
  '/banka-secim',
  '/sigorta-secim',
  '/maas-hesaplama',
  '/stepstone-karsilastirma',
  '/vatandaslik-testi',
  '/para-transferi',
  '/vize-secim',
  '/software-hub',
  '/almanya-maas-beklentisi',
  '/almanya-yasam-tarzi-uyumu',
  '/almanya-yolunu-sec',
  '/almanyada-is-bulma-olasiligi',
  '/almanyaya-hazir-misin',
  '/hangi-sehir-sana-uygun',
  '/ilk-90-gun-planlayici',
  '/kariyer-ve-egitim-rotasi',
  '/once-hangi-sorunu-cozmelisin',
  '/topluluk-ve-danismanlik',
];

const violations = [];
const warnings = [];
const report = [];

function normalizePath(rawPath) {
  let path = rawPath.split('?')[0].split('#')[0];
  if (!path.startsWith('/')) {
    try {
      path = new URL(path).pathname;
    } catch {
      path = `/${path}`;
    }
  }
  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
  return path || '/';
}

function normalizeText(text) {
  return (text || '')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function addViolation(url, message) {
  violations.push({ url, message });
}

function addWarning(url, message) {
  warnings.push({ url, message });
}

async function fetchRaw(url, accept = 'text/html') {
  return fetch(url, {
    redirect: 'manual',
    headers: { accept, 'accept-language': 'tr' },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
}

async function getSitemapPaths() {
  const response = await fetchRaw(`${baseUrl}/sitemap.xml`, 'application/xml');
  if (!response.ok) {
    throw new Error(`sitemap.xml ${response.status} döndü.`);
  }
  const xml = await response.text();
  const $ = cheerio.load(xml, { xml: true });
  const paths = $('url > loc')
    .toArray()
    .map((el) => normalizePath($(el).text().trim()))
    .filter(Boolean);
  if (paths.length === 0) {
    throw new Error('sitemap.xml içinde hiç URL bulunamadı.');
  }
  return paths;
}

function extractJsonLdBlocks($) {
  const blocks = [];
  const parseErrors = [];
  $('script[type="application/ld+json"]').each((_, element) => {
    const raw = $(element).html();
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      for (const item of Array.isArray(parsed) ? parsed : [parsed]) {
        if (item && typeof item === 'object') blocks.push(item);
      }
    } catch (error) {
      parseErrors.push(error instanceof Error ? error.message : 'Bilinmeyen hata');
    }
  });
  return { blocks, parseErrors };
}

function getHeadingSequence($, scope) {
  return scope
    .find('h1, h2, h3, h4, h5, h6')
    .toArray()
    .map((el) => ({
      level: Number(el.tagName.slice(1)),
      text: normalizeText($(el).text()),
    }));
}

function checkHeadings(path, $, headings) {
  const h1s = headings.filter((h) => h.level === 1);
  if (h1s.length === 0) {
    addViolation(path, 'Eksik H1: ana içerikte hiç H1 yok.');
  } else if (h1s.length > 1) {
    addViolation(path, `Çift H1: ${h1s.length} adet H1 bulundu (${h1s.map((h) => h.text).join(' | ')}).`);
  }
  for (const h1 of h1s) {
    if (!h1.text) addViolation(path, 'Boş H1: heading metni yok.');
  }

  let previous = 0;
  for (const heading of headings) {
    if (previous > 0 && heading.level > previous + 1) {
      addViolation(
        path,
        `Heading düzeyi atlaması: H${previous} → H${heading.level} ("${heading.text.slice(0, 60)}").`
      );
    }
    previous = heading.level;
  }
  return h1s;
}

function checkJsonLd(path, $, blocks, parseErrors, h1Text) {
  for (const error of parseErrors) {
    addViolation(path, `JSON-LD ayrıştırılamadı: ${error}`);
  }

  const types = blocks.map((b) => String(b['@type'] || '?'));
  if (types.includes('LocalBusiness')) {
    addViolation(path, 'LocalBusiness şeması hâlâ yayımlanıyor (plan P1: kaldırılmalı).');
  }

  const visibleText = normalizeText($('main').length ? $('main').text() : $('body').text());

  for (const block of blocks) {
    const type = String(block['@type'] || '');

    if (type === 'Article' || type === 'NewsArticle') {
      const headline = normalizeText(block.headline);
      if (h1Text && headline && headline !== h1Text) {
        addViolation(
          path,
          `Article.headline ("${block.headline}") görünür H1 ("${h1Text}") ile eşleşmiyor.`
        );
      }
      if (block.url) {
        const canonical = $('link[rel="canonical"]').attr('href');
        if (canonical && normalizePath(String(block.url)) !== normalizePath(canonical)) {
          addViolation(path, `Article.url (${block.url}) canonical (${canonical}) ile eşleşmiyor.`);
        }
      }
    }

    if (type === 'BreadcrumbList') {
      const items = Array.isArray(block.itemListElement) ? block.itemListElement : [];
      if (items.length === 0) {
        addViolation(path, 'BreadcrumbList boş.');
      } else if (h1Text) {
        const lastName = normalizeText(items[items.length - 1]?.name);
        if (lastName && lastName !== h1Text) {
          addWarning(
            path,
            `BreadcrumbList son öğe ("${items[items.length - 1]?.name}") H1 ile birebir eşleşmiyor.`
          );
        }
      }
    }

    if (type === 'FAQPage') {
      const questions = (Array.isArray(block.mainEntity) ? block.mainEntity : [])
        .map((q) => normalizeText(q?.name))
        .filter(Boolean);
      for (const question of questions) {
        if (!visibleText.includes(question)) {
          addViolation(path, `FAQPage sorusu görünür içerikte yok: "${question.slice(0, 80)}".`);
        }
      }
    }

    if (type === 'HowTo') {
      const steps = (Array.isArray(block.step) ? block.step : []).map((s) => normalizeText(s?.name));
      for (const step of steps) {
        if (step && !visibleText.includes(step)) {
          addViolation(path, `HowTo adımı görünür içerikte yok: "${step.slice(0, 80)}".`);
        }
      }
    }

    if (type === 'WebPage' && block.speakable) {
      addWarning(path, 'Speakable işareti bulundu; görünür karşılığı ayrıca doğrulanmalı.');
    }
  }

  return types;
}

async function verifyIndexable(path) {
  const response = await fetchRaw(`${baseUrl}${path}`);
  const location = response.headers.get('location');

  if (response.status !== 200) {
    addViolation(
      path,
      `Sitemap URL'si ${response.status} döndü${location ? ` (yönlendirme hedefi: ${location})` : ''}; beklenen 200.`
    );
    report.push({ path, status: response.status, note: location ? `→ ${location}` : 'erişilemedi' });
    return;
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  const lang = $('html').attr('lang') || '';
  if (lang.toLowerCase() !== 'tr') {
    addViolation(path, `html lang "${lang}", beklenen "tr".`);
  }

  const robots = normalizeText($('meta[name="robots"]').attr('content'));
  if (robots.includes('noindex')) {
    addViolation(path, `Sitemap URL'si noindex (robots: "${robots}").`);
  }

  const canonical = $('link[rel="canonical"]').attr('href');
  let canonicalOk = false;
  if (!canonical) {
    addViolation(path, 'Canonical etiketi eksik.');
  } else {
    canonicalOk = normalizePath(canonical) === path;
    if (!canonicalOk) {
      addViolation(path, `Canonical kendine işaret etmiyor: ${canonical} (beklenen yol: ${path}).`);
    }
  }

  const title = $('title').first().text().replace(/\s+/g, ' ').trim();
  if (!title) addViolation(path, 'Title boş.');
  const description = ($('meta[name="description"]').attr('content') || '').trim();
  if (!description) addViolation(path, 'Meta description boş.');

  const scope = $('main').length ? $('main') : $('body');
  const headings = getHeadingSequence($, scope);
  const h1s = checkHeadings(path, $, headings);
  const { blocks, parseErrors } = extractJsonLdBlocks($);
  const types = checkJsonLd(path, $, blocks, parseErrors, h1s.length === 1 ? h1s[0].text : '');

  const internalLinks = scope
    .find('a[href^="/"]')
    .toArray()
    .filter((el) => {
      const href = $(el).attr('href') || '';
      return !href.startsWith('//');
    }).length;

  report.push({
    path,
    status: 200,
    h1: headings.filter((h) => h.level === 1).length,
    headings: headings.map((h) => `H${h.level}`).join('>'),
    canonicalOk: canonicalOk ? 'ok' : 'HATALI',
    robots: robots || 'yok',
    lang,
    jsonld: types.join(',') || 'yok',
    internalLinks,
    title,
  });
}

async function verifyGated(path) {
  const response = await fetchRaw(`${baseUrl}${path}`);
  const location = response.headers.get('location') || '';
  if (![301, 302, 303, 307, 308].includes(response.status)) {
    addViolation(path, `Kapalı araç ${response.status} döndü; beklenen /giris'e yönlendirme.`);
  } else if (!location.startsWith('/giris')) {
    addViolation(path, `Kapalı araç yanlış hedefe yönleniyor: ${location} (beklenen /giris?next=...).`);
  }
  report.push({
    path,
    status: response.status,
    note: `gated → ${location || '?'}`,
  });
}

async function verifyAuxFile(path, expectContains) {
  const response = await fetchRaw(`${baseUrl}${path}`, '*/*');
  if (!response.ok) {
    addViolation(path, `${response.status} döndü; beklenen 200.`);
    return;
  }
  if (expectContains) {
    const body = await response.text();
    if (!body.toLowerCase().includes(expectContains.toLowerCase())) {
      addViolation(path, `İçerikte "${expectContains}" bulunamadı.`);
    }
  }
  report.push({ path, status: response.status, note: 'yardımcı dosya' });
}

try {
  const sitemapPaths = await getSitemapPaths();

  // Sitemap'te kapalı (girişe yönlenen) URL bulunmamalı.
  for (const path of sitemapPaths) {
    if (GATED_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))) {
      addViolation(path, 'Giriş kapısı arkasındaki araç sitemap içinde bulundu.');
    }
  }

  for (const path of sitemapPaths) {
    await verifyIndexable(path);
  }

  for (const prefix of GATED_PREFIXES) {
    await verifyGated(prefix);
  }

  await verifyAuxFile('/robots.txt', 'sitemap');
  await verifyAuxFile('/feed.xml', '<rss');

  // Aynı title'ın birden çok sayfada tekrarlanması uyarıdır (başarı koşulu değil).
  const titleMap = new Map();
  for (const row of report.filter((r) => r.title)) {
    if (!titleMap.has(row.title)) titleMap.set(row.title, []);
    titleMap.get(row.title).push(row.path);
  }
  for (const [title, paths] of titleMap) {
    if (paths.length > 1) {
      addWarning(paths.join(', '), `Aynı title birden çok sayfada tekrar ediyor: "${title}".`);
    }
  }

  // Rapor
  console.log(`\nSEO doğrulaması: ${baseUrl}`);
  console.log(`Sitemap URL sayısı: ${sitemapPaths.length}, kapalı araç kontrolü: ${GATED_PREFIXES.length}\n`);
  for (const row of report) {
    if (row.jsonld !== undefined) {
      console.log(
        `[${row.status}] ${row.path} | H1:${row.h1} | canonical:${row.canonicalOk} | lang:${row.lang} | iç link:${row.internalLinks} | JSON-LD: ${row.jsonld}`
      );
      console.log(`       heading dizisi: ${row.headings || '-'}`);
    } else {
      console.log(`[${row.status}] ${row.path} | ${row.note || ''}`);
    }
  }

  if (warnings.length > 0) {
    console.log(`\nUyarılar (${warnings.length}):`);
    for (const w of warnings) console.log(`  - ${w.url}: ${w.message}`);
  }

  if (violations.length > 0) {
    console.error(`\nİhlaller (${violations.length}):`);
    for (const v of violations) console.error(`  - ${v.url}: ${v.message}`);
    process.exit(1);
  }

  console.log('\nSEO doğrulaması başarılı: ihlal bulunamadı.');
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
