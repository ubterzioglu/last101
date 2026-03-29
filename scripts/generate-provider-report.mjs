/**
 * Comprehensive Provider Report Generator
 * 
 * Generates a detailed report of doctors and lawyers in the database,
 * including data completeness, additional info status, and quality metrics.
 * 
 * Usage:
 *   node scripts/generate-provider-report.mjs
 */

import nextEnv from '@next/env';
import { createClient } from '@supabase/supabase-js';

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    'Supabase env eksik. NEXT_PUBLIC_SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY gerekli.'
  );
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// ============= HELPER FUNCTIONS =============

function normalizeWhitespace(value) {
  return String(value || '')
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function calculatePercentage(count, total) {
  if (total === 0) return 0;
  return Math.round((count / total) * 100);
}

async function hasProviderEmailColumn() {
  const { error } = await supabase
    .from('providers')
    .select('email')
    .limit(1);

  if (!error) return true;
  if (error.code === '42703') return false;
  throw error;
}

// ============= DATA COLLECTION =============

async function getProviderStats(type, options = {}) {
  const { hasEmailColumn = false } = options;
  const selectFields = [
    'id',
    'display_name',
    'city',
    'phone',
    'address',
    'website',
    'google_maps_url',
    'notes_public',
    'created_at',
    'updated_at',
  ];

  if (hasEmailColumn) {
    selectFields.splice(5, 0, 'email');
  }

  const { data, error } = await supabase
    .from('providers')
    .select(selectFields.join(', '))
    .eq('type', type);

  if (error) throw error;

  const total = data?.length || 0;
  
  // Basic field completeness
  const withPhone = data?.filter((d) => d.phone).length || 0;
  const withAddress = data?.filter((d) => d.address).length || 0;
  const withEmail = hasEmailColumn
    ? data?.filter((d) => d.email).length || 0
    : 0;
  const withWebsite = data?.filter((d) => d.website).length || 0;
  const withMaps = data?.filter((d) => d.google_maps_url).length || 0;
  const withNotes = data?.filter((d) => d.notes_public).length || 0;
  
  // Additional info completeness (has at least one extra field)
  const withAdditionalInfo = data?.filter((d) => 
    d.phone ||
    d.address ||
    (hasEmailColumn && d.email) ||
    d.website ||
    d.google_maps_url ||
    d.notes_public
  ).length || 0;
  
  // Complete records (has all key fields)
  const completeRecords = data?.filter((d) => 
    d.phone && d.address && d.city
  ).length || 0;
  
  // City distribution
  const cityMap = new Map();
  for (const row of data || []) {
    const city = normalizeWhitespace(row.city || 'Bilinmiyor');
    cityMap.set(city, (cityMap.get(city) || 0) + 1);
  }
  const topCities = [...cityMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  
  // Duplicate check
  const nameCityMap = new Map();
  const duplicates = [];
  for (const row of data || []) {
    const key = `${normalizeWhitespace(row.display_name).toLowerCase()}|${normalizeWhitespace(row.city).toLowerCase()}`;
    if (nameCityMap.has(key)) {
      duplicates.push({
        key,
        ids: [nameCityMap.get(key), row.id],
      });
    } else {
      nameCityMap.set(key, row.id);
    }
  }

  // Date range
  const dates = data?.map((d) => new Date(d.created_at)).filter((d) => !isNaN(d)) || [];
  const oldestRecord = dates.length > 0 ? new Date(Math.min(...dates)) : null;
  const newestRecord = dates.length > 0 ? new Date(Math.max(...dates)) : null;

  return {
    total,
    withPhone,
    withAddress,
    withEmail,
    withWebsite,
    withMaps,
    withNotes,
    withAdditionalInfo,
    completeRecords,
    duplicates: duplicates.length,
    topCities,
    oldestRecord,
    newestRecord,
    rawData: data,
  };
}

// ============= REPORT GENERATION =============

function printSection(title) {
  console.log('\n' + '='.repeat(60));
  console.log(title);
  console.log('='.repeat(60));
}

function printSubSection(title) {
  console.log('\n--- ' + title + ' ---');
}

function printStat(label, value, total = null) {
  if (total !== null) {
    const pct = calculatePercentage(value, total);
    console.log(`${label}: ${value} (${pct}%)`);
  } else {
    console.log(`${label}: ${value}`);
  }
}

function formatDate(date) {
  if (!date) return 'N/A';
  return date.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// ============= MAIN =============

async function main() {
  console.log('\n' + '█'.repeat(60));
  console.log('█' + ' '.repeat(58) + '█');
  console.log('█        ALMANYA101 - SAĞLAYICI VERİ RAPORU           █');
  console.log('█' + ' '.repeat(58) + '█');
  console.log('█'.repeat(60));
  console.log('\nRapor Tarihi:', new Date().toLocaleString('tr-TR'));

  const emailColumnExists = await hasProviderEmailColumn();
  if (!emailColumnExists) {
    console.log('[warn] providers.email kolonu bulunamadi; e-posta metrikleri 0 olarak raporlanacak.');
  }

  // Get stats for both types
  const doctorStats = await getProviderStats('doctor', { hasEmailColumn: emailColumnExists });
  const lawyerStats = await getProviderStats('lawyer', { hasEmailColumn: emailColumnExists });

  // ============= ÖZET =============
  printSection('ÖZET');
  console.log('\n┌─────────────────┬──────────┬──────────┐');
  console.log('│ Tip             │ Doktor   │ Avukat   │');
  console.log('├─────────────────┼──────────┼──────────┤');
  console.log(`│ Toplam Kayıt    │ ${String(doctorStats.total).padStart(8)} │ ${String(lawyerStats.total).padStart(8)} │`);
  console.log(`│ Telefonu Olan   │ ${String(doctorStats.withPhone).padStart(8)} │ ${String(lawyerStats.withPhone).padStart(8)} │`);
  console.log(`│ Adresi Olan     │ ${String(doctorStats.withAddress).padStart(8)} │ ${String(lawyerStats.withAddress).padStart(8)} │`);
  console.log(`│ E-posta Olan    │ ${String(doctorStats.withEmail).padStart(8)} │ ${String(lawyerStats.withEmail).padStart(8)} │`);
  console.log(`│ Web Sitesi Olan │ ${String(doctorStats.withWebsite).padStart(8)} │ ${String(lawyerStats.withWebsite).padStart(8)} │`);
  console.log(`│ Google Maps     │ ${String(doctorStats.withMaps).padStart(8)} │ ${String(lawyerStats.withMaps).padStart(8)} │`);
  console.log(`│ Notlar          │ ${String(doctorStats.withNotes).padStart(8)} │ ${String(lawyerStats.withNotes).padStart(8)} │`);
  console.log('└─────────────────┴──────────┴──────────┘');

  // ============= DOKTOR DETAYLARI =============
  printSection('DOKTOR VERİLERİ');
  
  printSubSection('Temel İstatistikler');
  printStat('Toplam Kayıt', doctorStats.total);
  printStat('Telefonu Olan', doctorStats.withPhone, doctorStats.total);
  printStat('Adresi Olan', doctorStats.withAddress, doctorStats.total);
  printStat('E-posta Olan', doctorStats.withEmail, doctorStats.total);
  printStat('Web Sitesi Olan', doctorStats.withWebsite, doctorStats.total);
  printStat('Google Maps URL', doctorStats.withMaps, doctorStats.total);
  printStat('Notları Olan', doctorStats.withNotes, doctorStats.total);
  
  printSubSection('Ek Bilgi Durumu');
  printStat('En Az Bir Ek Bilgi Olan', doctorStats.withAdditionalInfo, doctorStats.total);
  printStat('Tam Kayıt (telefon + adres + şehir)', doctorStats.completeRecords, doctorStats.total);
  printStat('Eksik Kayıt', doctorStats.total - doctorStats.withAdditionalInfo, doctorStats.total);
  
  printSubSection('Veri Kalitesi');
  console.log(`Olası Yinelenen Kayıt: ${doctorStats.duplicates}`);
  console.log(`En Eski Kayıt: ${formatDate(doctorStats.oldestRecord)}`);
  console.log(`En Yeni Kayıt: ${formatDate(doctorStats.newestRecord)}`);
  
  printSubSection('En Yoğun Şehirler (İlk 10)');
  for (const [city, count] of doctorStats.topCities) {
    console.log(`  ${city}: ${count}`);
  }

  // ============= AVUKAT DETAYLARI =============
  printSection('AVUKAT VERİLERİ');
  
  printSubSection('Temel İstatistikler');
  printStat('Toplam Kayıt', lawyerStats.total);
  printStat('Telefonu Olan', lawyerStats.withPhone, lawyerStats.total);
  printStat('Adresi Olan', lawyerStats.withAddress, lawyerStats.total);
  printStat('E-posta Olan', lawyerStats.withEmail, lawyerStats.total);
  printStat('Web Sitesi Olan', lawyerStats.withWebsite, lawyerStats.total);
  printStat('Google Maps URL', lawyerStats.withMaps, lawyerStats.total);
  printStat('Notları Olan', lawyerStats.withNotes, lawyerStats.total);
  
  printSubSection('Ek Bilgi Durumu');
  printStat('En Az Bir Ek Bilgi Olan', lawyerStats.withAdditionalInfo, lawyerStats.total);
  printStat('Tam Kayıt (telefon + adres + şehir)', lawyerStats.completeRecords, lawyerStats.total);
  printStat('Eksik Kayıt', lawyerStats.total - lawyerStats.withAdditionalInfo, lawyerStats.total);
  
  printSubSection('Veri Kalitesi');
  console.log(`Olası Yinelenen Kayıt: ${lawyerStats.duplicates}`);
  console.log(`En Eski Kayıt: ${formatDate(lawyerStats.oldestRecord)}`);
  console.log(`En Yeni Kayıt: ${formatDate(lawyerStats.newestRecord)}`);
  
  printSubSection('En Yoğun Şehirler (İlk 10)');
  for (const [city, count] of lawyerStats.topCities) {
    console.log(`  ${city}: ${count}`);
  }

  // ============= KARŞILAŞTIRMA =============
  printSection('KARŞILAŞTIRMALI ANALİZ');
  
  const totalProviders = doctorStats.total + lawyerStats.total;
  console.log(`\nToplam Sağlayıcı: ${totalProviders}`);
  console.log(`  - Doktorlar: %${calculatePercentage(doctorStats.total, totalProviders)}`);
  console.log(`  - Avukatlar: %${calculatePercentage(lawyerStats.total, totalProviders)}`);
  
  console.log('\nVeri Tamamlanma Oranları:');
  console.log('┌─────────────────────┬─────────┬─────────┐');
  console.log('│ Alan                │ Doktor  │ Avukat  │');
  console.log('├─────────────────────┼─────────┼─────────┤');
  console.log(`│ Telefon             │ %${String(calculatePercentage(doctorStats.withPhone, doctorStats.total)).padStart(6)} │ %${String(calculatePercentage(lawyerStats.withPhone, lawyerStats.total)).padStart(6)} │`);
  console.log(`│ Adres               │ %${String(calculatePercentage(doctorStats.withAddress, doctorStats.total)).padStart(6)} │ %${String(calculatePercentage(lawyerStats.withAddress, lawyerStats.total)).padStart(6)} │`);
  console.log(`│ E-posta             │ %${String(calculatePercentage(doctorStats.withEmail, doctorStats.total)).padStart(6)} │ %${String(calculatePercentage(lawyerStats.withEmail, lawyerStats.total)).padStart(6)} │`);
  console.log(`│ Web Sitesi          │ %${String(calculatePercentage(doctorStats.withWebsite, doctorStats.total)).padStart(6)} │ %${String(calculatePercentage(lawyerStats.withWebsite, lawyerStats.total)).padStart(6)} │`);
  console.log(`│ Google Maps         │ %${String(calculatePercentage(doctorStats.withMaps, doctorStats.total)).padStart(6)} │ %${String(calculatePercentage(lawyerStats.withMaps, lawyerStats.total)).padStart(6)} │`);
  console.log(`│ Notlar              │ %${String(calculatePercentage(doctorStats.withNotes, doctorStats.total)).padStart(6)} │ %${String(calculatePercentage(lawyerStats.withNotes, lawyerStats.total)).padStart(6)} │`);
  console.log(`│ Tam Kayıt           │ %${String(calculatePercentage(doctorStats.completeRecords, doctorStats.total)).padStart(6)} │ %${String(calculatePercentage(lawyerStats.completeRecords, lawyerStats.total)).padStart(6)} │`);
  console.log('└─────────────────────┴─────────┴─────────┘');

  // ============= ÖNERİLER =============
  printSection('ÖNERİLER');
  
  const recommendations = [];
  
  if (doctorStats.withPhone < doctorStats.total * 0.9) {
    recommendations.push('- Doktor telefon verileri tamamlanmalı (eksik: ' + (doctorStats.total - doctorStats.withPhone) + ' kayıt)');
  }
  if (doctorStats.withAddress < doctorStats.total * 0.9) {
    recommendations.push('- Doktor adres verileri tamamlanmalı (eksik: ' + (doctorStats.total - doctorStats.withAddress) + ' kayıt)');
  }
  if (lawyerStats.withPhone < lawyerStats.total * 0.9) {
    recommendations.push('- Avukat telefon verileri tamamlanmalı (eksik: ' + (lawyerStats.total - lawyerStats.withPhone) + ' kayıt)');
  }
  if (lawyerStats.withAddress < lawyerStats.total * 0.9) {
    recommendations.push('- Avukat adres verileri tamamlanmalı (eksik: ' + (lawyerStats.total - lawyerStats.withAddress) + ' kayıt)');
  }
  if (lawyerStats.withEmail === 0) {
    recommendations.push('- Avukat e-posta verileri tamamen eksik - eklenmeli');
  }
  if (doctorStats.withMaps < doctorStats.total * 0.5) {
    recommendations.push('- Doktor Google Maps URL\'leri artırılmalı');
  }
  if (lawyerStats.withMaps < lawyerStats.total * 0.5) {
    recommendations.push('- Avukat Google Maps URL\'leri artırılmalı');
  }
  
  if (recommendations.length === 0) {
    console.log('\n✓ Veri kalitesi iyi durumda!');
  } else {
    console.log('\nGeliştirme Önerileri:');
    recommendations.forEach(r => console.log(r));
  }

  // ============= SONUÇ =============
  printSection('SONUÇ');
  console.log('\nBu rapor, Almanya101 veritabanındaki doktor ve avukat');
  console.log('verilerinin mevcut durumunu özetlemektedir.');
  console.log('\nRapor oluşturuldu: ' + new Date().toLocaleString('tr-TR'));
  console.log('\n' + '█'.repeat(60));
}

main().catch((error) => {
  console.error('[fatal]', error);
  process.exit(1);
});
