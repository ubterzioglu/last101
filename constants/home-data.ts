/**
 * Home page data constants
 * Extracted from app/page.tsx for maintainability
 */

import {
  ArrowLeftRight,
  Banknote,
  BookOpenCheck,
  BookUser,
  BriefcaseBusiness,
  Building2,
  Calculator,
  CalendarCheck,
  ChartColumn,
  ClipboardCheck,
  Code,
  FileText,
  GraduationCap,
  HeartHandshake,
  Landmark,
  Lightbulb,
  Mail,
  MapPin,
  MessagesSquare,
  Newspaper,
  NotebookPen,
  Puzzle,
  ShieldCheck,
  Signpost,
  Stamp,
  Sun,
  Target,
  TreePalm,
  UserPlus,
  UsersRound,
  Wrench,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { AlmTone } from '@/constants/design-tokens';
import { TOOL_CATALOG } from '@/lib/tools/catalog';
import type { ToolCatalogItem } from '@/lib/tools/types';

export type HomeServiceGroupId = 'araclar' | 'icerik' | 'topluluk';

/** One tile of the home service grid (shape-compatible with the site ServiceItem). */
export interface HomeLinkItem {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
  group: HomeServiceGroupId;
}

export interface HomeServiceGroup {
  id: HomeServiceGroupId;
  title: string;
  tone: AlmTone;
}

export interface HomeIntentItem {
  label: string;
  href: string;
}

export interface HomeFaqItem {
  question: string;
  answer: string;
}

export const HOME_SERVICE_GROUPS: HomeServiceGroup[] = [
  { id: 'araclar', title: 'Araçlar', tone: 'blue' },
  { id: 'icerik', title: 'İçerik ve rehber', tone: 'green' },
  { id: 'topluluk', title: 'Topluluk ve biz', tone: 'orange' },
];

export const TOOL_ITEMS: HomeLinkItem[] = [
  { href: '/banka-secim', title: 'Banka Seçim Aracı', description: 'Banka profilinizi belirleyin.', icon: Landmark, group: 'araclar' },
  { href: '/sigorta-secim', title: 'Sigorta Seçim Aracı', description: 'Sigortaları önceliklendirin.', icon: ShieldCheck, group: 'araclar' },
  { href: '/maas-hesaplama', title: 'Brüt Net Maaş Hesaplama', description: 'Net maaşınızı anında görün.', icon: Calculator, group: 'araclar' },
  { href: '/stepstone-karsilastirma', title: 'StepStone 2026 Maaş Karşılaştırma', description: 'Maaşlarınızı karşılaştırın.', icon: ChartColumn, group: 'araclar' },
  { href: '/vatandaslik-testi', title: 'Vatandaşlık Testi', description: 'Deneme sınavı çözün.', icon: BookOpenCheck, group: 'araclar' },
  { href: '/para-transferi', title: 'Para Transferi Seçim Aracı', description: 'Uygun aracı bulun!', icon: ArrowLeftRight, group: 'araclar' },
  { href: '/vize-secim', title: 'Almanya Vize Seçim Aracı', description: 'Hangi vizeye başvurmanız gerektiğini öğrenin.', icon: Stamp, group: 'araclar' },
  { href: '/tatil/almanya', title: '2026 Almanya Tatil Planlayıcı', description: '2026 tatilinizi planlayın.', icon: Sun, group: 'araclar' },
  { href: '/tatil/turkiye', title: '2026 Türkiye Tatil Planlayıcı', description: '2026 tatilinizi planlayın.', icon: TreePalm, group: 'araclar' },
  { href: '/hizmet-rehberi', title: 'Türk Hizmet Rehberi', description: 'Doktor, avukat, restoran, market - Türkçe destek bulun!', icon: BookUser, group: 'icerik' },
  { href: '/is-ilanlari', title: 'İşe Alım Firmaları', description: "Almanya'daki işe alım ajanslarını inceleyin.", icon: Building2, group: 'icerik' },
];

/** The old "İş İlanları" card duplicated /is-ilanlari (kept above as "İşe Alım Firmaları"). */
export const OTHER_LINK_ITEMS: HomeLinkItem[] = [
  { href: '/yazi-dizisi', title: 'Yazı Dizisi', description: 'Adım adım rehberler ve yazılar.', icon: NotebookPen, group: 'icerik' },
  { href: '/haberler', title: 'Haberler', description: 'Güncel haberler ve gelişmeler.', icon: Newspaper, group: 'icerik' },
  { href: '/belgeler', title: 'Yararlı Belgeler', description: 'İhtiyacınız olan belgeler ve formlar.', icon: FileText, group: 'icerik' },
  { href: '/ekibimize-katil', title: 'Bize Katıl!', description: 'Ekibimize katılmak için tıkla!', icon: UserPlus, group: 'topluluk' },
  { href: '/hakkimizda', title: 'Biz kimiz?', description: 'almanya101 ekibini tanıyın!', icon: UsersRound, group: 'topluluk' },
  { href: '/hizmet-rehberi/oneri', title: 'Hizmet Öner', description: 'Uzman ekleyin!', icon: Lightbulb, group: 'topluluk' },
  { href: '/iletisim', title: 'İletişim', description: 'Bize hızlıca ulaşın.', icon: Mail, group: 'topluluk' },
  { href: '/software-hub', title: 'Software Hub', description: 'Yazılım projelerimizi keşfedin!', icon: Code, group: 'icerik' },
  { href: '/topluluk', title: 'Topluluğa Katıl', description: 'Türk topluluğuna dahil olun!', icon: MessagesSquare, group: 'topluluk' },
];

/**
 * Interactive planning tools derived from the shared TOOL_CATALOG, so the home
 * grid stays in sync as the catalog grows. Only the icon is chosen here.
 */
const NEW_TOOL_ICONS: Record<string, LucideIcon> = {
  'almanya-yolunu-sec': Signpost,
  'almanya-maas-beklentisi': Banknote,
  'almanyaya-hazir-misin': ClipboardCheck,
  'hangi-sehir-sana-uygun': MapPin,
  'topluluk-ve-danismanlik': HeartHandshake,
  'kariyer-ve-egitim-rotasi': GraduationCap,
  'almanya-yasam-tarzi-uyumu': Puzzle,
  'ilk-90-gun-planlayici': CalendarCheck,
  'once-hangi-sorunu-cozmelisin': Target,
  'almanyada-is-bulma-olasiligi': BriefcaseBusiness,
};

function toHomeLinkItem(tool: ToolCatalogItem): HomeLinkItem {
  return {
    href: `/${tool.slug}`,
    title: tool.title,
    description: tool.description,
    icon: NEW_TOOL_ICONS[tool.slug] ?? Wrench,
    group: 'araclar',
  };
}

export const NEW_TOOL_ITEMS: HomeLinkItem[] = TOOL_CATALOG.map(toHomeLinkItem);

export const HOMEPAGE_ITEMS: HomeLinkItem[] = [...NEW_TOOL_ITEMS, ...TOOL_ITEMS, ...OTHER_LINK_ITEMS];

export const HOME_INTENT_ITEMS: HomeIntentItem[] = [
  { label: "Almanya'ya taşınıyorum", href: '/almanya-yolunu-sec' },
  { label: 'İş arıyorum', href: '/is-ilanlari' },
  { label: 'Maaşımı hesaplayacağım', href: '/maas-hesaplama' },
  { label: 'Belgelerimi hazırlıyorum', href: '/belgeler' },
];

export const HOME_GUIDE_STEPS: string[] = [
  'Adres kaydı (Anmeldung)',
  'Vergi numarası (Steuernummer)',
  'Sağlık sigortası (Krankenversicherung)',
  'Banka hesabı açma',
  'Telefon hattı ve internet',
  'Oturum izni (Aufenthaltstitel)',
];

/** Rendered in the FAQ section and in the FAQ JSON-LD (values must stay in sync). */
export const HOMEPAGE_FAQ_ITEMS: HomeFaqItem[] = [
  {
    question: "Almanya'ya yeni taşınan biri önce hangi adımları tamamlamalı?",
    answer:
      "İlk haftalarda adres kaydı, vergi numarası, sağlık sigortası, banka hesabı ve telefon hattı gibi temel adımları tamamlamak gerekir. Adres kaydı ortalama 2-4 hafta, oturum izni süreci ise 6-12 hafta sürebilir. Ardından oturum süreci, iş arama planı ve günlük yaşam maliyetleri için güvenilir kaynaklarla ilerlemek en sağlıklı yoldur.",
  },
  {
    question: 'Almanya iş bulma sürecinde hangi kaynaklara odaklanmalıyım?',
    answer:
      "İş ilanı platformları, sektör bazlı topluluklar, LinkedIn bağlantıları ve Almanca özgeçmiş hazırlığı birlikte yürütülmelidir. Ortalama 50-80 başvuru sonrası ilk mülakat daveti gelmektedir. Sadece ilan bakmak yerine profilinizi, belgelerinizi ve başvuru stratejinizi aynı anda güçlendirmek daha hızlı sonuç verir.",
  },
  {
    question: 'Almanya101 hangi konularda yardımcı olur?',
    answer:
      "Almanya101; yaşam rehberleri, iş ilanları, belgeler, uzman önerileri, araçlar ve topluluk bağlantılarıyla taşınma ve yerleşme sürecini daha net hale getirir. ~3,5 milyon Türk kökenli insanın yaşadığı Almanya'da, doğru bilgiye hızlı erişim kritik öneme sahiptir. Amaç tek bir içerik değil, karar vermeyi kolaylaştıran bütüncül bir yol haritası sunmaktır.",
  },
  {
    question: 'Topluluk neden önemli?',
    answer:
      "Yeni bir ülkede doğru insanlara hızlı ulaşmak zaman ve hata maliyetini ciddi biçimde azaltır. İlk yıl içinde %60'ı en az bir kez iş değiştirmektedir. Deneyim paylaşımı, güncel tavsiyeler ve doğru yönlendirmeler; özellikle ilk aylarda resmi işlemlerden iş arayışına kadar birçok konuda fark yaratır.",
  },
  {
    question: "Almanya'ya taşınırken en sık yapılan hatalar neler?",
    answer:
      "En yaygın hatalar: adres kaydı süresini kaçırmak (14 gün sınırı var), sağlık sigortası seçimini ertelemek, Almanca özgeçmiş hazırlamadan başvuru yapmak ve kira sözleşmesi okumadan imzalamaktır. Adres kaydını zamanında yaptırmayanlar, vergi numarası gecikmesi nedeniyle maaş ödemelerinde sorun yaşayabilir. Bu tür sorunların çözümü için topluluk kanallarımızda güncel deneyimler paylaşılmaktadır.",
  },
];
