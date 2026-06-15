import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthorized } from '@/lib/admin/adminAuth';
import { slugifyNewsTitle } from '@/lib/news/shared';
import { uploadNewsCoverFile } from '@/lib/news/admin';

export async function POST(request: NextRequest) {
  const auth = await isAdminAuthorized(request);
  if (!auth.ok) return NextResponse.json({ error: auth.reason }, { status: auth.status });

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const slugSource = String(formData.get('slug') || 'haber').trim();
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'file is required' }, { status: 400 });
    }

    const safeSlug = slugifyNewsTitle(slugSource) || 'haber';
    const uploaded = await uploadNewsCoverFile({
      fileName: file.name,
      file: await file.arrayBuffer(),
      contentType: file.type,
      slug: safeSlug,
    });

    return NextResponse.json(uploaded, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || 'Internal server error' }, { status: 500 });
  }
}
