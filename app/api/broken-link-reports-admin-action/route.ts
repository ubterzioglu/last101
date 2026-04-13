import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminKey } from '@/lib/admin/serverAuth';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const adminKey = request.headers.get('x-admin-key');

    if (!adminKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await verifyAdminKey(adminKey);

    const body = await request.json();
    const { action, id } = body;

    if (action === 'delete') {
      const { error } = await supabase
        .from('broken_link_reports')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting report:', error);
        return NextResponse.json({ error: 'Rapor silinemedi' }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Geçersiz işlem' }, { status: 400 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
