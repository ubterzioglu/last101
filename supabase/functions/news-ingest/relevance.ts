// Gelişmiş relevance skorlama.
// Mevcut kategori-tabanlı mantığı korur, corteqsmvp radar-news-scan'in
// diaspora keyword katmanları + clickbait/negatif cezalarıyla zenginleştirir.
// news_pipeline_settings.excluded_keywords / high_priority_keywords saygı görür.

const STRONG_DIASPORA_KEYWORDS = [
  'türk diasporası', 'turkish diaspora', 'türkische diaspora',
  'yurt dışında türkler', 'diaspora turca',
]

const GERMANY_COMMUNITY_KEYWORDS = [
  'almanya türkler', 'türken in deutschland', 'turkish community germany',
  'türk toplumu almanya', 'türkische community', 'türkische gemeinde',
]

const LEGAL_IMMIGRATION_KEYWORDS = [
  'oturum izni', 'aufenthaltsrecht', 'aufenthaltstitel', 'residence permit',
  'einbürgerung', 'vatandaşlık almanya', 'doppelte staatsbürgerschaft',
  'çifte vatandaşlık', 'german citizenship', 'citizenship reform',
]

const BUSINESS_KEYWORDS = [
  'türk girişimci', 'türkische unternehmer', 'turkish entrepreneur',
  'türk işletme', 'fachkräfteeinwanderung',
]

// Günlük hayatı doğrudan etkileyen genel konular (mevcut pipeline'dan).
const DAILY_LIFE_KEYWORDS = [
  'oturum', 'goc', 'göç', 'vatandas', 'vatandaş', 'vergi', 'sigorta',
  'kindergeld', 'egitim', 'eğitim', 'saglik', 'sağlık', 'ulasim', 'ulaşım',
]

const OFFICIAL_SOURCE_PATTERNS = /(bamf|bundesregierung|arbeitsagentur)/i

const NEGATIVE_KEYWORDS = [
  'spor haberleri', 'maç sonucu', 'gol attı', 'şampiyon',
  'erotik', 'pornografi', 'casino', 'bahis sitesi',
  'tıkla kazan', 'çekiliş katıl', 'ücretsiz iphone',
  'magazin', 'celebrity', 'yarisma', 'yarışma',
]

const CLICKBAIT_PATTERNS = [
  /\d+ şey(i|den) bilmeli/i,
  /inanamayacaksınız/i,
  /\bshocking\b/i,
  /\byou won't believe\b/i,
  /\bclick here\b/i,
]

export interface RelevanceInput {
  category: string
  title: string
  description: string
  sourceName: string
  publishedAt: string | null
  excludedKeywords?: string[]
  highPriorityKeywords?: string[]
}

export interface RelevanceResult {
  score: number
  reason: string
}

function checkFirstMatch(keywords: string[], text: string): string | null {
  for (const keyword of keywords) {
    if (text.includes(keyword)) return keyword
  }
  return null
}

export function computeRelevance(input: RelevanceInput): RelevanceResult {
  const titleLower = input.title.toLocaleLowerCase('tr-TR')
  const combinedLower = `${input.title} ${input.description}`.toLocaleLowerCase('tr-TR')
  const reasons: string[] = []
  let score = 0

  // ── Kategori temel puanı (mevcut mantık) ──
  if (input.category === 'almanya') {
    score += 30
    reasons.push('Almanya kategorisinde')
  }

  // ── Diaspora keyword katmanları (corteqs) — başlıkta tam ağırlık ──
  const diaspora = checkFirstMatch(STRONG_DIASPORA_KEYWORDS, titleLower)
  if (diaspora) {
    score += 35
    reasons.push(`Diaspora odaklı (${diaspora})`)
  }
  const germany = checkFirstMatch(GERMANY_COMMUNITY_KEYWORDS, titleLower)
  if (germany) {
    score += 25
    reasons.push(`Almanya Türk topluluğu (${germany})`)
  }
  const legal = checkFirstMatch(LEGAL_IMMIGRATION_KEYWORDS, titleLower)
  if (legal) {
    score += 20
    reasons.push(`Hukuk/göç konusu (${legal})`)
  }
  const business = checkFirstMatch(BUSINESS_KEYWORDS, titleLower)
  if (business) {
    score += 15
    reasons.push(`İş dünyası (${business})`)
  }

  // ── Günlük hayatı etkileyen genel konular (mevcut mantık) ──
  if (checkFirstMatch(DAILY_LIFE_KEYWORDS, combinedLower)) {
    score += 30
    reasons.push('Günlük hayatı doğrudan etkileyen konu')
  }

  // ── Tazelik bonusu ──
  if (input.publishedAt) {
    const diffHours = (Date.now() - new Date(input.publishedAt).getTime()) / (1000 * 60 * 60)
    if (Number.isFinite(diffHours) && diffHours <= 24) {
      score += 20
      reasons.push('Son 24 saat içinde yayınlanmış')
    }
  }

  // ── Resmi kaynak bonusu ──
  if (OFFICIAL_SOURCE_PATTERNS.test(input.sourceName)) {
    score += 20
    reasons.push('Resmi kurum kaynağı')
  }

  // ── Admin tanımlı yüksek öncelikli keyword'ler ──
  const highPriority = (input.highPriorityKeywords ?? [])
    .map((kw) => kw.toLocaleLowerCase('tr-TR').trim())
    .filter(Boolean)
  const highMatch = checkFirstMatch(highPriority, combinedLower)
  if (highMatch) {
    score += 25
    reasons.push(`Yüksek öncelikli konu (${highMatch})`)
  }

  // ── Negatif keyword cezası (admin tanımlı + hardcode) ──
  const negativeNeedles = [
    ...(input.excludedKeywords ?? []).map((kw) => kw.toLocaleLowerCase('tr-TR').trim()),
    ...NEGATIVE_KEYWORDS,
  ].filter(Boolean)
  const negativeMatch = checkFirstMatch(negativeNeedles, combinedLower)
  if (negativeMatch) {
    score -= 40
    reasons.push(`Düşük öncelikli içerik (${negativeMatch})`)
  }

  // ── Clickbait cezası ──
  for (const pattern of CLICKBAIT_PATTERNS) {
    if (pattern.test(input.title)) {
      score -= 50
      reasons.push('Clickbait kalıbı')
      break
    }
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    reason: reasons.join(', ') || 'Varsayılan değerlendirme',
  }
}
