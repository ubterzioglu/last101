import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthorized } from '@/lib/admin/adminAuth';
import { isUuid, normalizeFounderStatus, sanitizeText } from '@/lib/founder';
import { tryCreateServiceClient } from '@/lib/supabase/admin';

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function POST(request: NextRequest) {
  const auth = await isAdminAuthorized(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.reason }, { status: auth.status });
  }

  const supabase = tryCreateServiceClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Service not configured' }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Geçersiz istek gövdesi.' }, { status: 400 });
  }

  const id = String(body.id || '').trim();
  const action = String(body.action || '').trim().toLowerCase();
  const adminComment = sanitizeText(body.admin_comment, 600);

  if (!isUuid(id)) {
    return NextResponse.json({ error: 'Geçersiz kayıt kimliği.' }, { status: 400 });
  }

  try {
    if (action === 'delete') {
      const { error } = await supabase.from('founder_submissions').delete().eq('id', id);
      if (error) throw error;
      return NextResponse.json({ ok: true });
    }

    const nextStatus =
      action === 'approve'
        ? 'approved'
        : action === 'reject'
          ? 'rejected'
          : action === 'pending'
            ? 'pending'
            : normalizeFounderStatus(action);
    if (!['pending', 'approved', 'rejected'].includes(nextStatus)) {
      return NextResponse.json({ error: 'Geçersiz işlem.' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('founder_submissions')
      .update({
        status: nextStatus,
        admin_comment: adminComment || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('id, status')
      .single();

    if (error) throw error;
    return NextResponse.json({ ok: true, item: data });
  } catch (error) {
    console.error('founder-submissions-admin-action POST failed:', error);
    return NextResponse.json({ error: (error as Error)?.message || 'İşlem başarısız.' }, { status: 500 });
  }
}
