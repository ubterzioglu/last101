import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { scoreAnswers } from '@/lib/tools/survey';
import { TOOL_QUESTIONNAIRE_REGISTRY } from '@/lib/tools/surveys';

const insertMock = vi.fn();

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      insert: insertMock,
    })),
  })),
}));

import { POST } from '@/app/api/tool-questionnaires/route';

function buildValidPayload() {
  const config = TOOL_QUESTIONNAIRE_REGISTRY['almanyaya-hazir-misin'];
  const rawAnswers = config.questions.map((question) => {
    if (question.answerType === 'likert_1_5') {
      return { questionId: question.id, value: 4 };
    }

    if (question.answerType === 'boolean') {
      return { questionId: question.id, value: true };
    }

    return {
      questionId: question.id,
      value: question.options?.[question.options.length - 1]?.key ?? '',
    };
  });

  const answers = scoreAnswers(config, rawAnswers);

  return {
    toolSlug: config.toolSlug,
    version: config.version,
    sessionId: 'anon_test_session',
    resultId: 'READY',
    answers,
    toolScore: 88.2,
    dimensionScores: {
      readiness: 88.2,
      planning: 80,
    },
    meta: {
      pathname: '/almanyaya-hazir-misin',
      submittedAt: '2026-06-26T10:00:00.000Z',
    },
  };
}

describe('POST /api/tool-questionnaires', () => {
  beforeEach(() => {
    insertMock.mockReset();
    insertMock.mockResolvedValue({ error: null });
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-key';
  });

  it('rejects invalid tool slugs', async () => {
    const request = new NextRequest('http://localhost/api/tool-questionnaires', {
      method: 'POST',
      body: JSON.stringify({
        ...buildValidPayload(),
        toolSlug: 'gecersiz-slug',
      }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toContain('Geçersiz araç slug');
  });

  it('rejects invalid score ranges', async () => {
    const payload = buildValidPayload();
    payload.answers[0] = {
      ...payload.answers[0],
      score: 120,
    };

    const request = new NextRequest('http://localhost/api/tool-questionnaires', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toContain('Cevap skorları');
  });

  it('stores a valid questionnaire submission with recomputed scores', async () => {
    const payload = buildValidPayload();
    const request = new NextRequest('http://localhost/api/tool-questionnaires', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'user-agent': 'Vitest',
      },
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.answerCount).toBe(15);
    expect(insertMock).toHaveBeenCalledTimes(1);
    expect(insertMock.mock.calls[0]?.[0]).toMatchObject({
      tool_slug: 'almanyaya-hazir-misin',
      session_id: 'anon_test_session',
      result_id: 'READY',
    });
    expect(insertMock.mock.calls[0]?.[0].tool_score).toBeGreaterThan(0);
    expect(insertMock.mock.calls[0]?.[0].meta).toMatchObject({
      pathname: '/almanyaya-hazir-misin',
      submittedAt: '2026-06-26T10:00:00.000Z',
      userAgent: 'Vitest',
    });
  });
});
