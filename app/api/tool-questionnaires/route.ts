import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { computeToolScore, scoreAnswers, validateQuestionnaireAnswerValue } from '@/lib/tools/survey';
import { TOOL_QUESTIONNAIRE_REGISTRY } from '@/lib/tools/surveys';
import type { QuestionnaireAnswerPayload, QuestionnaireAnswerValue } from '@/lib/tools/types';

class RequestValidationError extends Error {}

function normalizeEnvValue(value: unknown): string {
  const raw = String(value || '').trim();
  if (!raw) {
    return '';
  }

  if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
    return raw.slice(1, -1).trim();
  }

  return raw;
}

function truncate(value: unknown, maxLength: number) {
  return String(value || '').trim().slice(0, maxLength);
}

function isQuestionnaireToolSlug(value: string): value is keyof typeof TOOL_QUESTIONNAIRE_REGISTRY {
  return value in TOOL_QUESTIONNAIRE_REGISTRY;
}

function isScoreInRange(value: unknown) {
  return typeof value === 'number' && value >= 0 && value <= 100;
}

function parseAnswers(
  rawAnswers: unknown,
  toolSlug: keyof typeof TOOL_QUESTIONNAIRE_REGISTRY
) {
  if (!Array.isArray(rawAnswers)) {
    throw new RequestValidationError('answers alanı geçerli bir dizi olmalıdır.');
  }

  const config = TOOL_QUESTIONNAIRE_REGISTRY[toolSlug];

  if (rawAnswers.length !== config.questions.length) {
    throw new RequestValidationError('Tüm anket soruları cevaplanmalıdır.');
  }

  const seenQuestionIds = new Set<string>();
  const rawAnswerList: Array<{ questionId: string; value: QuestionnaireAnswerValue }> = [];

  for (const item of rawAnswers) {
    const questionId = truncate((item as { questionId?: unknown })?.questionId, 100);
    const value = (item as { value?: QuestionnaireAnswerValue })?.value;
    const score = (item as { score?: unknown })?.score;
    const question = config.questions.find((entry) => entry.id === questionId);

    if (!question) {
      throw new RequestValidationError('Geçersiz soru kimliği gönderildi.');
    }

    if (seenQuestionIds.has(questionId)) {
      throw new RequestValidationError('Aynı soru birden fazla kez gönderilemez.');
    }

    if (!validateQuestionnaireAnswerValue(question, value)) {
      throw new RequestValidationError(`"${question.text}" için geçersiz cevap değeri gönderildi.`);
    }

    if (!isScoreInRange(score)) {
      throw new RequestValidationError('Cevap skorları 0 ile 100 arasında olmalıdır.');
    }

    seenQuestionIds.add(questionId);
    rawAnswerList.push({ questionId, value: value as QuestionnaireAnswerValue });
  }

  return scoreAnswers(config, rawAnswerList);
}

export async function POST(request: NextRequest) {
  const supabaseUrl = normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const serviceRoleKey = normalizeEnvValue(
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_SERVICE_KEY ||
      process.env.SUPABASE_SECRET_KEY ||
      ''
  );

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: 'Service not configured' }, { status: 503 });
  }

  try {
    const body = await request.json();
    const toolSlug = truncate(body?.toolSlug, 120);
    const version = truncate(body?.version, 40);
    const sessionId = truncate(body?.sessionId, 120);
    const resultId = truncate(body?.resultId, 80) || null;
    const pathname = truncate(body?.meta?.pathname, 240);
    const submittedAt = truncate(body?.meta?.submittedAt, 80);
    const clientToolScore = body?.toolScore;
    const clientDimensionScores = body?.dimensionScores;

    if (!isQuestionnaireToolSlug(toolSlug)) {
      return NextResponse.json({ error: 'Geçersiz araç slug değeri.' }, { status: 400 });
    }

    const config = TOOL_QUESTIONNAIRE_REGISTRY[toolSlug];

    if (!sessionId || !pathname || !submittedAt) {
      return NextResponse.json({ error: 'Eksik submission meta alanları var.' }, { status: 400 });
    }

    if (version !== config.version) {
      return NextResponse.json({ error: 'Geçersiz anket sürümü.' }, { status: 400 });
    }

    if (!isScoreInRange(clientToolScore)) {
      return NextResponse.json({ error: 'Geçersiz toplam skor değeri.' }, { status: 400 });
    }

    if (
      typeof clientDimensionScores !== 'object' ||
      clientDimensionScores === null ||
      Object.values(clientDimensionScores).some((value) => !isScoreInRange(value))
    ) {
      return NextResponse.json({ error: 'Geçersiz boyutsal skor verisi.' }, { status: 400 });
    }

    const answers = parseAnswers(body?.answers, toolSlug);
    const computed = computeToolScore(config, answers);
    const userAgent = request.headers.get('user-agent');

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { error } = await supabase.from('tool_questionnaire_submissions').insert({
      tool_slug: toolSlug,
      survey_version: config.version,
      session_id: sessionId,
      result_id: resultId,
      answers,
      tool_score: computed.toolScore,
      dimension_scores: computed.dimensionScores,
      meta: {
        pathname,
        submittedAt,
        userAgent,
      },
    });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      ok: true,
      toolScore: computed.toolScore,
      dimensionScores: computed.dimensionScores,
      answerCount: answers.length,
    });
  } catch (error) {
    if (error instanceof RequestValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error('tool-questionnaires POST failed:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
