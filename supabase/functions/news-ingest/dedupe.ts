import { canonicalizeUrl } from './normalize.ts'

export async function createUniqueHash(input: {
  title: string
  sourceDomain: string
  publishedAt: string | null
}): Promise<string> {
  const normalizedTitle = input.title.toLocaleLowerCase('tr-TR').replace(/\s+/g, ' ').trim()
  const publishedDate = input.publishedAt ? input.publishedAt.slice(0, 10) : 'unknown'
  const payload = `${normalizedTitle}|${input.sourceDomain}|${publishedDate}`
  const bytes = new TextEncoder().encode(payload)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

export function canonicalizeDuplicateUrl(url: string): string {
  return canonicalizeUrl(url)
}
