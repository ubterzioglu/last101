# last101 için dark mode odaklı E2E test dokümanı

## Yönetici özeti

`ubterzioglu/last101`, Next.js App Router, TypeScript ve TailwindCSS ile kurulmuş bir proje; repo içinde genel site rotalarının yanında daha olgun ve uçtan uca test etmeye en uygun admin alanı olarak özellikle **haber yönetimi** modülü öne çıkıyor. Admin ana sayfasında `Software Hub`, `Haber Yönetimi`, `Arkadaşın Köşesi`, `Hizmet Rehberi`, `Recruitment Agencies` ve `Kırık Link Bildirimleri` bölümleri listeleniyor; ancak en yoğun route/bileşen kapsamı `app/admin/haberler/*` altında. Bu yüzden aşağıdaki E2E planı yeni, tek sayfalık, koyu temalı admin panel tasarımını üretirken öncelikle **haber kuyruğu, editör, kaynak yönetimi, pipeline, ayarlar ve public haber akışı** çevresinde kurgulanmıştır. Repo tarafında admin haber sayfaları ortak bir nested layout yerine page-level `NewsAdminShell` ile sarılıyor; `AdminLayout` yalnızca metadata/noindex tanımlıyor. citeturn30view1turn26view0turn30view0turn32view0turn32view1turn32view2turn32view3turn33view0turn33view1

Bu planın en kritik kararı şudur: **ilk iterasyonda role/text tabanlı locator**, **ikinci iterasyonda explicit test contract** (`data-testid` / `data-cy`) kullanılmalıdır. İncelenen admin/news dosyalarında belirgin bir test özniteliği sözleşmesi görünmüyor; Playwright tarafında resmi öneri locator ve kullanıcıya dönük semantik öznitelikleri önceliklendirmek, Cypress tarafında ise kırılgan CSS/DOM bağımlılıkları yerine daha stabil seçiciler kullanmaktır. citeturn30view2turn37view0turn37view1turn38view0turn38view1turn38view2turn46search0turn46search10turn47search0turn47search4

## Repo keşfi ve kapsam

Repo, kök README’de genel site rotalarını (`/`, `/almanyada-yasam`, `/is-ilanlari`, `/rehber`, `/topluluk`, `/hakkimizda`, `/iletisim`) ve ayrıca **News Module V2** için public ve admin rotaları ayrı ayrı tanımlıyor. News modülü altında public rotalar `/haberler`, `/haberler/[slug]`; admin rotalar `/admin/haberler`, `/admin/haberler/yeni`, `/admin/haberler/[id]`, `/admin/haberler/kaynaklar`, `/admin/haberler/pipeline`, `/admin/haberler/ayarlar`; public API `GET /api/news`, `GET /api/news/[slug]`; admin API ise `/api/admin/news/*` olarak belirtilmiş. citeturn22view0turn23view1

Aşağıdaki haritalama, E2E senaryolarını doğrudan repo içindeki route ve bileşenlere bağlar:

| Route | Amaç | Keşfedilen ana bileşen | Not |
|---|---|---|---|
| `/admin` | Admin giriş noktası | `AdminIndexPage` | Bölüm kartları var. citeturn30view1 |
| `/admin/haberler` | İnceleme kuyruğu | `NewsQueueAdminClient` | Page wrapper açık. citeturn32view0 |
| `/admin/haberler/yeni` | Yeni haber oluşturma | `NewsEditorAdminClient` | Page wrapper açık. citeturn32view1 |
| `/admin/haberler/[id]` | Haber düzenleme | `NewsEditorAdminClient` | `postId` ile yükleniyor. citeturn33view1 |
| `/admin/haberler/kaynaklar` | Kaynak yönetimi | `NewsSourcesAdminClient` | RSS/API/manual kaynak ekleme. citeturn32view2 |
| `/admin/haberler/pipeline` | Ingest tetikleme ve run listesi | `NewsPipelineAdminClient` | Manuel çalıştırma var. citeturn32view3 |
| `/admin/haberler/ayarlar` | Pipeline ayarları | `NewsSettingsAdminClient` | Boolean + numeric + textarea alanları var. citeturn33view0 |
| `/haberler` | Public haber arşivi | `NewsHeroCard` + `NewsArchiveClient` | Hero + kategori filtresi + load more akışı. citeturn43view0turn44view0turn44view1 |
| `/haberler/[slug]` | Public haber detay | detail page + `WhatsAppShareButton` + `NewsListCard` | Kaynak linki ve related posts var. citeturn43view1turn44view2turn44view3 |
| `/admin/haberler` ortak shell | Auth + üst nav | `NewsAdminShell` | Page-level shell; nested layout **unspecified**. citeturn30view2turn31view0 |

