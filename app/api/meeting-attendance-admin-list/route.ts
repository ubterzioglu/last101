import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isAdminAuthorized } from '@/lib/admin/adminAuth';

function normalizeEnvValue(value: unknown): string {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
    return raw.slice(1, -1).trim();
  }
  return raw;
}

function parseLimit(value: unknown, fallback = 500): number {
  const parsed = Number.parseInt(String(value || ''), 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(Math.max(parsed, 1), 2000);
}

function normalizeDateStats(items: [string, number][]): { date_option: string; vote_count: number }[] {
  return items
    .map(([dateOption, voteCount]) => ({
      date_option: dateOption,
      vote_count: voteCount,
    }))
    .sort((left, right) => {
      if (right.vote_count !== left.vote_count) return right.vote_count - left.vote_count;
      return String(left.date_option).localeCompare(String(right.date_option), 'tr');
    });
}

function buildDateStats(rows: Record<string, unknown>[]): { date_option: string; vote_count: number }[] {
  const counts = new Map<string, number>();

  for (const row of rows) {
    const dates = Array.isArray(row?.available_dates) ? row.available_dates : [];
    for (const value of dates) {
      const dateOption = String(value || '').trim();
      if (!dateOption) continue;
      counts.set(dateOption, Number(counts.get(dateOption) || 0) + 1);
    }
  }

  return normalizeDateStats(Array.from(counts.entries()));
}

function mapQueryError(error: unknown): string {
  const message = String((error as Error)?.message || '').toLowerCase();
  if (
    message.includes('meeting_attendance') &&
    (message.includes('schema cache') || message.includes('does not exist') || message.includes('could not find'))
  ) {
    return 'meeting_attendance tablosu bulunamadi. Supabase migration calistirin.';
  }
  return 'Failed to fetch meeting attendance records';
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

  const limit = parseLimit(request.nextUrl.searchParams.get('limit'), 500);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase: any = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  try {
    const { data, error, count } = await supabase
      .from('meeting_attendance')
      .select('id, full_name, whatsapp, available_dates, created_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('meeting-attendance-admin-list query failed:', error);
      return NextResponse.json({ error: mapQueryError(error) }, { status: 500 });
    }

    const items: Record<string, unknown>[] = Array.isArray(data)
      ? data.map((row: Record<string, unknown>) => ({
          id: row.id,
          full_name: row.full_name || '',
          whatsapp: row.whatsapp || '',
          available_dates: Array.isArray(row.available_dates) ? row.available_dates : [],
          created_at: row.created_at || null,
        }))
      : [];

    const dateStats = buildDateStats(items);

    return NextResponse.json({
      ok: true,
      items,
      date_stats: dateStats,
      stats: {
        total: Number(count || items.length || 0),
      },
    });
  } catch (error) {
    console.error('meeting-attendance-admin-list failed:', error);
    const e = error as Error;
    return NextResponse.json({ error: e.message || 'List failed' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
