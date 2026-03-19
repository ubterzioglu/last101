// Edge Function: register-user
// Purpose: Secure API endpoint for user registration
// Security: strict origin check, input validation, sanitization, duplicate check

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const ALLOWED_ORIGINS = [
  'https://almanya101.de',
  'https://www.almanya101.de',
  'http://localhost:3000',
  'http://localhost:5173',
]

const ALLOWED_ORIGIN_SET = new Set(ALLOWED_ORIGINS.map((origin) => origin.toLowerCase()))

// Request size limit (10KB)
const MAX_BODY_SIZE = 1024 * 10

// Rate limiting map
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = 5
const RATE_WINDOW = 60 * 1000

// Allowed enum values for validation
const ALLOWED_ROL_VALUES = ['Software Developer', 'QA / Test', 'DevOps', 'Data / AI', 'Product / Project', 'UI/UX', 'Öğrenci', 'Diğer']
const ALLOWED_DENEYIM_VALUES = ['0–1 yıl', '1–3 yıl', '3–5 yıl', '5–10 yıl', '10+ yıl']
const ALLOWED_IS_ARAMA_VALUES = ['Hayır', 'Evet, pasif (fırsat olursa)', 'Evet, aktif', 'Sadece freelance bakıyorum']
const ALLOWED_FREELANCE_VALUES = ['Hayır', 'Evet, hafta içi akşamları', 'Evet, hafta sonu', 'Evet, part-time düzenli', 'Evet, full-time freelance']
const ALLOWED_KATILMA_AMACI_VALUES = ['Networking', 'İş bulmak', 'İş arkadaşı bulmak', 'Proje geliştirmek', 'Bilgi paylaşmak', 'Mentorluk almak', 'Mentorluk vermek']
const ALLOWED_YASAM_YERI_VALUES = ['Almanya', 'Türkiye', 'Diğer']

// Allowed array values (whitelist)
const ALLOWED_GUCLU_ALANLAR = ['Backend', 'Frontend', 'Mobile', 'QA / Manual Testing', 'Test Automation', 'DevOps / CI-CD', 'Data / BI', 'AI / ML', 'Cloud', 'Security', 'Product / Project', 'UI/UX']
const ALLOWED_PROGRAMLAMA_DILLERI = ['JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'Go', 'PHP', 'C/C++', 'Kotlin', 'Swift', 'SQL', 'Diğer']
const ALLOWED_FRAMEWORKS = ['React', 'Angular', 'Vue', 'Node.js', '.NET', 'Spring', 'Django', 'FastAPI', 'Flutter', 'React Native']
const ALLOWED_DEVOPS_CLOUD = ['Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Terraform', 'GitHub Actions', 'GitLab CI', 'Jenkins', 'Diğer']
const ALLOWED_ILGI_KONULARI = ['AI araçları / LLM uygulamaları', 'Startup / ürün geliştirme', 'Freelance / danışmanlık', 'Remote çalışma', "Almanya'da kariyer & iş piyasası", 'Networking / event / meetup', 'Side project / hackathon', 'Open-source', 'Sertifika / eğitim', 'Teknik yazı / içerik üretimi']
const ALLOWED_AI_BUILDERS = ['Manus', 'Lovable', 'Bolt.new', 'Vercel v0', 'Replit AI Apps', 'Glide AI', 'Softr AI', 'Bubble AI', 'Builder.ai', 'Draftbit AI', 'FlutterFlow AI', 'Kullanmıyorum']
const ALLOWED_IDE = ['VS Code', 'IntelliJ IDEA', 'PyCharm', 'WebStorm', 'Visual Studio', 'Eclipse', 'Xcode', 'Android Studio', 'Sublime Text', 'Vim / Neovim']
const ALLOWED_AGENTS = ['GitHub Copilot', 'ChatGPT', 'Claude', 'Cursor', 'Windsurf', 'Manus', 'Tabnine', 'Codeium', 'Amazon Q', 'Kullanmıyorum']
const ALLOWED_ISBIRLIGI_TURU = ['Side project (haftada 2–5 saat)', 'Side project (haftada 5–10 saat)', 'Startup kurmak (ciddi)', 'MVP çıkarma ekibi (tasarım+dev+test)', 'Freelance ekip kurmak (ücretli)', 'Açık kaynak proje', 'Study group (system design, leetcode vb.)', 'Mentorluk / koçluk', 'Sadece tanışma & network']

// Sanitize string input
function sanitize(str: string | null | undefined, maxLength = 500): string | null {
  if (!str) return null
  const cleaned = str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim()
  return cleaned.substring(0, maxLength)
}

// Sanitize array items
function sanitizeArray(arr: any[], allowedValues: string[], maxItems = 20): string[] {
  if (!Array.isArray(arr)) return []
  return arr
    .filter((item) => typeof item === 'string')
    .map((item) => item.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim())
    .filter((item) => item.length > 0 && item.length <= 100)
    .filter((item) => allowedValues.length === 0 || allowedValues.includes(item))
    .slice(0, maxItems)
}

// Normalize phone number
function normalizePhone(phone: string): string {
  let normalized = phone.trim()
  const hasPlus = normalized.startsWith('+')
  normalized = normalized.replace(/\D/g, '')
  if (hasPlus && normalized.length > 0) {
    normalized = '+' + normalized
  }
  return normalized
}

function normalizeOrigin(origin: string | null): string | null {
  if (!origin) return null
  try {
    const parsed = new URL(origin)
    return `${parsed.protocol}//${parsed.host}`.toLowerCase()
  } catch {
    return null
  }
}

function isAllowedOrigin(origin: string | null): boolean {
  const normalized = normalizeOrigin(origin)
  if (!normalized) return false
  return ALLOWED_ORIGIN_SET.has(normalized)
}

function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get('x-forwarded-for')
  const realIp = req.headers.get('x-real-ip')
  const firstForwardedIp = forwardedFor?.split(',')[0]?.trim()
  return (firstForwardedIp || realIp || 'unknown').slice(0, 100)
}

