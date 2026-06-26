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

export type QuestionnaireAnswerType =
  | 'likert_1_5'
  | 'boolean'
  | 'single_choice'
  | 'numeric';

export interface QuestionnaireOption {
  key: string;
  label: string;
  score: number;
}

export interface QuestionnaireNumericBand {
  min: number;
  max: number;
  label: string;
  score: number;
}

export interface QuestionnaireQuestion {
  id: string;
  text: string;
  answerType: QuestionnaireAnswerType;
  weight: number;
  rationale: string;
  dimension?: string;
  reverse?: boolean;
  options?: QuestionnaireOption[];
  numericRange?: {
    min: number;
    max: number;
    bands: QuestionnaireNumericBand[];
  };
}

export interface ToolQuestionnaireConfig {
  toolSlug: string;
  version: string;
  completionMode: 'post-result';
  questions: QuestionnaireQuestion[];
}

export type QuestionnaireAnswerValue = string | number | boolean;

export interface QuestionnaireAnswerPayload {
  questionId: string;
  value: QuestionnaireAnswerValue;
  score: number;
}

export interface ToolQuestionnaireSubmissionMeta {
  pathname: string;
  submittedAt: string;
  userAgent?: string | null;
}

export interface ToolQuestionnaireSubmission {
  toolSlug: string;
  version: string;
  sessionId: string;
  resultId?: string | null;
  answers: QuestionnaireAnswerPayload[];
  toolScore: number;
  dimensionScores: Record<string, number>;
  meta: ToolQuestionnaireSubmissionMeta;
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
  category: 'Rota ve Strateji' | 'Kariyer ve Gelir' | 'Hazırlık ve Yerleşim' | 'Yaşam ve Destek';
  questionCount: number;
  spotlight: string;
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
  questionnaire?: ToolQuestionnaireConfig;
  results?: Record<string, ToolResult>;
  resolveResult?: (params: { resultId: string; state: ToolState }) => ToolResult;
}
