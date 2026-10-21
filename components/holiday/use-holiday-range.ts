'use client';

import { useCallback, useState } from 'react';
import type { ChangeEvent } from 'react';
import { parseISODate, type CalculationResult } from '@/lib/utils/holiday-calculator';

type RangeCalculator = (start: Date, end: Date) => CalculationResult;

/** Date-range state shared by the Turkey and Germany calculators (behaviour unchanged). */
export function useHolidayRange(calculate: RangeCalculator) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [result, setResult] = useState<CalculationResult | null>(null);

  const handleCalculate = useCallback(() => {
    if (!startDate || !endDate) return;

    const start = parseISODate(startDate);
    const end = parseISODate(endDate);

    if (start > end) {
      alert('Başlangıç tarihi bitiş tarihinden sonra olamaz!');
      return;
    }

    setResult(calculate(start, end));
  }, [startDate, endDate, calculate]);

  const handleReset = useCallback(() => {
    setStartDate('');
    setEndDate('');
    setResult(null);
  }, []);

  const handleStartChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStartDate(value);
    if (value && endDate && value > endDate) {
      setEndDate('');
    }
  };

  const handleEndChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
  };

  return { startDate, endDate, result, handleCalculate, handleReset, handleStartChange, handleEndChange };
}
