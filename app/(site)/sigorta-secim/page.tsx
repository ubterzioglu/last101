import { createMetadata } from '@/lib/seo/metadata';
import SigortaClient from './SigortaClient';

export const metadata = createMetadata({
  title: 'Sigorta Seçim Aracı',
  description: '20 soruda Almanya için sigortalarınızı önceliklendirin. Önce Al, Güçlü Öneri, Opsiyonel kategorileri.',
  path: '/sigorta-secim',
});

export default function SigortaSecimPage() {
  return (
    <div className="min-h-screen bg-black pt-0 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <SigortaClient />
    </div>
  );
}
