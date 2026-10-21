// Hafif dil tespiti: stopword + dile özgü karakter skoru. Dış bağımlılık yok (Deno ve Node'da çalışır).
// Amaç kesin sınıflandırma değil; izin verilmeyen dilleri (özellikle İngilizce) ingest sırasında elemek.
// Yanlış ret, yanlış kabulden pahalıdır (elenen öğe dedupe nedeniyle tekrar gelmez), bu yüzden kararlar temkinli.

export type NewsLanguage = 'tr' | 'de' | 'en'

export const SUPPORTED_NEWS_LANGUAGES: readonly NewsLanguage[] = ['tr', 'de', 'en']
export const DEFAULT_ALLOWED_LANGUAGES: readonly NewsLanguage[] = ['tr', 'de']

const STOPWORDS: Record<NewsLanguage, ReadonlySet<string>> = {
  tr: new Set([
    've', 'bir', 'bu', 'için', 'ile', 'de', 'da', 'çok', 'daha', 'olarak', 'gibi', 'ama', 'kadar',
    'sonra', 'yeni', 'ne', 'olan', 'var', 'ise', 'her', 'ya', 'şu', 'o', 'ki', 'mi', 'değil',
    'hakkında', 'üzerine', 'göre', 'oldu', 'dedi', 'etti',
  ]),
  de: new Set([
    'der', 'die', 'das', 'und', 'nicht', 'ein', 'eine', 'mit', 'für', 'ist', 'von', 'dem',
    'auf', 'zu', 'im', 'auch', 'bei', 'nach', 'wird', 'sich', 'zum', 'zur', 'über', 'wie', 'aus',
    'um', 'als', 'noch', 'nur', 'gegen', 'sind', 'wurde', 'hat',
  ]),
  // Diller arası ortak kelimeler bilerek yok: in/so/was/will (Almanca), on/at/en (Türkçe),
  // news/new (Almancada yaygın alıntı).
  en: new Set([
    'the', 'and', 'of', 'to', 'is', 'for', 'with', 'that', 'as', 'by', 'from',
    'after', 'over', 'says', 'has', 'have', 'are', 'were', 'be', 'this', 'it', 'its',
    'latest', 'why', 'how', 'what', 'about', 'into', 'amid', 'could', 'would',
  ]),
}

// Yerelden bağımsız küçültülmüş token üzerinde aranır: tr-TR yereli "IRGC"yi "ırgc" yapıp yanlış puan verirdi.
const TURKISH_ONLY_CHARS = /[çğış]/
const GERMAN_ONLY_CHARS = /[äß]/

// Kaynağın dilini ezmek için, tespit edilen dilin kaynak diline karşı en az bu kadar önde olması gerekir.
const MIN_MARGIN_TO_OVERRIDE_SOURCE = 3
// Kaynak dili bilinmiyorsa tek bir kelimeyle karar verilmez.
const MIN_SCORE_WITHOUT_SOURCE = 2

// GDELT gibi adaptörlerin döndürdüğü tam dil adları.
const LANGUAGE_NAMES: Record<string, NewsLanguage> = {
  turkish: 'tr',
  german: 'de',
  english: 'en',
}

function tokenize(text: string, locale: string): string[] {
  return text.toLocaleLowerCase(locale).split(/[^\p{L}]+/u).filter(Boolean)
}

/**
 * Stopword başına 1 puan + dile özgü karakter içeren token başına 1 puan.
 * Karakterler token başına bir kez sayılır; özel isimler (Kılıçdaroğlu) skoru şişirmez.
 */
