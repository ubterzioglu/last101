/**
 * Home page data constants
 * Extracted from app/page.tsx for maintainability
 */

import { TOOL_CATALOG } from '@/lib/tools/catalog';
import type { ToolCatalogItem } from '@/lib/tools/types';

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
  topLabel: string;
  label: string;
  description: string;
  image: string;
  kind?: 'tool' | 'link';
  categoryKey?:
    | 'tool'
    | 'career'
    | 'content'
    | 'news'
    | 'document'
    | 'team'
    | 'about'
    | 'community'
    | 'contact'
    | 'software';
  categoryLabel?: string;
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
    topLabel: 'Banka',
    label: 'Banka Seçim Aracı',
    description: 'Banka profilinizi belirleyin.',
    image: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=400&h=300&fit=crop',
    kind: 'tool',
    categoryKey: 'tool',
    categoryLabel: 'ARAÇ',
  },
  {
    href: '/sigorta-secim',
    topLabel: 'Sigorta',
    label: 'Sigorta Seçim Aracı',
    description: 'Sigortaları önceliklendirin.',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop',
    kind: 'tool',
    categoryKey: 'tool',
    categoryLabel: 'ARAÇ',
  },
  {
    href: '/maas-hesaplama',
    topLabel: 'Maaş',
    label: 'Brüt Net Maaş Hesaplama',
    description: 'Net maaşınızı anında görün.',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop',
    kind: 'tool',
    categoryKey: 'tool',
    categoryLabel: 'ARAÇ',
  },
  {
    href: '/stepstone-karsilastirma',
    topLabel: 'StepStone',
    label: 'StepStone 2026 Maaş Karşılaştırma',
    description: 'Maaşlarınızı karşılaştırın.',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=300&fit=crop',
    kind: 'tool',
    categoryKey: 'tool',
    categoryLabel: 'ARAÇ',
  },
  {
    href: '/vatandaslik-testi',
    topLabel: 'Vatandaşlık',
    label: 'Vatandaşlık Testi',
    description: 'Deneme sınavı çözün.',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=300&fit=crop',
    kind: 'tool',
    categoryKey: 'tool',
    categoryLabel: 'ARAÇ',
  },
  {
    href: '/para-transferi',
    topLabel: 'PARA TRANSFER',
    label: 'Para Transferi Seçim Aracı',
    description: 'Uygun aracı bulun!',
    image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=300&fit=crop',
    kind: 'tool',
    categoryKey: 'tool',
    categoryLabel: 'ARAÇ',
  },
  {
    href: '/vize-secim',
    topLabel: 'Vize',
    label: 'Almanya Vize Seçim Aracı',
    description: 'Hangi vizeye başvurmanız gerektiğini öğrenin.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    kind: 'tool',
    categoryKey: 'tool',
    categoryLabel: 'ARAÇ',
  },
  {
    href: '/tatil/almanya',
    topLabel: 'ALMANYA TATİL',
    label: '2026 Almanya Tatil Planlayıcı',
    description: '2026 tatilinizi planlayın.',
    image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&h=300&fit=crop',
    kind: 'tool',
    categoryKey: 'tool',
    categoryLabel: 'ARAÇ',
  },
  {
    href: '/tatil/turkiye',
    topLabel: 'TÜRKİYE TATİL',
    label: '2026 Türkiye Tatil Planlayıcı',
    description: '2026 tatilinizi planlayın.',
    image: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?w=400&h=300&fit=crop',
    kind: 'tool',
    categoryKey: 'tool',
    categoryLabel: 'ARAÇ',
  },
  {
    href: '/hizmet-rehberi',
    topLabel: 'UZMAN',
    label: 'Türk Hizmet Rehberi',
    description: 'Doktor, avukat, restoran, market - Türkçe destek bulun!',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop',
    kind: 'tool',
    categoryKey: 'tool',
    categoryLabel: 'ARAÇ',
  },
  {
    href: '/is-ilanlari',
    topLabel: 'İŞE ALIM',
    label: 'İşe Alım Firmaları',
    description: 'Almanya\'daki işe alım ajanslarını inceleyin.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
    kind: 'tool',
    categoryKey: 'tool',
    categoryLabel: 'ARAÇ',
  },
];

