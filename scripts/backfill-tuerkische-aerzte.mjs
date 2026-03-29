/**
 * Backfill script for tuerkischeaerzte.de doctor data
 * 
 * Purpose: Update existing doctor records with missing phone/address data
 * instead of skipping them like the original import script.
 * 
 * Usage:
 *   node scripts/backfill-tuerkische-aerzte.mjs                    # dry-run (default)
 *   node scripts/backfill-tuerkische-aerzte.mjs --preview          # show update preview
 *   node scripts/backfill-tuerkische-aerzte.mjs --apply            # apply updates
 *   node scripts/backfill-tuerkische-aerzte.mjs --max-pages 5      # limit pages
 *   node scripts/backfill-tuerkische-aerzte.mjs --limit 10         # limit profiles
 */

import nextEnv from '@next/env';
import { createClient } from '@supabase/supabase-js';
import { load } from 'cheerio';

const SOURCE_BASE_URL = 'https://tuerkischeaerzte.de';
const LISTING_BASE_URL = `${SOURCE_BASE_URL}/aerzte/`;
const DEFAULT_MAX_PAGES = 60;
const DEFAULT_BATCH_SIZE = 50;
const USER_AGENT =
  'Mozilla/5.0 (compatible; almanya101-backfill-bot/1.0; +https://almanya101.com)';

const GERMAN_STATES = new Set([
  'baden-württemberg',
  'bayern',
  'berlin',
  'brandenburg',
  'bremen',
  'hamburg',
  'hessen',
  'mecklenburg-vorpommern',
  'niedersachsen',
  'nordrhein-westfalen',
  'rheinland-pfalz',
  'saarland',
  'sachsen',
  'sachsen-anhalt',
  'schleswig-holstein',
  'thüringen',
]);

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

// Parse command line arguments
const applyMode = process.argv.includes('--apply');
const previewMode = process.argv.includes('--preview');
const maxPages = Number(getArgValue('--max-pages') || DEFAULT_MAX_PAGES);
const limit = Number(getArgValue('--limit') || 0);

function getArgValue(flag) {
  const index = process.argv.indexOf(flag);
  if (index === -1) return '';
  return process.argv[index + 1] || '';
}

// ============= UTILITY FUNCTIONS (reused from import script) =============

