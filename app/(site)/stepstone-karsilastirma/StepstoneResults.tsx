import { Minus, TrendingDown, TrendingUp } from 'lucide-react';
import { MetricCell, MetricGrid } from '@/components/calc/MetricGrid';
import { Card } from '@/components/ui/Card';
import { STEPSTONE_2026 } from '@/lib/salary/stepstone-data';
import { cn } from '@/lib/utils/cn';
import type { CompareRow, StepstoneResult } from './stepstone-compare';

const EUR = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

const SECTION_TITLE = 'text-[clamp(1.5rem,2.6vw,2rem)] font-extrabold leading-tight tracking-[-0.03em] text-ink';

function DiffLine({ row }: { row: CompareRow }) {
  const above = row.diff > 0;
  const sign = above ? '+' : '';
  const Icon = above ? TrendingUp : row.diff < 0 ? TrendingDown : Minus;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-xs font-semibold tabular-nums',
        above ? 'text-alm-green-ink' : 'text-alm-red-ink'
      )}
    >
      <Icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
      {sign}
      {EUR.format(row.diff)} ({sign}
      {row.diffPct.toFixed(1)}%)
    </span>
  );
}

export function StepstoneResults({ result }: { result: StepstoneResult }) {
  return (
    <>
      <Card variant="featured" className="p-5 md:p-7" data-pw="stepstone-result">
        <MetricGrid className="sm:grid-cols-[1.3fr_1fr]">
          <MetricCell
            label="Senin yıllık brütün"
            value={EUR.format(result.grossYearly)}
            hint="Kaynak: Stepstone Gehaltsreport 2026"
            tone="green"
            valueTestId="stepstone-gross-yearly"
          />
          <div className="min-w-0 bg-white p-4 md:p-5">
            <p className="text-sm font-medium text-muted">Genel Almanya</p>
            <p className="mt-2 text-sm font-bold tabular-nums text-ink">Median: {EUR.format(STEPSTONE_2026.overall.median)}</p>
            <p className="mt-1 text-sm font-bold tabular-nums text-ink">Ort.: {EUR.format(STEPSTONE_2026.overall.mean)}</p>
          </div>
        </MetricGrid>

        <div className="mt-6">
          <h3 className="text-sm font-bold text-ink">Seçimin</h3>
          <dl className="mt-3 grid border-t border-line sm:grid-cols-2 sm:gap-x-8">
            {Object.entries(result.picks).map(([key, value]) => (
              <div key={key} className="flex items-baseline justify-between gap-4 border-b border-line py-2.5 text-sm">
                <dt className="text-muted">{key}</dt>
                <dd className="text-right font-semibold text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Card>

      <Card className="p-5 md:p-7">
        <h2 className={SECTION_TITLE}>Boyuta Göre Karşılaştırma</h2>
        <ul className="mt-4 divide-y divide-line border-y border-line" data-pw="stepstone-compare-rows">
          {result.rows.map((row) => (
            <li key={row.label} className="flex items-center justify-between gap-4 py-3">
              <span className="min-w-0 text-sm text-ink">{row.label}</span>
              <span className="flex shrink-0 flex-col items-end">
                <span className="text-sm font-bold tabular-nums text-ink">{EUR.format(row.median)}</span>
                <DiffLine row={row} />
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
