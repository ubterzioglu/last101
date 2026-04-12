import Image from 'next/image';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <section className="min-h-[calc(100vh-10rem)] bg-black px-4 py-16 text-white md:py-24">
      <div className="container flex items-center justify-center">
        <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.04] px-8 py-10 text-center shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur">
          <div className="mx-auto relative h-20 w-20 overflow-hidden rounded-3xl border border-white/10 bg-white p-3 shadow-lg">
            <Image
              src="/almanya101.png"
              alt="almanya101 logosu"
              fill
              className="object-contain"
              priority
            />
          </div>

          <div className="mt-8 space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-white/45">404</p>
            <h1 className="text-3xl font-black tracking-[-0.04em] text-white md:text-4xl">
              Sayfa bulunamadı
            </h1>
            <p className="text-sm leading-7 text-white/60 md:text-base">
              Aradığınız içerik şu anda burada değil.
            </p>
          </div>

          <div className="mt-8 flex justify-center">
            <Button href="/" asChild size="lg" className="rounded-full px-7">
              Ana sayfaya dön
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
