# Doküman dizini

Bu sayfa belgelerin amacını ve güncellik durumunu gösterir. Uygulamanın mevcut davranışı için kodu ve [kök README](../README.md) dosyasını esas alın. Tarihli planlar, uygulanmış değişikliklerin kanıtı değildir.

## Güncel planlar

Bu belgeler öneri ve yapılacak işlerdir; tamamlanmış özellik listesi olarak okunmamalıdır.

- [Admin panelini yeni açık layouta taşıma planı](./plans/admin-redesign-2026-10-31.md) — `/admin` için fazlı geçiş (iskelet, ortak bileşenler, bölümler); [devir notu](./handovers/ADMIN_REDESIGN_HANDOFF.md) ile birlikte okunmalı. Uygulandı ve main'de (31 Ekim 2026); güncel durum için [31 Ekim devir notu](./handovers/HANDOVER_2026-10-31.md).
- [Blog adresi ve almanya101 yazarı SEO/GEO planı](./plans/blog-seo-geo-2026-10-31.md) — `/yazi-dizisi` yolunu `/blog` altına taşıma, 308 yönlendirmeleri ve anonim içerik için kurumsal yazar. Uygulandı ve main'de; CLAUDE.md güncellendi. K8 ve `/arkadasin-kosesi` kısımları geçersiz, ayrıntı devir notunda.
- [25 Ekim ana sayfa SEO analizini düzeltme planı](./plans/seo-analyzer-ana-sayfa-2026-10-25.md) — boş `alt` ve mevcut tarihlerin yanlış raporlanmasını ele alır.
- [24 Ekim GEO denetimi düzeltme planı](./plans/geo-audit-2026-10-24.md) — canlı 85/100 denetimindeki doğrulanmış eksikleri ve yalancı pozitifleri ayırır.
- [SEO ve GEO denetimi ve iyileştirme planı](./plans/seo-geo-2026-10-21.md) — 21 Ekim 2026 tarihli kod ve canlı site kontrolü.
- [Haber hattı ve kod düzenleme birleşik planı](./plans/clean-code-plan.md) — 21 Ekim 2026 tarihli çalışma planı.
- [Haber yönetimi planı](./plans/news-admin-plan.md) — birleşik planın haber bölümüne ait ayrıntılar.
- [Kalan kod düzenleme işleri — küçük batch planı](./plans/clean-code-batches.md) — birleşik planın 0–3. aşamaları canlıya alındıktan sonra kalan işlerin tek PR'lık batch'lere bölünmüş hali.
- [Kalan güvenlik işleri — küçük batch planı](./plans/security-batches.md) — veritabanı denetimi bulgularının S1–S10 batch'leri ve güncel durumu.

## Teknik başvuru

- [Yeni araçlar özeti](./almanya-araclari-ozet.md) — araç altyapısı oluşturulduğunda yazılmış teknik özet; değişen ayrıntıları koddan doğrulayın.
- [Supabase migration durumu](../supabase/MIGRATIONS_STATUS.md) — her migration'ın canlıda uygulanıp uygulanmadığı, nasıl doğrulandığı ve yeni migration'ın nasıl uygulanacağı. Bir migration çalıştırmadan önce bakın.
- [Kök geliştirici kuralları](../AGENTS.md) ve [Claude Code kılavuzu](../CLAUDE.md).

## Test belgeleri

- [E2E test planı](./e2e-test-plan.md) — tarihli senaryo ve öneriler. Güncel test komutları için [package.json](../package.json) ve [Playwright yapılandırması](../playwright.config.ts) geçerlidir.
- [Eski E2E kullanım kılavuzu](./archive/E2E_TEST_KULLANIM.md) — arşiv kaydı; yönetici notu tohumlama betiği bu sabit yola başvurur.

## Tarihsel kayıtlar

- [Arşiv](./archive/) — önceki araştırmalar, planlar ve raporlar. Aynı içerikli `a101newtools.md` çıkarıldı; [`newtools.md`](./archive/newtools.md) kopyası korundu.
- [Eski DevUser belgeleri](./archive/devuser/) — artık kullanılmayan statik HTML mimarisini anlatır.
- [Devir notları](./handovers/) — yazıldıkları oturumun ve tarihin çalışma durumunu yansıtır.
- [Superpowers planları ve tasarımları](./superpowers/) — tarihli tasarım kayıtlarıdır.
- [Yayımlanmış dosya güvenliği kaydı](./security/public-files-2026-10-21.md) — parola listesi ve örnek ortam dosyası için durum ve kalan erişim işlemleri.
- [Veritabanı güvenlik denetimi](./security/db-audit-2026-10-21.md) — RLS, rol yetkileri ve PostgREST yüzeyi için kanıta dayalı bulgular; düzeltmeler henüz uygulanmadı.
- [Kabul edilen npm audit riskleri](./security/npm-audit-accepted-risks.md) — kapatılamayan bağımlılık bulguları ve gerekçeleri (yaşayan kayıt, tarihsiz).
