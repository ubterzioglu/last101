'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { Calculator, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface SalaryData {
  position: string;
  industry: string;
  experience: string;
  minSalary: number;
  maxSalary: number;
  avgSalary: number;
}

const SALARY_DATA: SalaryData[] = [
  {
    position: 'Software Engineer',
    industry: 'Technology',
    experience: 'Mid-level (3-5 years)',
    minSalary: 55000,
    maxSalary: 85000,
    avgSalary: 70000,
  },
  {
    position: 'Software Engineer',
    industry: 'Technology',
    experience: 'Senior (5-10 years)',
    minSalary: 70000,
    maxSalary: 110000,
    avgSalary: 90000,
  },
  {
    position: 'Software Engineer',
    industry: 'Technology',
    experience: 'Lead (10+ years)',
    minSalary: 90000,
    maxSalary: 140000,
    avgSalary: 115000,
  },
  {
    position: 'Product Manager',
    industry: 'Technology',
    experience: 'Mid-level (3-5 years)',
    minSalary: 65000,
    maxSalary: 95000,
    avgSalary: 80000,
  },
  {
    position: 'Product Manager',
    industry: 'Technology',
    experience: 'Senior (5-10 years)',
    minSalary: 80000,
    maxSalary: 120000,
    avgSalary: 100000,
  },
  {
    position: 'Data Scientist',
    industry: 'Technology',
    experience: 'Mid-level (3-5 years)',
    minSalary: 60000,
    maxSalary: 90000,
    avgSalary: 75000,
  },
  {
    position: 'Data Scientist',
    industry: 'Technology',
    experience: 'Senior (5-10 years)',
    minSalary: 75000,
    maxSalary: 115000,
    avgSalary: 95000,
  },
  {
    position: 'DevOps Engineer',
    industry: 'Technology',
    experience: 'Mid-level (3-5 years)',
    minSalary: 58000,
    maxSalary: 88000,
    avgSalary: 73000,
  },
  {
    position: 'DevOps Engineer',
    industry: 'Technology',
    experience: 'Senior (5-10 years)',
    minSalary: 72000,
    maxSalary: 110000,
    avgSalary: 91000,
  },
];

