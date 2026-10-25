/**
 * Interactive tool and member-area route inventory.
 *
 * Tool URLs are indexable: an anonymous `GET /<tool>` returns 200 with
 * server-rendered intro content (description, scope, limitations, visible
 * FAQ); a logged-in user gets the interactive tool at the same address.
 * Personal calculation/result APIs enforce their own authorization — this
 * list only drives routing, the sitemap and the public/protected content
 * split, never authorization itself.
 *
 * Shared between the tool pages (public intro vs. interactive tool),
 * `app/sitemap.ts` (tool URLs belong in the sitemap, member-area URLs
 * do not), `scripts/verify-seo.mjs` and the e2e smoke tests. The
 * middleware no longer redirects tool URLs (see middleware.ts).
 */
export const TOOL_PREFIXES = [
  // Existing interactive tools
  '/banka-secim',
  '/sigorta-secim',
  '/maas-hesaplama',
  '/stepstone-karsilastirma',
  '/vatandaslik-testi',
  '/para-transferi',
  '/vize-secim',
  // Additional interactive tools (ToolPageScaffold-based)
  '/almanya-maas-beklentisi',
  '/almanya-yasam-tarzi-uyumu',
  '/almanya-yolunu-sec',
  '/almanyada-is-bulma-olasiligi',
  '/almanyaya-hazir-misin',
  '/hangi-sehir-sana-uygun',
  '/ilk-90-gun-planlayici',
  '/kariyer-ve-egitim-rotasi',
  '/once-hangi-sorunu-cozmelisin',
  '/topluluk-ve-danismanlik',
] as const;

/**
 * Member-area entries that redirect to the dashboard. They serve no public
 * content, must stay out of the sitemap, and are not SEO surfaces.
 */
export const MEMBER_AREA_PREFIXES = ['/software-hub'] as const;

export function matchesRoutePrefix(
  pathname: string,
  prefixes: readonly string[]
): boolean {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export function isToolPath(pathname: string): boolean {
  return matchesRoutePrefix(pathname, TOOL_PREFIXES);
}

export function isMemberAreaPath(pathname: string): boolean {
  return matchesRoutePrefix(pathname, MEMBER_AREA_PREFIXES);
}
