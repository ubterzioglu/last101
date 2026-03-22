import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function sanitizeName(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.replace(/[\x00-\x1F\x7F]/g, '').trim().slice(0, 120);
}

function normalizeWhatsapp(value: unknown): string {
  if (typeof value !== 'string') return '';
  const raw = value.trim();
  if (!raw) return '';
  const hasPlus = raw.startsWith('+');
  const digits = raw.replace(/\D/g, '');
  if (!digits) return '';
  return (hasPlus ? `+${digits}` : digits).slice(0, 32);
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function POST(request: NextRequest) {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'Service not configured' }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const name = sanitizeName(body.name);
  const whatsapp = normalizeWhatsapp(body.whatsapp);
  if (!name) return NextResponse.json({ error: 'name is required' }, { status: 400 });
  if (!whatsapp) return NextResponse.json({ error: 'whatsapp is required' }, { status: 400 });

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  try {
    const { data: existing } = await supabase.from('tavla_participants').select('id').ilike('name', name).limit(1);
    if (Array.isArray(existing) && existing.length > 0) {
      return NextResponse.json({ error: 'Bu isimle zaten kayıtlı' }, { status: 409 });
    }

    const { data, error } = await supabase
      .from('tavla_participants')
      .insert([{ name, whatsapp, approved: false }])
      .select('id')
      .single();

    if (error) throw error;
    return NextResponse.json({ ok: true, id: data?.id ?? null }, { status: 201 });
  } catch (err) {
    console.error('tavla-register failed:', err);
    return NextResponse.json({ error: (err as { message?: string })?.message ?? 'Internal server error' }, { status: 500 });
  }
}
