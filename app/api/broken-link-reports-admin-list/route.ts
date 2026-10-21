import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthorized } from '@/lib/admin/adminAuth';
import { createServiceClient } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  try {
    const authResult = await isAdminAuthorized(request);

    if (!authResult.ok) {
      return NextResponse.json({ error: authResult.reason }, { status: authResult.status });
    }

    const supabase = createServiceClient();
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';

    let query = supabase
      .from('broken_link_reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (search) {
      query = query.or(`agency_name.ilike.%${search}%,report_text.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching reports:', error);
      return NextResponse.json({ error: 'Raporlar getirilemedi' }, { status: 500 });
    }

    return NextResponse.json({ reports: data || [] });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
