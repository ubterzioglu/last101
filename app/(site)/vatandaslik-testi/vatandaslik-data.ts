export interface Soru {
  id: number;
  soru_almanca: string;
  soru_turkce: string;
  secenekler: Record<string, string>;
  dogru_cevap: string;
  image_url?: string;
  eyalet: string;
}

export type TestModu = 'all' | 'state' | 'real' | null;

export const EYALETLER = [
  'Baden-Württemberg',
  'Bayern',
  'Berlin',
  'Brandenburg',
  'Bremen',
  'Hamburg',
  'Hessen',
  'Mecklenburg-Vorpommern',
  'Niedersachsen',
  'Nordrhein-Westfalen',
  'Rheinland-Pfalz',
  'Saarland',
  'Sachsen',
  'Sachsen-Anhalt',
  'Schleswig-Holstein',
  'Thüringen',
];

/** Minimum correct answers to pass the real exam simulation. */
export const GECME_SINIRI = 17;

export function formatSure(saniye: number): string {
  const dakika = Math.floor(saniye / 60);
  const san = saniye % 60;
  return `${String(dakika).padStart(2, '0')}:${String(san).padStart(2, '0')}`;
}

// Yardımcı fonksiyon
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
