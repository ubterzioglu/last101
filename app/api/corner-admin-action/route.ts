import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isCornerAdminAuthorized } from '@/lib/admin/cornerAuth';

const ALLOWED_ACTIONS = new Set(['create', 'update', 'set_status', 'delete', 'update_profile']);
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

function normalizeStatus(value: unknown): 'draft' | 'published' | '' {
  const safe = String(value || '').trim().toLowerCase();
  return ALLOWED_STATUSES.has(safe) ? (safe as 'draft' | 'published') : '';
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

function normalizeReadingMinutes(value: unknown): number {
  const parsed = Number.parseInt(String(value || ''), 10);
  if (!Number.isFinite(parsed)) return 3;
  return Math.min(Math.max(parsed, 1), 60);
}

function getPublishedAt(existing: { status?: string | null; published_at?: string | null }, status: 'draft' | 'published') {
  const wasPublished = existing.status === 'published';
  const willBePublished = status === 'published';

  if (!wasPublished && willBePublished) return new Date().toISOString();
  if (wasPublished && !willBePublished) return null;
  if (willBePublished && !existing.published_at) return new Date().toISOString();
  return existing.published_at || null;
}

async function getSupabaseAdmin() {
  const supabaseUrl = normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const serviceRoleKey = normalizeEnvValue(
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_SERVICE_KEY ||
      process.env.SUPABASE_SECRET_KEY ||
      ''
  );
  if (!supabaseUrl || !serviceRoleKey) return null;

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function POST(request: NextRequest) {
  const auth = await isCornerAdminAuthorized(request);
  if (!auth.ok) return NextResponse.json({ error: auth.reason }, { status: auth.status });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const action = normalizeAction(body.action);
  const id = String(body.id || '').trim();

  if (!action) return NextResponse.json({ error: 'action is required' }, { status: 400 });
  if (!['create', 'update_profile'].includes(action) && !id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  const supabase: any = await getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: 'Service not configured' }, { status: 503 });

  try {
    if (action === 'create') {
      const title = normalizeText(body.title, 255);
      const summary = normalizeText(body.summary, 700);
      const content = normalizeText(body.content, 1000000);
      const coverImageUrl = normalizeOptionalUrl(body.coverImageUrl);
      const status = normalizeStatus(body.status) || 'draft';
      const readingMinutes = normalizeReadingMinutes(body.readingMinutes);

      if (!title) return NextResponse.json({ error: 'title is required' }, { status: 400 });

      const { data, error } = await supabase
        .from('corner_posts')
        .insert([
          {
            title,
            summary: summary || null,
            content: content || null,
            cover_image_url: coverImageUrl || null,
            reading_minutes: readingMinutes,
            status,
            published_at: status === 'published' ? new Date().toISOString() : null,
            updated_at: new Date().toISOString(),
          },
        ])
        .select('*')
        .maybeSingle();

      if (error) throw error;
      return NextResponse.json({ ok: true, action: 'create', data }, { status: 201 });
    }

    if (action === 'update') {
      const title = normalizeText(body.title, 255);
      const summary = normalizeText(body.summary, 700);
      const content = normalizeText(body.content, 1000000);
      const coverImageUrl = normalizeOptionalUrl(body.coverImageUrl);
      const status = normalizeStatus(body.status) || 'draft';
      const readingMinutes = normalizeReadingMinutes(body.readingMinutes);

      if (!title) return NextResponse.json({ error: 'title is required' }, { status: 400 });

      const { data: existing, error: existingError } = await supabase
        .from('corner_posts')
        .select('id, status, published_at')
        .eq('id', id)
        .maybeSingle();

      if (existingError) throw existingError;
      if (!existing) return NextResponse.json({ error: 'Record not found' }, { status: 404 });

      const { data, error } = await supabase
        .from('corner_posts')
        .update({
          title,
          summary: summary || null,
          content: content || null,
          cover_image_url: coverImageUrl || null,
          reading_minutes: readingMinutes,
          status,
          published_at: getPublishedAt(existing, status),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select('*')
        .maybeSingle();

      if (error) throw error;
      if (!data) return NextResponse.json({ error: 'Record not found' }, { status: 404 });
      return NextResponse.json({ ok: true, action: 'update', data });
    }

    if (action === 'set_status') {
      const status = normalizeStatus(body.status);
      if (!status) return NextResponse.json({ error: 'status is invalid' }, { status: 400 });

      const { data: existing, error: existingError } = await supabase
        .from('corner_posts')
        .select('id, status, published_at')
        .eq('id', id)
        .maybeSingle();

      if (existingError) throw existingError;
      if (!existing) return NextResponse.json({ error: 'Record not found' }, { status: 404 });

      const { data, error } = await supabase
        .from('corner_posts')
        .update({
          status,
          published_at: getPublishedAt(existing, status),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select('*')
        .maybeSingle();

      if (error) throw error;
      if (!data) return NextResponse.json({ error: 'Record not found' }, { status: 404 });
      return NextResponse.json({ ok: true, action: 'set_status', data });
    }

    if (action === 'delete') {
      const { error } = await supabase.from('corner_posts').delete().eq('id', id);
      if (error) throw error;
      return NextResponse.json({ ok: true, action: 'delete', id });
    }

    if (action === 'update_profile') {
      const displayName = normalizeText(body.displayName, 120) || 'Arkadaşın Köşesi';
      const shortBio = normalizeText(body.shortBio, 700);
      const bioContent = normalizeText(body.bioContent, 1000000);
      const avatarImageUrl = normalizeOptionalUrl(body.avatarImageUrl);

      const { data: existing, error: existingError } = await supabase
        .from('corner_author_profile')
        .select('id')
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (existingError) throw existingError;

      const payload = {
        display_name: displayName,
        short_bio: shortBio || null,
        bio_content: bioContent || null,
        avatar_image_url: avatarImageUrl || null,
        updated_at: new Date().toISOString(),
      };

      const result = existing?.id
        ? await supabase
            .from('corner_author_profile')
            .update(payload)
            .eq('id', existing.id)
            .select('*')
            .maybeSingle()
        : await supabase
            .from('corner_author_profile')
            .insert([payload])
            .select('*')
            .maybeSingle();

      if (result.error) throw result.error;
      return NextResponse.json({ ok: true, action: 'update_profile', data: result.data });
    }

    return NextResponse.json({ error: 'Unsupported action' }, { status: 400 });
  } catch (error) {
    console.error('corner-admin-action failed:', error);
    const e = error as Error;
    return NextResponse.json({ error: e.message || 'Internal server error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
