import { NextResponse } from 'next/server';

/** İstemcinin düzeltebileceği girdi hataları; mesajı olduğu gibi 400 ile döner. */
export class NewsInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NewsInputError';
  }
}

const GENERIC_SERVER_ERROR = 'İşlem sırasında sunucu hatası oluştu.';

/** Kullanıcının düzeltebileceği Postgres hataları; ham DB mesajı yerine güvenli Türkçe mesaj döner. */
function mapDatabaseError(error: unknown): { status: number; message: string } | null {
  if (!error || typeof error !== 'object' || !('code' in error)) return null;
  const { code } = error as { code?: unknown };
  const detail = String((error as { message?: unknown }).message ?? '') + String((error as { details?: unknown }).details ?? '');

  if (code === '23505') {
    return {
      status: 409,
      message: detail.includes('slug') ? 'Bu slug zaten kullanılıyor; farklı bir slug girin.' : 'Bu kayıt zaten mevcut.',
    };
  }
  if (code === '23514') return { status: 400, message: 'Girilen değerlerden biri izin verilen aralıkta değil.' };
  if (code === '22P02') return { status: 400, message: 'Geçersiz kimlik veya değer biçimi.' };
  return null;
}

/**
 * Route'larda ortak hata yanıtı. Girdi hataları 400 döner; diğer hatalar sunucuda loglanır ve
 * istemciye ayrıntı (Supabase/PostgREST mesajı, iç yapı) sızdırılmadan genel mesajla 500 döner.
 */
export function newsErrorResponse(error: unknown, context: string): NextResponse {
  if (error instanceof NewsInputError) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  if (error instanceof SyntaxError) {
    return NextResponse.json({ error: 'Geçersiz JSON gövdesi.' }, { status: 400 });
  }
  const databaseError = mapDatabaseError(error);
  if (databaseError) {
    return NextResponse.json({ error: databaseError.message }, { status: databaseError.status });
  }

  console.error(`[news] ${context} failed:`, error);
  return NextResponse.json({ error: GENERIC_SERVER_ERROR }, { status: 500 });
}
