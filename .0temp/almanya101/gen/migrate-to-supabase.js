/* =========================================================
   ZGEN – Supabase Migration Script
   Bu script zgen-data.js dosyasındaki verileri Supabase'e yükler
   
   Kullanım:
   node migrate-to-supabase.js
   ========================================================= */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase config - Supabase Dashboard'dan alın
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ldptefnpiudquipdsezr.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY environment variable gerekli!');
  console.log('💡 Kullanım: SUPABASE_SERVICE_ROLE_KEY=your-key node migrate-to-supabase.js');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// zgen-data.js dosyasını yükle (eval kullanarak)
async function loadZGENData() {
  try {
    const dataFile = path.join(__dirname, 'zgen-data.js');
    const fileContent = fs.readFileSync(dataFile, 'utf-8');
    
    // ZGEN_DATA'yı extract et
    const match = fileContent.match(/const ZGEN_DATA = ({[\s\S]*});/);
    if (!match) {
      throw new Error('ZGEN_DATA bulunamadı');
    }
    
    // eval ile parse et (güvenli çünkü kendi dosyamız)
    const ZGEN_DATA = eval('(' + match[1] + ')');
    return ZGEN_DATA;
  } catch (error) {
    console.error('❌ zgen-data.js yüklenirken hata:', error);
    throw error;
  }
}

async function migrateGenerations(ZGEN_DATA) {
  console.log('📊 Generations yükleniyor...');
  
  const generations = ZGEN_DATA.generations.map(gen => ({
    id: gen.id,
    name: gen.name,
    range_start: gen.range[0],
    range_end: gen.range[1],
    // Avatar path'lerini tam olarak kaydet (../img/generations/ ile birlikte)
    avatar_m: gen.avatars?.m || null,
    avatar_f: gen.avatars?.f || null,
    avatar_alt: gen.avatarAlt || gen.name + ' avatarı'
  }));

  // Mevcut verileri sil (opsiyonel - yorumdan çıkarabilirsiniz)
  // const { error: deleteError } = await supabase.from('zgen_generations').delete().neq('id', '');
  // if (deleteError) console.warn('⚠️  Silme hatası:', deleteError);

  const { data, error } = await supabase
    .from('zgen_generations')
    .upsert(generations, { onConflict: 'id' })
    .select();

  if (error) {
    console.error('❌ Generations yükleme hatası:', error);
    return false;
  }

  console.log(`✅ ${data.length} generation yüklendi`);
  return true;
}

async function migrateProfiles(ZGEN_DATA) {
  console.log('📊 Profiles yükleniyor...');

  const profiles = Object.entries(ZGEN_DATA.profiles).map(([genId, profile]) => ({
    gen_id: genId,
    traits: profile.traits || [],
    vibes: profile.vibes || []
  }));

  const { data, error } = await supabase
    .from('zgen_profiles')
    .upsert(profiles, { onConflict: 'gen_id' })
    .select();

  if (error) {
    console.error('❌ Profiles yükleme hatası:', error);
    return false;
  }

  console.log(`✅ ${data.length} profile yüklendi`);
  return true;
}

async function migrateCompat(ZGEN_DATA) {
  console.log('📊 Compatibility verileri yükleniyor...');

  const compatRecords = [];
  
  Object.entries(ZGEN_DATA.compat || {}).forEach(([fromGenId, toGens]) => {
    Object.entries(toGens).forEach(([toGenId, compat]) => {
      compatRecords.push({
        from_gen_id: fromGenId,
        to_gen_id: toGenId,
        dos: compat.dos || [],
        donts: compat.donts || []
      });
    });
  });

  // Mevcut verileri sil (opsiyonel)
  // const { error: deleteError } = await supabase.from('zgen_compat').delete().neq('id', 0);
  // if (deleteError) console.warn('⚠️  Silme hatası:', deleteError);

  const { data, error } = await supabase
    .from('zgen_compat')
    .upsert(compatRecords, { onConflict: 'from_gen_id,to_gen_id' })
    .select();

  if (error) {
    console.error('❌ Compatibility yükleme hatası:', error);
    return false;
  }

  console.log(`✅ ${data.length} compatibility kaydı yüklendi`);
  return true;
}

async function main() {
  console.log('🚀 ZGEN Supabase Migration başlıyor...\n');

  try {
    // Veriyi yükle
    const ZGEN_DATA = await loadZGENData();
    console.log('✅ zgen-data.js yüklendi\n');

    // Migration işlemleri
    const genSuccess = await migrateGenerations(ZGEN_DATA);
    if (!genSuccess) {
      console.error('❌ Generations migration başarısız!');
      process.exit(1);
    }

    const profSuccess = await migrateProfiles(ZGEN_DATA);
    if (!profSuccess) {
      console.error('❌ Profiles migration başarısız!');
      process.exit(1);
    }

    const compatSuccess = await migrateCompat(ZGEN_DATA);
    if (!compatSuccess) {
      console.error('❌ Compatibility migration başarısız!');
      process.exit(1);
    }

    console.log('\n🎉 Migration tamamlandı!');
    console.log('💡 Artık zgen.html Supabase\'den veri çekebilir.');

  } catch (error) {
    console.error('❌ Migration hatası:', error);
    process.exit(1);
  }
}

main();
