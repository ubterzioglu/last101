# Supabase migration durumu

Son kontrol: **2026-10-31** (canlı veritabanı: proje `ldptefnpiudquipdsezr`). Bu dosya, `supabase/migrations/` içindeki her dosyanın canlıya uygulanıp uygulanmadığını gösterir. **Bir migration'ı çalıştırmadan önce buraya bak.** Eski dosyaları yeniden çalıştırma; bazıları veriyi geri getirir veya bozar (örneğin `20260424110000_corner_multi_author.sql` `arkadasin-kosesi` yazarını yeniden oluşturur).

**Özet:** 33 dosya, 33 tanesi canlıda uygulanmış durumda, bekleyen yok.

## Neden bazılarında kayıt yok

`supabase_migrations.schema_migrations` tablosu `20260618110000` sürümünden sonra güncellenmiyor, çünkü migration'lar `supabase db push` ile değil, doğrudan SQL ile uygulanıyor. Bu yüzden "kayıt yok" **uygulanmadı demek değildir**. Aşağıdaki durum sütunu kayıta değil, canlı veritabanındaki etkiye bakılarak yazıldı.

## Durum

| Dosya | Durum | Ne yapar |
|---|---|---|
| `20260211_security_hardening.sql` | Uygulandı (schema_migrations kaydı var) | DevUser Security Hardening Migration |
| `20260325103000_add_news_carousel_visibility.sql` | Uygulandı (schema_migrations kaydı var) |  |
| `20260412120000_create_recruitment_agencies.sql` | Uygulandı (schema_migrations kaydı var) | Create recruitment_agencies table |
| `20260413000000_turkify_recruitment_agencies.sql` | Uygulandı (schema_migrations kaydı var) | Türkçeleştirme — recruitment_agencies tablosu |
| `20260413070329_add_broken_link_reports.sql` | Uygulandı (schema_migrations kaydı var) | Create table for broken link reports |
| `20260413143000_add_news_content.sql` | Uygulandı (schema_migrations kaydı var) | Add content column to news_posts table |
| `20260424090000_create_corner_blog.sql` | Uygulandı (schema_migrations kaydı var) |  |
| `20260424110000_corner_multi_author.sql` | Uygulandı (schema_migrations kaydı var) |  |
| `20260427110000_founder_event_flow.sql` | Uygulandı (schema_migrations kaydı var) |  |
| `20260427113000_fix_founder_submission_phone_nullability.sql` | Uygulandı (schema_migrations kaydı var) |  |
| `20260615170000_news_module_v2.sql` | Uygulandı (schema_migrations kaydı var) | Drop legacy check constraints before normalizing rows, otherwise the |
| `20260617120000_news_pipeline_scraper_adapters.sql` | Uygulandı (schema_migrations kaydı var) | News pipeline scraper genişletmesi (corteqsmvp radar-news-scan entegrasyonu). |
| `20260618100000_unify_providers_service_finder.sql` | Uygulandı (schema_migrations kaydı var) | Hizmet Rehberi birleştirme: gastronomy_providers -> providers (tek tablo, type ile yönetim). |
| `20260618110000_service_finder_module.sql` | Uygulandı (schema_migrations kaydı var) | Service Finder modülü — AI uzman/hizmet bulucu scraper şeması. |
| `20260624085000_news_sources_trthaber_type.sql` | Uygulandı (kayıt yok; etkisi canlıda doğrulandı 2026-10-31) | TRT Haber özel mobil XML formatı için yeni source_type: 'trthaber'. |
| `20260624090000_seed_news_sources.sql` | Uygulandı (kayıt yok; oluşturduğu nesneler canlıda mevcut, 2026-10-31) | Haber pipeline'ı için başlangıç kaynaklarının seed'lenmesi. |
| `20260624091000_news_pipeline_cron.sql` | Uygulandı (kayıt yok; oluşturduğu nesneler canlıda mevcut, 2026-10-31) | Haber pipeline'ı için günlük otomatik tetikleme (news.md §12). |
| `20260624120000_security_notes.sql` | Uygulandı (kayıt yok; oluşturduğu nesneler canlıda mevcut, 2026-10-31) | Admin Güvenlik Notları / Uyarıları tablosu. |
| `20260626100000_add_tool_questionnaire_submissions.sql` | Uygulandı 2026-10-31 (bu oturumda) |  |
| `20261021120000_add_career_platforms_recruitment_agencies.sql` | Uygulandı (kayıt yok; etkisi canlıda doğrulandı 2026-10-31) | "İş ve Kariyer Platformları" kategorisi |
| `20261021130000_news_language_filter.sql` | Uygulandı (kayıt yok; oluşturduğu nesneler canlıda mevcut, 2026-10-31) | Haber hattında dil filtresi: İngilizce (ve izin verilmeyen) haberlerin kuyruğa/yayına girmesini engeller. |
| `20261021140000_normalize_recruitment_agency_categories.sql` | Uygulandı (kayıt yok; etkisi canlıda doğrulandı 2026-10-31) | recruitment_agencies kategori normalizasyonu |
| `20261021150000_news_editor_actions_keep_on_delete.sql` | Uygulandı (kayıt yok; etkisi canlıda doğrulandı 2026-10-31) | Haber silindiğinde audit kaydı da cascade ile siliniyordu; kim neyi sildi bilgisi kayboluyordu. |
| `20261021170000_news_language_checks.sql` | Uygulandı (kayıt yok; etkisi canlıda doğrulandı 2026-10-31) | Dil kolonları yalnızca desteklenen kodları alabilsin (uygulama tipleri: NewsLanguage = 'tr' / 'de' / 'en'). |
| `20261021171000_broken_link_reports_private_select.sql` | Uygulandı (kayıt yok; etkisi canlıda doğrulandı 2026-10-31) | "Admin can read all broken link reports" policy'si rol belirtmeden `using (true)` ile tanımlıydı; |
| `20261021180000_close_anonymous_write_paths.sql` | Uygulandı (kayıt yok; etkisi canlıda doğrulandı 2026-10-31) | docs/security/db-audit-2026-10-21.md bulgu 1–5'in kapatılması + hazırlık sırasında bulunan view yazma yolu. |
| `20261021190000_function_search_path.sql` | Uygulandı (kayıt yok; etkisi canlıda doğrulandı 2026-10-31) | docs/plans/security-batches.md S2: sabit search_path (Supabase advisor "function_search_path_mutable"). |
| `20261021191000_storage_no_public_listing.sql` | Uygulandı (kayıt yok; etkisi canlıda doğrulandı 2026-10-31) | docs/plans/security-batches.md S5: corner ve news bucket'ları anonim listelenebiliyordu |
| `20261021200000_hide_secret_columns_and_participant_writes.sql` | Uygulandı (kayıt yok; etkisi canlıda doğrulandı 2026-10-31) | Acil: erişim haritası doğrulamasında bulunan ve anon anahtarla canlıda doğrulanan açıklar. |
| `20261021201000_lock_legacy_pii_tables.sql` | Uygulandı (kayıt yok; etkisi canlıda doğrulandı 2026-10-31) | Eski statik uygulamadan kalan, mevcut kodun hiç kullanmadığı tablolar (erişim haritası + doğrulama). |
| `20261021202000_drop_legacy_event_tables.sql` | Uygulandı (kayıt yok; etkisi canlıda doğrulandı 2026-10-31) | Kullanıcı kararı (21 Ekim 2026): 20261021180000 ile kilitlenen eski etkinlik/vize tabloları silinir. |
| `20261021203000_devuser_base_table_private.sql` | Uygulandı (kayıt yok; etkisi canlıda doğrulandı 2026-10-31) | Güvenlik batch S3, adım 2: devuser taban tablosu anon/authenticated'a tamamen kapanır. |
| `20261031120000_seed_almanya101_author.sql` | Uygulandı 2026-10-31 (bu oturumda) | Kurumsal yazar: "almanya101" (Organization). Rehber, haber ve yazarsız içerik bu kimliğe atfedilir. |

