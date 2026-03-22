import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isAdminAuthorized } from '@/lib/admin/adminAuth';

const MARKER = '[DEVUSER_DIS_V1]';

function normalizeAction(value: unknown): string | null {
  const safe = String(value || '').trim().toLowerCase();
  if (safe === 'approve' || safe === 'pending' || safe === 'delete') return safe;
  return null;
}

async function updateStatusWithFallback(supabase: any, id: string, statuses: string[]) {
  let lastError: unknown = null;

  for (const status of statuses) {
    const { data, error } = await supabase
      .from('feedback_submissions')
      .update({ status })
      .eq('id', id)
      .select('id, status')
      .single();

    if (!error) {
      return { data, error: null };
    }
    lastError = error;
  }

  return { data: null, error: lastError || new Error('Status update failed') };
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  if (body === null) return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });

  const auth = await isAdminAuthorized(request);
  if (!auth.ok) return NextResponse.json({ error: auth.reason }, { status: auth.status });

  const id = String(body.id || '').trim();
  const action = normalizeAction(body.action);

  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
  if (!action) return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'Service not configured' }, { status: 503 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    const { data: targetRow, error: targetError } = await supabase
      .from('feedback_submissions')
      .select('id, message, status')
      .eq('id', id)
      .maybeSingle();

    if (targetError) {
      return NextResponse.json({ error: targetError.message || 'Fetch failed' }, { status: 500 });
    }
    if (!targetRow) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }
    if (!String(targetRow.message || '').startsWith(`${MARKER}\n`)) {
      return NextResponse.json({ error: 'This record does not belong to devuser dis flow' }, { status: 400 });
    }

    if (action === 'delete') {
      const { error } = await supabase
        .from('feedback_submissions')
        .delete()
        .eq('id', id);

      if (error) {
        return NextResponse.json({ error: error.message || 'Delete failed' }, { status: 500 });
      }

      return NextResponse.json({ ok: true, action: 'delete', id });
    }

    if (action === 'pending') {
      const { data, error } = await updateStatusWithFallback(supabase, id, ['pending']);
      if (error) {
        const e = error as Error;
        return NextResponse.json({ error: e.message || 'Update failed' }, { status: 500 });
      }
      return NextResponse.json({ ok: true, action: 'pending', id, status: (data as Record<string, unknown>)?.status || 'pending' });
    }

    const { data, error } = await updateStatusWithFallback(supabase, id, ['read', 'reviewed', 'resolved', 'approved']);
    if (error) {
      const e = error as Error;
      return NextResponse.json({ error: e.message || 'Approve failed' }, { status: 500 });
    }
    return NextResponse.json({ ok: true, action: 'approve', id, status: (data as Record<string, unknown>)?.status || 'read' });
  } catch (error) {
    console.error('devuser-dis-admin-action failed:', error);
    return NextResponse.json({ error: 'Action failed' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
