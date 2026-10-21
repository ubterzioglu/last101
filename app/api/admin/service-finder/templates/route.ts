import { NextResponse } from 'next/server';
import { withAdmin } from '@/lib/admin/withAuth';
import { getServiceFinderClient } from '@/lib/serviceFinder/admin';

export const GET = withAdmin(async (request) => {
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
});
