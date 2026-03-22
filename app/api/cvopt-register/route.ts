import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function sanitizeName(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.replace(/[\x00-\x1F\x7F]/g, '').trim().slice(0, 120);
}

function sanitizeString(value: unknown, maxLength = 500): string {
  if (typeof value !== 'string') return '';
  return value.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim().slice(0, maxLength);
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

  const name = sanitizeName(body.name) || 'İsimsiz';
  const linkedin = sanitizeString(body.linkedin, 300);
  const whatsapp = sanitizeString(body.whatsapp, 32);

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  try {
    if (linkedin) {
      const { data: rows } = await supabase.from('cvopt_participants').select('id').eq('linkedin', linkedin).limit(1);
      if (Array.isArray(rows) && rows.length > 0) {
        return NextResponse.json({ error: 'Bu LinkedIn profili zaten sırada' }, { status: 409 });
      }
    }

    if (whatsapp) {
      const { data: rows } = await supabase.from('cvopt_participants').select('id').eq('whatsapp', whatsapp).limit(1);
      if (Array.isArray(rows) && rows.length > 0) {
        return NextResponse.json({ error: 'Bu WhatsApp numarası zaten sırada' }, { status: 409 });
      }
    }

    const { data, error } = await supabase
      .from('cvopt_participants')
      .insert([{ name, linkedin, whatsapp, approved: false }])
      .select('id')
      .single();

    if (error) throw error;
    return NextResponse.json({ ok: true, id: data?.id ?? null }, { status: 201 });
  } catch (err) {
    console.error('cvopt-register failed:', err);
    return NextResponse.json({ error: (err as { message?: string })?.message ?? 'Internal server error' }, { status: 500 });
  }
}
