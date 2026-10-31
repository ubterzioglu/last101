# Blog slug değişimi ve "almanya101" yazarı: SEO/GEO uyumlu uygulama planı (revize 2)

Bu bir tasarım planıdır, hiçbir dosya değiştirilmedi. Eleştirmen bulgularının tamamı kodla yeniden doğrulandı. Aşağıdaki "Bulgu karnesi" bölümü her bulgunun akıbetini (doğrulandı / kısmen / geçersiz) ve dayandığı satırı gösterir. Plan metni bu bulgular işlenmiş hâlidir.

Ön doğrulanmış gerçekler (worktree'de okundu):
- `next.config.ts:70-72` `redirects()` yalnızca `[wwwRedirect, ...devuserRedirects]` döndürüyor; `yazi-dizisi` kuralı yok.
- `lib/admin/cornerAuthorAuth.ts:75-103` `RESERVED_AUTHOR_SLUGS` içinde `yazi-dizisi` var; `blog`, `yazar`, `almanya101` yok.
- `lib/corner.ts:283-308` `getPublishedCornerPostBySlug` yalnızca uuid'e (`getIdFromPostSlug`, `:107-111`) bakar, başlık kısmını doğrulamaz; yazar join'de görünmüyorsa `author = undefined` ile yazıyı yine döndürür (404 vermez).
- `supabase/migrations/20260424110000_corner_multi_author.sql:75-80` `author_id is null` olan tüm yazıları `arkadasin-kosesi` yazarına bağlamış; `app/api/corner-author-action/route.ts:118` yeni yazıyı hep `auth.author?.id` ile yazar, `corner-admin-action` içinde `create_post` yok. Yani canlıda `author_id IS NULL` kümesi büyük olasılıkla boş.
- `corner_posts` için `updated_at` tetikleyicisi YOK (`supabase/migrations` içinde tek trigger `20260624120000_security_notes.sql:48`); `updated_at` uygulama kodu tarafından yazma anında set ediliyor (`corner-author-action/route.ts:78,127,161`). Eski plan "tetikleyici oynuyor mu" sorusu bu yüzden kapandı, ama JSON-LD yine ham değeri yazıyor (bkz. B9).

## 1. Kararlar

**K1. Tek hub `/blog`, kapsamı daraltılmış.** `app/(marketing)/blog/page.tsx` hub'ı köşe yazıları + yazar vitrini olur. Title/description "Blog: Almanya Üzerine Köşe Yazıları" çizgisine daralır (bugünkü "Yazı, Haber ve Rehber Merkezi" vaadi haber/rehberle kanibalizasyon yaratır, B5). Haberler ve Rehber "İlgili merkezler" bölümünde iki kart olarak kalır (kendi URL'leri, kendi `Article` şeması). `ItemList` yalnızca blog yazılarını içerir. Rehber/haber `Article` kalır: bunlar editoryal içerik, blog `BlogPosting` olur; ayrım görünür başlıklarla ve hub metniyle açıklanır.

**K2. Yazı detayı `/blog/<baslik>--<uuid>`.** Slug biçimi korunur (`lib/corner.ts:103-112`). `app/(marketing)/blog/` altında birleşir; `(site)/blog` açılmaz (aynı yol iki route group'ta derleme hatası). Adım 0'da `(marketing)` ve `(site)` layout farkı karşılaştırılır.

**K2b. Slug-uuid kanonikleştirmesi (B1 çözümü): sayfa içi 308 YOK.** Bugünkü davranış (başlık kısmı yok sayılır, 200 + `rel=canonical`) korunur. `/blog/[slug]` içinde "kanonik slug'a permanentRedirect" EKLENMEZ, çünkü `next.config` kuralı slug'ı olduğu gibi taşıdığı için `/yazi-dizisi/eski-baslik--uuid` -> `/blog/eski-baslik--uuid` -> `/blog/yeni-baslik--uuid` zinciri oluşur. Çift URL riski `createArticleMetadata({ path: post.href })` canonical'ı ile karşılanır; sitemap ve iç linkler yalnızca kanonik `post.href` taşır. Redirect'in statik (DB'siz) kalması bilinçli: `yazi-dizisi` shim'i DB'ye bağlansaydı Supabase kesintisinde eski URL'ler 5xx/404 verirdi. İleride kanonik 308 istenirse tek sıçramalı çözüm: `/yazi-dizisi/:slug` kuralı kaldırılıp uuid'den kanonik slug çözen bir route handler (www için ayrı kural zincir yaratacağından bu ayrı karar).

