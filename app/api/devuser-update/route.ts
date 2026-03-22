import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';

function validateString(value: unknown, maxLength = 500): string | null {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value !== 'string') return null;
  return value.trim().slice(0, maxLength) || null;
}

function validateBoolean(value: unknown): boolean | null {
  if (value === undefined || value === null) return null;
  if (typeof value === 'boolean') return value;
  return null;
}

function validateArray(value: unknown): string[] | null {
  if (value === undefined || value === null) return null;
  if (!Array.isArray(value)) return null;
  return value.filter((i) => typeof i === 'string');
}

function validateUrl(value: unknown): string | null {
  if (!value || typeof value !== 'string' || value === '') return null;
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol)) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function PATCH(request: NextRequest) {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'Service not configured' }, { status: 503 });
  }

  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const service = createServiceClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // Verify profile exists and belongs to this user
  const { data: current } = await service
    .from('devuser')
    .select('id, user_id')
    .eq('user_id', user.id)
    .limit(1)
    .maybeSingle();

  if (!current) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }

  const adSoyad = validateString(body.ad_soyad, 200);
  if (!adSoyad) {
    return NextResponse.json({ error: 'ad_soyad is required' }, { status: 400 });
  }

  const validatedData: Record<string, unknown> = {
    ad_soyad: adSoyad,
    sehir: validateString(body.sehir, 100),
    linkedin_url: validateUrl(body.linkedin_url),
    whatsapp_tel: validateString(body.whatsapp_tel, 40),
    almanya_yasam: validateBoolean(body.almanya_yasam),
    rol: validateString(body.rol, 80),
    deneyim_seviye: validateString(body.deneyim_seviye, 80),
    is_arama_durumu: validateString(body.is_arama_durumu, 80),
    freelance_aciklik: validateString(body.freelance_aciklik, 80),
    katilma_amaci: validateString(body.katilma_amaci, 80),
    guclu_alanlar: validateArray(body.guclu_alanlar),
    programlama_dilleri: validateArray(body.programlama_dilleri),
    framework_platformlar: validateArray(body.framework_platformlar),
    devops_cloud: validateArray(body.devops_cloud),
    ilgi_konular: validateArray(body.ilgi_konular),
    ogrenmek_istenen: validateArray(body.ogrenmek_istenen),
    isbirligi_turu: validateArray(body.isbirligi_turu),
    aktif_kod: validateBoolean(body.aktif_kod),
    acik_kaynak: validateBoolean(body.acik_kaynak),
    kendi_proje: validateBoolean(body.kendi_proje),
    gonullu_proje: validateBoolean(body.gonullu_proje),
    profesyonel_destek_verebilir: validateBoolean(body.profesyonel_destek_verebilir),
    profesyonel_destek_almak: validateBoolean(body.profesyonel_destek_almak),
    aratilabilir: validateBoolean(body.aratilabilir),
    iletisim_izni: validateBoolean(body.iletisim_izni),
    proje_link: validateUrl(body.proje_link),
  };

  try {
    const { data: updated, error } = await service
      .from('devuser')
      .update(validatedData)
      .eq('id', current.id)
      .select('*')
      .maybeSingle();

    if (error) throw error;
    if (!updated) return NextResponse.json({ error: 'Update failed' }, { status: 500 });

    const { login_pin_hash: _h, login_pin_salt: _s, ...safe } = updated as Record<string, unknown>;
    return NextResponse.json({ success: true, data: safe });
  } catch (err) {
    console.error('devuser-update failed:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