Admin haber alanında asıl görsel kabuğu `NewsAdminShell` veriyor. Shell; sessionStorage tabanlı client auth, `/api/admin-auth-verify` ile parola doğrulama, “Kuyruk / Yeni Haber / Kaynaklar / Pipeline / Ayarlar” sekmeli navigasyon ve “Çıkış Yap” davranışı sağlıyor. `AdminLayout` ise yalnızca metadata tanımlıyor ve `children` döndürüyor; yani yeni tek sayfalık dark-mode panelde gerçek layout kontratını test etmek için esas referans `NewsAdminShell` olmalı. citeturn30view0turn30view2turn41view1

## Ortam ve test verisi

Repo’nun paket betikleri `dev`, `build`, `start`, `lint` ve bazı import script’leri içeriyor; **hazır bir E2E script’i package.json içinde tanımlı değil**. Bu yüzden test çalıştırma komutları aşağıda öneri olarak verildi. Uygulama Next.js 15, React 19, TailwindCSS ve Supabase istemcileri kullanıyor. citeturn23view0

Haber modülü için minimum çalışma ortamı ile tam pipeline ortamını ayırmak gerekir. README’ye göre public/admin haber akışının çalışması için Supabase URL/keys ve site env’leri gerekir; `NEWS_PIPELINE_SECRET`, `GEMINI_API_KEY` ve `THENEWSAPI_TOKEN` geliştirmede opsiyonel, ancak “full pipeline” için gereklidir. Admin girişinin basit moda düşebilmesi için `ADMIN_PANEL_PASSWORD` da tanımlanmalıdır. citeturn22view0turn23view1turn42view0

Önerilen E2E test verisi:

| Veri | Değer / kaynak | Kullanım |
|---|---|---|
| Admin parola | `ADMIN_PANEL_PASSWORD` | Admin login smoke ve negatif auth senaryoları. citeturn22view0turn42view0 |
| Haber taslağı | title, slug, summary, content, source fields | `NewsEditorAdminClient` create/edit/publish. citeturn37view1 |
| RSS kaynak kaydı | `name`, `feed_url`, `homepage_url`, `source_type=rss`, `default_category`, `priority`, `fetch_limit` | Kaynak oluştur / test / çalıştır. citeturn38view0 |
| Pipeline ayar kaydı | boolean + numeric + keyword alanları | Ayarlar kaydetme ve persist testi. citeturn38view2 |
| Public hero haberi | `is_featured=true`, `featured_rank=1` | `/haberler` hero görünürlüğü. citeturn37view0turn43view0turn44view1 |

Kurulum akışı için temel komutlar:

```bash
npm install
cp .env.example .env.local
npm run dev
```

Haber modülü veritabanı tarafı da test edilecekse:

```bash
supabase db push
# gerekiyorsa
supabase functions deploy news-ingest
```

README ayrıca `npm run lint`, `npx tsc --noEmit` ve `npm run build` komutlarını doğrulama akışında öneriyor. citeturn22view0turn23view1

## Ana akışlar

Aşağıdaki akış, repo içinde gerçekten var olan route ve bileşenlere göre E2E omurgasını verir:

