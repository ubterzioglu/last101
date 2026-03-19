// Maaş hesaplama tipleri

export interface SalaryInput {
  amount: number;
  period: 'monthly' | 'yearly';
  type: 'gross' | 'net';
  taxClass: '1' | '2' | '3' | '4' | '5' | '6';
  state: string;
  hasChildren: boolean;
  childrenCount: number;
  childrenUnder25Count: number;
  age23Plus: boolean;
  churchTax: boolean;
  childAllowance: number;
  insuranceType: 'gkv' | 'pkv';
  kvBase: number;
  kvZusatz: number;
  pkvPremium: number;
  ppvPremium: number;
  companyCar?: CompanyCarConfig;
}

export interface CompanyCarConfig {
  enabled: boolean;
  listPrice: number;
  rate: number;
  commuteEnabled: boolean;
  commuteKm: number;
  commuteMode: 'monthly' | 'daily';
  commuteDays: number;
}

export interface SalaryResult {
  grossMonthly: number;
  grossYearly: number;
  netMonthly: number;
  netYearly: number;
  deductionsMonthly: number;
  deductionsYearly: number;
  tax: TaxBreakdown;
  social: SocialBreakdown;
  kirchensteuer: number;
  companyCarBenefit: number;
  taxableGross: number;
}

export interface TaxBreakdown {
  lohnsteuer: number;
  soli: number;
  kirchensteuerBase: number | null;
  source: 'pap' | 'legacy';
}

export interface SocialBreakdown {
  kv: number;
  pv: number;
  rv: number;
  av: number;
  total: number;
}

export interface StepstoneComparison {
  overall: { median: number; mean: number };
  experience: Record<string, number>;
  states: Record<string, number>;
  cities: Record<string, number>;
  companySize: Record<string, number>;
  education: Record<string, number>;
  responsibility: Record<string, number>;
  gender: Record<string, number>;
  jobGroups: Record<string, number>;
}

export const STATES = [
  { code: 'NRW', name: 'Nordrhein-Westfalen' },
  { code: 'BY', name: 'Bayern' },
  { code: 'BW', name: 'Baden-Württemberg' },
  { code: 'BE', name: 'Berlin' },
  { code: 'HH', name: 'Hamburg' },
  { code: 'HE', name: 'Hessen' },
  { code: 'NI', name: 'Niedersachsen' },
  { code: 'RP', name: 'Rheinland-Pfalz' },
  { code: 'SH', name: 'Schleswig-Holstein' },
  { code: 'SN', name: 'Sachsen' },
  { code: 'TH', name: 'Thüringen' },
  { code: 'BB', name: 'Brandenburg' },
  { code: 'HB', name: 'Bremen' },
  { code: 'MV', name: 'Mecklenburg-Vorpommern' },
  { code: 'SL', name: 'Saarland' },
  { code: 'ST', name: 'Sachsen-Anhalt' },
];

export const TAX_CLASSES = [
  { value: '1', label: '1 - Bekar', description: 'Bekar, dul, ayrı yaşayan' },
  { value: '2', label: '2 - Tek Ebeveyn', description: 'Tek başına çocuk yetiştiren' },
  { value: '3', label: '3 - Evli (Yüksek Gelir)', description: 'Evli, eşi çalışmıyor veya düşük gelirli' },
  { value: '4', label: '4 - Evli (Eşit Gelir)', description: 'Evli, eşit gelirli' },
  { value: '5', label: '5 - Evli (Düşük Gelir)', description: 'Evli, eşi Steuerklasse 3' },
  { value: '6', label: '6 - İkinci İş', description: 'Birden fazla işveren varsa' },
];
