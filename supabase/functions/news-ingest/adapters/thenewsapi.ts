import type { FeedItemInput } from './rss.ts'

export async function fetchTheNewsApiItems(feedUrl: string, token: string): Promise<FeedItemInput[]> {
  if (!token) return []

  const url = feedUrl || 'https://api.thenewsapi.com/v1/news/top?locale=de&limit=3'
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'user-agent': 'almanya101-news-ingest/1.0',
    },
  })

  if (!response.ok) {
    throw new Error(`TheNewsAPI request failed (${response.status})`)
  }

  const payload = await response.json()
  const items = Array.isArray(payload?.data) ? payload.data : []

  return items.map((item: Record<string, unknown>) => ({
    externalId: String(item.uuid || item.url || item.title || ''),
    title: String(item.title || ''),
    description: String(item.description || item.snippet || ''),
    link: String(item.url || ''),
    imageUrl: String(item.image_url || ''),
    publishedAt: String(item.published_at || '') || null,
    rawPayload: item,
  }))
}
