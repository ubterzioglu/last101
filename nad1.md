# Almanya101 Kapsamlı Repo Özeti

Son güncelleme: `27 Haziran 2026`

Bu dosya, repo içindeki ana modülleri, route yapısını, son dönemde yapılan büyük işleri ve operasyonel durumu tek yerde toplar. Önceki kısa özetten farklı olarak yalnızca “son yapılanlar”ı değil, bugünkü repo yapısının genel fotoğrafını da içerir.

## 1. Proje Nedir?

`almanya101`, Almanya’da yaşayan veya Almanya’ya taşınmayı planlayan Türkler için hazırlanmış bir Next.js 15 uygulamasıdır.

Proje bugün yalnızca klasik bir içerik sitesi değildir. Kod ağacına göre aynı repo içinde şu katmanlar birlikte yaşamaktadır:

- public marketing sayfaları
- public interaktif araçlar
- haber ve rehber içerikleri
- admin panelleri
- `devuser` altında özel kullanıcı / topluluk / deneysel modüller
- Supabase tabanlı veri ve API katmanı
- Playwright + Vitest test altyapısı

Tüm kullanıcıya görünen içeriklerin Türkçe olması proje kuralıdır.

## 2. Teknik Yığın

Ana teknoloji seti:

- `Next.js 15`
- `React 19`
- `TypeScript`
- `Tailwind CSS`
- `Supabase`
- `Playwright`
- `Vitest`

`package.json` tarafındaki önemli script’ler:

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
- `npm run test:unit`
- `npm run e2e`
- `npm run e2e:smoke`

Üretim başlangıcı standart `next start` ile değil, `scripts/start-standalone.mjs` üzerinden yapılıyor. Bunun nedeni `output: 'standalone'` akışını daha güvenli ve ortama dayanıklı hale getirmek.

## 3. Genel Uygulama Yapısı

Route grupları dört ana parçaya ayrılıyor:

### `app/(marketing)`

Auth gerektirmeyen public pazarlama ve kurumsal içerik alanı.

Başlıca sayfalar:

- `almanyada-yasam`
- `blog`
- `cerez-politikasi`
- `gizlilik-politikasi`
- `hakkimizda`
- `iletisim`
- `impressum`
- `is-ilanlari`
- `kariyer`
- `kullanim-sartlari`
- `kvkk-gdpr-ccpa`
- `rehber`
- `tatil`
- `topluluk`

Bu alan, SEO ve marka görünürlüğü için public içerik yüzeyi olarak çalışıyor.

### `app/(site)`

Auth gerektirmeyen interaktif araçlar ve public içerik modülleri burada bulunuyor.

Başlıca sayfalar:

- `almanya-araclari`
- `almanya-maas-beklentisi`
- `almanya-yasam-tarzi-uyumu`
- `almanya-yolunu-sec`
- `almanyada-is-bulma-olasiligi`
- `almanyaya-hazir-misin`
- `banka-secim`
- `belgeler`
- `haberler`
- `hangi-sehir-sana-uygun`
- `hizmet-rehberi`
- `ilk-90-gun-planlayici`
- `kariyer-ve-egitim-rotasi`
- `maas-hesaplama`
- `once-hangi-sorunu-cozmelisin`
- `para-transferi`
- `sigorta-secim`
- `software-hub`
- `stepstone-karsilastirma`
- `topluluk-ve-danismanlik`
- `vatandaslik-testi`
- `vize-secim`
- `yazi-dizisi`
- `[authorSlug]`

Not:

- `software-hub` route’u public araç hub’ı değil; mevcut durumda redirect davranışı taşıyor.
- araçların asıl public hub sayfası `almanya-araclari`

### `app/(devuser)`

Supabase auth ile ilişkili özel kullanıcı / topluluk / deneysel modül alanı.

Başlıca modüller:

- `cvopt`
- `dad`
- `dev`
- `devuser`
- `devuseradmin`
- `devuserlist`
- `devuserprofile`
- `disad`
- `discussion`
- `du`
- `e1`
- `e1a`
- `e2`
- `e2a`
- `founder`
- `founder-survey`
- `gelismeler`
- `list`
- `news`
- `profile-edit`
- `promote`
- `reset-password`
- `summary`
- `survey`
- `tavla`
- `typing`
- `ubt`
- `vct`

Bu alanın çoğu `page.tsx` + `*Client.tsx` kalıbıyla ilerliyor ve `DevUserShell` ekseninde şekilleniyor.

### `app/admin`

Admin ve operasyon yüzeyleri.

Başlıca modüller:

- `broken-link-reports`
- `guvenlik-notlari`
- `haberler`
- `haberler-rehberi`
- `hizmet-rehberi`
- `home`
- `recruitment-agencies`
- `rehber`
- `service-finder`
- `software-hub`
- `yazi-dizisi`

Admin tarafı özellikle haber, güvenlik notları, provider/recruitment akışları ve çeşitli içerik yönetim işlevleri için kullanılıyor.

## 4. Public Araç Platformu

Repo’nun son dönemde en çok büyüyen alanı `app/(site)` altındaki araç platformu oldu.

