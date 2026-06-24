import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthorized } from '@/lib/admin/adminAuth';

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
);

const SEVERITIES = ['low', 'medium', 'high', 'critical'] as const;
const CATEGORIES = ['secret', 'auth', 'rls', 'validation', 'dependency', 'config', 'general'] as const;
const STATUSES = ['open', 'in_progress', 'resolved', 'wontfix'] as const;
const SOURCES = ['manual', 'agent', 'system'] as const;

type Severity = (typeof SEVERITIES)[number];
type Category = (typeof CATEGORIES)[number];
type Status = (typeof STATUSES)[number];
type Source = (typeof SOURCES)[number];

function pick<T extends readonly string[]>(value: unknown, allowed: T, fallback: T[number]): T[number] {
  const v = String(value || '').trim().toLowerCase();
  return (allowed as readonly string[]).includes(v) ? (v as T[number]) : fallback;
}

// GET: notları listele. Opsiyonel filtreler: status, severity, category, search.
export async function GET(request: NextRequest) {
  try {
    const auth = await isAdminAuthorized(request);
    if (!auth.ok) return NextResponse.json({ error: auth.reason }, { status: auth.status });

    const params = request.nextUrl.searchParams;
    const status = params.get('status');
    const severity = params.get('severity');
    const category = params.get('category');
    const search = (params.get('search') || '').trim();

    let query = supabase
      .from('security_notes')
      .select('*')
      .order('created_at', { ascending: false });

    if (status && (STATUSES as readonly string[]).includes(status)) query = query.eq('status', status);
    if (severity && (SEVERITIES as readonly string[]).includes(severity)) query = query.eq('severity', severity);
    if (category && (CATEGORIES as readonly string[]).includes(category)) query = query.eq('category', category);
    if (search) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);

    const { data, error } = await query;
    if (error) {
      console.error('[security-notes] list error:', error.message);
      return NextResponse.json({ error: 'Notlar getirilemedi' }, { status: 500 });
    }

    const notes = data || [];
    const stats = {
      total: notes.length,
      open: notes.filter((n) => n.status === 'open').length,
      critical: notes.filter((n) => n.severity === 'critical' && n.status !== 'resolved' && n.status !== 'wontfix').length,
    };

    return NextResponse.json({ notes, stats });
  } catch (error) {
    console.error('[security-notes] GET error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

// POST: yeni not oluştur. Hem admin paneli hem de sistem/agent bu uca yazabilir.
export async function POST(request: NextRequest) {
  try {
    const auth = await isAdminAuthorized(request);
    if (!auth.ok) return NextResponse.json({ error: auth.reason }, { status: auth.status });

    const body = await request.json().catch(() => ({} as Record<string, unknown>));
    const title = String(body.title || '').trim();
    const description = String(body.description || '').trim();
    if (!title || !description) {
      return NextResponse.json({ error: 'Başlık ve açıklama zorunludur' }, { status: 400 });
    }

    const severity: Severity = pick(body.severity, SEVERITIES, 'medium');
    const category: Category = pick(body.category, CATEGORIES, 'general');
    const source: Source = pick(body.source, SOURCES, 'manual');
    const relatedPath = body.related_path ? String(body.related_path).trim().slice(0, 500) : null;

    const { data, error } = await supabase
      .from('security_notes')
      .insert([{ title: title.slice(0, 300), description, severity, category, source, related_path: relatedPath }])
      .select('*')
      .maybeSingle();

    if (error) {
      console.error('[security-notes] create error:', error.message);
      return NextResponse.json({ error: 'Not oluşturulamadı' }, { status: 500 });
    }

    return NextResponse.json({ success: true, note: data });
  } catch (error) {
    console.error('[security-notes] POST error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

// PATCH: not güncelle (durum değiştir / çözüm notu ekle).
export async function PATCH(request: NextRequest) {
  try {
    const auth = await isAdminAuthorized(request);
    if (!auth.ok) return NextResponse.json({ error: auth.reason }, { status: auth.status });

    const body = await request.json().catch(() => ({} as Record<string, unknown>));
    const id = String(body.id || '').trim();
    if (!id) return NextResponse.json({ error: 'id zorunludur' }, { status: 400 });

    const update: Record<string, unknown> = {};
    if (body.status !== undefined) {
      const status: Status = pick(body.status, STATUSES, 'open');
      update.status = status;
      update.resolved_at = status === 'resolved' ? new Date().toISOString() : null;
    }
    if (body.resolution_note !== undefined) {
      update.resolution_note = String(body.resolution_note || '').trim() || null;
    }
    if (body.severity !== undefined) update.severity = pick(body.severity, SEVERITIES, 'medium');
    if (body.category !== undefined) update.category = pick(body.category, CATEGORIES, 'general');

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: 'Güncellenecek alan yok' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('security_notes')
      .update(update)
      .eq('id', id)
      .select('*')
      .maybeSingle();

    if (error) {
      console.error('[security-notes] update error:', error.message);
      return NextResponse.json({ error: 'Not güncellenemedi' }, { status: 500 });
    }

    return NextResponse.json({ success: true, note: data });
  } catch (error) {
    console.error('[security-notes] PATCH error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

// DELETE: not sil (?id=...).
export async function DELETE(request: NextRequest) {
  try {
    const auth = await isAdminAuthorized(request);
    if (!auth.ok) return NextResponse.json({ error: auth.reason }, { status: auth.status });

    const id = String(request.nextUrl.searchParams.get('id') || '').trim();
    if (!id) return NextResponse.json({ error: 'id zorunludur' }, { status: 400 });

    const { error } = await supabase.from('security_notes').delete().eq('id', id);
    if (error) {
      console.error('[security-notes] delete error:', error.message);
      return NextResponse.json({ error: 'Not silinemedi' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[security-notes] DELETE error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
