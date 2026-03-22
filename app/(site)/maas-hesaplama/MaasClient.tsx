'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
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
  const [showWhy, setShowWhy] = useState(false);
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
    <div className="space-y-2">
      {/* Info Card */}
      {/* Başlık */}
      <div className="bg-white rounded-xl border-2 border-google-blue px-4 py-3">
        <h1 className="text-2xl font-bold leading-tight">Almanya Maaş Hesaplayıcı — Brüt → Net → Brüt</h1>
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
              <li>• Kullanıcı verileri saklanmaz.</li>
              <li>• <strong>KV (Krankenkasse)</strong>: Yasal sağlık sigortası kesintisi. Standart oran %14.6'dır.</li>
              <li>• <strong>Zusatzbeitrag</strong>: Ek prim, genelde %1.6 – %2.5 arasındadır.</li>
              <li>• Her iki prim de çalışan ve işveren arasında yarı yarıya paylaşılır.</li>
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
              Almanya'da çalışıyorsan ya da çalışmayı planlıyorsan, eline ne geçeceğini önceden bilmek hayati önem taşır. Brüt maaş rakamları iş ilanlarında cazip görünür, ancak Almanya'nın vergi ve sigorta sistemi ciddi kesintiler getirir. Bu araç, girdiğin brüt maaştan Lohnsteuer, Krankenversicherung, Pflegeversicherung, Rentenversicherung ve Arbeitslosenversicherung kesintilerini eyalete, vergi sınıfına ve aile durumuna göre hesaplar. Tersine de çalışır: hedef net rakamını girer, gerekli brütü öğrenirsin. Dienstwagen (şirket aracı) kullananlar için ek vergi etkisini de dahil edebilirsin.
            </p>
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-xl border-2 border-google-yellow p-5">
        <h2 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
          <Calculator size={20} />
          Girdi
        </h2>

        <div className="grid gap-4">
          {/* Period & Type */}
          <div className="grid grid-cols-2 gap-3">
            <div className="">
              <label className="text-xs text-gray-500 block mb-1">Periyot</label>
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
            <div className="">
              <label className="text-xs text-gray-500 block mb-1">Tip</label>
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
          <div className="">
            <label className="text-xs text-gray-500 block mb-1">Miktar (€)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-900 bg-white focus:outline-none"
              placeholder="5000"
            />
          </div>

          {/* Tax Class & State */}
          <div className="grid grid-cols-2 gap-3">
            <div className="">
              <label className="text-xs text-gray-500 block mb-1">Steuerklasse</label>
              <select
                value={taxClass}
                onChange={(e) => setTaxClass(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-900 bg-white focus:outline-none"
              >
                {TAX_CLASSES.map(tc => (
                  <option key={tc.value} value={tc.value}>
                    {tc.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="">
              <label className="text-xs text-gray-500 block mb-1">Eyalet</label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-900 bg-white focus:outline-none"
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
          <div className="">
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
              <div className="">
                <label className="text-xs text-gray-500 block mb-1">Çocuk sayısı</label>
                <input
                  type="number"
                  value={childrenCount}
                  onChange={(e) => setChildrenCount(Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-900 bg-white focus:outline-none"
                />
              </div>
              <div className="">
                <label className="text-xs text-gray-500 block mb-1">25 yaş altı</label>
                <input
                  type="number"
                  value={childrenUnder25}
                  onChange={(e) => setChildrenUnder25(Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-900 bg-white focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Age & Church Tax */}
          <div className="grid grid-cols-2 gap-3">
            <div className="">
              <label className="text-xs text-gray-500 block mb-1">Yaş</label>
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
            <div className="">
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
          <div className="">
            <label className="text-xs text-gray-500 block mb-1">Kinderfreibetrag (ZKF)</label>
            <input
              type="number"
              step="0.5"
              value={childAllowance}
              onChange={(e) => setChildAllowance(Number(e.target.value))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-900 bg-white focus:outline-none"
            />
          </div>

          {/* Company Car */}
          <div className="">
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
            <div className="rounded-xl p-4 space-y-3 border border-gray-200">
              <div className="">
                <label className="text-xs text-gray-500 block mb-1">Brüt Liste Fiyatı (€)</label>
                <input
                  type="number"
                  value={carListPrice}
                  onChange={(e) => setCarListPrice(Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-900 bg-white focus:outline-none"
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
          <div className="">
            <label className="text-xs text-gray-500 block mb-1">Sigorta</label>
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
              <div className="">
                <label className="text-xs text-gray-500 block mb-1">KV Kassensatz (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={kvBase}
                  onChange={(e) => setKvBase(Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-900 bg-white focus:outline-none"
                />
              </div>
              <div className="">
                <label className="text-xs text-gray-500 block mb-1">KV Zusatz (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={kvZusatz}
                  onChange={(e) => setKvZusatz(Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-900 bg-white focus:outline-none"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div className="">
                <label className="text-xs text-gray-500 block mb-1">PKV Primi (€)</label>
                <input
                  type="number"
                  value={pkvPremium}
                  onChange={(e) => setPkvPremium(Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-900 bg-white focus:outline-none"
                />
              </div>
              <div className="">
                <label className="text-xs text-gray-500 block mb-1">PPV Primi (€)</label>
                <input
                  type="number"
                  value={ppvPremium}
                  onChange={(e) => setPpvPremium(Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-900 bg-white focus:outline-none"
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
      <Link href="/" className="w-full flex items-center justify-center rounded-xl border-2 border-google-yellow bg-google-yellow text-white font-semibold py-3 hover:opacity-90 transition-opacity">
        Ana Sayfaya Dön
      </Link>
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
