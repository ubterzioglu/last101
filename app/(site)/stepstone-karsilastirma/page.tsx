import { createMetadata } from '@/lib/seo/metadata';
import StepstoneClient from './StepstoneClient';

export const metadata = createMetadata({
  title: 'StepStone 2026 Maaş Karşılaştırma',
  description: 'StepStone 2026 maaş verilerine göre maaşlarınızı karşılaştırın ve analiz edin.',
  path: '/stepstone-karsilastirma',
});

export default function StepstoneKarsilastirmaPage() {
  return (
    <div className="min-h-screen bg-black pt-0 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <StepstoneClient />
    </div>
  );
}
