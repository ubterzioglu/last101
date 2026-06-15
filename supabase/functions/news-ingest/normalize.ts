import type { FeedItemInput } from './adapters/rss.ts'

export interface NewsSourceLike {
  id: string
  name: string
  default_category: string
  homepage_url?: string | null
}

export interface NormalizedNewsItem {
  externalId: string
  canonicalUrl: string
  title: string
  description: string
  imageUrl: string
  publishedAt: string | null
  sourceDomain: string
  sourceName: string
  category: string
  rawPayload: Record<string, unknown>
}

const TRACKING_PARAMS = new Set([
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'fbclid',
  'gclid',
])

export function canonicalizeUrl(value: string, homepageUrl?: string | null): string {
  const fallback = homepageUrl || 'https://almanya101.de'
  try {
    const parsed = new URL(value, fallback)
    TRACKING_PARAMS.forEach((param) => parsed.searchParams.delete(param))
    parsed.hash = ''
    return parsed.toString()
  } catch {
    return value.trim()
  }
}

function normalizeText(value: string): string {
  return value
    .replace(/<!\[CDATA\[|\]\]>/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function normalizeFeedItem(item: FeedItemInput, source: NewsSourceLike): NormalizedNewsItem {
  const canonicalUrl = canonicalizeUrl(item.link, source.homepage_url)
  const sourceDomain = (() => {
    try {
      return new URL(canonicalUrl).hostname.toLowerCase()
    } catch {
      return 'unknown'
    }
  })()

  return {
    externalId: item.externalId || canonicalUrl,
    canonicalUrl,
    title: normalizeText(item.title || 'Başlıksız haber'),
    description: normalizeText(item.description || ''),
    imageUrl: item.imageUrl || '',
    publishedAt: item.publishedAt || null,
    sourceDomain,
    sourceName: source.name,
    category: source.default_category,
    rawPayload: item.rawPayload,
  }
}
