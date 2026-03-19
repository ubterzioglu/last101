/**
 * Navigation configuration
 * Main navigation links for the site
 */

export const NAVIGATION_ITEMS = [
  { href: '/', label: 'Ana Sayfa', id: 'home' },
  { href: '/almanyada-yasam', label: "Almanya'da Yaşam", id: 'life' },
  { href: '/is-ilanlari', label: 'İş İlanları', id: 'jobs' },
  { href: '/rehber', label: 'Rehber', id: 'guide' },
  { href: '/tatil', label: 'Tatil Planlayıcı', id: 'holiday' },
  { href: '/para-transferi', label: 'Para Transferi', id: 'transfer' },
  { href: '/topluluk', label: 'Topluluk', id: 'community' },
  { href: '/hakkimizda', label: 'Hakkımızda', id: 'about' },
  { href: '/iletisim', label: 'İletişim', id: 'contact' },
] as const;

export type NavigationId = (typeof NAVIGATION_ITEMS)[number]['id'];

export const FOOTER_LINKS = {
  site: [
    { href: '/almanyada-yasam', label: "Almanya'da Yaşam" },
    { href: '/is-ilanlari', label: 'İş İlanları' },
    { href: '/rehber', label: 'Rehber' },
    { href: '/tatil', label: 'Tatil Planlayıcı' },
    { href: '/para-transferi', label: 'Para Transferi' },
    { href: '/topluluk', label: 'Topluluk' },
  ],
  about: [
    { href: '/hakkimizda', label: 'Hakkımızda' },
    { href: '/iletisim', label: 'İletişim' },
  ],
  legal: [
    { href: '#', label: 'Gizlilik Politikası' },
    { href: '#', label: 'Kullanım Şartları' },
    { href: '#', label: 'Çerez Politikası' },
  ],
} as const;
