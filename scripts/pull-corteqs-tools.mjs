/**
 * pull-corteqs-tools.mjs
 *
 * Corteqs (harici React+Vite+Supabase projesi) içindeki 10 "relocation" test
 * aracının 20 soruluk verisini çeker ve almanya101'in kendi anket formatına
 * (lib/tools/surveys/<slug>.ts) dönüştürür.
 *
 * Kaynak tablolar (corteqs Supabase):
 *   - relocation_tools           (key, slug, title_tr, category, ...)
 *   - relocation_tool_questions  (tool_key, question_key, prompt_tr, answer_type,
 *                                 options jsonb [{value,label,score}], sort_order, ...)
 *
 * Bağlantı: .env.corteqs -> SUPABASE_URL (veya NEXT_PUBLIC_SUPABASE_URL) +
 *           SUPABASE_SERVICE_ROLE_KEY
 *
 * Modlar:
 *   node scripts/pull-corteqs-tools.mjs            -> DUMP: ham veriyi
 *        scripts/corteqs-dump/<tool_key>.json olarak yazar + rapor loglar.
 *        lib/tools/surveys dosyalarına DOKUNMAZ.
 *   node scripts/pull-corteqs-tools.mjs --apply    -> DUMP + lib/tools/surveys/<slug>.ts
 *        dosyalarını yeniden üretir.
 *
 * Not: Bu script yalnızca okuma + kod üretimi yapar; corteqs DB'sine yazmaz.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DUMP_DIR = join(ROOT, 'scripts', 'corteqs-dump');
const SURVEYS_DIR = join(ROOT, 'lib', 'tools', 'surveys');
const ENV_FILE = join(ROOT, '.env.corteqs');

const APPLY = process.argv.includes('--apply');

/**
 * corteqs tool_key -> almanya101 slug (surveys dosya adı).
 * Sıra, our 10 aracın slug'larına birebir eşlenmiştir.
 */
const TOOL_KEY_TO_SLUG = {
  country_match: 'almanya-yolunu-sec',
  profession_salary: 'almanya-maas-beklentisi',
  relocation_readiness: 'almanyaya-hazir-misin',
  city_match: 'hangi-sehir-sana-uygun',
  diaspora_matchmaker: 'topluluk-ve-danismanlik',
  career_path_abroad: 'kariyer-ve-egitim-rotasi',
  expat_lifestyle_persona: 'almanya-yasam-tarzi-uyumu',
  first_90_days_planner: 'ilk-90-gun-planlayici',
  top_relocation_challenge: 'once-hangi-sorunu-cozmelisin',
  job_finding_probability: 'almanyada-is-bulma-olasiligi',
};

/**
 * surveys dosyasındaki export const değişken adı (index.ts import'larıyla eşleşmeli).
 */
const SLUG_TO_EXPORT_NAME = {
  'almanya-yolunu-sec': 'almanyaYolunuSecQuestionnaire',
  'almanya-maas-beklentisi': 'almanyaMaasBeklentisiQuestionnaire',
  'almanyaya-hazir-misin': 'almanyayaHazirMisinQuestionnaire',
  'hangi-sehir-sana-uygun': 'hangiSehirSanaUygunQuestionnaire',
  'topluluk-ve-danismanlik': 'toplulukVeDanismanlikQuestionnaire',
  'kariyer-ve-egitim-rotasi': 'kariyerVeEgitimRotasiQuestionnaire',
  'almanya-yasam-tarzi-uyumu': 'almanyaYasamTarziUyumuQuestionnaire',
  'ilk-90-gun-planlayici': 'ilk90GunPlanlayiciQuestionnaire',
  'once-hangi-sorunu-cozmelisin': 'onceHangiSorunuCozmelisinQuestionnaire',
  'almanyada-is-bulma-olasiligi': 'almanyadaIsBulmaOlasiligiQuestionnaire',
};

const EXPECTED_QUESTION_COUNT = 20;

// ---------------------------------------------------------------------------
// Env yükleme (.env.corteqs) — dosyayı elle parse eder (Next convention'a bağlı
// kalmadan, isme göre yükleyebilmek için).
// ---------------------------------------------------------------------------
function loadCorteqsEnv() {
  if (!existsSync(ENV_FILE)) {
    throw new Error(`.env.corteqs bulunamadı: ${ENV_FILE}`);
  }

  const env = {};
  const raw = readFileSync(ENV_FILE, 'utf8');

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }

  return env;
}

