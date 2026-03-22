import { createMetadata } from '@/lib/seo/metadata';
import ParaTransferiClient from './ParaTransferiClient';

export const metadata = createMetadata({
  title: 'Para Transferi Seçim Aracı',
  description: 'Almanya\'dan Türkiye\'ye para transferi için en uygun aracı bulun. Düşük komisyon, hızlı transfer ve güvenilir seçenekler.',
  path: '/para-transferi',
});

export default function ParaTransferiPage() {
  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <ParaTransferiClient />
    </div>
  );
}
