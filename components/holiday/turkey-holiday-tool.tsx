'use client';

import { ToolPanel } from '@/components/tools/ToolPanel';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { calculateTRRange, formatHolidayLabelTR, type HolidayHit } from '@/lib/utils/holiday-calculator';
import { HolidayRangeForm } from './holiday-range-form';
import { HolidayResults, type HolidayResultsCopy } from './holiday-results';
import { useHolidayRange } from './use-holiday-range';

const TR_COPY: HolidayResultsCopy = {
  totalLabel: 'Toplam Tatil',
  leaveLabel: 'İzinden Giden',
  officialLabel: 'Resmî Tatil',
  officialHint: 'Arefeler 0.5 sayılır',
  weeklyTitle: 'Hafta Hafta Plan',
  weekLeaveLabel: 'Net izin',
  weekHolidaysLabel: 'Resmî tatiller:',
  bridgeHint: (
    <>
      <strong>Köprü</strong> ihtimali: hafta içinde tatil + yanına 1 gün eklenince uzuyor.
    </>
  ),
};

function renderTurkeyHoliday(hit: HolidayHit) {
  return (
    <>
      {formatHolidayLabelTR(hit.date)}: {hit.name}
      {hit.weight === 0.5 && <span className="text-alm-orange-ink"> (yarım)</span>}
    </>
  );
}

/** Interactive part of /tatil/turkiye: range form and results. */
export function TurkeyHolidayTool() {
  const range = useHolidayRange(calculateTRRange);

  return (
    <>
      <ToolPanel id="tatil-araligi">
        <HolidayRangeForm
          idPrefix="tatil-tr"
          startDate={range.startDate}
          endDate={range.endDate}
          onStartChange={range.handleStartChange}
          onEndChange={range.handleEndChange}
          onCalculate={range.handleCalculate}
          onReset={range.handleReset}
        />
      </ToolPanel>

      <Container className="space-y-6 pb-12 md:pb-16">
        {range.result && <HolidayResults result={range.result} copy={TR_COPY} renderHoliday={renderTurkeyHoliday} />}
        <Button href="/" variant="outline">
          Ana Sayfaya Dön
        </Button>
      </Container>
    </>
  );
}
