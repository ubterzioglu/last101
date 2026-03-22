import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const MARKER = '[DEVUSER_DIS_V1]';
const APPROVED_STATUSES = ['read', 'reviewed', 'resolved', 'approved'];

function repairText(input: unknown): string {
  const value = String(input ?? '').normalize('NFC');
  const looksMojibake = /Ã.|Ä.|Å.|â.|ð.|Ð.|Þ.|/u.test(value);
  if (!looksMojibake) return value;
  try {
    const repaired = Buffer.from(value, 'latin1').toString('utf8').normalize('NFC');
    const stillBroken = /Ã.|Ä.|Å.|â.|ð.|Ð.|Þ.|/u.test(repaired);
    return stillBroken ? value : repaired;
  } catch {
    return value;
  }
}

function parseMessage(message: string): { topic: string; anonymous: boolean; full_name: string | null } | null {
  const raw = String(message ?? '');
  if (!raw.startsWith(`${MARKER}\n`)) return null;
  const lines = raw.split('\n');
  if (lines.length < 5) return null;

  const anonymousLine = lines[1] ?? '';
  const fullNameLine = lines[2] ?? '';
  const topicStartLine = lines[3] ?? '';

  if (!anonymousLine.startsWith('anonim:')) return null;
  if (!fullNameLine.startsWith('ad_soyad:')) return null;
  if (topicStartLine.trim() !== 'konu:') return null;

  const anonymous = anonymousLine.slice('anonim:'.length).trim() === '1';
  const fullName = repairText(fullNameLine.slice('ad_soyad:'.length).trim());
  const topic = repairText(lines.slice(4).join('\n').trim());
  if (!topic) return null;

  return { topic: topic.slice(0, 250), anonymous, full_name: anonymous ? null : fullName };
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function GET(request: NextRequest) {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'Service not configured' }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const limit = Math.min(Math.max(parseInt(searchParams.get('limit') ?? '40', 10) || 40, 1), 200);
  const fetchLimit = Math.min(limit * 5, 500);

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    const { data, error } = await supabase
      .from('feedback_submissions')
      .select('id, message, status, created_at')
      .in('status', APPROVED_STATUSES)
      .order('created_at', { ascending: false })
      .limit(fetchLimit);

    if (error) {
      console.error('devuser-dis-list query failed:', error);
      return NextResponse.json({ error: 'Failed to list topics' }, { status: 500 });
    }

    const items: { id: string; topic: string; anonymous: boolean; full_name: string | null; created_at: string }[] = [];
    for (const row of data ?? []) {
      const parsed = parseMessage(row.message);
      if (!parsed) continue;
      items.push({ id: row.id, topic: parsed.topic, anonymous: parsed.anonymous, full_name: parsed.full_name, created_at: row.created_at });
      if (items.length >= limit) break;
    }

    return NextResponse.json({ ok: true, items });
  } catch (err) {
    console.error('devuser-dis-list failed:', err);
    return NextResponse.json({ error: 'List failed' }, { status: 500 });
  }
}
