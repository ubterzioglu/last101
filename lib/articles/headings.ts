// Makale sayfaları için ortak yardımcılar: başlık id'leri (içindekiler + MarkdownPreview)
// ve tarih biçimleme. Sunucu ve istemci tarafından kullanılır; 'server-only' değildir.

export interface ArticleHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export function slugifyHeading(value: string): string {
  const slug = value
    .toLocaleLowerCase('tr-TR')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'baslik';
}

/** Aynı başlık metni tekrar ederse `-2`, `-3` ekler. Her render/parse için yeni üretici oluşturulmalıdır. */
export function createHeadingIdGenerator(): (text: string) => string {
  const seen = new Map<string, number>();
  return (text) => {
    const base = slugifyHeading(text);
    const count = (seen.get(base) ?? 0) + 1;
    seen.set(base, count);
    return count === 1 ? base : `${base}-${count}`;
  };
}

function stripInlineMarkdown(value: string): string {
  return value
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/[*_`~]/g, '')
    .replace(/\s+#+\s*$/, '')
    .trim();
}

/** Markdown'dan H2/H3 başlıklarını çıkarır; H1 gövdede H2'ye düşürüldüğü için H2 sayılır. */
export function extractHeadings(markdown: string): ArticleHeading[] {
  const nextId = createHeadingIdGenerator();
  const headings: ArticleHeading[] = [];
  let inFence = false;

  for (const line of markdown.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = /^(#{1,3})\s+(.+?)\s*$/.exec(line);
    if (!match) continue;

    const text = stripInlineMarkdown(match[2]);
    if (!text) continue;
    headings.push({ id: nextId(text), text, level: match[1].length === 3 ? 3 : 2 });
  }

  return headings;
}

export function formatArticleDate(value: string | null | undefined): string {
  if (!value) return '';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

/** Güncelleme tarihi, yayından en az bir gün sonraysa "Güncelleme" etiketi gösterilir. */
export function hasMeaningfulUpdate(publishedAt: string, updatedAt: string | null | undefined): boolean {
  if (!updatedAt) return false;
  const published = new Date(publishedAt).getTime();
  const updated = new Date(updatedAt).getTime();
  if (Number.isNaN(published) || Number.isNaN(updated)) return false;
  return updated - published >= ONE_DAY_MS;
}
