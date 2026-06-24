/**
 * Seeds the admin "Güvenlik Notları" (security_notes) table with detailed,
 * operator-facing notes about the E2E test suite: how to run it, what it covers,
 * the test user, and the known production divergences found while testing.
 *
 * Idempotent: a note is inserted only if no existing note has the same title.
 *
 * Usage:
 *   node scripts/seed-e2e-admin-notes.mjs
 *
 * Env (or .env.local):
 *   NEXT_PUBLIC_SUPABASE_URL / SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */
import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

function loadEnvLocal() {
  try {
    const raw = readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m && !(m[1] in process.env)) process.env[m[1]] = m[2];
    }
  } catch {
    /* optional */
  }
}
loadEnvLocal();

const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!URL_ || !KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const supabase = createClient(URL_, KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

/** Notes to ensure exist. category/severity/source per security_notes schema. */
const NOTES = [
  {
    title: 'E2E Testleri — Nasıl Çalıştırılır',
    severity: 'low',
    category: 'config',
    source: 'agent',
    related_path: 'E2E_TEST_KULLANIM.md',
    description: [
      'Playwright E2E test altyapısı kuruldu. Çalıştırmak için:',
      '',
      '1) Kurulum (bir kez):',
      '   npm install',
      '   npx playwright install chromium',
      '',
      '2) Production’a karşı koş (en güvenilir, veri yazmaz):',
      '   BASE_URL=https://almanya101.de npm run e2e        (tüm suite)',
      '   BASE_URL=https://almanya101.de npm run e2e:smoke  (sadece smoke)',
      '',
      '3) HTML rapor:',
      '   npm run e2e:report   (playwright-report/index.html açılır)',
      '',
      'Detaylı kılavuz: E2E_TEST_KULLANIM.md (kökte) + docs/e2e-test-plan.md.',
    ].join('\n'),
  },
  {
    title: 'E2E Testleri — Kapsam (smoke + 8 araç)',
    severity: 'low',
    category: 'config',
    source: 'agent',
    related_path: 'e2e/',
    description: [
      'Toplam 52 test, production’a karşı yeşil.',
      '',
      'SMOKE (anonim):',
      '- public-routes: public sayfalar açılıyor mu + 8 login-gated araç anonime kapalı mı',
      '- admin-guards: admin API’leri anonim isteği reddediyor mu (200 dönmemeli)',
      '',
      'DERİN ARAÇ TESTLERİ (giriş gerektirir, chromium-auth projesi):',
      '- maas-hesaplama (5), vatandaslik-testi (4), banka-secim (5),',
      '  sigorta-secim (5), vize-secim (5), para-transferi (5),',
      '  stepstone-karsilastirma (4), software-hub (3).',
      '',
      'Bu 8 araç middleware.ts ile login arkasında olduğu için testler',
      'giriş yapmış bir oturumla (storageState) koşar.',
    ].join('\n'),
  },
  {
    title: 'E2E Testleri — Test Kullanıcısı',
    severity: 'medium',
    category: 'auth',
    source: 'agent',
    related_path: 'scripts/e2e-create-test-user.mjs',
    description: [
      'Login-gated araç testleri için production Supabase’de bir test kullanıcısı var:',
      '  e2e-test@almanya101.de',
      '',
      'Kimlik bilgileri env ile yönetilir (E2E_TEST_EMAIL / E2E_TEST_PASSWORD).',
      'Kullanıcı yoksa/şifre sıfırlamak için:',
      '  node scripts/e2e-create-test-user.mjs  (idempotent, e-posta doğrulaması atlanmış)',
      '',
      'CI’da bu değerleri GitHub Secrets olarak tanımlayın; kod içine yazmayın.',
      'Not: Bu sadece bir test hesabıdır, gerçek kullanıcı verisi içermez.',
    ].join('\n'),
  },
  {
    title: 'E2E Bulgusu — Production ile kaynak kod sapması',
    severity: 'medium',
    category: 'config',
    source: 'agent',
    related_path: 'docs/e2e-test-plan.md',
    description: [
      'Testler production’a karşı koşarken, deploy edilmiş davranış ile repo',
      'kaynak kodu arasında 3 sapma bulundu (testler production’a göre yazıldı):',
      '',
      '1) para-transferi: repo’da hesaplayıcı, PROD’da 20 soruluk quiz.',
      '2) stepstone-karsilastirma: repo sadece maaşı zorunlu tutuyor,',
      '   PROD tüm profil alanlarını zorunlu tutuyor ("Eksik alanlar" uyarısı).',
      '3) software-hub: bağımsız araç değil, /devuser/dev paneline redirect.',
      '',
      'Aksiyon: deploy hattının repo ile senkron olduğunu doğrulayın; bu sapmalar',
      'eski bir build’in canlıda olduğunu veya farklı dağıtım dallarını gösterebilir.',
    ].join('\n'),
  },
  {
    title: 'E2E — CI entegrasyonu',
    severity: 'low',
    category: 'config',
    source: 'agent',
    related_path: '.github/workflows/e2e.yml',
    description: [
      'GitHub Actions workflow’u (.github/workflows/e2e.yml) her PR ve main',
      'push’unda smoke suite’i koşar ve HTML raporu artifact olarak yükler.',
      '',
      'Authenticated araç testlerini CI’da koşmak için E2E_TEST_EMAIL /',
      'E2E_TEST_PASSWORD secret’larını eklemek gerekir (henüz workflow’a',
      'authenticated proje eklenmedi — istenirse eklenebilir).',
    ].join('\n'),
  },
];

async function noteExists(title) {
  const { data, error } = await supabase
    .from('security_notes')
    .select('id')
    .eq('title', title)
    .limit(1);
  if (error) throw error;
  return (data || []).length > 0;
}

async function main() {
  let created = 0;
  let skipped = 0;
  for (const note of NOTES) {
    if (await noteExists(note.title)) {
      console.log(`SKIP (var): ${note.title}`);
      skipped += 1;
      continue;
    }
    const { error } = await supabase.from('security_notes').insert([note]);
    if (error) {
      console.error(`HATA: ${note.title} -> ${error.message}`);
      continue;
    }
    console.log(`EKLENDI: ${note.title}`);
    created += 1;
  }
  console.log(`\nÖzet: ${created} eklendi, ${skipped} atlandı (zaten vardı).`);
}

main().catch((err) => {
  console.error('Başarısız:', err.message || err);
  process.exit(1);
});
