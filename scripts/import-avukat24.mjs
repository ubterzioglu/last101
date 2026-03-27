import nextEnv from '@next/env';
import { createClient } from '@supabase/supabase-js';
import { load } from 'cheerio';

const SOURCE_BASE_URL = 'https://avukat24.de';
const API_BASE_URL = `${SOURCE_BASE_URL}/wp-json/wp/v2/avukat`;
const USER_AGENT =
  'Mozilla/5.0 (compatible; almanya101-import-bot/1.0; +https://almanya101.com)';
const DEFAULT_BATCH_SIZE = 50;
const DEFAULT_PAGE_SIZE = 100;

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

function normalizeSearchText(value) {
  return normalizeWhitespace(value)
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i');
}

function decodeHtml(value) {
  if (!value) return '';
  return load(`<div>${value}</div>`)('div').text();
}

function normalizeNameKey(value) {
  return normalizeWhitespace(value).toLocaleLowerCase('tr-TR');
}

function normalizeCityKey(value) {
  return normalizeWhitespace(value).toLocaleLowerCase('tr-TR');
}

function normalizePhone(value) {
  const raw = normalizeWhitespace(value).replace(/^tel:/i, '');
  if (!raw) return '';
  const cleaned = raw.replace(/[^\d+]/g, '');
  return cleaned.startsWith('00') ? `+${cleaned.slice(2)}` : cleaned;
}

function normalizeWebsiteUrl(value) {
  const raw = normalizeWhitespace(value);
  if (!raw) return '';
  if (/^https?:\/\//i.test(raw)) return raw;
  if (/^www\./i.test(raw)) return `https://${raw}`;
  return raw;
}

function mapLanguage(rawLanguage) {
  const value = normalizeSearchText(rawLanguage);
  if (!value) return '';
  if (value.includes('turk')) return 'tr';
  if (value.includes('deutsch') || value.includes('almanca')) return 'de';
  if (value.includes('engl')) return 'en';
  if (value.includes('franz')) return 'fr';
  if (value.includes('arab')) return 'ar';
  return value;
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function extractCityFromAddress(address) {
  const normalized = normalizeWhitespace(address);
  if (!normalized) return '';

  const postalMatch = normalized.match(/\b\d{5}\s+([^,]+)(?:,|$)/);
  if (postalMatch) {
    return normalizeWhitespace(postalMatch[1]);
  }

  const parts = normalized
    .split(',')
    .map((part) => normalizeWhitespace(part))
    .filter(Boolean);

  if (parts.length >= 2) {
    const last = parts[parts.length - 1];
    if (/^(deutschland|germany)$/i.test(last)) {
      return normalizeWhitespace(parts[parts.length - 2] || '');
    }
    return last;
  }

  return '';
}

function extractProfileTitle(rawHeading, displayName) {
  const heading = normalizeWhitespace(rawHeading);
  if (!heading) return '';

  let title = heading.replace(/^Avukat\s*/i, '');
  if (displayName) {
    const safeName = displayName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    title = title.replace(new RegExp(`\\s*${safeName}\\s*$`, 'i'), '');
  }

  return normalizeWhitespace(title);
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      'user-agent': USER_AGENT,
      accept: 'application/json,text/plain,*/*',
    },
  });

  if (!response.ok) {
    throw new Error(`Fetch failed (${response.status}) for ${url}`);
  }

  return response.json();
}

async function fetchHtml(url) {
  const response = await fetch(url, {
    headers: {
      'user-agent': USER_AGENT,
      accept: 'text/html,application/xhtml+xml',
    },
  });

  if (!response.ok) {
    throw new Error(`Fetch failed (${response.status}) for ${url}`);
  }

  return response.text();
}

