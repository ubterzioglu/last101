/**
 * Tatil hesaplama fonksiyonları
 * Source: .0old/tatiltr/app.js + .0old/tatilde/app.js
 */

import { Holiday, TR_HOLIDAY_MAP, DAY_NAMES_TR } from '@/constants/holidays/tr-2026';
import { GermanHoliday, createHolidayMap, GermanStateCode } from '@/constants/holidays/de-2026';

// ==================== TÜRKİYE HESAPLAMALARI ====================

export interface CalculationResult {
  totalDays: number;
  weekendDays: number;
  workdays: number;
  officialHolidayDays: number;
  leaveDays: number;
  holidayHits: HolidayHit[];
  days: DayInfo[];
}

export interface HolidayHit {
  date: string;
  name: string;
  weight: number;
  weekend: boolean;
}

export interface DayInfo {
  date: string;
  weekend: boolean;
  holiday: { name: string; weight: number } | null;
}

export interface WeekGroup {
  key: string;
  start: string;
  end: string;
  totalDays: number;
  weekendDays: number;
  holidayDaysAll: number;
  holidayDaysWork: number;
  halfHolidayDays: number;
  holidays: HolidayHit[];
  leaveDays: number;
  bridgeHint: boolean;
}

export function calculateTRRange(startDate: Date, endDate: Date): CalculationResult {
  const days: DayInfo[] = [];
  let totalDays = 0;
  let weekendDays = 0;
  let workdays = 0;
  let holidayOnWorkdays = 0;
  const holidayHits: HolidayHit[] = [];

  const start = new Date(Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()));
  const end = new Date(Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()));

  for (let d = new Date(start); d.getTime() <= end.getTime(); d = addDaysUTC(d, 1)) {
    const iso = toISODateUTC(d);
    const weekend = isWeekendUTC(d);
    const holiday = TR_HOLIDAY_MAP.get(iso) || null;

    totalDays += 1;
    if (weekend) weekendDays += 1;
    if (!weekend) workdays += 1;

    if (holiday) {
      holidayHits.push({ date: iso, name: holiday.name, weight: holiday.weight, weekend });
      if (!weekend) holidayOnWorkdays += holiday.weight;
    }

    days.push({
      date: iso,
      weekend,
      holiday: holiday ? { name: holiday.name, weight: holiday.weight } : null
    });
  }

  let leaveDays = workdays - holidayOnWorkdays;
  if (leaveDays < 0) leaveDays = 0;

  return {
    totalDays,
    weekendDays,
    workdays,
    officialHolidayDays: round1(holidayOnWorkdays),
    leaveDays: round1(leaveDays),
    holidayHits,
    days
  };
}

// ==================== ALMANYA HESAPLAMALARI ====================

export function calculateDERange(
  startDate: Date, 
  endDate: Date, 
  stateCode: GermanStateCode
): CalculationResult {
  const holidayMap = createHolidayMap(stateCode);
  
  const days: DayInfo[] = [];
  let totalDays = 0;
  let weekendDays = 0;
  let workdays = 0;
  let holidayOnWorkdays = 0;
  const holidayHits: HolidayHit[] = [];

  const start = new Date(Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()));
  const end = new Date(Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()));

  for (let d = new Date(start); d.getTime() <= end.getTime(); d = addDaysUTC(d, 1)) {
    const iso = toISODateUTC(d);
    const weekend = isWeekendUTC(d);
    const holiday = holidayMap.get(iso) || null;

    totalDays += 1;
    if (weekend) weekendDays += 1;
    if (!weekend) workdays += 1;

    if (holiday) {
      holidayHits.push({ date: iso, name: holiday.name, weight: 1, weekend });
      if (!weekend) holidayOnWorkdays += 1;
    }

    days.push({
      date: iso,
      weekend,
      holiday: holiday ? { name: holiday.name, weight: 1 } : null
    });
  }

  let leaveDays = workdays - holidayOnWorkdays;
  if (leaveDays < 0) leaveDays = 0;

  return {
    totalDays,
    weekendDays,
    workdays,
    officialHolidayDays: round1(holidayOnWorkdays),
    leaveDays: round1(leaveDays),
    holidayHits,
    days
  };
}

// ==================== HAFTALIK GRUPLAMA ====================

