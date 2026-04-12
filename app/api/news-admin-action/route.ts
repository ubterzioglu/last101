import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isAdminAuthorized } from '@/lib/admin/adminAuth';

const ALLOWED_ACTIONS = new Set(['create', 'update', 'set_category', 'set_status', 'set_carousel', 'delete']);
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

function normalizeText(value: unknown, maxLength: number): string {
  return String(value || '').trim().slice(0, maxLength);
}

function normalizeOptionalUrl(value: unknown): string {
  const safe = String(value || '').trim().slice(0, 1000);
  if (!safe) return '';

  try {
    const parsed = new URL(safe);
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

function normalizeBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === 'boolean') return value;
  const safe = String(value || '').trim().toLowerCase();
  if (!safe) return fallback;
  if (['true', '1', 'yes', 'on'].includes(safe)) return true;
  if (['false', '0', 'no', 'off'].includes(safe)) return false;
  return fallback;
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

  const action = normalizeAction(body.action);
  const id = String(body.id || '').trim();

  if (!action) return NextResponse.json({ error: 'action is required' }, { status: 400 });
  if (action !== 'create' && !id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

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

  const supabase: any = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  try {
    if (action === 'create') {
      const title = normalizeText(body.title, 180);
      const summary = normalizeText(body.summary, 600);
      const category = normalizeCategory(body.category) || 'Almanya';
      const status = normalizeStatus(body.status) || 'draft';
      const coverImageUrl = normalizeOptionalUrl(body.coverImageUrl);
      const sourceName = normalizeText(body.sourceName, 120);
      const sourceUrl = normalizeOptionalUrl(body.sourceUrl);
      const readingMinutes = normalizeReadingMinutes(body.readingMinutes);
      const showInCarousel = normalizeBoolean(body.showInCarousel, true);

      if (!title) return NextResponse.json({ error: 'title is required' }, { status: 400 });

      const { data, error } = await supabase
        .from('news_posts')
        .insert([
          {
            category,
            title,
            summary: summary || null,
            cover_image_url: coverImageUrl || null,
            source_name: sourceName || null,
            source_url: sourceUrl || null,
            reading_minutes: readingMinutes,
            show_in_carousel: showInCarousel,
            status,
            published_at: status === 'published' ? new Date().toISOString() : null,
          },
        ])
        .select('id, category, title, summary, cover_image_url, source_name, source_url, reading_minutes, published_at, created_at, status, show_in_carousel')
        .maybeSingle();

      if (error) throw error;

      return NextResponse.json({ ok: true, action: 'create', data }, { status: 201 });
    }

    if (action === 'update') {
      const title = normalizeText(body.title, 180);
      const summary = normalizeText(body.summary, 600);
      const category = normalizeCategory(body.category) || 'Almanya';
      const status = normalizeStatus(body.status) || 'draft';
      const coverImageUrl = normalizeOptionalUrl(body.coverImageUrl);
      const sourceName = normalizeText(body.sourceName, 120);
      const sourceUrl = normalizeOptionalUrl(body.sourceUrl);
      const readingMinutes = normalizeReadingMinutes(body.readingMinutes);
      const showInCarousel = normalizeBoolean(body.showInCarousel, true);

      if (!title) return NextResponse.json({ error: 'title is required' }, { status: 400 });

      const { data: existing, error: existingError } = await supabase
        .from('news_posts')
        .select('id, status, published_at')
        .eq('id', id)
        .maybeSingle();

      if (existingError) throw existingError;
      if (!existing) return NextResponse.json({ error: 'Record not found' }, { status: 404 });

      const wasPublished = existing.status === 'published';
      const willBePublished = status === 'published';
      let nextPublishedAt = existing.published_at;

      if (!wasPublished && willBePublished) {
        nextPublishedAt = new Date().toISOString();
      } else if (wasPublished && !willBePublished) {
        nextPublishedAt = null;
      } else if (willBePublished && !nextPublishedAt) {
        nextPublishedAt = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('news_posts')
        .update({
          category,
          title,
          summary: summary || null,
          cover_image_url: coverImageUrl || null,
          source_name: sourceName || null,
          source_url: sourceUrl || null,
          reading_minutes: readingMinutes,
          show_in_carousel: showInCarousel,
          status,
          published_at: nextPublishedAt,
        })
        .eq('id', id)
        .select('id, category, title, summary, cover_image_url, source_name, source_url, reading_minutes, published_at, created_at, status, show_in_carousel')
        .maybeSingle();

      if (error) throw error;
      if (!data) return NextResponse.json({ error: 'Record not found' }, { status: 404 });

      return NextResponse.json({ ok: true, action: 'update', data });
    }

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

    if (action === 'set_carousel') {
      const showInCarousel = normalizeBoolean(body.showInCarousel, false);

      const { data, error } = await supabase
        .from('news_posts')
        .update({ show_in_carousel: showInCarousel })
        .eq('id', id)
        .select('*')
        .maybeSingle();

      if (error) throw error;
      if (!data) return NextResponse.json({ error: 'Record not found' }, { status: 404 });
      return NextResponse.json({ ok: true, action: 'set_carousel', data });
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
