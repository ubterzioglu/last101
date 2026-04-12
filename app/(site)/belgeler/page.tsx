import { createMetadata } from '@/lib/seo/metadata';

export const metadata = createMetadata({
  title: 'Belgeler',
  description: 'Bu içerik çok yakında sizlerle! Yalnız değilsin almanya101 seninle!',
  path: '/belgeler',
});

export default function BelgelerPage() {
  return (
    <div className="min-h-screen bg-black px-4 py-8">
      <div className="mx-auto max-w-xl">
        <div className="rounded-2xl bg-[#01A1F1] p-6 text-white sm:p-8">
          <h1 className="mb-3 text-2xl font-bold sm:text-3xl">Belgeler</h1>
          <p className="text-base leading-7 text-white/95">
            Bu içerik çok yakında sizlerle! Yalnız değilsin almanya101 seninle!
          </p>
        </div>
      </div>
    </div>
  );
}
