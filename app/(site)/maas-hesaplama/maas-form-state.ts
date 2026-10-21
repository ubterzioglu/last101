import type { SalaryInput } from '@/lib/salary/types';

/** Form values of the salary calculator (defaults unchanged from the original client). */
export interface MaasFormState {
  amount: number;
  period: 'monthly' | 'yearly';
  type: 'gross' | 'net';
  taxClass: string;
  state: string;
  hasChildren: boolean;
  childrenCount: number;
  childrenUnder25: number;
  age23Plus: boolean;
  churchTax: boolean;
  childAllowance: number;
  insuranceType: 'gkv' | 'pkv';
  kvBase: number;
  kvZusatz: number;
  pkvPremium: number;
  ppvPremium: number;
  hasCompanyCar: boolean;
  carListPrice: number;
  carRate: number;
  carCommuteEnabled: boolean;
  carCommuteKm: number;
  carCommuteMode: 'monthly' | 'daily';
  carCommuteDays: number;
}

export const INITIAL_MAAS_FORM: MaasFormState = {
  amount: 5000,
  period: 'monthly',
  type: 'gross',
  taxClass: '1',
  state: 'NRW',
  hasChildren: false,
  childrenCount: 0,
  childrenUnder25: 0,
  age23Plus: true,
  churchTax: false,
  childAllowance: 0,
  insuranceType: 'gkv',
  kvBase: 14.6,
  kvZusatz: 2.5,
  pkvPremium: 0,
  ppvPremium: 0,
  hasCompanyCar: false,
  carListPrice: 40000,
  carRate: 0.01,
  carCommuteEnabled: false,
  carCommuteKm: 10,
  carCommuteMode: 'monthly',
  carCommuteDays: 15,
};

export type MaasFieldUpdater = <K extends keyof MaasFormState>(key: K, value: MaasFormState[K]) => void;

/** Maps form values to the calculator input exactly like the original client did. */
export function toSalaryInput(form: MaasFormState): SalaryInput {
  return {
    amount: form.amount,
    period: form.period,
    type: form.type,
    taxClass: form.taxClass as SalaryInput['taxClass'],
    state: form.state,
    hasChildren: form.hasChildren,
    childrenCount: form.childrenCount,
    childrenUnder25Count: form.childrenUnder25,
    age23Plus: form.age23Plus,
    churchTax: form.churchTax,
    childAllowance: form.childAllowance,
    insuranceType: form.insuranceType,
    kvBase: form.kvBase,
    kvZusatz: form.kvZusatz,
    pkvPremium: form.pkvPremium,
    ppvPremium: form.ppvPremium,
    companyCar: {
      enabled: form.hasCompanyCar,
      listPrice: form.carListPrice,
      rate: form.carRate,
      commuteEnabled: form.carCommuteEnabled,
      commuteKm: form.carCommuteKm,
      commuteMode: form.carCommuteMode,
      commuteDays: form.carCommuteDays,
    },
  };
}
