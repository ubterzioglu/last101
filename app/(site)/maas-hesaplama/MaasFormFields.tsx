import { CheckboxField } from '@/components/calc/CheckboxField';
import { Field } from '@/components/calc/Field';
import { FIELD_CONTROL_CLASS } from '@/components/calc/field-styles';
import { SegmentedControl } from '@/components/calc/SegmentedControl';
import { CAR_RATES } from '@/lib/salary/company-car';
import { cn } from '@/lib/utils/cn';
import { STATES, TAX_CLASSES } from '@/lib/salary/types';
import type { MaasFieldUpdater, MaasFormState } from './maas-form-state';

const PERIOD_OPTIONS = [
  { value: 'monthly', label: 'Aylık' },
  { value: 'yearly', label: 'Yıllık' },
] as const;

const TYPE_OPTIONS = [
  { value: 'gross', label: 'Brüt' },
  { value: 'net', label: 'Net' },
] as const;

const AGE_OPTIONS = [
  { value: 'under23', label: '23 altı' },
  { value: 'over23', label: '23 ve üzeri' },
] as const;

const INSURANCE_OPTIONS = [
  { value: 'gkv', label: 'GKV (Yasal)' },
  { value: 'pkv', label: 'PKV (Özel)' },
] as const;

const CAR_RATE_OPTIONS = CAR_RATES.map((rate) => ({ value: rate.value, label: rate.label }));

/** Full-width sub-row inside the 3-column form grid. */
const FULL_ROW = 'grid gap-4 sm:col-span-2 sm:grid-cols-2 lg:col-span-3 lg:grid-cols-3';

interface NumberFieldProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: string;
  placeholder?: string;
}

function NumberField({ id, label, value, onChange, step, placeholder }: NumberFieldProps) {
  return (
    <Field label={label} htmlFor={id}>
      <input
        id={id}
        type="number"
        step={step}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(Number(e.target.value))}
        className={FIELD_CONTROL_CLASS}
      />
    </Field>
  );
}

interface MaasFormFieldsProps {
  form: MaasFormState;
  update: MaasFieldUpdater;
}

export function MaasFormFields({ form, update }: MaasFormFieldsProps) {
  return (
    <div className="grid items-end gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <SegmentedControl id="maas-period" label="Periyot" options={PERIOD_OPTIONS} value={form.period} onChange={(v) => update('period', v)} />
      <SegmentedControl id="maas-type" label="Tip" options={TYPE_OPTIONS} value={form.type} onChange={(v) => update('type', v)} />
      <NumberField id="maas-amount" label="Miktar (€)" value={form.amount} placeholder="5000" onChange={(v) => update('amount', v)} />

      <Field label="Steuerklasse" htmlFor="maas-tax-class">
        <select id="maas-tax-class" value={form.taxClass} onChange={(e) => update('taxClass', e.target.value)} className={FIELD_CONTROL_CLASS}>
          {TAX_CLASSES.map((tc) => (
            <option key={tc.value} value={tc.value}>
              {tc.label}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Eyalet" htmlFor="maas-state">
        <select id="maas-state" value={form.state} onChange={(e) => update('state', e.target.value)} className={FIELD_CONTROL_CLASS}>
          {STATES.map((s) => (
            <option key={s.code} value={s.code}>
              {s.name}
            </option>
          ))}
        </select>
      </Field>
      <SegmentedControl
        id="maas-age"
        label="Yaş"
        options={AGE_OPTIONS}
        value={form.age23Plus ? 'over23' : 'under23'}
        onChange={(v) => update('age23Plus', v === 'over23')}
      />

      <CheckboxField id="maas-children" label="Çocuk var" checked={form.hasChildren} onChange={(v) => update('hasChildren', v)} />
      <CheckboxField id="maas-church-tax" label="Kilise vergisi" checked={form.churchTax} onChange={(v) => update('churchTax', v)} />
      <NumberField id="maas-child-allowance" label="Kinderfreibetrag (ZKF)" step="0.5" value={form.childAllowance} onChange={(v) => update('childAllowance', v)} />

      {form.hasChildren && (
        <div className={FULL_ROW}>
          <NumberField id="maas-children-count" label="Çocuk sayısı" value={form.childrenCount} onChange={(v) => update('childrenCount', v)} />
          <NumberField id="maas-children-under25" label="25 yaş altı" value={form.childrenUnder25} onChange={(v) => update('childrenUnder25', v)} />
        </div>
      )}

      <SegmentedControl id="maas-insurance" label="Sigorta" options={INSURANCE_OPTIONS} value={form.insuranceType} onChange={(v) => update('insuranceType', v)} />
      {form.insuranceType === 'gkv' ? (
        <>
          <NumberField id="maas-kv-base" label="KV Kassensatz (%)" step="0.01" value={form.kvBase} onChange={(v) => update('kvBase', v)} />
          <NumberField id="maas-kv-zusatz" label="KV Zusatz (%)" step="0.01" value={form.kvZusatz} onChange={(v) => update('kvZusatz', v)} />
        </>
      ) : (
        <>
          <NumberField id="maas-pkv-premium" label="PKV Primi (€)" value={form.pkvPremium} onChange={(v) => update('pkvPremium', v)} />
          <NumberField id="maas-ppv-premium" label="PPV Primi (€)" value={form.ppvPremium} onChange={(v) => update('ppvPremium', v)} />
        </>
      )}

      <CheckboxField
        id="maas-company-car"
        label="Dienstwagen (Şirket Aracı)"
        checked={form.hasCompanyCar}
        onChange={(v) => update('hasCompanyCar', v)}
      />
      {form.hasCompanyCar && (
        <div className={cn(FULL_ROW, 'rounded-card border border-line bg-white p-4')}>
          <NumberField id="maas-car-list-price" label="Brüt Liste Fiyatı (€)" value={form.carListPrice} onChange={(v) => update('carListPrice', v)} />
          <SegmentedControl
            id="maas-car-rate"
            label="Vergilendirme oranı"
            columns={3}
            options={CAR_RATE_OPTIONS}
            value={form.carRate}
            onChange={(v) => update('carRate', v)}
            className="sm:col-span-2"
          />
        </div>
      )}
    </div>
  );
}
