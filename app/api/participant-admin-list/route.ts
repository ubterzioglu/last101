import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isAdminAuthorized } from '@/lib/admin/adminAuth';

const CATEGORY_TABLE: Record<string, { participants: string; bracket: string }> = {
  tavla: { participants: 'tavla_participants', bracket: 'tavla_bracket' },
  typing: { participants: 'typing_participants', bracket: 'typing_bracket' },
  vct: { participants: 'vct_participants', bracket: '' },
  promote: { participants: 'promote_participants', bracket: '' },
  cvopt: { participants: 'cvopt_participants', bracket: '' },
};

function normalizeCategory(value: unknown): string {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const category = String(rawValue || '').trim().toLowerCase();
  if (!category || category === 'all') return 'all';
  return Object.prototype.hasOwnProperty.call(CATEGORY_TABLE, category) ? category : '';
}

function getSupabaseAdminClient() {
  const supabaseUrl = String(process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
  const serviceRoleKey = String(process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
  if (!supabaseUrl || !serviceRoleKey) return null;
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function loadParticipants(supabase: any, tableName: string): Promise<unknown[]> {
  const result = await supabase
    .from(tableName)
    .select('*')
    .order('created_at', { ascending: false });
  if (result.error) throw result.error;
  return Array.isArray(result.data) ? result.data : [];
}

async function loadBracket(supabase: any, tableName: string): Promise<unknown[]> {
  const result = await supabase
    .from(tableName)
    .select('*')
    .order('slot_index', { ascending: true });
  if (result.error) throw result.error;
  return Array.isArray(result.data) ? result.data : [];
}

async function loadCategoryPayload(supabase: any, category: string): Promise<Record<string, unknown>> {
  const tableConfig = CATEGORY_TABLE[category];
  const participants = await loadParticipants(supabase, tableConfig.participants);
  if (!tableConfig.bracket) {
    return { participants };
  }
  const bracket = await loadBracket(supabase, tableConfig.bracket);
  return { participants, bracket };
}

export async function GET(request: NextRequest) {
  const auth = await isAdminAuthorized(request);
  if (!auth.ok) return NextResponse.json({ error: auth.reason }, { status: auth.status });

  const category = normalizeCategory(request.nextUrl.searchParams.get('category'));
  if (!category) return NextResponse.json({ error: 'category is invalid' }, { status: 400 });

  const supabase = getSupabaseAdminClient();
  if (!supabase) return NextResponse.json({ error: 'Service not configured' }, { status: 503 });

  try {
    if (category === 'all') {
      const categories = Object.keys(CATEGORY_TABLE);
      const entries = await Promise.all(
        categories.map(async (item) => {
          const payload = await loadCategoryPayload(supabase, item);
          return [item, payload];
        })
      );
      return NextResponse.json({ ok: true, data: Object.fromEntries(entries) });
    }

    const payload = await loadCategoryPayload(supabase, category);
    return NextResponse.json({ ok: true, data: payload });
  } catch (error) {
    console.error('participant-admin-list failed:', error);
    const e = error as Error;
    return NextResponse.json({ error: e.message || 'Internal server error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