function getSupabaseClient(env) {
  const url = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || env.VITE_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      '.env.corteqs içinde SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY gerekli.'
    );
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// ---------------------------------------------------------------------------
// Çekme
// ---------------------------------------------------------------------------
async function fetchAll(supabase) {
  const { data: tools, error: toolsError } = await supabase
    .from('relocation_tools')
    .select('*')
    .order('sort_order', { ascending: true });

  if (toolsError) throw toolsError;

  const { data: questions, error: questionsError } = await supabase
    .from('relocation_tool_questions')
    .select('*')
    .eq('is_active', true)
    .order('tool_key', { ascending: true })
    .order('sort_order', { ascending: true });

  if (questionsError) throw questionsError;

  return { tools: tools ?? [], questions: questions ?? [] };
}

// ---------------------------------------------------------------------------
// Dönüştürme yardımcıları (dump JSON'dan çıktı üretmez; sadece --apply'da kullanılır)
// ---------------------------------------------------------------------------

/** corteqs answer_type -> bizim answerType eşlemesi. */
function mapAnswerType(corteqsType) {
  switch (corteqsType) {
    case 'scale':
      return 'likert_1_5';
    case 'single':
    case 'multi':
    case 'country':
    case 'city':
    case 'profession':
    case 'date':
      return 'single_choice';
    case 'number':
    case 'currency':
      return 'numeric';
    case 'boolean':
    case 'consent':
      return 'boolean';
    default:
      return 'single_choice';
  }
}

/** 0.0–1.0 corteqs score -> 0–100 tam sayı. */
function toScore100(raw) {
  const n = Number(raw);
  if (!Number.isFinite(n)) return 0;
  // Bazı satırlar zaten 0–100 olabilir; >1 ise olduğu gibi al, değilse *100.
  const scaled = n <= 1 ? n * 100 : n;
  return Math.max(0, Math.min(100, Math.round(scaled)));
}

export {
  TOOL_KEY_TO_SLUG,
  SLUG_TO_EXPORT_NAME,
  mapAnswerType,
  toScore100,
  EXPECTED_QUESTION_COUNT,
};

// ---------------------------------------------------------------------------
// Kod üretimi (--apply)
// ---------------------------------------------------------------------------

/**
 * number/currency soruları için soru anahtarına göre anlamlı, artan skorlu
 * bucket'lar. Kaynak veride band yok; bunlar makul aralıklardır (kullanıcı
 * kararı: "mantıklı skor üret").
 */
const NUMERIC_BUCKETS = {
  years_experience: [
    { label: '0-1 yıl', score: 20 },
    { label: '2-4 yıl', score: 50 },
    { label: '5-9 yıl', score: 80 },
    { label: '10+ yıl', score: 100 },
  ],
  experience_years_in_target: [
    { label: 'Henüz gitmedim', score: 20 },
    { label: '1-2 yıl', score: 50 },
    { label: '3-5 yıl', score: 80 },
    { label: '6+ yıl', score: 100 },
  ],
  applications: [
    { label: '0-5 başvuru', score: 20 },
    { label: '6-15 başvuru', score: 50 },
    { label: '16-40 başvuru', score: 80 },
    { label: '40+ başvuru', score: 100 },
  ],
  mentor_capacity: [
    { label: '1 kişi', score: 40 },
    { label: '2-3 kişi', score: 70 },
    { label: '4-6 kişi', score: 90 },
    { label: '6+ kişi', score: 100 },
  ],
  monthly_budget: [
    { label: '€800 altı', score: 20 },
    { label: '€800 - €1.500', score: 55 },
    { label: '€1.500 - €2.500', score: 80 },
    { label: '€2.500+', score: 100 },
  ],
  setup_budget: [
    { label: '€1.000 altı', score: 20 },
    { label: '€1.000 - €3.000', score: 55 },
    { label: '€3.000 - €6.000', score: 80 },
    { label: '€6.000+', score: 100 },
  ],
  rent_budget: [
    { label: '€500 altı', score: 20 },
    { label: '€500 - €900', score: 55 },
    { label: '€900 - €1.400', score: 80 },
    { label: '€1.400+', score: 100 },
  ],
  current_salary_optional: [
    { label: '€1.500 altı', score: 25 },
    { label: '€1.500 - €2.500', score: 55 },
    { label: '€2.500 - €4.000', score: 80 },
    { label: '€4.000+', score: 100 },
  ],
};

const DEFAULT_NUMERIC_BUCKETS = [
  { label: 'Düşük', score: 25 },
  { label: 'Orta', score: 55 },
  { label: 'Yüksek', score: 80 },
  { label: 'Çok yüksek', score: 100 },
];

/** profession/country/city/text/date: netlik/hazırlık sinyali olarak 3'lü seçim. */
const CLARITY_OPTIONS = [
  { label: 'Evet, net', score: 100 },
  { label: 'Kısmen', score: 60 },
  { label: 'Henüz belirsiz', score: 20 },
];

/** value'yu güvenli, tekil bir option key'ine indir. */
const COMBINING_MARKS = /[̀-ͯ]/g;

