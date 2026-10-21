import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Herkese açık rapor formu anon key ile yazar (RLS: "Anyone can insert"). Client istek anında
// oluşturulur; env eksikse modül yüklenirken çökmek (ve build'i kırmak) yerine 503 döner.
// Anon rol tabloyu okuyamaz (raporlar yalnızca admin/service role'e açık); bu yüzden insert sonrası
// select yapılmaz.

const MAX_AGENCY_ID_LENGTH = 100;
const MAX_AGENCY_NAME_LENGTH = 200;
const MAX_REPORT_TEXT_LENGTH = 2000;

function readText(value: unknown, maxLength: number): string | null {
  if (typeof value !== 'string') return null;
  const text = value.trim();
  return text && text.length <= maxLength ? text : null;
}

function createAnonClient() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function POST(request: NextRequest) {
  const supabase = createAnonClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Servis şu anda kullanılamıyor' }, { status: 503 });
  }

  try {
    const body = await request.json();
    const agencyName = readText(body?.agencyName, MAX_AGENCY_NAME_LENGTH);
    const reportText = readText(body?.reportText, MAX_REPORT_TEXT_LENGTH);
    const agencyId = body?.agencyId == null ? null : readText(String(body.agencyId), MAX_AGENCY_ID_LENGTH);

    if (!agencyName || !reportText) {
      return NextResponse.json(
        { error: `Ajans adı (en fazla ${MAX_AGENCY_NAME_LENGTH} karakter) ve rapor metni (en fazla ${MAX_REPORT_TEXT_LENGTH} karakter) zorunludur` },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('broken_link_reports')
      .insert({
        agency_id: agencyId,
        agency_name: agencyName,
        report_text: reportText,
      });

    if (error) {
      console.error('Error creating report:', error);
      return NextResponse.json(
        { error: 'Rapor oluşturulamadı' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}