```mermaid
flowchart TD
    A[/admin/haberler/] --> B{Admin auth}
    B -->|başarılı| C[Kuyruk]
    B -->|başarısız| X[401 veya hata mesajı]

    C --> D[Yeni Haber]
    D --> E[Post oluştur]
    E --> F[/admin/haberler/[id]]
    F --> G[Yayınla veya Taslağa Al]

    C --> H[Kaynaklar]
    H --> I[Kaynak oluştur]
    I --> J[Test Et / Şimdi Çek]

    C --> K[Pipeline]
    K --> L[Pipeline'ı Şimdi Çalıştır]
    L --> M[Run listesi güncellensin]

    C --> N[Ayarlar]
    N --> O[Ayarları Kaydet]

    G --> P[/haberler]
    P --> Q[Hero / kategori filtre / daha fazla yükle]
    Q --> R[/haberler/[slug]]
    R --> S[Kaynak linki / WhatsApp paylaş / ilgili haberler]
```

Bu akışın repo karşılıkları nettir: kuyruğu `NewsQueueAdminClient`, oluşturma ve düzenlemeyi `NewsEditorAdminClient`, kaynakları `NewsSourcesAdminClient`, ingest ekranını `NewsPipelineAdminClient`, ayarları `NewsSettingsAdminClient`, public arşivi `NewsArchiveClient`, hero görünümünü `NewsHeroCard`, detay sayfasını da haber detail page + `WhatsAppShareButton` oluşturur. citeturn32view0turn32view1turn33view1turn32view2turn32view3turn33view0turn43view0turn43view1turn44view0turn44view1turn44view3

Mevcut kod üzerinden güvenle kullanılabilecek fallback locator metinleri de keşfedilebilir durumdadır: login ekranında “Haber Admin”, “Giriş Yap”, password placeholder `••••••••`; queue ekranında “Yenile”, “Yeni Haber”, “Başlık veya özet ara...”, “Filtreleri Uygula”, “Yayınla”, “Taslağa Al”, “Hero Yap / Hero Kaldır”, “Reddet”; kaynak ekranında “Kaynağı Oluştur / Güncelle”, “Test Et”, “Şimdi Çek”; pipeline ekranında “Pipeline’ı Şimdi Çalıştır”; ayarlar ekranında “Ayarları Kaydet”; public tarafta “Daha fazla yükle” ve detayda “WhatsApp'ta paylaş”. Buna rağmen uzun vadeli öneri, bu metinlerin üstüne `data-testid` katmanı eklemektir. citeturn30view2turn37view0turn37view1turn38view0turn38view1turn38view2turn44view0turn44view3turn45view1turn46search0turn46search10turn47search0turn47search4

## Detaylı E2E senaryoları

### Kimlik doğrulama ve shell

**Amaç:** Admin haber alanına giriş, session persistence ve logout akışını doğrulamak.

**Adımlar**
1. `/admin/haberler` sayfasına git.
2. “Haber Admin” başlığını ve password alanını doğrula.
3. Geçerli `ADMIN_PANEL_PASSWORD` ile giriş yap.
4. Üst navigasyonda “Kuyruk”, “Yeni Haber”, “Kaynaklar”, “Pipeline”, “Ayarlar” sekmelerini doğrula.
5. Sayfayı yenile; auth state korunuyor mu kontrol et.
6. “Çıkış Yap” ile session’ı temizle.
7. Hatalı password ile tekrar dene; hata mesajı bekle.

**Beklenen sonuç**
- Geçerli parola ile shell açılır ve alt sayfalar görünür.
- Yenilemede auth state sessionStorage üzerinden korunur.
- Logout sonrası tekrar login ekranı gelir.
- Hatalı parola 401/hata mesajı üretir. Art arda çok sayıda başarısız denemede rate limit devreye girebilir. Repo kodunda başarısız denemeler için IP+path bazlı bellek içi sayaç tutuluyor; eşik 12 deneme, pencere 15 dakika, blok süresi 30 dakika. citeturn30view2turn39view0turn41view1turn42view0turn42view1turn42view3

