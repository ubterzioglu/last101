import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';

function sanitizeString(value: unknown, maxLength = 500): string | null {
  if (typeof value !== 'string') return null;
  const cleaned = value.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim();
  return cleaned ? cleaned.slice(0, maxLength) : null;
}

function sanitizeArray(value: unknown, maxItems = 20): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => typeof item === 'string')
    .map((item) => item.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim())
    .filter(Boolean)
    .slice(0, maxItems);
}

function toBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    if (value === 'true') return true;
    if (value === 'false') return false;
  }
  return fallback;
}

function normalizePhone(phone: unknown): string | null {
  if (typeof phone !== 'string') return null;
  const raw = phone.trim();
  if (!raw) return null;
  const hasPlus = raw.startsWith('+');
  const digits = raw.replace(/\D/g, '');
  if (!digits) return null;
  return hasPlus ? `+${digits}` : digits;
}

function isValidLinkedInUrl(rawUrl: string | null): boolean {
  if (!rawUrl) return true;
  try {
    const url = new URL(rawUrl);
    const hostname = url.hostname.toLowerCase();
    const isLinkedInHost =
      hostname === 'linkedin.com' ||
      hostname === 'www.linkedin.com' ||
      hostname.endsWith('.linkedin.com');
    return isLinkedInHost && (url.protocol === 'https:' || url.protocol === 'http:');
  } catch {
    return false;
  }
}

function isValidGenericUrl(rawUrl: string | null): boolean {
  if (!rawUrl) return true;
  try {
    const url = new URL(rawUrl);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

function deriveDisplayName(rawName: string | null, email: string): string {
  if (rawName && rawName.length >= 2) return rawName;
  const emailLocal = email.split('@')[0].replace(/[._-]+/g, ' ').trim();
  const fromEmail = sanitizeString(emailLocal, 100);
  if (fromEmail && fromEmail.length >= 2) return fromEmail;
  return 'DevUser';
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function POST(request: NextRequest) {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'Service not configured' }, { status: 503 });
  }

  // Verify caller is authenticated
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const loginEmail = (user.email ?? '').toLowerCase();
  if (!loginEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail)) {
    return NextResponse.json({ error: 'Geçerli bir Supabase hesap email adresi gerekli' }, { status: 400 });
  }

  const providedAdSoyad = sanitizeString(body.ad_soyad, 100);
  const adSoyad = deriveDisplayName(providedAdSoyad, loginEmail);
  const linkedinUrl = sanitizeString(body.linkedin_url, 500);
  const projeLink = sanitizeString(body.proje_link, 500);
  const rawPhone = sanitizeString(body.whatsapp_tel, 40);

  const insertData: Record<string, unknown> = {
    user_id: user.id,
    login_email: loginEmail,
    ad_soyad: adSoyad,
    linkedin_url: isValidLinkedInUrl(linkedinUrl) ? linkedinUrl : null,
    whatsapp_tel: normalizePhone(rawPhone),
    almanya_yasam: body.yasam_yeri === 'Almanya',
    sehir: sanitizeString(body.sehir, 100),
    rol: sanitizeString(body.rol, 80),
    deneyim_seviye: sanitizeString(body.deneyim_seviye, 80),
    aktif_kod: toBoolean(body.aktif_kod, false),
    guclu_alanlar: sanitizeArray(body.guclu_alanlar, 16),
    acik_kaynak: toBoolean(body.acik_kaynak, false),
    kendi_proje: toBoolean(body.kendi_proje, false),
    proje_link: isValidGenericUrl(projeLink) ? projeLink : null,
    programlama_dilleri: sanitizeArray(body.programlama_dilleri, 16),
    framework_platformlar: sanitizeArray(body.framework_platformlar, 16),
    devops_cloud: sanitizeArray(body.devops_cloud, 16),
    ilgi_konular: sanitizeArray(body.ilgi_konular, 16),
    ogrenmek_istenen: sanitizeArray(body.ogrenmek_istenen, 20),
    is_arama_durumu: sanitizeString(body.is_arama_durumu, 80),
    ai_app_builders: sanitizeArray(body.ai_app_builders, 16),
    freelance_aciklik: sanitizeString(body.freelance_aciklik, 80),
    gonullu_proje: toBoolean(body.gonullu_proje, false),
    katilma_amaci: sanitizeString(body.katilma_amaci, 80),
    isbirligi_turu: sanitizeArray(body.isbirligi_turu, 16),
    profesyonel_destek_verebilir: toBoolean(body.profesyonel_destek_verebilir, false),
    profesyonel_destek_almak: toBoolean(body.profesyonel_destek_almak, false),
    aratilabilir: toBoolean(body.aratilabilir, false),
    iletisim_izni: toBoolean(body.iletisim_izni, false),
    kullanilan_ide: sanitizeArray(body.kullanilan_ide, 16),
    kullanilan_agent: sanitizeArray(body.kullanilan_agent, 16),
    ek_notlar: sanitizeString(body.ek_notlar, 500),
    veri_paylasim_onay: toBoolean(body.veri_paylasim_onay, false),
    approval_status: 'pending',
  };

  const service = createServiceClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    const { data, error } = await service
      .from('devuser')
      .insert([insertData])
      .select('id')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Kayıt alındı. Admin onayından sonra listeye erişebilirsiniz.',
      id: data?.id ?? null,
    });
  } catch (err) {
    console.error('devuser-register failed:', err);
    return NextResponse.json({ error: 'Beklenmeyen bir hata oluştu.' }, { status: 500 });
  }
}
