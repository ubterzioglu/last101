import { parseHTML } from 'linkedom';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TARGET_URL = process.argv[2] || 'https://almanya101.de';
const KEYWORD = process.argv[3] || '';
const SCHEMA_PROFILE = process.argv[4] || '';

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; SpindoraSEO/1.0)',
      'Accept': 'text/html,application/xhtml+xml',
      'Accept-Language': 'tr-TR,tr;q=0.9,en;q=0.8',
    },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  return await res.text();
}

function formatCheck(c) {
  const icon = c.ok ? '✅' : (c.optional ? '⚪' : '❌');
  let line = `  ${icon} ${c.label} [${c.pts}p]`;
  if (!c.ok && c.fix) line += `\n     → ${c.fix}`;
  return line;
}

function printReport(html, pageUrl) {
  const { document } = parseHTML(html);

  const seoCode = readFileSync(join(__dirname, 'seo-analyzer.js'), 'utf-8');
  const fn = new Function('self', seoCode + '\nreturn self.SpindoraSEO;');
  const SpindoraSEO = fn({});

  const options = { targetKeyword: KEYWORD || undefined };

  const result = SpindoraSEO.analyzeDocument(document, pageUrl, options);
  const geo = SpindoraSEO.analyzeGeo(document, pageUrl);
  const geoContent = SpindoraSEO.analyzeGeoContent(document, pageUrl);
  const social = SpindoraSEO.analyzeSocialView(document, pageUrl);
  const schemaHints = SCHEMA_PROFILE
    ? SpindoraSEO.analyzeSchemaSiteHints(document, pageUrl, { profileId: SCHEMA_PROFILE })
    : null;

  console.log('\n' + '='.repeat(80));
  console.log('  SPINDORA SEO RAPORU');
  console.log('='.repeat(80));
  console.log(`  URL       : ${pageUrl}`);
  console.log(`  Tarih     : ${new Date().toLocaleString('tr-TR')}`);
  if (KEYWORD) console.log(`  Anahtar   : ${KEYWORD}`);
  console.log('='.repeat(80));

  console.log('\n┌─────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ 1. GENEL SKORLAR                                                            │');
  console.log('└─────────────────────────────────────────────────────────────────────────────┘');
  console.log(`  SEO Skoru          : ${result.score}/100`);
  console.log(`  Teknik SEO Skoru   : ${result.scoreTechnical}/100`);
  console.log(`  İçerik Skoru       : ${result.scoreContent}/100`);
  console.log(`  GEO Skoru (AI)     : ${geo.score}/100 (${geo.grade})`);
  console.log(`  GEO İçerik Skoru   : ${geoContent.score}/100 (${geoContent.grade})`);

  if (result.scoreDetail.length > 0) {
    console.log('\n  Skor Kesintileri:');
    for (const d of result.scoreDetail) {
      console.log(`    -${d.points}p : ${d.reason}`);
    }
  }

  console.log('\n┌─────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ 2. TEKNİK SEO METRİKLERİ                                                    │');
  console.log('└─────────────────────────────────────────────────────────────────────────────┘');

  const parts = result.parts;
  const metrics = [
    { name: 'Title', status: parts.title.status, detail: `"${parts.title.text}" (${parts.title.length} karakter)` },
    { name: 'Meta Description', status: parts.meta.status, detail: `"${parts.meta.text?.slice(0, 100)}${parts.meta.text?.length > 100 ? '...' : ''}" (${parts.meta.length} karakter)` },
    { name: 'H1', status: parts.h1.status, detail: parts.h1.count === 1 ? `"${parts.h1.h1Text}"` : `${parts.h1.count} adet H1` },
    { name: 'Başlık Hiyerarşisi', status: parts.hierarchy.status, detail: parts.hierarchy.errors?.length ? parts.hierarchy.errors.map(e => e.message).join('; ') : 'Tutarlı' },
    { name: 'Canonical', status: parts.canonical.status, detail: parts.canonical.href || 'Eksik' },
    { name: 'Görsel Alt', status: parts.imagesAlt.status, detail: `${parts.imagesAlt.total} görsel; ${parts.imagesAlt.missing} eksik nitelik, ${parts.imagesAlt.empty} boş, ${parts.imagesAlt.described} açıklamalı` },
    { name: 'İçerik Uzunluğu', status: parts.wordCount.status, detail: `${parts.wordCount.words} kelime` },
    { name: 'Open Graph', status: parts.openGraph.status, detail: parts.openGraph.missing?.length ? `Eksik: ${parts.openGraph.missing.join(', ')}` : 'Tam' },
    { name: 'Yapılandırılmış Veri', status: parts.schema.status, detail: `${parts.schema.count} şema türü` },
  ];

  if (KEYWORD && parts.keyword) {
    metrics.push({
      name: 'Anahtar Kelime Yoğunluğu',
      status: parts.keyword.status,
      detail: parts.keyword.density !== null ? `%${parts.keyword.density} ("${KEYWORD}")` : 'Belirtilmedi',
    });
  }

  for (const m of metrics) {
    const icon = m.status === 'OK' ? '✅' : (m.status === 'Öneri' || m.status === 'Zayıf' ? '⚠️' : '❌');
    console.log(`  ${icon} ${m.name.padEnd(25)} [${m.status}]  ${m.detail}`);
  }
  for (const src of parts.imagesAlt.missingSources) {
    console.log(`     → Alt niteliği eksik görsel: ${src || '(src yok)'}`);
  }

  console.log('\n┌─────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ 3. SAYFA TARİHLERİ                                                          │');
  console.log('└─────────────────────────────────────────────────────────────────────────────┘');
  console.log(`  Yayın Tarihi    : ${parts.pageDates.published.present ? parts.pageDates.published.display : '❌ Eksik'}`);
  console.log(`  Güncelleme Tarihi: ${parts.pageDates.modified.present ? parts.pageDates.modified.display : '❌ Eksik'}`);

  console.log('\n┌─────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ 4. SOSYAL PAYLAŞIM (Open Graph + Twitter)                                   │');
  console.log('└─────────────────────────────────────────────────────────────────────────────┘');
  console.log('  Open Graph:');
  for (const og of social.og) {
    const icon = og.value ? '✅' : '❌';
    console.log(`    ${icon} ${og.property}: ${og.value ? og.value.slice(0, 60) + (og.value.length > 60 ? '...' : '') : '(boş)'}`);
  }
  console.log('  Twitter:');
  for (const tw of social.twitter) {
    const icon = tw.value ? '✅' : '❌';
    console.log(`    ${icon} ${tw.name}: ${tw.value || '(boş)'}`);
  }

  console.log('\n┌─────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ 5. GEO SKORU — AI GÖRÜNÜRLÜK (5 SÜTUN x 20p)                              │');
  console.log('└─────────────────────────────────────────────────────────────────────────────┘');
  for (const p of geo.pillars) {
    const pct = Math.round((p.score / p.max) * 100);
    const bar = '█'.repeat(Math.round(pct / 10)) + '░'.repeat(10 - Math.round(pct / 10));
    console.log(`  ${p.name.padEnd(22)} ${p.score}/${p.max} [${bar}] ${pct}%`);
    for (const item of p.items) {
      const ic = item.ok ? '✅' : '❌';
      console.log(`    ${ic} ${item.label}`);
      if (!item.ok && item.hint) console.log(`       → ${item.hint}`);
    }
  }

  console.log('\n┌─────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ 6. GEO İÇERİK ANALİZİ — AI BOTLARI İÇİN                                   │');
  console.log('└─────────────────────────────────────────────────────────────────────────────┘');
  for (const cat of geoContent.categories) {
    const pct = Math.round((cat.score / cat.max) * 100);
    console.log(`\n  📌 ${cat.name} (${cat.score}/${cat.max} — ${pct}%)`);
    console.log(`     ${cat.desc}`);
    for (const c of cat.checks) {
      console.log(formatCheck(c));
    }
  }

  console.log('\n┌─────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ 7. ŞEMA ÖNERİLERİ                                                           │');
  console.log('└─────────────────────────────────────────────────────────────────────────────┘');
  if (!schemaHints) {
    console.log('  Profil seçilmedi; sayfa türüne özgü öneriler gösterilmiyor.');
  } else if (schemaHints.error) {
    console.log(`  ⚠️  ${schemaHints.error}`);
  } else {
    console.log(`  Site Tipi: ${schemaHints.siteType.labelTr}`);
    console.log(`  Eksik: ${schemaHints.missingCount}/${schemaHints.recommendations.length}`);
    for (const r of schemaHints.recommendations) {
      const icon = r.present ? '✅' : '❌';
      console.log(`  ${icon} ${r.type}`);
      console.log(`     ${r.detailTr}`);
    }
  }

  if (parts.premiumKeyword) {
    console.log('\n┌─────────────────────────────────────────────────────────────────────────────┐');
    console.log('│ 8. PREMIUM ANAHTAR KELİME TEKNİK ANALİZİ                                  │');
    console.log('└─────────────────────────────────────────────────────────────────────────────┘');
    console.log(`  Skor: ${parts.premiumKeyword.score}/100 (${parts.premiumKeyword.passed}/${parts.premiumKeyword.total} geçti)`);
    for (const c of parts.premiumKeyword.checks) {
      const icon = c.ok ? '✅' : '❌';
      console.log(`  ${icon} ${c.label}`);
    }
  }

  console.log('\n┌─────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ 9. İSTATİSTİKLER                                                            │');
  console.log('└─────────────────────────────────────────────────────────────────────────────┘');
  const s = geo.stats;
  console.log(`  Kelime Sayısı         : ${s.wordCount}`);
  console.log(`  Ana İçerik Kelime     : ${s.mainWordCount} (${s.mainContentRatio}%)`);
  console.log(`  Ort. Cümle Uzunluğu   : ${s.avgWordsPerSentence} kelime`);
  console.log(`  H2/H3 Sayısı          : ${s.h2Count} / ${s.h3Count}`);
  console.log(`  Tablo/Liste           : ${s.tableCount} / ${s.richListCount}`);
  console.log(`  JSON-LD Blok/Düğüm    : ${s.jsonLdBlockCount} / ${s.jsonLdTypedNodes}`);
  console.log(`  Dış Domain Sayısı     : ${s.uniqueExternalDomains}`);
  console.log(`  Görsel (alt kapsamı)  : ${s.imageCount} (%${s.imageAltRatio}; ${s.imageAltDescribedCount} açıklamalı, ${s.imageAltEmptyCount} boş, ${s.imageAltMissingCount} eksik)`);
  console.log(`  Video/Iframe          : ${s.videoTagCount} / ${s.iframeCount}`);
  console.log(`  Hreflang              : ${s.hreflangCount}`);
  console.log(`  HTTPS                 : ${s.https ? 'Evet' : 'Hayır'}`);
  console.log(`  Robots Noindex        : ${s.robotsNoindex ? 'EVET (⚠️ indekslenmiyor!)' : 'Hayır'}`);

  console.log('\n' + '='.repeat(80));
  console.log('  RAPOR TAMAMLANDI');
  console.log('='.repeat(80) + '\n');
}

async function main() {
  console.log(`Fetching ${TARGET_URL}...`);
  const html = await fetchHtml(TARGET_URL);
  console.log(`HTML alındı (${(html.length / 1024).toFixed(1)} KB)`);
  printReport(html, TARGET_URL);
}

main().catch(err => {
  console.error('Hata:', err.message);
  process.exit(1);
});
