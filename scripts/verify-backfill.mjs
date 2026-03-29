/**
 * Verification script for tuerkischeaerzte backfill
 * 
 * Purpose: Validate backfill results by comparing before/after stats
 * and sampling records for manual verification.
 * 
 * Usage:
 *   node scripts/verify-backfill.mjs                 # show stats
 *   node scripts/verify-backfill.mjs --sample 10     # sample 10 records
 *   node scripts/verify-backfill.mjs --compare-url   # fetch and compare with source
 */

import nextEnv from '@next/env';
import { createClient } from '@supabase/supabase-js';
import { load } from 'cheerio';

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

const sampleSize = Number(process.argv.includes('--sample') ? 
  process.argv[process.argv.indexOf('--sample') + 1] : 0);
const compareUrl = process.argv.includes('--compare-url');

// ============= UTILITY FUNCTIONS =============

function normalizeWhitespace(value) {
  return String(value || '')
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizePhone(value) {
  const raw = normalizeWhitespace(value);
  if (!raw) return '';
  const cleaned = raw.replace(/[^\d+]/g, '');
  return cleaned.startsWith('00') ? `+${cleaned.slice(2)}` : cleaned;
}

// ============= VERIFICATION FUNCTIONS =============

async function getDoctorStats() {
  const { data, error } = await supabase
    .from('providers')
    .select('id, display_name, city, phone, address, website, google_maps_url, notes_public')
    .eq('type', 'doctor');

  if (error) throw error;

  const total = data?.length || 0;
  const withPhone = data?.filter((d) => d.phone).length || 0;
  const withAddress = data?.filter((d) => d.address).length || 0;
  const withWebsite = data?.filter((d) => d.website).length || 0;
  const withMaps = data?.filter((d) => d.google_maps_url).length || 0;
  const withNotes = data?.filter((d) => d.notes_public).length || 0;

  // Check for potential duplicates
  const nameCityMap = new Map();
  const duplicates = [];
  for (const row of data || []) {
    const key = `${normalizeWhitespace(row.display_name).toLowerCase()}|${normalizeWhitespace(row.city).toLowerCase()}`;
    if (nameCityMap.has(key)) {
      duplicates.push({
        key,
        ids: [nameCityMap.get(key), row.id],
        names: [row.display_name],
      });
    } else {
      nameCityMap.set(key, row.id);
    }
  }

  return {
    total,
    withPhone,
    withAddress,
    withWebsite,
    withMaps,
    withNotes,
    duplicates: duplicates.length,
    duplicateDetails: duplicates.slice(0, 5),
  };
}

async function fetchSourceProfile(url) {
  try {
    const response = await fetch(url, {
      headers: {
        'user-agent': 'Mozilla/5.0 (compatible; almanya101-verify-bot/1.0; +https://almanya101.com)',
        accept: 'text/html,application/xhtml+xml',
      },
    });

    if (!response.ok) return null;

    const html = await response.text();
    const $ = load(html);

    const displayName = normalizeWhitespace($('h1').first().text());
    
    // Get phone
    const phoneLink = $('a[href^="tel:"]').first();
    const phone = normalizePhone(phoneLink.text() || '');
    
    // Get address
    const mapsLink = $('a[href*="maps.google"]').first();
    const address = normalizeWhitespace(mapsLink.text() || '');

    return { displayName, phone, address, url };
  } catch {
    return null;
  }
}

async function compareWithSource(dbRecord) {
  if (!dbRecord.website) {
    return { status: 'no-url', dbRecord };
  }

  const source = await fetchSourceProfile(dbRecord.website);
  if (!source) {
    return { status: 'fetch-error', dbRecord };
  }

  const phoneMatch = !source.phone || 
    normalizePhone(dbRecord.phone || '') === normalizePhone(source.phone);
  
  const addressMatch = !source.address ||
    normalizeWhitespace(dbRecord.address || '').toLowerCase().includes(
      normalizeWhitespace(source.address).toLowerCase().substring(0, 20)
    );

  return {
    status: 'compared',
    dbRecord,
    source,
    phoneMatch,
    addressMatch,
    issues: [
      !phoneMatch ? 'phone mismatch' : null,
      !addressMatch ? 'address mismatch' : null,
    ].filter(Boolean),
  };
}

// ============= MAIN =============

async function main() {
  console.log('========================================');
  console.log('Tuerkische Aerzte Backfill Verification');
  console.log('========================================\n');

  // Get stats
  const stats = await getDoctorStats();

  console.log('DATABASE STATISTICS');
  console.log('--------------------');
  console.log(`Total doctors: ${stats.total}`);
  console.log(`With phone: ${stats.withPhone} (${Math.round((stats.withPhone / stats.total) * 100)}%)`);
  console.log(`With address: ${stats.withAddress} (${Math.round((stats.withAddress / stats.total) * 100)}%)`);
  console.log(`With website: ${stats.withWebsite} (${Math.round((stats.withWebsite / stats.total) * 100)}%)`);
  console.log(`With Google Maps: ${stats.withMaps} (${Math.round((stats.withMaps / stats.total) * 100)}%)`);
  console.log(`With notes: ${stats.withNotes} (${Math.round((stats.withNotes / stats.total) * 100)}%)`);
  console.log('');

  // Check duplicates
  console.log('DUPLICATE CHECK');
  console.log('----------------');
  if (stats.duplicates === 0) {
    console.log('No duplicates found');
  } else {
    console.log(`Potential duplicates: ${stats.duplicates}`);
    for (const dup of stats.duplicateDetails) {
      console.log(`  - ${dup.key}`);
      console.log(`    IDs: ${dup.ids.join(', ')}`);
    }
  }
  console.log('');

  // Sample verification
  if (sampleSize > 0) {
    console.log('SAMPLE VERIFICATION');
    console.log('-------------------');

    const { data, error } = await supabase
      .from('providers')
      .select('id, display_name, city, phone, address, website')
      .eq('type', 'doctor')
      .not('phone', 'is', null)
      .limit(sampleSize);

    if (error) throw error;

    for (const record of data || []) {
      console.log(`\n[${record.id}] ${record.display_name} (${record.city})`);
      console.log(`  Phone: ${record.phone}`);
      console.log(`  Address: ${record.address || 'N/A'}`);
      console.log(`  Website: ${record.website || 'N/A'}`);

      if (compareUrl && record.website) {
        const comparison = await compareWithSource(record);
        if (comparison.status === 'compared') {
          console.log(`  Source phone: ${comparison.source.phone}`);
          console.log(`  Phone match: ${comparison.phoneMatch ? 'YES' : 'NO'}`);
          console.log(`  Address match: ${comparison.addressMatch ? 'YES' : 'NO'}`);
          if (comparison.issues.length > 0) {
            console.log(`  ISSUES: ${comparison.issues.join(', ')}`);
          }
        } else {
          console.log(`  Source comparison: ${comparison.status}`);
        }
      }
    }
  }

  console.log('\n========================================');
  console.log('VERIFICATION COMPLETE');
  console.log('========================================');
}

main().catch((error) => {
  console.error('[fatal]', error);
  process.exit(1);
});