**K3. Yazar detay URL'si `/blog/yazar/<authorSlug>`.** Gerekçe aynı: kök `app/(site)/[authorSlug]/page.tsx` her bilinmeyen tek segment için Supabase sorgular ve statik rotalarca gölgelenir. Kök rota silinmez, 308 kabuğuna döner: DB'de aktif yazar varsa `permanentRedirect('/blog/yazar/<slug>')`, yoksa `notFound()`. Kabukta önce `LEGACY_AUTHOR_SLUG_REDIRECTS` (lib/authors.ts) bakılır: böylece `arkadasin-kosesi` gibi eşlenmiş slug'lar ara hop olmadan doğrudan son hedefe gider.

**K4. "Arkadaşın Köşesi" adı** URL, nav, breadcrumb, başlık ve sitemap'ten çıkar. Kalır: yazar paneli hero metni (`components/CornerAuthorPanelClient.tsx:264`, iç kullanım). `articleSection` = "Köşe Yazıları". `[slug]/page.tsx:47,48,61,93,101,104` içindeki tüm "Arkadaşın Köşesi" fallback/etiketleri kalkar.

**K5. Anonim atıf tek merkezden: `lib/authors.ts`.** `SITE_AUTHOR` + `resolveArticleAuthor()` + `LEGACY_AUTHOR_SLUG_REDIRECTS` + `SYSTEM_AUTHOR_SLUGS`. Üç detay sayfası aynı sonucu görünür byline, `ArticleJsonLd`, `createArticleMetadata({authors})` ve `AuthorBox`'a verir. Bugünkü tutarsızlık: blog Person (`yazi-dizisi/[slug]/page.tsx:85`), haber sabit "Almanya101" (`haberler/[slug]/page.tsx:72`), rehber hiç `author` vermiyor (`rehber/[slug]/page.tsx:64-71`).

