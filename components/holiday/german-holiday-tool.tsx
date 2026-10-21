'use client';

import { useCallback, useState } from 'react';
import { Field } from '@/components/calc/Field';
import { FIELD_CONTROL_CLASS } from '@/components/calc/field-styles';
import { ToolPanel } from '@/components/tools/ToolPanel';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { GERMAN_STATES, type GermanStateCode } from '@/constants/holidays/de-2026';
import { calculateDERange, type HolidayHit } from '@/lib/utils/holiday-calculator';
import { formatDateLabel } from './holiday-format';
import { HolidayRangeForm } from './holiday-range-form';
import { HolidayResults, type HolidayResultsCopy } from './holiday-results';
import { useHolidayRange } from './use-holiday-range';

const DE_COPY: HolidayResultsCopy = {
  totalLabel: 'Toplam Gün',
  leaveLabel: 'İzin Günleri',
  officialLabel: 'Resmî Tatiller',
  officialHint: 'İş gününe denk',
  weeklyTitle: 'Haftalık Özet',
  weekLeaveLabel: 'İzin',
  weekHolidaysLabel: 'Resmî Tatiller:',
  bridgeHint: (
    <>
      <strong>Köprü Günü</strong> olasılığı: Tatil + 1 gün = uzun hafta sonu
    </>
  ),
};

function renderGermanHoliday(hit: HolidayHit) {
  return (
    <>
      {formatDateLabel(hit.date)}: {hit.name}
    </>
  );
}

/** Interactive part of /tatil/almanya: Bundesland + range form and results. */
export function GermanHolidayTool() {
  const [state, setState] = useState<GermanStateCode>('BE');
  const calculate = useCallback((start: Date, end: Date) => calculateDERange(start, end, state), [state]);
  const range = useHolidayRange(calculate);

  return (
    <>
      <ToolPanel id="tatil-araligi">
        <HolidayRangeForm
          idPrefix="tatil-de"
          startDate={range.startDate}
          endDate={range.endDate}
          onStartChange={range.handleStartChange}
          onEndChange={range.handleEndChange}
          onCalculate={range.handleCalculate}
          onReset={range.handleReset}
        >
          <Field label="Eyalet (Bundesland)" htmlFor="tatil-de-eyalet">
            <select
              id="tatil-de-eyalet"
              value={state}
              onChange={(e) => setState(e.target.value as GermanStateCode)}
              className={FIELD_CONTROL_CLASS}
            >
              {GERMAN_STATES.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </Field>
        </HolidayRangeForm>
      </ToolPanel>

      <Container className="space-y-6 pb-12 md:pb-16">
        {range.result && <HolidayResults result={range.result} copy={DE_COPY} renderHoliday={renderGermanHoliday} />}
        <Button href="/" variant="outline">
          Ana Sayfaya Dön
        </Button>
      </Container>
    </>
  );
}
