import { NextRequest, NextResponse } from 'next/server';
import { getAdminActor, isAdminAuthorized } from '@/lib/admin/adminAuth';
import {
  createAdminPost,
  deleteAdminPost,
  getAdminPostDetail,
  mapAdminPostToLegacy,
  setAdminPostFeatured,
  setAdminPostStatus,
  updateAdminPost,
} from '@/lib/news/admin';
import { NEWS_STATUSES, normalizeNewsCategory, normalizeNewsStatus } from '@/lib/news/shared';
import { newsErrorResponse } from '@/lib/news/errors';

function legacyCategoryToCanonical(value: unknown) {
  return normalizeNewsCategory(value);
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

  const action = String(body.action || '').trim().toLowerCase();
  const id = String(body.id || '').trim();

  try {
    if (action === 'create') {
      const item = await createAdminPost(getAdminActor(auth), {
        ...body,
        category: legacyCategoryToCanonical(body.category),
        cover_image_url: body.coverImageUrl,
        source_name: body.sourceName,
        source_url: body.sourceUrl,
        reading_minutes: body.readingMinutes,
        show_in_carousel: body.showInCarousel,
      });
      return NextResponse.json({ ok: true, action: 'create', data: mapAdminPostToLegacy(item) }, { status: 201 });
    }

    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

    if (action === 'update') {
      const item = await updateAdminPost(getAdminActor(auth), id, {
        ...body,
        category: legacyCategoryToCanonical(body.category),
        cover_image_url: body.coverImageUrl,
        source_name: body.sourceName,
        source_url: body.sourceUrl,
        reading_minutes: body.readingMinutes,
        show_in_carousel: body.showInCarousel,
      });
      if (!item) return NextResponse.json({ error: 'Record not found' }, { status: 404 });
      return NextResponse.json({ ok: true, action: 'update', data: mapAdminPostToLegacy(item) });
    }

    if (action === 'delete') {
      const deleted = await deleteAdminPost(getAdminActor(auth), id);
      if (!deleted) return NextResponse.json({ error: 'Record not found' }, { status: 404 });
      return NextResponse.json({ ok: true, action: 'delete', id });
    }

    if (action === 'set_category') {
      const current = await getAdminPostDetail(id);
      if (!current) return NextResponse.json({ error: 'Record not found' }, { status: 404 });
      const item = await updateAdminPost(getAdminActor(auth), id, { ...current.post, category: legacyCategoryToCanonical(body.category) });
      if (!item) return NextResponse.json({ error: 'Record not found' }, { status: 404 });
      return NextResponse.json({ ok: true, action: 'set_category', data: mapAdminPostToLegacy(item) });
    }

    if (action === 'set_status') {
      // Eskiden published dışındaki her değer (rejected/archived dahil) sessizce draft'a dönüyordu.
      const requestedStatus = String(body.status || '').trim().toLowerCase();
      if (!(NEWS_STATUSES as string[]).includes(requestedStatus)) {
        return NextResponse.json({ error: `status must be one of ${NEWS_STATUSES.join(', ')}` }, { status: 400 });
      }
      const item = await setAdminPostStatus(getAdminActor(auth), id, normalizeNewsStatus(requestedStatus));
      if (!item) return NextResponse.json({ error: 'Record not found' }, { status: 404 });
      return NextResponse.json({ ok: true, action: 'set_status', data: mapAdminPostToLegacy(item) });
    }

    if (action === 'set_carousel') {
      const current = await getAdminPostDetail(id);
      if (!current) return NextResponse.json({ error: 'Record not found' }, { status: 404 });
      const item = await updateAdminPost(getAdminActor(auth), id, {
        ...current.post,
        show_in_carousel: Boolean(body.showInCarousel),
      });
      if (!item) return NextResponse.json({ error: 'Record not found' }, { status: 404 });
      return NextResponse.json({ ok: true, action: 'set_carousel', data: mapAdminPostToLegacy(item) });
    }

    if (action === 'feature') {
      const item = await setAdminPostFeatured(getAdminActor(auth), id, {
        isFeatured: Boolean(body.isFeatured ?? true),
        featuredRank: Number(body.featuredRank || 1),
      });
      if (!item) return NextResponse.json({ error: 'Record not found' }, { status: 404 });
      return NextResponse.json({ ok: true, action: 'feature', data: mapAdminPostToLegacy(item) });
    }

    return NextResponse.json({ error: 'Unsupported action' }, { status: 400 });
  } catch (error) {
    return newsErrorResponse(error, 'news-admin-action');
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
