// Sağlayıcı istemcileri: Tavily (search+extract), SerpAPI (search), Gemini (classify).
// corteqs service-finder/src/providers/*.ts'ten Deno'ya port (tek dosya).
import {
  estimateGeminiCost,
  estimateSerpApiSearchCost,
  estimateTavilyExtractCost,
  estimateTavilySearchCost,
} from './costs.ts'
import { extractDomain } from './dedupe.ts'
import { AuthOrConfigError, ProviderRateLimitError, ProviderTemporaryError } from './errors.ts'
import { CLASSIFIER_RESPONSE_SCHEMA } from './prompts.ts'
import type { RawSearchResult, SearchUsage } from './schemas.ts'

const REQUEST_TIMEOUT_MS = 30_000
const GEMINI_TIMEOUT_MS = 60_000

export interface SearchInput {
  query: string
  locationLabel?: string
  languageCode?: string
  maxResults: number
  searchDepth?: 'basic' | 'advanced'
}

export interface SearchOutput {
  requestId?: string
  results: RawSearchResult[]
  usage: SearchUsage
}

export interface ExtractDoc {
  url: string
  title?: string
  text?: string
}

export interface ExtractOutput {
  docs: ExtractDoc[]
  failedUrls: string[]
  usage: SearchUsage
}

export interface ClassifyUsage {
  inputTokens: number
  outputTokens: number
  estimatedCostUsd: number
  model: string
}

// ---------------------------------------------------------------------------
// Tavily
// ---------------------------------------------------------------------------
const TAVILY_BASE_URL = 'https://api.tavily.com'

async function tavilyPost<T>(apiKey: string, path: string, body: Record<string, unknown>): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${TAVILY_BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })
  } catch (error: unknown) {
    throw new ProviderTemporaryError('tavily', error instanceof Error ? error.message : 'network error')
  }
  if (response.status === 401 || response.status === 403) {
    throw new AuthOrConfigError('Tavily API anahtarı geçersiz veya yetkisiz')
  }
  if (response.status === 429) throw new ProviderRateLimitError('tavily')
  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new ProviderTemporaryError('tavily', `HTTP ${response.status}: ${detail.slice(0, 300)}`)
  }
  return (await response.json()) as T
}

interface TavilySearchResponse {
  results?: Array<{ url: string; title?: string; content?: string }>
  request_id?: string
}
interface TavilyExtractResponse {
  results?: Array<{ url: string; raw_content?: string; title?: string }>
  failed_results?: Array<{ url: string; error?: string }>
}

export async function tavilySearch(apiKey: string, input: SearchInput): Promise<SearchOutput> {
  const depth = input.searchDepth ?? 'basic'
  const payload = await tavilyPost<TavilySearchResponse>(apiKey, '/search', {
    query: input.query,
    search_depth: depth,
    max_results: input.maxResults,
  })
  const usage = estimateTavilySearchCost(depth)
  return {
    requestId: payload.request_id,
    results: (payload.results ?? []).map((r) => ({
      url: r.url,
      title: r.title,
      snippet: r.content,
      domain: extractDomain(r.url),
    })),
    usage: { units: usage.units, estimatedCostUsd: usage.amountUsd, billingUnit: 'tavily_credit' },
  }
}

export async function tavilyExtract(
  apiKey: string,
  urls: string[],
  depth: 'basic' | 'advanced'
): Promise<ExtractOutput> {
  const payload = await tavilyPost<TavilyExtractResponse>(apiKey, '/extract', {
    urls,
    extract_depth: depth,
  })
  const docs = (payload.results ?? []).map((r) => ({ url: r.url, title: r.title, text: r.raw_content }))
  const usage = estimateTavilyExtractCost(docs.length, depth)
  return {
    docs,
    failedUrls: (payload.failed_results ?? []).map((f) => f.url),
    usage: { units: usage.units, estimatedCostUsd: usage.amountUsd, billingUnit: 'tavily_credit' },
  }
}