**K5b. Pasif yazar kuralı (B6 çözümü).** Görünürlük tek fonksiyondan: `isCornerPostPubliclyVisible(row)` = `status = 'published'` VE (`author_id IS NULL` VEYA join'de aktif yazar görünüyor). Pasif yazarın yazısı (author_id dolu, join boş) hub, sitemap, ilgili yazılar ve detay sayfasında AYNI şekilde gizli: detay `notFound()` (+ `noindex`). Sadece `author_id IS NULL` olan yazı `SITE_AUTHOR`'a düşer. Hub (`lib/corner.ts:244` filtresinin yerine), `getAllCornerPostsForSitemap()` ve detay bu fonksiyonu paylaşır.

**K6. almanya101 = Organization (Person değil)** (`docs/plans/seo-geo-heading-schema-plan.md:34`, `geo-audit-2026-10-24.md:24`). Tek kanonik ad kuralı (B10): `SITE_AUTHOR.name` kodda `SEO_SITE_NAME` sabitinden türetilir (şu an "Almanya101", `JsonLd.tsx:56-57`); `OrganizationJsonLd`, ArticleJsonLd satır içi düğümü, görünür byline, `metadata.authors` ve DB `display_name` AYNI değeri kullanır; `alternateName: ['almanya101']`. Büyük/küçük harf kararı açık soru 2.

**K7. Redirect yeri `next.config.ts`** (middleware yalnızca oturum tazeleme). `permanent: true` = 308.

**K8. `arkadasin-kosesi` yazarının akıbeti (B3 çözümü): karar adım 0'a bağlı, ama varsayılan yol net.** Canlıda `select count(*)` ile ölçüm sonrası:
- Yazıların kurumsal anonim içerik olduğu onaylanırsa: TEK migration içinde sıralı (önce yazıları `almanya101` yazarına taşı, sonra `arkadasin-kosesi` satırını `is_active = false` yap; sıra ters olursa yazılar join'de görünmez olup K5b gereği hub'dan düşer). Aynı sürümde `/arkadasin-kosesi` -> `/blog/yazar/almanya101` statik next.config kuralı (kök shim'den önce eşleşir, DB'siz) ve `LEGACY_AUTHOR_SLUG_REDIRECTS` kaydı.
- Yazılar gerçek bir kişiye aitse: `arkadasin-kosesi` satırı o kişinin adıyla yeniden adlandırılır (Person kalır), `almanya101`'e atama yapılmaz.
Hangi yol seçilirse seçilsin `arkadasin-kosesi` sürüm sonunda ya gerçek ad taşır ya 308 ile kapanır; "Person: Arkadaşın Köşesi" JSON-LD'si ve boş-ince profil sayfası kalmaz.

**K9. İlk-kişi anlatı uyumu (B13).** Mevcut açıklamalar yazıları "kişisel deneyim ve notları" olarak sunuyor (`public/llms.txt:23`, `app/(marketing)/blog/page.tsx:32`). Kurumsal atfı yalnızca editoryal içeriğe (rehber, haber, gerçekten yazarsız yazı) uygularız; ilk-kişi köşe yazıları K8'deki onaydan geçmeden `almanya101`'e taşınmaz. Hub ve llms.txt metinleri "deneyim" vaadinden "topluluk köşe yazıları" diline çevrilir. Yazar sayfasından `/hakkimizda`'ya ve yayın sorumluluğu/düzeltme bildirimi metnine görünür bağlantı verilir; bio yalnızca doğrulanabilir ifadeler içerir.

## 2. URL haritası
Aşağıdaki `urlMap` alanına bakın. Zincir kuralı: hiçbir hedef başka bir kuralın kaynağı değildir. İstisna: yalnızca www + eski başlıklı `/yazi-dizisi/<eski>--uuid` isteği K2b gereği 308 + (www->apex tek kuralla birleştirilmiş) 1 hop'tur; sayfa içi ikinci 308 yoktur. Yönlendirmeler en az 12 ay tutulur.

## 3. Yazar: "almanya101"

### 3.1 DB migration (additive, idempotent)
`supabase/migrations/20261031HHMMSS_seed_almanya101_author.sql`:
- `insert into public.corner_authors (display_name, slug, short_bio, bio_content, avatar_image_url, display_order, password_hash, password_salt, is_active) values ('<SEO_SITE_NAME ile aynı>', 'almanya101', '<kısa kurumsal bio>', '<yöntem/editör metni>', '/almanya101.png', 9999, '', '', true) on conflict (slug) do nothing;` Boş hash ile panel girişi kapalı (`lib/admin/cornerPasswords.ts:12`).
- Silme koruması: `corner_posts.author_id` FK `on delete cascade`; `before delete` trigger ile `slug = 'almanya101'` silinemez (service role dahil).
- Yeni sütun EKLENMEZ: `20261021200000_hide_secret_columns_and_participant_writes.sql:16-18` anon için sütun bazlı GRANT veriyor; GRANT'siz sütun seçilirse `lib/corner.ts:189-192` hatayı yutup `[]` döner.
- Yazı taşıma AYRI migration (`..._attach_anonymous_posts_to_almanya101.sql`), yalnızca K8 onayından sonra: yedek tablo `_backup_corner_posts_author` (id, author_id), sonra `update`, en sonda `arkadasin-kosesi` pasife alma, hepsi tek transaction.
- Canlı kontrol (psql yok, `node pg` + `DIRECT_CONNECTION_STRING`): `select slug,is_active from corner_authors;`, `select count(*) from corner_posts where author_id is null;`, `select count(*) from corner_posts p join corner_authors a on a.id=p.author_id where a.slug='arkadasin-kosesi';`.

### 3.2 Kod fallback (birincil) ve migration sırasından bağımsızlık (B17)
- `lib/authors.ts`: `SITE_AUTHOR = { slug:'almanya101', name: SEO_SITE_NAME, kind:'Organization', href:'/blog/yazar/almanya101', avatarUrl:'/almanya101.png', shortBio }`.
- `/blog/yazar/[authorSlug]` rotası slug `almanya101` ise DB satırı olmasa da `SITE_AUTHOR`'dan render eder (DB'siz 200). Böylece migration ile Coolify deploy sırası zorunlu olmaz; deploy kontrol listesine yine "migration uygulandı mı" eklenir (migration'lar elle uygulanıyor).
- `lib/corner.ts`: yazı href `/blog/${slug}` (`:157` tek kaynak), yazar href `/blog/yazar/${slug}` (`:133`; ayrıca `mapAuthorRow` içindeki `displayName` fallback'i `'Arkadaşın Köşesi'` `:127-128` kalkar).
- `DEFAULT_AVATAR = '/images/profil.jpg'` (`lib/corner.ts:63`, `yazi-dizisi/[slug]/page.tsx:19`) kişisel fotoğraf: avatarsız gerçek yazarda JSON-LD `image` verilmez, UI nötr yer tutucu.

### 3.3 Rezerve slug ve admin koruması (B14, B18)
- `RESERVED_AUTHOR_SLUGS`'a (`cornerAuthorAuth.ts:75-103`): `blog`, `yazar`, `almanya101`, `feed.xml`, `llms.txt`, `ai`, `giris`, `auth`, `almanya-araclari`, `almanyada-yasam`, `kariyer`, `ekibimize-katil`, `impressum`, `gizlilik-politikasi`, `kullanim-sartlari`, `kvkk-gdpr-ccpa`, `cerez-politikasi` ve test çıktısındaki eksikler. `yazi-dizisi` KALIR. Mevcut listede olmayan ve `e2e/smoke/public-routes.spec.ts:19-36` ile `(site)` altında bulunan segmentler (`almanya-yolunu-sec`, `almanya-maas-beklentisi`, `almanyaya-hazir-misin`, `hangi-sehir-sana-uygun`, `kariyer-ve-egitim-rotasi`, `ilk-90-gun-planlayici`, `once-hangi-sorunu-cozmelisin`, `almanyada-is-bulma-olasiligi`, `topluluk-ve-danismanlik`, `almanya-yasam-tarzi-uyumu`) test tarafından tespit edilip eklenir.
- Çakışma kontrolü: eklemeden önce adım 0'daki canlı `select slug from corner_authors` listesi yeni rezerve kümeyle çapraz kontrol edilir; çakışan canlı yazar varsa slug'ı önce yeniden adlandırılır, aksi halde yazar kaybolur.
- **`corner-admin-action` satır-kimliğine göre korunur (kilitlenme düzeltmesi).** Bugün `update_author` slug'ı `body.slug || displayName`'den üretip `isReservedAuthorSlug(slug)` ise 400 dönüyor (`route.ts:106-115`); `almanya101` rezerve olunca seed satırının bio/avatar/ad güncellemesi tamamen kilitlenir. Çözüm: `update_author` önce `existing` satırı çeker; `existing.slug` `SYSTEM_AUTHOR_SLUGS` içindeyse gönderilen slug yok sayılır (mevcut slug korunur), ad/bio/avatar/display_order güncellemesine İZİN verilir. Aynı kuralla `delete_author` (`:163`) ve `set_author_active` ile `isActive=false` (`:137`) bu satır için reddedilir (pasif olursa `getPublishedCornerAuthorBySlug` `:255 is_active` filtresiyle profil 404 olur). Birim test: sistem yazarı bio güncellemesi 200, slug değişimi yok sayılır, silme/pasifleştirme 4xx.

### 3.4 JSON-LD karşılığı (B8, B10 çözümü)
- Ortak yardımcı `organizationRef()` (JsonLd.tsx): `{ '@type':'Organization', '@id': SITE_URL/#organization, name: SEO_SITE_NAME, url: SITE_URL, logo: ImageObject }`. Makale `author` (almanya101 için), `publisher` ve `ProfilePage.mainEntity` hepsi bunu SATIR İÇİ kullanır (bugün `publisher: { '@id' }` `JsonLd.tsx:~202` ve `author: { '@id' }` `:~195-197` yalnızca referans; ayrı ayrıştıran AI tarayıcılarında boş düğüm).
- Gerçek yazar: Makale `author` = `{ '@type':'Person', '@id': '<yazarSayfaURL>#person', name, url }`; yazar sayfasındaki `ProfilePage.mainEntity` AYNI `@id` ve alanlarla Person (bugün makale Person'ında `@id` yok, `JsonLd.tsx:197-201`, iki düğüm birleşmiyor).
- `/blog/yazar/almanya101`: `ProfilePage` + `mainEntity: organizationRef()` + `BreadcrumbList`.
- Görünür byline/tarih JSON-LD ile eşleşir. Test: "aynı `@id` -> tek `name`" ve "her `@id` referansı aynı JSON-LD bloğunda çözülebiliyor".
- `sameAs` DB sütunu yok (GRANT riski), ayrı iş.

### 3.5 almanya101 profil sayfasının içeriği (B2, B15)
Veri analizi: köşe yazılarının büyük kısmı `arkadasin-kosesi` altında, `author_id IS NULL` boş; rehber/haber `corner_posts`'ta değil (`rehber_articles` tablosu, `lib/rehber-articles.ts:37`). Bu yüzden `almanya101` sayfası hub'ın kopyası olmaz; ayrışık içerik: (1) kurumsal bio + yayın ilkesi/düzeltme politikası + `/hakkimizda` bağlantısı, (2) "Son rehberler" ve "Son haberler" (her biri en fazla 6, mevcut `getPublishedRehberArticles` / haber fonksiyonları), (3) K8 sonrası taşınmış blog yazıları varsa "Blog yazıları" için en fazla 6 + "Tümü /blog". Hub ile aynı liste tam kopyalanmaz. Sitemap'e priority 0.5 ile girer ve yalnızca (2) ya da (3) içerik varsa; içerik yoksa (DB yok) sayfa `noindex, follow` ve sitemap dışı.

## 4. SEO/GEO kontrol listesi
1. **Yönlendirmeler** (`next.config.ts:70-72`): sıra `[ yazi-dizisi www kuralları, wwwRedirect, yazi-dizisi kuralları, (/arkadasin-kosesi — K8'e bağlı), ...devuserRedirects ]`; kurallar ayrı modülde (`lib/seo/redirects.ts`) dizi olarak export edilir ki `tests/redirects.test.ts` `next.config` ESM yüklemeden import edebilsin.
2. **Canonical**: `createMetadata`/`createArticleMetadata` `path`'ten (`lib/seo/metadata.ts:35,44-46`). Elle `path`'ler (`yazi-dizisi/page.tsx:15`, `[slug]/page.tsx:38`, `[authorSlug]/page.tsx:26`) yeni yollara. Sayfa içi slug-kanonik 308 YOK (K2b).
3. **Sitemap** (`app/sitemap.ts`): `:38` `/yazi-dizisi` silinir; `/blog` 0.8, `lastModified` = en yeni yayın tarihi; `/blog/<slug>` 0.7 ve `lastModified` = yalnızca `hasMeaningfulUpdate(publishedAt, updatedAt)` doğruysa `updatedAt`, değilse `publishedAt` (`lib/articles/headings.ts:75-80`; B9, ham `updatedAt ?? publishedAt` kullanılmaz); `/blog/yazar/<slug>` yalnızca yayınlanmış yazısı olan aktif yazarlar + K3.5 koşuluyla `almanya101`. Ayrı `getAllCornerPostsForSitemap()` (limitsiz, `content`'siz, K5b görünürlük fonksiyonu). Dinamik kısım `Promise.allSettled` içinde, statik rotalara sahte `lastModified` yok (`sitemap.ts:13-15`).
4. **Metadata**: yazı için `publishedTime`, `modifiedTime` (aynı meaningful-update kuralı), `authors` = yazar profil URL'si, `section`. `createArticleMetadata` bugün `noIndex` iletmiyor (`metadata.ts:76-85`): eklenir; bulunamayan/gizli içerikte `noIndex: true` (blog, rehber, haber).
5. **Kapak görseli düzeltmesi (B7, yüksek)**: `components/news/cover.ts:10` `PLACEHOLDER_COVERS` yalnızca `DEFAULT_OG_IMAGE` ve `/images/hero-background.jpg` içeriyor; `lib/corner.ts:64` ve `lib/rehber-articles.ts:36` `DEFAULT_COVER = '/images/hero-background.webp'` (`public/images`'ta iki dosya da var). Sonuç: kapağı olmayan her yazıda `og:image` ve `Article.image` 6.6 MB Berlin fotoğrafı. Düzeltme: `DEFAULT_COVER` tek yerden export (örn. `lib/utils/constants.ts`), `PLACEHOLDER_COVERS`'a `.webp` eklenir, üç detay sayfası `image: realCoverUrl(post.coverImageUrl) ?? DEFAULT_OG_IMAGE` ile çağırır (`yazi-dizisi/[slug]/page.tsx:50,88` bugün ham URL veriyor). Test: yer tutucu kapaklı yazıda `image !== hero-background.*`.
6. **JSON-LD**: `ArticleJsonLd`'ye `type?: 'Article'|'BlogPosting'` (blog `BlogPosting`), `inLanguage:'tr'`, `articleSection`, `keywords`, `wordCount`, `image` dizisi; `dateModified` YALNIZCA `hasMeaningfulUpdate` doğruysa yazılır (bugün `JsonLd.tsx:~185` `dateModified || datePublished` ve üç sayfa ham `updatedAt` veriyor; görünür `ArticleDates.tsx:11` "Güncelleme"yi gizlerken JSON-LD basıyor, B9). `BreadcrumbJsonLd` (Ana sayfa > Blog > Yazı). `/blog` hub: `CollectionPage` + `ItemList` + `BreadcrumbList`. `WebPageJsonLd` `@type` parametresi. `Organization.logo` `ImageObject` (P2).
7. **llms.txt** (`public/llms.txt:23`): "Arkadaşın Köşesi -> /yazi-dizisi" satırı `- [Blog](https://almanya101.de/blog): ...` olur; `- [almanya101 (yazar)](.../blog/yazar/almanya101)` ve "Atıf: yazar, tarih ve URL ile kaynak gösterin" notu; "kişisel deneyim" ifadesi K9'a göre yumuşatılır. `public/ai/*.json` ve `.well-known/ai.txt` içinde `yazi-dizisi` yok (doğrulandı); `summary.json`/`faq.json`'a blog ve yazar tanımı eklenir.
8. **İç bağlantılar** doğrudan yeni URL: `constants/navigation.ts:92,162`, `constants/home-data.ts:93`, `components/home/HomeGuideCards.tsx:126-128`, `app/(marketing)/blog/page.tsx:29` (kendine döngü kalkar), `[authorSlug]` breadcrumb'ları. Footer zaten `/blog`.
9. **hreflang** gerekmiyor (tek dil); `inLanguage:'tr'` ve `<html lang="tr">` kontrolü.
10. **robots** değişmez; `/authors/`, `/kose-*` robots'a EKLENMEZ (noindex meta taranınca görülür).
11. **OG**: yazıda gerçek kapak, yoksa `DEFAULT_OG_IMAGE` (madde 5); yazar sayfasında avatar yoksa varsayılan.
12. **Başlıklar**: sayfada tek `<h1>`; hub bölümleri `h2`.
13. **Breadcrumb** erişilebilir: `nav[aria-label=Breadcrumb] > ol`, son öğe `aria-current="page"`.
14. **Görünür byline bağlantısı (B11)**: `components/news/ArticleShell.tsx:13` `ArticleAuthor` `{name, avatarUrl}` -> `href?` eklenir; `ArticleMeta` (`:48-53`) adı düz metin yerine `<Link rel="author" href=...>` basar (anonimde `SITE_AUTHOR.href`). Rehber ve haber de `AuthorBox` (kurumsal varyant) render eder (bugün yalnızca blogda ve yalnızca `authorSlug` varsa). Bu olmadan JSON-LD `author.url` / OG `article:author` ile görünür sayfa arasındaki E-E-A-T zinciri kopuk kalır.
15. **RSS**: `app/(marketing)/blog/feed.xml/route.ts` (`<dc:creator>`, `revalidate = 1800`); `app/layout.tsx:33-35` `alternates.types`'a ikinci feed; mevcut `/feed.xml` (haberler) korunur.
16. **GEO atıf edilebilirliği**: yazı başında görünür kısa özet bloğu, görünür yazar kutusu, kaynak bilgisi. **`SpeakableJsonLd` planlanmaz (B12)**: bileşen sabit `WebPage name=SEO_SITE_NAME url=SITE_URL` üretiyor (`JsonLd.tsx:241-256`), makale sayfasında `mainEntityOfPage` ile çelişen ikinci bir WebPage olur, depo planı da görünür karşılığı olmayan Speakable'ı kaldırmayı söylüyor (`seo-geo-heading-schema-plan.md:34`).
17. **Performans/önbellek AYNI release'te (B4, hub dinamikleşiyor)**: `/blog` bugün statik (3 kart). `lib/corner.ts:227` listeye tam `content` çekiyor, `:229-231` `ascending: true` + `limit` (limit aşılırsa en yeniler düşer), `noStore()` her istekte. Yapılacak: (a) yeni `getPublishedCornerPostSummaries()` — `content` YOK (id, title, summary, kapak, tarihler, yazar), `ascending: false`, `noStore()` YOK; hub, ilgili yazılar (`[slug]/page.tsx:66`) ve sitemap bunu kullanır; (b) `/blog` ve yazar sayfaları `export const revalidate = 600`; (c) yazar/yazı yazma rotalarına (`corner-author-action`, `corner-admin-action`) `revalidatePath('/blog')`, ilgili detay ve `/blog/yazar/...` (bugün kodda hiç `revalidatePath/Tag` yok); okuma istemcisi cookie kullanmadığı için (`createCornerReadClient`, `lib/corner.ts:75-87`) ISR uygundur. Tekil detay sayfası `force-dynamic` kalabilir (tam `content` tek satır) ya da sonraki PR'da `revalidate`'e alınır.
18. **Sayfalama**: 60+ yazıda `/blog/sayfa/[n]` (kanonik), şimdilik 120 sınırı.

## 5. Dosya bazlı değişiklik listesi
Rota ve veri
- `app/(site)/yazi-dizisi/page.tsx` -> içerik `app/(marketing)/blog/page.tsx`'e katlanır; dosya silinir.
- `app/(site)/yazi-dizisi/[slug]/page.tsx` -> `app/(marketing)/blog/[slug]/page.tsx` (path, breadcrumb, "Tüm yazılara dön" `/blog`, `resolveArticleAuthor`, `BlogPosting`, K5b görünürlük, `noindex`).
- `app/(marketing)/blog/page.tsx`: daraltılmış hub (K1), `CollectionPage`/`ItemList`/Breadcrumb, `revalidate`.
- `app/(marketing)/blog/yazar/[authorSlug]/page.tsx` (yeni): taşınan yazar sayfası + `ProfilePage`; `almanya101` kod fallback'i.
- `app/(site)/[authorSlug]/page.tsx` -> `permanentRedirect` kabuğu (+ legacy map).
- `app/(marketing)/blog/feed.xml/route.ts` (yeni).
- `app/(marketing)/rehber/[slug]/page.tsx` (`:36-44`, `:64-71`, ArticleShell `:80-92`) ve `app/(site)/haberler/[slug]/page.tsx` (`:36-44`, `:72`): `resolveArticleAuthor`, byline bağlantısı, `AuthorBox`.
- `lib/authors.ts` (yeni), `lib/corner.ts` (`:63-64,127-133,157,175,219-247,283-308`, özet fonksiyonu, sitemap fonksiyonu, görünürlük fonksiyonu), `lib/rehber-articles.ts:36` (DEFAULT_COVER ortak), `lib/admin/cornerAuthorAuth.ts` (`:75-103`), `app/api/corner-admin-action/route.ts` (`:106-115,137,163`, revalidate).
- `lib/seo/metadata.ts` (`noIndex`, `authors`), `components/seo/JsonLd.tsx` (`organizationRef`, `ArticleJsonLd`, `WebPageJsonLd`, `ProfilePageJsonLd`, Organization `alternateName`), `components/news/cover.ts` (`.webp`).
- `components/news/ArticleShell.tsx` (`:13,48-53,69`), `components/articles/AuthorBox.tsx` (kurumsal varyant), `components/news/AuthorCard.tsx`.

Yapılandırma ve içerik
- `next.config.ts` (`:70-72`) + `lib/seo/redirects.ts` (yeni), `app/sitemap.ts` (`:38-39,55-82`), `app/layout.tsx` (`:33-35`).
- `constants/navigation.ts` (`:92-94,162`), `constants/home-data.ts:93`, `components/home/HomeGuideCards.tsx:126-128`.
- `public/llms.txt`, `public/ai/summary.json`, `public/ai/faq.json`.
- Migration'lar: seed + (K8 sonrası) yazı taşıma.

Admin (EN SON, admin yeniden tasarımı birleştikten sonra; URL `/admin/yazi-dizisi` değişmez)
- `constants/adminNav.tsx:65-67`, `components/admin/GuidesAdminClient.tsx:248-253`, `components/admin/UygulamaRehberiClient.tsx:52,99,116` (yalnızca `:116` public link `/blog`), `components/CornerAdminClient.tsx` public link/etiketler; `CornerAuthorPanelClient` "kendi sayfan" bağlantısı varsa.

Dokümantasyon: `CLAUDE.md` Route Structure, `docs/e2e-test-plan.md:15,104`, `docs/README.md`; kökteki `01M5P9ZWMDKZC51S52VBEDYZ4C.md` izlenen artefakt mı kontrol edilir.

## 6. Test planı
Birim (Vitest)
- `tests/redirects.test.ts`: `lib/seo/redirects.ts` dizisi: `/yazi-dizisi` -> `/blog`, `/yazi-dizisi/:slug` -> `/blog/:slug` `permanent:true`; www varyantı doğrudan `https://almanya101.de/blog…`; hiçbir `destination` başka bir `source` ile eşleşmez; döngü yok.
- `tests/sitemap.test.ts` (`lib/corner` mock): `yazi-dizisi` yok, `/blog` var, yazılarda meaningful-update kuralıyla `lastModified`, pasif yazarın yazısı yok, `/blog/yazar/almanya101` koşullu.
- `tests/article-jsonld.test.ts`: `BlogPosting`; almanya101 satır içi Organization (`@id`,`name`,`url`); gerçek yazarda `Person` + `@id` profil sayfasındaki Person ile eşleşir; `publisher`/`mainEntity` satır içi; aynı `@id` tek `name`; `dateModified` yalnızca meaningful update'te; `image` yer tutucuya eşit değil.
- `tests/authors.test.ts`: `author_id IS NULL` -> `SITE_AUTHOR`; `author_id` dolu + yazar görünmüyor -> `SITE_AUTHOR`'a DÜŞMEZ, gizli.
- `tests/reserved-author-slugs.test.ts`: `tests/header-nav.test.ts:38` `collectAppRoutes` yardımcısı ortak `tests/helpers/` dosyasına çıkarılıp kullanılır; route group ve dinamik segmentler ayıklanır; istisna listesi (`sitemap.ts`, `robots.ts`, `feed.xml`, `icon`, `opengraph-image`, `public/` statikleri) açık yazılır; `blog`, `yazar`, `almanya101`, `yazi-dizisi` mevcut.
- `tests/corner-admin-system-author.test.ts`: sistem yazarı güncelleme/silme/pasifleştirme davranışı.
- `tests/cover.test.ts`: `.webp` yer tutucu `realCoverUrl` -> null.
- Güncellenecek: `tests/header-nav.test.ts:83` (`['/blog','Blog']`; `:90-107` drawer ve gerçek `page.*` kontrolü), `tests/home-data.test.ts:43,63-68`.

E2E (Playwright), mevcut ilke korunur (`e2e/smoke/public-routes.spec.ts:3-13` "self-contained, no seeding"; B16)
- Seed/DB gerektirmeyen strict testler: `request.get('/yazi-dizisi',{maxRedirects:0})` -> 308 `location: /blog`; `/yazi-dizisi/x--00000000-0000-0000-0000-000000000000` -> 308 `/blog/x--...`; `/blog` 200 (statik kartlar DB'siz); `/blog/yazar/almanya101` 200 (kod fallback, DB'siz); kök olmayan slug 404.
- DB'ye bağlı olanlar (bilinen yazı 200, var olan yazar slug'ı 308 hedefi, bozuk uuid 404+noindex) LENIENT mantığıyla (`<500`) ya da ayrı seed'li proje olarak. `:43` `/yazi-dizisi` satırı LENIENT listesinden çıkar (artık redirect).
- Sayfada tek `h1`, canonical `https://almanya101.de/blog…`, geçerli JSON-LD.

Doğrulama: `npm run lint`, `npm run test:unit`, `npm run build`, e2e smoke. Canlıda: `curl -sI https://almanya101.de/yazi-dizisi` -> 308 `/blog`; `curl -sI https://www.almanya101.de/yazi-dizisi/x--uuid` -> tek sıçrama; `curl -s .../sitemap.xml | grep -c yazi-dizisi` -> 0; Rich Results Test (yazı, yazar, hub). Search Console: sitemap yeniden gönder, 5-10 eski URL'i URL Denetimi ile örnekle, 2-4 hafta izle; Bing Webmaster/IndexNow.

## 7. Uygulama sırası ve geri alma
Önkoşul: `feat/admin-redesign` birleşmeden admin dosyalarına dokunulmaz. Yeni dal `feat/blog-seo-geo`.
0. Doğrulama (kod yok): `(marketing)` vs `(site)` layout farkı; canlı DB sorguları (3.1); `arkadasin-kosesi` yazılarının niteliği (K8/K9); canlı yazar slug'ları rezerve liste ile çapraz.
1. `chore: reserve blog and system author slugs` (rezerve liste + app-dizini testi + sistem yazarı admin koruması).
2. `fix: cover placeholder and article JSON-LD graph` (cover `.webp`, `organizationRef`, Person `@id`, `dateModified` kuralı, tek ad). URL değişmez, bağımsız SEO/GEO kazanımı.
3. `feat: almanya101 system author` (seed + silme trigger'ı, `lib/authors.ts`, kod fallback).
4. `feat: unified attribution for rehber and haber` (YALNIZCA rehber ve haber: byline bağlantısı, `AuthorBox`, `authors`, `noIndex`). Blog detay atfı adım 5'e katlanır (taşınan dosyada tek kez yazılır; çift emek yok, B17).
5. `feat: move columnist index and posts under /blog` (rota taşıma, `lib/corner.ts` href ve özet/görünürlük fonksiyonları, hub, yazar rotası, kök shim, iç linkler, nav, `revalidate`, redirect kuralları, testler). Redirect kuralları AYNI commit/release içinde.
6. `feat: blog sitemap, llms.txt, feed and JSON-LD`.
7. Veri migration'ı (K8 onaylıysa): yedek, taşıma, `arkadasin-kosesi` pasif + 308.
8. Preview doğrulaması, Coolify deploy, `curl -I`, Search Console.
9. Sonra: admin etiketleri, CLAUDE.md/docs.

Geri alma: önbellekli 308'ler nedeniyle redirect kuralları üretimde doğrulanmadan yayınlanmaz; gerekirse adım 5-6 revert (birkaç gün önbellek etkisi). Migration additive; veri taşıma `_backup_corner_posts_author`'dan geri yüklenir.

## 8. Riskler
1. Redirect ile aynı release'te taşıma yapılmazsa `/yazi-dizisi*` 404 olur.
2. `(marketing)`/`(site)` aynı `/blog` yolunu tanımlarsa derleme hatası; layout farkı görsel regresyon.
3. Rezerve liste elle bakımlı; test + canlı slug çapraz kontrolü şart.
4. Pasif yazar yazıları: K5b ile gizlenir; yanlış fallback bunları `almanya101`'e atfederdi.
5. Yeni DB sütunu anon GRANT'ini kırar; sütun eklenmiyor.
6. `ON DELETE CASCADE`: sistem yazarı silinirse yazılar gider; trigger + admin API koruması.
7. `isSiteOrganization` ad eşlemesi: gerçek kişi bu adı alamasın diye rezerve + sistem yazarı kuralı.
8. Canlı DB henüz okunmadı; K8 kararı ölçüme bağlı.
9. Hub statikten ISR'ye geçiyor; `content`'siz özet sorgusu ve `revalidate` olmadan bot yükü Supabase'e biner (artık aynı release'te çözülüyor).
10. Aynı worktree'de admin yeniden tasarımı sürüyor; admin ve CLAUDE.md değişiklikleri sona bırakıldı.
11. Yazar kök URL'leri (`/ubt` vb.) 308 ile taşınır; sosyal önizlemeler gecikmeli güncellenir.
12. Marka yazımı (`Almanya101` / `almanya101`) tek sabitte birleşiyor; büyük/küçük harf kararı açık soru 2.
13. Eski başlıklı www isteği zinciri K2b ile tek hop; kanonik slug 308'i ertelendi, çift URL canonical meta ile yönetiliyor.

