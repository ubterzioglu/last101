import type { FeedItemInput } from './rss.ts'

// TRT Haber mobil XML adaptörü.
// TRT standart RSS yayınlamaz; xml_mobile.php endpoint'i özel bir format döndürür:
//   <haberler>
//     <haber>
//       <haber_manset><![CDATA[Başlık]]></haber_manset>
//       <haber_resim>https://.../resim.jpg</haber_resim>
//       <haber_link>haber/turkiye/slug-949240.html</haber_link>  (göreceli)
//       <haber_id>949240</haber_id>
//       <haber_aciklama><![CDATA[Özet]]></haber_aciklama>
//     </haber>
//   </haberler>

const TRT_BASE = 'https://www.trthaber.com/'

function readTag(block: string, tagName: string): string {
  const match = block.match(new RegExp(`<${tagName}(?: [^>]*)?>([\\s\\S]*?)<\\/${tagName}>`, 'i'))
  if (!match?.[1]) return ''
  return match[1].replace(/<!\[CDATA\[|\]\]>/g, '').trim()
}

function toAbsoluteUrl(link: string): string {
  const trimmed = link.trim()
  if (!trimmed) return ''
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  try {
    return new URL(trimmed, TRT_BASE).toString()
  } catch {
    return trimmed
  }
}

export function parseTrtHaberItems(xml: string): FeedItemInput[] {
  const blocks = [...xml.matchAll(/<haber\b[\s\S]*?<\/haber>/gi)]
  return blocks
    .map((match) => {
      const block = match[0]
      const title = readTag(block, 'haber_manset')
      const description = readTag(block, 'haber_aciklama')
      const rawLink = readTag(block, 'haber_link')
      const link = toAbsoluteUrl(rawLink)
      const haberId = readTag(block, 'haber_id')
      const imageUrl = readTag(block, 'haber_resim')

      return {
        externalId: haberId || link || title,
        title,
        description,
        link,
        imageUrl,
        // TRT mobil XML yayın tarihi taşımaz; null bırakılır (relevance "son 24 saat"
        // puanını alamaz ama normalize/dedupe çalışır).
        publishedAt: null,
        rawPayload: {
          title,
          description,
          link,
          haberId,
          imageUrl,
        },
      }
    })
    .filter((item) => item.title && item.link)
}
