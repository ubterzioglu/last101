import { createMetadata } from '@/lib/seo/metadata';
import MaasClient from './MaasClient';

export const metadata = createMetadata({
  title: 'Maaş Hesaplayıcı',
  description: 'Almanya\'da brüt maaşınızı net maaşa, net maaşınızı brüt maaşa dönüştürün. Vergi sınıfı, eyalet, çocuk durumu ve daha fazlasını hesaplayın.',
  path: '/maas-hesaplama',
});

export default function MaasHesaplamaPage() {
  return (
    <div className="min-h-screen bg-black pt-0 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Calculator */}
      <MaasClient />
    </div>
  );
}
