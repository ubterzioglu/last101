import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient, isCornerAuthorAuthorized } from '@/lib/admin/cornerAuthorAuth';

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug');
  const auth = await isCornerAuthorAuthorized(request, slug);
  if (!auth.ok) return NextResponse.json({ error: auth.reason }, { status: auth.status });

  const supabase = await getSupabaseServiceClient();
  if (!supabase) return NextResponse.json({ error: 'Service not configured' }, { status: 503 });

  try {
    const [{ data: author, error: authorError }, { data: posts, error: postsError }] = await Promise.all([
      supabase
        .from('corner_authors')
        .select('id, display_name, slug, short_bio, bio_content, avatar_image_url, is_active, display_order, updated_at')
        .eq('id', auth.author?.id)
        .maybeSingle(),
      supabase
        .from('corner_posts')
        .select('id, author_id, title, summary, content, cover_image_url, reading_minutes, status, published_at, created_at, updated_at')
        .eq('author_id', auth.author?.id)
        .order('created_at', { ascending: false }),
    ]);

    if (authorError) throw authorError;
    if (postsError) throw postsError;
    return NextResponse.json({ ok: true, author, posts: Array.isArray(posts) ? posts : [] });
  } catch (error) {
    console.error('corner-author-panel failed:', error);
    const e = error as Error;
    return NextResponse.json({ error: e.message || 'Internal server error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
