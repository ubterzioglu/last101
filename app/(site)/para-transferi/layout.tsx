import { createMetadata } from '@/lib/seo/metadata';

export const metadata = createMetadata({
  title: 'Para Transferi Seçim Aracı',
  description: 'Almanya\'dan Türkiye\'ye para transferi için en uygun aracı bulun. Düşük komisyon, hızlı transfer ve güvenilir seçenekler.',
  path: '/para-transferi',
});

export default function ParaTransferiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
