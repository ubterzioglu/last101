/**
 * Backfill script for avukat24.de lawyer data
 *
 * Purpose: Update existing lawyer records with missing phone/address/website/google_maps_url data
 * instead of skipping them like the original import script.
 *
 * Usage:
 *   node scripts/backfill-avukat24.mjs                    # dry-run (default)
 *   node scripts/backfill-avukat24.mjs --preview          # show update preview
 *   node scripts/backfill-avukat24.mjs --apply            # apply updates
 *   node scripts/backfill-avukat24.mjs --limit 5            # only process 5 profiles
 *   node scripts/backfill-avukat24.mjs --max-pages 3            # only process first 3 pages
 */

import '@next/env'
import { createClient } from '@supabase/supabase-js'
import { load } from 'cheerio'
import { decode } from 'html-entities'

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
const API_BASE_URL = 'https://avukat24.de/wp-json/wp/v2/avukat'
const DEFAULT_PAGE_SIZE = 100
const BATCH_SIZE = 50

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Parse CLI arguments
const args = process.argv.slice(2)
const getArgValue = (flag) => {
  const index = args.findIndex((arg) => arg === flag || arg.startsWith(`${flag}=`))
  if (index === -1) return null
  const arg = args[index]
  if (arg.includes('=')) return arg.split('=')[1]
  return args[index + 1] || null
}

const limit = Number(getArgValue('--limit') || 0)
const maxPages = Number(getArgValue('--max-pages') || 0)
const previewMode = getArgValue('--preview') !== null
const applyMode = getArgValue('--apply') !== null

// Utility functions
function normalizeWhitespace(value) {
  if (!value) return ''
  return value.replace(/\s+/g, ' ').replace(/\s+,/g, ',').trim()
}

function normalizeNameKey(name) {
  return normalizeWhitespace(name)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .substring(0, 50)
}

function normalizeCityKey(city) {
  return normalizeWhitespace(city)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .substring(0, 30)
}

function normalizePhone(phone) {
  if (!phone) return ''
  let cleaned = phone.replace(/[\s\-\(\)\./]/g, '')
  if (cleaned.startsWith('00')) {
    cleaned = '+' + cleaned.substring(2)
  } else if (cleaned.startsWith('0') && !cleaned.startsWith('00')) {
    cleaned = '+49' + cleaned.substring(1)
  }
  return cleaned
}

function normalizeWebsite(raw) {
  if (!raw) return ''
  if (/^https?:\/\//i.test(raw)) return raw
  if (/^www\./i.test(raw)) return `https://${raw}`
  return raw
}

function mapLanguage(rawLanguage) {
  const value = normalizeWhitespace(rawLanguage)
  if (!value) return ''
  if (value.includes('turk')) return 'tr'
  if (value.includes('deutsch') || value.includes('almanca')) return 'de'
  if (value.includes('engl')) return 'en'
  if (value.includes('franz')) return 'fr'
  if (value.includes('arab')) return 'ar'
  return value
}

function unique(values) {
  return [...new Set(values.filter(Boolean))]
}

function extractCityFromAddress(address) {
  const normalized = normalizeWhitespace(address)
  if (!normalized) return ''

  const postalMatch = normalized.match(/\b\d{5}\s+([^,]+)(?:,|$)/)
  if (postalMatch) {
    return normalizeWhitespace(postalMatch[1])
  }

  const parts = normalized
    .split(',')
    .map((part) => normalizeWhitespace(part))
    .filter(Boolean)

  if (parts.length >= 2) {
    const last = parts[parts.length - 1]
    if (/^(deutschland|germany)$/i.test(last)) {
      return normalizeWhitespace(parts[parts.length - 2] || '')
    }
    return last
  }

  return ''
}

function extractProfileTitle(rawHeading, displayName) {
  const heading = normalizeWhitespace(rawHeading)
  if (!heading) return ''

  let title = heading.replace(/^Avukat\s*/i, '')
  if (displayName) {
    const safeName = displayName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    title = title.replace(new RegExp(`\\s*${safeName}\\s*$`, 'i'), '')
  }

  return normalizeWhitespace(title)
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      'user-agent': USER_AGENT,
      accept: 'application/json,text/plain,*/*',
    },
  })

  if (!response.ok) {
    throw new Error(`Fetch failed (${response.status}) for ${url}`)
  }

  return response.json()
}

