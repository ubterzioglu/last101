import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isAdminAuthorized } from '@/lib/admin/adminAuth';

function normalizeOptionalString(value: unknown): string | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  return value.trim();
}

function normalizeRequiredString(value: unknown): string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error('Required field is missing or empty');
  }
  return value.trim();
}

function normalizeStatus(value: unknown): 'active' | 'inactive' {
  return value === 'active' ? 'active' : 'inactive';
}

export async function POST(request: NextRequest) {
  try {
    if (!(await isAdminAuthorized(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    const body = await request.json();
    const action = body.action;

    if (action === 'create') {
      const name = normalizeRequiredString(body.name);
      const url = normalizeRequiredString(body.url);
      const description = normalizeRequiredString(body.description);
      const category = normalizeOptionalString(body.category);
      const status = normalizeStatus(body.status);

      const { data: newAgency, error } = await supabase
        .from('recruitment_agencies')
        .insert([
          {
            name,
            url,
            description,
            category: category || null,
            status,
          }
        ])
        .select('id, name, url, description, category, status, created_at, updated_at')
        .single();

      if (error) {
        console.error('Create error:', error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
      }

      return NextResponse.json({ agency: newAgency });

    } else if (action === 'update') {
      const id = normalizeRequiredString(body.id);
      const name = normalizeRequiredString(body.name);
      const url = normalizeRequiredString(body.url);
      const description = normalizeRequiredString(body.description);
      const category = normalizeOptionalString(body.category);
      const status = normalizeStatus(body.status);

      const { data: updatedAgency, error } = await supabase
        .from('recruitment_agencies')
        .update({
          name,
          url,
          description,
          category: category || null,
          status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select('id, name, url, description, category, status, created_at, updated_at')
        .single();

      if (error) {
        console.error('Update error:', error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
      }

      return NextResponse.json({ agency: updatedAgency });

    } else if (action === 'delete') {
      const id = normalizeRequiredString(body.id);

      const { error } = await supabase
        .from('recruitment_agencies')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Delete error:', error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
      }

      return NextResponse.json({ success: true });

    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}