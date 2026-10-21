// PostgREST `.or()` filtre yardımcıları. Dış bağımlılık yok (Deno ve Node'da çalışır).
// Supabase CLI yalnızca fonksiyon dizinindeki dosyaları paketlediği için `lib/` içinden import edilemez.
// `buildIlikeOrFilter`, aslı `lib/news/search.ts` olan fonksiyonun birebir kopyasıdır; ikisinin aynı
// çıktıyı verdiğini `tests/postgrest-filter-escaping.test.ts` doğrular. Aslı değişirse bu kopya da güncellenmelidir.

/**
 * PostgREST `.or()` filtresi için güvenli ilike ifadesi üretir.
 * 1) LIKE düzeyi: `%`, `_` ve `\` kaçışlanır, `*` (PostgREST'te `%` takma adı) atılır; arama terimi
 *    joker karakter olarak değil düz metin olarak aranır.
 * 2) PostgREST düzeyi: değer çift tırnak içine alınır; böylece virgül/parantez yeni filtre koşulu
 *    açamaz. Tırnak ve ters bölü PostgREST kuralına göre ters bölü ile kaçışlanır.
 */
export function buildIlikeOrFilter(columns: readonly string[], term: string): string {
  const likeLiteral = term.replace(/\*/g, '').replace(/[\\%_]/g, '\\$&');
  const quoted = `"%${likeLiteral.replace(/[\\"]/g, '\\$&')}%"`;
  return columns.map((column) => `${column}.ilike.${quoted}`).join(',');
}

/**
 * PostgREST `.or()` filtresi için güvenli "dizi bu öğeyi içerir" (`cs`) ifadesi üretir; dizi
 * kolonlarında ilike kullanılamadığı için `buildIlikeOrFilter`'ın dizi karşılığıdır.
 * 1) Postgres dizi düzeyi: öğe çift tırnak içine alınır, tırnak ve ters bölü ters bölü ile kaçışlanır;
 *    böylece virgül veya süslü parantez yeni dizi öğesi açamaz.
 * 2) PostgREST düzeyi: dizi değeri `buildIlikeOrFilter` ile aynı kuralla çift tırnak içine alınır.
 */
export function buildArrayContainsOrFilter(columns: readonly string[], element: string): string {
  const arrayLiteral = `{"${element.replace(/[\\"]/g, '\\$&')}"}`;
  const quoted = `"${arrayLiteral.replace(/[\\"]/g, '\\$&')}"`;
  return columns.map((column) => `${column}.cs.${quoted}`).join(',');
}
