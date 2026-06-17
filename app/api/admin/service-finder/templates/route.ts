import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthorized } from '@/lib/admin/adminAuth';
import { getServiceFinderClient } from '@/lib/serviceFinder/admin';

export async function GET(request: NextRequest) {
  const auth = await isAdminAuthorized(request);
  if (!auth.ok) return NextResponse.json({ error: auth.reason }, { status: auth.status });

  try {
    const client = getServiceFinderClient();
    const { data, error } = await client
      .from('service_finder_profession_templates')
      .select('id, template_key, label, provider_type, category_group, default_max_queries, default_max_source_urls, default_max_extract_urls, is_active')
      .eq('is_active', true)
      .order('label', { ascending: true });
    if (error) throw error;
    return NextResponse.json({ items: data || [] });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || 'Internal server error' }, { status: 500 });
  }
}