function scoreLanguage(language: NewsLanguage, text: string): number {
  // tr-TR yerelinde "I" → "ı" olur; İngilizce/Almanca stopword'ler ("Is", "Ist") için düz küçültme gerekir.
  const stopwordTokens = tokenize(text, language === 'tr' ? 'tr-TR' : 'en-US')
  const neutralTokens = tokenize(text, 'en-US')
  const stopwords = STOPWORDS[language]
  const specialChars = language === 'tr' ? TURKISH_ONLY_CHARS : language === 'de' ? GERMAN_ONLY_CHARS : null

  const stopwordScore = stopwordTokens.filter((token) => stopwords.has(token)).length
  const charScore = specialChars ? neutralTokens.filter((token) => specialChars.test(token)).length : 0
  return stopwordScore + charScore
}

type Scores = Record<NewsLanguage, number>

function scoreAll(text: string): Scores {
  return {
    tr: scoreLanguage('tr', text),
    de: scoreLanguage('de', text),
    en: scoreLanguage('en', text),
  }
}

function pickBest(scores: Scores): { language: NewsLanguage; score: number } | null {
  const ranked = SUPPORTED_NEWS_LANGUAGES
    .map((language) => ({ language, score: scores[language] }))
    .sort((a, b) => b.score - a.score)
  const [best, runnerUp] = ranked
  if (best.score < 1 || best.score === runnerUp.score) return null
  return best
}

/** Metnin dilini tahmin eder. Yeterli kanıt yoksa veya skorlar eşitse null döner. */
export function detectLanguage(text: string): NewsLanguage | null {
  if (!text.trim()) return null
  return pickBest(scoreAll(text))?.language ?? null
}

/** Yalnızca "tr", "de-DE" gibi kodları veya "Turkish" gibi tam adları kabul eder. */
export function normalizeLanguageCode(value: unknown): NewsLanguage | null {
  const raw = String(value ?? '').trim().toLowerCase()
  if (LANGUAGE_NAMES[raw]) return LANGUAGE_NAMES[raw]
  const match = /^([a-z]{2})(?:[-_][a-z]{2})?$/.exec(raw)
  if (!match) return null
  return (SUPPORTED_NEWS_LANGUAGES as readonly string[]).includes(match[1]) ? (match[1] as NewsLanguage) : null
}

export function normalizeAllowedLanguages(value: unknown): NewsLanguage[] {
  if (!Array.isArray(value)) return [...DEFAULT_ALLOWED_LANGUAGES]
  const languages = value
    .map(normalizeLanguageCode)
    .filter((language): language is NewsLanguage => language !== null)
  return languages.length > 0 ? [...new Set(languages)] : [...DEFAULT_ALLOWED_LANGUAGES]
}

export interface LanguageDecision {
  language: NewsLanguage | null
  allowed: boolean
}

function resolveLanguage(text: string, hint: NewsLanguage | null): NewsLanguage | null {
  const scores = scoreAll(text)
  const best = text.trim() ? pickBest(scores) : null

  if (hint === null) {
    return best && best.score >= MIN_SCORE_WITHOUT_SOURCE ? best.language : null
  }
  if (best && best.language !== hint && best.score - scores[hint] >= MIN_MARGIN_TO_OVERRIDE_SOURCE) {
    return best.language
  }
  return hint
}

/**
 * Kaynak/öğe dili varsayılan kabul edilir; içerik ancak belirgin bir farkla başka bir dili gösterirse
 * bu varsayım ezilir. Hiç ipucu yoksa yalnızca güçlü bir tespit karar verir, aksi halde öğe geçer.
 * `itemLanguage` (ör. GDELT'in makale dili) kaynağın language_code değerinden önceliklidir.
 */
export function decideLanguage(input: {
  title: string
  description: string
  sourceLanguage?: string | null
  itemLanguage?: string | null
  allowedLanguages: readonly NewsLanguage[]
}): LanguageDecision {
  const hint = normalizeLanguageCode(input.itemLanguage) ?? normalizeLanguageCode(input.sourceLanguage)
  const language = resolveLanguage(`${input.title} ${input.description}`, hint)
  const allowed = language === null || input.allowedLanguages.includes(language)
  return { language, allowed }
}
