// DevUser List API - Onaylı kullanıcıları listeler
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const PUBLIC_SELECT = [
  'id', 'ad_soyad', 'sehir', 'rol', 'deneyim_seviye', 'aktif_kod',
  'guclu_alanlar', 'programlama_dilleri', 'framework_platformlar',
  'devops_cloud', 'ilgi_konular', 'ogrenmek_istenen', 'is_arama_durumu',
  'freelance_aciklik', 'katilma_amaci', 'isbirligi_turu',
  'profesyonel_destek_verebilir', 'profesyonel_destek_almak',
  'linkedin_url', 'whatsapp_tel', 'iletisim_izni', 'created_at',
].join(',');

function sanitizeUserRows(rows: any[] = []) {
  return rows.map((user) => ({
    ...user,
    linkedin_url: user?.iletisim_izni ? user?.linkedin_url : null,
    whatsapp_tel: user?.iletisim_izni ? user?.whatsapp_tel : null,
  }));
}

function keywordMatch(user: any, keyword: string): boolean {
  if (!keyword) return true;
  const haystack = [
    user.ad_soyad, user.sehir, user.rol, user.deneyim_seviye,
    ...(user.guclu_alanlar || []),
    ...(user.programlama_dilleri || []),
    ...(user.framework_platformlar || []),
  ].join(' ').toLowerCase();
  return keyword.split(/[\s,]+/).every((token) => haystack.includes(token.trim()));
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '200'), 1000);
    const keyword = searchParams.get('q')?.trim().toLowerCase() || '';
    
    const { data: rows, error } = await supabase
      .from('devuser')
      .select(PUBLIC_SELECT)
      .eq('aratilabilir', true)
      .eq('approval_status', 'approved')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
    }
    
    const sanitized = sanitizeUserRows(rows || []);
    const filtered = keyword ? sanitized.filter((row) => keywordMatch(row, keyword)) : sanitized;
    
    return NextResponse.json({ data: filtered }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500, headers: corsHeaders });
  }
}
