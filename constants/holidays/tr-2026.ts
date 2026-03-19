/**
 * Türkiye 2026 Resmî Tatilleri
 * Source: .0old/tatiltr/app.js
 */

export interface Holiday {
  date: string; // ISO format: YYYY-MM-DD
  name: string;
  weight: number; // 1 = tam gün, 0.5 = yarım gün (arefe)
  type: 'national' | 'religious' | 'commemoration';
}

export const TR_2026_HOLIDAYS: Holiday[] = [
  // Yılbaşı
  { date: '2026-01-01', name: 'Yılbaşı', weight: 1, type: 'national' },

  // Ramazan Bayramı
  { date: '2026-03-19', name: 'Ramazan Bayramı Arifesi', weight: 0.5, type: 'religious' },
  { date: '2026-03-20', name: 'Ramazan Bayramı (1. Gün)', weight: 1, type: 'religious' },
  { date: '2026-03-21', name: 'Ramazan Bayramı (2. Gün)', weight: 1, type: 'religious' },
  { date: '2026-03-22', name: 'Ramazan Bayramı (3. Gün)', weight: 1, type: 'religious' },

  // Ulusal Bayramlar
  { date: '2026-04-23', name: 'Ulusal Egemenlik ve Çocuk Bayramı', weight: 1, type: 'national' },
  { date: '2026-05-01', name: 'Emek ve Dayanışma Günü', weight: 1, type: 'national' },
  { date: '2026-05-19', name: 'Atatürk\'ü Anma, Gençlik ve Spor Bayramı', weight: 1, type: 'national' },

  // Kurban Bayramı
  { date: '2026-05-26', name: 'Kurban Bayramı Arifesi', weight: 0.5, type: 'religious' },
  { date: '2026-05-27', name: 'Kurban Bayramı (1. Gün)', weight: 1, type: 'religious' },
  { date: '2026-05-28', name: 'Kurban Bayramı (2. Gün)', weight: 1, type: 'religious' },
  { date: '2026-05-29', name: 'Kurban Bayramı (3. Gün)', weight: 1, type: 'religious' },
  { date: '2026-05-30', name: 'Kurban Bayramı (4. Gün)', weight: 1, type: 'religious' },

  // Diğer Ulusal Bayramlar
  { date: '2026-07-15', name: 'Demokrasi ve Millî Birlik Günü', weight: 1, type: 'commemoration' },
  { date: '2026-08-30', name: 'Zafer Bayramı', weight: 1, type: 'national' },

  // Cumhuriyet Bayramı
  { date: '2026-10-28', name: 'Cumhuriyet Bayramı Arifesi', weight: 0.5, type: 'national' },
  { date: '2026-10-29', name: 'Cumhuriyet Bayramı', weight: 1, type: 'national' },
];

// Hızlı erişim için Map
export const TR_HOLIDAY_MAP = new Map(TR_2026_HOLIDAYS.map(h => [h.date, h]));

// Ay isimleri
export const MONTH_NAMES_TR = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

// Gün isimleri
export const DAY_NAMES_TR = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

export const DAY_NAMES_SHORT_TR = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

// Manuel tüyolar
export const TR_HOLIDAY_TIPS = [
  {
    title: 'Yılbaşı Fırsatı',
    description: '1 Ocak 2026 Perşembe resmî tatil; 2 Ocak Cuma izin alırsan Perşembe–Pazar 4 günlük tatil çıkar.',
    dates: ['2026-01-01', '2026-01-02'],
    efficiency: '4 gün tatil / 1 gün izin'
  },
  {
    title: 'Ramazan Bayramı Uzatması',
    description: 'Ramazan Bayramı 19–22 Mart aralığında; 16–18 Mart (Pazartesi–Çarşamba) izin alırsan 15–22 Mart arasında 9 güne kadar tatil yapabilirsin.',
    dates: ['2026-03-15', '2026-03-22'],
    efficiency: '9 gün tatil / 3 gün izin'
  },
  {
    title: '23 Nisan Kaçamağı',
    description: '23 Nisan 2026 Perşembe; 24 Nisan Cuma izin alırsan Perşembe–Pazar 4 günlük tatil olur.',
    dates: ['2026-04-23', '2026-04-24'],
    efficiency: '4 gün tatil / 1 gün izin'
  },
  {
    title: '1 Mayıs Hafta Sonu',
    description: '1 Mayıs 2026 Cuma; Cumartesi–Pazar ile birleşince 3 günlük tatil hazır.',
    dates: ['2026-05-01'],
    efficiency: '3 gün tatil / 0 gün izin'
  },
  {
    title: '19 Mayıs Mini Tatil',
    description: '19 Mayıs 2026 Salı; 18 Mayıs Pazartesi izin alırsan 4 günlük mini tatil yaparsın.',
    dates: ['2026-05-18', '2026-05-19'],
    efficiency: '4 gün tatil / 1 gün izin'
  },
  {
    title: 'Kurban Bayramı Uzatması',
    description: 'Kurban Bayramı 26–30 Mayıs döneminde; 25 Mayıs ve 1 Haziran Pazartesi izin alarak 9–10 gün tatil planlayabilirsin.',
    dates: ['2026-05-25', '2026-06-01'],
    efficiency: '10 gün tatil / 2 gün izin'
  },
  {
    title: '15 Temmuz Kaçamağı',
    description: '15 Temmuz 2026 Çarşamba; 13–14 Temmuz izin alırsan 5 günlük tatil yakalarsın.',
    dates: ['2026-07-13', '2026-07-15'],
    efficiency: '5 gün tatil / 2 gün izin'
  },
  {
    title: '30 Ağustos Uzatması',
    description: '30 Ağustos 2026 Pazar; 31 Ağustos Pazartesi izin eklersen Cumartesi–Pazartesi 3 günlük tatil olur.',
    dates: ['2026-08-30', '2026-08-31'],
    efficiency: '3 gün tatil / 1 gün izin'
  },
  {
    title: '29 Ekim Kaçamağı',
    description: '29 Ekim 2026 Perşembe; 30 Ekim Cuma izin alırsan Perşembe–Pazar 4 günlük tatil çıkar.',
    dates: ['2026-10-29', '2026-10-30'],
    efficiency: '4 gün tatil / 1 gün izin'
  },
];
