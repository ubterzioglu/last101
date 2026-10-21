import { NextResponse } from 'next/server';
import { withAdmin } from '@/lib/admin/withAuth';
import { tryCreateServiceClient } from '@/lib/supabase/admin';
import { buildIlikeOrFilter } from '@/lib/news/search';
import type { SupabaseClient } from '@supabase/supabase-js';

const ALLOWED_STATUSES = new Set(['all', 'pending', 'approved', 'rejected']);
const ALLOWED_TYPES = new Set([
  'all',
  'doctor',
  'lawyer',
  'terapist',
  'ebe',
  'nakliyat',
  'sigorta',
  'vergi_danismani',
  'berber',
  'kuafor',
  'surucu_kursu',
  'tamirci_otomobil',
  'tamirci_tesisat',
  'tamirci_boyaci',
]);

function normalizeStatus(value: unknown) {
  const safe = String(value || 'all').trim().toLowerCase();
  return ALLOWED_STATUSES.has(safe) ? safe : 'all';
}

function normalizeType(value: unknown) {
  const safe = String(value || 'all').trim();
  return ALLOWED_TYPES.has(safe) ? safe : 'all';
}

function normalizeLimit(value: unknown) {
  const parsed = Number.parseInt(String(value || ''), 10);
  if (!Number.isFinite(parsed)) return 200;
  return Math.min(Math.max(parsed, 1), 500);
}

function normalizeSearch(value: unknown) {
  return String(value || '').trim().slice(0, 120);
}

async function countRows(supabase: SupabaseClient, status: string, type: string) {
  let query = supabase.from('provider_submissions').select('id', { count: 'exact', head: true });
  if (status !== 'all') query = query.eq('status', status);
  if (type !== 'all') query = query.eq('type', type);
  const { count, error } = await query;
  if (error) throw error;
  return Number(count || 0);
}

export const GET = withAdmin(async (request) => {
  const supabase = tryCreateServiceClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Service not configured' }, { status: 503 });
  }

  const searchParams = request.nextUrl.searchParams;
  const status = normalizeStatus(searchParams.get('status'));
  const type = normalizeType(searchParams.get('type'));
  const limit = normalizeLimit(searchParams.get('limit'));
  const search = normalizeSearch(searchParams.get('q'));

  try {
    let query = supabase
      .from('provider_submissions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (status !== 'all') query = query.eq('status', status);
    if (type !== 'all') query = query.eq('type', type);
    if (search) {
      query = query.or(buildIlikeOrFilter(['display_name', 'city', 'note'], search));
    }

    const [{ data, error }, total, pending, approved, rejected] = await Promise.all([
      query,
      countRows(supabase, 'all', type),
      countRows(supabase, 'pending', type),
      countRows(supabase, 'approved', type),
      countRows(supabase, 'rejected', type),
    ]);

    if (error) throw error;

    return NextResponse.json({
      ok: true,
      items: Array.isArray(data) ? data : [],
      stats: { total, pending, approved, rejected },
    });
  } catch (error) {
    console.error('provider-submissions-admin-list failed:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
});

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
