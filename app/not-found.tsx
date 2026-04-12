import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { createMetadata } from '@/lib/seo/metadata';

export const metadata = createMetadata({
  title: 'sayfa Bulunamadı',
  description: 'Aradığınız içerik şu anda burada değil, ama merak etme yalnız değilsin. almanya101 seninle!',
  path: '/404',
  noIndex: true,
});

export default function NotFound() {
  return (
    <section
      role="alert"
      aria-live="polite"
      className="relative min-h-[calc(100vh-10rem)] overflow-hidden bg-[#050505] px-4 py-16 text-white md:py-24"
    >
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-24 h-56 w-56 -translate-x-1/2 rounded-full bg-google-yellow/18 blur-3xl" />
        <div className="absolute left-1/2 top-40 h-72 w-72 -translate-x-1/2 rounded-full bg-google-blue/16 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black via-black/80 to-transparent" />
      </div>

      <div className="container relative flex items-center justify-center">
        <div className="w-full max-w-2xl rounded-[2.5rem] border border-white/10 bg-white/[0.03] px-8 py-12 text-center shadow-[0_36px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl md:px-12 md:py-14">
          <div className="relative mx-auto flex h-24 w-80 items-center justify-center md:h-32 md:w-[26rem]">
            <div className="absolute inset-x-10 top-1/2 h-16 -translate-y-1/2 rounded-full bg-google-yellow/35 blur-3xl" />
            <div className="absolute inset-x-16 top-1/2 h-12 -translate-y-1/2 rounded-full bg-white/18 blur-2xl" />
            <div className="relative h-full w-full drop-shadow-[0_0_28px_rgba(251,188,5,0.35)]">
              <Image
                src="/almanya101.png"
                alt="almanya101 logosu"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          <div className="mt-10 space-y-4">
            <h1 className="text-4xl font-black tracking-[-0.05em] text-white md:text-6xl">
              sayfa bulunamadı
            </h1>
            <p className="mx-auto max-w-xl text-base leading-8 text-white/72 md:text-lg">
              Aradığınız içerik şu anda burada değil, ama merak etme yalnız değilsin! almanya101 seninle!
            </p>
          </div>

          <div className="mt-10 flex justify-center">
            <Button href="/" asChild size="lg" className="rounded-full px-7">
              Ana sayfaya dön
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
