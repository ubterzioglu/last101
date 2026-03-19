import { createMetadata } from '@/lib/seo/metadata';
import BankaClient from './BankaClient';

export const metadata = createMetadata({
  title: 'Banka Seçim Aracı',
  description: '20 soruda Almanya için en uygun bankayı bulun. Dijital banka, direkt banka, yerel banka veya yatırım odaklı seçenekler.',
  path: '/banka-secim',
});

export default function BankaSecimPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050127] to-[#0a0a1a] py-8 px-4">
      {/* Header */}
      <div className="max-w-xl mx-auto mb-8 text-center">
        <div className="inline-flex items-center gap-2 mb-4">
          <span className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400" />
          <span className="text-white/80 text-sm font-medium">almanya101.de</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Banka Seçim Aracı
        </h1>
        <p className="text-white/70">20 soruyla size en uygun bankayı bulun!</p>
      </div>

      {/* Quiz Component */}
      <BankaClient />

      {/* Footer */}
      <div className="max-w-xl mx-auto mt-12 text-center">
        <div className="bg-[#01A1F1] rounded-2xl p-5 text-white">
          <p className="font-medium mb-1">yalnız değilsin! almanya101 seninle!</p>
          <p className="text-xs text-white/70">made by UBT with love</p>
          <p className="text-xs text-white/60 mt-2">&copy; almanya101de &bull; 2026</p>
        </div>
      </div>
    </div>
  );
}
