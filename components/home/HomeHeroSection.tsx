import Image from 'next/image';
import Link from 'next/link';
import { WhatsAppIcon } from '@/components/icons/ContactIcons';

interface HomeHeroSectionProps {
  whatsappHref?: string;
}

export function HomeHeroSection({ whatsappHref }: HomeHeroSectionProps) {
  return (
    <section className="relative flex min-h-[640px] flex-col items-center justify-center overflow-hidden bg-black pt-[25px] pb-10">
      {/* Atmosphere layers */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <div className="absolute inset-0 bg-aurora opacity-70" />
        <div className="absolute inset-0 bg-grid bg-grid-animated" />
        <div className="absolute inset-0 bg-noise mix-blend-soft-light" />
        {/* Neon glow blobs */}
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-google-blue/30 blur-[120px] animate-float-slow" />
        <div className="absolute -right-20 bottom-4 h-80 w-80 rounded-full bg-google-green/25 blur-[130px] animate-float-slow [animation-delay:2s]" />
        <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-google-red/20 blur-[120px] animate-pulse-glow" />
        {/* Vignette to keep text crisp */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
      </div>

      <div className="container relative z-10 mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-4xl text-center">
          <div className="reveal reveal-delay-1 neon-border inline-flex rounded-full bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/85 backdrop-blur-md">
            Almanya yaşam rehberi, iş fırsatları ve güçlü topluluk bağlantıları
          </div>

          <div className="reveal reveal-delay-2 relative mx-auto mt-7 w-fit">
            <div className="pointer-events-none absolute inset-0 -z-10 bg-google-blue/30 blur-3xl" aria-hidden="true" />
            <Image
              src="/almanya101lragetransparent.png"
              alt="almanya101"
              width={420}
              height={140}
              priority
              className="mx-auto h-24 w-auto sm:h-32 md:h-40"
            />
          </div>
          <span className="reveal reveal-delay-2 mx-auto mt-2 block text-xs tracking-wide text-white/55">
            Türkler için kapsamlı Almanya rehberi
          </span>

          <h1 className="reveal reveal-delay-3 mt-6 mb-4 font-display text-3xl font-bold leading-tight tracking-tight text-white md:text-5xl">
            Almanya&apos;da{' '}
            <span className="text-gradient-tech">Yaşam ve İş</span>{' '}
            İçin Türkçe Rehber
          </h1>

          <p className="reveal reveal-delay-4 mx-auto mt-5 max-w-3xl text-base leading-8 text-white/85 sm:text-lg">
            Almanya101, Almanya&apos;ya taşınmayı planlayan veya burada yaşayan Türkler için hazırlanmış kapsamlı bir Türkçe rehber platformudur.
            Günlük yaşam, resmi işlemler, iş bulma süreci, belgeler ve topluluk bağlantıları gibi konularda adım adım yönlendirme sunar.
            Banka, sigorta, maaş hesaplama, vize ve para transferi gibi pratik kararlar için araçlar; belgeler, yazı dizileri ve topluluk kanallarıyla ise bir sonraki adımınızı netleştirmenizi sağlar.
          </p>

          <div className="reveal reveal-delay-5 mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/is-ilanlari"
              className="inline-flex items-center justify-center rounded-full border border-google-yellow/40 bg-google-yellow/10 px-6 py-3 text-sm font-semibold text-google-yellow backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-google-yellow/70 hover:bg-google-yellow/20 hover:shadow-glow-yellow"
            >
              İşe Alım Firmaları
            </Link>
            <Link
              href="/haberler"
              className="inline-flex items-center justify-center rounded-full border border-google-red/40 bg-google-red/10 px-6 py-3 text-sm font-semibold text-google-red backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-google-red/70 hover:bg-google-red/20 hover:shadow-glow-red"
            >
              Güncel Haberleri Oku
            </Link>
            {whatsappHref ? (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-green-400/40 bg-green-500/15 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-green-300 hover:bg-green-500/25 hover:shadow-glow-green"
              >
                <WhatsAppIcon className="h-5 w-5" />
                WhatsApp Topluluğuna Katıl
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
