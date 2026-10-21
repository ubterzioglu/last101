/**
 * WhatsApp share text for articles outside /haberler, in the same format as
 * `buildWhatsAppShareText` in lib/news/shared.ts (title, summary, link).
 */
export function buildArticleShareText(params: { title: string; summary?: string | null; url: string }): string {
  const summary = String(params.summary || '').trim();
  return [params.title.trim(), summary, `Devamını oku:\n${params.url}`].filter(Boolean).join('\n\n');
}
