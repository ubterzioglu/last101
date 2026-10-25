import 'server-only';

import { cookies } from 'next/headers';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';

/**
 * Sunucu tarafı oturum kontrolü: araç sayfaları anonim ziyaretçiye açık
 * tanıtım içeriği, oturum açmış kullanıcıya etkileşimli aracı gösterir.
 *
 * `cookies()` her koşulda çağrılır; böylece bu yardımcıyı kullanan rotalar
 * ortam değişkeni eksik olsa bile asla statik önbelleğe alınmaz ve giriş
 * yapmış kullanıcıya bayat anonim içerik sunulmaz.
 *
 * Not: Bu bir yetki denetimi değildir. Kişisel hesaplama ve sonuç API'leri
 * kendi yetki kontrollerini yapmaya devam eder.
 */
export async function getToolUser(): Promise<User | null> {
  await cookies();

  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    return data.user ?? null;
  } catch {
    return null;
  }
}
