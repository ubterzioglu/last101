import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isAdminAuthorized } from '@/lib/admin/adminAuth';

export async function GET(request: NextRequest) {
  try {
    if (!(await isAdminAuthorized(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // Base query
    let query = supabase
      .from('recruitment_agencies')
      .select('id, name, url, description, category, status, created_at, updated_at')
      .order('created_at', { ascending: false });

    // Apply filters
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (search && search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      query = query.or(`name.ilike.${searchTerm},description.ilike.${searchTerm},url.ilike.${searchTerm}`);
    }

    const { data: agencies, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    // Get stats
    const { data: statsData, error: statsError } = await supabase
      .from('recruitment_agencies')
      .select('status');

    let stats = { total: 0, active: 0, inactive: 0 };
    if (!statsError && statsData) {
      stats.total = statsData.length;
      stats.active = statsData.filter(item => item.status === 'active').length;
      stats.inactive = statsData.filter(item => item.status === 'inactive').length;
    }

    return NextResponse.json({
      agencies: agencies || [],
      stats,
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}