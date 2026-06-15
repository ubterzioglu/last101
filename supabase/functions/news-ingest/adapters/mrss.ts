import { parseRssItems, type FeedItemInput } from './rss.ts'

export function parseMrssItems(xml: string): FeedItemInput[] {
  return parseRssItems(xml)
}
