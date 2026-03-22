import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isAdminAuthorized } from '@/lib/admin/adminAuth';

const ALLOWED_STATUSES = new Set(['pending', 'approved', 'rejected']);

function normalizeStatus(value: unknown): string {
  if (typeof value !== 'string') return 'all';
  const normalized = value.trim().toLowerCase();
  return ALLOWED_STATUSES.has(normalized) ? normalized : 'all';
}

function normalizeLimit(value: unknown): number {
  const parsed = Number.parseInt(String(value || ''), 10);
  if (!Number.isFinite(parsed) || parsed < 1) return 200;
  return Math.min(parsed, 1000);
}

function extractErrorMessage(error: unknown): string {
  if (!error) return '';
  const e = error as Record<string, unknown>;
  return String(e.message || e.details || e.hint || '').toLowerCase();
}

function normalizeRowStatus(row: Record<string, unknown>): string {
  const status = String(row?.approval_status || 'pending').toLowerCase();
  if (ALLOWED_STATUSES.has(status)) return status;
  return 'pending';
}

type QueryOptions = { applyStatusFilter: boolean; orderByCreatedAt: boolean };
type SupabaseClient = any;

async function runQueryWithFallback({
  baseQueryFactory,
  status,
}: {
  baseQueryFactory: (opts: QueryOptions) => Promise<{ data: unknown; error: unknown; count: unknown }>;
  status: string;
}) {
  let orderByCreatedAt = true;
  let result = await baseQueryFactory({
    applyStatusFilter: status !== 'all',
    orderByCreatedAt,
  });

  if (result.error) {
    const firstMessage = extractErrorMessage(result.error);
    const createdAtColumnMissing = firstMessage.includes('created_at') && firstMessage.includes('column');
    if (createdAtColumnMissing) {
      orderByCreatedAt = false;
      result = await baseQueryFactory({
        applyStatusFilter: status !== 'all',
        orderByCreatedAt,
      });
    }
  }

  if (!result.error) return result;

  const message = extractErrorMessage(result.error);
  const approvalColumnMissing = message.includes('approval_status') && message.includes('column');
  if (!approvalColumnMissing) return result;

  result = await baseQueryFactory({
    applyStatusFilter: false,
    orderByCreatedAt,
  });

  if (result.error && orderByCreatedAt) {
    const retryMessage = extractErrorMessage(result.error);
    const createdAtColumnMissing = retryMessage.includes('created_at') && retryMessage.includes('column');
    if (createdAtColumnMissing) {
      result = await baseQueryFactory({
        applyStatusFilter: false,
        orderByCreatedAt: false,
      });
    }
  }

  if (result.error) return result;

  const rows = Array.isArray(result.data) ? result.data : [];
  const rowsWithStatus = (rows as Record<string, unknown>[]).map((row) => ({ ...row, approval_status: normalizeRowStatus(row) }));
  const filteredRows =
    status === 'all'
      ? rowsWithStatus
      : rowsWithStatus.filter((row) => normalizeRowStatus(row) === status);

  return {
    ...result,
    data: filteredRows,
    count: filteredRows.length,
  };
}

export async function GET(request: NextRequest) {
  const auth = await isAdminAuthorized(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.reason }, { status: auth.status });
  }

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'Service not configured' }, { status: 503 });
  }

  const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  try {
    const searchParams = request.nextUrl.searchParams;
    const id = (searchParams.get('id') || '').trim();
    const status = normalizeStatus(searchParams.get('status'));
    const limit = normalizeLimit(searchParams.get('limit'));

    const baseQueryFactory = async ({ applyStatusFilter, orderByCreatedAt }: QueryOptions) => {
      let query = supabase
        .from('devuser')
        .select('*', { count: 'exact' })
        .limit(limit);

      if (orderByCreatedAt) {
        query = query.order('created_at', { ascending: false });
      }

      if (id) {
        query = query.eq('id', id);
      } else if (applyStatusFilter && status !== 'all') {
        query = query.eq('approval_status', status);
      }

      return query;
    };

    const { data, error, count } = await runQueryWithFallback({
      baseQueryFactory,
      status,
    });
    if (error) throw error;

    return NextResponse.json({
      data: data || [],
      count: Number(count || 0),
    });
  } catch (error) {
    console.error('devuser-admin-list failed:', error);
    const e = error as Error;
    return NextResponse.json({ error: e.message || 'Internal server error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
