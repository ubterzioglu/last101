import nextEnv from '@next/env';
import { createClient } from '@supabase/supabase-js';
import { load } from 'cheerio';

const SOURCE_BASE_URL = 'https://tuerkischeaerzte.de';
const LISTING_BASE_URL = `${SOURCE_BASE_URL}/aerzte/`;
const DEFAULT_MAX_PAGES = 60;
const DEFAULT_BATCH_SIZE = 50;
const USER_AGENT =
  'Mozilla/5.0 (compatible; almanya101-import-bot/1.0; +https://almanya101.com)';
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

const applyMode = process.argv.includes('--apply');
const maxPages = Number(getArgValue('--max-pages') || DEFAULT_MAX_PAGES);
const limit = Number(getArgValue('--limit') || 0);

function getArgValue(flag) {
  const index = process.argv.indexOf(flag);
  if (index === -1) return '';
  return process.argv[index + 1] || '';
}

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

async function fetchExistingDoctors() {
  const { data, error } = await supabase
    .from('providers')
    .select('id, display_name, city')
    .eq('type', 'doctor');

  if (error) throw error;

  const keys = new Set();
  for (const row of data || []) {
    const key = `${normalizeNameKey(row.display_name)}|${normalizeCityKey(row.city)}`;
    keys.add(key);
  }

  return keys;
}

function chunkArray(items, size) {
  const chunks = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

async function main() {
  console.log(`[start] mode=${applyMode ? 'apply' : 'dry-run'} maxPages=${maxPages}`);

  const profileUrls = await collectProfileUrls();
  const limitedUrls = limit > 0 ? profileUrls.slice(0, limit) : profileUrls;
  console.log(`[scan] total profile urls=${profileUrls.length} processing=${limitedUrls.length}`);

  const existingDoctorKeys = await fetchExistingDoctors();
  const newRows = [];
  const skippedExisting = [];
  const parseErrors = [];

  for (const profileUrl of limitedUrls) {
    try {
      const doctor = await parseDoctorProfile(profileUrl);
      if (!doctor) continue;

      const dedupeKey = `${normalizeNameKey(doctor.display_name)}|${normalizeCityKey(doctor.city)}`;
      if (existingDoctorKeys.has(dedupeKey)) {
        skippedExisting.push(`${doctor.display_name} (${doctor.city})`);
        continue;
      }

      existingDoctorKeys.add(dedupeKey);
      newRows.push(doctor);
      console.log(`[queue] ${doctor.display_name} -> ${doctor.city}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      parseErrors.push({ profileUrl, message });
      console.warn(`[error] ${profileUrl} -> ${message}`);
    }
  }

  console.log(`[result] new=${newRows.length} skipped_existing=${skippedExisting.length} errors=${parseErrors.length}`);

  if (!applyMode) {
    console.log(JSON.stringify({
      preview: newRows.slice(0, 5),
      skippedExisting: skippedExisting.slice(0, 10),
      errors: parseErrors.slice(0, 10),
    }, null, 2));
    return;
  }

  if (newRows.length === 0) {
    console.log('[apply] no new rows to insert');
    return;
  }

  for (const batch of chunkArray(newRows, DEFAULT_BATCH_SIZE)) {
    const { error } = await supabase.from('providers').insert(batch);
    if (error) throw error;
    console.log(`[apply] inserted batch=${batch.length}`);
  }

  console.log(`[done] inserted=${newRows.length}`);
}

main().catch((error) => {
  console.error('[fatal]', error);
  process.exit(1);
});
