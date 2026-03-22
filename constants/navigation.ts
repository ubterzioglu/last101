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
  { href: '/maas-hesaplama', label: '💸 Brütten Nete Maaş Hesaplama', description: 'Maaşınızın netini anında görün.', category: 'tools' },
  { href: '/vatandaslik-testi', label: '📝 Vatandaşlık Testi Denemesi', description: 'Almanya vatandaşlık testi için deneme sınavı', category: 'tools' },
  { href: '/banka-secim', label: '💳 Banka Seçim Araci', description: '20 soruyla banka profilinizi belirleyin.', category: 'tools' },
  { href: '/sigorta-secim', label: '🛡️ Sigorta Seçim Araci', description: '20 soruyla sigortaları önceliklendirin.', category: 'tools' },
  { href: '/para-transferi', label: '🔁 Para Transferi Seçim Aracı', description: 'Size uygun aktarım aracını bulun!', category: 'tools' },
  { href: '/vize-secim', label: '🛂 Vize Seçim Aracı', description: 'Hangi Almanya vizesine başvurmanız gerektiğini 10-13 soruda öğrenin.', category: 'tools' },
  { href: '/tatil/turkiye', label: '✈️ Tatil Planlayıcı 2026 Türkiye', description: 'Türkiye\'de 2026 tatilinizi planlayın!', category: 'tools' },
  { href: '/tatil/almanya', label: '🏖️ Tatil Planlayıcı 2026 Almanya', description: 'Almanya\'da 2026 tatilinizi planlayın!', category: 'tools' },

  // Community
  { href: 'https://101.almanya101.de/devuser/dev.html', label: '💻 Developer Topluluğu', description: 'Almanya\'daki Türk developerlar için topluluk platformu.', category: 'community' },
  { href: '/devuser/list.html', label: '👥 Developer Listesi', description: 'Developerları ara ve filtrele.', category: 'community' },
  { href: '/devuser/cvopt.html', label: '📝 CV Optimizasyonu', description: 'CV\'nizi optimize edin.', category: 'community' },
  { href: '/topluluk', label: '👥 Topluluğa Katıl', description: 'Türk topluluğuna dahil olun!', category: 'community' },

  // Content
  { href: '/hizmet-rehberi', label: '👨‍⚕️ Türk Hizmet Rehberi', description: 'Doktor, avukat, restoran, market - Türkçe destek bulun!', category: 'content' },
  { href: '/yazi-dizisi', label: '📝 Yazı Dizisi', description: 'Adım adım rehberler ve yazılar.', category: 'content' },
  { href: '/haberler', label: '📰 Haberler', description: 'Güncel haberler ve gelişmeler.', category: 'content' },
  { href: '/belgeler', label: '📄 Yararlı Belgeler', description: 'İhtiyacınız olan belgeler ve formlar.', category: 'content' },
  { href: '/software-hub', label: '💻 Software Hub', description: 'Developer Dashboard ve araçlar.', category: 'content' },

  // Contact & About
  { href: '/#biz-kimiz', label: '🧑‍💻 Biz kimiz?', description: 'almanya101 ekibini tanıyın!', category: 'contact' },
  { href: '/#bize-katil', label: '🤝 Bize Katıl!', description: 'almanya101 ekibine katılmak için tıkla!', category: 'contact' },
  { href: '/iletisim', label: '✉️ İletişim', description: 'Bizimle hızlıca iletişime geçin.', category: 'contact' },
];

export const DRAWER_CATEGORIES = {
  tools: { label: 'Araçlar', order: 1 },
  community: { label: 'Topluluk', order: 2 },
  content: { label: 'İçerik', order: 3 },
  contact: { label: 'İletişim', order: 4 },
} as const;
