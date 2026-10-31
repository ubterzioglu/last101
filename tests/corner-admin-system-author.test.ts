import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

interface Recorded {
  table: string;
  op: 'select' | 'update' | 'delete';
  payload?: Record<string, unknown>;
}

const mocks = vi.hoisted(() => ({
  existing: null as Record<string, unknown> | null,
  recorded: [] as Array<{ table: string; op: string; payload?: Record<string, unknown> }>,
  revalidated: [] as string[],
}));

function createFakeSupabase() {
  return {
    from(table: string) {
      let op: Recorded['op'] = 'select';
      let payload: Record<string, unknown> | undefined;
      const builder = {
        select() {
          return builder;
        },
        update(values: Record<string, unknown>) {
          op = 'update';
          payload = values;
          return builder;
        },
        delete() {
          op = 'delete';
          return builder;
        },
        eq() {
          return builder;
        },
        async maybeSingle() {
          mocks.recorded.push({ table, op, payload });
          if (op === 'update') return { data: { ...mocks.existing, ...payload }, error: null };
          return { data: mocks.existing, error: null };
        },
        then(resolve: (value: { error: null }) => void) {
          mocks.recorded.push({ table, op, payload });
          resolve({ error: null });
        },
      };
      return builder;
    },
  };
}

vi.mock('@/lib/admin/cornerAuth', () => ({
  isCornerAdminAuthorized: async () => ({ ok: true, reason: '', status: 200 }),
}));

vi.mock('@/lib/admin/cornerAuthorAuth', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/lib/admin/cornerAuthorAuth')>();
  return { ...original, getSupabaseServiceClient: async () => createFakeSupabase() };
});

vi.mock('next/cache', () => ({
  revalidatePath: (path: string) => {
    mocks.revalidated.push(path);
  },
}));

import { POST } from '@/app/api/corner-admin-action/route';

async function call(body: Record<string, unknown>) {
  const request = new NextRequest('http://localhost/api/corner-admin-action', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'content-type': 'application/json' },
  });
  const response = await POST(request, undefined);
  return { status: response.status, json: (await response.json()) as Record<string, unknown> };
}

const SYSTEM_AUTHOR = { id: 'a-1', slug: 'almanya101', display_name: 'Almanya101' };
const NORMAL_AUTHOR = { id: 'a-2', slug: 'didem', display_name: 'Didem' };

function writes(op: Recorded['op']) {
  return mocks.recorded.filter((entry) => entry.op === op);
}

beforeEach(() => {
  mocks.existing = null;
  mocks.recorded = [];
  mocks.revalidated = [];
});

describe('corner-admin-action: system author', () => {
  it('allows updating name, bio and avatar and keeps the stored slug', async () => {
    mocks.existing = SYSTEM_AUTHOR;
    const { status } = await call({
      action: 'update_author',
      id: 'a-1',
      displayName: 'Almanya101',
      slug: 'baska-bir-slug',
      shortBio: 'Yeni kısa bio',
      avatarImageUrl: '/almanya101.png',
      displayOrder: 9999,
    });

    expect(status).toBe(200);
    const [update] = writes('update');
    expect(update.payload).toMatchObject({
      display_name: 'Almanya101',
      short_bio: 'Yeni kısa bio',
      avatar_image_url: '/almanya101.png',
      display_order: 9999,
    });
    expect(update.payload).not.toHaveProperty('slug');
  });

  it('ignores the slug even when it is the reserved system slug itself', async () => {
    mocks.existing = SYSTEM_AUTHOR;
    const { status } = await call({
      action: 'update_author',
      id: 'a-1',
      displayName: 'Almanya101',
      slug: 'almanya101',
    });

    expect(status).toBe(200);
    expect(writes('update')[0].payload).not.toHaveProperty('slug');
  });

  it('rejects deleting the system author', async () => {
    mocks.existing = SYSTEM_AUTHOR;
    const { status, json } = await call({ action: 'delete_author', id: 'a-1' });

    expect(status).toBe(403);
    expect(json.error).toBe('Sistem yazarı silinemez.');
    expect(writes('delete')).toHaveLength(0);
  });

  it('rejects deactivating the system author but allows activating it', async () => {
    mocks.existing = SYSTEM_AUTHOR;
    const denied = await call({ action: 'set_author_active', id: 'a-1', isActive: false });
    expect(denied.status).toBe(403);
    expect(denied.json.error).toBe('Sistem yazarı pasife alınamaz.');
    expect(writes('update')).toHaveLength(0);

    const allowed = await call({ action: 'set_author_active', id: 'a-1', isActive: true });
    expect(allowed.status).toBe(200);
    expect(writes('update')).toHaveLength(1);
  });
});

describe('corner-admin-action: regular authors', () => {
  it('still rejects renaming a regular author to a reserved slug', async () => {
    mocks.existing = NORMAL_AUTHOR;
    const { status } = await call({
      action: 'update_author',
      id: 'a-2',
      displayName: 'Didem',
      slug: 'almanya101',
    });

    expect(status).toBe(400);
    expect(writes('update')).toHaveLength(0);
  });

  it('updates the slug of a regular author', async () => {
    mocks.existing = NORMAL_AUTHOR;
    const { status } = await call({
      action: 'update_author',
      id: 'a-2',
      displayName: 'Didem',
      slug: 'didem-yeni',
    });

    expect(status).toBe(200);
    expect(writes('update')[0].payload).toMatchObject({ slug: 'didem-yeni' });
  });

  it('returns 404 when the author to update does not exist', async () => {
    const { status } = await call({ action: 'update_author', id: 'missing', displayName: 'X', slug: 'xx' });
    expect(status).toBe(404);
  });

  it('deletes and deactivates regular authors', async () => {
    mocks.existing = NORMAL_AUTHOR;
    expect((await call({ action: 'delete_author', id: 'a-2' })).status).toBe(200);
    expect(writes('delete')).toHaveLength(1);
    expect((await call({ action: 'set_author_active', id: 'a-2', isActive: false })).status).toBe(200);
  });
});

describe('corner-admin-action: cache revalidation', () => {
  it('revalidates the blog hub and the author page after a write', async () => {
    mocks.existing = NORMAL_AUTHOR;
    await call({ action: 'update_author', id: 'a-2', displayName: 'Didem', slug: 'didem' });

    expect(mocks.revalidated).toContain('/blog');
    expect(mocks.revalidated).toContain('/blog/yazar/didem');
  });

  it('does not revalidate when the request is rejected', async () => {
    mocks.existing = SYSTEM_AUTHOR;
    await call({ action: 'delete_author', id: 'a-1' });
    expect(mocks.revalidated).toEqual([]);
  });
});