// ---------------------------------------------------------------------------
// SerpAPI
// ---------------------------------------------------------------------------
const SERPAPI_BASE_URL = 'https://serpapi.com/search.json'

interface SerpApiResponse {
  search_metadata?: { id?: string }
  organic_results?: Array<{ link: string; title?: string; snippet?: string }>
  error?: string
}

export async function serpApiSearch(
  apiKey: string,
  input: SearchInput,
  requestDefaults: Record<string, unknown> = {}
): Promise<SearchOutput> {
  const params = new URLSearchParams({
    engine: 'google',
    q: input.query,
    api_key: apiKey,
    num: String(input.maxResults),
  })
  for (const [key, value] of Object.entries(requestDefaults)) {
    if (typeof value === 'string' || typeof value === 'number') params.set(key, String(value))
  }
  if (input.locationLabel) params.set('location', input.locationLabel)
  if (input.languageCode && !params.has('hl')) params.set('hl', input.languageCode)

  let response: Response
  try {
    response = await fetch(`${SERPAPI_BASE_URL}?${params.toString()}`, {
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })
  } catch (error: unknown) {
    throw new ProviderTemporaryError('serpapi', error instanceof Error ? error.message : 'network error')
  }
  if (response.status === 401 || response.status === 403) {
    throw new AuthOrConfigError('SerpAPI anahtarı geçersiz veya yetkisiz')
  }
  if (response.status === 429) throw new ProviderRateLimitError('serpapi')
  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new ProviderTemporaryError('serpapi', `HTTP ${response.status}: ${detail.slice(0, 300)}`)
  }
  const payload = (await response.json()) as SerpApiResponse
  if (payload.error) throw new ProviderTemporaryError('serpapi', payload.error)

  const usage = estimateSerpApiSearchCost()
  return {
    requestId: payload.search_metadata?.id,
    results: (payload.organic_results ?? []).map((r) => ({
      url: r.link,
      title: r.title,
      snippet: r.snippet,
      domain: extractDomain(r.link),
    })),
    usage: { units: usage.units, estimatedCostUsd: usage.amountUsd, billingUnit: 'serpapi_search' },
  }
}

// ---------------------------------------------------------------------------
// Gemini (structured output classifier)
// ---------------------------------------------------------------------------
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models'
const DEFAULT_MODEL = 'gemini-2.5-flash-lite'

interface GeminiResponse {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
  usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number }
  error?: { message?: string }
}

export async function geminiClassify(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
  model: string = DEFAULT_MODEL
): Promise<{ parsed: unknown; usage: ClassifyUsage }> {
  const url = `${GEMINI_BASE_URL}/${encodeURIComponent(model)}:generateContent`
  let response: Response
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: 'application/json',
          responseSchema: CLASSIFIER_RESPONSE_SCHEMA,
        },
      }),
      signal: AbortSignal.timeout(GEMINI_TIMEOUT_MS),
    })
  } catch (error: unknown) {
    throw new ProviderTemporaryError('gemini', error instanceof Error ? error.message : 'network error')
  }
  if (response.status === 401 || response.status === 403) {
    throw new AuthOrConfigError('Gemini API anahtarı geçersiz veya yetkisiz')
  }
  if (response.status === 429) throw new ProviderRateLimitError('gemini')
  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new ProviderTemporaryError('gemini', `HTTP ${response.status}: ${detail.slice(0, 300)}`)
  }
  const payload = (await response.json()) as GeminiResponse
  if (payload.error) throw new ProviderTemporaryError('gemini', payload.error.message ?? 'unknown error')

  const text = payload.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('') ?? ''
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new ProviderTemporaryError('gemini', `Geçersiz JSON yanıtı: ${text.slice(0, 200)}`)
  }
  const inputTokens = payload.usageMetadata?.promptTokenCount ?? 0
  const outputTokens = payload.usageMetadata?.candidatesTokenCount ?? 0
  const { amountUsd } = estimateGeminiCost(model, inputTokens, outputTokens)
  return { parsed, usage: { inputTokens, outputTokens, estimatedCostUsd: amountUsd, model } }
}