### Bugün aktif ana araçlar

- `almanya-yolunu-sec`
- `almanya-maas-beklentisi`
- `almanyaya-hazir-misin`
- `hangi-sehir-sana-uygun`
- `topluluk-ve-danismanlik`
- `kariyer-ve-egitim-rotasi`
- `almanya-yasam-tarzi-uyumu`
- `ilk-90-gun-planlayici`
- `once-hangi-sorunu-cozmelisin`
- `almanyada-is-bulma-olasiligi`
- `banka-secim`
- `sigorta-secim`
- `vize-secim`
- `maas-hesaplama`
- `para-transferi`
- `stepstone-karsilastirma`
- `vatandaslik-testi`
- `belgeler`

### Araç mimarisi

Araçlar tek tek farklı UI yazılarak değil, ortak bir motor üstüne kuruluyor.

Ana yapı taşları:

- `components/tools/ToolExperience.tsx`
- `components/tools/ToolPageScaffold.tsx`
- `components/tools/QuestionnaireRenderer.tsx`
- `lib/tools/catalog.ts`
- `lib/tools/types.ts`
- `lib/tools/helpers.ts`
- `lib/tools/survey.ts`
- `lib/tools/surveys/*`

Bu yapı sayesinde:

- her araç kendi `toolConfig.ts` ile tanımlanabiliyor
- ortak soru akışı korunuyor
- sonuç ekranı standardize ediliyor
- resmi kaynak ve FAQ alanları ortak biçimde sunuluyor
- yeni araç ekleme maliyeti düşüyor

### Araç hub sayfası

Public araçların merkezi giriş noktası:

- `https://almanya101.de/almanya-araclari`

Bu sayfa:

- araçları kategori bazlı grupluyor
- hızlı gezinme sağlıyor
- kart üstünde her aracın değer önerisini gösteriyor
- tool catalog üzerinden besleniyor

## 5. Sonuç Sonrası Anket Katmanı

Araç platformuna ikinci bir veri toplama katmanı eklendi: sonuç sonrası anket sistemi.

Ana parçalar:

- `components/tools/QuestionnaireRenderer.tsx`
- `app/api/tool-questionnaires/route.ts`
- `lib/tools/survey.ts`
- `lib/tools/surveys/*`
- `supabase/migrations/20260626100000_add_tool_questionnaire_submissions.sql`

Bu katmanın amacı:

- mevcut araç sonucunu bozmadan ek veri toplamak
- kullanıcının durumunu daha derin ölçmek
- anonim `session_id` ile yanıt kaydetmek
- ürün kararları için daha anlamlı veri üretmek

Bu sistemin önemli tasarım kararı:

- akış `post-result` mantığıyla ilerliyor
- yani kullanıcı önce mevcut araç sonucunu alıyor
- anket katmanı sonuca ek bir derinlik katmanı olarak geliyor

## 6. İçerik ve Yayın Katmanı

Repo yalnızca araçlardan ibaret değil; haber ve rehber alanı da güçlü şekilde yer alıyor.

### Haber modülü

Public tarafta:

- `app/(site)/haberler`
- `app/(site)/haberler/[slug]`

Admin ve API tarafında:

- `app/admin/haberler`
- `app/admin/haberler/ayarlar`
- `app/admin/haberler/kaynaklar`
- `app/admin/haberler/pipeline`
- `app/admin/haberler/yeni`
- `app/admin/haberler/[id]`
- `app/api/news`
- `app/api/news/[slug]`
- `app/api/news-admin-list`
- `app/api/news-admin-action`
- `app/api/admin/news/*`

Kod ağacına göre haber sistemi; queue, source management, pipeline, hero seçimleri, publish/archive/reject gibi operasyonları taşıyor.

### Rehber ve yazı dizisi alanları

Public:

- `app/(marketing)/rehber`
- `app/(marketing)/rehber/[slug]`
- `app/(site)/yazi-dizisi`
- `app/(site)/yazi-dizisi/[slug]`

Admin:

- `app/admin/rehber`
- `app/admin/yazi-dizisi`

### Yazar sayfaları

Public ve yazar odaklı yüzeyler:

- `app/(site)/[authorSlug]`
- `app/kose-panel/[authorSlug]`
- `app/kose-giris/[authorSlug]`

Bu kısım, corner/yazar akışlarının ayrı bir alt sistem olarak kurgulandığını gösteriyor.

## 7. Admin ve Operasyon Alanları

Admin tarafında görünen başlıca operasyonel modüller:

- haber yönetimi
- hizmet rehberi yönetimi
- recruitment agencies
- service finder
- broken link raporları
- güvenlik notları
- software hub yönetimi

API tarafındaki route adlarından görülen ek operasyon alanları:

- `provider-submissions`
- `founder-submissions`
- `meeting-attendance`
- `participant-admin`
- `corner-admin`
- `corner-author`
- `devuser` yönetimi

Bu yapı, repo’nun tek bir public site olmaktan çıkıp aynı zamanda operasyonel bir iç panel setine dönüştüğünü gösteriyor.

