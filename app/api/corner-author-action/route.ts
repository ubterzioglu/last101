import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient, isCornerAuthorAuthorized } from '@/lib/admin/cornerAuthorAuth';

const ALLOWED_ACTIONS = new Set(['update_profile', 'create_post', 'update_post', 'delete_post']);
const ALLOWED_STATUSES = new Set(['draft', 'published']);

function normalizeAction(value: unknown): string {
  const safe = String(value || '').trim().toLowerCase();
  return ALLOWED_ACTIONS.has(safe) ? safe : '';
}

function normalizeText(value: unknown, maxLength: number): string {
  return String(value || '').trim().slice(0, maxLength);
}

function normalizeOptionalUrl(value: unknown): string {
  const safe = String(value || '').trim().slice(0, 1000);
  if (!safe) return '';
  if (safe.startsWith('/')) return safe;
  try {
    const parsed = new URL(safe);
    if (!['http:', 'https:'].includes(parsed.protocol)) return '';
    return parsed.toString();
  } catch {
    return '';
  }
}

function normalizeStatus(value: unknown): 'draft' | 'published' | '' {
  const safe = String(value || '').trim().toLowerCase();
  return ALLOWED_STATUSES.has(safe) ? (safe as 'draft' | 'published') : '';
}

function normalizeReadingMinutes(value: unknown): number {
  const parsed = Number.parseInt(String(value || ''), 10);
  if (!Number.isFinite(parsed)) return 3;
  return Math.min(Math.max(parsed, 1), 60);
}

function resolvePublishedAt(existing: { status?: string | null; published_at?: string | null } | null, status: 'draft' | 'published') {
  if (status === 'draft') return null;
  return existing?.published_at || new Date().toISOString();
}

export async function POST(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug');
  const auth = await isCornerAuthorAuthorized(request, slug);
  if (!auth.ok) return NextResponse.json({ error: auth.reason }, { status: auth.status });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const action = normalizeAction(body.action);
  if (!action) return NextResponse.json({ error: 'action is required' }, { status: 400 });

  const supabase = await getSupabaseServiceClient();
  if (!supabase) return NextResponse.json({ error: 'Service not configured' }, { status: 503 });

  try {
    if (action === 'update_profile') {
      const displayName = normalizeText(body.displayName, 120);
      const shortBio = normalizeText(body.shortBio, 700);
      const avatarImageUrl = normalizeOptionalUrl(body.avatarImageUrl);

      if (!displayName) return NextResponse.json({ error: 'Profil adı gerekli.' }, { status: 400 });

      const { data, error } = await supabase
        .from('corner_authors')
        .update({
          display_name: displayName,
          short_bio: shortBio || null,
          avatar_image_url: avatarImageUrl || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', auth.author?.id)
        .select('id, slug, display_name, short_bio, avatar_image_url')
        .maybeSingle();

      if (error) throw error;
      return NextResponse.json({ ok: true, action, author: data });
    }

    if (action === 'delete_post') {
      const id = String(body.id || '').trim();
      if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

      const { error } = await supabase
        .from('corner_posts')
        .delete()
        .eq('id', id)
        .eq('author_id', auth.author?.id);

      if (error) throw error;
      return NextResponse.json({ ok: true, action, id });
    }

    const title = normalizeText(body.title, 255);
    const summary = normalizeText(body.summary, 700);
    const content = normalizeText(body.content, 1000000);
    const coverImageUrl = normalizeOptionalUrl(body.coverImageUrl);
    const readingMinutes = normalizeReadingMinutes(body.readingMinutes);
    const status = normalizeStatus(body.status) || 'draft';

    if (!title) return NextResponse.json({ error: 'Başlık gerekli.' }, { status: 400 });
    if (!content) return NextResponse.json({ error: 'Yazı metni gerekli.' }, { status: 400 });

    if (action === 'create_post') {
      const publishedAt = resolvePublishedAt(null, status);
      const { data, error } = await supabase
        .from('corner_posts')
        .insert([
          {
            author_id: auth.author?.id,
            title,
            summary: summary || null,
            content,
            cover_image_url: coverImageUrl || null,
            reading_minutes: readingMinutes,
            status,
            published_at: publishedAt,
            is_primary: false,
            updated_at: new Date().toISOString(),
          },
        ])
        .select('*')
        .maybeSingle();

      if (error) throw error;
      return NextResponse.json({ ok: true, action, post: data }, { status: 201 });
    }

    if (action === 'update_post') {
      const id = String(body.id || '').trim();
      if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

      const { data: existing, error: existingError } = await supabase
        .from('corner_posts')
        .select('id, status, published_at')
        .eq('id', id)
        .eq('author_id', auth.author?.id)
        .maybeSingle();

      if (existingError) throw existingError;
      if (!existing) return NextResponse.json({ error: 'Yazı bulunamadı.' }, { status: 404 });

      const { data, error } = await supabase
        .from('corner_posts')
        .update({
          title,
          summary: summary || null,
          content,
          cover_image_url: coverImageUrl || null,
          reading_minutes: readingMinutes,
          status,
          published_at: resolvePublishedAt(existing, status),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('author_id', auth.author?.id)
        .select('*')
        .maybeSingle();

      if (error) throw error;
      return NextResponse.json({ ok: true, action, post: data });
    }

    return NextResponse.json({ error: 'Unsupported action' }, { status: 400 });
  } catch (error) {
    console.error('corner-author-action failed:', error);
    const e = error as Error;
    return NextResponse.json({ error: e.message || 'Internal server error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
