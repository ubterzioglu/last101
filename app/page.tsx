import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { createMetadata } from '@/lib/seo/metadata';
import { NewsCarousel } from '@/components/sections/NewsCarousel';
import { FAQ } from '@/components/sections/FAQ';
import { HomeHeroSection } from '@/components/home/HomeHeroSection';
import { LinkGridSection } from '@/components/home/LinkGridSection';
import { ContactChannelCard } from '@/components/home/ContactChannelCard';
import { BreadcrumbJsonLd, FaqJsonLd, HowToJsonLd, SpeakableJsonLd, WebPageJsonLd } from '@/components/seo/JsonLd';
import { ArrowUpIcon, WhatsAppIcon } from '@/components/icons/ContactIcons';
import { cn } from '@/lib/utils/cn';
import { getPublishedNewsItems } from '@/lib/public-news';
import { CANONICAL_SITE_URL, DEFAULT_META_DESCRIPTION, DEFAULT_SEO_TITLE } from '@/lib/utils/constants';
import {
  TOOL_ITEMS,
  OTHER_LINK_ITEMS,
} from '@/constants/home-data';
import { CONTACT_CHANNELS } from '@/constants/contact-channels';

export const metadata = createMetadata({
  title: DEFAULT_SEO_TITLE,
  description: DEFAULT_META_DESCRIPTION,
  path: '/',
  absoluteTitle: true,
  keywords: [
    'Almanya yaşam rehberi',
    'Almanya iş bulma',
    'Almanya Türk topluluğu',
    'Almanya iş ilanları',
    'Almanya belgeler',
  ],
});

export const dynamic = 'force-dynamic';

const HOMEPAGE_ITEMS = [...TOOL_ITEMS, ...OTHER_LINK_ITEMS];
const HOME_PAGE_URL = CANONICAL_SITE_URL;
const WHATSAPP_COMMUNITY_CHANNEL = CONTACT_CHANNELS.find((channel) => channel.id === 'whatsapp');
const HOMEPAGE_FAQ_ITEMS = [
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
    question: 'Almanya\'ya taşınırken en sık yapılan hatalar neler?',
    answer:
      "En yaygın hatalar: adres kaydı süresini kaçırmak (14 gün sınırı var), sağlık sigortası seçimini ertelemek, Almanca özgeçmiş hazırlamadan başvuru yapmak ve kira sözleşmesi okumadan imzalamaktır. Adres kaydını zamanında yaptırmayanlar, vergi numarası gecikmesi nedeniyle maaş ödemelerinde sorun yaşayabilir. Bu tür sorunların çözümü için topluluk kanallarımızda güncel deneyimler paylaşılmaktadır.",
  },
];

interface EditorialSectionProps {
  eyebrow: string;
  title: string;
  intro: string;
  listItems?: string[];
  children: React.ReactNode;
}

