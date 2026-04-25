import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import { isCornerAuthorAuthorized } from '@/lib/admin/cornerAuthorAuth';

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
  ['image/gif', 'gif'],
]);

function normalizeEnvValue(value: unknown): string {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) return raw.slice(1, -1).trim();
  return raw;
}

function getFileExtension(file: File): string {
  const byType = ALLOWED_TYPES.get(file.type);
  if (!byType) return '';
  const extension = file.name.toLowerCase().match(/\.[a-z0-9]+$/)?.[0]?.slice(1) || '';
  if (!extension) return byType;
  return extension === 'jpeg' ? 'jpg' : extension;
}

export async function POST(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug');
  const auth = await isCornerAuthorAuthorized(request, slug);
  if (!auth.ok) return NextResponse.json({ error: auth.reason }, { status: auth.status });

  const supabaseUrl = normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const serviceRoleKey = normalizeEnvValue(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SECRET_KEY || '');
  if (!supabaseUrl || !serviceRoleKey) return NextResponse.json({ error: 'Service not configured' }, { status: 503 });

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const folder = String(formData.get('folder') || 'posts').trim() === 'profile' ? 'profile' : 'posts';
    if (!(file instanceof File)) return NextResponse.json({ error: 'file is required' }, { status: 400 });

    const extension = getFileExtension(file);
    if (!ALLOWED_TYPES.has(file.type) || !['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(extension)) {
      return NextResponse.json({ error: 'Sadece JPG, PNG, WEBP veya GIF görsel yüklenebilir.' }, { status: 400 });
    }
    if (file.size < 1 || file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: 'Görsel boyutu 5 MB altında olmalı.' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const objectPath = `authors/${auth.author?.slug}/${folder}/${new Date().toISOString().slice(0, 10)}/${randomUUID()}.${extension}`;
    const { error } = await supabase.storage.from('corner').upload(objectPath, await file.arrayBuffer(), {
      contentType: file.type,
      cacheControl: '31536000',
      upsert: false,
    });
    if (error) throw error;

    const { data } = supabase.storage.from('corner').getPublicUrl(objectPath);
    return NextResponse.json({ ok: true, url: data.publicUrl, path: objectPath });
  } catch (error) {
    console.error('corner-author-upload failed:', error);
    const e = error as Error;
    return NextResponse.json({ error: e.message || 'Upload failed' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
