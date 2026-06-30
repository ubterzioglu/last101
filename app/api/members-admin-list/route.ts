import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isAdminAuthorized } from '@/lib/admin/adminAuth';

export const dynamic = 'force-dynamic';

// devuser-admin-list ile tutarlı: service client tipini gevşek tutuyoruz çünkü
// supabase-js'in jenerik dönüş tipi auth.admin + from() zincirinde çakışıyor.
type SupabaseClient = ReturnType<typeof createClient<any>>;

function normalizeLimit(value: unknown, fallback: number, max: number): number {
  const parsed = Number.parseInt(String(value || ''), 10);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return Math.min(parsed, max);
}

interface AuthUserRow {
  id: string;
  email: string | null;
  created_at: string | null;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
  provider: string | null;
  has_devuser_profile: boolean;
}

interface DevUserRow {
  id: string;
  user_id: string | null;
  login_email: string | null;
  ad_soyad: string | null;
  sehir: string | null;
  rol: string | null;
  approval_status: string;
  created_at: string | null;
}

function deriveProvider(user: Record<string, unknown>): string | null {
  const identities = user?.identities;
  if (Array.isArray(identities) && identities.length > 0) {
    const providers = identities
      .map((identity) => (identity as Record<string, unknown>)?.provider)
      .filter((p): p is string => typeof p === 'string');
    if (providers.length > 0) return providers.join(', ');
  }
  const appMeta = user?.app_metadata as Record<string, unknown> | undefined;
  const provider = appMeta?.provider;
  return typeof provider === 'string' ? provider : null;
}

async function fetchAllAuthUsers(supabase: SupabaseClient, maxUsers: number): Promise<Record<string, unknown>[]> {
  const collected: Record<string, unknown>[] = [];
  const perPage = 200;
  let page = 1;

  while (collected.length < maxUsers) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    const users = (data?.users ?? []) as unknown as Record<string, unknown>[];
    collected.push(...users);
    if (users.length < perPage) break;
    page += 1;
    if (page > 50) break; // hard cap (10k users) güvenlik amaçlı
  }

  return collected.slice(0, maxUsers);
}

export async function GET(request: NextRequest) {
  const auth = await isAdminAuthorized(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.reason }, { status: auth.status });
  }

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'Service not configured' }, { status: 503 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const limit = normalizeLimit(request.nextUrl.searchParams.get('limit'), 500, 5000);

  try {
    // 1) devuser profillerini çek (en yeni önce)
    const { data: devuserData, error: devuserError } = await supabase
      .from('devuser')
      .select('id, user_id, login_email, ad_soyad, sehir, rol, approval_status, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (devuserError) throw devuserError;

    const devusers = (Array.isArray(devuserData) ? devuserData : []) as DevUserRow[];
    const devuserByUserId = new Set(
      devusers.map((row) => row.user_id).filter((id): id is string => Boolean(id)),
    );

    // 2) Supabase auth.users listesini çek
    const authUsersRaw = await fetchAllAuthUsers(supabase, limit);
    const authUsers: AuthUserRow[] = authUsersRaw.map((user) => {
      const id = String(user.id ?? '');
      return {
        id,
        email: typeof user.email === 'string' ? user.email : null,
        created_at: typeof user.created_at === 'string' ? user.created_at : null,
        last_sign_in_at: typeof user.last_sign_in_at === 'string' ? user.last_sign_in_at : null,
        email_confirmed_at:
          typeof user.email_confirmed_at === 'string' ? user.email_confirmed_at : null,
        provider: deriveProvider(user),
        has_devuser_profile: devuserByUserId.has(id),
      };
    });

    // En yeni önce sırala (created_at'e göre)
    authUsers.sort((a, b) => {
      const ta = a.created_at ? Date.parse(a.created_at) : 0;
      const tb = b.created_at ? Date.parse(b.created_at) : 0;
      return tb - ta;
    });

    const pendingDevusers = devusers.filter(
      (row) => String(row.approval_status || 'pending').toLowerCase() === 'pending',
    ).length;

    return NextResponse.json({
      authUsers,
      devusers,
      stats: {
        totalAuthUsers: authUsers.length,
        totalDevusers: devusers.length,
        pendingDevusers,
        withoutProfile: authUsers.filter((u) => !u.has_devuser_profile).length,
      },
    });
  } catch (error) {
    console.error('members-admin-list failed:', error);
    const e = error as Error;
    return NextResponse.json({ error: e.message || 'Internal server error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
