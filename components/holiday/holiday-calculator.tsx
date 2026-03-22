'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { Holiday, TR_HOLIDAY_TIPS } from '@/constants/holidays/tr-2026';
import {
  calculateTRRange,
  groupDaysByWeek,
  calculateEfficiency,
  formatDateTR,
  getDayNameTR,
  formatHolidayLabelTR,
  humanizeDays,
  parseISODate,
} from '@/lib/utils/holiday-calculator';
import { cn } from '@/lib/utils/cn';
import { Sun, Moon, Briefcase, Calendar } from 'lucide-react';

interface HolidayCalculatorProps {
  country: 'turkiye' | 'almanya';
  title: string;
  description: string;
  holidays: Holiday[];
  tips: typeof TR_HOLIDAY_TIPS;
}

export function HolidayCalculator({
  title,
  holidays,
  tips,
}: HolidayCalculatorProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [result, setResult] = useState<ReturnType<typeof calculateTRRange> | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [showWhy, setShowWhy] = useState(false);
  const [showHolidayList, setShowHolidayList] = useState(false);
  const [showTips, setShowTips] = useState(false);

  const handleCalculate = useCallback(() => {
    if (!startDate || !endDate) return;

    const start = parseISODate(startDate);
    const end = parseISODate(endDate);

    if (start > end) {
      alert('Başlangıç tarihi bitiş tarihinden sonra olamaz!');
      return;
    }

    const calc = calculateTRRange(start, end);
    setResult(calc);
  }, [startDate, endDate]);

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
    <div className="space-y-2">

      {/* Başlık + Nasıl Çalışır accordion */}
      <div
        className="bg-white rounded-xl border-2 border-google-blue overflow-hidden cursor-pointer select-none"
        onClick={() => setShowInfo(!showInfo)}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <h1 className="text-2xl font-bold leading-tight">{title}</h1>
            <div className="flex items-center gap-1 mt-0.5 text-google-blue font-medium text-sm">
              Nasıl Çalışır?
            </div>
          </div>
          <span className={cn('text-google-blue text-xl transition-transform duration-200', showInfo && 'rotate-180')}>▾</span>
        </div>
        {showInfo && (
          <div className="px-4 pb-4 bg-blue-50 border-t border-blue-200">
            <ul className="space-y-2 text-sm text-blue-800 pt-3">
              <li>• Hafta sonları ve resmî tatiller otomatik düşülür.</li>
              <li>• Arefeler yarım gün sayılır.</li>
              <li>• Bu sürüm sadece TR 2026 içindir.</li>
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
              Türkiye'nin resmi tatil takvimine göre yıllık izin planlamanı optimize etmek artık çok daha kolay. Hangi tatil günlerinin pazartesi ya da cumaya denk geldiğini, kaç gün izin ekleyerek kaç günlük kesintisiz tatil yapabileceğini tek bakışta görürsün. Bu araç, seçtiğin tarih aralığındaki tüm resmi tatilleri listeler, hafta sonu ve iş günü dağılımını hesaplar ve gerçekte kaç gün izin kullanman gerektiğini net biçimde ortaya koyar. Hem yakınlarınla tatil planlarken hem de şirkete izin bildirimi hazırlarken işe yarar.
            </p>
          </div>
        )}
      </div>

      {/* 2026 Tatiller accordion */}
      <div
        className="bg-white rounded-xl border-2 border-google-red overflow-hidden cursor-pointer select-none"
        onClick={() => setShowHolidayList(!showHolidayList)}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <div className="font-semibold text-gray-900">2026 Resmî Tatiller</div>
          <span className={cn('text-google-red text-xl transition-transform duration-200', showHolidayList && 'rotate-180')}>▾</span>
        </div>
        {showHolidayList && (
          <div className="px-4 pb-4 bg-red-50 border-t border-red-200">
            <div className="space-y-1 pt-3">
              {holidays
                .slice()
                .sort((a, b) => a.date.localeCompare(b.date))
                .map((h) => (
                  <div key={h.date} className="flex justify-between text-sm py-1 border-b border-red-100 last:border-0">
                    <span className="font-mono text-gray-600">{formatHolidayLabelTR(h.date)}</span>
                    <span className="text-gray-800">
                      {h.name}
                      {h.weight === 0.5 && <span className="text-orange-600 ml-1">(yarım)</span>}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Tatil Tüyoları accordion */}
      <div
        className="bg-white rounded-xl border-2 border-google-yellow overflow-hidden cursor-pointer select-none"
        onClick={() => setShowTips(!showTips)}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <div className="font-semibold text-gray-900">Tatil Tüyoları</div>
          <span className={cn('text-google-yellow text-xl transition-transform duration-200', showTips && 'rotate-180')}>▾</span>
        </div>
        {showTips && (
          <div className="px-4 pb-4 bg-yellow-50 border-t border-yellow-200">
            <div className="space-y-4 pt-3">
              {tips.map((tip, idx) => (
                <div key={idx} className="text-sm">
                  <div className="font-semibold text-yellow-800">{tip.title}</div>
                  <div className="text-yellow-700 mt-1">{tip.description}</div>
                  <div className="text-green-700 text-xs mt-1 font-medium">Verimlilik: {tip.efficiency}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Giriş Kartı */}
      <div className="bg-white rounded-xl border-2 border-google-yellow p-5">
        <h2 className="text-gray-900 font-bold text-lg mb-4">Tatil Aralığı</h2>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-xs text-gray-500 block mb-1">Başlangıç</label>
            <input
              type="date"
              value={startDate}
              onChange={handleStartChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-google-yellow/40"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Bitiş</label>
            <input
              type="date"
              value={endDate}
              min={startDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-google-yellow/40"
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
          <button
            onClick={handleCalculate}
            disabled={!startDate || !endDate}
            className="flex-1 rounded-lg bg-google-orange text-white font-semibold py-3 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Hesapla
          </button>
          <button
            onClick={handleReset}
            className="rounded-lg border-2 border-gray-200 text-gray-600 font-medium px-5 py-3 hover:bg-gray-50 transition-colors"
          >
            Sıfırla
          </button>
        </div>
      </div>

      {/* Sonuçlar */}
      {result && efficiency && (
        <div className="bg-white rounded-xl border-2 border-google-green p-5">
          <h2 className="text-gray-900 font-bold text-lg mb-4">Sonuçlar</h2>

          {/* Efficiency Badge */}
          <div className={cn(
            'inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-4',
            efficiency.ratio >= 3.2 ? 'bg-green-100 text-green-800' :
            efficiency.ratio >= 2.4 ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          )}>
            {efficiency.badge}
          </div>

          {/* Efficiency Bar */}
          <div className="mb-5">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-gray-700">İzin Verimliliği</span>
              <span className="text-gray-500">{efficiency.label}</span>
            </div>
            <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-google-green transition-all duration-500"
                style={{ width: `${efficiency.percentage}%` }}
              />
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <KPICard
              icon={<Sun className="w-5 h-5" />}
              label="Toplam Tatil"
              value={String(result.totalDays)}
              subLabel="Seçilen aralık"
              color="green"
            />
            <KPICard
              icon={<Briefcase className="w-5 h-5" />}
              label="İzinden Giden"
              value={humanizeDays(result.leaveDays)}
              subLabel="Gerekli izin"
              color="orange"
            />
            <KPICard
              icon={<Calendar className="w-5 h-5" />}
              label="Resmî Tatil"
              value={humanizeDays(result.officialHolidayDays)}
              subLabel="Arefeler 0.5 sayılır"
              color="blue"
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
              <h3 className="font-bold text-gray-900 mb-3">Hafta Hafta Plan</h3>
              <div className="space-y-2">
                {weeks.map((week, idx) => (
                  <div key={week.key} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">Hafta {idx + 1}</div>
                        <div className="text-xs text-gray-500">
                          {formatShortDateTR(parseISODate(week.start))} – {formatShortDateTR(parseISODate(week.end))}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">Net izin</div>
                        <div className="font-bold text-google-blue text-sm">{humanizeDays(week.leaveDays)}</div>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 mb-2">
                      {week.totalDays} gün • {week.weekendDays} hafta sonu • {humanizeDays(week.holidayDaysWork)} resmî tatil
                    </div>

                    {week.holidays.length > 0 && (
                      <div className="text-xs bg-gray-50 rounded-lg p-2 mb-2">
                        <strong className="text-gray-700">Resmî tatiller:</strong>
                        <ul className="mt-1 space-y-0.5">
                          {week.holidays.map((h, i) => (
                            <li key={i} className="text-gray-600">
                              {formatHolidayLabelTR(h.date)}: {h.name}
                              {h.weight === 0.5 && <span className="text-orange-600"> (yarım)</span>}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {week.bridgeHint && (
                      <div className="text-xs text-blue-700 bg-blue-50 rounded-lg p-2">
                        💡 <strong>Köprü</strong> ihtimali: hafta içinde tatil + yanına 1 gün eklenince uzuyor.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Ana Sayfaya Dön */}
      <Link href="/" className="w-full flex items-center justify-center rounded-xl border-2 border-google-yellow bg-google-yellow text-white font-semibold py-3 hover:opacity-90 transition-opacity">
        Ana Sayfaya Dön
      </Link>

    </div>
  );
}

// ==================== ALT KOMPONENTLER ====================

interface KPICardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subLabel: string;
  color: 'green' | 'orange' | 'blue' | 'yellow';
}

function KPICard({ icon, label, value, subLabel, color }: KPICardProps) {
  const bg = { green: 'bg-green-50 border-green-200', orange: 'bg-orange-50 border-orange-200', blue: 'bg-blue-50 border-blue-200', yellow: 'bg-yellow-50 border-yellow-200' };
  const ic = { green: 'text-green-600', orange: 'text-orange-600', blue: 'text-blue-600', yellow: 'text-yellow-600' };

  return (
    <div className={cn('border rounded-xl p-3', bg[color])}>
      <div className={cn('mb-1.5', ic[color])}>{icon}</div>
      <div className="text-xs text-gray-500 mb-0.5">{label}</div>
      <div className="text-xl font-bold text-gray-900">{value}</div>
      <div className="text-xs text-gray-400 mt-0.5">{subLabel}</div>
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

