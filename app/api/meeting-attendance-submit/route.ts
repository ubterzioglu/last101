import { NextRequest, NextResponse } from 'next/server';
import { tryCreateServiceClient } from '@/lib/supabase/admin';

function sanitizeName(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.replace(/[\x00-\x1F\x7F]/g, '').trim().slice(0, 120);
}

function sanitizeWhatsapp(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim().slice(0, 32);
}

function sanitizeArray(value: unknown, maxItems = 10): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => typeof item === 'string')
    .map((item) => (item as string).replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim())
    .filter(Boolean)
    .slice(0, maxItems);
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function POST(request: NextRequest) {
  const supabase = tryCreateServiceClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Service not configured' }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const fullName = sanitizeName(body.full_name);
  if (!fullName) {
    return NextResponse.json({ error: 'Ad soyad gerekli' }, { status: 400 });
  }

  const whatsapp = sanitizeWhatsapp(body.whatsapp);
  if (!whatsapp) {
    return NextResponse.json({ error: 'WhatsApp numarası gerekli' }, { status: 400 });
  }

  const availableDates = sanitizeArray(body.available_dates, 10);
  if (availableDates.length === 0) {
    return NextResponse.json({ error: 'En az bir tarih seçilmeli' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('meeting_attendance')
      .insert([{ full_name: fullName, whatsapp, available_dates: availableDates }])
      .select('id')
      .single();

    if (error) throw error;
    return NextResponse.json({ ok: true, id: data?.id ?? null }, { status: 201 });
  } catch (err) {
    console.error('meeting-attendance-submit failed:', err);
    const msg = (err as { message?: string })?.message ?? 'Internal server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
