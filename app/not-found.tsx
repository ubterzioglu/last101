import Image from 'next/image';
import { ArrowLink } from '@/components/site/ArrowLink';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { createMetadata } from '@/lib/seo/metadata';

export const metadata = createMetadata({
  title: 'sayfa Bulunamadı',
  description: 'Aradığınız içerik şu anda burada değil, ama merak etme yalnız değilsin. almanya101 seninle!',
  path: '/404',
  noIndex: true,
});

export default function NotFound() {
  return (
    <section role="alert" aria-live="polite" className="py-16 md:py-24">
      <Container className="flex flex-col items-center text-center">
        <Image
          src="/almanya101header.png"
          alt="almanya101 logosu"
          width={1500}
          height={350}
          priority
          className="h-9 w-auto md:h-11"
        />

        <p className="mt-10 text-[clamp(6rem,18vw,11rem)] font-extrabold leading-none tracking-[-0.06em] text-brand-600">
          404
        </p>

        <h1 className="mt-6 text-[clamp(2.25rem,4vw,3.5rem)] font-extrabold leading-[1.06] tracking-[-0.04em] text-ink">
          sayfa bulunamadı
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted md:text-[17px]">
          Aradığınız içerik şu anda burada değil, ama merak etme yalnız değilsin! almanya101 seninle!
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          <Button href="/" arrow>
            Ana sayfaya dön
          </Button>
          <ArrowLink href="/almanya-araclari">Tüm araçlar</ArrowLink>
        </div>
      </Container>
    </section>
  );
}
