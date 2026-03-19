// Banka seçim aracı tipleri

export interface Profile {
  key: string;
  title: string;
}

export interface Bank {
  id: string;
  name: string;
  type: string;
  weights: Record<string, number>;
}

export interface Option {
  key: string;
  label: string;
  desc: string;
  add: Record<string, number>;
}

export interface Question {
  id: string;
  title: string;
  desc: string;
  category: string;
  type: 'single' | 'yesno';
  options: Option[];
}

export interface BankRecommendation {
  bank: Bank & { score: number };
  rank: number;
  tags: string[];
  bullets: string[];
}

export interface QuizState {
  index: number;
  answers: Record<string, string>;
}