function safeOptionKey(value, index) {
  const base = String(value ?? `opt_${index + 1}`)
    .toLowerCase()
    .normalize('NFD')
    .replace(COMBINING_MARKS, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  return base || `opt_${index + 1}`;
}

/** corteqs option dizisini bizim {key,label,score} formatına çevir. */
function convertOptions(rawOptions) {
  const opts = Array.isArray(rawOptions) ? rawOptions : [];
  const anyScore = opts.some((o) => o.score !== undefined && o.score !== null);
  const n = opts.length;

  return opts.map((o, i) => {
    let score;
    if (o.score !== undefined && o.score !== null) {
      score = toScore100(o.score);
    } else if (anyScore) {
      // Kısmen skorlu: eksikleri nötr 50 ata.
      score = 50;
    } else {
      // Hiç skor yok: sıra iyi->kötü varsayımıyla azalan lineer skor.
      score = n <= 1 ? 100 : Math.round(100 - (i * 100) / (n - 1));
    }
    return {
      key: safeOptionKey(o.value, i),
      label: String(o.label ?? o.value ?? `Seçenek ${i + 1}`),
      score,
    };
  });
}

const DIMENSION_FALLBACK = 'fit';

function jsStr(value) {
  return JSON.stringify(String(value ?? ''));
}

/** Tek bir corteqs sorusunu bizim builder çağrısına (kaynak kod string) çevir. */
function questionToBuilderCode(q, weightIndex, warnings) {
  const our = mapAnswerType(q.answer_type);
  const id = jsStr(q.question_key);
  const text = jsStr(q.prompt_tr);
  const weight = `weights[${weightIndex}]`;
  const dim = jsStr(q.section_key || DIMENSION_FALLBACK);
  const rationale = jsStr(q.help_tr || q.prompt_tr);
  const rawOptions = Array.isArray(q.options) ? q.options : [];

  // scale -> Likert (options yok)
  if (q.answer_type === 'scale') {
    return `    createLikertQuestion(${id}, ${text}, ${weight}, ${dim}, ${rationale}),`;
  }

  // boolean / consent -> boolean
  if (q.answer_type === 'boolean' || q.answer_type === 'consent') {
    return `    createBooleanQuestion(${id}, ${text}, ${weight}, ${dim}, ${rationale}),`;
  }

  // number / currency -> single_choice bucket
  if (q.answer_type === 'number' || q.answer_type === 'currency') {
    const buckets = NUMERIC_BUCKETS[q.question_key] || DEFAULT_NUMERIC_BUCKETS;
    warnings.push(`${q.question_key} (${q.answer_type}) -> sayısal bucket single_choice`);
    const optCode = buckets
      .map((b, i) => `      { key: 'b${i + 1}', label: ${jsStr(b.label)}, score: ${b.score} }`)
      .join(',\n');
    return `    createSingleChoiceQuestion(${id}, ${text}, ${weight}, ${dim}, ${rationale}, [\n${optCode},\n    ]),`;
  }

  // single / multi: gerçek option'lar
  if ((q.answer_type === 'single' || q.answer_type === 'multi') && rawOptions.length > 0) {
    if (q.answer_type === 'multi') {
      warnings.push(`${q.question_key} (multi) -> single_choice indirgendi`);
    }
    const converted = convertOptions(rawOptions);
    const optCode = converted
      .map(
        (o) => `      { key: ${jsStr(o.key)}, label: ${jsStr(o.label)}, score: ${o.score} }`
      )
      .join(',\n');
    return `    createSingleChoiceQuestion(${id}, ${text}, ${weight}, ${dim}, ${rationale}, [\n${optCode},\n    ]),`;
  }

  // profession / country / city / text / date (option yok) -> netlik 3'lü seçim
  warnings.push(`${q.question_key} (${q.answer_type}) -> netlik single_choice`);
  const clarityCode = CLARITY_OPTIONS.map(
    (o, i) => `      { key: 'c${i + 1}', label: ${jsStr(o.label)}, score: ${o.score} }`
  ).join(',\n');
  return `    createSingleChoiceQuestion(${id}, ${text}, ${weight}, ${dim}, ${rationale}, [\n${clarityCode},\n    ]),`;
}

/** Bir aracın tüm sorularından tam surveys/<slug>.ts dosya içeriğini üret. */
function generateSurveyFile(slug, questions, warnings) {
  const exportName = SLUG_TO_EXPORT_NAME[slug];
  const usesLikert = questions.some((q) => q.answer_type === 'scale');
  const usesBoolean = questions.some(
    (q) => q.answer_type === 'boolean' || q.answer_type === 'consent'
  );
  const usesSingle = questions.some(
    (q) => q.answer_type !== 'scale' && q.answer_type !== 'boolean' && q.answer_type !== 'consent'
  );

  const imports = ['  QUESTIONNAIRE_WEIGHTS'];
  if (usesBoolean) imports.push('  createBooleanQuestion');
  if (usesLikert) imports.push('  createLikertQuestion');
  if (usesSingle) imports.push('  createSingleChoiceQuestion');
  imports.push('  createToolQuestionnaireConfig');

  const body = questions
    .map((q, i) => questionToBuilderCode(q, i, warnings))
    .join('\n');

  return `import {
${imports.join(',\n')},
} from '@/lib/tools/survey';

const weights = QUESTIONNAIRE_WEIGHTS;

// Bu dosya scripts/pull-corteqs-tools.mjs tarafından corteqs verisinden üretildi.
// Elle düzenlemek yerine kaynağı güncelleyip scripti tekrar çalıştır.
export const ${exportName} = createToolQuestionnaireConfig(
  ${jsStr(slug)},
  [
${body}
  ]
);
`;
}

// ---------------------------------------------------------------------------
// Ana akış
// ---------------------------------------------------------------------------
async function main() {
  const env = loadCorteqsEnv();
  const supabase = getSupabaseClient(env);

  console.log('corteqs Supabase\'e bağlanılıyor...');
  const { tools, questions } = await fetchAll(supabase);

  const byTool = new Map();
  for (const q of questions) {
    if (!byTool.has(q.tool_key)) byTool.set(q.tool_key, []);
    byTool.get(q.tool_key).push(q);
  }

  mkdirSync(DUMP_DIR, { recursive: true });

  console.log('\n=== ÇEKME RAPORU ===');
  const knownKeys = Object.keys(TOOL_KEY_TO_SLUG);
  const answerTypeTally = {};
  const questionsByTool = new Map();

  for (const toolKey of knownKeys) {
    const tool = tools.find((t) => t.key === toolKey) ?? null;
    const qs = (byTool.get(toolKey) ?? []).slice().sort((a, b) => a.sort_order - b.sort_order);
    questionsByTool.set(toolKey, qs);

    for (const q of qs) {
      answerTypeTally[q.answer_type] = (answerTypeTally[q.answer_type] ?? 0) + 1;
    }

    const dump = { tool, questions: qs };
    const dumpPath = join(DUMP_DIR, `${toolKey}.json`);
    writeFileSync(dumpPath, JSON.stringify(dump, null, 2), 'utf8');

    const slug = TOOL_KEY_TO_SLUG[toolKey];
    const countFlag = qs.length === EXPECTED_QUESTION_COUNT ? 'OK' : `!! ${qs.length}`;
    const missingScore = qs.filter(
      (q) =>
        Array.isArray(q.options) &&
        q.options.length > 0 &&
        q.options.some((o) => o.score === undefined || o.score === null)
    ).length;

    console.log(
      `- ${toolKey} -> ${slug}: ${qs.length}/20 soru [${countFlag}]` +
        (missingScore ? ` | ${missingScore} soruda score eksik seçenek var` : '')
    );
  }

  console.log('\nAnswer type dağılımı:', JSON.stringify(answerTypeTally, null, 2));
  console.log(`\nHam dump yazıldı: ${DUMP_DIR}`);

  if (!APPLY) {
    console.log('\n(DUMP modu — lib/tools/surveys dosyalarına DOKUNULMADI.');
    console.log(' --apply ile çalıştırınca dosyalar yeniden üretilecek.)');
    return;
  }

  console.log('\n=== --apply: surveys dosyaları üretiliyor ===');
  let generated = 0;

  for (const toolKey of knownKeys) {
    const slug = TOOL_KEY_TO_SLUG[toolKey];
    const qs = questionsByTool.get(toolKey) ?? [];

    if (qs.length !== EXPECTED_QUESTION_COUNT) {
      console.log(`  ! ${slug}: ${qs.length}/20 soru — ATLANDI (yeniden üretilmedi).`);
      continue;
    }

    const warnings = [];
    const content = generateSurveyFile(slug, qs, warnings);
    const outPath = join(SURVEYS_DIR, `${slug}.ts`);
    writeFileSync(outPath, content, 'utf8');
    generated += 1;

    console.log(`  ✓ ${slug}.ts (${qs.length} soru)` + (warnings.length ? ` | ${warnings.length} dönüşüm notu` : ''));
    for (const w of warnings) {
      console.log(`      - ${w}`);
    }
  }

  console.log(`\n${generated}/${knownKeys.length} anket dosyası üretildi.`);
  console.log('Sonraki adım: npx tsc --noEmit && npm run test:unit');
}

main().catch((error) => {
  console.error('pull-corteqs-tools başarısız:', error);
  process.exit(1);
});
