'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils/cn';
import { formatCurrency, formatPercent } from '@/lib/salary/calculator';
import { STEPSTONE_2026, getSortedJobGroups, getSortedCities, EXPERIENCE_OPTIONS, COMPANY_SIZE_OPTIONS, EDUCATION_OPTIONS, RESPONSIBILITY_OPTIONS, GENDER_OPTIONS } from '@/lib/salary/stepstone-data';
import { STATES } from '@/lib/salary/types';
import { TrendingUp, Building2, Users, GraduationCap, Briefcase, User } from 'lucide-react';

export default function StepstoneClient() {
  const [grossYearly, setGrossYearly] = useState<number>(60000);
  const [jobGroup, setJobGroup] = useState('');
  const [experience, setExperience] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [education, setEducation] = useState('');
  const [responsibility, setResponsibility] = useState('');
  const [gender, setGender] = useState('');

  const [calculatedGross, setCalculatedGross] = useState<number | null>(null);

  const handleCalculate = () => {
    setCalculatedGross(grossYearly);
  };

  const comparisonData = useMemo(() => {
    if (calculatedGross === null) return [];
    const comparisons: Array<{ title: string; median: number; diff: number; diffPercent: number }> = [];

    if (jobGroup) {
      const median = STEPSTONE_2026.jobGroups[jobGroup as keyof typeof STEPSTONE_2026.jobGroups] || 0;
      comparisons.push({
        title: `Meslek: ${jobGroup}`,
        median,
        diff: calculatedGross - median,
        diffPercent: ((calculatedGross / median) - 1) * 100,
      });
    }

    if (experience) {
      const median = STEPSTONE_2026.experience[experience as keyof typeof STEPSTONE_2026.experience] || 0;
      comparisons.push({
        title: `Deneyim: ${EXPERIENCE_OPTIONS.find(e => e.value === experience)?.label}`,
        median,
        diff: calculatedGross - median,
        diffPercent: ((calculatedGross / median) - 1) * 100,
      });
    }

    if (city) {
      const median = STEPSTONE_2026.cities[city as keyof typeof STEPSTONE_2026.cities] || 0;
      comparisons.push({
        title: `Şehir: ${city}`,
        median,
        diff: calculatedGross - median,
        diffPercent: ((calculatedGross / median) - 1) * 100,
      });
    }

    if (state) {
      const median = STEPSTONE_2026.states[state as keyof typeof STEPSTONE_2026.states] || 0;
      comparisons.push({
        title: `Eyalet: ${STATES.find(s => s.code === state)?.name}`,
        median,
        diff: calculatedGross - median,
        diffPercent: ((calculatedGross / median) - 1) * 100,
      });
    }

    if (companySize) {
      const median = STEPSTONE_2026.companySize[companySize as keyof typeof STEPSTONE_2026.companySize] || 0;
      comparisons.push({
        title: `Şirket: ${COMPANY_SIZE_OPTIONS.find(c => c.value === companySize)?.label}`,
        median,
        diff: calculatedGross - median,
        diffPercent: ((calculatedGross / median) - 1) * 100,
      });
    }

    return comparisons;
  }, [calculatedGross, jobGroup, experience, city, state, companySize]);

  const jobGroups = getSortedJobGroups();
  const cities = getSortedCities();

  return (
    <div className="max-w-xl mx-auto space-y-4">
      {/* Header */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-lg border-t-4 border-google-orange px-5 py-5 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Stepstone 2026 Karşılaştırma</h1>
        <p className="text-gray-500 text-sm mt-1">Maaşını Almanya medyanıyla karşılaştır</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-lg p-5 border-t-4 border-google-orange">
        <h2 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
          <TrendingUp size={20} />
          Girdi
        </h2>

        {/* Gross yearly */}
        <div className="bg-gray-50 rounded-xl p-3 mb-4">
          <label className="text-xs text-gray-500 mb-2 block">Yıllık Brüt Maaş (€)</label>
          <input
            type="number"
            value={grossYearly}
            onChange={(e) => setGrossYearly(Number(e.target.value))}
            className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-google-orange/30"
            placeholder="60000"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-xl p-3">
            <label className="text-xs text-gray-500 mb-2 flex items-center gap-1">
              <Briefcase size={14} /> Meslek grubu
            </label>
            <select
              value={jobGroup}
              onChange={(e) => setJobGroup(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 text-sm focus:outline-none"
            >
              <option value="">Seç</option>
              {jobGroups.map(jg => (
                <option key={jg} value={jg}>{jg}</option>
              ))}
            </select>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <label className="text-xs text-gray-500 mb-2 flex items-center gap-1">
              <Users size={14} /> Deneyim
            </label>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 text-sm focus:outline-none"
            >
              <option value="">Seç</option>
              {EXPERIENCE_OPTIONS.map(exp => (
                <option key={exp.value} value={exp.value}>{exp.label}</option>
              ))}
            </select>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <label className="text-xs text-gray-500 mb-2 flex items-center gap-1">
              <Building2 size={14} /> Şehir
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 text-sm focus:outline-none"
            >
              <option value="">Seç</option>
              {cities.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <label className="text-xs text-gray-500 mb-2 flex items-center gap-1">
              <Building2 size={14} /> Eyalet
            </label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 text-sm focus:outline-none"
            >
              <option value="">Seç</option>
              {STATES.map(s => (
                <option key={s.code} value={s.code}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <label className="text-xs text-gray-500 mb-2 flex items-center gap-1">
              <Building2 size={14} /> Şirket büyüklüğü
            </label>
            <select
              value={companySize}
              onChange={(e) => setCompanySize(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 text-sm focus:outline-none"
            >
              <option value="">Seç</option>
              {COMPANY_SIZE_OPTIONS.map(cs => (
                <option key={cs.value} value={cs.value}>{cs.label}</option>
              ))}
            </select>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <label className="text-xs text-gray-500 mb-2 flex items-center gap-1">
              <GraduationCap size={14} /> Eğitim
            </label>
            <select
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 text-sm focus:outline-none"
            >
              <option value="">Seç</option>
              {EDUCATION_OPTIONS.map(edu => (
                <option key={edu.value} value={edu.value}>{edu.label}</option>
              ))}
            </select>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <label className="text-xs text-gray-500 mb-2 flex items-center gap-1">
              <Briefcase size={14} /> Sorumluluk
            </label>
            <select
              value={responsibility}
              onChange={(e) => setResponsibility(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 text-sm focus:outline-none"
            >
              <option value="">Seç</option>
              {RESPONSIBILITY_OPTIONS.map(resp => (
                <option key={resp.value} value={resp.value}>{resp.label}</option>
              ))}
            </select>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <label className="text-xs text-gray-500 mb-2 flex items-center gap-1">
              <User size={14} /> Cinsiyet
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 text-sm focus:outline-none"
            >
              <option value="">Seç</option>
              {GENDER_OPTIONS.map(g => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleCalculate}
          className="mt-4 w-full py-3 px-6 bg-google-orange text-white font-semibold rounded-xl hover:bg-orange-500 active:scale-95 transition-all"
        >
          Karşılaştır
        </button>
      </div>

      {/* Results */}
      {calculatedGross !== null && (
        <div className="bg-white rounded-2xl shadow-lg p-5 border-t-4 border-google-orange">
          <div className="flex justify-between items-center pb-3 border-b border-gray-200 mb-3">
            <div>
              <div className="text-sm text-gray-500">Senin yıllık brütün</div>
              <div className="text-2xl font-bold text-gray-900">{formatCurrency(calculatedGross)}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Genel Almanya Medyanı</div>
              <div className="text-lg font-semibold text-gray-900">{formatCurrency(STEPSTONE_2026.overall.median)}</div>
              <div className={cn(
                'text-xs',
                calculatedGross - STEPSTONE_2026.overall.median >= 0 ? 'text-green-600' : 'text-red-600'
              )}>
                {calculatedGross - STEPSTONE_2026.overall.median >= 0 ? '+' : ''}
                {formatCurrency(calculatedGross - STEPSTONE_2026.overall.median)}
              </div>
            </div>
          </div>

          {comparisonData.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-2">Karşılaştırma için en az bir alan seç.</p>
          ) : (
            <div className="space-y-3">
              {comparisonData.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                  <div className="text-sm text-gray-700">{item.title}</div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{formatCurrency(item.median)}</div>
                    <div className={cn(
                      'text-xs',
                      item.diff >= 0 ? 'text-green-600' : 'text-red-600'
                    )}>
                      Fark: {item.diff >= 0 ? '+' : ''}{formatCurrency(item.diff)} ({formatPercent(item.diffPercent)})
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
