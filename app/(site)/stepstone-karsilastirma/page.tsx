import { createMetadata } from '@/lib/seo/metadata';
import StepstoneClient from './StepstoneClient';

export const metadata = createMetadata({
  title: 'Stepstone 2026 Maaş Karşılaştırma',
  description: 'Stepstone 2026 verilerine göre Almanya\'da maaşınızı meslek grubu, şehir, deneyim ve şirket büyüklüğüne göre karşılaştırın.',
  path: '/stepstone-karsilastirma',
});

export default function StepstoneKarsilastirmaPage() {
  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <StepstoneClient />
    </div>
  );
}
