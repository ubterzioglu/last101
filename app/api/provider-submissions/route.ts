import { NextRequest, NextResponse } from 'next/server';
import { tryCreateServiceClient } from '@/lib/supabase/admin';

const ALLOWED_TYPES = new Set([
  'doctor',
  'lawyer',
  'terapist',
  'ebe',
  'nakliyat',
  'sigorta',
  'vergi_danismani',
  'berber',
  'kuafor',
  'surucu_kursu',
  'tamirci_otomobil',
  'tamirci_tesisat',
  'tamirci_boyaci',
]);

function truncate(value: unknown, maxLength: number) {
  return String(value || '').trim().slice(0, maxLength);
}

function normalizeType(value: unknown) {
  const safe = String(value || '').trim();
  return ALLOWED_TYPES.has(safe) ? safe : '';
}

function normalizeUrl(value: unknown) {
  const raw = truncate(value, 400);
  if (!raw) return '';
  if (/^https?:\/\//i.test(raw)) return raw;
  if (/^www\./i.test(raw)) return `https://${raw}`;
  return raw;
}

export async function POST(request: NextRequest) {
  const supabase = tryCreateServiceClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Service not configured' }, { status: 503 });
  }

  try {
    const body = await request.json();
    const type = normalizeType(body?.type);
    const displayName = truncate(body?.displayName, 160);
    const city = truncate(body?.city, 120);
    const address = truncate(body?.address, 240);
    const phone = truncate(body?.phone, 60);
    const website = normalizeUrl(body?.website);
    const tagLabels = truncate(body?.tagLabels, 240);
    const googleMapsUrl = normalizeUrl(body?.googleMapsUrl);
    const note = truncate(body?.note, 1200);

    if (!type || !displayName || !city) {
      return NextResponse.json(
        { error: 'Tür, ad soyad ve şehir alanları zorunludur.' },
        { status: 400 }
      );
    }

    const { error } = await supabase.from('provider_submissions').insert({
      type,
      display_name: displayName,
      city,
      address: address || null,
      phone: phone || null,
      website: website || null,
      tag_labels: tagLabels || null,
      google_maps_url: googleMapsUrl || null,
      note: note || null,
      status: 'pending',
    });

    if (error) throw error;

    return NextResponse.json({
      ok: true,
      message: 'Öneriniz alındı. Admin onayından sonra yayına alınacak.',
    });
  } catch (error) {
    console.error('provider-submissions POST failed:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
