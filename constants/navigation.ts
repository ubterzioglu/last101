/**
 * Navigation drawer items configuration
 * Centralized navigation for consistent usage
 */

export interface DrawerItem {
  href: string;
  label: string;
  description?: string;
  category?: 'tools' | 'community' | 'content' | 'contact';
}

export const DRAWER_ITEMS: DrawerItem[] = [
  // Tools
  {
    href: '/maas-hesaplama',
    label: 'Brütten Nete Maaş Hesaplama',
    description: 'Maaşınızın netini anında görün.',
    category: 'tools',
  },
  {
    href: '/vatandaslik-testi',
    label: 'Vatandaşlık Testi Denemesi',
    description: 'Almanya vatandaşlık testi için deneme sınavı.',
    category: 'tools',
  },
  {
    href: '/banka-secim',
    label: 'Banka Seçim Aracı',
    description: 'Banka profilinizi belirleyin.',
    category: 'tools',
  },
  {
    href: '/sigorta-secim',
    label: 'Sigorta Seçim Aracı',
    description: 'Sigortaları önceliklendirin.',
    category: 'tools',
  },
  {
    href: '/para-transferi',
    label: 'Para Transferi Seçim Aracı',
    description: 'Size uygun aktarım aracını bulun.',
    category: 'tools',
  },
  {
    href: '/vize-secim',
    label: 'Vize Seçim Aracı',
    description: 'Hangi Almanya vizesine başvurmanız gerektiğini öğrenin.',
    category: 'tools',
  },
  {
    href: '/tatil/turkiye',
    label: 'Tatil Planlayıcı 2026 Türkiye',
    description: 'Türkiye’de 2026 tatilinizi planlayın.',
    category: 'tools',
  },
  {
    href: '/tatil/almanya',
    label: 'Tatil Planlayıcı 2026 Almanya',
    description: 'Almanya’da 2026 tatilinizi planlayın.',
    category: 'tools',
  },
  {
    href: '/hizmet-rehberi',
    label: 'Türk Hizmet Rehberi',
    description: 'Doktor, avukat, restoran, market için Türkçe destek bulun.',
    category: 'tools',
  },

  // Community
  {
    href: '/topluluk',
    label: 'Topluluğa Katıl',
    description: 'Türk topluluğuna dahil olun.',
    category: 'community',
  },

  // Content
  {
    href: '/yazi-dizisi',
    label: 'Yazı Dizisi',
    description: 'Adım adım rehberler ve yazılar.',
    category: 'content',
  },
  {
    href: '/haberler',
    label: 'Haberler',
    description: 'Güncel haberler ve gelişmeler.',
    category: 'content',
  },
  {
    href: '/belgeler',
    label: 'Yararlı Belgeler',
    description: 'İhtiyacınız olan belgeler ve formlar.',
    category: 'content',
  },
  {
    href: '/software-hub',
    label: 'Software Hub',
    description: 'Yazılım projeleri ve araçları.',
    category: 'content',
  },

  // Contact & About
  {
    href: '/hakkimizda',
    label: 'Biz kimiz?',
    description: 'almanya101 ekibini tanıyın.',
    category: 'contact',
  },
  {
    href: '/ekibimize-katil',
    label: 'Bize Katıl!',
    description: 'almanya101 ekibine katılmak için tıklayın.',
    category: 'contact',
  },
  {
    href: '/iletisim',
    label: 'İletişim',
    description: 'Bizimle hızlıca iletişime geçin.',
    category: 'contact',
  },
];

export const DRAWER_CATEGORIES = {
  tools: { label: 'Araçlar', order: 1 },
  community: { label: 'Topluluk', order: 2 },
  content: { label: 'İçerik', order: 3 },
  contact: { label: 'İletişim', order: 4 },
} as const;