async function fetchAllLawyerEntries() {
  const firstResponse = await fetch(`${API_BASE_URL}?per_page=${DEFAULT_PAGE_SIZE}&page=1`, {
    headers: {
      'user-agent': USER_AGENT,
      accept: 'application/json,text/plain,*/*',
    },
  });

  if (!firstResponse.ok) {
    throw new Error(`Fetch failed (${firstResponse.status}) for first avukat24 page`);
  }

  const totalPages = Number(firstResponse.headers.get('x-wp-totalpages') || '1');
  const firstPageItems = await firstResponse.json();
  const allItems = [...firstPageItems];
  const pagesToFetch =
    limit > 0 ? Math.min(totalPages, Math.ceil(limit / DEFAULT_PAGE_SIZE)) : totalPages;

  console.log(`[scan] api page 1: ${firstPageItems.length} profiles`);

  for (let page = 2; page <= pagesToFetch; page += 1) {
    const items = await fetchJson(`${API_BASE_URL}?per_page=${DEFAULT_PAGE_SIZE}&page=${page}`);
    allItems.push(...items);
    console.log(`[scan] api page ${page}: ${items.length} profiles`);
  }

  return allItems;
}

function buildNotes({
  sourceUrl,
  title,
  specialties,
  languages,
  emails,
  extraPhones,
  openingHours,
}) {
  const parts = ['Avukat24.de kaynagindan aktarildi.'];

  if (title) parts.push(`Unvan: ${title}.`);
  if (specialties.length > 0) parts.push(`Uzmanlik alanlari: ${specialties.join(', ')}.`);
  if (languages.length > 0) parts.push(`Diller: ${languages.join(', ')}.`);
  if (emails.length > 0) parts.push(`E-posta: ${emails.join(', ')}.`);
  if (extraPhones.length > 0) parts.push(`Ek telefonlar: ${extraPhones.join(', ')}.`);
  if (openingHours.length > 0) parts.push(`Calisma saatleri: ${openingHours.join(' | ')}.`);
  parts.push(`Kaynak profil: ${sourceUrl}`);

  return parts.join(' ');
}

function getContactWidget($) {
  return $('.widget-boxed')
    .filter((_, element) =>
      normalizeSearchText($(element).find('.widget-boxed-header').first().text()).includes(
        'iletisim detaylari'
      )
    )
    .first();
}

function getDetailWrapperByHeader($, expectedText) {
  return $('.detail-wrapper')
    .filter((_, element) =>
      normalizeSearchText($(element).find('.detail-wrapper-header').first().text()).includes(
        expectedText
      )
    )
    .first();
}

