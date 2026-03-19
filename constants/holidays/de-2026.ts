/**
 * Almanya 2026 Resmî Tatilleri (Bundesländer'e göre)
 * Source: .0old/tatilde/app.js
 */

export interface GermanHoliday {
  date: string; // ISO format: YYYY-MM-DD
  name: string;
  states: string[] | 'ALL'; // 'ALL' = tüm eyaletler
  type: 'national' | 'regional' | 'religious';
}

// Tüm eyaletlerde geçerli tatiller
export const DE_2026_NATIONAL: GermanHoliday[] = [
  { date: '2026-01-01', name: 'Yılbaşı', states: 'ALL', type: 'national' },
  { date: '2026-04-03', name: 'Kutsal Cuma', states: 'ALL', type: 'religious' },
  { date: '2026-04-06', name: 'Pazartesi (Paskalya)', states: 'ALL', type: 'religious' },
  { date: '2026-05-01', name: 'İşçi Bayramı', states: 'ALL', type: 'national' },
  { date: '2026-05-14', name: 'Hz. İsa\'nın Göğe Yükselişi', states: 'ALL', type: 'religious' },
  { date: '2026-05-25', name: 'Pazartesi (Pentekost)', states: 'ALL', type: 'religious' },
  { date: '2026-10-03', name: 'Almanya Birlik Günü', states: 'ALL', type: 'national' },
  { date: '2026-12-25', name: 'Noel (1. Gün)', states: 'ALL', type: 'religious' },
  { date: '2026-12-26', name: 'Noel (2. Gün)', states: 'ALL', type: 'religious' },
];

// Eyalete özel tatiller
export const DE_2026_STATE: GermanHoliday[] = [
  { date: '2026-01-06', name: 'Kutsal Üç Kral', states: ['BW', 'BY', 'ST'], type: 'religious' },
  { date: '2026-03-08', name: 'Kadınlar Günü', states: ['BE', 'MV'], type: 'national' },
  { date: '2026-04-05', name: 'Paskalya Pazar', states: ['BB'], type: 'religious' },
  { date: '2026-05-24', name: 'Pentekost Pazar', states: ['BB'], type: 'religious' },
  { date: '2026-06-04', name: 'Kutsal Cemaziyelevvel', states: ['BW', 'BY', 'HE', 'NW', 'RP', 'SL'], type: 'religious' },
  { date: '2026-08-15', name: 'Meryem\'in Göğe Yükselişi', states: ['SL'], type: 'religious' },
  { date: '2026-09-20', name: 'Dünya Çocuk Günü', states: ['TH'], type: 'national' },
  { date: '2026-10-31', name: 'Reform Günü', states: ['BB', 'HB', 'HH', 'MV', 'NI', 'SH', 'SN', 'ST', 'TH'], type: 'religious' },
  { date: '2026-11-01', name: 'Tüm Azizler Günü', states: ['BW', 'BY', 'NW', 'RP', 'SL'], type: 'religious' },
  { date: '2026-11-18', name: 'Günah Çıkarma ve Dua Günü', states: ['SN'], type: 'religious' },
];

// Tüm tatiller (birleştirilmiş)
export const DE_2026_ALL = [...DE_2026_NATIONAL, ...DE_2026_STATE];

// Eyalet kodları ve isimleri
export const GERMAN_STATES = [
  { code: 'BW', name: 'Baden-Württemberg' },
  { code: 'BY', name: 'Bayern' },
  { code: 'BE', name: 'Berlin' },
  { code: 'BB', name: 'Brandenburg' },
  { code: 'HB', name: 'Bremen' },
  { code: 'HH', name: 'Hamburg' },
  { code: 'HE', name: 'Hessen' },
  { code: 'MV', name: 'Mecklenburg-Vorpommern' },
  { code: 'NI', name: 'Niedersachsen' },
  { code: 'NW', name: 'Nordrhein-Westfalen' },
  { code: 'RP', name: 'Rheinland-Pfalz' },
  { code: 'SL', name: 'Saarland' },
  { code: 'SN', name: 'Sachsen' },
  { code: 'ST', name: 'Sachsen-Anhalt' },
  { code: 'SH', name: 'Schleswig-Holstein' },
  { code: 'TH', name: 'Thüringen' },
] as const;

export type GermanStateCode = typeof GERMAN_STATES[number]['code'];

// Belirli bir eyalet için tatilleri getir
export function getHolidaysForState(stateCode: GermanStateCode): GermanHoliday[] {
  return DE_2026_ALL.filter(h => 
    h.states === 'ALL' || h.states.includes(stateCode)
  );
}

// Hızlı erişim için Map oluştur
export function createHolidayMap(stateCode: GermanStateCode): Map<string, GermanHoliday> {
  const holidays = getHolidaysForState(stateCode);
  return new Map(holidays.map(h => [h.date, h]));
}

// Ay isimleri
export const MONTH_NAMES_DE = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

// Gün isimleri
export const DAY_NAMES_DE = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
export const DAY_NAMES_SHORT_DE = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

// Manuel tüyolar (Almanya)
export const DE_HOLIDAY_TIPS = [
  {
    title: 'Yılbaşı Köprü Günü',
    description: '1 Ocak 2026 Perşembe. 2 Ocak izin alırsanız Perşembe-Pazar 4 günlük tatil yapabilirsiniz.',
    dates: ['2026-01-01', '2026-01-02'],
    efficiency: '4 gün tatil / 1 gün izin'
  },
  {
    title: 'Paskalya Uzatması',
    description: 'Kutsal Cuma (3 Nisan) ve Paskalya Pazartesi (6 Nisan) zaten tatil. 7-10 Nisan ekleyerek 10 günlük tatil yapın.',
    dates: ['2026-04-03', '2026-04-10'],
    efficiency: '10 gün / 4 gün izin'
  },
  {
    title: '1 Mayıs Hafta Sonu',
    description: '1 Mayıs 2026 Cuma - otomatik olarak 3 günlük hafta sonu!',
    dates: ['2026-05-01'],
    efficiency: '3 gün / 0 gün izin'
  },
  {
    title: 'Hz. İsa\'nın Göğe Yükselişi Köprüsü',
    description: '14 Mayıs Perşembe. Cuma ekleyerek 4 günlük tatil yapın.',
    dates: ['2026-05-14', '2026-05-15'],
    efficiency: '4 gün / 1 gün izin'
  },
  {
    title: 'Pentekost Uzatması',
    description: '25 Mayıs Pazartesi tatil. 26-29 Mayıs ekleyerek 9 günlük tatil yapın.',
    dates: ['2026-05-25', '2026-05-29'],
    efficiency: '9 gün / 4 gün izin'
  },
  {
    title: 'Almanya Birlik Günü',
    description: '3 Ekim 2026 Cumartesi - maalesef köprü günü imkanı yok.',
    dates: ['2026-10-03'],
    efficiency: 'Hafta sonu'
  },
  {
    title: 'Noel & Yılbaşı',
    description: '25/26 Aralık Cuma/Cumartesi. 28-31 Aralık ekleyerek 10 günlük tatil yapın.',
    dates: ['2026-12-25', '2026-12-31'],
    efficiency: '10 gün / 4 gün izin'
  },
];
