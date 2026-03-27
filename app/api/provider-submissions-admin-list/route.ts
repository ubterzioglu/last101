import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isAdminAuthorized } from '@/lib/admin/adminAuth';

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

function normalizeEnvValue(value: unknown): string {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
    return raw.slice(1, -1).trim();
  }
  return raw;
}

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

async function countRows(supabase: any, status: string, type: string) {
  let query = supabase.from('provider_submissions').select('id', { count: 'exact', head: true });
  if (status !== 'all') query = query.eq('status', status);
  if (type !== 'all') query = query.eq('type', type);
  const { count, error } = await query;
  if (error) throw error;
  return Number(count || 0);
}

export async function GET(request: NextRequest) {
  const auth = await isAdminAuthorized(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.reason }, { status: auth.status });
  }

  const supabaseUrl = normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const serviceRoleKey = normalizeEnvValue(
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_SERVICE_KEY ||
      process.env.SUPABASE_SECRET_KEY ||
      ''
  );

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: 'Service not configured' }, { status: 503 });
  }

  const searchParams = request.nextUrl.searchParams;
  const status = normalizeStatus(searchParams.get('status'));
  const type = normalizeType(searchParams.get('type'));
  const limit = normalizeLimit(searchParams.get('limit'));
  const search = normalizeSearch(searchParams.get('q'));

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  try {
    let query = supabase
      .from('provider_submissions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (status !== 'all') query = query.eq('status', status);
    if (type !== 'all') query = query.eq('type', type);
    if (search) {
      query = query.or(
        `display_name.ilike.%${search}%,city.ilike.%${search}%,note.ilike.%${search}%`
      );
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
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
