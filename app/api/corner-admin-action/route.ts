import { NextRequest, NextResponse } from 'next/server';
import { isCornerAdminAuthorized } from '@/lib/admin/cornerAuth';
import {
  getSupabaseServiceClient,
  isReservedAuthorSlug,
  normalizeAuthorSlug,
} from '@/lib/admin/cornerAuthorAuth';
import { createPasswordHash } from '@/lib/admin/cornerPasswords';

const ALLOWED_ACTIONS = new Set(['create_author', 'update_author', 'set_author_active', 'reset_author_password', 'delete_author', 'set_post_status', 'delete_post']);
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

function normalizeBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === 'boolean') return value;
  const safe = String(value || '').trim().toLowerCase();
  if (!safe) return fallback;
  if (['true', '1', 'yes', 'on'].includes(safe)) return true;
  if (['false', '0', 'no', 'off'].includes(safe)) return false;
  return fallback;
}

function normalizeStatus(value: unknown): 'draft' | 'published' | '' {
  const safe = String(value || '').trim().toLowerCase();
  return ALLOWED_STATUSES.has(safe) ? (safe as 'draft' | 'published') : '';
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

  const supabase = await getSupabaseServiceClient();
  if (!supabase) return NextResponse.json({ error: 'Service not configured' }, { status: 503 });

  try {
    if (action === 'create_author') {
      const displayName = normalizeText(body.displayName, 120);
      const slug = normalizeAuthorSlug(body.slug || displayName);
      const password = String(body.password || '').trim();
      const shortBio = normalizeText(body.shortBio, 700);
      const bioContent = normalizeText(body.bioContent, 1000000);
      const avatarImageUrl = normalizeOptionalUrl(body.avatarImageUrl);
      const displayOrder = Math.max(1, Math.min(9999, Number.parseInt(String(body.displayOrder || '1000'), 10) || 1000));

      if (!displayName) return NextResponse.json({ error: 'Yazar adı gerekli.' }, { status: 400 });
      if (!slug || slug.length < 2) return NextResponse.json({ error: 'Geçerli bir slug gerekli.' }, { status: 400 });
      if (isReservedAuthorSlug(slug)) return NextResponse.json({ error: 'Bu slug sistem tarafından kullanılıyor.' }, { status: 400 });
      if (password.length < 6) return NextResponse.json({ error: 'Yazar şifresi en az 6 karakter olmalı.' }, { status: 400 });

      const { salt, hash, iterations } = createPasswordHash(password);
      const { data: author, error: authorError } = await supabase
        .from('corner_authors')
        .insert([
          {
            display_name: displayName,
            slug,
            short_bio: shortBio || null,
            bio_content: bioContent || null,
            avatar_image_url: avatarImageUrl || null,
            display_order: displayOrder,
            password_hash: hash,
            password_salt: salt,
            hash_iterations: iterations,
            is_active: true,
            updated_at: new Date().toISOString(),
          },
        ])
        .select('*')
        .maybeSingle();

      if (authorError) throw authorError;
      return NextResponse.json({ ok: true, action, author }, { status: 201 });
    }

    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

    if (action === 'update_author') {
      const displayName = normalizeText(body.displayName, 120);
      const slug = normalizeAuthorSlug(body.slug || displayName);
      const shortBio = normalizeText(body.shortBio, 700);
      const bioContent = normalizeText(body.bioContent, 1000000);
      const avatarImageUrl = normalizeOptionalUrl(body.avatarImageUrl);
      const displayOrder = Math.max(1, Math.min(9999, Number.parseInt(String(body.displayOrder || '1000'), 10) || 1000));

      if (!displayName) return NextResponse.json({ error: 'Yazar adı gerekli.' }, { status: 400 });
      if (!slug || isReservedAuthorSlug(slug)) return NextResponse.json({ error: 'Slug geçersiz veya rezerve.' }, { status: 400 });

      const { data, error } = await supabase
        .from('corner_authors')
        .update({
          display_name: displayName,
          slug,
          short_bio: shortBio || null,
          bio_content: bioContent || null,
          avatar_image_url: avatarImageUrl || null,
          display_order: displayOrder,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select('*')
        .maybeSingle();

      if (error) throw error;
      if (!data) return NextResponse.json({ error: 'Yazar bulunamadı.' }, { status: 404 });
      return NextResponse.json({ ok: true, action, data });
    }

    if (action === 'set_author_active') {
      const isActive = normalizeBoolean(body.isActive, true);
      const { data, error } = await supabase
        .from('corner_authors')
        .update({ is_active: isActive, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select('*')
        .maybeSingle();
      if (error) throw error;
      return NextResponse.json({ ok: true, action, data });
    }

    if (action === 'reset_author_password') {
      const password = String(body.password || '').trim();
      if (password.length < 6) return NextResponse.json({ error: 'Yeni şifre en az 6 karakter olmalı.' }, { status: 400 });
      const { salt, hash, iterations } = createPasswordHash(password);
      const { data, error } = await supabase
        .from('corner_authors')
        .update({ password_hash: hash, password_salt: salt, hash_iterations: iterations, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select('id, slug, display_name')
        .maybeSingle();
      if (error) throw error;
      return NextResponse.json({ ok: true, action, data });
    }

    if (action === 'delete_author') {
      const { error } = await supabase.from('corner_authors').delete().eq('id', id);
      if (error) throw error;
      return NextResponse.json({ ok: true, action, id });
    }

    if (action === 'set_post_status') {
      const status = normalizeStatus(body.status);
      if (!status) return NextResponse.json({ error: 'status is invalid' }, { status: 400 });
      const { data: existing, error: existingError } = await supabase
        .from('corner_posts')
        .select('id, status, published_at')
        .eq('id', id)
        .maybeSingle();
      if (existingError) throw existingError;
      if (!existing) return NextResponse.json({ error: 'Yazı bulunamadı.' }, { status: 404 });
      const publishedAt = status === 'published' ? existing.published_at || new Date().toISOString() : null;
      const { data, error } = await supabase
        .from('corner_posts')
        .update({ status, published_at: publishedAt, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select('*')
        .maybeSingle();
      if (error) throw error;
      return NextResponse.json({ ok: true, action, data });
    }

    if (action === 'delete_post') {
      const { error } = await supabase.from('corner_posts').delete().eq('id', id);
      if (error) throw error;
      return NextResponse.json({ ok: true, action, id });
    }

    return NextResponse.json({ error: 'Unsupported action' }, { status: 400 });
  } catch (error) {
    console.error('corner-admin-action failed:', error);
    const e = error as Error;
    const duplicate = String((error as any)?.code || '') === '23505';
    return NextResponse.json({ error: duplicate ? 'Bu slug zaten kullanılıyor.' : e.message || 'Internal server error' }, { status: duplicate ? 409 : 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
