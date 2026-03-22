import { createMetadata } from '@/lib/seo/metadata';

export const metadata = createMetadata({
  title: 'Yazı Dizisi',
  description: 'Almanya hayatıyla ilgili adım adım yazılar, pratik rehberler ve sade anlatımlar.',
  path: '/yazi-dizisi',
});

export default function YaziDizisiPage() {
  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-xl mx-auto">
        <div className="bg-[#01A1F1] rounded-2xl p-6 text-white mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Yazı Dizisi</h1>
          <p className="text-white/90">Bu sayfa hazırlanıyor.</p>
        </div>
        <div className="bg-[#FFBB00] rounded-2xl p-5 text-gray-900">
          <p className="text-sm">
            Almanya hayatıyla ilgili adım adım yazılar, pratik rehberler ve sade anlatımlar 
            yakında burada olacak.
          </p>
        </div>
        <div className="bg-[#01A1F1] rounded-2xl p-5 text-white mt-6 text-center">
          <p className="font-medium mb-1">yalnız değilsin! almanya101 seninle!</p>
          <p className="text-xs text-white/70">made by UBT with love</p>
          <p className="text-xs text-white/60 mt-2">&copy; almanya101de &bull; 2026</p>
        </div>
      </div>
    </div>
  );
}