interface ContentCardProps {
  title: string;
  tone: 'blue' | 'red' | 'yellow' | 'green';
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const GUIDE_CARD_STYLES = {
  blue: {
    border: 'border-google-blue/45',
    background: 'bg-google-blue/10 group-open:bg-google-blue/16',
    icon: 'border-google-blue/40 bg-google-blue/15 text-white',
    hover: 'hover:text-google-blue',
  },
  red: {
    border: 'border-google-red/45',
    background: 'bg-google-red/10 group-open:bg-google-red/16',
    icon: 'border-google-red/40 bg-google-red/15 text-white',
    hover: 'hover:text-google-red',
  },
  yellow: {
    border: 'border-google-yellow/45',
    background: 'bg-google-yellow/10 group-open:bg-google-yellow/16',
    icon: 'border-google-yellow/40 bg-google-yellow/15 text-white',
    hover: 'hover:text-google-yellow',
  },
  green: {
    border: 'border-google-green/45',
    background: 'bg-google-green/10 group-open:bg-google-green/16',
    icon: 'border-google-green/40 bg-google-green/15 text-white',
    hover: 'hover:text-google-green',
  },
} as const;

interface SectionProps {
  backgroundImage: string;
  children: React.ReactNode;
  className?: string;
  overlayOpacity?: string;
  heightClassName?: string;
}

function BackgroundSection({
  backgroundImage,
  children,
  className,
  overlayOpacity = 'bg-black/60',
  heightClassName = 'h-[1000px]',
}: SectionProps) {
  return (
    <section
      className={cn(
        'flex items-center relative bg-black py-12',
        heightClassName,
        className
      )}
    >
      <div className={`absolute inset-0 ${overlayOpacity}`} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {children}
      </div>
    </section>
  );
}

function SectionDivider() {
  return <div className="h-[10px] bg-black" />;
}

function EditorialSection({ eyebrow, title, intro, listItems, children }: EditorialSectionProps) {
  return (
    <section className="bg-black py-16 text-white md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
            {eyebrow}
          </div>
          <h2 className="mt-6 mb-4 text-3xl font-bold text-white md:text-4xl">
            {title}
          </h2>
          <p className="mt-5 text-base leading-8 text-white/74 md:text-lg">
            {intro}
          </p>
          {listItems && listItems.length > 0 && (
            <ol className="mx-auto mt-8 max-w-md list-none space-y-3 text-left text-white/84 counter-reset-[step]">
              {listItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3 counter-increment-[step]">
                  <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-google-blue/20 text-xs font-bold text-google-blue before:content-[counter(step)]" />
                  {item}
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="mx-auto mt-12 max-w-4xl rounded-[2rem] border border-white/10 bg-white/[0.03] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-sm md:p-6">
          <div className="space-y-4">{children}</div>
        </div>
      </div>
    </section>
  );
}

function ContentCard({ title, tone, children, defaultOpen = false }: ContentCardProps) {
  const accent = GUIDE_CARD_STYLES[tone];

  return (
    <details
      open={defaultOpen}
      className={cn(
        'group overflow-hidden rounded-[1.6rem] border transition-all duration-300',
        accent.border,
        accent.background
      )}
    >
      <summary
        className={cn(
          'flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 text-left text-white transition-colors marker:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black md:px-8 md:py-6 [&::-webkit-details-marker]:hidden',
          accent.hover
        )}
      >
        <h3 className="pr-4 text-lg font-semibold leading-snug text-white">{title}</h3>
        <ChevronDown
          className={cn(
            'h-10 w-10 flex-shrink-0 rounded-full border p-2 transition-transform duration-300 group-open:rotate-180',
            accent.icon
          )}
          aria-hidden="true"
        />
      </summary>
      <div className="border-t border-white/10 px-5 pb-6 pt-5 text-sm leading-8 text-white/84 md:px-8 md:pb-8 md:text-base">
        <div className="space-y-4">{children}</div>
      </div>
    </details>
  );
}

export default async function HomePage() {
  const newsItems = await getPublishedNewsItems(12);

  return (
    <>
      <WebPageJsonLd
        title="Almanya'da Yaşam ve İş İçin Türkçe Rehber"
        description={DEFAULT_META_DESCRIPTION}
        url={HOME_PAGE_URL}
        datePublished="2024-06-01"
        dateModified="2026-04-19"
      />
      <BreadcrumbJsonLd items={[{ name: 'Ana Sayfa', url: HOME_PAGE_URL }]} />
      <FaqJsonLd items={HOMEPAGE_FAQ_ITEMS} />
      <HowToJsonLd
        name="Almanya'da Düzen Kurmak İçin İlk 6 Adım"
        description="Almanya'ya taşınan birinin tamamlaması gereken temel adımlar: adres kaydı, vergi numarası, sağlık sigortası, banka hesabı, telefon hattı ve oturum izni."
        steps={[
          { name: 'Adres kaydı (Anmeldung)', text: 'İlk 14 gün içinde belediyeye adres kaydı yaptırın. Ortalama 2-4 hafta içinde tamamlanır.' },
          { name: 'Vergi numarası (Steuernummer)', text: 'Adres kaydından sonra Federal Vergi Dairesi (Bundeszentralamt für Steuern) otomatik olarak vergi numaranızı gönderir.' },
          { name: 'Sağlık sigortası (Krankenversicherung)', text: 'Aylık €200-€400 arası değişen kamu veya özel sigorta seçeneklerinden birini belirleyin.' },
          { name: 'Banka hesabı açma', text: 'Girokonto (vadesiz hesap) açarak maaş ve kira ödemelerinizi yönetin.' },
          { name: 'Telefon hattı ve internet', text: 'Aylık €30-€50 arası tarifelerle mobil ve sabit internet bağlantınızı kurun.' },
          { name: 'Oturum izni (Aufenthaltstitel)', text: 'Vize sürenize göre yerel Ausländerbehörde&apos;de oturum izni başvurusu yapın.' },
        ]}
      />
      <SpeakableJsonLd cssSelector={['section.min-h-\\[600px\\] p', '.faq-section p']} />

      <HomeHeroSection whatsappHref={WHATSAPP_COMMUNITY_CHANNEL?.href} />

      <section className="bg-[#050505] py-6 md:py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <LinkGridSection
            title="Yalnız değilsin! Araçlarımız ve bir sürü içerik seninle!"
            items={HOMEPAGE_ITEMS}
            className="bg-transparent min-h-0 h-auto py-0 mb-0"
            gridClassName="grid-cols-[repeat(auto-fit,minmax(170px,1fr))] sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 max-w-none"
            cardClassName="min-h-[190px] sm:min-h-[220px]"
            cardTitleClassName="text-xs sm:text-sm"
            cardDescriptionClassName="text-[11px] sm:text-xs leading-snug"
            overlayOpacity={false}
            backgroundImage={false}
            noCenter
          />
        </div>
      </section>

      <SectionDivider />

      <BackgroundSection
        backgroundImage="/images/backgrounds/berlin1.jpg"
        heightClassName="h-[500px] sm:h-[540px] lg:h-[580px]"
      >
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
            Almanya Haberleri Neleri Takip Etmeli?
          </h2>
        </div>
        <NewsCarousel items={newsItems} />
      </BackgroundSection>

      <SectionDivider />

      <EditorialSection
        eyebrow="Ana Sayfa Rehberi"
        title="Almanya'da Düzen Kurmak İçin Nereden Başlamalı?"
        intro="Almanya101 nedir? Kısaca Almanya101, Almanya'ya taşınan veya burada yaşayan Türkler için Türkçe rehber, araç ve topluluk platformudur. ~3,5 milyon Türk kökenli insan Almanya'da yaşıyor ve her yıl binlercesi yeni taşınıyor. Bu sayfa; Almanya yaşam rehberi arayan, iş bulma sürecini anlamak isteyen ve Türk topluluğuyla güvenli şekilde bağ kurmak isteyen kullanıcılar için karar destek sayfası olarak tasarlandı. Hedef, bilgi kalabalığını azaltıp sıradaki mantıklı adımı görünür hale getirmek."
        listItems={[
          'Adres kaydı (Anmeldung)',
          'Vergi numarası (Steuernummer)',
          'Sağlık sigortası (Krankenversicherung)',
          'Banka hesabı açma',
          'Telefon hattı ve internet',
          'Oturum izni (Aufenthaltstitel)',
        ]}
      >
        <ContentCard title="Almanya'da Yaşam Rehberi Nedir, Neden Gerekli?" tone="blue">
          <p>
            Almanya'ya yeni taşınan biri için ilk problem çoğu zaman bilgi eksikliği değil, <strong>bilgi dağınıklığı</strong>tır. <strong>Adres kaydı</strong>,
            vergi numarası, banka hesabı, sağlık sigortası, telefon hattı ve oturum süreçleri aynı döneme yığıldığında,
            insanlar hangi adımı önce tamamlaması gerektiğini karıştırır. Ortalama <strong>2-4 hafta</strong> içinde adres kaydı tamamlanır;
            ardından kalan adımlar 6-8 hafta daha sürebilir. Bu nedenle Almanya101 ana sayfasında yalnızca içerik
            listelemek yerine, kullanıcıyı <strong>günlük hayatta en çok etkileyecek başlıklara</strong> doğrudan yönlendiren bir yapı kurduk.
          </p>
          <p>
            Eğer hedefiniz yeni bir başlangıcı daha az stresle yönetmekse, önce{' '}
            <Link href="/almanyada-yasam" className="font-semibold text-white underline decoration-google-blue underline-offset-4">
              Almanya'da yaşam rehberi
            </Link>
            {' '}ve ardından{' '}
            <Link href="/hizmet-rehberi" className="font-semibold text-white underline decoration-google-green underline-offset-4">
              hizmet rehberi
            </Link>
            gibi kaynaklardan <strong>temel çerçeveyi kurmak</strong> gerekir. Adres kaydı için{' '}
            <a href="https://www.berlin.de/buergeramt/" target="_blank" rel="noopener noreferrer" className="font-semibold text-white underline decoration-google-blue underline-offset-2">
              Bürgeramt
            </a>, oturum izni için{' '}
            <a href="https://www.bamf.de" target="_blank" rel="noopener noreferrer" className="font-semibold text-white underline decoration-google-blue underline-offset-2">
              BAMF
            </a>{' '}
            gibi resmi kurumlar süreçlerin ilk durağıdır. Böylece resmi işlem, günlük yaşam ve yerel destek başlıkları
            ayrı ayrı değil, <strong>birbirini tamamlayan tek bir yol haritası</strong> halinde okunabilir.
          </p>
        </ContentCard>

        <ContentCard title="Almanya'da İş Bulma Süreci Nasıl İşler?" tone="red">
          <p>
            Almanya'da iş bulma süreci yalnızca ilan sitelerine bakmaktan ibaret değildir. <strong>Özgeçmişin Alman işveren beklentilerine
            göre düzenlenmesi</strong>, başvuru metinlerinin pozisyona göre yeniden yazılması, maaş beklentisinin doğru kurulması ve sektör
            dilinin anlaşılması gerekir. Birçok aday iyi profillere sahip olmasına rağmen <strong>başvuru stratejisi eksik</strong> olduğu için geri
            dönüş alamaz. Araştırmalara göre <strong>ortalama 50-80 başvuru</strong> sonrası ilk mülakat daveti gelmektedir.{' '}
            <a href="https://www.arbeitsagentur.de" target="_blank" rel="noopener noreferrer" className="font-semibold text-white underline decoration-google-red underline-offset-2">
              Bundesagentur für Arbeit
            </a>{' '}
            verilerine göre Almanya&apos;da işsizlik oranı %6 civarındadır ve Türk kökenli adaylar için dil seviyesi en kritik faktördür. Bu yüzden ana sayfada hem araçlara hem de doğrudan <strong>iş fırsatlarına</strong> giden linkleri görünür hale getirdik.
          </p>
          <p>
            Özellikle{' '}
            <Link href="/is-ilanlari" className="font-semibold text-white underline decoration-google-yellow underline-offset-4">
              iş ilanları
            </Link>
            ,{' '}
            <Link href="/stepstone-karsilastirma" className="font-semibold text-white underline decoration-google-blue underline-offset-4">
              maaş karşılaştırma
            </Link>
            {' '}ve{' '}
            <Link href="/maas-hesaplama" className="font-semibold text-white underline decoration-google-green underline-offset-4">
              maaş hesaplama
            </Link>
            sayfaları birlikte kullanıldığında kullanıcı yalnızca bir ilana başvurmakla kalmaz; aynı zamanda <strong>teklifin gerçek hayatta
            nasıl karşılık bulacağını</strong> da görür. Bu yaklaşım, Almanya iş bulma arayışını daha <strong>ölçülebilir ve kontrollü</strong> hale getirir.
          </p>
        </ContentCard>

        <ContentCard title="Almanya'da Türk Topluluğuyla Bağ Kurmak Neden Önemli?" tone="yellow">
          <p>
            Yeni bir ülkede doğru insanlara ulaşmak, bazen en doğru belgeyi bulmaktan bile daha değerlidir. Çünkü taşınma sürecinde
            sorular yalnızca resmi işlemlerle sınırlı kalmaz; hangi şehir daha uygundur, ilk ev nasıl bulunur, hangi banka daha hızlı
            hesap açar, hangi işverenler Türkçe iletişim konusunda daha rahattır gibi <strong>gündelik ama kritik kararlar</strong> ortaya çıkar.
            Almanya'da <strong>~3,5 milyon Türk kökenli insan</strong> yaşıyor ve ilk yıl içinde <strong>%60'ı en az bir kez iş değiştirmektedir</strong>.
            Topluluk, bu noktada hazır cevap değil; <strong>deneyim filtresi</strong> sağlar.
          </p>
          <p>
            Bu nedenle ana sayfada{' '}
            <Link href="/topluluk" className="font-semibold text-white underline decoration-google-green underline-offset-4">
              topluluk sayfası
            </Link>
            ve WhatsApp erişimi, yalnızca bir sosyal kanal olarak değil, <strong>güvenilir bilgi dolaşımı için temel bir yapı</strong> olarak konumlandı.
            İnsanların birbirine yön verdiği, güncel deneyimleri paylaştığı ve <strong>yanlış bilgi maliyetini azalttığı</strong> bir topluluk; Almanya
            Türk topluluğu arayan kullanıcılar için arama sonucundan çok daha yüksek bir değere dönüşür.
          </p>
        </ContentCard>

        <ContentCard title="Almanya İçin Hangi Belgeler Hazırlanmalı?" tone="green">
          <p>
            Taşınma veya yerleşme sürecinde en çok zaman kaybettiren şeylerden biri, <strong>doğru belgenin doğru anda elinizde olmaması</strong>dır.
            Başvuru yapılacak kurumlar değiştikçe istenen evrak listeleri de değişebilir. Ortalama bir taşınma sürecinde <strong>10-15 farklı belge</strong> ve
            <strong> 5-7 ayrı kurum</strong> ziyareti gerekebilir. Bu nedenle belgeleri, haberleri ve rehber içerikleri
            aynı yapıda görünür kılmak çok önemlidir. Kullanıcı bir yandan bilgi okurken, diğer yandan hemen kullanabileceği <strong>kontrol listeleri</strong>ne
            ulaşabilmelidir.
          </p>
          <p>
            Bunun için{' '}
            <Link href="/belgeler" className="font-semibold text-white underline decoration-google-blue underline-offset-4">
              belgeler
            </Link>
            ,{' '}
            <Link href="/haberler" className="font-semibold text-white underline decoration-google-yellow underline-offset-4">
              güncel haberler
            </Link>
            {' '}ve{' '}
            <Link href="/yazi-dizisi" className="font-semibold text-white underline decoration-google-red underline-offset-4">
              yazı dizileri
            </Link>
            birbirini tamamlayan modüller olarak öne çıkarıldı. Böylece kullanıcı yalnızca <strong>&quot;ne yapmalıyım?&quot;</strong> sorusuna değil, <strong>&quot;bugün hangi adımı
            tamamlamalıyım?&quot;</strong> sorusuna da net bir cevap bulabilir. SEO açısından da bu yaklaşım, <strong>iç linkleme gücünü artırırken</strong> sayfalar arası niyet
            geçişlerini daha doğal hale getirir.
          </p>
        </ContentCard>
      </EditorialSection>

      <SectionDivider />

      <section className="bg-black py-16 text-white md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-white md:text-4xl">
              Almanya&apos;da Yaşam Maliyeti Ne Kadar?
            </h2>
            <p className="mt-4 text-base leading-8 text-white/74 md:text-lg">
              2026 yılı itibarıyla Almanya&apos;da tek kişi için tahmini aylık temel gider kalemleri aşağıdadır.
              Şehir ve yaşam tarzına göre değişiklik gösterir; örneğin Berlin&apos;de kira €450–€750, Münih&apos;te €600–€900, Hamburg&apos;da ise €500–€800 arasındadır.
              Kaynak: <a href="https://www.destatis.de" target="_blank" rel="noopener noreferrer" className="text-google-blue underline underline-offset-2">Destatis</a>, <a href="https://www.numbeo.com/cost-of-living/country_result.jsp?country=Germany" target="_blank" rel="noopener noreferrer" className="text-google-blue underline underline-offset-2">Numbeo</a>.
            </p>
          </div>
          <div className="mx-auto mt-10 max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
            <table className="w-full text-left text-sm md:text-base">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.04]">
                  <th className="px-5 py-3 font-semibold text-white/90">Kalem</th>
                  <th className="px-5 py-3 text-right font-semibold text-white/90">Tahmini Aylık Maliyet</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/8">
                <tr>
                  <td className="px-5 py-3 text-white/80">Kira (tek kişi, WG)</td>
                  <td className="px-5 py-3 text-right text-white/90">€400 – €700</td>
                </tr>
                <tr>
                  <td className="px-5 py-3 text-white/80">Sağlık sigortası</td>
                  <td className="px-5 py-3 text-right text-white/90">€200 – €400</td>
                </tr>
                <tr>
                  <td className="px-5 py-3 text-white/80">Yemek &amp; market</td>
                  <td className="px-5 py-3 text-right text-white/90">€200 – €350</td>
                </tr>
                <tr>
                  <td className="px-5 py-3 text-white/80">Ulaşım (aylık bilet — Deutschlandticket)</td>
                  <td className="px-5 py-3 text-right text-white/90">€49 – €90</td>
                </tr>
                <tr>
                  <td className="px-5 py-3 text-white/80">İnternet &amp; telefon</td>
                  <td className="px-5 py-3 text-right text-white/90">€30 – €50</td>
                </tr>
                <tr className="border-t-2 border-white/15 bg-white/[0.04] font-semibold">
                  <td className="px-5 py-3 text-white">Toplam (tahmini)</td>
                  <td className="px-5 py-3 text-right text-google-yellow">€879 – €1.590</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <SectionDivider />

      <FAQ
        title="Almanya'ya Taşınırken En Çok Merak Edilen Sorular"
        subtitle={<>Almanya'ya taşınma, iş bulma ve topluluğa katılma sürecinde<br className="hidden md:block"/>en sık sorulan sorulara kısa cevaplar.</>}
        items={HOMEPAGE_FAQ_ITEMS}
      />

      <SectionDivider />

      <section className="relative w-full h-[40vh] sm:h-[50vh] md:h-[60vh] overflow-hidden bg-black">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/images/backgrounds/berlin4.jpg"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source
            src="https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 z-10 pb-8 sm:pb-12 md:pb-16 text-center px-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 drop-shadow-lg">
            Almanya'da Yeni Başlangıç İçin İlk Adım Ne Olmalı?
          </h2>
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-white/90 drop-shadow-md">Binlerce Türk'ün deneyimlerinden oluşan ağımızla Almanya maceranıza güçlü bir başlangıç yapın.</p>
          <p className="mt-2 text-xs text-white/40 drop-shadow-sm">Berlin skyline — video: Pexels</p>
        </div>
      </section>

      <BackgroundSection
        backgroundImage="/images/backgrounds/berlin4.jpg"
        overlayOpacity="bg-black/70"
        heightClassName="h-auto py-14 md:py-16"
      >
        <div className="w-full">
          <div className="text-center mb-4 sm:mb-5">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
              Almanya101 Topluluğuna Nasıl Katılabilirsiniz?
            </h2>
            <p className="mx-auto max-w-3xl text-sm leading-7 text-white sm:text-base">
              Almanya'da yaşamı daha hızlı çözmek isteyenler için topluluk; tavsiye, deneyim ve yönlendirme akışını hızlandırır.
              Güncel duyurular, şehir bazlı öneriler ve yeni gelenlerin en sık yaşadığı sorunlar için ortak hafıza oluşturan bu ağ,
              özellikle ilk aylarında desteğe ihtiyaç duyan kullanıcılar için doğrudan fayda sağlar.
            </p>
          </div>

          {WHATSAPP_COMMUNITY_CHANNEL ? (
            <div className="flex justify-center mb-4 sm:mb-5">
              <a
                href={WHATSAPP_COMMUNITY_CHANNEL.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-green-500 text-white text-sm sm:text-base font-medium rounded-md hover:bg-green-600 transition-colors"
              >
                <WhatsAppIcon className="w-5 h-5" />
                WhatsApp Topluluğuna Katıl
              </a>
            </div>
          ) : null}

          <div className="text-center mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
              Bize Nasıl Ulaşabilirsiniz?
            </h2>
          </div>
          <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-center gap-4 py-4 sm:gap-6">
            {CONTACT_CHANNELS.map((channel) => (
              <ContactChannelCard
                key={channel.id}
                channel={channel}
                iconOnly
                className="flex-shrink-0"
              />
            ))}
          </div>
        </div>
      </BackgroundSection>

      <div className="bg-black py-6 text-center">
        <p className="text-xs text-white/40">
          Yayın tarihi: <time dateTime="2024-06-01">Haziran 2024</time> &middot; Son güncelleme: <time dateTime="2026-04-19">Nisan 2026</time>
        </p>
      </div>

      <a
        href="#"
        className="fixed bottom-4 right-4 z-50 w-8 h-8 sm:w-10 sm:h-10 bg-google-yellow rounded-full flex items-center justify-center shadow-lg hover:bg-yellow-400 hover:scale-110 transition-all duration-300"
        aria-label="Yukarı git"
      >
        <ArrowUpIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-900" />
      </a>
    </>
  );
}