**Playwright örneği**
```ts
await page.goto('/admin/haberler');
await expect(page.getByText('Haber Admin')).toBeVisible();
await page.getByPlaceholder('••••••••').fill(process.env.ADMIN_PANEL_PASSWORD!);
await page.getByRole('button', { name: /giriş yap/i }).click();
await expect(page.getByRole('link', { name: /kuyruk/i })).toBeVisible();
```

**Cypress örneği**
```ts
cy.visit('/admin/haberler');
cy.contains('Haber Admin').should('be.visible');
cy.get('input[placeholder="••••••••"]').type(Cypress.env('ADMIN_PANEL_PASSWORD'));
cy.contains('button', 'Giriş Yap').click();
cy.contains('Kuyruk').should('be.visible');
```

### Kuyruk, filtreleme ve durum aksiyonları

**Amaç:** Kuyruk ekranının veri yükleme, arama, filtre ve aksiyonlarını doğrulamak.

**Adımlar**
1. `/admin/haberler` altında queue ekranını aç.
2. “Yenile” ile listeyi tekrar yükle.
3. `Başlık veya özet ara...` alanında arama yap.
4. Durum filtresini “Tüm Durumlar” dışına al.
5. Kategori filtresini değiştir ve “Filtreleri Uygula” tıkla.
6. İlk uygun kayıt için sırayla `Düzenle`, `Yayınla` veya `Taslağa Al`, `Hero Yap / Hero Kaldır`, `Reddet` akışlarını doğrula.

**Beklenen sonuç**
- Liste `/api/admin/news/posts` parametreli çağrısıyla filtrelenir.
- Tabloda en az şu kolonlar/doğrulamalar görünür: başlık, kategori, durum, kaynak, tarih, hero bilgisi.
- Aksiyon sonrası liste yeniden yüklenir ve satır durumları güncellenir. Queue client doğrudan publish/reject/archive/feature POST ve PATCH istekleri çalıştıracak şekilde kurgulanmıştır. citeturn37view0

### Yeni haber oluşturma ve görsel yükleme

**Amaç:** Boş formdan haber oluşturmak ve admin editör formunun kritik alanlarını test etmek.

**Adımlar**
1. `/admin/haberler/yeni` aç.
2. En az şu alanları doldur: `title`, `slug`, `category`, `summary`, `content`, `source_name`, `source_url`.
3. Opsiyonel olarak bir görsel yükle ve `cover_image_url` alanının set edildiğini doğrula.
4. “Kaydet” benzeri akışla taslak oluştur.
5. Oluşturma sonrası sistemin `/admin/haberler/[id]` rotasına yönlendirdiğini doğrula.

**Beklenen sonuç**
- Yeni kayıt POST `/api/admin/news/posts` ile oluşur.
- Image upload senaryosunda `/api/admin/news/upload` çağrısı sonrası dönen `publicUrl` forma işlenir.
- Create akışı tamamlanınca edit sayfasına redirect olur. citeturn32view1turn37view1

### Haber düzenleme, yayınlama ve arşivleme

**Amaç:** Var olan bir kaydı edit ekranında güncellemek.

**Adımlar**
1. Queue’den “Düzenle” ile bir habere git ya da doğrudan `/admin/haberler/[id]`.
2. Başlık, özet, içerik, `reading_minutes`, `published_at`, `show_in_carousel`, `editor_notes` alanlarını değiştir.
3. Kaydet.
4. “Yayına al” akışını tetikle.
5. Aynı kaydı tekrar açıp `Hero` ve `Arşivle` / `Reddet` aksiyonlarını doğrula.

