/**
 * Shared utility constants
 */

export const SITE_NAME = 'Almanya101';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://almanya101.com';
export const SITE_LOCALE = 'tr_TR';

export const DEFAULT_META = {
  title: SITE_NAME,
  description: 'Almanya\'da yaşayan veya taşınmayı planlayan Türkler için kapsamlı bilgi rehberi, iş ilanları ve topluluk platformu.',
  openGraph: {
    type: 'website',
    locale: SITE_LOCALE,
    siteName: SITE_NAME,
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
  email: 'info@almanya101.com',
  phone: '+49 123 456 7890',
  address: 'Berlin, Almanya',
} as const;