async function fetchHtml(url) {
  const response = await fetch(url, {
    headers: {
      'user-agent': USER_AGENT,
      accept: 'text/html,application/xhtml+xml',
    },
  })

  if (!response.ok) {
    throw new Error(`Fetch failed (${response.status}) for ${url}`)
  }

  return response.text()
}

async function fetchAllLawyerEntries() {
  const firstResponse = await fetch(`${API_BASE_URL}?per_page=${DEFAULT_PAGE_SIZE}&page=1`, {
    headers: {
      'user-agent': USER_AGENT,
      accept: 'application/json,text/plain,*/*',
    },
  })

  if (!firstResponse.ok) {
    throw new Error(`Fetch failed (${firstResponse.status}) for first avukat24 page`)
  }

  const totalPages = Number(firstResponse.headers.get('x-wp-totalpages') || '1')
  const firstPageItems = await firstResponse.json()
  const allItems = [...firstPageItems]
  const pagesToFetch =
    limit > 0 ? Math.min(totalPages, Math.ceil(limit / DEFAULT_PAGE_SIZE)) : totalPages

  console.log(`[scan] api page 1: ${firstPageItems.length} profiles`)

  for (let page = 2; page <= pagesToFetch; page += 1) {
    const items = await fetchJson(`${API_BASE_URL}?per_page=${DEFAULT_PAGE_SIZE}&page=${page}`)
    allItems.push(...items)
    console.log(`[scan] api page ${page}: ${items.length} profiles`)
  }

  return allItems
}

function getContactWidget($) {
  return $('.widget-boxed')
    .filter((_, element) =>
      normalizeWhitespace($(element).find('.widget-boxed-header').first().text()).includes('kontak')
    )
    .first()
}

function getDetailWrapperByHeader($, expectedText) {
  return $('.detail-wrapper')
    .filter((_, element) =>
      normalizeWhitespace($(element).find('.detail-wrapper-header').first().text()).includes(expectedText)
    )
    .first()
}

function buildNotes({ sourceUrl, title, specialties, languages, emails, extraPhones, openingHours }) {
  const parts = []

  if (title) parts.push(`Ünvan: ${title}`)
  if (specialties && specialties.length > 0) parts.push(`Uzmanlık: ${specialties.join(', ')}`)
  if (languages && languages.length > 0) parts.push(`Diller: ${languages.join(', ')}`)
  if (emails && emails.length > 0) parts.push(`E-posta: ${emails.join(', ')}`)
  if (extraPhones && extraPhones.length > 0) parts.push(`Ek Telefon: ${extraPhones.join(', ')}`)
  if (openingHours) parts.push(`Çalışma Saatleri: ${openingHours}`)

  parts.push(`Kaynak: ${sourceUrl}`)

  return parts.join('\n')
}

async function parseLawyerProfile(entry) {
  const profileUrl = entry.link
  const html = await fetchHtml(profileUrl)
  const $ = load(html)

  const displayName =
    normalizeWhitespace(decode(entry.title?.rendered || '')) ||
    normalizeWhitespace($('.listing-title-bar h1').first().text().replace(/^Avukat\s*/i, ''))

  if (!displayName) {
    return null
  }

  const headingText = normalizeWhitespace($('.listing-title-bar h1').first().text())
  const title = extractProfileTitle(headingText, displayName)
  const address = normalizeWhitespace($('.listing-address').first().text())
  const contactWidget = getContactWidget($)
  const cityFromContact = normalizeWhitespace(contactWidget.find('.side-list li').first().text())
  const city = cityFromContact || extractCityFromAddress(address)

  if (!city) {
    console.warn(`[skip] city not found for ${profileUrl}`)
    return null
  }

  // Extract phone links
  const phoneLinks = unique(
    contactWidget
      .find('a[href^="tel:"]')
      .map((_, el) => normalizePhone($(el).attr('href').replace('tel:', '')))
      .get()
  )

  // Extract email links
  const emailLinks = unique(
    contactWidget
      .find('a[href^="mailto:"]')
      .map((_, el) => normalizeWhitespace($(el).attr('href').replace('mailto:', '')))
      .get()
  )

  // Extract website links
  const websiteLinks = unique(
    contactWidget
      .find('a[href^="http"]')
      .filter((_, el) => {
        const href = $(el).attr('href')
        return href && !href.includes('mailto:') && !href.includes('tel:')
      })
      .map((_, el) => normalizeWebsite($(el).attr('href')))
      .get()
  )

  // Extract specialties
  const specialtiesWidget = getDetailWrapperByHeader($, 'uzmanlık')
  const specialties = specialtiesWidget
    ? unique(
        specialtiesWidget
          .find('.side-list li')
          .map((_, el) => normalizeWhitespace($(el).text()))
          .get()
      )
      : []

  // Extract languages
  const languagesWidget = getDetailWrapperByHeader($, 'dil')
  const rawLanguages = languagesWidget
    ? unique(
        languagesWidget
          .find('.side-list li')
          .map((_, el) => normalizeWhitespace($(el).text()))
          .get()
      )
      : []
  const languages = rawLanguages.map(mapLanguage).filter(Boolean)

  // Extract opening hours
  const hoursWidget = getDetailWrapperByHeader($, 'çalışma saatleri')
  const openingHours = hoursWidget
    ? normalizeWhitespace(hoursWidget.find('.side-list').first().text())
    : ''

  // Extract Google Maps URL
  const googleMapsUrl = normalizeWhitespace(
    $('iframe[src*="google.com/maps/embed"], iframe[src*="google.de/maps/embed"]')
      .first()
      .attr('src')
  ) || null

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
  }
}

