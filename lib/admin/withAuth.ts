import { NextResponse, type NextRequest } from 'next/server';
import { isAdminAuthorized, type AdminAuthResult } from '@/lib/admin/adminAuth';
import { isCornerAdminAuthorized, type CornerAuthResult } from '@/lib/admin/cornerAuth';

/** Tüm auth kontrollerinin (admin, corner admin, corner yazar) ortak sonuç şekli. */
export interface AuthCheckResult {
  ok: boolean;
  reason: string;
  status: number;
  retryAfterSeconds?: number;
}

/**
 * Başarısız auth için standart yanıt: `{ error: reason }` + status; rate limit durumunda Retry-After.
 * Route'lardaki `NextResponse.json({ error: auth.reason }, { status: auth.status })` kalıbının yerine geçer.
 */
export function authFailureResponse(result: AuthCheckResult): NextResponse {
  const headers: Record<string, string> = {};
  if (result.retryAfterSeconds && result.retryAfterSeconds > 0) {
    headers['Retry-After'] = String(result.retryAfterSeconds);
  }
  return NextResponse.json({ error: result.reason }, { status: result.status, headers });
}

type RouteHandler<Context, Auth> = (request: NextRequest, context: Context, auth: Auth) => Promise<Response> | Response;

/**
 * Route handler'ı bir auth kontrolüyle sarar: kontrol başarısızsa handler çalışmadan standart hata
 * yanıtı döner; başarılıysa doğrulanmış auth sonucu handler'a üçüncü argüman olarak verilir.
 */
export function withAuth<Auth extends AuthCheckResult, Context = unknown>(
  check: (request: NextRequest) => Promise<Auth>,
  handler: RouteHandler<Context, Auth>
): (request: NextRequest, context: Context) => Promise<Response> {
  return async (request, context) => {
    const auth = await check(request);
    if (!auth.ok) return authFailureResponse(auth);
    return handler(request, context, auth);
  };
}

/** Admin paneli API'leri için: `export const GET = withAdmin(async (request, context, auth) => ...)`. */
export function withAdmin<Context = unknown>(handler: RouteHandler<Context, AdminAuthResult>) {
  return withAuth<AdminAuthResult, Context>(isAdminAuthorized, handler);
}

/** Köşe yazısı admin API'leri için. */
export function withCornerAdmin<Context = unknown>(handler: RouteHandler<Context, CornerAuthResult>) {
  return withAuth<CornerAuthResult, Context>(isCornerAdminAuthorized, handler);
}
