/**
 * Verification script for avukat24.de lawyer data
 * 
 * Purpose: Check current state of lawyer records in DB
 * 
 * Usage:
 *   node scripts/verify-lawyers.mjs              # show stats
 *   node scripts/verify-lawyers.mjs --sample 10  # sample 10 records
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

const sampleSize = Number(
  process.argv.includes('--sample')
    ? process.argv[process.argv.indexOf('--sample') + 1]
    : 0
);

// ============= MAIN =============

async function main() {
  console.log('========================================');
  console.log('Avukat24 Lawyer Verification');
  console.log('========================================\n');

  // Get all lawyers
  const { data, error } = await supabase
    .from('providers')
    .select('id, display_name, city, phone, address, website, google_maps_url, notes_public')
    .eq('type', 'lawyer');

  if (error) throw error;

  const total = data?.length || 0;
  const withPhone = data?.filter((d) => d.phone).length || 0;
  const withAddress = data?.filter((d) => d.address).length || 0;
  const withEmail = data?.filter((d) => d.email).length || 0;
  const withWebsite = data?.filter((d) => d.website).length || 0;
  const withMaps = data?.filter((d) => d.google_maps_url).length || 0;
  const withNotes = data?.filter((d) => d.notes_public).length || 0;

  console.log('DATABASE STATISTICS');
  console.log('--------------------');
  console.log(`Total lawyers: ${total}`);
  console.log(`With phone: ${withPhone} (${Math.round((withPhone / total) * 100)}%)`);
  console.log(`With address: ${withAddress} (${Math.round((withAddress / total) * 100)}%)`);
  console.log(`With email: ${withEmail} (${Math.round((withEmail / total) * 100)}%)`);
  console.log(`With website: ${withWebsite} (${Math.round((withWebsite / total) * 100)}%)`);
  console.log(`With Google Maps: ${withMaps} (${Math.round((withMaps / total) * 100)}%)`);
  console.log(`With notes: ${withNotes} (${Math.round((withNotes / total) * 100)}%)`);
  console.log('');

  // Check for potential duplicates
  const nameCityMap = new Map();
  const duplicates = [];
  for (const row of data || []) {
    const key = `${(row.display_name || '').toLowerCase()}|${(row.city || '').toLowerCase()}`;
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

  console.log('DUPLICATE CHECK');
  console.log('----------------');
  if (duplicates.length === 0) {
    console.log('No duplicates found');
  } else {
    console.log(`Potential duplicates: ${duplicates.length}`);
    for (const dup of duplicates.slice(0, 5)) {
      console.log(`  - ${dup.key}`);
      console.log(`    IDs: ${dup.ids.join(', ')}`);
    }
  }
  console.log('');

  // Sample verification
  if (sampleSize > 0) {
    console.log('SAMPLE RECORDS');
    console.log('----------------');

    const sample = data?.slice(0, sampleSize) || [];
    for (const record of sample) {
      console.log(`\n[${record.id}] ${record.display_name} (${record.city})`);
      console.log(`  Phone: ${record.phone || 'N/A'}`);
      console.log(`  Address: ${record.address || 'N/A'}`);
      console.log(`  Email: ${record.email || 'N/A'}`);
      console.log(`  Website: ${record.website || 'N/A'}`);
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