function buildCorsHeaders(origin: string | null): Record<string, string> {
  const normalized = normalizeOrigin(origin)
  const allowOrigin = normalized && ALLOWED_ORIGIN_SET.has(normalized)
    ? normalized
    : ALLOWED_ORIGINS[0]

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    Vary: 'Origin',
  }
}

function jsonResponse(
  body: Record<string, unknown>,
  status: number,
  corsHeaders: Record<string, string>
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}

// Check rate limit
function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW })
    return true
  }

  if (record.count >= RATE_LIMIT) {
    return false
  }

  record.count++
  return true
}

// Validate URL format
function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' || parsed.protocol === 'http:'
  } catch {
    return false
  }
}

// Validate LinkedIn URL specifically
function isValidLinkedInUrl(url: string): boolean {
  if (!isValidUrl(url)) return false
  try {
    const urlObj = new URL(url)
    const hostname = urlObj.hostname.toLowerCase()
    return hostname === 'linkedin.com' || hostname === 'www.linkedin.com' || hostname.endsWith('.linkedin.com')
  } catch {
    return false
  }
}

// Validate phone number (basic check)
function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+|00)?[1-9]\d{1,14}$/
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))
}

// Validate required fields
function validateRegistration(body: Record<string, any>): { valid: boolean; error?: string } {
  const allowedFields = [
    'ad_soyad', 'linkedin_url', 'whatsapp_tel', 'yasam_yeri', 'yasam_yeri_diger', 'sehir', 'rol',
    'deneyim_seviye', 'aktif_kod', 'guclu_alanlar', 'acik_kaynak', 'kendi_proje', 'proje_link',
    'programlama_dilleri', 'framework_platformlar', 'devops_cloud', 'ilgi_konular', 'ogrenmek_istenen',
    'is_arama_durumu', 'ai_app_builders', 'freelance_aciklik', 'gonullu_proje', 'katilma_amaci',
    'isbirligi_turu', 'profesyonel_destek_verebilir', 'profesyonel_destek_almak', 'aratilabilir',
    'iletisim_izni', 'kullanilan_ide', 'kullanilan_agent', 'ek_notlar', 'veri_paylasim_onay'
  ]

  const bodyFields = Object.keys(body)
  const extraFields = bodyFields.filter((f) => !allowedFields.includes(f))
  if (extraFields.length > 0) {
    return { valid: false, error: 'Geçersiz alanlar tespit edildi' }
  }

  if (!body.ad_soyad || typeof body.ad_soyad !== 'string' || body.ad_soyad.trim().length < 2) {
    return { valid: false, error: 'Ad soyad en az 2 karakter olmalıdır' }
  }
  if (body.ad_soyad.trim().length > 100) {
    return { valid: false, error: 'Ad soyad çok uzun' }
  }

  if (!body.sehir || typeof body.sehir !== 'string' || body.sehir.trim().length < 2) {
    return { valid: false, error: 'Şehir bilgisi gereklidir' }
  }
  if (body.sehir.trim().length > 100) {
    return { valid: false, error: 'Şehir adı çok uzun' }
  }

  if (!body.rol || !ALLOWED_ROL_VALUES.includes(body.rol)) {
    return { valid: false, error: 'Geçersiz rol seçimi' }
  }

  if (!body.deneyim_seviye || !ALLOWED_DENEYIM_VALUES.includes(body.deneyim_seviye)) {
    return { valid: false, error: 'Geçersiz deneyim seviyesi' }
  }

  if (!body.is_arama_durumu || !ALLOWED_IS_ARAMA_VALUES.includes(body.is_arama_durumu)) {
    return { valid: false, error: 'Geçersiz iş arama durumu' }
  }

  if (!body.freelance_aciklik || !ALLOWED_FREELANCE_VALUES.includes(body.freelance_aciklik)) {
    return { valid: false, error: 'Geçersiz freelance açıklık durumu' }
  }

  if (!body.katilma_amaci || !ALLOWED_KATILMA_AMACI_VALUES.includes(body.katilma_amaci)) {
    return { valid: false, error: 'Geçersiz katılma amacı' }
  }

  if (body.yasam_yeri && !ALLOWED_YASAM_YERI_VALUES.includes(body.yasam_yeri)) {
    return { valid: false, error: 'Geçersiz yaşam yeri' }
  }

  const booleanFields = [
    'aktif_kod', 'acik_kaynak', 'kendi_proje', 'gonullu_proje',
    'profesyonel_destek_verebilir', 'profesyonel_destek_almak',
    'aratilabilir', 'iletisim_izni', 'veri_paylasim_onay'
  ]

  for (const field of booleanFields) {
    if (body[field] !== undefined && body[field] !== null) {
      if (typeof body[field] !== 'boolean') {
        return { valid: false, error: `Geçersiz ${field} değeri` }
      }
    }
  }

  if (body.aratilabilir !== true && body.aratilabilir !== false) {
    return { valid: false, error: 'Aratılabilirlik tercihi gereklidir' }
  }
  if (body.iletisim_izni !== true && body.iletisim_izni !== false) {
    return { valid: false, error: 'İletişim izni tercihi gereklidir' }
  }
  if (body.veri_paylasim_onay !== true) {
    return { valid: false, error: 'Veri paylaşım onayı gereklidir' }
  }

  if (body.linkedin_url && !isValidLinkedInUrl(body.linkedin_url)) {
    return { valid: false, error: 'Geçersiz LinkedIn URL formatı (linkedin.com domaini olmalıdır)' }
  }

  if (body.whatsapp_tel) {
    const normalizedPhone = normalizePhone(body.whatsapp_tel)
    if (!isValidPhone(normalizedPhone)) {
      return { valid: false, error: 'Geçersiz telefon numarası formatı' }
    }
  }

  if (body.proje_link && !isValidUrl(body.proje_link)) {
    return { valid: false, error: 'Geçersiz proje linki formatı' }
  }

  if (body.guclu_alanlar && !Array.isArray(body.guclu_alanlar)) {
    return { valid: false, error: 'Geçersiz güçlü alanlar formatı' }
  }
  if (body.programlama_dilleri && !Array.isArray(body.programlama_dilleri)) {
    return { valid: false, error: 'Geçersiz programlama dilleri formatı' }
  }

  return { valid: true }
}

