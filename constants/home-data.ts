/**
 * Home page data constants
 * Extracted from app/page.tsx for maintainability
 */

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category?: string;
}

export interface ToolItem {
  href: string;
  label: string;
  description: string;
  image: string;
}

export interface LinkItem extends ToolItem {}

export const NEWS_ITEMS: NewsItem[] = [
  {
    id: '1',
    title: 'Almanya\'da Yeni Çalışma Vizesi Düzenlemeleri 2025',
    excerpt: 'Almanya, 2025 yılında nitelikli işçiler için vize süreçlerini kolaylaştıran yeni düzenlemeleri hayata geçiriyor.',
    image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&h=600&fit=crop',
    date: '15 Mart 2025',
    category: 'Güncelleme',
  },
  {
    id: '2',
    title: 'Yeni Topluluk Etkinlikleri Duyurusu',
    excerpt: 'Bu ay Berlin, Münih ve Frankfurt\'ta Türk topluluğu için özel etkinlikler düzenleniyor.',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop',
    date: '12 Mart 2025',
    category: 'Etkinlik',
  },
  {
    id: '3',
    title: 'Almanca Öğrenme Platformu Yenilendi',
    excerpt: 'almanya101 Almanca öğrenme bölümü yeni interaktif dersler ve pratik egzersizlerle güncellendi.',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop',
    date: '10 Mart 2025',
    category: 'Haber',
  },
  {
    id: '4',
    title: 'İş Fuarı 2025 - Kayıtlar Başladı',
    excerpt: 'Almanya\'daki en büyük Türk işverenleriyle buluşma fırsatı. Online ve yüz yüze katılım seçenekleri.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
    date: '8 Mart 2025',
    category: 'Duyuru',
  },
];

export const TOOL_ITEMS: ToolItem[] = [
  {
    href: '/banka-secim',
    label: 'Banka Seçim Aracı',
    description: 'Banka profilinizi belirleyin.',
    image: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=400&h=300&fit=crop',
  },
  {
    href: '/sigorta-secim',
    label: 'Sigorta Seçim Aracı',
    description: 'Sigortaları önceliklendirin.',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop',
  },
  {
    href: '/maas-hesaplama',
    label: 'Brüt Net Maaş Hesaplama',
    description: 'Net maaşınızı anında görün.',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop',
  },
  {
    href: '/stepstone-karsilastirma',
    label: 'StepStone 2026 Maaş Karşılaştırma',
    description: 'Maaşlarınızı karşılaştırın.',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=300&fit=crop',
  },
  {
    href: '/vatandaslik-testi',
    label: 'Vatandaşlık Testi',
    description: 'Deneme sınavı çözün.',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=300&fit=crop',
  },
  {
    href: '/para-transferi',
    label: 'Para Transferi Seçim Aracı',
    description: 'Uygun aracı bulun!',
    image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=300&fit=crop',
  },
  {
    href: '/vize-secim',
    label: 'Almanya Vize Seçim Aracı',
    description: 'Hangi vizeye başvurmanız gerektiğini öğrenin.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
  },
  {
    href: '/tatil/almanya',
    label: '2026 Almanya Tatil Planlayıcı',
    description: '2026 tatilinizi planlayın.',
    image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&h=300&fit=crop',
  },
  {
    href: '/tatil/turkiye',
    label: '2026 Türkiye Tatil Planlayıcı',
    description: '2026 tatilinizi planlayın.',
    image: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?w=400&h=300&fit=crop',
  },
  {
    href: '/hizmet-rehberi',
    label: 'Türk Hizmet Rehberi',
    description: 'Doktor, avukat, restoran, market - Türkçe destek bulun!',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=300&fit=crop',
  },
];

export const OTHER_LINK_ITEMS: LinkItem[] = [
  {
    href: '/devuser/dev',
    label: 'Developer Topluluğu',
    description: 'Almanya\'daki Türk developerlar için topluluk.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop',
  },
  {
    href: '/yazi-dizisi',
    label: 'Yazı Dizisi',
    description: 'Adım adım rehberler ve yazılar.',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop',
  },
  {
    href: '/haberler',
    label: 'Haberler',
    description: 'Güncel haberler ve gelişmeler.',
    image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300&fit=crop',
  },
  {
    href: '/belgeler',
    label: 'Yararlı Belgeler',
    description: 'İhtiyacınız olan belgeler ve formlar.',
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=300&fit=crop',
  },
  {
    href: '/ekibimize-katil',
    label: 'Bize Katıl!',
    description: 'Ekibimize katılmak için tıkla!',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
  },
  {
    href: '/hakkimizda',
    label: 'Biz kimiz?',
    description: 'almanya101 ekibini tanıyın!',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop',
  },
  {
    href: '/iletisim',
    label: 'İletişim',
    description: 'Bize hızlıca ulaşın.',
    image: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=400&h=300&fit=crop',
  },
  {
    href: '/software-hub',
    label: 'Software Hub',
    description: 'Yazılım projelerimizi keşfedin!',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
  },
  {
    href: '/topluluk',
    label: 'Topluluğa Katıl',
    description: 'Türk topluluğuna dahil olun!',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop',
  },
];
