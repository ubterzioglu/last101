import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { withCornerAdmin } from '@/lib/admin/withAuth';
import { normalizeAuthorSlug } from '@/lib/admin/cornerAuthorAuth';
import { tryCreateServiceClient } from '@/lib/supabase/admin';

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
  ['image/gif', 'gif'],
]);

function getFileExtension(file: File): string {
  const byType = ALLOWED_TYPES.get(file.type);
  if (!byType) return '';
  const extension = file.name.toLowerCase().match(/\.[a-z0-9]+$/)?.[0]?.slice(1) || '';
  if (!extension) return byType;
  return extension === 'jpeg' ? 'jpg' : extension;
}

function isAllowedExtension(extension: string): boolean {
  return ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(extension);
}

export const POST = withCornerAdmin(async (request) => {
  const supabase = tryCreateServiceClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Service not configured' }, { status: 503 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const folder = String(formData.get('folder') || 'posts').trim() === 'profile' ? 'profile' : 'posts';
    const authorSlug = normalizeAuthorSlug(formData.get('authorSlug')) || 'admin';

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'file is required' }, { status: 400 });
    }

    const extension = getFileExtension(file);
    if (!ALLOWED_TYPES.has(file.type) || !isAllowedExtension(extension)) {
      return NextResponse.json({ error: 'Sadece JPG, PNG, WEBP veya GIF görsel yüklenebilir.' }, { status: 400 });
    }

    if (file.size < 1 || file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: 'Görsel boyutu 5 MB altında olmalı.' }, { status: 400 });
    }

    const objectPath = `authors/${authorSlug}/${folder}/${new Date().toISOString().slice(0, 10)}/${randomUUID()}.${extension}`;
    const bytes = await file.arrayBuffer();

    const { error } = await supabase.storage
      .from('corner')
      .upload(objectPath, bytes, {
        contentType: file.type,
        cacheControl: '31536000',
        upsert: false,
      });

    if (error) throw error;

    const { data } = supabase.storage.from('corner').getPublicUrl(objectPath);
    return NextResponse.json({ ok: true, url: data.publicUrl, path: objectPath });
  } catch (error) {
    console.error('corner-admin-upload failed:', error);
    const e = error as Error;
    return NextResponse.json({ error: e.message || 'Upload failed' }, { status: 500 });
  }
});

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
