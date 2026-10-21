import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Herkese açık rapor formu anon key ile yazar (RLS: "Anyone can insert"). Client istek anında
// oluşturulur; env eksikse modül yüklenirken çökmek (ve build'i kırmak) yerine 503 döner.
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
    const { agencyId, agencyName, reportText } = body;

    if (!agencyName || !reportText) {
      return NextResponse.json(
        { error: 'Ajans adı ve rapor metni zorunludur' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('broken_link_reports')
      .insert({
        agency_id: agencyId,
        agency_name: agencyName,
        report_text: reportText,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating report:', error);
      return NextResponse.json(
        { error: 'Rapor oluşturulamadı' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}
