'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils/cn';
import { calculateSalary, formatCurrency } from '@/lib/salary/calculator';
import { STATES, TAX_CLASSES, type SalaryInput } from '@/lib/salary/types';
import { CAR_RATES } from '@/lib/salary/company-car';
import { Calculator, ChevronDown, ChevronUp } from 'lucide-react';

export default function MaasClient() {
  // Form state
  const [amount, setAmount] = useState<number>(5000);
  const [period, setPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [type, setType] = useState<'gross' | 'net'>('gross');
  const [taxClass, setTaxClass] = useState<string>('1');
  const [state, setState] = useState<string>('NRW');
  const [hasChildren, setHasChildren] = useState(false);
  const [childrenCount, setChildrenCount] = useState(0);
  const [childrenUnder25, setChildrenUnder25] = useState(0);
  const [age23Plus, setAge23Plus] = useState(true);
  const [churchTax, setChurchTax] = useState(false);
  const [childAllowance, setChildAllowance] = useState(0);
  const [insuranceType, setInsuranceType] = useState<'gkv' | 'pkv'>('gkv');
  const [kvBase, setKvBase] = useState(14.6);
  const [kvZusatz, setKvZusatz] = useState(2.5);
  const [pkvPremium, setPkvPremium] = useState(0);
  const [ppvPremium, setPpvPremium] = useState(0);

  // Company car state
  const [hasCompanyCar, setHasCompanyCar] = useState(false);
  const [carListPrice, setCarListPrice] = useState(40000);
  const [carRate, setCarRate] = useState(0.01);
  const [carCommuteEnabled, setCarCommuteEnabled] = useState(false);
  const [carCommuteKm, setCarCommuteKm] = useState(10);
  const [carCommuteMode, setCarCommuteMode] = useState<'monthly' | 'daily'>('monthly');
  const [carCommuteDays, setCarCommuteDays] = useState(15);

  // UI state
  const [showInfo, setShowInfo] = useState(false);
  const [showMonthlyBreakdown, setShowMonthlyBreakdown] = useState(false);
  const [showYearlyBreakdown, setShowYearlyBreakdown] = useState(false);

  // Calculated result (null = not yet calculated)
  const [calculatedResult, setCalculatedResult] = useState<ReturnType<typeof calculateSalary> | null>(null);

  // Build input object
  const input: SalaryInput = useMemo(() => ({
    amount,
    period,
    type,
    taxClass: taxClass as '1' | '2' | '3' | '4' | '5' | '6',
    state,
    hasChildren,
    childrenCount,
    childrenUnder25Count: childrenUnder25,
    age23Plus,
    churchTax,
    childAllowance,
    insuranceType,
    kvBase,
    kvZusatz,
    pkvPremium,
    ppvPremium,
    companyCar: {
      enabled: hasCompanyCar,
      listPrice: carListPrice,
      rate: carRate,
      commuteEnabled: carCommuteEnabled,
      commuteKm: carCommuteKm,
      commuteMode: carCommuteMode,
      commuteDays: carCommuteDays
    }
  }), [amount, period, type, taxClass, state, hasChildren, childrenCount, childrenUnder25, age23Plus, churchTax, childAllowance, insuranceType, kvBase, kvZusatz, pkvPremium, ppvPremium, hasCompanyCar, carListPrice, carRate, carCommuteEnabled, carCommuteKm, carCommuteMode, carCommuteDays]);

  const handleCalculate = () => {
    setCalculatedResult(calculateSalary(input));
  };

  return (
    <div className="max-w-xl mx-auto space-y-4">
      {/* Info Card */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-lg border-t-4 border-google-blue">
        <div className="px-5 pt-5 pb-1 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Maaş Hesaplayıcı</h1>
          <p className="text-gray-500 text-sm mt-1">Brüt → Net → Brüt</p>
        </div>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="w-full px-5 py-4 text-left text-gray-700 font-medium flex justify-between items-center hover:bg-gray-50 transition-colors"
        >
          <span>Nasıl çalışır?</span>
          <span className="text-gray-400 text-sm">{showInfo ? '▲' : '▼'}</span>
        </button>
        {showInfo && (
          <div className="px-5 pb-4 text-gray-500 text-sm border-t border-gray-100 pt-3">
            <ul className="list-disc list-inside space-y-1.5">
              <li>Kullanıcı verileri saklanmaz.</li>
              <li><strong>KV (Krankenkasse)</strong>: Yasal sağlık sigortası kesintisi. Standart oran %14.6'dır.</li>
              <li><strong>Zusatzbeitrag</strong>: Ek prim, genelde %1.6 – %2.5 arasındadır.</li>
              <li>Her iki prim de çalışan ve işveren arasında yarı yarıya paylaşılır.</li>
            </ul>
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-2xl shadow-lg p-5 border-t-4 border-google-red">
        <h2 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
          <Calculator size={20} />
          Girdi
        </h2>

        <div className="grid gap-4">
          {/* Period & Type */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-google-blue/10 rounded-xl p-3 border border-google-blue/20">
              <label className="text-xs text-gray-500 mb-2 block">Periyot</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setPeriod('monthly')}
                  className={cn(
                    'flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors',
                    period === 'monthly' ? 'bg-google-blue text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  )}
                >
                  Aylık
                </button>
                <button
                  onClick={() => setPeriod('yearly')}
                  className={cn(
                    'flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors',
                    period === 'yearly' ? 'bg-google-blue text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  )}
                >
                  Yıllık
                </button>
              </div>
            </div>
            <div className="bg-google-blue/10 rounded-xl p-3 border border-google-blue/20">
              <label className="text-xs text-gray-500 mb-2 block">Tip</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setType('gross')}
                  className={cn(
                    'flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors',
                    type === 'gross' ? 'bg-google-blue text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  )}
                >
                  Brüt
                </button>
                <button
                  onClick={() => setType('net')}
                  className={cn(
                    'flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors',
                    type === 'net' ? 'bg-google-blue text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  )}
                >
                  Net
                </button>
              </div>
            </div>
          </div>

          {/* Amount */}
          <div className="bg-google-blue/10 rounded-xl p-3 border border-google-blue/20">
            <label className="text-xs text-gray-500 mb-2 block">Miktar (€)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-google-blue/30"
              placeholder="5000"
            />
          </div>

          {/* Tax Class & State */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-google-blue/10 rounded-xl p-3 border border-google-blue/20">
              <label className="text-xs text-gray-500 mb-2 block">Steuerklasse</label>
              <select
                value={taxClass}
                onChange={(e) => setTaxClass(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-google-blue/30"
              >
                {TAX_CLASSES.map(tc => (
                  <option key={tc.value} value={tc.value}>
                    {tc.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="bg-google-blue/10 rounded-xl p-3 border border-google-blue/20">
              <label className="text-xs text-gray-500 mb-2 block">Eyalet</label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-google-blue/30"
              >
                {STATES.map(s => (
                  <option key={s.code} value={s.code}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Children */}
          <div className="bg-google-blue/10 rounded-xl p-3 border border-google-blue/20">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={hasChildren}
                onChange={(e) => setHasChildren(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-google-blue focus:ring-google-blue/30"
              />
              <span className="text-gray-700">Çocuk var</span>
            </label>
          </div>

          {hasChildren && (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-google-blue/10 rounded-xl p-3 border border-google-blue/20">
                <label className="text-xs text-gray-500 mb-2 block">Çocuk sayısı</label>
                <input
                  type="number"
                  value={childrenCount}
                  onChange={(e) => setChildrenCount(Number(e.target.value))}
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900"
                />
              </div>
              <div className="bg-google-blue/10 rounded-xl p-3 border border-google-blue/20">
                <label className="text-xs text-gray-500 mb-2 block">25 yaş altı</label>
                <input
                  type="number"
                  value={childrenUnder25}
                  onChange={(e) => setChildrenUnder25(Number(e.target.value))}
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900"
                />
              </div>
            </div>
          )}

          {/* Age & Church Tax */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-google-blue/10 rounded-xl p-3 border border-google-blue/20">
              <label className="text-xs text-gray-500 mb-2 block">Yaş</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setAge23Plus(false)}
                  className={cn(
                    'flex-1 py-2 px-2 rounded-lg text-xs font-medium transition-colors',
                    !age23Plus ? 'bg-google-blue text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  )}
                >
                  23 altı
                </button>
                <button
                  onClick={() => setAge23Plus(true)}
                  className={cn(
                    'flex-1 py-2 px-2 rounded-lg text-xs font-medium transition-colors',
                    age23Plus ? 'bg-google-blue text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  )}
                >
                  23 ve üzeri
                </button>
              </div>
            </div>
            <div className="bg-google-blue/10 rounded-xl p-3 border border-google-blue/20">
              <label className="flex items-center gap-3 cursor-pointer h-full">
                <input
                  type="checkbox"
                  checked={churchTax}
                  onChange={(e) => setChurchTax(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-google-blue focus:ring-google-blue/30"
                />
                <span className="text-gray-700">Kilise vergisi</span>
              </label>
            </div>
          </div>

          {/* Child Allowance */}
          <div className="bg-google-blue/10 rounded-xl p-3 border border-google-blue/20">
            <label className="text-xs text-gray-500 mb-2 block">Kinderfreibetrag (ZKF)</label>
            <input
              type="number"
              step="0.5"
              value={childAllowance}
              onChange={(e) => setChildAllowance(Number(e.target.value))}
              className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-900"
            />
          </div>

          {/* Company Car */}
          <div className="bg-google-blue/10 rounded-xl p-3 border border-google-blue/20">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={hasCompanyCar}
                onChange={(e) => setHasCompanyCar(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-google-blue focus:ring-google-blue/30"
              />
              <span className="text-gray-700">Dienstwagen (Şirket Aracı)</span>
            </label>
          </div>

          {hasCompanyCar && (
            <div className="bg-google-blue/15 rounded-xl p-4 space-y-3 border border-google-blue/25">
              <div className="bg-white/90 rounded-lg p-3 border border-google-blue/10">
                <label className="text-xs text-gray-500 mb-2 block">Brüt Liste Fiyatı (€)</label>
                <input
                  type="number"
                  value={carListPrice}
                  onChange={(e) => setCarListPrice(Number(e.target.value))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-900"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {CAR_RATES.map(rate => (
                  <button
                    key={rate.value}
                    onClick={() => setCarRate(rate.value)}
                    className={cn(
                      'py-2 px-2 rounded-lg text-xs font-medium transition-colors',
                      carRate === rate.value ? 'bg-google-blue text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    )}
                  >
                    {rate.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Insurance Type */}
          <div className="bg-google-blue/10 rounded-xl p-3 border border-google-blue/20">
            <label className="text-xs text-gray-500 mb-2 block">Sigorta</label>
            <div className="flex gap-2">
              <button
                onClick={() => setInsuranceType('gkv')}
                className={cn(
                  'flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors',
                  insuranceType === 'gkv' ? 'bg-google-blue text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                )}
              >
                GKV (Yasal)
              </button>
              <button
                onClick={() => setInsuranceType('pkv')}
                className={cn(
                  'flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors',
                  insuranceType === 'pkv' ? 'bg-google-blue text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                )}
              >
                PKV (Özel)
              </button>
            </div>
          </div>

          {insuranceType === 'gkv' ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-google-blue/10 rounded-xl p-3 border border-google-blue/20">
                <label className="text-xs text-gray-500 mb-2 block">KV Kassensatz (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={kvBase}
                  onChange={(e) => setKvBase(Number(e.target.value))}
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900"
                />
              </div>
              <div className="bg-google-blue/10 rounded-xl p-3 border border-google-blue/20">
                <label className="text-xs text-gray-500 mb-2 block">KV Zusatz (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={kvZusatz}
                  onChange={(e) => setKvZusatz(Number(e.target.value))}
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-google-blue/10 rounded-xl p-3 border border-google-blue/20">
                <label className="text-xs text-gray-500 mb-2 block">PKV Primi (€)</label>
                <input
                  type="number"
                  value={pkvPremium}
                  onChange={(e) => setPkvPremium(Number(e.target.value))}
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900"
                />
              </div>
              <div className="bg-google-blue/10 rounded-xl p-3 border border-google-blue/20">
                <label className="text-xs text-gray-500 mb-2 block">PPV Primi (€)</label>
                <input
                  type="number"
                  value={ppvPremium}
                  onChange={(e) => setPpvPremium(Number(e.target.value))}
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900"
                />
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleCalculate}
          className="mt-4 w-full py-3 px-6 bg-google-blue text-white font-semibold rounded-xl hover:bg-blue-600 active:scale-95 transition-all"
        >
          Hesapla
        </button>
      </div>

      {calculatedResult && (
      <>

      {/* Results */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl shadow-lg p-4 border-t-4 border-google-green">
          <h3 className="text-sm text-gray-500 mb-2">Net Maaş (Aylık)</h3>
          <div className="text-2xl font-bold text-gray-900">{formatCurrency(calculatedResult.netMonthly)}</div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-4 border-t-4 border-google-green">
          <h3 className="text-sm text-gray-500 mb-2">Net Maaş (Yıllık)</h3>
          <div className="text-2xl font-bold text-gray-900">{formatCurrency(calculatedResult.netYearly)}</div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-4 border-t-4 border-google-blue">
          <h3 className="text-sm text-gray-500 mb-2">Brüt Maaş (Aylık)</h3>
          <div className="text-2xl font-bold text-gray-900">{formatCurrency(calculatedResult.grossMonthly)}</div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-4 border-t-4 border-google-blue">
          <h3 className="text-sm text-gray-500 mb-2">Brüt Maaş (Yıllık)</h3>
          <div className="text-2xl font-bold text-gray-900">{formatCurrency(calculatedResult.grossYearly)}</div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-4 border-t-4 border-google-red">
          <h3 className="text-sm text-gray-500 mb-2">Toplam Kesinti (Aylık)</h3>
          <div className="text-2xl font-bold text-gray-900">{formatCurrency(calculatedResult.deductionsMonthly)}</div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-4 border-t-4 border-google-red">
          <h3 className="text-sm text-gray-500 mb-2">Toplam Kesinti (Yıllık)</h3>
          <div className="text-2xl font-bold text-gray-900">{formatCurrency(calculatedResult.deductionsYearly)}</div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="bg-white rounded-2xl shadow-lg p-5 border-t-4 border-google-yellow">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Nedir bu kesintiler?</h2>
        
        <button
          onClick={() => setShowMonthlyBreakdown(!showMonthlyBreakdown)}
          className="w-full flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-xl p-4 mb-3 text-gray-700 transition-colors"
        >
          <span>Aylık Kesintiler</span>
          {showMonthlyBreakdown ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        {showMonthlyBreakdown && (
          <div className="space-y-2 mb-4">
            <BreakdownRow label="Lohnsteuer (Gelir Vergisi)" value={calculatedResult.tax.lohnsteuer} />
            {calculatedResult.kirchensteuer > 0 && (
              <BreakdownRow label="Kirchensteuer (Kilise Vergisi)" value={calculatedResult.kirchensteuer} />
            )}
            <BreakdownRow label="Solidaritätszuschlag (Dayanışma)" value={calculatedResult.tax.soli} />
            <BreakdownRow label="Krankenversicherung (Sağlık)" value={calculatedResult.social.kv} />
            <BreakdownRow label="Pflegeversicherung (Bakım)" value={calculatedResult.social.pv} />
            <BreakdownRow label="Rentenversicherung (Emeklilik)" value={calculatedResult.social.rv} />
            <BreakdownRow label="Arbeitslosenversicherung (İşsizlik)" value={calculatedResult.social.av} />
          </div>
        )}

        <button
          onClick={() => setShowYearlyBreakdown(!showYearlyBreakdown)}
          className="w-full flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-xl p-4 text-gray-700 transition-colors"
        >
          <span>Yıllık Kesintiler</span>
          {showYearlyBreakdown ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        {showYearlyBreakdown && (
          <div className="space-y-2 mt-3">
            <BreakdownRow label="Lohnsteuer (Gelir Vergisi)" value={calculatedResult.tax.lohnsteuer * 12} />
            {calculatedResult.kirchensteuer > 0 && (
              <BreakdownRow label="Kirchensteuer (Kilise Vergisi)" value={calculatedResult.kirchensteuer * 12} />
            )}
            <BreakdownRow label="Solidaritätszuschlag (Dayanışma)" value={calculatedResult.tax.soli * 12} />
            <BreakdownRow label="Krankenversicherung (Sağlık)" value={calculatedResult.social.kv * 12} />
            <BreakdownRow label="Pflegeversicherung (Bakım)" value={calculatedResult.social.pv * 12} />
            <BreakdownRow label="Rentenversicherung (Emeklilik)" value={calculatedResult.social.rv * 12} />
            <BreakdownRow label="Arbeitslosenversicherung (İşsizlik)" value={calculatedResult.social.av * 12} />
          </div>
        )}
      </div>

      </>
      )}
    </div>
  );
}

function BreakdownRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="font-semibold text-gray-900">{formatCurrency(value)}</span>
    </div>
  );
}