async function parseLawyerProfile(entry) {
  const profileUrl = entry.link;
  const html = await fetchHtml(profileUrl);
  const $ = load(html);

  const displayName =
    normalizeWhitespace(decodeHtml(entry.title?.rendered || '')) ||
    normalizeWhitespace($('.listing-title-bar h1').first().text().replace(/^Avukat\s*/i, ''));

  if (!displayName) {
    return null;
  }

  const headingText = normalizeWhitespace($('.listing-title-bar h1').first().text());
  const title = extractProfileTitle(headingText, displayName);
  const address = normalizeWhitespace($('.listing-address').first().text());
  const contactWidget = getContactWidget($);
  const cityFromContact = normalizeWhitespace(contactWidget.find('.side-list li').first().text());
  const city = cityFromContact || extractCityFromAddress(address);

  if (!city) {
    console.warn(`[skip] city not found for ${profileUrl}`);
    return null;
  }

  const specialtiesWrapper = getDetailWrapperByHeader($, 'uzmanlik alanlari');
  const specialties = unique(
    specialtiesWrapper
      .find('.detail-check li, .detail-wrapper-body li, .detail-wrapper-body a')
      .map((_, element) => normalizeWhitespace($(element).text()))
      .get()
  );

  const languagesWrapper = getDetailWrapperByHeader($, 'hizmet verilen lisanlar');
  const rawLanguages = unique(
    languagesWrapper
      .find('.detail-check li, .detail-wrapper-body li, .detail-wrapper-body a')
      .map((_, element) => normalizeWhitespace($(element).text()))
      .get()
  );

  const languages = unique(rawLanguages.map(mapLanguage));

  const phoneLinks = unique(
    contactWidget
      .find('a[href^="tel:"]')
      .map((_, element) => {
        const textPhone = normalizePhone($(element).text());
        const hrefPhone = normalizePhone($(element).attr('href') || '');
        return textPhone || hrefPhone;
      })
      .get()
  );

  const emailLinks = unique(
    contactWidget
      .find('a[href^="mailto:"]')
      .map((_, element) => {
        const textEmail = normalizeWhitespace($(element).text());
        const hrefEmail = normalizeWhitespace(
          ($(element).attr('href') || '').replace(/^mailto:/i, '')
        );
        return textEmail || hrefEmail;
      })
      .get()
  );

  const websiteLinks = unique(
    contactWidget
      .find('a[href]')
      .map((_, element) => {
        const href = normalizeWebsiteUrl($(element).attr('href'));
        if (!href || /^tel:|^mailto:/i.test(href)) return '';
        if (/avukat24\.de|inoya\.de/i.test(href)) return '';
        return href;
      })
      .get()
  );

  const openingHoursWidget = $('.widget-boxed')
    .filter((_, element) =>
      normalizeSearchText($(element).find('.widget-boxed-header').first().text()).includes(
        'calisma saatleri'
      )
    )
    .first();

  const openingHours = unique(
    openingHoursWidget
      .find('.widget-boxed-body')
      .text()
      .split(/\r?\n|\|/)
      .map((value) => normalizeWhitespace(value))
      .filter(Boolean)
  );

  const googleMapsUrl =
    normalizeWhitespace(
      $('iframe[src*="google.com/maps/embed"], iframe[src*="google.de/maps/embed"]')
        .first()
        .attr('src')
    ) || null;

  return {
    type: 'lawyer',
    display_name: displayName,
    city,
    address: address || null,
    phone: phoneLinks[0] || null,
    website: websiteLinks[0] || profileUrl,
    languages: languages.length > 0 ? languages : ['tr', 'de'],
    notes_public: buildNotes({
      sourceUrl: profileUrl,
      title,
      specialties,
      languages: rawLanguages,
      emails: emailLinks,
      extraPhones: phoneLinks.slice(1),
      openingHours,
    }),
    status: 'active',
    google_maps_url: googleMapsUrl,
  };
}

async function fetchExistingLawyers() {
  const { data, error } = await supabase
    .from('providers')
    .select('display_name, city')
    .eq('type', 'lawyer');

  if (error) throw error;

  const keys = new Set();
  for (const row of data || []) {
    keys.add(`${normalizeNameKey(row.display_name)}|${normalizeCityKey(row.city)}`);
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
  console.log(`[start] mode=${applyMode ? 'apply' : 'dry-run'}`);

  const allEntries = await fetchAllLawyerEntries();
  const limitedEntries = limit > 0 ? allEntries.slice(0, limit) : allEntries;
  console.log(`[scan] total profiles=${allEntries.length} processing=${limitedEntries.length}`);

  const existingLawyerKeys = await fetchExistingLawyers();
  const newRows = [];
  const skippedExisting = [];
  const parseErrors = [];

  for (const entry of limitedEntries) {
    try {
      const lawyer = await parseLawyerProfile(entry);
      if (!lawyer) continue;

      const dedupeKey = `${normalizeNameKey(lawyer.display_name)}|${normalizeCityKey(lawyer.city)}`;
      if (existingLawyerKeys.has(dedupeKey)) {
        skippedExisting.push(`${lawyer.display_name} (${lawyer.city})`);
        continue;
      }

      existingLawyerKeys.add(dedupeKey);
      newRows.push(lawyer);
      console.log(`[queue] ${lawyer.display_name} -> ${lawyer.city}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      parseErrors.push({ profileUrl: entry.link, message });
      console.warn(`[error] ${entry.link} -> ${message}`);
    }
  }

  console.log(
    `[result] new=${newRows.length} skipped_existing=${skippedExisting.length} errors=${parseErrors.length}`
  );

  if (!applyMode) {
    console.log(
      JSON.stringify(
        {
          preview: newRows.slice(0, 5),
          skippedExisting: skippedExisting.slice(0, 10),
          errors: parseErrors.slice(0, 10),
        },
        null,
        2
      )
    );
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
