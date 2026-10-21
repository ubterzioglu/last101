import type { ChangeEvent, ReactNode } from 'react';
import { Field } from '@/components/calc/Field';
import { FIELD_CONTROL_CLASS, PANEL_TITLE_CLASS } from '@/components/calc/field-styles';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import { capitalize, formatDateTR, getDayNameTR, parseISODate } from '@/lib/utils/holiday-calculator';

interface HolidayRangeFormProps {
  idPrefix: string;
  startDate: string;
  endDate: string;
  onStartChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onEndChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onCalculate: () => void;
  onReset: () => void;
  /** Extra fields rendered above the dates (e.g. the Bundesland select). */
  children?: ReactNode;
}

function describeDate(iso: string): string {
  const date = parseISODate(iso);
  return `${formatDateTR(date)}, ${capitalize(getDayNameTR(date))}`;
}

/** "Tatil Aralığı" form inside the tool panel. */
export function HolidayRangeForm({
  idPrefix,
  startDate,
  endDate,
  onStartChange,
  onEndChange,
  onCalculate,
  onReset,
  children,
}: HolidayRangeFormProps) {
  return (
    <>
      <h2 className={PANEL_TITLE_CLASS}>Tatil Aralığı</h2>

      <div className={cn('grid gap-4 sm:grid-cols-2', children && 'lg:grid-cols-3')}>
        {children}
        <Field label="Başlangıç" htmlFor={`${idPrefix}-baslangic`}>
          <input
            id={`${idPrefix}-baslangic`}
            type="date"
            value={startDate}
            onChange={onStartChange}
            className={FIELD_CONTROL_CLASS}
          />
        </Field>
        <Field label="Bitiş" htmlFor={`${idPrefix}-bitis`}>
          <input
            id={`${idPrefix}-bitis`}
            type="date"
            value={endDate}
            min={startDate}
            onChange={onEndChange}
            className={FIELD_CONTROL_CLASS}
          />
        </Field>
      </div>

      {startDate && endDate && (
        <dl className="grid gap-x-8 gap-y-1 rounded-tile border border-line bg-white p-3 text-sm sm:grid-cols-2">
          <div className="flex flex-wrap gap-1">
            <dt className="font-semibold text-ink">Başlangıç:</dt>
            <dd className="text-muted">{describeDate(startDate)}</dd>
          </div>
          <div className="flex flex-wrap gap-1">
            <dt className="font-semibold text-ink">Bitiş:</dt>
            <dd className="text-muted">{describeDate(endDate)}</dd>
          </div>
        </dl>
      )}

      <div className="flex flex-col gap-3 border-t border-line pt-4 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onReset}>
          Sıfırla
        </Button>
        <Button
          type="button"
          onClick={onCalculate}
          disabled={!startDate || !endDate}
          className="sm:min-w-[220px]"
        >
          Hesapla
        </Button>
      </div>
    </>
  );
}
