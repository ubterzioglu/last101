'use client';

import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Field } from '@/components/calc/Field';
import { FIELD_CONTROL_CLASS, PANEL_TITLE_CLASS } from '@/components/calc/field-styles';
import { ToolPanel } from '@/components/tools/ToolPanel';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import {
  EXPERIENCE_OPTIONS,
  COMPANY_SIZE_OPTIONS,
  EDUCATION_OPTIONS,
  RESPONSIBILITY_OPTIONS,
  GENDER_OPTIONS,
  getSortedJobGroups,
  getSortedCities,
} from '@/lib/salary/stepstone-data';
import {
  INITIAL_STEPSTONE_FORM,
  STATE_OPTIONS,
  buildResult,
  type StepstoneFormState,
  type StepstoneResult,
} from './stepstone-compare';
import { StepstoneResults } from './StepstoneResults';

const toOptions = (values: string[]) => values.map((value) => ({ value, label: value }));

interface SelectFieldDef {
  key: Exclude<keyof StepstoneFormState, 'grossMonthly'>;
  label: string;
  options: readonly { value: string; label: string }[];
}

// Same fields, labels and order as before; every select starts on "Seç".
const SELECT_FIELDS: readonly SelectFieldDef[] = [
  { key: 'state', label: 'Eyalet', options: STATE_OPTIONS },
  { key: 'experience', label: 'Deneyim', options: EXPERIENCE_OPTIONS },
  { key: 'jobGroup', label: 'Meslek Grubu', options: toOptions(getSortedJobGroups()) },
  { key: 'city', label: 'Şehir', options: toOptions(getSortedCities()) },
  { key: 'companySize', label: 'Şirket Büyüklüğü', options: COMPANY_SIZE_OPTIONS },
  { key: 'education', label: 'Eğitim (Hochschulabschluss)', options: EDUCATION_OPTIONS },
  { key: 'responsibility', label: 'Personalverantwortung', options: RESPONSIBILITY_OPTIONS },
  { key: 'gender', label: 'Cinsiyet', options: GENDER_OPTIONS },
];

export default function StepstoneClient() {
  const [form, setForm] = useState<StepstoneFormState>(INITIAL_STEPSTONE_FORM);
  const [result, setResult] = useState<StepstoneResult | null>(null);
  const [missing, setMissing] = useState<string[]>([]);

  const set = (key: keyof StepstoneFormState) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { value } = e.target;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCompare = () => {
    const out = buildResult(form);
    setMissing(out.missing);
    setResult(out.result ?? null);
  };

  const handleReset = () => {
    setForm(INITIAL_STEPSTONE_FORM);
    setResult(null);
    setMissing([]);
  };

  return (
    <>
      <ToolPanel id="stepstone-form">
        <div>
          <h2 className={PANEL_TITLE_CLASS}>Profil Bilgileri</h2>
          <p className="mt-1 text-sm leading-6 text-muted">
            Alanları doldurdukça form daha net okunur ve karşılaştırma daha isabetli olur.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Aylık Brüt Maaş (€)" htmlFor="stepstone-grossMonthly">
            <input
              id="stepstone-grossMonthly"
              type="number"
              value={form.grossMonthly}
              onChange={set('grossMonthly')}
              placeholder="4500"
              className={FIELD_CONTROL_CLASS}
            />
          </Field>
          {SELECT_FIELDS.map((field) => (
            <Field key={field.key} label={field.label} htmlFor={`stepstone-${field.key}`}>
              <select
                id={`stepstone-${field.key}`}
                value={form[field.key]}
                onChange={set(field.key)}
                className={FIELD_CONTROL_CLASS}
              >
                <option value="">Seç</option>
                {field.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>
          ))}
        </div>

        <div className="flex justify-end border-t border-line pt-4">
          <Button type="button" onClick={handleCompare} className="w-full sm:w-auto sm:min-w-[220px]">
            Karşılaştır
          </Button>
        </div>

        {missing.length > 0 && (
          <div
            role="alert"
            className="flex gap-3 rounded-card border border-alm-yellow/20 bg-alm-yellow/5 p-4 text-sm leading-relaxed text-ink"
          >
            <AlertTriangle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-alm-yellow-ink" />
            <p>
              <span className="font-semibold">Eksik alanlar:</span> {missing.join(', ')}
            </p>
          </div>
        )}
      </ToolPanel>

      <Container className="space-y-6 pb-12 md:pb-16">
        {result && <StepstoneResults result={result} />}
        <div className="flex flex-col gap-3 sm:flex-row">
          {result && (
            <Button type="button" variant="outline" onClick={handleReset}>
              Sıfırla
            </Button>
          )}
          <Button href="/" variant="outline">
            Ana Sayfaya Dön
          </Button>
        </div>
      </Container>
    </>
  );
}
