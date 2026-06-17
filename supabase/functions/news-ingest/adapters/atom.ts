import type { FeedItemInput } from './rss.ts'

// Atom 1.0 feed parser. Mevcut rss.ts ile aynı regex yaklaşımını kullanır
// (fast-xml-parser bağımlılığı eklemeden, edge function bundle'ını hafif tutar).
// corteqsmvp radar-news-scan/adapters/atom.ts davranışından uyarlandı.

function readTag(block: string, tagNames: string[]): string {
  for (const tagName of tagNames) {
    const match = block.match(new RegExp(`<${tagName}(?: [^>]*)?>([\\s\\S]*?)<\\/${tagName}>`, 'i'))
    if (match?.[1]) {
      return match[1].replace(/<!\[CDATA\[|\]\]>/g, '').trim()
    }
  }
  return ''
}

// Atom <link> birden çok varyantta gelir:
//   <link href="..."/>  ya da  <link rel="alternate" href="..."/>
// rel="alternate" tercih edilir, yoksa ilk href alınır.
function readAtomLink(block: string): string {
  const linkTags = [...block.matchAll(/<link\b[^>]*\/?>/gi)].map((m) => m[0])
  if (linkTags.length === 0) return ''

  const getHref = (tag: string) => {
    const href = tag.match(/href="([^"]+)"/i)
    return href?.[1]?.trim() || ''
  }

  for (const tag of linkTags) {
    const rel = tag.match(/rel="([^"]+)"/i)?.[1]
    if (!rel || rel === 'alternate') {
      const href = getHref(tag)
      if (href) return href
    }
  }

  return getHref(linkTags[0])
}

function readImage(block: string): string {
  const enclosure = block.match(/<link\b[^>]*rel="enclosure"[^>]*href="([^"]+)"/i)
  if (enclosure?.[1]) return enclosure[1].trim()
  const mediaContent = block.match(/<media:content[^>]*url="([^"]+)"/i)
  if (mediaContent?.[1]) return mediaContent[1].trim()
  const mediaThumb = block.match(/<media:thumbnail[^>]*url="([^"]+)"/i)
  return mediaThumb?.[1]?.trim() || ''
}

export function parseAtomItems(xml: string): FeedItemInput[] {
  const entryBlocks = [...xml.matchAll(/<entry\b[\s\S]*?<\/entry>/gi)]
  return entryBlocks.map((match) => {
    const block = match[0]
    const title = readTag(block, ['title'])
    const description = readTag(block, ['summary', 'content'])
    const link = readAtomLink(block)
    const id = readTag(block, ['id'])
    const publishedAt = readTag(block, ['published', 'updated'])
    const imageUrl = readImage(block)

    return {
      externalId: id || link || title,
      title,
      description,
      link,
      imageUrl,
      publishedAt: publishedAt || null,
      rawPayload: {
        title,
        description,
        link,
        id,
        publishedAt,
        imageUrl,
      },
    }
  })
}
