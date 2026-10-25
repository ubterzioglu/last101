import { createMetadata } from '@/lib/seo/metadata';
import { BreadcrumbJsonLd, WebPageJsonLd } from '@/components/seo/JsonLd';
import { ToolAccessGate } from '@/components/tools/ToolIntroPanel';
import StepstoneClient from './StepstoneClient';
import { SITE_URL } from '@/lib/utils/constants';

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
          { name: 'StepStone 2026 Maaş Karşılaştırma', url: pageUrl },
        ]}
      />
      <div className="min-h-screen bg-black pt-0 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <ToolAccessGate
          intro={{
            title: 'StepStone 2026 Maaş Karşılaştırma',
            description:
              'StepStone 2026 maaş verilerine göre kendi maaşını Almanya geneliyle karşılaştır: eyalet, deneyim, meslek grubu ve şirket büyüklüğüne göre nerede durduğunu gör.',
            highlights: [
              'Maaşını StepStone 2026 referans aralıklarıyla yan yana getirir.',
              'Eyalet, deneyim seviyesi ve meslek grubu kırılımında analiz sunar.',
              'Pazarlık ve iş değişikliği kararları için somut bir referans çerçevesi oluşturur.',
            ],
            toolPath: '/stepstone-karsilastirma',
          }}
        >
          <StepstoneClient />
        </ToolAccessGate>
      </div>
    </>
  );
}