export const OTHER_LINK_ITEMS: LinkItem[] = [
  {
    href: '/is-ilanlari',
    topLabel: 'İŞ',
    label: 'İş İlanları',
    description: 'Almanya iş fırsatlarını hızlıca takip edin.',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=300&fit=crop',
    kind: 'link',
    categoryKey: 'career',
    categoryLabel: 'KARİYER',
  },
  {
    href: '/yazi-dizisi',
    topLabel: 'YAZI DİZİSİ',
    label: 'Yazı Dizisi',
    description: 'Adım adım rehberler ve yazılar.',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop',
    kind: 'link',
    categoryKey: 'content',
    categoryLabel: 'İÇERİK',
  },
  {
    href: '/haberler',
    topLabel: 'Haber',
    label: 'Haberler',
    description: 'Güncel haberler ve gelişmeler.',
    image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300&fit=crop',
    kind: 'link',
    categoryKey: 'news',
    categoryLabel: 'HABER',
  },
  {
    href: '/belgeler',
    topLabel: 'BELGELER',
    label: 'Yararlı Belgeler',
    description: 'İhtiyacınız olan belgeler ve formlar.',
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=300&fit=crop',
    kind: 'link',
    categoryKey: 'document',
    categoryLabel: 'BELGE',
  },
  {
    href: '/ekibimize-katil',
    topLabel: 'BİZE KATIL',
    label: 'Bize Katıl!',
    description: 'Ekibimize katılmak için tıkla!',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
    kind: 'link',
    categoryKey: 'team',
    categoryLabel: 'EKİP',
  },
  {
    href: '/hakkimizda',
    topLabel: 'HAKKIMIZDA',
    label: 'Biz kimiz?',
    description: 'almanya101 ekibini tanıyın!',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop',
    kind: 'link',
    categoryKey: 'about',
    categoryLabel: 'KURUMSAL',
  },
  {
    href: '/hizmet-rehberi/oneri',
    topLabel: 'TÜRK ÖNER',
    label: 'Hizmet Öner',
    description: 'Uzman ekleyin!',
    image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&h=300&fit=crop',
    kind: 'link',
    categoryKey: 'community',
    categoryLabel: 'ÖNERİ',
  },
  {
    href: '/iletisim',
    topLabel: 'İletişim',
    label: 'İletişim',
    description: 'Bize hızlıca ulaşın.',
    image: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=400&h=300&fit=crop',
    kind: 'link',
    categoryKey: 'contact',
    categoryLabel: 'İLETİŞİM',
  },
  {
    href: '/software-hub',
    topLabel: 'Hub',
    label: 'Software Hub',
    description: 'Yazılım projelerimizi keşfedin!',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
    kind: 'link',
    categoryKey: 'software',
    categoryLabel: 'YAZILIM',
  },
  {
    href: '/topluluk',
    topLabel: 'WHATSAPP',
    label: 'Topluluğa Katıl',
    description: 'Türk topluluğuna dahil olun!',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop',
    kind: 'link',
    categoryKey: 'community',
    categoryLabel: 'TOPLULUK',
  },
];

/**
 * New interactive planning tools derived from the shared TOOL_CATALOG.
 * Keeping a single slug -> image map here (and deriving everything else from
 * the catalog) means the homepage grid stays in sync as the catalog grows.
 */
const NEW_TOOL_IMAGES: Record<string, string> = {
  'almanya-yolunu-sec': 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop',
  'almanya-maas-beklentisi': 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=400&h=300&fit=crop',
  'almanyaya-hazir-misin': 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=300&fit=crop',
  'hangi-sehir-sana-uygun': 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&h=300&fit=crop',
  'topluluk-ve-danismanlik': 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=300&fit=crop',
  'kariyer-ve-egitim-rotasi': 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=300&fit=crop',
  'almanya-yasam-tarzi-uyumu': 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&h=300&fit=crop',
  'ilk-90-gun-planlayici': 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400&h=300&fit=crop',
  'once-hangi-sorunu-cozmelisin': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop',
  'almanyada-is-bulma-olasiligi': 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
};

const FALLBACK_NEW_TOOL_IMAGE =
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop';

const CATALOG_CATEGORY_TO_CARD: Record<
  ToolCatalogItem['category'],
  { categoryKey: NonNullable<ToolItem['categoryKey']>; categoryLabel: string }
> = {
  'Rota ve Strateji': { categoryKey: 'career', categoryLabel: 'ROTA & STRATEJİ' },
  'Kariyer ve Gelir': { categoryKey: 'tool', categoryLabel: 'KARİYER & GELİR' },
  'Hazırlık ve Yerleşim': { categoryKey: 'document', categoryLabel: 'HAZIRLIK & YERLEŞİM' },
  'Yaşam ve Destek': { categoryKey: 'community', categoryLabel: 'YAŞAM & DESTEK' },
};

function toToolItem(tool: ToolCatalogItem): ToolItem {
  const card = CATALOG_CATEGORY_TO_CARD[tool.category];

  return {
    href: `/${tool.slug}`,
    topLabel: tool.title.toLocaleUpperCase('tr'),
    label: tool.title,
    description: tool.description,
    image: NEW_TOOL_IMAGES[tool.slug] ?? FALLBACK_NEW_TOOL_IMAGE,
    kind: 'tool',
    categoryKey: card.categoryKey,
    categoryLabel: card.categoryLabel,
  };
}

export const NEW_TOOL_ITEMS: ToolItem[] = TOOL_CATALOG.map(toToolItem);
