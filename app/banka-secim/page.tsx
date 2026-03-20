import { createMetadata } from '@/lib/seo/metadata';
import BankaClient from './BankaClient';

export const metadata = createMetadata({
  title: 'Banka Seçim Aracı',
  description: '20 soruda Almanya için en uygun bankayı bulun. Dijital banka, direkt banka, yerel banka veya yatırım odaklı seçenekler.',
  path: '/banka-secim',
});

export default function BankaSecimPage() {
  return (
    <div className="min-h-screen bg-black py-8 px-4">
      {/* Quiz */}
      <BankaClient />

    </div>
  );
}
