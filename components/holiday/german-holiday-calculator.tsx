'use client';

import { useState, useCallback } from 'react';
import { GERMAN_STATES, GermanStateCode, DE_HOLIDAY_TIPS } from '@/constants/holidays/de-2026';
import {
  calculateDERange,
  groupDaysByWeek,
  calculateEfficiency,
  formatDateTR,
  getDayNameTR,
  humanizeDays,
  parseISODate,
} from '@/lib/utils/holiday-calculator';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Section } from '@/components/ui/Section';
import { cn } from '@/lib/utils/cn';
import { 
  Calculator, 
  RotateCcw, 
  Info, 
  Calendar, 
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Sun,
  Moon,
  Briefcase,
  MapPin
} from 'lucide-react';

export function GermanHolidayCalculator() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [state, setState] = useState<GermanStateCode>('BE');
  const [result, setResult] = useState<ReturnType<typeof calculateDERange> | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [showTips, setShowTips] = useState(false);

  const handleCalculate = useCallback(() => {
    if (!startDate || !endDate) return;

    const start = parseISODate(startDate);
    const end = parseISODate(endDate);

    if (start > end) {
      alert('Başlangıç tarihi bitiş tarihinden sonra olamaz!');
      return;
    }

    const calc = calculateDERange(start, end, state);
    setResult(calc);
  }, [startDate, endDate, state]);

  const handleReset = useCallback(() => {
    setStartDate('');
    setEndDate('');
    setResult(null);
  }, []);

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStartDate(value);
    if (value && endDate && value > endDate) {
      setEndDate('');
    }
  };

  const efficiency = result ? calculateEfficiency(result.leaveDays, result.totalDays) : null;
  const weeks = result ? groupDaysByWeek(result.days) : [];

  return (
    <Section contained className="py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Almanya 2026 Tatil Planlayıcı</h1>
        <p className="text-gray-600">Eyalet ve tarih aralığı seç – sistem toplam tatil, gerekli izin günleri, hafta sonları ve resmî tatilleri hesaplasın.</p>
      </div>

      {/* Info Panel */}
      <Card className="mb-6 p-6">
        <div className="flex flex-wrap gap-3 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowInfo(!showInfo)}
            className="flex items-center gap-2"
          >
            <Info className="w-4 h-4" />
            {showInfo ? 'Bilgi Kapat' : 'Bilgi Aç'}
            {showInfo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTips(!showTips)}
            className="flex items-center gap-2"
          >
            <Lightbulb className="w-4 h-4" />
            {showTips ? 'Tüyoları Kapat' : 'Tüyoları Aç'}
            {showTips ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>

        {showInfo && (
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• Eyalete göre farklı tatil günleri otomatik hesaplanır.</li>
              <li>• Hafta sonları (Cumartesi, Pazar) otomatik düşülür.</li>
              <li>• Resmî tatiller eyalete göre değişir.</li>
            </ul>
          </div>
        )}

        {showTips && (
          <div className="bg-yellow-50 rounded-lg p-4">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-600" />
              Tatil Tüyoları
            </h4>
            <div className="space-y-4">
              {DE_HOLIDAY_TIPS.map((tip, idx) => (
                <div key={idx} className="text-sm">
                  <div className="font-medium text-yellow-800">{tip.title}</div>
                  <div className="text-yellow-700 mt-1">{tip.description}</div>
                  <div className="text-green-700 text-xs mt-1 font-medium">
                    Verimlilik: {tip.efficiency}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Date Selection */}
      <Card className="mb-6 p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-google-blue" />
          Tatil Aralığı
        </h2>

        {/* State Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Eyalet (Bundesland)
          </label>
          <select
            value={state}
            onChange={(e) => setState(e.target.value as GermanStateCode)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-google-blue focus:border-transparent"
          >
            {GERMAN_STATES.map((s) => (
              <option key={s.code} value={s.code}>
                {s.code} - {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Başlangıç</label>
            <input
              type="date"
              value={startDate}
              onChange={handleStartChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-google-blue focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Bitiş</label>
            <input
              type="date"
              value={endDate}
              min={startDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-google-blue focus:border-transparent"
            />
          </div>
        </div>

        {startDate && endDate && (
          <div className="text-sm text-gray-600 mb-4 p-3 bg-gray-50 rounded-lg">
            <strong>Başlangıç:</strong> {formatDateTR(parseISODate(startDate))}, {capitalize(getDayNameTR(parseISODate(startDate)))}
            <br />
            <strong>Bitiş:</strong> {formatDateTR(parseISODate(endDate))}, {capitalize(getDayNameTR(parseISODate(endDate)))}
          </div>
        )}

        <div className="flex gap-3">
          <Button
            variant="primary"
            onClick={handleCalculate}
            disabled={!startDate || !endDate}
            className="flex items-center gap-2"
          >
            <Calculator className="w-4 h-4" />
            Hesapla
          </Button>
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Sıfırla
          </Button>
        </div>
      </Card>

      {/* Results */}
      {result && efficiency && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-google-green" />
            Sonuçlar
          </h2>

          {/* Efficiency Badge */}
          <div className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6",
            efficiency.ratio >= 3.2 ? "bg-green-100 text-green-800" :
            efficiency.ratio >= 2.4 ? "bg-blue-100 text-blue-800" :
            "bg-gray-100 text-gray-800"
          )}>
            {efficiency.badge}
          </div>

          {/* Efficiency Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">İzin Verimliliği</span>
              <span className="text-gray-600">{efficiency.label}</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-google-green transition-all duration-500"
                style={{ width: `${efficiency.percentage}%` }}
              />
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <KPICard
              icon={<Sun className="w-5 h-5" />}
              label="Toplam Gün"
              value={String(result.totalDays)}
              subLabel="Seçilen aralıktaki toplam gün"
              color="green"
            />
            <KPICard
              icon={<Briefcase className="w-5 h-5" />}
              label="İzin Günleri"
              value={humanizeDays(result.leaveDays)}
              subLabel="Gerekli izin günü sayısı"
              color="orange"
            />
            <KPICard
              icon={<Calendar className="w-5 h-5" />}
              label="Resmî Tatiller"
              value={humanizeDays(result.officialHolidayDays)}
              subLabel="İş gününe denk resmî tatil"
              color="purple"
            />
            <KPICard
              icon={<Moon className="w-5 h-5" />}
              label="Hafta Sonu"
              value={String(result.weekendDays)}
              subLabel="Cumartesi + Pazar"
              color="yellow"
            />
          </div>

          {/* Weekly Plan */}
          {weeks.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Haftalık Özet</h3>
              <div className="space-y-4">
                {weeks.map((week, idx) => (
                  <div key={week.key} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-medium">Hafta {idx + 1}</div>
                        <div className="text-sm text-gray-500">
                          {formatShortDateTR(parseISODate(week.start))} – {formatShortDateTR(parseISODate(week.end))}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">İzin</div>
                        <div className="font-semibold text-google-blue">{humanizeDays(week.leaveDays)}</div>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 mb-2">
                      {week.totalDays} gün toplam • {week.weekendDays} hafta sonu • {humanizeDays(week.holidayDaysWork)} resmî tatil
                    </div>

                    {week.holidays.length > 0 && (
                      <div className="text-sm bg-gray-50 rounded p-2 mb-2">
                        <strong className="text-gray-700">Resmî Tatiller:</strong>
                        <ul className="mt-1 space-y-1">
                          {week.holidays.map((h, i) => (
                            <li key={i} className="text-gray-600">
                              {formatDateLabel(h.date)}: {h.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {week.bridgeHint && (
                      <div className="text-sm text-blue-700 bg-blue-50 rounded p-2">
                        💡 <strong>Köprü Günü</strong> olasılığı: Tatil + 1 gün = uzun hafta sonu
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}
    </Section>
  );
}

// ==================== ALT KOMPONENTLER ====================

interface KPICardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subLabel: string;
  color: 'green' | 'orange' | 'purple' | 'yellow';
}

function KPICard({ icon, label, value, subLabel, color }: KPICardProps) {
  const colorClasses = {
    green: 'bg-green-50 border-green-200',
    orange: 'bg-orange-50 border-orange-200',
    purple: 'bg-purple-50 border-purple-200',
    yellow: 'bg-yellow-50 border-yellow-200',
  };

  const iconColors = {
    green: 'text-green-600',
    orange: 'text-orange-600',
    purple: 'text-purple-600',
    yellow: 'text-yellow-600',
  };

  return (
    <div className={cn("border rounded-lg p-4", colorClasses[color])}>
      <div className={cn("mb-2", iconColors[color])}>{icon}</div>
      <div className="text-sm text-gray-600 mb-1">{label}</div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-xs text-gray-500 mt-1">{subLabel}</div>
    </div>
  );
}

function capitalize(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatShortDateTR(date: Date): string {
  return new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: 'short' }).format(date);
}

function formatDateLabel(iso: string): string {
  const d = parseISODate(iso);
  const dd = String(d.getUTCDate()).padStart(2, '0');
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const yy = String(d.getUTCFullYear()).slice(-2);
  const days = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
  return `${dd}.${mm}.${yy} (${days[d.getUTCDay()]})`;
}
