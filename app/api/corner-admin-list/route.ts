import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isCornerAdminAuthorized } from '@/lib/admin/cornerAuth';

const ALLOWED_STATUSES = new Set(['all', 'draft', 'published']);

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

function normalizeLimit(value: unknown): number {
  const parsed = Number.parseInt(String(value || ''), 10);
  if (!Number.isFinite(parsed)) return 200;
  return Math.min(Math.max(parsed, 1), 500);
}

function normalizeSearch(value: unknown): string {
  return String(value || '').trim().slice(0, 120);
}

async function countPosts(supabase: any, status: string): Promise<number> {
  let query = supabase.from('corner_posts').select('id', { count: 'exact', head: true });
  if (status !== 'all') query = query.eq('status', status);
  const { count, error } = await query;
  if (error) throw error;
  return Number(count || 0);
}

export async function GET(request: NextRequest) {
  const auth = await isCornerAdminAuthorized(request);
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
  const limit = normalizeLimit(searchParams.get('limit'));
  const search = normalizeSearch(searchParams.get('q'));

  const supabase: any = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  try {
    let query = supabase
      .from('corner_posts')
      .select('id, title, summary, content, cover_image_url, reading_minutes, published_at, created_at, updated_at, status')
      .order('published_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })
      .limit(limit);

    if (status !== 'all') query = query.eq('status', status);
    if (search) query = query.ilike('title', `%${search}%`);

    const profileQuery = supabase
      .from('corner_author_profile')
      .select('id, display_name, short_bio, bio_content, avatar_image_url, created_at, updated_at')
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();

    const [{ data, error }, profileResult, total, draft, published] = await Promise.all([
      query,
      profileQuery,
      countPosts(supabase, 'all'),
      countPosts(supabase, 'draft'),
      countPosts(supabase, 'published'),
    ]);

    if (error) throw error;
    if (profileResult.error) throw profileResult.error;

    return NextResponse.json({
      ok: true,
      items: Array.isArray(data) ? data : [],
      profile: profileResult.data || null,
      stats: { total, draft, published },
    });
  } catch (error) {
    console.error('corner-admin-list failed:', error);
    const e = error as Error;
    return NextResponse.json({ error: e.message || 'Internal server error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
