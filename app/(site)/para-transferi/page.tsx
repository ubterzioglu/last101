import { createMetadata } from '@/lib/seo/metadata';
import { TransferSelector } from '@/components/para-transferi/transfer-selector';

export const metadata = createMetadata({
  title: 'Para Transferi Seçim Aracı',
  description: 'Almanya\'dan Türkiye\'ye para transferi için en uygun aracı bulun. Düşük komisyon, hızlı transfer ve güvenilir seçenekler.',
  path: '/para-transferi',
});

export default function ParaTransferiPage() {
  return (
    <div className="min-h-screen bg-black pt-0 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <TransferSelector />
    </div>
  );
}
