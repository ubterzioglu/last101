import { Check, Copy, RotateCcw } from 'lucide-react';
import type { ClassifiedResult } from './types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { Chip } from '@/components/site/Chip';
import type { SiteTone } from '@/components/site/tones';

type GroupKey = keyof ClassifiedResult;
type ScoredInsurance = ClassifiedResult[GroupKey][number];

const GROUPS: { key: GroupKey; label: string; tone: SiteTone }[] = [
  { key: 'must', label: 'Yüksek Öncelikli', tone: 'red' },
  { key: 'should', label: 'Durumuna Bağlı', tone: 'yellow' },
  { key: 'nice', label: 'Opsiyonel', tone: 'green' },
];

interface SigortaResultsProps {
  classified: ClassifiedResult;
  copied: boolean;
  onReset: () => void;
  onCopy: () => void;
}

export function SigortaResults({ classified, copied, onReset, onCopy }: SigortaResultsProps) {
  const groups = GROUPS.filter((group) => classified[group.key].length > 0);

  return (
    <Container className="py-10 md:py-12">
      <div className="border-b border-line pb-6">
        <h2 className="text-[clamp(2rem,3.5vw,2.8rem)] font-extrabold leading-[1.12] tracking-[-0.04em] text-ink">
          Sonuç
        </h2>
        <p className="mt-2 leading-relaxed text-muted">Cevaplarına göre sigorta önceliklendirmen</p>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-3 lg:items-start">
        {groups.map((group) => (
          <Card
            key={group.key}
            variant={group.key === 'must' ? 'featured' : 'default'}
            className="p-5 md:p-6"
          >
            <Chip tone={group.tone}>{group.label}</Chip>
            <ul className="mt-4 divide-y divide-line border-t border-line">
              {classified[group.key].map((item) => (
                <InsuranceItem key={item.key} item={item} />
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:flex-wrap">
        <Button onClick={onCopy}>
          {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
          {copied ? 'Kopyalandı!' : 'Sonucu Kopyala'}
        </Button>
        <Button variant="outline" onClick={onReset}>
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Sıfırla
        </Button>
        <Button href="/" variant="outline">
          Ana Sayfaya Dön
        </Button>
      </div>
    </Container>
  );
}

function InsuranceItem({ item }: { item: ScoredInsurance }) {
  return (
    <li className="py-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-extrabold leading-snug text-ink">{item.title}</h3>
        <span className="shrink-0 text-sm font-semibold text-muted">
          Skor: <span className="font-extrabold text-brand-700">{item.score}</span>
        </span>
      </div>
      <ul className="mt-2 space-y-1.5">
        {item.reasons.map((reason, i) => (
          <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-muted">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted" aria-hidden="true" />
            <span>{reason}</span>
          </li>
        ))}
      </ul>
    </li>
  );
}
