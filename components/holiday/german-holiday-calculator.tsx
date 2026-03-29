'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
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
import { cn } from '@/lib/utils/cn';
import {
  Sun,
  Moon,
  Briefcase,
  Calendar,
} from 'lucide-react';

export function GermanHolidayCalculator() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [state, setState] = useState<GermanStateCode>('BE');
  const [result, setResult] = useState<ReturnType<typeof calculateDERange> | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [showWhy, setShowWhy] = useState(false);
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
    <div className="space-y-2">

      {/* Başlık */}
      <div className="bg-white rounded-xl border-2 border-google-blue px-4 py-3">
        <h1 className="text-2xl font-bold leading-tight">Almanya 2026 Tatil Planlayıcı</h1>
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
              <li>• Eyalete göre farklı tatil günleri otomatik hesaplanır.</li>
              <li>• Hafta sonları (Cumartesi, Pazar) otomatik düşülür.</li>
              <li>• Resmî tatiller eyalete göre değişir.</li>
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
              Almanya'da çalışıyorsan izin planlamak biraz hesap işi gerektirir; üstelik her eyaletin kendine özgü resmi tatil listesi var. Bavyera'da tatil olan bir günün Berlin'de iş günü sayılması gibi durumlar sürpriz yaratabilir. Bu araç, seçtiğin eyaleti ve tarih aralığını baz alarak kaç resmi tatilin haftaiçine denk geldiğini, gerçekte kaç günlük izin harcaman gerektiğini ve hafta sonu/iş günü dağılımını otomatik hesaplar. Yıllık izni optimize etmek ve uzun tatil köprüleri bulmak için pratik bir yardımcı.
            </p>
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
              {DE_HOLIDAY_TIPS.map((tip, idx) => (
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

        {/* Eyalet */}
        <div className="mb-4">
          <label className="text-xs text-gray-500 block mb-1">Eyalet (Bundesland)</label>
          <select
            value={state}
            onChange={(e) => setState(e.target.value as GermanStateCode)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-google-yellow/40"
          >
            {GERMAN_STATES.map((s) => (
              <option key={s.code} value={s.code}>
                {s.code} — {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tarihler */}
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
              label="Toplam Gün"
              value={String(result.totalDays)}
              subLabel="Seçilen aralık"
              color="green"
            />
            <KPICard
              icon={<Briefcase className="w-5 h-5" />}
              label="İzin Günleri"
              value={humanizeDays(result.leaveDays)}
              subLabel="Gerekli izin"
              color="orange"
            />
            <KPICard
              icon={<Calendar className="w-5 h-5" />}
              label="Resmî Tatiller"
              value={humanizeDays(result.officialHolidayDays)}
              subLabel="İş gününe denk"
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
              <h3 className="font-bold text-gray-900 mb-3">Haftalık Özet</h3>
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
                        <div className="text-xs text-gray-500">İzin</div>
                        <div className="font-bold text-google-blue text-sm">{humanizeDays(week.leaveDays)}</div>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 mb-2">
                      {week.totalDays} gün • {week.weekendDays} hafta sonu • {humanizeDays(week.holidayDaysWork)} resmî tatil
                    </div>

                    {week.holidays.length > 0 && (
                      <div className="text-xs bg-gray-50 rounded-lg p-2 mb-2">
                        <strong className="text-gray-700">Resmî Tatiller:</strong>
                        <ul className="mt-1 space-y-0.5">
                          {week.holidays.map((h, i) => (
                            <li key={i} className="text-gray-600">{formatDateLabel(h.date)}: {h.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {week.bridgeHint && (
                      <div className="text-xs text-blue-700 bg-blue-50 rounded-lg p-2">
                        💡 <strong>Köprü Günü</strong> olasılığı: Tatil + 1 gün = uzun hafta sonu
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
  const colorClasses = {
    green: 'bg-green-50 border-green-200 text-green-600',
    orange: 'bg-orange-50 border-orange-200 text-orange-600',
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-600',
  };

  return (
    <div className={cn('border rounded-xl p-3', colorClasses[color].split(' ').slice(0, 2).join(' '))}>
      <div className={cn('mb-1.5', colorClasses[color].split(' ')[2])}>{icon}</div>
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

function formatDateLabel(iso: string): string {
  const d = parseISODate(iso);
  const dd = String(d.getUTCDate()).padStart(2, '0');
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const yy = String(d.getUTCFullYear()).slice(-2);
  const days = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
  return `${dd}.${mm}.${yy} (${days[d.getUTCDay()]})`;
}
