import Link from 'next/link';
import { createMetadata } from '@/lib/seo/metadata';
import { NewsCarousel } from '@/components/sections/NewsCarousel';
import { FAQ } from '@/components/sections/FAQ';
import { HomeHeroSection } from '@/components/home/HomeHeroSection';
import { LinkGridSection } from '@/components/home/LinkGridSection';
import { ContactChannelCard } from '@/components/home/ContactChannelCard';
import { BreadcrumbJsonLd, FaqJsonLd, WebPageJsonLd } from '@/components/seo/JsonLd';
import { ArrowUpIcon, WhatsAppIcon } from '@/components/icons/ContactIcons';
import { cn } from '@/lib/utils/cn';
import { getPublishedNewsItems } from '@/lib/public-news';
import { DEFAULT_META_DESCRIPTION, DEFAULT_SEO_TITLE, SITE_URL } from '@/lib/utils/constants';
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
const HOME_PAGE_URL = new URL('/', SITE_URL).toString();
const WHATSAPP_COMMUNITY_CHANNEL = CONTACT_CHANNELS.find((channel) => channel.id === 'whatsapp');
const HOMEPAGE_FAQ_ITEMS = [
  {
    question: "Almanya'ya yeni taşınan biri önce hangi adımları tamamlamalı?",
    answer:
      "İlk haftalarda adres kaydı, vergi numarası, sağlık sigortası, banka hesabı ve telefon hattı gibi temel adımları tamamlamak gerekir. Ardından oturum süreci, iş arama planı ve günlük yaşam maliyetleri için güvenilir kaynaklarla ilerlemek en sağlıklı yoldur.",
  },
  {
    question: 'Almanya iş bulma sürecinde hangi kaynaklara odaklanmalıyım?',
    answer:
      "İş ilanı platformları, sektör bazlı topluluklar, LinkedIn bağlantıları ve Almanca özgeçmiş hazırlığı birlikte yürütülmelidir. Sadece ilan bakmak yerine profilinizi, belgelerinizi ve başvuru stratejinizi aynı anda güçlendirmek daha hızlı sonuç verir.",
  },
  {
    question: 'Almanya101 hangi konularda yardımcı olur?',
    answer:
      "Almanya101; yaşam rehberleri, iş ilanları, belgeler, uzman önerileri, araçlar ve topluluk bağlantılarıyla taşınma ve yerleşme sürecini daha net hale getirir. Amaç tek bir içerik değil, karar vermeyi kolaylaştıran bütüncül bir yol haritası sunmaktır.",
  },
  {
    question: 'Topluluk neden önemli?',
    answer:
      "Yeni bir ülkede doğru insanlara hızlı ulaşmak zaman ve hata maliyetini ciddi biçimde azaltır. Deneyim paylaşımı, güncel tavsiyeler ve doğru yönlendirmeler; özellikle ilk aylarda resmi işlemlerden iş arayışına kadar birçok konuda fark yaratır.",
  },
];

interface EditorialSectionProps {
  eyebrow: string;
  title: string;
  intro: string;
  children: React.ReactNode;
}

