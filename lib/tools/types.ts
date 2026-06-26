export type ToolTone = 'blue' | 'green' | 'yellow' | 'orange' | 'red';

export type ToolPrimitive = string | number | boolean;

export interface ToolSource {
  label: string;
  href: string;
}

export interface ToolFaq {
  question: string;
  answer: string;
}

export interface ToolMetric {
  label: string;
  value: string;
  tone?: ToolTone;
}

export interface ToolOptionEffects {
  scores?: Record<string, number>;
  facts?: Record<string, ToolPrimitive>;
  tags?: string[];
}

export interface ToolOption {
  key: string;
  label: string;
  next: string;
  hint?: string;
  effects?: ToolOptionEffects;
}

export interface ToolQuestion {
  id: string;
  text: string;
  hint?: string;
  options: ToolOption[];
}

export interface ToolAnswer {
  questionId: string;
  optionKey: string;
  label: string;
}

export interface ToolState {
  scores: Record<string, number>;
  facts: Record<string, ToolPrimitive>;
  tags: string[];
  answers: ToolAnswer[];
}

export interface ToolResult {
  id: string;
  title: string;
  matchLabel: string;
  tone: ToolTone;
  summary: string;
  why: string[];
  steps: string[];
  caution?: string;
  metrics?: ToolMetric[];
  officialSources?: ToolSource[];
  relatedTools?: string[];
}

export interface ToolCatalogItem {
  slug: string;
  title: string;
  description: string;
  ctaLabel: string;
}

export interface ToolConfig {
  slug: string;
  path: string;
  title: string;
  description: string;
  intro: string;
  why: string;
  whoFor: string[];
  howItWorks: string[];
  legalNote: string;
  estimatedQuestionCount: number;
  initialQuestionId: string;
  questions: ToolQuestion[];
  faqs: ToolFaq[];
  officialSources: ToolSource[];
  relatedTools?: string[];
  results?: Record<string, ToolResult>;
  resolveResult?: (params: { resultId: string; state: ToolState }) => ToolResult;
}

