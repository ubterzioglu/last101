import { Handshake, MessageCircleQuestion, MessagesSquare, PartyPopper, type LucideIcon } from 'lucide-react';
import { createMetadata } from '@/lib/seo/metadata';
import { CtaRow } from '@/components/site/CtaRow';
import { DarkBand } from '@/components/site/DarkBand';
import { PageHead } from '@/components/site/PageHead';
import { PhotoCard } from '@/components/site/PhotoCard';
import { SectionHeader } from '@/components/site/SectionHeader';
import { TONE_STYLES, toneAt } from '@/components/site/tones';
import { Button } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';
import { cn } from '@/lib/utils/cn';

export const metadata = createMetadata({
  title: 'Topluluk',
  description: 'Almanya\'da yaşayan Türkler için topluluk platformu. Sorular sorun, cevaplar verin, deneyim paylaşın.',
  path: '/topluluk',
});

interface CommunityFeature {
  title: string;
  description: string;
  icon: LucideIcon;
}

const FEATURES: CommunityFeature[] = [
  {
    title: 'Sorularınızı Sorun',
    description: 'Almanya ile ilgili her türlü soruyu sorun. Deneyimli kullanıcılardan cevap alın.',
    icon: MessageCircleQuestion,
  },
  {
    title: 'Deneyimlerinizi Paylaşın',
    description: 'Kendi deneyimlerinizi paylaşın. Başkalarına yardım edin ve topluluğa katkı sağlayın.',
    icon: MessagesSquare,
  },
  {
    title: 'Dostluklar Kurun',
    description: 'Almanya\'daki diğer Türklerle tanışın. Yeni dostluklar ve network kurun.',
    icon: Handshake,
  },
  {
    title: 'Etkinliklere Katılın',
    description: 'Çevrim içi ve çevrim dışı etkinliklere katılın. Yeni insanlarla tanışın.',
    icon: PartyPopper,
  },
];

function FeatureTiles() {
  return (
    <ul className="grid grid-cols-1 border-y border-line sm:grid-cols-2 lg:grid-cols-4">
      {FEATURES.map(({ title, description, icon: Icon }, index) => {
        const tone = TONE_STYLES[toneAt(index)];
        return (
          <li
            key={title}
            className={cn(
              'px-[18px] py-6',
              index > 0 && 'border-t border-line sm:border-t-0',
              index % 2 === 1 && 'sm:border-l',
              index >= 2 && 'sm:border-t lg:border-t-0',
              index > 0 && 'lg:border-l'
            )}
          >
            <span aria-hidden="true" className={cn('flex h-10 w-10 items-center justify-center rounded-tile', tone.tint, tone.text)}>
              <Icon className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <h3 className="mt-4 text-[17px] font-extrabold leading-snug tracking-[-0.02em] text-ink">{title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{description}</p>
          </li>
        );
      })}
    </ul>
  );
}

export default function ToplulukPage() {
  return (
    <>
      <PageHead
        title="Topluluğumuza Katılın"
        description="Binlerce Türk Almanya'da yaşadığı deneyimleri paylaşmaya hazır. Sorular sorun, cevaplar verin, dostluklar kurun."
        media={
          <PhotoCard src="/images/site/ofis-ekip.webp" alt="Bir araya gelmiş bir ekip" priority />
        }
      />

      <Section aria-labelledby="topluluk-ozellikleri">
        <SectionHeader
          id="topluluk-ozellikleri"
          title="Topluluk Özellikleri"
          description="Sizin için neler yapabileceğimizi keşfedin."
          className="mb-10"
        />
        <FeatureTiles />
      </Section>

      <DarkBand
        id="topluluk-yakinda"
        title="Yakında!"
        description="Topluluk platformu şu anda geliştirme aşamasında. Yakında tamamlanacak ve size daha iyi bir deneyim sunacak."
      >
        <p className="inline-flex items-center gap-2 font-semibold text-white">
          <span aria-hidden="true" className="h-3 w-3 rounded-full bg-brand-500" />
          Geliştiriliyor
        </p>
      </DarkBand>

      <CtaRow
        title="Hemen Kayıt Olun"
        description="Platform yayına girdiğinde ilk bilgilendirilen siz olun. Bültenimize kayıt olun."
        action={
          <div className="flex flex-wrap gap-3">
            <Button href="/iletisim" arrow>
              Bültenimize Kayıt Olun
            </Button>
            <Button href="/hakkimizda" variant="outline">
              Daha Fazla Bilgi
            </Button>
          </div>
        }
      />
    </>
  );
}