serve(async (req: Request) => {
  const origin = req.headers.get('origin')
  const hasOriginHeader = !!origin
  const corsHeaders = buildCorsHeaders(origin)
  const allowedOrigin = hasOriginHeader ? isAllowedOrigin(origin) : true

  if (req.method === 'OPTIONS') {
    if (!allowedOrigin) {
      return jsonResponse({ error: 'Unauthorized origin' }, 403, corsHeaders)
    }
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405, corsHeaders)
  }

  if (!allowedOrigin) {
    return jsonResponse({ error: 'Unauthorized origin' }, 403, corsHeaders)
  }

  const clientIP = getClientIp(req)
  if (!checkRateLimit(clientIP)) {
    return jsonResponse({ error: 'Çok fazla istek. Lütfen daha sonra tekrar deneyin.' }, 429, corsHeaders)
  }

  try {
    const contentType = (req.headers.get('content-type') || '').toLowerCase()
    if (!contentType.includes('application/json')) {
      return jsonResponse({ error: 'Content-Type application/json olmalıdır' }, 415, corsHeaders)
    }

    const rawBody = await req.text()
    if (rawBody.length > MAX_BODY_SIZE) {
      return jsonResponse({ error: 'İstek boyutu çok büyük' }, 413, corsHeaders)
    }

    let body: Record<string, any>
    try {
      body = rawBody ? JSON.parse(rawBody) : {}
    } catch {
      return jsonResponse({ error: 'Geçersiz JSON gövdesi' }, 400, corsHeaders)
    }

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return jsonResponse({ error: 'Geçersiz istek formatı' }, 400, corsHeaders)
    }

    const validation = validateRegistration(body)
    if (!validation.valid) {
      return jsonResponse({ error: validation.error || 'Geçersiz veri' }, 400, corsHeaders)
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return jsonResponse({ error: 'Service not configured' }, 503, corsHeaders)
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    const normalizedPhone = body.whatsapp_tel ? normalizePhone(body.whatsapp_tel) : null

    if (body.linkedin_url) {
      const { data: existingLinkedIn } = await supabase
        .from('devuser')
        .select('id')
        .eq('linkedin_url', body.linkedin_url)
        .maybeSingle()

      if (existingLinkedIn) {
        return jsonResponse({ error: 'Bu LinkedIn profili zaten kayıtlı' }, 409, corsHeaders)
      }
    }

    if (normalizedPhone) {
      const { data: existingPhone } = await supabase
        .from('devuser')
        .select('id')
        .eq('whatsapp_tel', normalizedPhone)
        .maybeSingle()

      if (existingPhone) {
        return jsonResponse({ error: 'Bu telefon numarası zaten kayıtlı' }, 409, corsHeaders)
      }
    }

    const { data: recentSameName } = await supabase
      .from('devuser')
      .select('id')
      .eq('ad_soyad', body.ad_soyad)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .maybeSingle()

    if (recentSameName) {
      return jsonResponse({ error: 'Bu isimle son 24 saat içinde kayıt yapılmış. Farklı bir isim kullanın veya daha sonra tekrar deneyin.' }, 409, corsHeaders)
    }

    const insertData = {
      ad_soyad: sanitize(body.ad_soyad, 100),
      linkedin_url: body.linkedin_url ? sanitize(body.linkedin_url, 500) : null,
      whatsapp_tel: normalizedPhone,
      yasam_yeri: ALLOWED_YASAM_YERI_VALUES.includes(body.yasam_yeri) ? body.yasam_yeri : null,
      yasam_yeri_diger: body.yasam_yeri === 'Diğer' ? sanitize(body.yasam_yeri_diger, 100) : null,
      sehir: sanitize(body.sehir, 100),
      rol: ALLOWED_ROL_VALUES.includes(body.rol) ? body.rol : null,
      deneyim_seviye: ALLOWED_DENEYIM_VALUES.includes(body.deneyim_seviye) ? body.deneyim_seviye : null,
      aktif_kod: body.aktif_kod === true,
      guclu_alanlar: sanitizeArray(body.guclu_alanlar, ALLOWED_GUCLU_ALANLAR, 12),
      acik_kaynak: body.acik_kaynak === true,
      kendi_proje: body.kendi_proje === true,
      proje_link: body.proje_link ? sanitize(body.proje_link, 500) : null,
      programlama_dilleri: sanitizeArray(body.programlama_dilleri, ALLOWED_PROGRAMLAMA_DILLERI, 12),
      framework_platformlar: sanitizeArray(body.framework_platformlar, ALLOWED_FRAMEWORKS, 10),
      devops_cloud: sanitizeArray(body.devops_cloud, ALLOWED_DEVOPS_CLOUD, 10),
      ilgi_konular: sanitizeArray(body.ilgi_konular, ALLOWED_ILGI_KONULARI, 10),
      ogrenmek_istenen: sanitizeArray(body.ogrenmek_istenen, [], 16),
      is_arama_durumu: ALLOWED_IS_ARAMA_VALUES.includes(body.is_arama_durumu) ? body.is_arama_durumu : null,
      ai_app_builders: sanitizeArray(body.ai_app_builders, ALLOWED_AI_BUILDERS, 12),
      freelance_aciklik: ALLOWED_FREELANCE_VALUES.includes(body.freelance_aciklik) ? body.freelance_aciklik : null,
      gonullu_proje: body.gonullu_proje === true,
      katilma_amaci: ALLOWED_KATILMA_AMACI_VALUES.includes(body.katilma_amaci) ? body.katilma_amaci : null,
      isbirligi_turu: sanitizeArray(body.isbirligi_turu, ALLOWED_ISBIRLIGI_TURU, 9),
      profesyonel_destek_verebilir: body.profesyonel_destek_verebilir === true,
      profesyonel_destek_almak: body.profesyonel_destek_almak === true,
      aratilabilir: body.aratilabilir === true,
      iletisim_izni: body.iletisim_izni === true,
      kullanilan_ide: sanitizeArray(body.kullanilan_ide, ALLOWED_IDE, 10),
      kullanilan_agent: sanitizeArray(body.kullanilan_agent, ALLOWED_AGENTS, 10),
      ek_notlar: sanitize(body.ek_notlar, 500),
      veri_paylasim_onay: body.veri_paylasim_onay === true,
    }

    const { data, error } = await supabase
      .from('devuser')
      .insert([insertData])
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return jsonResponse({ error: 'Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.' }, 500, corsHeaders)
    }

    return jsonResponse(
      {
        success: true,
        message: 'Kayıt başarıyla tamamlandı!',
        id: data.id,
      },
      200,
      corsHeaders
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return jsonResponse({ error: 'Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.' }, 500, corsHeaders)
  }
})
