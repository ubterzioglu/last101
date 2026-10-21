'use client';

import { useMemo, useState } from 'react';
import { Calculator } from 'lucide-react';
import { PANEL_TITLE_CLASS } from '@/components/calc/field-styles';
import { ToolPanel } from '@/components/tools/ToolPanel';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { calculateSalary } from '@/lib/salary/calculator';
import type { SalaryResult } from '@/lib/salary/types';
import { cn } from '@/lib/utils/cn';
import { MaasFormFields } from './MaasFormFields';
import { MaasResults } from './MaasResults';
import { INITIAL_MAAS_FORM, toSalaryInput, type MaasFieldUpdater, type MaasFormState } from './maas-form-state';

export default function MaasClient() {
  const [form, setForm] = useState<MaasFormState>(INITIAL_MAAS_FORM);
  // Calculated result (null = not yet calculated)
  const [calculatedResult, setCalculatedResult] = useState<SalaryResult | null>(null);

  const input = useMemo(() => toSalaryInput(form), [form]);

  const update: MaasFieldUpdater = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCalculate = () => {
    setCalculatedResult(calculateSalary(input));
  };

  return (
    <>
      <ToolPanel id="maas-hesaplayici">
        <h2 className={cn(PANEL_TITLE_CLASS, 'flex items-center gap-2')}>
          <Calculator aria-hidden="true" className="h-5 w-5 text-brand-700" />
          Girdi
        </h2>
        <MaasFormFields form={form} update={update} />
        <div className="flex justify-end border-t border-line pt-4">
          <Button type="button" onClick={handleCalculate} className="w-full sm:w-auto sm:min-w-[220px]">
            Hesapla
          </Button>
        </div>
      </ToolPanel>

      <Container className="space-y-6 pb-12 md:pb-16">
        {calculatedResult && <MaasResults result={calculatedResult} />}
        <Button href="/" variant="outline">
          Ana Sayfaya Dön
        </Button>
      </Container>
    </>
  );
}
