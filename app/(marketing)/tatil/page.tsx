import { Metadata } from 'next';
import { ArrowRight, Calculator, Calendar, CalendarDays, Globe, type LucideIcon } from 'lucide-react';
import { createMetadata } from '@/lib/seo/metadata';
import { ColorTile } from '@/components/site/ColorTile';
import { PageHead } from '@/components/site/PageHead';
import { SectionHeader } from '@/components/site/SectionHeader';
import { StepList } from '@/components/site/StepList';
import { TONE_STYLES, type SiteTone } from '@/components/site/tones';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

export const metadata: Metadata = createMetadata({
  title: 'Tatil Planlayıcı',
  description: 'Almanya ve Türkiye için 2026 tatil planlayıcı. İzin günlerinizi en verimli şekilde kullanın.',
  path: '/tatil',
});

interface PlannerCard {
  href: string;
  title: string;
  description: string;
  features: { icon: LucideIcon; label: string }[];
  cta: string;
  tone: SiteTone;
}

const PLANNERS: PlannerCard[] = [
  {
    href: '/tatil/almanya',
    title: 'Almanya',
    description:
      'Bundesland seçiminize göre eyalete özel tatilleri hesaplayın. Almanya\'nın 16 federal eyaleti için farklı tatil günlerini içerir.',
    features: [
      { icon: Calendar, label: 'Eyalete özel tatiller' },
      { icon: Calculator, label: 'İzin verimlilik analizi' },
      { icon: ArrowRight, label: 'Hafta hafta detaylı plan' },
    ],
    cta: 'Almanya Planlayıcı',
    tone: 'yellow',
  },
  {
    href: '/tatil/turkiye',
    title: 'Türkiye',
    description:
      'Türkiye\'nin 2026 resmî tatillerini hesaplayın. Ramazan ve Kurban Bayramları, ulusal bayramlar ve arefe günleri dahildir.',
    features: [
      { icon: Calendar, label: 'Dini ve ulusal bayramlar' },
      { icon: Calculator, label: 'Arefe (yarım gün) hesaplama' },
      { icon: ArrowRight, label: 'Uzatma tüyoları' },
    ],
    cta: 'Türkiye Planlayıcı',
    tone: 'red',
  },
];

const STEPS = [
  { title: 'Tarih Seçin', description: 'Başlangıç ve bitiş tarihlerini seçin' },
  { title: 'Hesaplayın', description: 'Sistem otomatik olarak hesaplar' },
  { title: 'Planlayın', description: 'Verimli izin kullanımı planlayın' },
];

function PlannerCardView({ planner }: { planner: PlannerCard }) {
  const tone = TONE_STYLES[planner.tone];

  return (
    <article className="flex flex-col rounded-card border border-line bg-white p-6 transition-colors hover:border-ink/30 md:p-8">
      <div className="mb-4 flex items-center gap-3">
        <span aria-hidden="true" className={cn('flex h-12 w-12 items-center justify-center rounded-tile', tone.tint, tone.text)}>
          <Globe className="h-6 w-6" strokeWidth={1.75} />
        </span>
        <h2 className="text-[26px] font-extrabold tracking-[-0.03em] text-ink">{planner.title}</h2>
      </div>
      <p className="mb-6 leading-relaxed text-muted">{planner.description}</p>
      <ul className="mb-8 divide-y divide-line border-y border-line text-sm text-ink">
        {planner.features.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-2.5 py-3">
            <Icon aria-hidden="true" className="h-4 w-4 shrink-0 text-alm-green-ink" />
            {label}
          </li>
        ))}
      </ul>
      <Button href={planner.href} arrow className="mt-auto w-full">
        {planner.cta}
      </Button>
    </article>
  );
}

export default function TatilLandingPage() {
  return (
    <>
      <PageHead
        title="Tatil Planlayıcı"
        description="2026 yılı için Almanya ve Türkiye tatil planlayıcı. İzin günlerinizi en verimli şekilde kullanın, hafta sonları ve resmî tatilleri hesaba katarak maksimum dinlenme süresi elde edin."
        stats={[
          { value: '2', label: 'Ülke' },
          { value: '16', label: 'Federal eyalet' },
        ]}
        media={
          <ColorTile
            icon={CalendarDays}
            tone="orange"
            kicker="Almanya ve Türkiye"
            title="2026 tatil planı"
            aspect="hero"
          />
        }
      />

      <Section>
        <div className="grid grid-cols-1 gap-[22px] md:grid-cols-2">
          {PLANNERS.map((planner) => (
            <PlannerCardView key={planner.href} planner={planner} />
          ))}
        </div>
      </Section>

      <Section tone="band" aria-labelledby="tatil-nasil-calisir">
        <SectionHeader id="tatil-nasil-calisir" title="Nasıl Çalışır?" className="mb-10" />
        <StepList steps={STEPS} layout="columns" />
      </Section>
    </>
  );
}
