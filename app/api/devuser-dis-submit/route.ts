import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const MARKER = '[DEVUSER_DIS_V1]';
const MAX_NAME_LENGTH = 80;
const MAX_TOPIC_LENGTH = 250;
const MIN_TOPIC_LENGTH = 3;

function asBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const n = value.trim().toLowerCase();
    return n === 'true' || n === '1' || n === 'yes';
  }
  return false;
}

function cleanSingleLine(value: unknown, maxLength: number): string {
  return String(value ?? '')
    .normalize('NFC')
    .replace(/\r?\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function cleanTopic(value: unknown): string {
  return String(value ?? '')
    .normalize('NFC')
    .replace(/\r\n/g, '\n')
    .trim()
    .slice(0, MAX_TOPIC_LENGTH);
}

function buildMessage(topic: string, fullName: string, anonymous: boolean): string {
  return [MARKER, `anonim:${anonymous ? '1' : '0'}`, `ad_soyad:${anonymous ? '' : fullName}`, 'konu:', topic].join('\n');
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

  // Honeypot
  if (body.website || body.email) {
    return NextResponse.json({ error: 'Nope.' }, { status: 400 });
  }

  const anonymous = asBoolean(body.anonymous);
  const fullName = cleanSingleLine(body.full_name, MAX_NAME_LENGTH);
  const topic = cleanTopic(body.topic);

  if (!anonymous && !fullName) {
    return NextResponse.json({ error: 'Ad soyad zorunlu (anonim değilse).' }, { status: 400 });
  }
  if (!topic) {
    return NextResponse.json({ error: 'Konu zorunlu.' }, { status: 400 });
  }
  if (topic.length < MIN_TOPIC_LENGTH) {
    return NextResponse.json({ error: `Konu çok kısa (min ${MIN_TOPIC_LENGTH} karakter).` }, { status: 400 });
  }

  const message = buildMessage(topic, fullName, anonymous);
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? '';
  const ipHash = forwarded ? Buffer.from(forwarded).toString('base64').slice(0, 16) : null;
  const userAgent = (request.headers.get('user-agent') ?? '').slice(0, 255);

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    const { data, error } = await supabase
      .from('feedback_submissions')
      .insert([{ message, ip_hash: ipHash, user_agent: userAgent, status: 'pending' }])
      .select('id')
      .single();

    if (error) {
      console.error('devuser-dis-submit insert failed:', error);
      return NextResponse.json({ error: 'Failed to save topic' }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id: data?.id ?? null });
  } catch (err) {
    console.error('devuser-dis-submit failed:', err);
    return NextResponse.json({ error: 'Submit failed' }, { status: 500 });
  }
}