## 8. API ve Supabase Katmanı

`app/api` altında geniş bir route seti bulunuyor.

Başlıca kümeler:

- admin haber endpoint’leri
- devuser endpoint’leri
- provider / founder / participant akışları
- recruitment agencies yönetimi
- broken link raporları
- tool questionnaire kayıtları
- health check
- auth verify route’ları

Supabase tarafında repo içinde:

- migration dosyaları
- function kodları
- news ingest ve service-finder gibi işlevsel backend parçaları

görünüyor. Bu da repo’nun yalnızca frontend değil, ciddi ölçüde backend workflow taşıdığını gösteriyor.

## 9. UI / Layout / SEO Kalıpları

Repo içindeki tekrar eden temel UI ve SEO kuralları:

- class birleştirmede `cn()` kullanımı
- her sayfada `createMetadata()`
- article sayfalarında `createArticleMetadata()`
- ortak container / section düzeni
- koyu tema ağırlıklı görsel dil
- structured data kullanımı

Önemli layout parçaları:

- `components/layout/Header.tsx`
- `components/layout/Footer.tsx`
- `components/layout/LegalPage.tsx`
- `components/sections/HeroSection.tsx`

Son dönemde özellikle şu UI iyileştirmeleri yapıldı:

- legal sayfa hero’ları küçültüldü
- arka plana hafif animasyonlu aurora/grid/noise katmanı eklendi
- 404 sayfası görsel olarak güçlendirildi
- footer legal link alanı güncellendi

## 10. Test Altyapısı

Projede hem E2E hem unit test altyapısı mevcut.

### E2E

Ana yapı:

- `e2e/smoke`
- `e2e/tools`
- `auth.setup.ts`

Commit geçmişine göre Playwright tarafında:

- smoke suite
- 8 araç/modül için gated deep test katmanı

eklenmiş durumda.

Özellikle adı görülen derin test başlıkları:

- `maas-hesaplama`
- `vatandaslik-testi`
- `banka-secim`
- `sigorta-secim`
- `vize-secim`
- `para-transferi`
- `stepstone-karsilastirma`
- `software-hub`

### Unit / integration benzeri testler

- `tests/survey.test.ts`
- `tests/tool-questionnaires-config.test.ts`
- `tests/tool-questionnaires-route.test.ts`

Bu katman özellikle yeni questionnaire sistemini güvenceye almak için eklenmiş görünüyor.

## 11. Son Dönem Commit Akışı

Bugünkü repo şeklini belirleyen yakın dönem commit zinciri şu şekilde okunabilir:

- `6f20674` — Supabase tabanlı güvenlik notları modülü
- `818d02b` / `ab494bc` — recruitment agencies admin auth bypass düzeltmesi
- `4bac230` / `8117e09` — OG image cache-bust düzeltmesi
- `fff0d75` ve alt commitleri — Playwright smoke + 8 gated deep test katmanı
- `e3fa5b6` — E2E plan ve handover dokümantasyonu
- `3d894d6` — E2E usage notes seed script
- `586acbd` — Almanya planning tools katmanının ilk büyük eklenişi
- `75c4f10` — bazı araç akışlarının ve E2E kapsamının genişletilmesi
- `df5cbb5` — araçlara post-result questionnaire sistemi eklenmesi
- `1760e0e` — `almanya-araclari` hub sayfasının büyütülmesi
- `caf6504` — footer link güncellemesi
- `4d86e27` — legal hero + 404 UI iyileştirmeleri
- `5423fe2` — ilk `nad1.md` kısa özet dosyası

## 12. Bugünkü Durumun Kısa Okuması

Repo’nun bugünkü durumu özetle şu:

- public tarafta büyüyen bir araç ekosistemi var
- haber ve içerik yönetimi için admin katmanı güçlü
- `devuser` altında ayrı bir özel ekosistem bulunuyor
- Supabase ve API route’larıyla backend iş yükü önemli seviyede
- test altyapısı önceye göre daha ciddi
- son büyük büyüme alanı tools + questionnaires + E2E oldu

Başka bir deyişle bu repo artık:

- basit bir landing page değil
- sadece içerik sitesi de değil
- sadece araç sitesi de değil

Bu repo şu anda içerik, araç, topluluk, admin operasyonu ve veri toplama katmanlarını aynı Next.js monorepo benzeri yapı içinde birleştiren çok parçalı bir ürün haline gelmiş durumda.

## 13. Bu Dosya Ne İçin Kullanılmalı?

Bu dosya özellikle şu işler için referans olabilir:

- yeni oturuma geçen bir agent için hızlı repo devri
- son dönemde neler eklendiğini anlamak
- hangi alanların public, hangilerinin admin/devuser olduğunu görmek
- tools yatırımı ile diğer modülleri birbirinden ayırmak
- test ve operasyon tarafında nelerin bulunduğunu hızlıca anlamak

Bu belge tam satır-satır kod envanteri değildir; ama repo’nun bugünkü ürün, mimari ve yakın dönem geliştirme yönünü yüksek sinyalli biçimde özetler.