export function groupDaysByWeek(days: DayInfo[]): WeekGroup[] {
  if (!days.length) return [];

  const out: WeekGroup[] = [];
  let bucket: WeekGroup | null = null;

  for (const day of days) {
    const dt = parseISODate(day.date);
    const weekKey = isoWeekKey(dt);

    if (!bucket || bucket.key !== weekKey) {
      if (bucket) finalizeBucket(bucket);
      bucket = newWeekBucket(weekKey, day.date);
      out.push(bucket);
    }

    bucket.totalDays += 1;
    if (day.weekend) bucket.weekendDays += 1;

    if (day.holiday) {
      bucket.holidayDaysAll += day.holiday.weight;
      if (!day.weekend) bucket.holidayDaysWork += day.holiday.weight;
      if (day.holiday.weight === 0.5) bucket.halfHolidayDays += 1;
      bucket.holidays.push({ 
        date: day.date, 
        name: day.holiday.name, 
        weight: day.holiday.weight, 
        weekend: day.weekend 
      });
    }

    bucket.end = day.date;
  }

  if (bucket) finalizeBucket(bucket);
  return out;
}

function newWeekBucket(key: string, startIso: string): WeekGroup {
  return {
    key,
    start: startIso,
    end: startIso,
    totalDays: 0,
    weekendDays: 0,
    holidayDaysAll: 0,
    holidayDaysWork: 0,
    halfHolidayDays: 0,
    holidays: [],
    leaveDays: 0,
    bridgeHint: false
  };
}

function finalizeBucket(b: WeekGroup): void {
  const work = b.totalDays - b.weekendDays;
  b.leaveDays = round1(Math.max(0, work - b.holidayDaysWork));
  b.bridgeHint = b.holidays.some(h => {
    const d = parseISODate(h.date);
    const dow = d.getUTCDay();
    return (dow >= 2 && dow <= 4) && !h.weekend;
  });
}

// ==================== VERİMLİLİK HESAPLAMA ====================

export function calculateEfficiency(leaveDays: number, totalDays: number): {
  percentage: number;
  ratio: number;
  label: string;
  badge: string;
} {
  if (leaveDays <= 0) {
    return {
      percentage: 100,
      ratio: 0,
      label: '0 gün izinle: tamamen hafta sonu / resmî tatil',
      badge: '🌿 Tam "resmî tatil + hafta sonu" modu'
    };
  }

  const ratio = totalDays / leaveDays;
  const percentage = clamp(Math.round(((ratio - 1) / 3) * 100), 0, 100);

  let badge = '🧳 Klasik izin planı';
  if (ratio >= 3.2) badge = '🚀 Çok verimli kaçamak';
  else if (ratio >= 2.4) badge = '☀️ Verimli tatil';

  return {
    percentage,
    ratio: round1(ratio),
    label: `1 gün izin ≈ ${round1(ratio)} gün tatil`,
    badge
  };
}

// ==================== YARDIMCI FONKSİYONLAR ====================

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function toISODateUTC(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function addDaysUTC(date: Date, days: number): Date {
  const copy = new Date(date.getTime());
  copy.setUTCDate(copy.getUTCDate() + days);
  return copy;
}

export function isWeekendUTC(date: Date): boolean {
  const dow = date.getUTCDay();
  return dow === 0 || dow === 6;
}

export function isoWeekKey(date: Date): string {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  d.setUTCDate(d.getUTCDate() + 3 - ((d.getUTCDay() + 6) % 7));
  const weekYear = d.getUTCFullYear();
  const week1 = new Date(Date.UTC(weekYear, 0, 4));
  const weekNo = 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getUTCDay() + 6) % 7)) / 7);
  return `${weekYear}-W${String(weekNo).padStart(2, '0')}`;
}

export function humanizeDays(x: number): string {
  const full = Math.floor(x);
  const half = Math.abs(x - full) >= 0.5 ? 1 : 0;

  if (full === 0 && half === 0) return '0';
  if (full > 0 && half === 0) return `${full}`;
  if (full === 0 && half === 1) return '1 yarım gün';
  return `${full} gün + 1 yarım gün`;
}

export function formatDateTR(date: Date): string {
  return new Intl.DateTimeFormat('tr-TR', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  }).format(date);
}

export function formatShortDateTR(date: Date): string {
  return new Intl.DateTimeFormat('tr-TR', { 
    day: '2-digit', 
    month: 'short' 
  }).format(date);
}

export function getDayNameTR(date: Date): string {
  return new Intl.DateTimeFormat('tr-TR', { weekday: 'long' }).format(date);
}

export function getDayAbbrTR(date: Date): string {
  const map = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
  return map[date.getUTCDay()];
}

export function formatHolidayLabelTR(iso: string): string {
  const d = parseISODate(iso);
  const dd = String(d.getUTCDate()).padStart(2, '0');
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const yy = String(d.getUTCFullYear()).slice(-2);
  return `${dd}-${mm}-${yy} - (${getDayAbbrTR(d)})`;
}

export function round1(x: number): number {
  return Math.round(x * 10) / 10;
}

export function clamp(n: number, a: number, b: number): number {
  return Math.max(a, Math.min(b, n));
}

export function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function capitalize(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}
