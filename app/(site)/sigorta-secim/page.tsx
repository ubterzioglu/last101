import { createMetadata } from '@/lib/seo/metadata';
import SigortaClient from './SigortaClient';

export const metadata = createMetadata({
  title: 'Sigorta Seçim Aracı',
  description: '20 soruda Almanya için sigortalarınızı önceliklendirin. Önce Al, Güçlü Öneri, Opsiyonel kategorileri.',
  path: '/sigorta-secim',
});

export default function SigortaSecimPage() {
  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <SigortaClient />
    </div>
  );
}
