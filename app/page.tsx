import { createMetadata } from '@/lib/seo/metadata';
import { NewsCarousel } from '@/components/sections/NewsCarousel';
import { ArticleGrid } from '@/components/sections/ArticleCard';
import { LinkGridSection } from '@/components/home/LinkGridSection';
import { ContactChannelCard } from '@/components/home/ContactChannelCard';
import { ArrowUpIcon, WhatsAppIcon } from '@/components/icons/ContactIcons';
import { NEWS_ITEMS, TOOL_ITEMS, OTHER_LINK_ITEMS } from '@/constants/home-data';
import { CONTACT_CHANNELS } from '@/constants/contact-channels';
import type { Article } from '@/types';

export const metadata = createMetadata({
  title: 'Ana Sayfa',
  description: "Almanya'da yaşayan veya taşınmayı planlayan Türkler için kapsamlı bilgi rehberi, iş ilanları ve topluluk platformu.",
  path: '/',
});

const ARTICLES: Article[] = [
  {
    id: '1',
    title: 'Almanya\'da İş Bulmak: Kapsamlı Rehber',
    excerpt: 'Almanya\'da iş arama süreci, CV hazırlama, mülakat teknikleri ve iş bulma stratejileri hakkında bilmeniz gereken her şey.',
    category: 'Kariyer',
    date: '15 Ocak 2025',
    readTime: '8 dk',
  },
  {
    id: '2',
    title: 'İkamet İzni Türleri ve Başvuru Süreci',
    excerpt: 'Almanya\'daki farklı ikamet izni türleri, başvuru şartları ve adım adım başvuru süreci.',
    category: 'Vize',
    date: '12 Ocak 2025',
    readTime: '12 dk',
  },
  {
    id: '3',
    title: 'Almanya\'da Sağlık Sigortası Nasıl Alınır?',
    excerpt: 'Zorunlu sağlık sigortası sistemleri, karşılaştırma ve doğru sigortayı seçme rehberi.',
    category: 'Sağlık',
    date: '10 Ocak 2025',
    readTime: '6 dk',
  },
];

interface SectionProps {
  backgroundImage: string;
  children: React.ReactNode;
  className?: string;
  overlayOpacity?: string;
}

function BackgroundSection({
  backgroundImage,
  children,
  className,
  overlayOpacity = 'bg-black/60',
}: SectionProps) {
  return (
    <section
      className={`min-h-[60vh] sm:min-h-[80vh] flex items-center relative bg-cover bg-center py-12 sm:py-0 ${className || ''}`}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className={`absolute inset-0 ${overlayOpacity}`} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">{children}</div>
    </section>
  );
}

function SectionDivider() {
  return <div className="h-[10px] bg-black" />;
}

export default function HomePage() {
  return (
    <>
      {/* Hero Section - Tools Grid */}
      <section
        className="min-h-screen flex flex-col items-center justify-center relative bg-cover bg-center py-8"
        style={{ backgroundImage: 'url(/images/backgrounds/hero.jpg)' }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              almanya101'e hoş geldin!
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-200">
              yalnız değilsin! almanya101 seninle!
            </p>
          </div>

          <LinkGridSection
            title="Araçlar"
            subtitle="İhtiyacınıza göre hesaplama ve planlama araçları"
            items={TOOL_ITEMS}
            className="bg-transparent min-h-0 py-0 mb-12"
          />
        </div>
      </section>

      <SectionDivider />

      {/* Other Links Section */}
      <LinkGridSection
        title="Diğer Başlıklar"
        subtitle="Daha fazla bilgi ve içerik"
        items={OTHER_LINK_ITEMS}
        className="min-h-screen"
      />

      <SectionDivider />

      {/* News Section */}
      <BackgroundSection backgroundImage="/images/backgrounds/berlin1.jpg">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
            Haberler & Duyurular & Güncellemeler
          </h2>
        </div>
        <NewsCarousel items={NEWS_ITEMS} />
      </BackgroundSection>

      <SectionDivider />

      {/* Placeholder Section */}
      <BackgroundSection backgroundImage="/images/backgrounds/berlin3.jpg">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
            Placeholder Bölüm 2
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-200 max-w-2xl mx-auto mb-6 sm:mb-8">
            Bu bölüm için içerik yakında eklenecektir. Şu an placeholder olarak kullanılmaktadır.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <a
              href="#"
              className="inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-black text-sm sm:text-base font-medium rounded-md hover:bg-gray-100 transition-colors"
            >
              Daha Fazla Bilgi
            </a>
          </div>
        </div>
      </BackgroundSection>

      <SectionDivider />

      {/* Articles Section */}
      <BackgroundSection backgroundImage="/images/backgrounds/frankfurt2.jpg">
        <div className="w-full">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
              Popüler Rehberler
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-200 max-w-2xl mx-auto">
              En çok okunan rehberler ve makaleler.
            </p>
          </div>
          <ArticleGrid articles={ARTICLES} columns={3} />
          <div className="text-center mt-6 sm:mt-8">
            <a
              href="/rehber"
              className="text-white hover:text-gray-300 text-sm sm:text-base font-medium transition-colors underline"
            >
              Tüm Rehberleri Gör →
            </a>
          </div>
        </div>
      </BackgroundSection>

      <SectionDivider />

      {/* CTA Section */}
      <BackgroundSection backgroundImage="/images/backgrounds/hero.jpg">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
            Topluluğumuza Katılın
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-200 max-w-2xl mx-auto mb-6 sm:mb-8">
            Binlerce Türk Almanya'da yaşadığı deneyimleri paylaşmaya hazır. Sorular sorun, cevaplar verin, dostluklar kurun.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <a
              href="https://chat.whatsapp.com/JXzMvjJoc57EKDDABSB0jo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-green-500 text-white text-sm sm:text-base font-medium rounded-md hover:bg-green-600 transition-colors"
            >
              <WhatsAppIcon className="w-5 h-5" />
              WhatsApp Topluluğuna Katıl
            </a>
          </div>
        </div>
      </BackgroundSection>

      <SectionDivider />

      {/* Contact Section */}
      <BackgroundSection backgroundImage="/images/backgrounds/berlin5.jpg" overlayOpacity="bg-black/70">
        <div className="w-full">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
              Bize Ulaşın
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-300 max-w-2xl mx-auto">
              Sorularınız için 9 farklı kanaldan bize ulaşabilirsiniz
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {CONTACT_CHANNELS.map((channel) => (
              <ContactChannelCard key={channel.id} channel={channel} />
            ))}
          </div>
        </div>
      </BackgroundSection>

      {/* Scroll to top button */}
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
