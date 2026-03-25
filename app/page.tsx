import Image from 'next/image';
import { createMetadata } from '@/lib/seo/metadata';
import { NewsCarousel } from '@/components/sections/NewsCarousel';
import { LinkGridSection } from '@/components/home/LinkGridSection';
import { ContactChannelCard } from '@/components/home/ContactChannelCard';
import { ArrowUpIcon, WhatsAppIcon } from '@/components/icons/ContactIcons';
import { cn } from '@/lib/utils/cn';
import { NEWS_ITEMS } from '@/lib/content/news';
import {
  TOOL_ITEMS,
  OTHER_LINK_ITEMS,
} from '@/constants/home-data';
import { CONTACT_CHANNELS } from '@/constants/contact-channels';

export const metadata = createMetadata({
  title: 'Ana Sayfa',
  description:
    "Almanya'da yaşayan veya taşınmayı planlayan Türkler için kapsamlı bilgi rehberi, iş ilanları ve topluluk platformu.",
  path: '/',
});

const HOMEPAGE_ITEMS = [...TOOL_ITEMS, ...OTHER_LINK_ITEMS];

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
        'flex items-center relative bg-cover bg-center py-12',
        heightClassName,
        className
      )}
      style={{ backgroundImage: `url(${backgroundImage})` }}
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

export default function HomePage() {
  return (
    <>
      <section
        className="min-h-[820px] flex flex-col items-center relative bg-cover bg-center pt-[25px] pb-4"
        style={{ backgroundImage: 'url(/images/backgrounds/hero.jpg)' }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="text-center mb-10">
            <Image
              src="/almanya101lragetransparent.png"
              alt="almanya101"
              width={420}
              height={140}
              priority
              className="mx-auto h-24 w-auto drop-shadow-2xl sm:h-32 md:h-40"
            />
          </div>

          <LinkGridSection
            title=""
            items={HOMEPAGE_ITEMS}
            className="bg-transparent min-h-0 h-auto py-0 mb-3"
            gridClassName="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 max-w-none"
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

      <BackgroundSection
        backgroundImage="/images/backgrounds/berlin1.jpg"
        heightClassName="h-[500px] sm:h-[540px] lg:h-[580px]"
      >
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
            Haberler & Duyurular & Güncellemeler
          </h2>
        </div>
        <NewsCarousel items={NEWS_ITEMS} />
      </BackgroundSection>

      <SectionDivider />

      <BackgroundSection
        backgroundImage="/images/backgrounds/berlin4.jpg"
        overlayOpacity="bg-black/70"
        heightClassName="h-[360px]"
      >
        <div className="w-full">
          <div className="text-center mb-4 sm:mb-5">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
              Topluluğumuza Katılın
            </h2>
          </div>

          <div className="flex justify-center mb-4 sm:mb-5">
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

          <div className="text-center mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
              İletişim Kanallarımız & Sosyal Medya
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-9 gap-1.5 sm:gap-2 max-w-none mx-auto">
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
