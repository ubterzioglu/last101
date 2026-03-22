import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isAdminAuthorized } from '@/lib/admin/adminAuth';

const CATEGORY_TABLE: Record<string, string> = {
  tavla: 'tavla_participants',
  vct: 'vct_participants',
  typing: 'typing_participants',
  promote: 'promote_participants',
  cvopt: 'cvopt_participants',
};

const ACTIONS = new Set([
  'approve',
  'unapprove',
  'delete',
  'linkedin_ok',
  'linkedin_pending',
  'cv_ok',
  'cv_pending',
]);

function normalizeCategory(value: unknown): string {
  const category = String(value || '').trim().toLowerCase();
  return Object.prototype.hasOwnProperty.call(CATEGORY_TABLE, category) ? category : '';
}

function normalizeAction(value: unknown): string {
  const action = String(value || '').trim().toLowerCase();
  return ACTIONS.has(action) ? action : '';
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

  const id = String(body.id || '').trim();
  const category = normalizeCategory(body.category);
  const action = normalizeAction(body.action);
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
  if (!category) return NextResponse.json({ error: 'category is required' }, { status: 400 });
  if (!action) return NextResponse.json({ error: 'action is required' }, { status: 400 });
  if (
    category !== 'cvopt' &&
    (action === 'linkedin_ok' || action === 'linkedin_pending' || action === 'cv_ok' || action === 'cv_pending')
  ) {
    return NextResponse.json({ error: 'action is invalid for category' }, { status: 400 });
  }

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'Service not configured' }, { status: 503 });
  }

  const supabase: any = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const participantTable = CATEGORY_TABLE[category];

  try {
    if (category === 'tavla' || category === 'typing') {
      if (action === 'delete' || action === 'unapprove') {
        const bracketTable = category === 'tavla' ? 'tavla_bracket' : 'typing_bracket';
        const { error: bracketError } = await supabase
          .from(bracketTable)
          .delete()
          .eq('participant_id', id);
        if (bracketError) throw bracketError;
      }
    }

    if (action === 'delete') {
      const { error } = await supabase.from(participantTable).delete().eq('id', id);
      if (error) throw error;
      return NextResponse.json({ ok: true, deleted: true });
    }

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (action === 'approve' || action === 'unapprove') {
      updates.approved = action === 'approve';
    } else if (action === 'linkedin_ok' || action === 'linkedin_pending') {
      updates.linkedin_ok = action === 'linkedin_ok';
    } else if (action === 'cv_ok' || action === 'cv_pending') {
      updates.cv_ok = action === 'cv_ok';
    }

    const { data, error } = await supabase
      .from(participantTable)
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    console.error('participant-admin-action failed:', error);
    const e = error as Error;
    return NextResponse.json({ error: e.message || 'Internal server error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