function normalizeWhitespace(value) {
  return String(value || '')
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeNameKey(value) {
  return normalizeWhitespace(value)
    .split(' - ')[0]
    .toLocaleLowerCase('tr-TR');
}

function normalizeCityKey(value) {
  return normalizeWhitespace(value).toLocaleLowerCase('tr-TR');
}

function normalizePhone(value) {
  const raw = normalizeWhitespace(value);
  if (!raw) return '';
  const cleaned = raw.replace(/[^\d+]/g, '');
  return cleaned.startsWith('00') ? `+${cleaned.slice(2)}` : cleaned;
}

function looksLikePhone(value) {
  return /(?:\+|00)?\d[\d\s()./-]{6,}/.test(normalizeWhitespace(value));
}

function buildListingPageUrl(pageNumber) {
  return pageNumber === 1
    ? LISTING_BASE_URL
    : `${LISTING_BASE_URL}page/${pageNumber}/`;
}

function normalizeProfileUrl(href) {
  if (!href) return '';

  try {
    const url = new URL(href, SOURCE_BASE_URL);
    const normalized = url.toString().replace(/#.*$/, '');
    if (!/^https:\/\/tuerkischeaerzte\.de\/aerzte\/(?!page\/)[^/?#]+\/?$/.test(normalized)) {
      return '';
    }
    return normalized.endsWith('/') ? normalized : `${normalized}/`;
  } catch {
    return '';
  }
}

async function fetchHtml(url) {
  const response = await fetch(url, {
    headers: {
      'user-agent': USER_AGENT,
      accept: 'text/html,application/xhtml+xml',
    },
  });

  if (!response.ok) {
    const error = new Error(`Fetch failed (${response.status}) for ${url}`);
    error.status = response.status;
    throw error;
  }

  return response.text();
}

async function collectProfileUrls() {
  const urls = new Set();
  let emptyPages = 0;

  for (let page = 1; page <= maxPages; page += 1) {
    const url = buildListingPageUrl(page);
    let html = '';
    try {
      html = await fetchHtml(url);
    } catch (error) {
      if (error && typeof error === 'object' && error.status === 404) {
        console.log(`[scan] page ${page}: 404 stop`);
        break;
      }
      throw error;
    }
    const $ = load(html);

    const pageUrls = new Set(
      $('a[href]')
        .map((_, element) => normalizeProfileUrl($(element).attr('href')))
        .get()
        .filter(Boolean)
    );

    if (pageUrls.size === 0) {
      emptyPages += 1;
      console.log(`[scan] page ${page}: no profile links`);
      if (emptyPages >= 2) break;
      continue;
    }

    emptyPages = 0;
    pageUrls.forEach((profileUrl) => urls.add(profileUrl));
    console.log(`[scan] page ${page}: ${pageUrls.size} profiles`);

    if (limit > 0 && urls.size >= limit) {
      break;
    }
  }

  return [...urls];
}

function splitLines(text) {
  return String(text || '')
    .split(/\r?\n/)
    .map((line) => normalizeWhitespace(line))
    .filter(Boolean);
}

function extractLineAfter(lines, label, matcher) {
  const labelIndex = lines.findIndex((line) => line === label);
  if (labelIndex === -1) return '';

  for (let index = labelIndex + 1; index < lines.length; index += 1) {
    const value = lines[index];
    if (!value || value === label) continue;
    if (!matcher || matcher(value)) return value;
  }

  return '';
}

function extractCityFromAddress(address) {
  const normalized = normalizeWhitespace(address);
  if (!normalized) return '';

  const postalMatch = normalized.match(/\b\d{5}\s+(.+)$/);
  if (postalMatch) return normalizeWhitespace(postalMatch[1]);

  const commaParts = normalized
    .split(',')
    .map((part) => normalizeWhitespace(part))
    .filter(Boolean);

  if (commaParts.length > 1) {
    const lastPart = commaParts[commaParts.length - 1];
    if (/^(deutsch|deutschland|germany)$/i.test(lastPart)) {
      const fallback = commaParts[commaParts.length - 2] || '';
      const fallbackMatch = fallback.match(/\b\d+\w*\s+(.+)$/);
      return cleanupCityCandidate(
        fallbackMatch ? normalizeWhitespace(fallbackMatch[1]) : fallback
      );
    }
    if (GERMAN_STATES.has(lastPart.toLocaleLowerCase('tr-TR'))) {
      return cleanupCityCandidate(commaParts[commaParts.length - 2] || '');
    }
    return cleanupCityCandidate(lastPart);
  }

  const numberMatch = normalized.match(/\b\d+\w*\s+(.+)$/);
  if (numberMatch) return cleanupCityCandidate(numberMatch[1]);

  return cleanupCityCandidate(commaParts[commaParts.length - 1] || '');
}

function extractMapsQuery(url) {
  if (!url) return '';

  try {
    const parsed = new URL(url);
    return normalizeWhitespace(parsed.searchParams.get('q') || '');
  } catch {
    return '';
  }
}

function cleanupCityCandidate(value) {
  let city = normalizeWhitespace(value);
  if (!city) return '';

  city = city.replace(/^[–-]\s*/, '');
  city = city.replace(/^\(([^)]+)\)\s*/, '');
  city = city.replace(/^[a-z]\s+/i, '');

  const afterNumberMatch = city.match(/\d[\d\w./-]*\s+(.+)$/);
  if (afterNumberMatch) {
    city = normalizeWhitespace(afterNumberMatch[1]);
  }

  return city;
}

function extractProfileTitle(lines, name, specialties) {
  const nameIndex = lines.findIndex((line) => line === name);
  if (nameIndex === -1) return '';

  const blocked = new Set([
    'Telefon',
    'Karte & Anfahrt',
    'Öffnungszeiten',
    'Fehler melden',
    'zurück zu Alle Ärzte',
  ]);

  for (let index = nameIndex + 1; index < lines.length; index += 1) {
    const value = lines[index];
    if (!value || blocked.has(value)) continue;
    if (specialties.includes(value)) continue;
    if (looksLikePhone(value)) continue;
    return value;
  }

  return '';
}

function translateDayName(dayName) {
  const map = {
    Montag: 'Pazartesi',
    Dienstag: 'Salı',
    Mittwoch: 'Çarşamba',
    Donnerstag: 'Perşembe',
    Freitag: 'Cuma',
    Samstag: 'Cumartesi',
    Sonntag: 'Pazar',
  };

  return map[dayName] || dayName;
}

function extractOpeningHours(lines) {
  const startIndex = lines.findIndex((line) => line === 'Öffnungszeiten');
  if (startIndex === -1) return [];

  const stopPatterns = [/^Fehler melden/i, /^zurück zu/i, /^Kontakt$/i];
  const dayNames = new Set([
    'Montag',
    'Dienstag',
    'Mittwoch',
    'Donnerstag',
    'Freitag',
    'Samstag',
    'Sonntag',
  ]);

  const hours = [];
  for (let index = startIndex + 1; index < lines.length; index += 1) {
    const current = lines[index];
    if (!current) continue;
    if (stopPatterns.some((pattern) => pattern.test(current))) break;
    if (!dayNames.has(current)) continue;

    const nextLine = lines[index + 1] || '';
    if (!nextLine || dayNames.has(nextLine)) continue;
    hours.push(`${translateDayName(current)}: ${nextLine}`);
  }

  return hours;
}

function buildNotes({ sourceUrl, title, specialties, openingHours }) {
  const parts = ['Türkische Ärzte kaynağından aktarıldı.'];

  if (title) parts.push(`Ünvan: ${title}.`);
  if (specialties.length > 0) parts.push(`Uzmanlıklar: ${specialties.join(', ')}.`);
  if (openingHours.length > 0) parts.push(`Çalışma saatleri: ${openingHours.join(' | ')}.`);
  parts.push(`Kaynak profil: ${sourceUrl}`);

  return parts.join(' ');
}

// ============= BACKFALL-SPECIFIC LOGIC =============

/**
 * Parse doctor profile from HTML
 */
async function parseDoctorProfile(profileUrl) {
  const html = await fetchHtml(profileUrl);
  const $ = load(html);
  const bodyLines = splitLines($('body').text());

  const displayName = normalizeWhitespace($('h1').first().text());
  if (!displayName) return null;

  const specialties = [
    ...new Set(
      $('a[href*="/fachgebiete/"]')
        .map((_, element) => normalizeWhitespace($(element).text()))
        .get()
        .filter(Boolean)
    ),
  ];

  const mapsLink = $('a[href*="maps.google"]').first();
  const mapsQueryAddress = extractMapsQuery(mapsLink.attr('href') || '');
  const address =
    mapsQueryAddress ||
    normalizeWhitespace(mapsLink.text()) ||
    extractLineAfter(bodyLines, 'Karte & Anfahrt', (value) => value.length > 5);
  const city = extractCityFromAddress(address);

  const phoneLink = $('a[href^="tel:"]').first();
  const phoneRaw =
    normalizeWhitespace(phoneLink.text()) ||
    extractLineAfter(bodyLines, 'Telefon', (value) => looksLikePhone(value));

  const title = extractProfileTitle(bodyLines, displayName, specialties);
  const openingHours = extractOpeningHours(bodyLines);

  if (!city) {
    console.warn(`[skip] city not found for ${profileUrl}`);
    return null;
  }

  return {
    type: 'doctor',
    display_name: displayName,
    city,
    address: address || null,
    phone: normalizePhone(phoneRaw) || phoneRaw || null,
    website: profileUrl,
    languages: ['de', 'tr'],
    notes_public: buildNotes({
      sourceUrl: profileUrl,
      title,
      specialties,
      openingHours,
    }),
    status: 'active',
    google_maps_url: mapsLink.attr('href') || null,
  };
}

/**
 * Fetch existing doctors with all relevant fields for backfill
 */
async function fetchExistingDoctors() {
  const { data, error } = await supabase
    .from('providers')
    .select('id, display_name, city, address, phone, website, google_maps_url, notes_public')
    .eq('type', 'doctor');

  if (error) throw error;

  // Map by dedupe key for quick lookup
  const doctorMap = new Map();
  for (const row of data || []) {
    const key = `${normalizeNameKey(row.display_name)}|${normalizeCityKey(row.city)}`;
    // Only keep first match to avoid duplicates
    if (!doctorMap.has(key)) {
      doctorMap.set(key, row);
    }
  }

  return doctorMap;
}

/**
 * Determine what fields need updating
 * Only update if: field is currently null/empty AND new value is better
 */
function calculateUpdate(existing, parsed) {
  const updates = {};
  const fieldsUpdated = [];

  // Phone: only update if existing is empty and parsed has value
  if (!existing.phone && parsed.phone) {
    updates.phone = parsed.phone;
    fieldsUpdated.push('phone');
  }

  // Address: only update if existing is empty and parsed has value
  if (!existing.address && parsed.address) {
    updates.address = parsed.address;
    fieldsUpdated.push('address');
  }

  // Website: only update if existing is empty
  if (!existing.website && parsed.website) {
    updates.website = parsed.website;
    fieldsUpdated.push('website');
  }

  // Google Maps URL: only update if existing is empty
  if (!existing.google_maps_url && parsed.google_maps_url) {
    updates.google_maps_url = parsed.google_maps_url;
    fieldsUpdated.push('google_maps_url');
  }

  // Notes: append if existing is empty, otherwise keep existing
  if (!existing.notes_public && parsed.notes_public) {
    updates.notes_public = parsed.notes_public;
    fieldsUpdated.push('notes_public');
  }

  return { updates, fieldsUpdated };
}

/**
 * Get before/after statistics for doctors
 */
async function getDoctorStats() {
  const { data, error } = await supabase
    .from('providers')
    .select('phone, address')
    .eq('type', 'doctor');

  if (error) throw error;

  const total = data?.length || 0;
  const withPhone = data?.filter((d) => d.phone).length || 0;
  const withAddress = data?.filter((d) => d.address).length || 0;

  return { total, withPhone, withAddress };
}

function chunkArray(items, size) {
  const chunks = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

// ============= MAIN BACKFALL LOGIC =============

async function main() {
  console.log('========================================');
  console.log('Tuerkische Aerzte Backfill Script');
  console.log('========================================');
  console.log(`Mode: ${applyMode ? 'APPLY' : previewMode ? 'PREVIEW' : 'DRY-RUN'}`);
  console.log(`Max Pages: ${maxPages}`);
  console.log(`Limit: ${limit || 'none'}`);
  console.log('');

  // Get before stats
  const statsBefore = await getDoctorStats();
  console.log('[stats] BEFORE:');
  console.log(`  Total doctors: ${statsBefore.total}`);
  console.log(`  With phone: ${statsBefore.withPhone} (${Math.round((statsBefore.withPhone / statsBefore.total) * 100)}%)`);
  console.log(`  With address: ${statsBefore.withAddress} (${Math.round((statsBefore.withAddress / statsBefore.total) * 100)}%)`);
  console.log('');

  // Collect profile URLs
  const profileUrls = await collectProfileUrls();
  const limitedUrls = limit > 0 ? profileUrls.slice(0, limit) : profileUrls;
  console.log(`[scan] Total profile URLs: ${profileUrls.length}`);
  console.log(`[scan] Processing: ${limitedUrls.length}`);
  console.log('');

  // Fetch existing doctors
  const existingDoctors = await fetchExistingDoctors();
  console.log(`[db] Existing doctors in DB: ${existingDoctors.size}`);
  console.log('');

  // Process profiles
  const updates = [];
  const newRecords = [];
  const skippedNoChange = [];
  const parseErrors = [];
  const stats = {
    phoneFound: 0,
    addressFound: 0,
    websiteFound: 0,
    mapsFound: 0,
  };

  for (const profileUrl of limitedUrls) {
    try {
      const parsed = await parseDoctorProfile(profileUrl);
      if (!parsed) continue;

      const dedupeKey = `${normalizeNameKey(parsed.display_name)}|${normalizeCityKey(parsed.city)}`;
      const existing = existingDoctors.get(dedupeKey);

      if (existing) {
        // Check what needs updating
        const { updates: fieldsToUpdate, fieldsUpdated } = calculateUpdate(existing, parsed);

        if (Object.keys(fieldsToUpdate).length > 0) {
          updates.push({
            id: existing.id,
            display_name: existing.display_name,
            city: existing.city,
            updates: fieldsToUpdate,
            fieldsUpdated,
          });

          // Track stats
          if (fieldsToUpdate.phone) stats.phoneFound++;
          if (fieldsToUpdate.address) stats.addressFound++;
          if (fieldsToUpdate.website) stats.websiteFound++;
          if (fieldsToUpdate.google_maps_url) stats.mapsFound++;

          console.log(`[update] ${existing.display_name} (${existing.city}) -> ${fieldsUpdated.join(', ')}`);
        } else {
          skippedNoChange.push(`${parsed.display_name} (${parsed.city})`);
        }
      } else {
        // New record
        newRecords.push(parsed);
        stats.phoneFound += parsed.phone ? 1 : 0;
        stats.addressFound += parsed.address ? 1 : 0;
        console.log(`[new] ${parsed.display_name} (${parsed.city})`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      parseErrors.push({ profileUrl, message });
      console.warn(`[error] ${profileUrl} -> ${message}`);
    }
  }

  // Summary
  console.log('');
  console.log('========================================');
  console.log('SUMMARY');
  console.log('========================================');
  console.log(`Profiles scanned: ${limitedUrls.length}`);
  console.log(`Parse errors: ${parseErrors.length}`);
  console.log('');
  console.log(`Existing records to update: ${updates.length}`);
  console.log(`  - Phone additions: ${stats.phoneFound}`);
  console.log(`  - Address additions: ${stats.addressFound}`);
  console.log(`  - Website additions: ${stats.websiteFound}`);
  console.log(`  - Google Maps additions: ${stats.mapsFound}`);
  console.log('');
  console.log(`New records to insert: ${newRecords.length}`);
  console.log(`Skipped (no change needed): ${skippedNoChange.length}`);
  console.log('');

  // Preview mode - show sample updates
  if (previewMode && !applyMode) {
    console.log('========================================');
    console.log('UPDATE PREVIEW (first 10)');
    console.log('========================================');
    for (const update of updates.slice(0, 10)) {
      console.log(`\n[${update.id}] ${update.display_name} (${update.city})`);
      console.log('  Fields to update:', update.fieldsUpdated);
      console.log('  New values:', JSON.stringify(update.updates, null, 2).split('\n').join('\n  '));
    }

    if (updates.length > 10) {
      console.log(`\n... and ${updates.length - 10} more updates`);
    }
    return;
  }

  // Dry-run mode - just show summary
  if (!applyMode) {
    console.log('========================================');
    console.log('DRY-RUN COMPLETE');
    console.log('========================================');
    console.log('Run with --apply to execute updates');
    console.log('Run with --preview to see update details');
    return;
  }

  // Apply mode - execute updates
  console.log('========================================');
  console.log('APPLYING CHANGES');
  console.log('========================================');

  // Apply updates
  let updateCount = 0;
  for (const update of updates) {
    const { error } = await supabase
      .from('providers')
      .update(update.updates)
      .eq('id', update.id);

    if (error) {
      console.error(`[error] Failed to update ${update.display_name}:`, error.message);
    } else {
      updateCount++;
    }
  }
  console.log(`[apply] Updated ${updateCount}/${updates.length} existing records`);

  // Insert new records
  if (newRecords.length > 0) {
    for (const batch of chunkArray(newRecords, DEFAULT_BATCH_SIZE)) {
      const { error } = await supabase.from('providers').insert(batch);
      if (error) throw error;
      console.log(`[apply] Inserted batch of ${batch.length} new records`);
    }
  }

  // Get after stats
  const statsAfter = await getDoctorStats();
  console.log('');
  console.log('========================================');
  console.log('RESULTS');
  console.log('========================================');
  console.log('[stats] AFTER:');
  console.log(`  Total doctors: ${statsAfter.total}`);
  console.log(`  With phone: ${statsAfter.withPhone} (${Math.round((statsAfter.withPhone / statsAfter.total) * 100)}%)`);
  console.log(`  With address: ${statsAfter.withAddress} (${Math.round((statsAfter.withAddress / statsAfter.total) * 100)}%)`);
  console.log('');
  console.log('[stats] IMPROVEMENT:');
  console.log(`  Phone: +${statsAfter.withPhone - statsBefore.withPhone}`);
  console.log(`  Address: +${statsAfter.withAddress - statsBefore.withAddress}`);
  console.log('');

  if (parseErrors.length > 0) {
    console.log('========================================');
    console.log('PARSE ERRORS');
    console.log('========================================');
    for (const error of parseErrors.slice(0, 20)) {
      console.log(`  ${error.profileUrl}: ${error.message}`);
    }
    if (parseErrors.length > 20) {
      console.log(`  ... and ${parseErrors.length - 20} more errors`);
    }
  }
}

main().catch((error) => {
  console.error('[fatal]', error);
  process.exit(1);
});
