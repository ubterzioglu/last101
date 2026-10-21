/**
 * PostgREST `.or()` filtresi için güvenli ilike ifadesi üretir.
 * 1) LIKE düzeyi: `%`, `_` ve `\` kaçışlanır, `*` (PostgREST'te `%` takma adı) atılır; arama terimi
 *    joker karakter olarak değil düz metin olarak aranır.
 * 2) PostgREST düzeyi: değer çift tırnak içine alınır; böylece virgül/parantez yeni filtre koşulu
 *    açamaz. Tırnak ve ters bölü PostgREST kuralına göre ters bölü ile kaçışlanır.
 * Edge Function'lar `lib/` içinden import edemediği için `supabase/functions/get-users/search.ts` içinde
 * birebir kopyası vardır; değişiklik oraya da taşınmalı. `tests/postgrest-filter-escaping.test.ts` iki
 * uygulamayı sabit bir girdi kümesinde karşılaştırır — sapmaların çoğunu yakalar ama her girdiyi kapsamaz.
 */
export function buildIlikeOrFilter(columns: readonly string[], term: string): string {
  const likeLiteral = term.replace(/\*/g, '').replace(/[\\%_]/g, '\\$&');
  const quoted = `"%${likeLiteral.replace(/[\\"]/g, '\\$&')}%"`;
  return columns.map((column) => `${column}.ilike.${quoted}`).join(',');
}
