import type { ReactNode } from 'react';
import { Briefcase, Calendar, Lightbulb, Moon, Sun } from 'lucide-react';
import { MetricCell, MetricGrid } from '@/components/calc/MetricGrid';
import { Chip } from '@/components/site/Chip';
import { Card } from '@/components/ui/Card';
import {
  calculateEfficiency,
  formatShortDateTR,
  groupDaysByWeek,
  humanizeDays,
  parseISODate,
  type CalculationResult,
  type HolidayHit,
} from '@/lib/utils/holiday-calculator';
import { efficiencyTone, stripLeadingEmoji } from './holiday-format';

/** Country specific wording; everything else is shared between TR and DE. */
export interface HolidayResultsCopy {
  totalLabel: string;
  leaveLabel: string;
  officialLabel: string;
  officialHint: string;
  weeklyTitle: string;
  weekLeaveLabel: string;
  weekHolidaysLabel: string;
  bridgeHint: ReactNode;
}

interface HolidayResultsProps {
  result: CalculationResult;
  copy: HolidayResultsCopy;
  renderHoliday: (hit: HolidayHit) => ReactNode;
}

const SECTION_TITLE = 'text-[clamp(1.5rem,2.6vw,2rem)] font-extrabold leading-tight tracking-[-0.03em] text-ink';

export function HolidayResults({ result, copy, renderHoliday }: HolidayResultsProps) {
  const efficiency = calculateEfficiency(result.leaveDays, result.totalDays);
  const weeks = groupDaysByWeek(result.days);

  return (
    <Card variant="featured" className="p-5 md:p-7" data-pw="holiday-result">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className={SECTION_TITLE}>Sonuçlar</h2>
        <Chip tone={efficiencyTone(efficiency.ratio)} className="text-sm">
          {stripLeadingEmoji(efficiency.badge)}
        </Chip>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex flex-wrap justify-between gap-x-3 text-sm">
          <span className="font-semibold text-ink">İzin Verimliliği</span>
          <span className="text-muted">{efficiency.label}</span>
        </div>
        <div
          role="progressbar"
          aria-label="İzin Verimliliği"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={efficiency.percentage}
          className="h-2.5 overflow-hidden rounded-full bg-line"
        >
          <div
            className="h-full rounded-full bg-brand-500 transition-[width] duration-500 motion-reduce:transition-none"
            style={{ width: `${efficiency.percentage}%` }}
          />
        </div>
      </div>

      <MetricGrid className="mt-6 grid-cols-2 lg:grid-cols-4">
        <MetricCell icon={Sun} tone="green" label={copy.totalLabel} value={String(result.totalDays)} hint="Seçilen aralık" />
        <MetricCell icon={Briefcase} tone="orange" label={copy.leaveLabel} value={humanizeDays(result.leaveDays)} hint="Gerekli izin" />
        <MetricCell
          icon={Calendar}
          tone="blue"
          label={copy.officialLabel}
          value={humanizeDays(result.officialHolidayDays)}
          hint={copy.officialHint}
        />
        <MetricCell icon={Moon} tone="yellow" label="Hafta Sonu" value={String(result.weekendDays)} hint="Cumartesi + Pazar" />
      </MetricGrid>

      {weeks.length > 0 && (
        <div className="mt-8">
          <h3 className="text-[19px] font-extrabold leading-snug tracking-[-0.02em] text-ink">{copy.weeklyTitle}</h3>
          <ol className="mt-3 divide-y divide-line border-y border-line">
            {weeks.map((week, idx) => (
              <li key={week.key} className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-ink">Hafta {idx + 1}</p>
                    <p className="text-xs text-muted">
                      {formatShortDateTR(parseISODate(week.start))} – {formatShortDateTR(parseISODate(week.end))}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted">{copy.weekLeaveLabel}</p>
                    <p className="text-sm font-bold text-brand-700">{humanizeDays(week.leaveDays)}</p>
                  </div>
                </div>

                <p className="mt-2 text-xs text-muted">
                  {week.totalDays} gün • {week.weekendDays} hafta sonu • {humanizeDays(week.holidayDaysWork)} resmî tatil
                </p>

                {week.holidays.length > 0 && (
                  <div className="mt-2 rounded-tile bg-band p-2.5 text-xs">
                    <strong className="text-ink">{copy.weekHolidaysLabel}</strong>
                    <ul className="mt-1 space-y-0.5 text-muted">
                      {week.holidays.map((hit, i) => (
                        <li key={i}>{renderHoliday(hit)}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {week.bridgeHint && (
                  <p className="mt-2 flex items-start gap-2 rounded-tile border border-alm-yellow/20 bg-alm-yellow/5 p-2.5 text-xs text-ink">
                    <Lightbulb aria-hidden="true" className="mt-px h-3.5 w-3.5 shrink-0 text-alm-yellow-ink" />
                    <span>{copy.bridgeHint}</span>
                  </p>
                )}
              </li>
            ))}
          </ol>
        </div>
      )}
    </Card>
  );
}
