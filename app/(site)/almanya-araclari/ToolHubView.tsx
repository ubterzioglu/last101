import { MapPin } from 'lucide-react';
import { CtaRow } from '@/components/site/CtaRow';
import { DarkBand } from '@/components/site/DarkBand';
import { FilterPanel } from '@/components/site/FilterPanel';
import { PageHead } from '@/components/site/PageHead';
import { PhotoCard } from '@/components/site/PhotoCard';
import { ServiceGrid } from '@/components/site/ServiceGrid';
import { StepList } from '@/components/site/StepList';
import { TONE_STYLES } from '@/components/site/tones';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { TOOL_CATALOG } from '@/lib/tools/catalog';
import { cn } from '@/lib/utils/cn';
import { groupToolsByCategory, type ToolHubGroup } from './tool-hub-data';

interface ToolHubViewProps {
  eyebrow: string;
  /** First h1 line; keep a trailing space so the accessible name stays one sentence. */
  title: string;
  accent: string;
  description: string;
}

const HOW_IT_WORKS = [
  {
    title: 'Aracını seç',
    description: 'Araçları amaçlarına göre grupladık. Kategoriden başla ya da doğrudan aracı aç.',
  },
  {
    title: 'Soruları yanıtla',
    description: 'Her araç kısa sorularla durumunu çerçeveler. Kullanım anonimdir.',
  },
  {
    title: 'Sonucuna göre ilerle',
    description: 'Sonuç ekranındaki adımlar ve resmi kaynaklarla bir sonraki hamleni planla.',
  },
];

function CategoryNav({ groups }: { groups: ToolHubGroup[] }) {
  return (
    <FilterPanel>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
        <div className="max-w-xl">
          <h2 className="text-[19px] font-extrabold leading-snug tracking-[-0.02em] text-ink">Hızlı gezinme</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Araçları amaçlarına göre grupladık. İstersen kategoriden başla, istersen doğrudan
            karttaki butonla aracı aç.
          </p>
        </div>
        <ul className="flex flex-wrap gap-2">
          {groups.map((group) => (
            <li key={group.id}>
              <a
                href={`#${group.id}`}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-line bg-white px-4 text-sm font-semibold text-ink transition-colors hover:border-ink"
              >
                <span aria-hidden="true" className={cn('h-2 w-2 rounded-full', TONE_STYLES[group.tone].solid)} />
                {group.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </FilterPanel>
  );
}

function CategorySection({ group }: { group: ToolHubGroup }) {
  const headingId = `${group.id}-title`;

  return (
    <section id={group.id} aria-labelledby={headingId} className="scroll-mt-28">
      <div className="flex flex-col gap-3 border-b border-line pb-5 md:flex-row md:items-end md:justify-between md:gap-10">
        <div className="max-w-2xl">
          <h2
            id={headingId}
            className="flex items-center gap-3 text-[clamp(1.5rem,2.6vw,2rem)] font-extrabold leading-tight tracking-[-0.03em] text-ink"
          >
            <span aria-hidden="true" className={cn('h-3 w-3 shrink-0 rounded-full', TONE_STYLES[group.tone].solid)} />
            {group.title}
          </h2>
          <p className="mt-2 leading-relaxed text-muted">{group.description}</p>
        </div>
        <p className="shrink-0 text-sm text-muted">
          Bu bölümde <span className="font-semibold text-ink">{group.items.length} araç var</span>
        </p>
      </div>
      <ServiceGrid items={group.items} columns={3} />
    </section>
  );
}

/** Shared body of /almanya-araclari and /yeniarachub: same tools, own head copy. */
export function ToolHubView({ eyebrow, title, accent, description }: ToolHubViewProps) {
  const groups = groupToolsByCategory(TOOL_CATALOG);

  return (
    <>
      <PageHead
        eyebrow={eyebrow}
        title={title}
        accent={accent}
        description={description}
        stats={[
          { value: String(TOOL_CATALOG.length), label: 'Toplam araç' },
          { value: String(groups.length), label: 'Kategori' },
          { value: 'Anonim erişim', label: 'Kullanım tipi' },
        ]}
        media={
          <PhotoCard
            src="/images/site/frankfurt-skyline.webp"
            alt="Frankfurt am Main silüeti"
            chip={{ label: 'Frankfurt am Main', icon: MapPin }}
            priority
          />
        }
      />

      <Container className="py-12">
        <CategoryNav groups={groups} />
      </Container>

      <Container className="space-y-14 pb-16">
        {groups.map((group) => (
          <CategorySection key={group.id} group={group} />
        ))}
      </Container>

      <DarkBand id="nasil-calisir" eyebrow="Nasıl çalışır?" title="Seç. Yanıtla. Planla.">
        <StepList steps={HOW_IT_WORKS} tone="light" layout="columns" />
      </DarkBand>

      <CtaRow
        title="Aradığın aracı bulamadın mı?"
        description="Hangi konuda bir araç görmek istediğini bize yaz."
        action={
          <Button href="/iletisim" arrow>
            Bize yaz
          </Button>
        }
      />
    </>
  );
}
