/**
 * Shared utility constants
 */

export const SITE_NAME = 'almanya101';
export const SEO_SITE_NAME = 'Almanya101';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://almanya101.com';
export const SITE_LOCALE = 'tr_TR';
export const DEFAULT_OG_IMAGE = '/images/og-default.jpg';
export const DEFAULT_SEO_TITLE = `${SEO_SITE_NAME} | Almanya'da Yaşam, İş ve Türk Topluluğu`;
export const DEFAULT_META_DESCRIPTION =
  "Almanya'da yaşayan veya taşınmayı planlayan Türkler için yaşam rehberi, iş fırsatları, belgeler ve güçlü bir topluluk. Hemen keşfet ve aramıza katıl.";
export const DEFAULT_KEYWORDS = [
  'Almanya yaşam rehberi',
  'Almanya iş ilanları',
  'Almanya Türk topluluğu',
  'Almanya iş bulma',
  'Almanya belgeler',
  'Almanya101',
] as const;

export const DEFAULT_META = {
  title: DEFAULT_SEO_TITLE,
  description: DEFAULT_META_DESCRIPTION,
  openGraph: {
    type: 'website',
    locale: SITE_LOCALE,
    siteName: SEO_SITE_NAME,
    url: SITE_URL,
  },
  twitter: {
    card: 'summary_large_image',
  },
} as const;

export const SOCIAL_LINKS = {
  twitter: 'https://twitter.com/almanya101',
  facebook: 'https://facebook.com/almanya101',
  instagram: 'https://instagram.com/almanya101',
  youtube: 'https://youtube.com/@almanya101',
} as const;

export const CONTACT_INFO = {
  email: 'info@almanya101.de',
  phone: '+49 173 956 9429',
  address: 'Berlin, Almanya',
} as const;