**Beklenen sonuç**
- Edit ekranı `postId` ile detayı yükler.
- Kaydetmede PATCH çağrısı çalışır; publish mode’da ayrıca publish endpoint’i tetiklenir.
- Başarılı işlem sonrasında success mesajı görünür. citeturn33view1turn37view1

### Kaynak yönetimi

**Amaç:** RSS/API/manual kaynak ekleme, düzenleme, test etme ve çalıştırma.

**Adımlar**
1. `/admin/haberler/kaynaklar` aç.
2. Yeni kaynak formunu `name`, `feed_url`, `homepage_url`, `source_type`, `default_category`, `usage_mode`, `priority`, `fetch_limit`, `is_active` alanlarıyla doldur.
3. Kaynağı oluştur.
4. Oluşan satırda `Test Et` çalıştır.
5. `Şimdi Çek` ile tek kaynak ingest tetikle.
6. Aynı kaydı `Düzenle`, değiştir ve güncelle.

**Beklenen sonuç**
- Oluşturma `POST /api/admin/news/sources`, güncelleme `PATCH /api/admin/news/sources/:id`.
- “Test Et” kullanıcıya test sonucu ve mümkünse preview ilk kayıt başlığını gösterir.
- “Şimdi Çek” manuel ingest tetikleyip listeyi yeniler. citeturn32view2turn38view0

### Pipeline ve ayarlar

**Amaç:** Manuel ingest ve settings persistence’ı doğrulamak.

**Adımlar**
1. `/admin/haberler/pipeline` aç.
2. Kaynak seçimini “Tüm aktif kaynaklar” ve tekil kaynak modlarında dene.
3. “Pipeline’ı Şimdi Çalıştır” tıkla.
4. “Son Çalışmalar” tablosunda yeni satır veya güncellenmiş durum bekle.
5. `/admin/haberler/ayarlar` aç.
6. `pipeline_enabled`, `ai_enabled`, limit/retention alanları, `excluded_keywords` ve `high_priority_keywords` üzerinde değişiklik yap.
7. “Ayarları Kaydet” ile persist kontrol et.
8. Sayfayı yenile ve değerlerin korunduğunu doğrula.

**Beklenen sonuç**
- Pipeline ekranı run listesi ve source listesini birlikte yükler.
- Manuel çalıştırma sonrası run tablosunda `trigger_type`, `status`, `inserted_count`, `duplicate_count`, `error_count` doğrulanabilir.
- Ayarlar PATCH sonrası yeniden yüklenebilir ve form state’i persist eder. Repo README’si ayrıca `/admin/haberler/pipeline` üzerinden manual run ve sonrasında `/admin/haberler` içinde `pending_review` kayıtlarının görünmesini öneren manuel test akışı tanımlar; bu E2E planı o akışla uyumludur. citeturn32view3turn33view0turn38view1turn38view2turn23view1

### Public yayın doğrulaması

**Amaç:** Admin’den yayınlanan içeriğin public yüze doğru taşındığını doğrulamak.

**Adımlar**
1. Yayına aldığın kaydın `/haberler` sayfasında görünmesini bekle.
2. Eğer `is_featured=true` ise hero kartında göründüğünü doğrula.
3. Kategori filtrasyonunu değiştir.
4. “Daha fazla yükle” ile cursor tabanlı pagination doğrula.
5. Bir haber kartına gir ve `/haberler/[slug]` detayını aç.
6. Başlık, kategori, yayın tarihi, okuma süresi, içerik, kaynak, varsa kaynak linki, WhatsApp paylaşımı ve related posts bloklarını doğrula.

**Beklenen sonuç**
- `/haberler` sayfası hero haberi ayrı gösterir ve geri kalan akışı `NewsArchiveClient` ile `/api/news` üzerinden 12’li sayfalar halinde çeker.
- Detay sayfası slug ile haber bulamazsa 404/notFound verir; bulursa kaynak bilgisi, paylaşım ve ilgili haberleri gösterebilir. citeturn43view0turn43view1turn44view0turn44view1turn44view2turn44view3turn45view0turn45view1

