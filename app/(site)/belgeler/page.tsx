import { createMetadata } from '@/lib/seo/metadata';

export const metadata = createMetadata({
  title: 'Belgeler',
  description: 'Almanya101 belgeler sayfası - Yakında hazır.',
  path: '/belgeler',
});

export default function BelgelerPage() {
  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-xl mx-auto">
        {/* Hero Card */}
        <div className="bg-[#01A1F1] rounded-2xl p-6 text-white mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-white/80" />
            <span className="text-white/80 text-sm">almanya101.de</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Belgeler</h1>
          <p className="text-white/90">Bu sayfa hazırlanıyor.</p>
        </div>

        {/* Info Card */}
        <div className="bg-[#FFBB00] rounded-2xl p-5 text-gray-900">
          <p className="text-sm">
            Belgeler sayfamız yakında sizlerle olacak. Almanya hayatında ihtiyaç duyabileceğiniz 
            çeşitli belgeler, formlar ve şablonlar burada yer alacak.
          </p>
        </div>

        {/* Footer Card */}
        <div className="bg-[#01A1F1] rounded-2xl p-5 text-white mt-6 text-center">
          <p className="font-medium mb-1">yalnız değilsin! almanya101 seninle!</p>
          <p className="text-xs text-white/70">made by UBT with love</p>
          <p className="text-xs text-white/60 mt-2">&copy; almanya101de &bull; 2026</p>
        </div>
      </div>
    </div>
  );
}
