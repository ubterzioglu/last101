import { NextResponse } from 'next/server';
import { withAdmin } from '@/lib/admin/withAuth';
import { slugifyNewsTitle } from '@/lib/news/shared';
import { uploadNewsCoverFile } from '@/lib/news/admin';
import { newsErrorResponse } from '@/lib/news/errors';

export const POST = withAdmin(async (request) => {
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
    return newsErrorResponse(error, 'admin/news/upload');
  }
});