## Dark mode ve erişilebilirlik kontrolleri

İncelenen admin/news bileşenleri zaten koyu bir görsel dile sahip: beyaz metin, düşük opasiteli koyu yüzeyler (`bg-white/[0.05]`, `border-white/10`) ve Google accent renkleri (`google.blue`, `google.yellow`, `google.red`, `google.green`, `google.orange`) birlikte kullanılıyor. Global sitede `body` varsayılanı beyaz olsa da `globals.css` içinde koyu/black shell için `body[data-devuser]` stilleri mevcut; incelenen dosyalarda bağımsız bir `dark:` theme toggle mekanizması görünmediği için **theme switcher unspecified** kabul edilmelidir. Yeni panelde bu açıkça test kontratına dönüştürülmelidir. citeturn35view1turn35view2turn30view2turn37view0turn38view0turn38view1turn38view2

Dark mode için zorunlu kontroller:

| Kontrol | Nasıl doğrulanır | Beklenen |
|---|---|---|
| Arka plan ve yüzey kontrastı | shell, kart, input, tablo satırı screenshot + computed style | Metin ve aksiyonlar WCAG AA’ya yakın/uygun kontrastta okunur; sarı CTA üstünde siyah yazı bozulmaz. Repo erişilebilirlik hedefi WCAG AA olarak belirtiliyor. citeturn22view0turn23view1 |
| Focus görünürlüğü | Tab ile login, nav, filtre, form input, tablo aksiyonları gez | Focus kaybolmaz; repo genelinde keyboard navigation ve skip link hedefi var. citeturn22view0turn35view1 |
| Hover/focus ayrışması | primary/secondary/danger butonlarda | Hover yalnız renk değişimiyle sınırlı kalmaz; focus-visible da test edilir. Repo kodunda hover state’ler var; yeni panelde `focus-visible` ayrı doğrulanmalı. citeturn30view2turn37view0turn38view0turn38view1turn38view2 |
| Responsive dark shell | 375px, 768px, 1280px | Tek kolon/çok kolon geçişlerinde taşma ve okunabilirlik bozulmaz. Repo responsive/mobile-first iddiası taşıyor. citeturn22view0turn23view1 |
| Reduced motion / animasyon | varsayılan ve gerekirse reduced-motion ortamında | Zorunlu olmayan animasyonlar testleri flake etmez; Playwright/Cypress auto-wait/retry mekanizmaları bunu stabil test etmede önemlidir. citeturn46search2turn46search23turn47search3turn46search11 |

Erişilebilirlik tarafında, testler en az şu doğrulamaları içermelidir: başlık hiyerarşisi, form alanı-etiket eşleşmesi, buton/link ayırt ediciliği, klavye ile tam gezinme, boş durum mesajlarının okunabilirliği, hata/success mesajlarının görsel olarak kaybolmaması ve public haber detayında kaynak linki ile paylaşım butonunun ekran okuyucu açısından anlamlı olması. Repo README’si semantik HTML, ARIA, keyboard navigation, skip link ve yüksek kontrast hedeflerini açıkça söylüyor; Playwright locator yaklaşımı ve Cypress etkileşim kontrol modeli bu tür doğrulamaları stabil hale getirir. citeturn22view0turn23view1turn46search0turn46search2turn46search23turn47search3

## Çalıştırma, CI ve hata ayıklama

Repo içinde resmi E2E script’i olmadığı için önerilen ek yapı aşağıdaki gibi tutulabilir:

```bash
# mevcut doğrulamalar
npm run lint
npx tsc --noEmit
npm run build

# öneri: Playwright
npx playwright test

# öneri: Cypress
npx cypress run
```

Bu öneri, repo’nun mevcut script setine ek olarak düşünülmelidir; mevcut kök script’lerde E2E komutu tanımlı değildir. Playwright tarafında locator, auto-wait ve async web-first assertion yaklaşımı; Cypress tarafında retry-ability, actionability kontrolleri ve test retries özellikleri CI stabilitesi için doğrudan faydalıdır. citeturn23view0turn46search0turn46search2turn46search23turn46search13turn46search3turn46search7turn46search16turn47search3turn46search11

