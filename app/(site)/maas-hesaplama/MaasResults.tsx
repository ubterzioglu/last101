'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { MetricCell, MetricGrid } from '@/components/calc/MetricGrid';
import type { SiteTone } from '@/components/site/tones';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/salary/calculator';
import type { SalaryResult } from '@/lib/salary/types';
import { cn } from '@/lib/utils/cn';

type MetricKey =
  | 'netMonthly'
  | 'netYearly'
  | 'grossMonthly'
  | 'grossYearly'
  | 'deductionsMonthly'
  | 'deductionsYearly';

interface MetricDef {
  key: MetricKey;
  label: string;
  /** `data-pw` hook on the value (used by e2e/tools/maas-hesaplama.spec.ts). */
  testId: string;
  tone: SiteTone;
}

const METRICS: readonly MetricDef[] = [
  { key: 'netMonthly', label: 'Net Maaş (Aylık)', testId: 'maas-net-monthly', tone: 'green' },
  { key: 'netYearly', label: 'Net Maaş (Yıllık)', testId: 'maas-net-yearly', tone: 'green' },
  { key: 'grossMonthly', label: 'Brüt Maaş (Aylık)', testId: 'maas-gross-monthly', tone: 'blue' },
  { key: 'grossYearly', label: 'Brüt Maaş (Yıllık)', testId: 'maas-gross-yearly', tone: 'blue' },
  { key: 'deductionsMonthly', label: 'Toplam Kesinti (Aylık)', testId: 'maas-deductions-monthly', tone: 'red' },
  { key: 'deductionsYearly', label: 'Toplam Kesinti (Yıllık)', testId: 'maas-deductions-yearly', tone: 'red' },
];

interface BreakdownRowData {
  label: string;
  value: number;
}

/** Same rows as before; yearly values are the monthly values times 12. */
function buildBreakdown(result: SalaryResult, factor: 1 | 12): BreakdownRowData[] {
  const rows: BreakdownRowData[] = [{ label: 'Lohnsteuer (Gelir Vergisi)', value: result.tax.lohnsteuer * factor }];
  if (result.kirchensteuer > 0) {
    rows.push({ label: 'Kirchensteuer (Kilise Vergisi)', value: result.kirchensteuer * factor });
  }
  return [
    ...rows,
    { label: 'Solidaritätszuschlag (Dayanışma)', value: result.tax.soli * factor },
    { label: 'Krankenversicherung (Sağlık)', value: result.social.kv * factor },
    { label: 'Pflegeversicherung (Bakım)', value: result.social.pv * factor },
    { label: 'Rentenversicherung (Emeklilik)', value: result.social.rv * factor },
    { label: 'Arbeitslosenversicherung (İşsizlik)', value: result.social.av * factor },
  ];
}

interface BreakdownToggleProps {
  id: string;
  label: string;
  open: boolean;
  onToggle: () => void;
  rows: BreakdownRowData[];
}

function BreakdownToggle({ id, label, open, onToggle, rows }: BreakdownToggleProps) {
  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={onToggle}
        className="flex min-h-[44px] w-full items-center justify-between gap-3 py-4 text-left font-semibold text-ink transition-colors hover:text-brand-700"
      >
        <span>{label}</span>
        <ChevronDown
          aria-hidden="true"
          className={cn('h-5 w-5 shrink-0 text-muted transition-transform motion-reduce:transition-none', open && 'rotate-180')}
        />
      </button>
      {open && (
        <dl id={id} className="mb-4 divide-y divide-line border-y border-line">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-4 py-2.5 text-sm">
              <dt className="text-muted">{row.label}</dt>
              <dd className="font-semibold tabular-nums text-ink">{formatCurrency(row.value)}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

const SECTION_TITLE = 'text-[clamp(1.5rem,2.6vw,2rem)] font-extrabold leading-tight tracking-[-0.03em] text-ink';

export function MaasResults({ result }: { result: SalaryResult }) {
  const [showMonthlyBreakdown, setShowMonthlyBreakdown] = useState(false);
  const [showYearlyBreakdown, setShowYearlyBreakdown] = useState(false);

  return (
    <>
      <Card variant="featured" className="p-5 md:p-7" data-pw="maas-result">
        <h2 className={SECTION_TITLE}>Sonuç</h2>
        <MetricGrid className="mt-5 sm:grid-cols-2">
          {METRICS.map((metric) => (
            <MetricCell
              key={metric.key}
              labelAs="h3"
              label={metric.label}
              value={formatCurrency(result[metric.key])}
              tone={metric.tone}
              valueTestId={metric.testId}
            />
          ))}
        </MetricGrid>
      </Card>

      <Card className="p-5 md:p-7">
        <h2 className={SECTION_TITLE}>Nedir bu kesintiler?</h2>
        <div className="mt-4 divide-y divide-line border-y border-line">
          <BreakdownToggle
            id="maas-aylik-kesintiler"
            label="Aylık Kesintiler"
            open={showMonthlyBreakdown}
            onToggle={() => setShowMonthlyBreakdown((open) => !open)}
            rows={buildBreakdown(result, 1)}
          />
          <BreakdownToggle
            id="maas-yillik-kesintiler"
            label="Yıllık Kesintiler"
            open={showYearlyBreakdown}
            onToggle={() => setShowYearlyBreakdown((open) => !open)}
            rows={buildBreakdown(result, 12)}
          />
        </div>
      </Card>
    </>
  );
}
