// Edge Function: get-users
// Purpose: Secure API endpoint for fetching user list with filtering
// Security: strict origin check, rate limiting, field filtering

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const ALLOWED_ORIGINS = [
  'https://almanya101.de',
  'https://www.almanya101.de',
  'http://localhost:3000',
  'http://localhost:5173',
]

const ALLOWED_ORIGIN_SET = new Set(ALLOWED_ORIGINS.map((origin) => origin.toLowerCase()))

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = 60
const RATE_WINDOW = 60 * 1000

const ALLOWED_ROL_VALUES = ['Software Developer', 'QA / Test', 'DevOps', 'Data / AI', 'Product / Project', 'UI/UX', 'Öğrenci', 'Diğer']
const ALLOWED_DENEYIM_VALUES = ['0-1 yıl', '1-3 yıl', '3-5 yıl', '5-10 yıl', '10+ yıl']
const ALLOWED_IS_ARAMA_VALUES = ['Hayır', 'Evet, pasif (fırsat olursa)', 'Evet, aktif', 'Sadece freelance bakıyorum']

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW })
    return true
  }
  if (record.count >= RATE_LIMIT) return false
  record.count++
  return true
}

function sanitizeInput(str: string | null): string | null {
  if (!str) return null
  return str.replace(/\x00/g, '').trim().substring(0, 100)
}

function sanitizeTechInput(str: string | null): string | null {
  if (!str) return null
  return str.replace(/[^a-zA-Z0-9\s\-\.#\+]/g, '').trim().substring(0, 50)
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
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Max-Age': '86400',
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

serve(async (req) => {
  const origin = req.headers.get('origin')
  const corsHeaders = buildCorsHeaders(origin)
  const hasOriginHeader = !!origin
  const allowedOrigin = hasOriginHeader ? isAllowedOrigin(origin) : true

  if (req.method === 'OPTIONS') {
    if (!allowedOrigin) {
      return jsonResponse({ error: 'Unauthorized origin' }, 403, corsHeaders)
    }
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'GET') {
    return jsonResponse({ error: 'Method not allowed' }, 405, corsHeaders)
  }

  if (!allowedOrigin) {
    return jsonResponse({ error: 'Unauthorized origin' }, 403, corsHeaders)
  }

  const clientIP = getClientIp(req)
  if (!checkRateLimit(clientIP)) {
    return jsonResponse({ error: 'Rate limit exceeded' }, 429, corsHeaders)
  }

  try {
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

    const url = new URL(req.url)
    const sehir = sanitizeInput(url.searchParams.get('sehir'))
    const rolRaw = sanitizeInput(url.searchParams.get('rol'))
    const deneyimRaw = sanitizeInput(url.searchParams.get('deneyim'))
    const isAramaRaw = sanitizeInput(url.searchParams.get('is_arama'))
    const techRaw = sanitizeTechInput(url.searchParams.get('tech'))
    const ilgiRaw = sanitizeInput(url.searchParams.get('ilgi'))

    const rol = ALLOWED_ROL_VALUES.includes(rolRaw || '') ? rolRaw : null
    const deneyim = ALLOWED_DENEYIM_VALUES.includes(deneyimRaw || '') ? deneyimRaw : null
    const isArama = ALLOWED_IS_ARAMA_VALUES.includes(isAramaRaw || '') ? isAramaRaw : null
    const tech = techRaw ? techRaw.toLowerCase().replace(/[{}%_]/g, '') : null
    const ilgi = ilgiRaw ? ilgiRaw.toLowerCase().replace(/[{}%_]/g, '') : null

    let page = parseInt(url.searchParams.get('page') || '1', 10)
    let limit = parseInt(url.searchParams.get('limit') || '50', 10)
    if (Number.isNaN(page) || page < 1) page = 1
    if (Number.isNaN(limit) || limit < 1) limit = 50
    limit = Math.min(limit, 100)

    let query = supabase
      .from('devuser')
      .select(
        `
        id, ad_soyad, sehir, rol, deneyim_seviye, aktif_kod, guclu_alanlar,
        programlama_dilleri, framework_platformlar, devops_cloud, ilgi_konular,
        ogrenmek_istenen, is_arama_durumu, ai_app_builders, freelance_aciklik,
        katilma_amaci, isbirligi_turu, profesyonel_destek_verebilir,
        profesyonel_destek_almak, kullanilan_ide, kullanilan_agent,
        linkedin_url, whatsapp_tel, iletisim_izni, created_at
      `,
        { count: 'exact' }
      )
      .eq('aratilabilir', true)
      .eq('approval_status', 'approved')
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (sehir) query = query.ilike('sehir', `%${sehir}%`)
    if (rol) query = query.eq('rol', rol)
    if (deneyim) query = query.eq('deneyim_seviye', deneyim)
    if (isArama) query = query.eq('is_arama_durumu', isArama)
    if (tech) {
      query = query.or(`programlama_dilleri.cs.{${tech}},framework_platformlar.cs.{${tech}},devops_cloud.cs.{${tech}}`)
    }
    if (ilgi) query = query.contains('ilgi_konular', [ilgi])

    const { data, error, count } = await query

    if (error) {
      console.error('Database error:', error)
      return jsonResponse({ error: 'Failed to fetch users' }, 500, corsHeaders)
    }

    const safeData = (data || []).map((user) => ({
      ...user,
      whatsapp_tel: user.iletisim_izni ? user.whatsapp_tel : null,
      iletisim_izni: undefined,
    }))

    return new Response(
      JSON.stringify({
        data: safeData,
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'X-Content-Type-Options': 'nosniff',
        },
      }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return jsonResponse({ error: 'Internal server error' }, 500, corsHeaders)
  }
})