Önerilen CI akışı:

| Aşama | Komut | Amaç |
|---|---|---|
| Static gate | `npm run lint && npx tsc --noEmit && npm run build` | Build kırıkları, tip ve lint hatalarını E2E’den önce yakala. citeturn23view1turn23view0 |
| Smoke E2E | admin login + queue open + public `/haberler` smoke | Deploy sonrası temel yaşama testi |
| Full E2E | create → publish → public validate → archive | Ana kullanıcı akışının uçtan uca doğrulanması |
| Artifact toplama | screenshot, trace/video, network logs | Flaky veya görsel dark-mode farklarını ayıklama |

Debug ipuçları:
- Admin login testleri 401 yerine 429 dönmeye başladıysa, yanlış parola denemeleri rate limit’e takılmış olabilir. Aynı IP/path için sayaç tutuluyor. citeturn42view0turn42view1turn42view3
- Queue veya pipeline testleri boş dönüyorsa önce kaynak oluşturma ve pipeline ayarlarını doğrula; README’nin manuel akışı da önce `/admin/haberler/kaynaklar`, sonra `/admin/haberler/pipeline`, sonra `/admin/haberler` kuyruğunu kontrol etmeyi öneriyor. citeturn23view1
- Selector flake görürsen metin/CSS yerine explicit test contract ekle. Cypress dökümantasyonu daha az kırılgan selector kullanımını, Playwright ise explicit locator sözleşmesini önerir. citeturn47search0turn47search4turn46search0turn46search10

## Kısa checklist ve açık sorular

**Kısa checklist**

- [ ] `ADMIN_PANEL_PASSWORD` ve gerekli Supabase env’leri hazır.
- [ ] `/admin/haberler` login, refresh, logout çalışıyor.
- [ ] Queue filtreleri, satır aksiyonları ve hata mesajları doğrulandı.
- [ ] Yeni haber oluşturma + görsel yükleme + edit + publish akışı geçti.
- [ ] Kaynak oluşturma / test etme / şimdi çek akışı geçti.
- [ ] Pipeline run ve ayarlar persist doğrulandı.
- [ ] `/haberler` hero, kategori filtresi ve “Daha fazla yükle” akışı geçti.
- [ ] `/haberler/[slug]` kaynak linki, WhatsApp paylaşımı ve related posts doğrulandı.
- [ ] Dark mode kontrast, focus, responsive ve keyboard navigation kontrolleri geçti.
- [ ] CI’de screenshot/trace artifact toplama aktif. citeturn23view1turn30view2turn37view0turn37view1turn38view0turn38view1turn38view2turn43view0turn43view1turn44view0turn44view3

**Açık sorular / sınırlamalar**

İncelenen dosyalarda **resmî bir E2E script’i**, **ortak nested admin layout**, **açık bir theme toggle**, ve **`data-testid`/`data-cy` sözleşmesi** görünmüyor; bunlar yeni admin panel tasarımında açık karar konusu olarak ele alınmalıdır. Ayrıca `Software Hub`, `Hizmet Rehberi`, `Recruitment Agencies` ve diğer admin modülleri ana indeks üzerinde görülebiliyor olsa da bu dokümanda derinlemesine test kapsamı özellikle haber yönetimine odaklandı; diğer modüller için ayrı E2E genişletmesi planlanmalıdır. Bazı JSX blokları GitHub text görünümünde kısmen satır içi sıkışmış olduğundan, erişilebilirlikte alan-etiket bire bir eşleşmelerinin son teyidi canlı DOM üzerinde yapılmalıdır. citeturn30view1turn30view2turn26view0turn35view1turn37view0turn37view1turn38view0turn38view1turn38view2