export default function StepstoneClient() {
  const [selectedPosition, setSelectedPosition] = useState<string>('');
  const [selectedExperience, setSelectedExperience] = useState<string>('');
  const [currentSalary, setCurrentSalary] = useState<number>(0);
  const [comparisonResult, setComparisonResult] = useState<{
    position: string;
    industry: string;
    experience: string;
    marketMin: number;
    marketMax: number;
    marketAvg: number;
    difference: number;
    percentage: number;
  } | null>(null);

  const handleCompare = () => {
    const selected = SALARY_DATA.find(
      (item) =>
        item.position === selectedPosition &&
        item.experience === selectedExperience
    );

    if (selected && currentSalary > 0) {
      const difference = currentSalary - selected.avgSalary;
      const percentage = ((currentSalary - selected.avgSalary) / selected.avgSalary) * 100;

      setComparisonResult({
        position: selected.position,
        industry: selected.industry,
        experience: selected.experience,
        marketMin: selected.minSalary,
        marketMax: selected.maxSalary,
        marketAvg: selected.avgSalary,
        difference,
        percentage,
      });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const uniquePositions = Array.from(new Set(SALARY_DATA.map((item) => item.position)));
  const uniqueExperiences = Array.from(
    new Set(SALARY_DATA.map((item) => item.experience))
  );

  return (
    <div className="max-w-xl mx-auto space-y-4">
      {/* Info Card */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-lg border-t-4 border-google-blue">
        <div className="px-5 pt-5 pb-1 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            StepStone 2026 Maaş Karşılaştırma
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Maaşınızı pazar ortalamasıyla karşılaştırın
          </p>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-2xl shadow-lg p-5 border-t-4 border-google-red">
        <h2 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
          <Calculator size={20} />
          Karşılaştırma Bilgileri
        </h2>

        <div className="grid gap-4">
          {/* Position */}
          <div className="bg-google-blue/10 rounded-xl p-3 border border-google-blue/20">
            <label className="text-xs text-gray-500 mb-2 block">Pozisyon</label>
            <select
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-google-blue/30"
            >
              <option value="">Seçiniz</option>
              {uniquePositions.map((pos) => (
                <option key={pos} value={pos}>
                  {pos}
                </option>
              ))}
            </select>
          </div>

          {/* Experience */}
          <div className="bg-google-blue/10 rounded-xl p-3 border border-google-blue/20">
            <label className="text-xs text-gray-500 mb-2 block">Deneyim</label>
            <select
              value={selectedExperience}
              onChange={(e) => setSelectedExperience(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-google-blue/30"
            >
              <option value="">Seçiniz</option>
              {uniqueExperiences.map((exp) => (
                <option key={exp} value={exp}>
                  {exp}
                </option>
              ))}
            </select>
          </div>

          {/* Current Salary */}
          <div className="bg-google-blue/10 rounded-xl p-3 border border-google-blue/20">
            <label className="text-xs text-gray-500 mb-2 block">
              Mevcut Maaşınız (Yıllık €)
            </label>
            <input
              type="number"
              value={currentSalary}
              onChange={(e) => setCurrentSalary(Number(e.target.value))}
              className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-google-blue/30"
              placeholder="75000"
            />
          </div>
        </div>

        <button
          onClick={handleCompare}
          disabled={!selectedPosition || !selectedExperience || currentSalary <= 0}
          className={cn(
            'mt-4 w-full py-3 px-6 font-semibold rounded-xl transition-all',
            !selectedPosition || !selectedExperience || currentSalary <= 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-google-blue text-white hover:bg-blue-600 active:scale-95'
          )}
        >
          Karşılaştır
        </button>
      </div>

      {/* Results */}
      {comparisonResult && (
        <div className="bg-white rounded-2xl shadow-lg p-5 border-t-4 border-google-green">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Sonuç</h2>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-google-blue/10 rounded-xl p-3 border border-google-blue/20">
              <h3 className="text-xs text-gray-500 mb-1">Pazar Minimum</h3>
              <div className="text-lg font-bold text-gray-900">
                {formatCurrency(comparisonResult.marketMin)}
              </div>
            </div>
            <div className="bg-google-blue/10 rounded-xl p-3 border border-google-blue/20">
              <h3 className="text-xs text-gray-500 mb-1">Pazar Maksimum</h3>
              <div className="text-lg font-bold text-gray-900">
                {formatCurrency(comparisonResult.marketMax)}
              </div>
            </div>
            <div className="bg-google-blue/10 rounded-xl p-3 border border-google-blue/20">
              <h3 className="text-xs text-gray-500 mb-1">Pazar Ortalaması</h3>
              <div className="text-lg font-bold text-gray-900">
                {formatCurrency(comparisonResult.marketAvg)}
              </div>
            </div>
            <div className="bg-google-blue/10 rounded-xl p-3 border border-google-blue/20">
              <h3 className="text-xs text-gray-500 mb-1">Maaşınız</h3>
              <div className="text-lg font-bold text-gray-900">
                {formatCurrency(currentSalary)}
              </div>
            </div>
          </div>

          {/* Comparison Indicator */}
          <div
            className={cn(
              'rounded-xl p-4 flex items-center gap-3',
              comparisonResult.percentage > 5
                ? 'bg-green-50 border border-green-200'
                : comparisonResult.percentage < -5
                ? 'bg-red-50 border border-red-200'
                : 'bg-yellow-50 border border-yellow-200'
            )}
          >
            {comparisonResult.percentage > 5 ? (
              <TrendingUp className="w-8 h-8 text-green-600 flex-shrink-0" />
            ) : comparisonResult.percentage < -5 ? (
              <TrendingDown className="w-8 h-8 text-red-600 flex-shrink-0" />
            ) : (
              <Minus className="w-8 h-8 text-yellow-600 flex-shrink-0" />
            )}
            <div>
              <div className="text-sm font-medium text-gray-700">
                {comparisonResult.percentage > 5
                  ? 'Maaşınız pazar ortalamasının üzerinde'
                  : comparisonResult.percentage < -5
                  ? 'Maaşınız pazar ortalamasının altında'
                  : 'Maaşınız pazar ortalamasına yakın'}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {comparisonResult.difference > 0 ? '+' : ''}
                {formatCurrency(comparisonResult.difference)} (
                {comparisonResult.percentage > 0 ? '+' : ''}
                {comparisonResult.percentage.toFixed(1)}%)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Market Data */}
      <div className="bg-white rounded-2xl shadow-lg p-5 border-t-4 border-google-yellow">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Pazar Verileri (StepStone 2026)
        </h2>
        <div className="space-y-2">
          {SALARY_DATA.map((item, index) => (
            <div
              key={index}
              className="bg-google-blue/10 rounded-lg p-3 border border-google-blue/20"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-sm">
                    {item.position}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {item.experience}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900 text-sm">
                    {formatCurrency(item.avgSalary)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatCurrency(item.minSalary)} - {formatCurrency(item.maxSalary)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
