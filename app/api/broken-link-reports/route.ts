import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
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