async function fetchExistingLawyers() {
  const { data, error } = await supabase
    .from('providers')
    .select('id, display_name, city, phone, address, website, google_maps_url, notes_public')
    .eq('type', 'lawyer')

  if (error) throw error

  const lawyerMap = new Map()
  for (const row of data || []) {
    const key = `${normalizeNameKey(row.display_name)}|${normalizeCityKey(row.city)}`
    if (!lawyerMap.has(key)) {
      lawyerMap.set(key, row)
    }
  }

  return lawyerMap
}

async function calculateUpdate(existing, parsed) {
  const updates = {}
  const fieldsUpdated = []

  // Phone: only update if existing is empty and parsed has value
  if (!existing.phone && parsed.phone) {
    updates.phone = parsed.phone
    fieldsUpdated.push('phone')
  }

  // Address: only update if existing is empty and parsed has value
  if (!existing.address && parsed.address) {
    updates.address = parsed.address
    fieldsUpdated.push('address')
  }

  // Website: only update if existing is empty
  if (!existing.website && parsed.website) {
    updates.website = parsed.website
    fieldsUpdated.push('website')
  }

  // Google Maps URL: only update if existing is empty
  if (!existing.google_maps_url && parsed.google_maps_url) {
    updates.google_maps_url = parsed.google_maps_url
    fieldsUpdated.push('google_maps_url')
  }

  // Notes: append if existing is empty, otherwise keep existing
  if (!existing.notes_public && parsed.notes_public) {
    updates.notes_public = parsed.notes_public
    fieldsUpdated.push('notes_public')
  }

  return { updates, fieldsUpdated }
}

async function getLawyerStats() {
  const { data, error } = await supabase
    .from('providers')
    .select('id, display_name, city, phone, address, website, google_maps_url, notes_public')
    .eq('type', 'lawyer')

  if (error) throw error

  const total = data?.length || 0
  const withPhone = data?.filter((d) => d.phone).length || 0
  const withAddress = data?.filter((d) => d.address).length || 0
  const withWebsite = data?.filter((d) => d.website).length || 0
  const withMaps = data?.filter((d) => d.google_maps_url).length || 0
  const withNotes = data?.filter((d) => d.notes_public).length || 0

  return { total, withPhone, withAddress, withWebsite, withMaps, withNotes }
}

function chunkArray(items, size) {
  const chunks = []
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size))
  }
  return chunks
}

