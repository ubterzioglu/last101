// Şirket Aracı (Dienstwagen) Hesaplama

export interface CompanyCarConfig {
  enabled: boolean;
  listPrice: number;
  rate: number;
  commuteEnabled: boolean;
  commuteKm: number;
  commuteMode: 'monthly' | 'daily';
  commuteDays: number;
}

export const CAR_RATES = [
  { value: 0.01, label: '%1 (Standart)' },
  { value: 0.005, label: '%0.5 (Elektrik/Hibrit)' },
  { value: 0.0025, label: '%0.25 (Tam Elektrik)' },
];

export function calcCompanyCarBenefit(config: CompanyCarConfig): number {
  if (!config.enabled || !config.listPrice || config.listPrice <= 0) {
    return 0;
  }

  let benefit = config.listPrice * config.rate;

  if (config.commuteEnabled && config.commuteKm > 0) {
    if (config.commuteMode === 'daily') {
      benefit += config.listPrice * config.commuteKm * 0.00002 * config.commuteDays;
    } else {
      benefit += config.listPrice * config.commuteKm * 0.0003;
    }
  }

  return Math.round(benefit * 100) / 100;
}