interface ContentCardProps {
  title: string;
  accentClassName: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

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

function EditorialSection({ eyebrow, title, intro, children }: EditorialSectionProps) {
  return (
    <section className="relative overflow-hidden bg-black py-16 text-white md:py-24">
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-5xl rounded-[2rem] border border-white/10 bg-black/35 p-6 shadow-[0_30px_120px_rgba(0,0,0,0.4)] backdrop-blur-sm md:p-8">
          <div className="inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
            {eyebrow}
          </div>
          <h2 className="mt-6 max-w-3xl text-3xl font-black leading-tight md:text-5xl">
            {title}
          </h2>
          <p className="mt-5 max-w-3xl text-base leading-8 text-white/74 md:text-lg">
            {intro}
          </p>
        </div>

        <div className="mt-8 max-w-5xl space-y-4">{children}</div>
      </div>
    </section>
  );
}

function ContentCard({ title, accentClassName, children, defaultOpen = false }: ContentCardProps) {
  return (
    <details
      open={defaultOpen}
      className={cn(
        'group overflow-hidden rounded-[2rem] border bg-black/45 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-md',
        accentClassName
      )}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 marker:hidden md:px-8 md:py-6 [&::-webkit-details-marker]:hidden">
        <h3 className="text-xl font-bold tracking-tight text-white md:text-2xl">{title}</h3>
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/6 text-lg text-white/80 transition group-open:rotate-180">
          ↓
        </span>
      </summary>
      <div className="border-t border-white/10 px-6 pb-6 pt-5 text-sm leading-8 text-white/78 md:px-8 md:pb-8 md:text-base">
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
      />
      <BreadcrumbJsonLd items={[{ name: 'Ana Sayfa', url: HOME_PAGE_URL }]} />
      <FaqJsonLd items={HOMEPAGE_FAQ_ITEMS} />

      <HomeHeroSection whatsappHref={WHATSAPP_COMMUNITY_CHANNEL?.href} />

      <section className="bg-[#050505] py-6 md:py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <LinkGridSection
            title=""
            items={HOMEPAGE_ITEMS}
            className="bg-transparent min-h-0 h-auto py-0 mb-0"
            gridClassName="grid-cols-[repeat(auto-fit,minmax(170px,1fr))] sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 max-w-none"
            cardClassName="min-h-[190px] sm:min-h-[220px]"
            cardTitleClassName="text-xs sm:text-sm"
            cardDescriptionClassName="text-[11px] sm:text-xs leading-snug"
            overlayOpacity={false}
            backgroundImage={false}
            titleMarginSmall
            noCenter
          />
        </div>
      </section>

      <SectionDivider />

      <EditorialSection
        eyebrow="Ana Sayfa Rehberi"
        title="Almanya'da düzen kurmak için ihtiyaç duyulan temel bilgileri tek landing page içinde birleştirdik."
        intro="Bu sayfa yalnızca birkaç linki bir araya getiren bir giriş ekranı değil; Almanya yaşam rehberi arayan, iş bulma sürecini anlamak isteyen ve Türk topluluğuyla güvenli şekilde bağ kurmak isteyen kullanıcılar için karar destek sayfası olarak tasarlandı. Hedef, bilgi kalabalığını azaltıp sıradaki mantıklı adımı görünür hale getirmek."
      >
        <ContentCard title="Almanya'da yaşam rehberi" accentClassName="border-google-blue/45" defaultOpen>
          <p>
            Almanya'ya yeni taşınan biri için ilk problem çoğu zaman bilgi eksikliği değil, bilgi dağınıklığıdır. Adres kaydı,
            vergi numarası, banka hesabı, sağlık sigortası, telefon hattı ve oturum süreçleri aynı döneme yığıldığında,
            insanlar hangi adımı önce tamamlaması gerektiğini karıştırır. Bu nedenle Almanya101 ana sayfasında yalnızca içerik
            listelemek yerine, kullanıcıyı günlük hayatta en çok etkileyecek başlıklara doğrudan yönlendiren bir yapı kurduk.
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
            gibi kaynaklardan temel çerçeveyi kurmak gerekir. Böylece resmi işlem, günlük yaşam ve yerel destek başlıkları
            ayrı ayrı değil, birbirini tamamlayan tek bir yol haritası halinde okunabilir.
          </p>
        </ContentCard>

        <ContentCard title="İş bulma süreci" accentClassName="border-google-yellow/45">
          <p>
            Almanya'da iş bulma süreci yalnızca ilan sitelerine bakmaktan ibaret değildir. Özgeçmişin Alman işveren beklentilerine
            göre düzenlenmesi, başvuru metinlerinin pozisyona göre yeniden yazılması, maaş beklentisinin doğru kurulması ve sektör
            dilinin anlaşılması gerekir. Birçok aday iyi profillere sahip olmasına rağmen başvuru stratejisi eksik olduğu için geri
            dönüş alamaz. Bu yüzden ana sayfada hem araçlara hem de doğrudan iş fırsatlarına giden linkleri görünür hale getirdik.
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
            sayfaları birlikte kullanıldığında kullanıcı yalnızca bir ilana başvurmakla kalmaz; aynı zamanda teklifin gerçek hayatta
            nasıl karşılık bulacağını da görür. Bu yaklaşım, Almanya iş bulma arayışını daha ölçülebilir ve kontrollü hale getirir.
          </p>
        </ContentCard>

        <ContentCard title="Topluluk avantajları" accentClassName="border-google-green/45">
          <p>
            Yeni bir ülkede doğru insanlara ulaşmak, bazen en doğru belgeyi bulmaktan bile daha değerlidir. Çünkü taşınma sürecinde
            sorular yalnızca resmi işlemlerle sınırlı kalmaz; hangi şehir daha uygundur, ilk ev nasıl bulunur, hangi banka daha hızlı
            hesap açar, hangi işverenler Türkçe iletişim konusunda daha rahattır gibi gündelik ama kritik kararlar ortaya çıkar.
            Topluluk, bu noktada hazır cevap değil; deneyim filtresi sağlar.
          </p>
          <p>
            Bu nedenle ana sayfada{' '}
            <Link href="/topluluk" className="font-semibold text-white underline decoration-google-green underline-offset-4">
              topluluk sayfası
            </Link>
            ve WhatsApp erişimi, yalnızca bir sosyal kanal olarak değil, güvenilir bilgi dolaşımı için temel bir yapı olarak konumlandı.
            İnsanların birbirine yön verdiği, güncel deneyimleri paylaştığı ve yanlış bilgi maliyetini azalttığı bir topluluk; Almanya
            Türk topluluğu arayan kullanıcılar için arama sonucundan çok daha yüksek bir değere dönüşür.
          </p>
        </ContentCard>

        <ContentCard title="Belgeler, içerikler ve günlük aksiyon planı" accentClassName="border-white/20">
          <p>
            Taşınma veya yerleşme sürecinde en çok zaman kaybettiren şeylerden biri, doğru belgenin doğru anda elinizde olmamasıdır.
            Başvuru yapılacak kurumlar değiştikçe istenen evrak listeleri de değişebilir. Bu nedenle belgeleri, haberleri ve rehber içerikleri
            aynı yapıda görünür kılmak çok önemlidir. Kullanıcı bir yandan bilgi okurken, diğer yandan hemen kullanabileceği kontrol listelerine
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
            birbirini tamamlayan modüller olarak öne çıkarıldı. Böylece kullanıcı yalnızca “ne yapmalıyım?” sorusuna değil, “bugün hangi adımı
            tamamlamalıyım?” sorusuna da net bir cevap bulabilir. SEO açısından da bu yaklaşım, iç linkleme gücünü artırırken sayfalar arası niyet
            geçişlerini daha doğal hale getirir.
          </p>
        </ContentCard>
      </EditorialSection>

      <SectionDivider />

      <BackgroundSection
        backgroundImage="/images/backgrounds/berlin1.jpg"
        heightClassName="h-[500px] sm:h-[540px] lg:h-[580px]"
      >
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
            Haberler & Duyurular & Güncellemeler
          </h2>
        </div>
        <NewsCarousel items={newsItems} />
      </BackgroundSection>

      <SectionDivider />

      <BackgroundSection
        backgroundImage="/images/backgrounds/berlin4.jpg"
        overlayOpacity="bg-black/70"
        heightClassName="h-auto py-14 md:py-16"
      >
        <div className="w-full">
          <div className="text-center mb-4 sm:mb-5">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
              Topluluğumuza Katılın
            </h2>
            <p className="mx-auto max-w-3xl text-sm leading-7 text-white/78 sm:text-base">
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
              İletişim Kanallarımız & Sosyal Medya
            </h2>
          </div>
          <div className="grid grid-cols-5 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-9 gap-1.5 sm:gap-2 max-w-none mx-auto">
            {CONTACT_CHANNELS.map((channel) => (
              <ContactChannelCard
                key={channel.id}
                channel={channel}
                iconOnly
                className="mx-auto"
              />
            ))}
          </div>
        </div>
      </BackgroundSection>

      <SectionDivider />

      <FAQ
        title="Sık Sorulan Sorular"
        subtitle="Almanya'ya taşınma, iş bulma ve topluluğa katılma sürecinde en sık sorulan sorulara kısa cevaplar."
        items={HOMEPAGE_FAQ_ITEMS}
      />

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
