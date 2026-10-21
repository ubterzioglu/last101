import { Check, Copy, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { Chip } from '@/components/site/Chip';
import { toneAt } from '@/components/site/tones';
import { buildChips, buildWhy, labelForRank, type Prefs, type ScoredSystem } from './scoring';

interface TransferResultsProps {
  results: ScoredSystem[];
  prefs: Prefs;
  copied: boolean;
  onReset: () => void;
  onCopy: () => void;
}

export function TransferResults({ results, prefs, copied, onReset, onCopy }: TransferResultsProps) {
  const [primary, ...others] = results;

  return (
    <Container className="py-10 md:py-12">
      <div className="border-b border-line pb-6">
        <h2 className="text-[clamp(2rem,3.5vw,2.8rem)] font-extrabold leading-[1.12] tracking-[-0.04em] text-ink">
          Sonuç
        </h2>
        <p className="mt-2 leading-relaxed text-muted">
          Cevaplarına göre en uygun para transferi sistemi profilleri:
        </p>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.15fr_1fr] lg:items-start">
        {primary && (
          <Card variant="featured" className="md:p-8">
            <SystemResult sys={primary} idx={0} prefs={prefs} />
          </Card>
        )}
        {others.length > 0 && (
          <Card noPadding className="divide-y divide-line">
            {others.map((sys, i) => (
              <div key={sys.id} className="p-5 md:p-6">
                <SystemResult sys={sys} idx={i + 1} prefs={prefs} />
              </div>
            ))}
          </Card>
        )}
      </div>

      <div className="mt-5 rounded-tile border border-alm-blue/20 bg-alm-blue/5 p-4">
        <p className="text-sm leading-relaxed text-ink">
          <strong>Not:</strong> Bu araç yönlendirme amaçlıdır. Ücretler (kur farkı + sabit ücret),
          teslim süresi, kimlik doğrulama ve limitler sağlayıcıya göre değişir.<br />
          Karar vermeden önce sağlayıcının kendi fiyat hesaplayıcısında aynı tutar için &quot;toplam maliyeti&quot; kontrol edin.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:flex-wrap">
        <Button onClick={onCopy}>
          {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
          {copied ? 'Kopyalandı' : 'Sonucu Kopyala'}
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

function SystemResult({ sys, idx, prefs }: { sys: ScoredSystem; idx: number; prefs: Prefs }) {
  const chips = buildChips(sys, prefs);
  const why = buildWhy(sys, prefs);

  return (
    <article>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <h3 className="text-[19px] font-extrabold leading-snug tracking-[-0.02em] text-ink">
          {idx + 1} - {sys.name} - {labelForRank(idx)}
        </h3>
        <p className="shrink-0 text-sm font-semibold text-ink">
          Uygunluk Skoru: <span className="text-lg font-extrabold text-brand-700">{sys.score}/100</span>
        </p>
      </div>

      {chips.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {chips.map((chip, i) => (
            <Chip key={i} tone={toneAt(i)}>
              {chip}
            </Chip>
          ))}
        </div>
      )}

      <div className="mt-4 border-t border-line pt-4">
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Neden bu sistem?</p>
        <ul className="mt-2.5 space-y-2">
          {why.map((b, i) => (
            <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-ink">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" aria-hidden="true" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
