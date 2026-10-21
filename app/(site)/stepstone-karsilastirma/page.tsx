import { createMetadata } from '@/lib/seo/metadata';
import { BreadcrumbJsonLd, WebPageJsonLd } from '@/components/seo/JsonLd';
import { ToolHero } from '@/components/tools/ToolHero';
import { ToolInfoBand } from '@/components/tools/ToolInfoBand';
import { getSortedCities, getSortedJobGroups } from '@/lib/salary/stepstone-data';
import StepstoneClient from './StepstoneClient';
import { SITE_URL } from '@/lib/utils/constants';

const HOW_IT_WORKS = [
  'Aylık brüt maaşını ve profilini gir, Stepstone 2026 medyanlarıyla karşılaştır.',
  'Eyalet, meslek grubu, deneyim, şehir gibi 8 farklı boyutta analiz üretilir.',
  'Kaynak: Stepstone Gehaltsreport 2026 (PDF). Bilgilendirme amaçlıdır.',
];

const WHY_TEXT =
  "Almanya iş piyasasında maaş müzakeresi yaparken elinizde somut veri olması büyük avantaj sağlar. Bu araç, StepStone'un 2026 yılı için derlediği kapsamlı maaş raporundaki medyan değerleriyle mevcut brüt maaşını karşılaştırır. Eyalet, meslek grubu, deneyim yılı, şehir büyüklüğü, şirket büyüklüğü, eğitim düzeyi ve cinsiyet gibi etkenlerin maaşa olan katkısını boyut boyut görebilirsin. Zam talebin ya da yeni iş teklifini değerlendirirken piyasa verisine dayalı güçlü bir perspektif sunar.";

const HERO_STATS = [
  { value: String(getSortedJobGroups().length), label: 'meslek grubu' },
  { value: String(getSortedCities().length), label: 'şehir' },
  { value: 'Ücretsiz', label: 'üyelere açık' },
];

export const metadata = createMetadata({
  title: 'StepStone 2026 Maaş Karşılaştırma',
  description: 'StepStone 2026 maaş verilerine göre maaşlarınızı karşılaştırın ve analiz edin.',
  path: '/stepstone-karsilastirma',
});

export default function StepstoneKarsilastirmaPage() {
  const pageUrl = new URL('/stepstone-karsilastirma', SITE_URL).toString();

  return (
    <>
      <WebPageJsonLd
        title="StepStone 2026 Maaş Karşılaştırma"
        description="StepStone 2026 maaş verilerine göre maaşlarınızı karşılaştırın ve analiz edin."
        url={pageUrl}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Ana Sayfa', url: new URL('/', SITE_URL).toString() },
          { name: 'StepStone Maaş Karşılaştırma', url: pageUrl },
        ]}
      />
      <ToolHero
        eyebrow="Kariyer ve Gelir"
        title="Stepstone 2026 Karşılaştırma"
        intro="StepStone 2026 maaş verilerine göre maaşlarınızı karşılaştırın ve analiz edin."
        stats={HERO_STATS}
        howItWorksTitle="Nasıl Çalışır?"
        howItWorks={HOW_IT_WORKS}
      />
      <StepstoneClient />
      <ToolInfoBand why={WHY_TEXT} />
    </>
  );
}
