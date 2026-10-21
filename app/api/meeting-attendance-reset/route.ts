import { NextResponse } from 'next/server';
import { withAdmin } from '@/lib/admin/withAuth';
import { tryCreateServiceClient } from '@/lib/supabase/admin';

export const DELETE = withAdmin(async (request) => {
  const supabase = tryCreateServiceClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Service not configured' }, { status: 503 });
  }

  try {
    const { error } = await supabase
      .from('meeting_attendance')
      .delete()
      .not('id', 'is', null); // Delete all records (id is not null)

    if (error) {
      console.error('meeting-attendance-reset delete failed:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, message: 'Tüm kayıtlar başarıyla silindi' });
  } catch (error) {
    console.error('meeting-attendance-reset failed:', error);
    const e = error as Error;
    return NextResponse.json({ error: e.message || 'Reset failed' }, { status: 500 });
  }
});

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
