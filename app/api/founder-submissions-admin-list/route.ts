import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthorized } from '@/lib/admin/adminAuth';
import { normalizeFounderStatus } from '@/lib/founder';
import { tryCreateServiceClient } from '@/lib/supabase/admin';

function parseLimit(value: unknown, fallback = 300): number {
  const parsed = Number.parseInt(String(value || ''), 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(Math.max(parsed, 1), 1000);
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function GET(request: NextRequest) {
  const auth = await isAdminAuthorized(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.reason }, { status: auth.status });
  }

  const supabase = tryCreateServiceClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Service not configured' }, { status: 503 });
  }

  const limit = parseLimit(request.nextUrl.searchParams.get('limit'));
  const statusFilter = String(request.nextUrl.searchParams.get('status') || 'all').trim().toLowerCase();
  const search = String(request.nextUrl.searchParams.get('q') || '').trim().toLowerCase();

  try {
    const { data, error } = await supabase
      .from('founder_submissions')
      .select('id, full_name, linkedin_url, whatsapp, phone, project_name, project_url, short_description, status, admin_comment, created_at, updated_at')
      .order('created_at', { ascending: false })
      .limit(2000);

    if (error) throw error;

    let items = Array.isArray(data) ? data : [];
    if (statusFilter !== 'all') {
      items = items.filter((item) => normalizeFounderStatus(item.status) === statusFilter);
    }
    if (search) {
      items = items.filter((item) =>
        [
          item.full_name,
          item.whatsapp,
          item.phone,
          item.project_name,
          item.project_url,
          item.short_description,
          item.linkedin_url,
        ]
          .map((value) => String(value || '').toLowerCase())
          .some((value) => value.includes(search))
      );
    }

    const allItems = Array.isArray(data) ? data : [];
    const stats = {
      total: allItems.length,
      pending: allItems.filter((item) => normalizeFounderStatus(item.status) === 'pending').length,
      approved: allItems.filter((item) => normalizeFounderStatus(item.status) === 'approved').length,
      rejected: allItems.filter((item) => normalizeFounderStatus(item.status) === 'rejected').length,
    };

    return NextResponse.json({ ok: true, items: items.slice(0, limit), stats });
  } catch (error) {
    console.error('founder-submissions-admin-list GET failed:', error);
    return NextResponse.json({ error: (error as Error)?.message || 'Başvurular yüklenemedi.' }, { status: 500 });
  }
}
