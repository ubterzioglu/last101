export interface FeedItemInput {
  externalId: string;
  title: string;
  description: string;
  link: string;
  imageUrl: string;
  publishedAt: string | null;
  rawPayload: Record<string, unknown>;
}

function readTag(block: string, tagNames: string[]): string {
  for (const tagName of tagNames) {
    const match = block.match(new RegExp(`<${tagName}(?: [^>]*)?>([\\s\\S]*?)<\\/${tagName}>`, 'i'));
    if (match?.[1]) {
      return match[1].replace(/<!\[CDATA\[|\]\]>/g, '').trim();
    }
  }
  return '';
}

function readAttr(block: string, tagName: string, attrName: string): string {
  const match = block.match(new RegExp(`<${tagName}[^>]*${attrName}="([^"]+)"[^>]*>`, 'i'));
  return match?.[1]?.trim() || '';
}

export function parseRssItems(xml: string): FeedItemInput[] {
  const itemBlocks = [...xml.matchAll(/<item\b[\s\S]*?<\/item>/gi)];
  return itemBlocks.map((match) => {
    const block = match[0];
    const title = readTag(block, ['title']);
    const description = readTag(block, ['description', 'content:encoded']);
    const link = readTag(block, ['link']);
    const guid = readTag(block, ['guid']);
    const publishedAt = readTag(block, ['pubDate', 'published']);
    const imageUrl =
      readAttr(block, 'enclosure', 'url') ||
      readAttr(block, 'media:content', 'url') ||
      readAttr(block, 'media:thumbnail', 'url');

    return {
      externalId: guid || link || title,
      title,
      description,
      link,
      imageUrl,
      publishedAt: publishedAt || null,
      rawPayload: {
        title,
        description,
        link,
        guid,
        publishedAt,
        imageUrl,
      },
    };
  });
}
