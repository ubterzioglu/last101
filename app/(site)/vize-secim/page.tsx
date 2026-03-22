import { createMetadata } from '@/lib/seo/metadata';
import VizeClient from './VizeClient';

export const metadata = createMetadata({
  title: 'Almanya Vize Seçim Aracı',
  description: 'Hangi Almanya vizesine başvurmanız gerektiğini 10-13 soruyla öğrenin. EU Mavi Kart, Fachkräftevisa, Chancenkarte, IT Uzmanı Vizesi ve daha fazlası.',
  path: '/vize-secim',
});

export default function VizeSecimPage() {
  return (
    <div className="min-h-screen bg-black pt-0 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <VizeClient />
    </div>
  );
}
