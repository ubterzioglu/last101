/**
 * Interactive tools that require a (free) membership. Visiting any of these
 * without a session redirects to /giris?next=<path>. Content/SEO pages, the
 * home page, and the existing admin/devuser/kose auth systems are NOT gated.
 *
 * Shared between `middleware.ts` (redirect) and `app/sitemap.ts` (gated URLs
 * must never appear in the sitemap because anonymous requests get a 307 to a
 * noindex login page).
 */
export const GATED_PREFIXES = [
  // Existing gated tools
  '/banka-secim',
  '/sigorta-secim',
  '/maas-hesaplama',
  '/stepstone-karsilastirma',
  '/vatandaslik-testi',
  '/para-transferi',
  '/vize-secim',
  '/software-hub',
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
  // NOTE: /belgeler, /almanya-araclari and /yeniarachub stay public on purpose
  // (SEO content + tool hub/catalog pages). The tool links inside the hubs are
  // gated by their own prefixes above.
] as const;

export function isGatedPath(pathname: string): boolean {
  return GATED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}
