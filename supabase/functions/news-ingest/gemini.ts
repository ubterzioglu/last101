import type { NormalizedNewsItem } from './normalize.ts'

export interface GeminiDraft {
  title_tr: string
  summary_tr: string
  category: string
  relevance_score: number
  relevance_reason: string
  needs_fact_check: boolean
  fact_check_notes: string[]
  whatsapp_share_text: string
}

export async function generateGeminiDraft(params: {
  apiKey: string
  item: NormalizedNewsItem
}): Promise<GeminiDraft | null> {
  if (!params.apiKey) return null

  const prompt = [
    'You are preparing a Turkish draft for a news editor.',
    'Return JSON only with keys title_tr, summary_tr, category, relevance_score, relevance_reason, needs_fact_check, fact_check_notes, whatsapp_share_text.',
    `Source title: ${params.item.title}`,
    `Source description: ${params.item.description}`,
    `Source category: ${params.item.category}`,
    'Rules: keep it short, factual, no invented details, no copyrighted full-text rewrite.',
  ].join('\n')

  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-goog-api-key': params.apiKey,
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
      },
    }),
  })

  if (!response.ok) {
    throw new Error(`Gemini request failed (${response.status})`)
  }

  const payload = await response.json()
  const text = payload?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) return null

  try {
    return JSON.parse(text) as GeminiDraft
  } catch {
    return null
  }
}
