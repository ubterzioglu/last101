import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminKey } from '@/lib/admin/serverAuth';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const adminKey = request.headers.get('x-admin-key');

    if (!adminKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await verifyAdminKey(adminKey);

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
