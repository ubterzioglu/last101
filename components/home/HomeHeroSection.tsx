import Image from 'next/image';
import Link from 'next/link';
import { WhatsAppIcon } from '@/components/icons/ContactIcons';

interface HomeHeroSectionProps {
  whatsappHref?: string;
}

export function HomeHeroSection({ whatsappHref }: HomeHeroSectionProps) {
  return (
    <section className="min-h-[600px] flex flex-col items-center justify-center relative bg-black pt-[25px] pb-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="mx-auto max-w-4xl text-center mb-10">
          <div className="inline-flex rounded-full border border-white/15 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/80">
            Almanya yaşam rehberi, iş fırsatları ve güçlü topluluk bağlantıları
          </div>
          <Image
            src="/almanya101lragetransparent.png"
            alt="almanya101"
            width={420}
            height={140}
            priority
            className="mx-auto mt-6 h-24 w-auto drop-shadow-2xl sm:h-32 md:h-40"
          />

          <h1 className="mt-6 mb-4 text-3xl font-bold text-white md:text-4xl">
            Almanya&apos;da Yaşam ve İş İçin Türkçe Rehber
          </h1>
          <p className="mx-auto mt-5 max-w-4xl text-base leading-8 text-white sm:text-lg">
            Almanya&apos;ya taşınmayı planlayan ya da halihazırda burada yaşayan Türkler için; günlük yaşam,
            resmi işlemler, iş bulma süreci, belgeler ve topluluk bağlantıları aynı yerde toparlandı.
            Nereden başlayacağınızı düşünmek yerine doğru sırayı, doğru kaynakları ve güvenilir yönlendirmeleri kullanın.
            {' '}Ana araçlarımızla banka, sigorta, maaş, vize ve para transferi gibi pratik kararları hızlandırabilir; belgeler,
            yazı dizileri ve topluluk kanalları üzerinden bir sonraki adımınızı netleştirebilirsiniz.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/is-ilanlari"
              className="inline-flex items-center justify-center rounded-full border border-google-yellow/40 bg-google-yellow/10 px-6 py-3 text-sm font-semibold text-google-yellow transition hover:scale-[1.02] hover:border-google-yellow/60 hover:bg-google-yellow/20"
            >
              İşe Alım Firmaları
            </Link>
            <Link
              href="/haberler"
              className="inline-flex items-center justify-center rounded-full border border-google-red/40 bg-google-red/10 px-6 py-3 text-sm font-semibold text-google-red transition hover:border-google-red/60 hover:bg-google-red/20"
            >
              Güncel Haberleri Oku
            </Link>
            {whatsappHref ? (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-green-400/40 bg-green-500/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-green-300 hover:bg-green-500/25"
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