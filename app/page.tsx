import { createMetadata } from '@/lib/seo/metadata';
import { HomeCommunityBand } from '@/components/home/HomeCommunityBand';
import { HomeCostSection } from '@/components/home/HomeCostSection';
import { HomeFaqSection } from '@/components/home/HomeFaqSection';
import { HomeFooterNote } from '@/components/home/HomeFooterNote';
import { HomeGuideSection } from '@/components/home/HomeGuideSection';
import { HomeHero } from '@/components/home/HomeHero';
import { HomeNewsSection } from '@/components/home/HomeNewsSection';
import { HomeServicesSection } from '@/components/home/HomeServicesSection';
import { BreadcrumbJsonLd, FaqJsonLd, HowToJsonLd, SpeakableJsonLd, WebPageJsonLd } from '@/components/seo/JsonLd';
import { IntentStrip } from '@/components/site/IntentStrip';
import { getPublishedNewsItems } from '@/lib/public-news';
import { CANONICAL_SITE_URL, DEFAULT_META_DESCRIPTION, DEFAULT_SEO_TITLE } from '@/lib/utils/constants';
import { HOMEPAGE_FAQ_ITEMS, HOME_INTENT_ITEMS } from '@/constants/home-data';
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

const HOME_PAGE_URL = CANONICAL_SITE_URL;
const WHATSAPP_COMMUNITY_HREF = CONTACT_CHANNELS.find((channel) => channel.id === 'whatsapp')?.href;

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
      <SpeakableJsonLd cssSelector={['.home-hero p', '.faq-section p']} />

      <HomeHero whatsappHref={WHATSAPP_COMMUNITY_HREF} />
      <IntentStrip label="Bugün neyi halledelim?" items={HOME_INTENT_ITEMS} />
      <HomeServicesSection />
      <HomeNewsSection items={newsItems} />
      <HomeGuideSection />
      <HomeCostSection />
      <HomeFaqSection />
      <HomeCommunityBand whatsappHref={WHATSAPP_COMMUNITY_HREF} />
      <HomeFooterNote />
    </>
  );
}
