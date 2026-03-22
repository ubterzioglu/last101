import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isAdminAuthorized } from '@/lib/admin/adminAuth';

const ALLOWED_ACTIONS = new Set(['set_category', 'set_status', 'delete']);
const ALLOWED_CATEGORIES = new Set(['Almanya', 'Türkiye', 'Avrupa', 'Dünya']);
const ALLOWED_STATUSES = new Set(['draft', 'published']);

function normalizeEnvValue(value: unknown): string {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
    return raw.slice(1, -1).trim();
  }
  return raw;
}

function normalizeAction(value: unknown): string {
  const safe = String(value || '').trim().toLowerCase();
  return ALLOWED_ACTIONS.has(safe) ? safe : '';
}

function normalizeCategory(value: unknown): string {
  const safe = String(value || '').trim();
  return ALLOWED_CATEGORIES.has(safe) ? safe : '';
}

function normalizeStatus(value: unknown): string {
  const safe = String(value || '').trim().toLowerCase();
  return ALLOWED_STATUSES.has(safe) ? safe : '';
}

export async function POST(request: NextRequest) {
  const auth = await isAdminAuthorized(request);
  if (!auth.ok) return NextResponse.json({ error: auth.reason }, { status: auth.status });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const id = String(body.id || '').trim();
  const action = normalizeAction(body.action);

  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
  if (!action) return NextResponse.json({ error: 'action is required' }, { status: 400 });

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase: any = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  try {
    if (action === 'delete') {
      const { error } = await supabase.from('news_posts').delete().eq('id', id);
      if (error) throw error;
      return NextResponse.json({ ok: true, action: 'delete', id });
    }

    if (action === 'set_category') {
      const category = normalizeCategory(body.category);
      if (!category) return NextResponse.json({ error: 'category is invalid' }, { status: 400 });

      const { data, error } = await supabase
        .from('news_posts')
        .update({ category })
        .eq('id', id)
        .select('*')
        .maybeSingle();

      if (error) throw error;
      if (!data) return NextResponse.json({ error: 'Record not found' }, { status: 404 });
      return NextResponse.json({ ok: true, action: 'set_category', data });
    }

    if (action === 'set_status') {
      const status = normalizeStatus(body.status);
      if (!status) return NextResponse.json({ error: 'status is invalid' }, { status: 400 });

      const updateData =
        status === 'published'
          ? { status, published_at: new Date().toISOString() }
          : { status, published_at: null };

      const { data, error } = await supabase
        .from('news_posts')
        .update(updateData)
        .eq('id', id)
        .select('*')
        .maybeSingle();

      if (error) throw error;
      if (!data) return NextResponse.json({ error: 'Record not found' }, { status: 404 });
      return NextResponse.json({ ok: true, action: 'set_status', data });
    }

    return NextResponse.json({ error: 'Unsupported action' }, { status: 400 });
  } catch (error) {
    console.error('news-admin-action failed:', error);
    const e = error as Error;
    return NextResponse.json({ error: e.message || 'Internal server error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
