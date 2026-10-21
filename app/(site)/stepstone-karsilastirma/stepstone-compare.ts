import { STEPSTONE_2026 } from '@/lib/salary/stepstone-data';

export const STATE_OPTIONS = [
  { value: 'BE', label: 'Berlin' },
  { value: 'BB', label: 'Brandenburg' },
  { value: 'BW', label: 'Baden-Württemberg' },
  { value: 'BY', label: 'Bayern' },
  { value: 'HB', label: 'Bremen' },
  { value: 'HE', label: 'Hessen' },
  { value: 'HH', label: 'Hamburg' },
  { value: 'MV', label: 'Mecklenburg-Vorpommern' },
  { value: 'NI', label: 'Niedersachsen' },
  { value: 'NRW', label: 'Nordrhein-Westfalen' },
  { value: 'RP', label: 'Rheinland-Pfalz' },
  { value: 'SH', label: 'Schleswig-Holstein' },
  { value: 'SL', label: 'Saarland' },
  { value: 'SN', label: 'Sachsen' },
  { value: 'ST', label: 'Sachsen-Anhalt' },
  { value: 'TH', label: 'Thüringen' },
];

export interface StepstoneFormState {
  grossMonthly: string;
  state: string;
  jobGroup: string;
  experience: string;
  city: string;
  companySize: string;
  education: string;
  responsibility: string;
  gender: string;
}

export interface CompareRow {
  label: string;
  median: number;
  diff: number;
  diffPct: number;
}

export interface StepstoneResult {
  grossYearly: number;
  picks: Record<string, string>;
  rows: CompareRow[];
}

export const INITIAL_STEPSTONE_FORM: StepstoneFormState = {
  grossMonthly: '',
  state: '',
  jobGroup: '',
  experience: '',
  city: '',
  companySize: '',
  education: '',
  responsibility: '',
  gender: '',
};

/** Validation and comparison, unchanged from the original client. */
export function buildResult(form: StepstoneFormState): { result?: StepstoneResult; missing: string[] } {
  const grossMonthly = parseFloat(form.grossMonthly);
  const missing: string[] = [];
  if (!grossMonthly || grossMonthly <= 0) missing.push('Aylık Brüt Maaş');
  if (!form.state) missing.push('Eyalet');
  if (!form.jobGroup) missing.push('Meslek grubu');
  if (!form.experience) missing.push('Deneyim');
  if (!form.city) missing.push('Şehir');
  if (!form.companySize) missing.push('Şirket büyüklüğü');
  if (!form.education) missing.push('Eğitim');
  if (!form.responsibility) missing.push('Personalverantwortung');
  if (!form.gender) missing.push('Cinsiyet');

  if (missing.length) return { missing };

  const grossYearly = Math.round(grossMonthly * 12);

  function row(label: string, median: number): CompareRow {
    const diff = grossYearly - median;
    const diffPct = (diff / median) * 100;
    return { label, median, diff, diffPct };
  }

  const stateName = STATE_OPTIONS.find((s) => s.value === form.state)?.label ?? form.state;
  const eduLabel = form.education === 'yes' ? 'Var' : 'Yok';
  const respLabel = form.responsibility === 'yes' ? 'Var' : 'Yok';
  const genderLabel = form.gender === 'm' ? 'Erkek' : 'Kadın';

  return {
    missing: [],
    result: {
      grossYearly,
      picks: {
        'Eyalet': stateName,
        'Meslek grubu': form.jobGroup,
        'Deneyim': form.experience,
        'Şehir': form.city,
        'Şirket büyüklüğü': form.companySize,
        'Eğitim': eduLabel,
        'Personalverantwortung': respLabel,
        'Cinsiyet': genderLabel,
      },
      rows: [
        row('Genel Almanya (Median)', STEPSTONE_2026.overall.median),
        row('Genel Almanya (Ortalama)', STEPSTONE_2026.overall.mean),
        row(`Eyalet (${stateName})`, (STEPSTONE_2026.states as Record<string, number>)[form.state]),
        row(`Meslek grubu (${form.jobGroup})`, (STEPSTONE_2026.jobGroups as Record<string, number>)[form.jobGroup]),
        row(`Deneyim (${form.experience})`, (STEPSTONE_2026.experience as Record<string, number>)[form.experience]),
        row(`Şehir (${form.city})`, (STEPSTONE_2026.cities as Record<string, number>)[form.city]),
        row(`Şirket büyüklüğü (${form.companySize})`, (STEPSTONE_2026.companySize as Record<string, number>)[form.companySize]),
        row(`Eğitim (${eduLabel})`, STEPSTONE_2026.education[form.education as 'yes' | 'no']),
        row(`Personalverantwortung (${respLabel})`, STEPSTONE_2026.responsibility[form.responsibility as 'yes' | 'no']),
        row(`Cinsiyet (${genderLabel})`, STEPSTONE_2026.gender[form.gender as 'm' | 'f']),
      ],
    },
  };
}
