import { NextRequest, NextResponse } from 'next/server';
import { isCornerAdminAuthorized } from '@/lib/admin/cornerAuth';
import { getSupabaseServiceClient } from '@/lib/admin/cornerAuthorAuth';

async function countRows(supabase: any, table: string, filters: Record<string, unknown> = {}) {
  let query = supabase.from(table).select('id', { count: 'exact', head: true });
  for (const [key, value] of Object.entries(filters)) query = query.eq(key, value);
  const { count, error } = await query;
  if (error) throw error;
  return Number(count || 0);
}

export async function GET(request: NextRequest) {
  const auth = await isCornerAdminAuthorized(request);
  if (!auth.ok) return NextResponse.json({ error: auth.reason }, { status: auth.status });

  const supabase = await getSupabaseServiceClient();
  if (!supabase) return NextResponse.json({ error: 'Service not configured' }, { status: 503 });

  try {
    const [{ data: authors, error: authorsError }, { data: posts, error: postsError }, totalAuthors, activeAuthors, totalPosts, publishedPosts] =
      await Promise.all([
        supabase
          .from('corner_authors')
          .select('id, display_name, slug, short_bio, bio_content, avatar_image_url, display_order, is_active, created_at, updated_at')
          .order('display_order', { ascending: true })
          .order('created_at', { ascending: true }),
        supabase
          .from('corner_posts')
          .select('id, author_id, title, summary, content, cover_image_url, reading_minutes, status, published_at, created_at, updated_at, corner_authors(display_name, slug)')
          .order('updated_at', { ascending: false }),
        countRows(supabase, 'corner_authors'),
        countRows(supabase, 'corner_authors', { is_active: true }),
        countRows(supabase, 'corner_posts'),
        countRows(supabase, 'corner_posts', { status: 'published' }),
      ]);

    if (authorsError) throw authorsError;
    if (postsError) throw postsError;

    return NextResponse.json({
      ok: true,
      authors: Array.isArray(authors) ? authors : [],
      posts: Array.isArray(posts) ? posts : [],
      stats: {
        totalAuthors,
        activeAuthors,
        totalPosts,
        publishedPosts,
      },
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
