'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import {
  STEPSTONE_2026,
  EXPERIENCE_OPTIONS,
  COMPANY_SIZE_OPTIONS,
  EDUCATION_OPTIONS,
  RESPONSIBILITY_OPTIONS,
  GENDER_OPTIONS,
  getSortedJobGroups,
  getSortedCities,
} from '@/lib/salary/stepstone-data';

const EUR = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

const STATE_OPTIONS = [
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

interface FormState {
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

interface CompareRow {
  label: string;
  median: number;
  diff: number;
  diffPct: number;
}

interface Result {
  grossYearly: number;
  picks: Record<string, string>;
  rows: CompareRow[];
}

const INITIAL: FormState = {
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

function buildResult(form: FormState): { result?: Result; missing: string[] } {
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

  const stateName = STATE_OPTIONS.find(s => s.value === form.state)?.label ?? form.state;
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

const JOB_GROUPS = getSortedJobGroups();
const CITIES = getSortedCities();

export default function StepstoneClient() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [result, setResult] = useState<Result | null>(null);
  const [missing, setMissing] = useState<string[]>([]);
  const [showInfo, setShowInfo] = useState(false);
  const [showWhy, setShowWhy] = useState(false);

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [key]: e.target.value }));
  };

  const handleCompare = () => {
    const out = buildResult(form);
    setMissing(out.missing);
    setResult(out.result ?? null);
  };

  const handleReset = () => {
    setForm(INITIAL);
    setResult(null);
    setMissing([]);
  };

  return (
    <div className="space-y-2">

      {/* Başlık */}
      <div className="bg-white rounded-xl border-2 border-google-blue px-4 py-3">
        <h1 className="text-2xl font-bold leading-tight">Stepstone 2026 Karşılaştırma</h1>
      </div>

      {/* Nasıl Çalışır? */}
      <div
        className="bg-white rounded-xl border-2 border-google-blue overflow-hidden cursor-pointer select-none"
        onClick={() => setShowInfo(!showInfo)}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <span className="font-semibold text-gray-900">Nasıl Çalışır?</span>
          <span className={cn('text-google-blue text-xl transition-transform duration-200', showInfo && 'rotate-180')}>▾</span>
        </div>
        {showInfo && (
          <div className="px-4 pb-4 bg-blue-50 border-t border-blue-200">
            <ul className="space-y-2 text-sm text-blue-800 pt-3">
              <li>• Aylık brüt maaşını ve profilini gir, Stepstone 2026 medyanlarıyla karşılaştır.</li>
              <li>• Eyalet, meslek grubu, deneyim, şehir gibi 8 farklı boyutta analiz üretilir.</li>
              <li>• Kaynak: Stepstone Gehaltsreport 2026 (PDF). Bilgilendirme amaçlıdır.</li>
            </ul>
          </div>
        )}
      </div>

      {/* Bu araç neden var? */}
      <div
        className="bg-white rounded-xl border-2 border-google-green overflow-hidden cursor-pointer select-none"
        onClick={() => setShowWhy(!showWhy)}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <span className="font-semibold text-gray-900">Bu araç neden var?</span>
          <span className={cn('text-google-green text-xl transition-transform duration-200', showWhy && 'rotate-180')}>▾</span>
        </div>
        {showWhy && (
          <div className="px-4 pb-4 bg-green-50 border-t border-green-200">
            <p className="text-sm text-green-900 pt-3 leading-relaxed">
              Almanya iş piyasasında maaş müzakeresi yaparken elinizde somut veri olması büyük avantaj sağlar. Bu araç, StepStone'un 2026 yılı için derlediği kapsamlı maaş raporundaki medyan değerleriyle mevcut brüt maaşını karşılaştırır. Eyalet, meslek grubu, deneyim yılı, şehir büyüklüğü, şirket büyüklüğü, eğitim düzeyi ve cinsiyet gibi etkenlerin maaşa olan katkısını boyut boyut görebilirsin. Zam talebin ya da yeni iş teklifini değerlendirirken piyasa verisine dayalı güçlü bir perspektif sunar.
            </p>
          </div>
        )}
      </div>

      {/* Input Card */}
      <div className="bg-white rounded-xl border-2 border-google-yellow p-5">
        <h2 className="text-gray-900 font-bold text-lg mb-4">Profil Bilgileri</h2>

        <div className="space-y-3">
          {/* Aylık Brüt */}
          <div>
            <label className="text-xs text-gray-500 block mb-1">Aylık Brüt Maaş (€)</label>
            <input
              type="number"
              value={form.grossMonthly}
              onChange={set('grossMonthly')}
              placeholder="4500"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-google-yellow/40"
            />
          </div>

          {/* 2-column grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Eyalet</label>
              <select value={form.state} onChange={set('state')} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-google-yellow/40 bg-white">
                <option value="">Seç</option>
                {STATE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-500 block mb-1">Deneyim</label>
              <select value={form.experience} onChange={set('experience')} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-google-yellow/40 bg-white">
                <option value="">Seç</option>
                {EXPERIENCE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {/* Meslek grubu - full width */}
          <div>
            <label className="text-xs text-gray-500 block mb-1">Meslek Grubu</label>
            <select value={form.jobGroup} onChange={set('jobGroup')} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-google-yellow/40 bg-white">
              <option value="">Seç</option>
              {JOB_GROUPS.map(k => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>

          {/* Şehir - full width */}
          <div>
            <label className="text-xs text-gray-500 block mb-1">Şehir</label>
            <select value={form.city} onChange={set('city')} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-google-yellow/40 bg-white">
              <option value="">Seç</option>
              {CITIES.map(k => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Şirket Büyüklüğü</label>
              <select value={form.companySize} onChange={set('companySize')} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-google-yellow/40 bg-white">
                <option value="">Seç</option>
                {COMPANY_SIZE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-500 block mb-1">Eğitim (Hochschulabschluss)</label>
              <select value={form.education} onChange={set('education')} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-google-yellow/40 bg-white">
                <option value="">Seç</option>
                {EDUCATION_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Personalverantwortung</label>
              <select value={form.responsibility} onChange={set('responsibility')} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-google-yellow/40 bg-white">
                <option value="">Seç</option>
                {RESPONSIBILITY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-500 block mb-1">Cinsiyet</label>
              <select value={form.gender} onChange={set('gender')} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-google-yellow/40 bg-white">
                <option value="">Seç</option>
                {GENDER_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        <button
          onClick={handleCompare}
          className="mt-4 w-full rounded-lg bg-google-orange text-white font-semibold py-3 hover:opacity-90 transition-opacity"
        >
          Karşılaştır
        </button>
      </div>

      {/* Missing fields warning */}
      {missing.length > 0 && (
        <div className="bg-white rounded-xl border-2 border-google-yellow p-4">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Eksik alanlar:</span> {missing.join(', ')}
          </p>
        </div>
      )}

      {/* Result */}
      {result && (
        <>
          {/* Gross summary */}
          <div className="bg-white rounded-xl border-2 border-google-green p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs text-gray-500 mb-1">Senin yıllık brütün</div>
                <div className="text-3xl font-black text-gray-900">{EUR.format(result.grossYearly)}</div>
                <div className="text-xs text-gray-400 mt-1">Kaynak: Stepstone Gehaltsreport 2026</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 mb-1">Genel Almanya</div>
                <div className="text-sm font-bold text-gray-900">Median: {EUR.format(STEPSTONE_2026.overall.median)}</div>
                <div className="text-sm font-bold text-gray-900">Ort.: {EUR.format(STEPSTONE_2026.overall.mean)}</div>
              </div>
            </div>

            {/* Picks */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="text-xs font-semibold text-gray-500 mb-2">Seçimin</div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-700">
                {Object.entries(result.picks).map(([k, v]) => (
                  <div key={k} className="flex gap-1">
                    <span className="text-gray-400 shrink-0">•</span>
                    <span><span className="text-gray-500">{k}:</span> <span className="font-semibold">{v}</span></span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Compare rows */}
          <div className="bg-white rounded-xl border-2 border-google-blue p-5">
            <h2 className="text-gray-900 font-bold text-lg mb-3">Boyuta Göre Karşılaştırma</h2>
            <div className="space-y-2">
              {result.rows.map((r) => {
                const above = r.diff > 0;
                const sign = r.diff > 0 ? '+' : '';
                return (
                  <div key={r.label} className="flex items-center justify-between rounded-xl border border-google-blue/20 bg-google-blue/10 px-3 py-2.5">
                    <div className="text-sm text-gray-700 flex-1 min-w-0 pr-2">{r.label}</div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-bold text-gray-900">{EUR.format(r.median)}</div>
                      <div className={cn('text-xs font-semibold', above ? 'text-green-600' : 'text-red-500')}>
                        {sign}{EUR.format(r.diff)} ({sign}{r.diffPct.toFixed(1)}%)
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <button onClick={handleReset} className="w-full flex items-center justify-center rounded-xl border-2 border-google-orange bg-google-orange text-white font-semibold py-3 hover:opacity-90 transition-opacity">
            Sıfırla
          </button>
          <Link href="/" className="w-full flex items-center justify-center rounded-xl border-2 border-google-yellow bg-google-yellow text-white font-semibold py-3 hover:opacity-90 transition-opacity">
            Ana Sayfaya Dön
          </Link>
        </>
      )}
      <Link href="/" className="w-full flex items-center justify-center rounded-xl border-2 border-google-yellow bg-google-yellow text-white font-semibold py-3 hover:opacity-90 transition-opacity">
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}