async function main() {
  console.log('========================================')
  console.log('Avukat24 Lawyer Backfill Script')
  console.log('========================================')
  console.log(`Mode: ${applyMode ? 'APPLY' : previewMode ? 'PREVIEW' : 'DRY-RUN'}`)
  console.log(`max pages: ${maxPages}`)
  console.log(`limit: ${limit || 'none'}`)
  console.log('')

  // Get before stats
  const statsBefore = await getLawyerStats()
  console.log('[stats] BEFORE:')
  console.log(`  Total lawyers: ${statsBefore.total}`)
  console.log(`  With phone: ${statsBefore.withPhone} (${Math.round((statsBefore.withPhone / statsBefore.total) * 100)}%)`)
  console.log(`  With address: ${statsBefore.withAddress} (${Math.round((statsBefore.withAddress / statsBefore.total) * 100)}%)`)
    console.log('')

  // Fetch all lawyer entries from API
  const allEntries = await fetchAllLawyerEntries()
  const limitedEntries = limit > 0 ? allEntries.slice(0, limit) : allEntries
    console.log(`[scan] total profiles: ${allEntries.length} processing: ${limitedEntries.length}`)
    console.log('')

  // Fetch existing lawyers
  const existingLawyers = await fetchExistingLawyers()
    console.log(`[db] existing lawyers in DB: ${existingLawyers.size}`)
    console.log('')

  // Process each profile
  let processedCount = 0
  let matchedCount = 0
  let updatedCount = 0
  let noChangeCount = 0
    const updatesToApply = []

    for (const entry of limitedEntries) {
      processedCount += 1
      const parsed = await parseLawyerProfile(entry)

      if (!parsed) {
        console.warn(`[skip] parse failed for ${entry.link}`)
        continue
      }

      // Match by dedupe key
      const key = `${normalizeNameKey(parsed.display_name)}|${normalizeCityKey(parsed.city)}`
      const existing = existingLawyers.get(key)

      if (!existing) {
        console.warn(`[skip] no match for ${parsed.display_name} in ${parsed.city}`)
        continue
      }

      matchedCount += 1

      // Calculate updates
      const { updates, fieldsUpdated } = await calculateUpdate(existing, parsed)

      if (Object.keys(updates).length === 0) {
        noChangeCount += 1
        console.log(`[no-change] ${parsed.display_name} | ${parsed.city}`)
        continue
      }

      updatedCount += 1

      if (previewMode) {
        console.log(`[preview] ${parsed.display_name} | ${parsed.city}`)
        console.log(`  Fields to update: ${fieldsUpdated.join(', ')}`)
        for (const field of fieldsUpdated) {
          console.log(`    ${field}: "${existing[field] || ''}" -> "${parsed[field] || ''}"`)
        }
      } else {
        console.log(`[update] ${parsed.display_name} | ${parsed.city} - fields: ${fieldsUpdated.join(', ')}`)
      }

      updatesToApply.push({ id: existing.id, updates, fields: fieldsUpdated })
    }

    // Summary
    console.log('')
    console.log('[summary]')
    console.log(`  Processed: ${processedCount}`)
    console.log(`  Matched: ${matchedCount}`)
    console.log(`  Updates needed: ${updatedCount}`)
    console.log(`  No change: ${noChangeCount}`)
    console.log('')

    // Apply updates
    if (applyMode && updatesToApply.length > 0) {
      console.log(`[apply] Applying ${updatesToApply.length} updates...`)

      const chunks = chunkArray(updatesToApply, BATCH_SIZE)
      let successCount = 0

      for (const chunk of chunks) {
        console.log(`[apply] batch ${chunk.length} updates...`)

        for (const { id, updates } of chunk) {
          const { error } = await supabase
            .from('providers')
            .update(updates)
            .eq('id', id)
            .eq('type', 'lawyer')

          if (error) {
            console.error(`[apply] failed for id ${id}: ${error.message}`)
            continue
          }

          successCount += 1
        }
      }

      console.log(`[apply] ${successCount} updates applied`)
      console.log('')

      // Get after stats
      const statsAfter = await getLawyerStats()
      console.log('[stats] AFTER:')
      console.log(`  Total lawyers: ${statsAfter.total}`)
      console.log(`  With phone: ${statsAfter.withPhone} (${Math.round((statsAfter.withPhone / statsAfter.total) * 100)}%)`)
      console.log(`  With address: ${statsAfter.withAddress} (${Math.round((statsAfter.withAddress / statsAfter.total) * 100)}%)`)
      console.log('')
    } else {
      console.log('No updates needed - all existing lawyer records are complete')
    }

  console.log('========================================')
  console.log('Script completed')
  console.log('========================================')
}

main().catch((error) => {
  console.error('Error:', error.message)
  process.exit(1)
})