## Yeni migration nasıl uygulanır

1. **psql yok.** Bu makinede `psql` kurulu değil. `pg` paketini proje dışında bir klasöre kur (proje bağımlılığı olarak ekleme) ve Node ile bağlan. Bağlantı dizesi `.env.local` içinde `DIRECT_CONNECTION_STRING` olarak durur; Git'e girmez, çıktıya yazdırma.
2. **Önce kuru çalıştırma.** Dosyayı `BEGIN` ... `ROLLBACK` içinde çalıştır ve sonucu doğrula. Hata varsa canlıya hiçbir şey yazılmamış olur. (Geçerli SQL değilse burada yakalanır; 31 Ekim'de `E'...'` literalleri `||` ile birleştirilmediği için seed dosyası böyle yakalandı.)
3. **Sonra uygula.** Aynı dosyayı `BEGIN` ... `COMMIT` içinde, `set local lock_timeout = '10s'` ile çalıştır, etkisini doğrula.
4. **Eklemeli ve yeniden çalıştırılabilir yaz.** `if not exists`, `on conflict do nothing`, `drop ... if exists` kullan.
5. **Bu dosyayı güncelle.** Yeni migration'ı tabloya ekle ve "Son kontrol" tarihini değiştir.

## Bilinen notlar

- `20261031120000_seed_almanya101_author.sql` ile eklenen `almanya101` yazarı silinemez (veritabanı trigger'ı) ve API'den pasife alınamaz veya yeniden adlandırılamaz. Yeni sütun eklenmedi; `corner_authors` için anon'a sütun bazlı `GRANT` verildiği için yeni sütun, GRANT'e eklenmeden okunursa listeler sessizce boşalır.
- `20260626100000_add_tool_questionnaire_submissions.sql` tabloyu RLS açık ve politikasız oluşturur; yalnızca service role yazar ve okur. Tabloda Supabase'in varsayılan anon yetkileri duruyor, RLS satırları yine de engeller.
- Veritabanı güvenlik denetimi ve düzeltme planı: `docs/security/db-audit-2026-10-21.md`, `docs/plans/security-batches.md`.
