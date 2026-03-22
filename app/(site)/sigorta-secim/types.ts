// Sigorta seçim aracı tipleri

export interface InsuranceType {
  key: string;
  title: string;
  base: number;
  mustAt: number;
  shouldAt: number;
  reasons: string[];
}

export interface Provider {
  name: string;
  desc: string;
  url: string;
}

export interface Option {
  key: string;
  label: string;
  desc: string;
  add?: Record<string, number>;
}

export interface Question {
  id: string;
  title: string;
  desc: string;
  type: 'single' | 'yesno';
  options?: Option[];
  weight?: Record<string, Record<string, number>>;
}

export interface ClassifiedResult {
  must: Array<InsuranceType & { score: number }>;
  should: Array<InsuranceType & { score: number }>;
  nice: Array<InsuranceType & { score: number }>;
}
