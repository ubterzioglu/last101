import type { FeedItemInput } from './rss.ts'
import { validateSourceUrl } from '../source-security.ts'

// GDELT Doc API v2 adaptörü: API key gerektirmeden global haber taraması yapar.
// Türk diasporası / Almanya odaklı sorgular için idealdir.
// corteqsmvp radar-news-scan/adapters/gdelt.ts mantığından uyarlandı.

interface GdeltArticle {
  url?: string
  title?: string
  seendatetime?: string
  domain?: string
  language?: string
  sourcecountry?: string
  socialimage?: string
}

interface GdeltResponse {
  articles?: GdeltArticle[]
}

export interface GdeltConfig {
  query?: string
  mode?: string
  maxrecords?: number
  sort?: string
  timespan?: string
  allowedLanguages?: string
}

const DEFAULT_ENDPOINT = 'https://api.gdeltproject.org/api/v2/doc/doc'

function toIsoFromSeenDate(seen: string): string | null {
  // seendatetime: YYYYMMDDHHMMSS
  if (seen.length < 14) return null
  return `${seen.slice(0, 4)}-${seen.slice(4, 6)}-${seen.slice(6, 8)}T${seen.slice(8, 10)}:${seen.slice(10, 12)}:00Z`
}

export async function fetchGdeltItems(
  endpointUrl: string,
  config: GdeltConfig,
  options: { maxItems: number; timeoutMs: number }
): Promise<FeedItemInput[]> {
  const endpoint = (endpointUrl || '').trim() || DEFAULT_ENDPOINT

  const security = validateSourceUrl(endpoint)
  if (!security.ok) throw new Error(`SSRF engeli: ${security.reason}`)

  const maxRecords = Math.min(Number(config.maxrecords ?? 100) || 100, options.maxItems)
  const params = new URLSearchParams({
    query: config.query ?? 'Turkish diaspora Germany',
    mode: config.mode ?? 'artlist',
    maxrecords: String(maxRecords),
    format: 'json',
    sort: config.sort ?? 'datedesc',
    timespan: config.timespan ?? '1d',
  })

  const url = `${endpoint}?${params.toString()}`

  // GDELT agresif throttle yapar (429) ve bazen bağlantıyı aniden keser.
  // User-Agent zorunlu + 429/ağ hatalarında exponential backoff ile 3 deneme.
  const fetchWithRetry = async (): Promise<Response> => {
    let lastError: unknown
    for (let attempt = 0; attempt < 3; attempt++) {
      if (attempt > 0) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 5000))
      }
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), options.timeoutMs)
      try {
        const res = await fetch(url, {
          signal: controller.signal,
          headers: { 'user-agent': 'almanya101-news-ingest/1.0' },
        })
        clearTimeout(timer)
        if (res.status === 429) {
          lastError = new Error('GDELT HTTP 429 (rate limit)')
          continue
        }
        return res
      } catch (err) {
        clearTimeout(timer)
        lastError = err
      }
    }
    throw lastError instanceof Error ? lastError : new Error(String(lastError))
  }

  const response = await fetchWithRetry()
  if (!response.ok) {
    throw new Error(`GDELT HTTP ${response.status}`)
  }

  const text = await response.text()
  if (text.length > 2 * 1024 * 1024) {
    throw new Error('GDELT yanıtı 2 MB sınırını aştı')
  }

  // GDELT hata durumunda 200 + text/html ile düz mesaj döndürür
  // (ör. "Queries containing OR'd terms must be surrounded by ()").
  const trimmed = text.trim()
  if (!trimmed.startsWith('{')) {
    throw new Error(`GDELT JSON değil: ${trimmed.slice(0, 160)}`)
  }

  let parsed: GdeltResponse
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new Error(`GDELT yanıtı JSON parse edilemedi: ${trimmed.slice(0, 120)}`)
  }

  // Dil güvenlik ağı: query sourcelang taşımasa bile alakasız dilleri ele.
  // config.allowedLanguages verilmemişse filtre uygulanmaz (geri uyumlu).
  const allowedLanguagesRaw = (config.allowedLanguages ?? '').trim()
  const allowedLanguages = allowedLanguagesRaw
    ? new Set(
        allowedLanguagesRaw
          .split(',')
          .map((lang) => lang.trim().toLowerCase())
          .filter(Boolean)
      )
    : null

  const articles = parsed.articles ?? []
  const items: FeedItemInput[] = []

  for (const article of articles.slice(0, options.maxItems)) {
    if (!article.url || !article.title) continue

    // GDELT language alanı "Turkish"/"German"/"English" gibi tam ad döner.
    if (allowedLanguages) {
      const lang = (article.language ?? '').toLowerCase()
      if (lang && !allowedLanguages.has(lang)) continue
    }

    items.push({
      externalId: article.url,
      title: article.title,
      description: '',
      link: article.url,
      imageUrl: article.socialimage ?? '',
      publishedAt: article.seendatetime ? toIsoFromSeenDate(article.seendatetime) : null,
      rawPayload: article as unknown as Record<string, unknown>,
    })
  }

  return items
}
