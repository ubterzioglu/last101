import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isAdminAuthorized } from '@/lib/admin/adminAuth';

const ALLOWED_STATUSES = new Set(['all', 'draft', 'published']);
const ALLOWED_CATEGORIES = new Set(['Almanya', 'Türkiye', 'Avrupa', 'Dünya']);

function normalizeEnvValue(value: unknown): string {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
    return raw.slice(1, -1).trim();
  }
  return raw;
}

function normalizeStatus(value: unknown): string {
  const safe = String(value || 'all').trim().toLowerCase();
  return ALLOWED_STATUSES.has(safe) ? safe : 'all';
}

function normalizeCategory(value: unknown): string {
  const safe = String(value || 'all').trim();
  if (!safe) return 'all';
  return ALLOWED_CATEGORIES.has(safe) ? safe : 'all';
}

function normalizeLimit(value: unknown): number {
  const parsed = Number.parseInt(String(value || ''), 10);
  if (!Number.isFinite(parsed)) return 300;
  return Math.min(Math.max(parsed, 1), 1000);
}

function normalizeSearch(value: unknown): string {
  return String(value || '').trim().slice(0, 120);
}

async function countNews(supabase: any, category: string, status: string): Promise<number> {
  let query = supabase.from('news_posts').select('id', { count: 'exact', head: true });
  if (category !== 'all') query = query.eq('category', category);
  if (status !== 'all') query = query.eq('status', status);
  const { count, error } = await query;
  if (error) throw error;
  return Number(count || 0);
}

export async function GET(request: NextRequest) {
  const auth = await isAdminAuthorized(request);
  if (!auth.ok) return NextResponse.json({ error: auth.reason }, { status: auth.status });

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
  const category = normalizeCategory(searchParams.get('category'));
  const limit = normalizeLimit(searchParams.get('limit'));
  const search = normalizeSearch(searchParams.get('q'));

  const supabase: any = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  try {
    let query = supabase
      .from('news_posts')
      .select('id, category, title, summary, cover_image_url, source_name, source_url, reading_minutes, published_at, created_at, status')
      .order('published_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })
      .limit(limit);

    if (status !== 'all') query = query.eq('status', status);
    if (category !== 'all') query = query.eq('category', category);
    if (search) query = query.ilike('title', `%${search}%`);

    const [{ data, error }, total, draft, published] = await Promise.all([
      query,
      countNews(supabase, category, 'all'),
      countNews(supabase, category, 'draft'),
      countNews(supabase, category, 'published'),
    ]);

    if (error) throw error;

    return NextResponse.json({
      ok: true,
      items: Array.isArray(data) ? data : [],
      stats: {
        total,
        draft,
        published,
      },
    });
  } catch (error) {
    console.error('news-admin-list failed:', error);
    const e = error as Error;
    return NextResponse.json({ error: e.message || 'Internal server error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
