'use client';

import { useState, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import { calculateSalary, formatCurrency, formatPercent } from '@/lib/salary/calculator';
import { STEPSTONE_2026, getSortedJobGroups, getSortedCities, EXPERIENCE_OPTIONS, COMPANY_SIZE_OPTIONS, EDUCATION_OPTIONS, RESPONSIBILITY_OPTIONS, GENDER_OPTIONS } from '@/lib/salary/stepstone-data';
import { STATES, TAX_CLASSES, type SalaryInput } from '@/lib/salary/types';
import { CAR_RATES } from '@/lib/salary/company-car';
import { Calculator, Info, TrendingUp, Building2, Users, GraduationCap, Briefcase, User, ChevronDown, ChevronUp } from 'lucide-react';

export default function MaasHesaplamaPage() {
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

  // Comparison state
  const [jobGroup, setJobGroup] = useState('');
  const [experience, setExperience] = useState('');
  const [city, setCity] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [education, setEducation] = useState('');
  const [responsibility, setResponsibility] = useState('');
  const [gender, setGender] = useState('');

  // UI state
  const [showInfo, setShowInfo] = useState(false);
  const [showMonthlyBreakdown, setShowMonthlyBreakdown] = useState(false);
  const [showYearlyBreakdown, setShowYearlyBreakdown] = useState(false);

  // Calculate result
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

  const result = useMemo(() => calculateSalary(input), [input]);

  // Comparison calculations
  const comparisonData = useMemo(() => {
    const grossYearly = result.grossYearly;
    const comparisons: Array<{ title: string; median: number; diff: number; diffPercent: number }> = [];

    if (jobGroup) {
      const median = STEPSTONE_2026.jobGroups[jobGroup as keyof typeof STEPSTONE_2026.jobGroups] || 0;
      comparisons.push({
        title: `Meslek: ${jobGroup}`,
        median,
        diff: grossYearly - median,
        diffPercent: ((grossYearly / median) - 1) * 100
      });
    }

    if (experience) {
      const median = STEPSTONE_2026.experience[experience as keyof typeof STEPSTONE_2026.experience] || 0;
      comparisons.push({
        title: `Deneyim: ${EXPERIENCE_OPTIONS.find(e => e.value === experience)?.label}`,
        median,
        diff: grossYearly - median,
        diffPercent: ((grossYearly / median) - 1) * 100
      });
    }

    if (city) {
      const median = STEPSTONE_2026.cities[city as keyof typeof STEPSTONE_2026.cities] || 0;
      comparisons.push({
        title: `Şehir: ${city}`,
        median,
        diff: grossYearly - median,
        diffPercent: ((grossYearly / median) - 1) * 100
      });
    }

    if (state) {
      const median = STEPSTONE_2026.states[state as keyof typeof STEPSTONE_2026.states] || 0;
      comparisons.push({
        title: `Eyalet: ${STATES.find(s => s.code === state)?.name}`,
        median,
        diff: grossYearly - median,
        diffPercent: ((grossYearly / median) - 1) * 100
      });
    }

    if (companySize) {
      const median = STEPSTONE_2026.companySize[companySize as keyof typeof STEPSTONE_2026.companySize] || 0;
      comparisons.push({
        title: `Şirket: ${COMPANY_SIZE_OPTIONS.find(c => c.value === companySize)?.label}`,
        median,
        diff: grossYearly - median,
        diffPercent: ((grossYearly / median) - 1) * 100
      });
    }

    return comparisons;
  }, [result.grossYearly, jobGroup, experience, city, state, companySize]);

  const jobGroups = getSortedJobGroups();
  const cities = getSortedCities();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black">
        {/* Hero */}
        <Section className="bg-[#01A1F1] py-12">
          <Container>
            <div className="text-center text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Brüt → Net → Brüt<br />Maaş Hesaplayıcı
              </h1>
              <p className="text-lg text-white/90">
                Almanya'da maaş hesaplamalarını hızlı ve detaylı öğrenin!
              </p>
            </div>
          </Container>
        </Section>

        <Section contained className="py-8">
          {/* Info Card */}
          <div className="bg-[#FF9900] rounded-2xl p-6 mb-6 text-gray-900">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Info size={20} />
                Bilgi
              </h2>
              <Button
                variant="ghost"
                onClick={() => setShowInfo(!showInfo)}
                className="text-gray-900 hover:bg-black/10"
              >
                {showInfo ? 'Kapat' : 'Aç'}
              </Button>
            </div>
            {showInfo && (
              <div className="bg-white/90 rounded-xl p-4 text-sm space-y-3">
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Kullanıcı verileri saklanmaz.</strong> Girdiğiniz bilgiler sadece yerel tarayıcıda geçici olarak işlenir.</li>
                  <li><strong>KV (Krankenkasse)</strong>: Yasal sağlık sigortası kesintisi. Standart oran %14.6'dır.</li>
                  <li><strong>Zusatzbeitrag</strong>: Ek prim, genelde %1.6 – %2.5 arasındadır.</li>
                  <li>Her iki prim de çalışan ve işveren arasında yarı yarıya paylaşılır.</li>
                </ul>
              </div>
            )}
          </div>

          {/* Input Form */}
          <div className="bg-[#F65314] rounded-2xl p-6 mb-6 text-white">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calculator size={20} />
              Girdi
            </h2>

            <div className="grid gap-4">
              {/* Period & Type */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/10 rounded-xl p-3">
                  <label className="text-xs opacity-80 mb-2 block">Periyot</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPeriod('monthly')}
                      className={cn(
                        'flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors',
                        period === 'monthly' ? 'bg-white text-gray-900' : 'bg-white/10 hover:bg-white/20'
                      )}
                    >
                      Aylık
                    </button>
                    <button
                      onClick={() => setPeriod('yearly')}
                      className={cn(
                        'flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors',
                        period === 'yearly' ? 'bg-white text-gray-900' : 'bg-white/10 hover:bg-white/20'
                      )}
                    >
                      Yıllık
                    </button>
                  </div>
                </div>
                <div className="bg-white/10 rounded-xl p-3">
                  <label className="text-xs opacity-80 mb-2 block">Tip</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setType('gross')}
                      className={cn(
                        'flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors',
                        type === 'gross' ? 'bg-white text-gray-900' : 'bg-white/10 hover:bg-white/20'
                      )}
                    >
                      Brüt
                    </button>
                    <button
                      onClick={() => setType('net')}
                      className={cn(
                        'flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors',
                        type === 'net' ? 'bg-white text-gray-900' : 'bg-white/10 hover:bg-white/20'
                      )}
                    >
                      Net
                    </button>
                  </div>
                </div>
              </div>

              {/* Amount */}
              <div className="bg-white/10 rounded-xl p-3">
                <label className="text-xs opacity-80 mb-2 block">Miktar (€)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                  placeholder="5000"
                />
              </div>

              {/* Tax Class & State */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/10 rounded-xl p-3">
                  <label className="text-xs opacity-80 mb-2 block">Steuerklasse</label>
                  <select
                    value={taxClass}
                    onChange={(e) => setTaxClass(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                  >
                    {TAX_CLASSES.map(tc => (
                      <option key={tc.value} value={tc.value} className="bg-gray-800">
                        {tc.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="bg-white/10 rounded-xl p-3">
                  <label className="text-xs opacity-80 mb-2 block">Eyalet</label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                  >
                    {STATES.map(s => (
                      <option key={s.code} value={s.code} className="bg-gray-800">
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Children */}
              <div className="bg-white/10 rounded-xl p-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasChildren}
                    onChange={(e) => setHasChildren(e.target.checked)}
                    className="w-5 h-5 rounded border-white/30"
                  />
                  <span>Çocuk var</span>
                </label>
              </div>

              {hasChildren && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/10 rounded-xl p-3">
                    <label className="text-xs opacity-80 mb-2 block">Çocuk sayısı</label>
                    <input
                      type="number"
                      value={childrenCount}
                      onChange={(e) => setChildrenCount(Number(e.target.value))}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <div className="bg-white/10 rounded-xl p-3">
                    <label className="text-xs opacity-80 mb-2 block">25 yaş altı</label>
                    <input
                      type="number"
                      value={childrenUnder25}
                      onChange={(e) => setChildrenUnder25(Number(e.target.value))}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                </div>
              )}

              {/* Age & Church Tax */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/10 rounded-xl p-3">
                  <label className="text-xs opacity-80 mb-2 block">Yaş</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setAge23Plus(false)}
                      className={cn(
                        'flex-1 py-2 px-2 rounded-lg text-xs font-medium transition-colors',
                        !age23Plus ? 'bg-white text-gray-900' : 'bg-white/10 hover:bg-white/20'
                      )}
                    >
                      23 altı
                    </button>
                    <button
                      onClick={() => setAge23Plus(true)}
                      className={cn(
                        'flex-1 py-2 px-2 rounded-lg text-xs font-medium transition-colors',
                        age23Plus ? 'bg-white text-gray-900' : 'bg-white/10 hover:bg-white/20'
                      )}
                    >
                      23 ve üzeri
                    </button>
                  </div>
                </div>
                <div className="bg-white/10 rounded-xl p-3">
                  <label className="flex items-center gap-3 cursor-pointer h-full">
                    <input
                      type="checkbox"
                      checked={churchTax}
                      onChange={(e) => setChurchTax(e.target.checked)}
                      className="w-5 h-5 rounded border-white/30"
                    />
                    <span>Kilise vergisi</span>
                  </label>
                </div>
              </div>

              {/* Child Allowance */}
              <div className="bg-white/10 rounded-xl p-3">
                <label className="text-xs opacity-80 mb-2 block">Kinderfreibetrag (ZKF)</label>
                <input
                  type="number"
                  step="0.5"
                  value={childAllowance}
                  onChange={(e) => setChildAllowance(Number(e.target.value))}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                />
              </div>

              {/* Company Car */}
              <div className="bg-white/10 rounded-xl p-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasCompanyCar}
                    onChange={(e) => setHasCompanyCar(e.target.checked)}
                    className="w-5 h-5 rounded border-white/30"
                  />
                  <span>Dienstwagen (Şirket Aracı)</span>
                </label>
              </div>

              {hasCompanyCar && (
                <div className="bg-white/5 rounded-xl p-4 space-y-3">
                  <div className="bg-white/10 rounded-lg p-3">
                    <label className="text-xs opacity-80 mb-2 block">Brüt Liste Fiyatı (€)</label>
                    <input
                      type="number"
                      value={carListPrice}
                      onChange={(e) => setCarListPrice(Number(e.target.value))}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {CAR_RATES.map(rate => (
                      <button
                        key={rate.value}
                        onClick={() => setCarRate(rate.value)}
                        className={cn(
                          'py-2 px-2 rounded-lg text-xs font-medium transition-colors',
                          carRate === rate.value ? 'bg-white text-gray-900' : 'bg-white/10 hover:bg-white/20'
                        )}
                      >
                        {rate.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Insurance Type */}
              <div className="bg-white/10 rounded-xl p-3">
                <label className="text-xs opacity-80 mb-2 block">Sigorta</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setInsuranceType('gkv')}
                    className={cn(
                      'flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors',
                      insuranceType === 'gkv' ? 'bg-white text-gray-900' : 'bg-white/10 hover:bg-white/20'
                    )}
                  >
                    GKV (Yasal)
                  </button>
                  <button
                    onClick={() => setInsuranceType('pkv')}
                    className={cn(
                      'flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors',
                      insuranceType === 'pkv' ? 'bg-white text-gray-900' : 'bg-white/10 hover:bg-white/20'
                    )}
                  >
                    PKV (Özel)
                  </button>
                </div>
              </div>

              {insuranceType === 'gkv' ? (
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/10 rounded-xl p-3">
                    <label className="text-xs opacity-80 mb-2 block">KV Kassensatz (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={kvBase}
                      onChange={(e) => setKvBase(Number(e.target.value))}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <div className="bg-white/10 rounded-xl p-3">
                    <label className="text-xs opacity-80 mb-2 block">KV Zusatz (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={kvZusatz}
                      onChange={(e) => setKvZusatz(Number(e.target.value))}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/10 rounded-xl p-3">
                    <label className="text-xs opacity-80 mb-2 block">PKV Primi (€)</label>
                    <input
                      type="number"
                      value={pkvPremium}
                      onChange={(e) => setPkvPremium(Number(e.target.value))}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <div className="bg-white/10 rounded-xl p-3">
                    <label className="text-xs opacity-80 mb-2 block">PPV Primi (€)</label>
                    <input
                      type="number"
                      value={ppvPremium}
                      onChange={(e) => setPpvPremium(Number(e.target.value))}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Results */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-[#0b0b0c] border border-white/10 rounded-2xl p-4">
              <h3 className="text-sm text-white/70 mb-2">Net Maaş (Aylık)</h3>
              <div className="text-2xl font-bold text-white">{formatCurrency(result.netMonthly)}</div>
            </div>
            <div className="bg-[#0b0b0c] border border-white/10 rounded-2xl p-4">
              <h3 className="text-sm text-white/70 mb-2">Net Maaş (Yıllık)</h3>
              <div className="text-2xl font-bold text-white">{formatCurrency(result.netYearly)}</div>
            </div>
            <div className="bg-[#0b0b0c] border border-white/10 rounded-2xl p-4">
              <h3 className="text-sm text-white/70 mb-2">Brüt Maaş (Aylık)</h3>
              <div className="text-2xl font-bold text-white">{formatCurrency(result.grossMonthly)}</div>
            </div>
            <div className="bg-[#0b0b0c] border border-white/10 rounded-2xl p-4">
              <h3 className="text-sm text-white/70 mb-2">Brüt Maaş (Yıllık)</h3>
              <div className="text-2xl font-bold text-white">{formatCurrency(result.grossYearly)}</div>
            </div>
            <div className="bg-[#0b0b0c] border border-white/10 rounded-2xl p-4">
              <h3 className="text-sm text-white/70 mb-2">Toplam Kesinti (Aylık)</h3>
              <div className="text-2xl font-bold text-white">{formatCurrency(result.deductionsMonthly)}</div>
            </div>
            <div className="bg-[#0b0b0c] border border-white/10 rounded-2xl p-4">
              <h3 className="text-sm text-white/70 mb-2">Toplam Kesinti (Yıllık)</h3>
              <div className="text-2xl font-bold text-white">{formatCurrency(result.deductionsYearly)}</div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="bg-[#0b0b0c] border border-white/10 rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">Nedir bu kesintiler?</h2>
            
            <button
              onClick={() => setShowMonthlyBreakdown(!showMonthlyBreakdown)}
              className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 rounded-xl p-4 mb-3 text-white transition-colors"
            >
              <span>Aylık Kesintiler</span>
              {showMonthlyBreakdown ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            {showMonthlyBreakdown && (
              <div className="space-y-2 mb-4">
                <BreakdownRow label="Lohnsteuer (Gelir Vergisi)" value={result.tax.lohnsteuer} />
                {result.kirchensteuer > 0 && (
                  <BreakdownRow label="Kirchensteuer (Kilise Vergisi)" value={result.kirchensteuer} />
                )}
                <BreakdownRow label="Solidaritätszuschlag (Dayanışma)" value={result.tax.soli} />
                <BreakdownRow label="Krankenversicherung (Sağlık)" value={result.social.kv} />
                <BreakdownRow label="Pflegeversicherung (Bakım)" value={result.social.pv} />
                <BreakdownRow label="Rentenversicherung (Emeklilik)" value={result.social.rv} />
                <BreakdownRow label="Arbeitslosenversicherung (İşsizlik)" value={result.social.av} />
              </div>
            )}

            <button
              onClick={() => setShowYearlyBreakdown(!showYearlyBreakdown)}
              className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 rounded-xl p-4 text-white transition-colors"
            >
              <span>Yıllık Kesintiler</span>
              {showYearlyBreakdown ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            {showYearlyBreakdown && (
              <div className="space-y-2 mt-3">
                <BreakdownRow label="Lohnsteuer (Gelir Vergisi)" value={result.tax.lohnsteuer * 12} />
                {result.kirchensteuer > 0 && (
                  <BreakdownRow label="Kirchensteuer (Kilise Vergisi)" value={result.kirchensteuer * 12} />
                )}
                <BreakdownRow label="Solidaritätszuschlag (Dayanışma)" value={result.tax.soli * 12} />
                <BreakdownRow label="Krankenversicherung (Sağlık)" value={result.social.kv * 12} />
                <BreakdownRow label="Pflegeversicherung (Bakım)" value={result.social.pv * 12} />
                <BreakdownRow label="Rentenversicherung (Emeklilik)" value={result.social.rv * 12} />
                <BreakdownRow label="Arbeitslosenversicherung (İşsizlik)" value={result.social.av * 12} />
              </div>
            )}
          </div>

          {/* Stepstone Comparison */}
          <div className="bg-[#F65314] rounded-2xl p-6 text-white">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp size={20} />
              Stepstone 2026 Karşılaştırma
            </h2>
            <p className="text-sm opacity-90 mb-4">
              Net hesaplama her zaman çalışır. Aşağıdaki alanların <b>tamamını</b> doldurursan, Stepstone 2026 verilerine göre karşılaştırma yapılır.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white/10 rounded-xl p-3">
                <label className="text-xs opacity-80 mb-2 flex items-center gap-1">
                  <Briefcase size={14} /> Meslek grubu
                </label>
                <select
                  value={jobGroup}
                  onChange={(e) => setJobGroup(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none"
                >
                  <option value="" className="bg-gray-800">Seç</option>
                  {jobGroups.map(jg => (
                    <option key={jg} value={jg} className="bg-gray-800">{jg}</option>
                  ))}
                </select>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <label className="text-xs opacity-80 mb-2 flex items-center gap-1">
                  <Users size={14} /> Deneyim
                </label>
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none"
                >
                  <option value="" className="bg-gray-800">Seç</option>
                  {EXPERIENCE_OPTIONS.map(exp => (
                    <option key={exp.value} value={exp.value} className="bg-gray-800">{exp.label}</option>
                  ))}
                </select>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <label className="text-xs opacity-80 mb-2 flex items-center gap-1">
                  <Building2 size={14} /> Şehir
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none"
                >
                  <option value="" className="bg-gray-800">Seç</option>
                  {cities.map(c => (
                    <option key={c} value={c} className="bg-gray-800">{c}</option>
                  ))}
                </select>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <label className="text-xs opacity-80 mb-2 flex items-center gap-1">
                  <Building2 size={14} /> Şirket büyüklüğü
                </label>
                <select
                  value={companySize}
                  onChange={(e) => setCompanySize(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none"
                >
                  <option value="" className="bg-gray-800">Seç</option>
                  {COMPANY_SIZE_OPTIONS.map(cs => (
                    <option key={cs.value} value={cs.value} className="bg-gray-800">{cs.label}</option>
                  ))}
                </select>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <label className="text-xs opacity-80 mb-2 flex items-center gap-1">
                  <GraduationCap size={14} /> Eğitim
                </label>
                <select
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none"
                >
                  <option value="" className="bg-gray-800">Seç</option>
                  {EDUCATION_OPTIONS.map(edu => (
                    <option key={edu.value} value={edu.value} className="bg-gray-800">{edu.label}</option>
                  ))}
                </select>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <label className="text-xs opacity-80 mb-2 flex items-center gap-1">
                  <Briefcase size={14} /> Sorumluluk
                </label>
                <select
                  value={responsibility}
                  onChange={(e) => setResponsibility(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none"
                >
                  <option value="" className="bg-gray-800">Seç</option>
                  {RESPONSIBILITY_OPTIONS.map(resp => (
                    <option key={resp.value} value={resp.value} className="bg-gray-800">{resp.label}</option>
                  ))}
                </select>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <label className="text-xs opacity-80 mb-2 flex items-center gap-1">
                  <User size={14} /> Cinsiyet
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none"
                >
                  <option value="" className="bg-gray-800">Seç</option>
                  {GENDER_OPTIONS.map(g => (
                    <option key={g.value} value={g.value} className="bg-gray-800">{g.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Comparison Results */}
            {comparisonData.length > 0 && (
              <div className="bg-white/10 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-white/20">
                  <div>
                    <div className="text-sm opacity-80">Senin yıllık brütün</div>
                    <div className="text-2xl font-bold">{formatCurrency(result.grossYearly)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm opacity-80">Genel Almanya Median</div>
                    <div className="text-lg font-semibold">{formatCurrency(STEPSTONE_2026.overall.median)}</div>
                  </div>
                </div>
                {comparisonData.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-white/10 last:border-0">
                    <div className="text-sm">{item.title}</div>
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(item.median)}</div>
                      <div className={cn(
                        "text-xs",
                        item.diff >= 0 ? "text-green-300" : "text-red-300"
                      )}>
                        Fark: {item.diff >= 0 ? '+' : ''}{formatCurrency(item.diff)} ({formatPercent(item.diffPercent)})
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}

function BreakdownRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between items-center py-2 px-3 bg-white/5 rounded-lg">
      <span className="text-sm text-white/80">{label}</span>
      <span className="font-semibold text-white">{formatCurrency(value)}</span>
    </div>
  );
}
