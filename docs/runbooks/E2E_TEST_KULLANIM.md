# almanya101 — E2E Test Kullanım Kılavuzu (Teknik Doküman)

Bu doküman, repoya yeni eklenen **Playwright E2E smoke test altyapısının** nasıl
çalıştırılacağını, sonuçların **HTML rapor** olarak nasıl görüntüleneceğini ve
**production** üzerinde nasıl test edileceğini ayrıntılı olarak anlatır.

> Kapsam notu: Bu ilk faz **smoke + güvenlik (auth guard)** seviyesindedir.
> İnteraktif araçların (maaş, banka, vize vb.) **derin fonksiyonel testleri**
> bilinçli olarak DIŞARIDA bırakılmıştır — çünkü bu 8 araç `middleware.ts`
> tarafından **login arkasına alınmıştır** (aşağıda "Önemli Gerçekler").

---

## 1. Hızlı Başlangıç (TL;DR)

```bash
# 1) Bağımlılıklar (bir kez)
npm install
npx playwright install chromium

# 2) Lokal app'i ayağa kaldır (ayrı terminal) VEYA production URL kullan
npm run dev          # http://localhost:3000

# 3) Testleri çalıştır
npm run e2e:smoke    # sadece smoke suite
npm run e2e          # tüm e2e

# 4) HTML raporu aç
npm run e2e:report   # playwright-report/ klasörünü tarayıcıda açar
```

Production'a karşı test:

```bash
# Windows PowerShell
$env:BASE_URL="https://almanya101.de"; npm run e2e:smoke

# macOS/Linux/Git-Bash
BASE_URL=https://almanya101.de npm run e2e:smoke
```

---

## 2. Eklenen Dosyalar

| Dosya | Görevi |
|---|---|
| `playwright.config.ts` | Test runner ayarı. `BASE_URL` verilirse ona, verilmezse lokal `next build && next start`'a bağlanır. HTML rapor üretir. |
| `e2e/smoke/public-routes.spec.ts` | Public sayfaların açıldığını + login-gated araçların anonim erişime kapalı olduğunu doğrular. |
| `e2e/smoke/admin-guards.spec.ts` | Admin API'lerinin anonim isteği reddettiğini (200 dönmediğini) doğrular. |
| `e2e/auth.setup.ts` | Test kullanıcısıyla bir kez login olup oturumu `storageState`'e kaydeder (gated araç testleri için). |
| `e2e/tools/*.spec.ts` | **8 login-gated aracın derin fonksiyonel testleri** (authenticated). |
| `scripts/e2e-create-test-user.mjs` | Supabase'de idempotent test kullanıcısı oluşturur. |
| `.github/workflows/e2e.yml` | Her PR/main push'ta CI'da smoke koşar, HTML raporu artifact olarak yükler. |
| `package.json` | `e2e`, `e2e:smoke`, `e2e:report` script'leri + `@playwright/test` dev bağımlılığı. |

### Gated araç testleri (e2e/tools/) — 29 test, production'da yeşil

Bu 8 araç login arkasında olduğu için authenticated (`chromium-auth`) projesi
altında, `auth.setup.ts`'in ürettiği oturumla koşar:

| Araç | Test sayısı | Kapsam |
|---|---|---|
| `maas-hesaplama` | 5 | Hesapla → 6 kart, brüt>net, kırılım, tersine (net→brüt) mod |
| `vatandaslik-testi` | 4 | Mod seçimi, disabled buton, tam sınav akışı → sonuç |
| `banka-secim` | 5 | 20 soruluk quiz → 3 öneri + skor + sıfırla |
| `sigorta-secim` | 5 | 20 soru → must/should/nice skorlu sonuç |
| `vize-secim` | 5 | Dallanmalı karar ağacı → vize sonucu |
| `para-transferi` | 5 | 20 soruluk quiz → öneri (prod versiyonu) |
| `stepstone-karsilastirma` | 4 | Profil formu → eksik-alan uyarısı + medyan karşılaştırma |
| `software-hub` | 3 | Devuser paneline redirect doğrulaması |

Çalıştırma:
```bash
BASE_URL=https://almanya101.de npx playwright test --project=chromium-auth
```

> Test kullanıcısı: `e2e-test@almanya101.de` (production Supabase'de oluşturuldu).
> Kimlik bilgileri `E2E_TEST_EMAIL` / `E2E_TEST_PASSWORD` env değişkenleriyle
> override edilebilir; CI'da bunları GitHub Secrets olarak tanımlayın.

---

## 3. Script Referansı

| Komut | Ne yapar |
|---|---|
| `npm run e2e` | `e2e/` altındaki tüm testleri çalıştırır. |
| `npm run e2e:smoke` | Sadece `e2e/smoke/` klasörünü çalıştırır (en hızlı kapı). |
| `npm run e2e:report` | Son koşunun `playwright-report/` HTML raporunu tarayıcıda açar. |

Doğrudan Playwright CLI ile daha ince kontrol:

```bash
# Tek dosya
npx playwright test e2e/smoke/admin-guards.spec.ts

# Tek test (satır numarasıyla)
npx playwright test e2e/smoke/public-routes.spec.ts:50

# Tarayıcı görünür (headed) modda
npx playwright test --headed

# Adım adım UI mod (debug için en iyisi)
npx playwright test --ui

# İsim filtreleyerek
npx playwright test -g "admin"
```

---

## 4. İki Kullanım Şekli

### 4.A — Entegre (CLI / CI / "admin panel" iş akışı)

Bu, testleri **proje iş akışının parçası** olarak çalıştırma yöntemidir.

**Lokal (geliştirici makinesi):**
```bash
npm run dev                                   # terminal 1
npm run e2e:smoke                             # terminal 2
```

**CI (GitHub Actions — otomatik):**
`.github/workflows/e2e.yml` her PR ve `main` push'unda otomatik çalışır:
1. Node 20 + `npm ci`
2. `npx playwright install --with-deps chromium`
3. `npm run e2e:smoke`
4. HTML raporu **artifact** olarak yükler (GitHub > Actions > ilgili run > Artifacts > `playwright-report`).

CI raporunu indirmek: ilgili workflow run sayfasında **Artifacts** bölümünden
`playwright-report` zip'ini indir, aç, `index.html`'i tarayıcıda aç.

> Not: Bu repoda ayrı bir "test admin paneli" UI'ı yoktur; testler komut
> satırından / CI'dan yönetilir. "Admin panel" akışı = geliştirici/CI komutları.

### 4.B — Bağımsız HTML Rapor (tek dosya, tarayıcıda)

Her koşudan sonra Playwright `playwright-report/` klasörüne **kendi içinde
çalışan bir HTML raporu** üretir. Bu raporu kimseye bağımlı olmadan açabilirsin:

```bash
# Koşudan sonra:
npm run e2e:report
# veya doğrudan:
npx playwright show-report
```

Manuel açmak istersen: `playwright-report/index.html` dosyasını çift tıkla.
Rapor içinde:
- Her testin geç/kaldı durumu,
- Hata mesajı + stack,
- **Trace** (zaman çizelgesi, DOM snapshot'ları),
- Hata anının **ekran görüntüsü** ve gerekiyorsa video.

Raporu birine göndermek için tüm `playwright-report/` klasörünü zip'leyip
paylaşabilirsin; alıcı `index.html`'i açtığında her şey çalışır (sunucu gerekmez).

---

## 5. Production Üzerinde Test (senin akışın)

Production gerçek ortam davranışını yansıttığı için en güvenilir hedeftir.

```bash
# PowerShell
$env:BASE_URL="https://almanya101.de"
npm run e2e:smoke
npm run e2e:report
```

`BASE_URL` set edildiğinde Playwright **lokal build yapmaz**, doğrudan o URL'ye
gider. Bu yüzden production testi saniyeler sürer.

**Hangi testler production'da anlamlı?**
- `admin-guards.spec.ts` → tamamen production-güvenli (sadece HTTP istek; veri
  değiştirmez). Admin API'lerinin gerçekten kapalı olduğunu doğrular.
- `public-routes.spec.ts` → public sayfaların açıldığını + gated araçların anonim
  erişime kapalı olduğunu doğrular. Veri yazmaz.

> Hiçbir smoke testi veri OLUŞTURMAZ/SİLMEZ — production'da güvenle koşar.

---

## 6. Önemli Gerçekler (testler çalıştırılırken keşfedildi)

Bunlar dökümana göre değil, **çalışan uygulamadan** doğrulanmıştır:

1. **8 interaktif araç login arkasında.** `middleware.ts` içindeki
   `GATED_PREFIXES`: `banka-secim`, `sigorta-secim`, `maas-hesaplama`,
   `stepstone-karsilastirma`, `vatandaslik-testi`, `para-transferi`,
   `vize-secim`, `software-hub`. Anonim ziyaret → `/giris`'e yönlenir.
   Bu araçların **iç mantığını** test etmek için giriş yapmış bir oturum
   (storageState fixture) gerekir — bu faz dışıdır.

2. **Güvenlik bulgusu (düzeltildi, ayrı PR).** `recruitment-agencies-admin-list`
   ve `-action` endpoint'leri `if (!(await isAdminAuthorized(request)))` yanlış
   kalıbını kullanıyordu. `isAdminAuthorized` bir **obje** döner (boolean değil),
   bu yüzden guard hiç çalışmıyor ve **anonim kullanıcı production'da 200 + veri**
   alabiliyordu. Doğru kalıp `news-admin-*` endpoint'lerinden alındı:
   ```ts
   const auth = await isAdminAuthorized(request);
   if (!auth.ok) return NextResponse.json({ error: auth.reason }, { status: auth.status });
   ```
   Fix ayrı branch/PR'da: `fix/admin-auth-bypass-recruitment`.

3. **Public route listesi README'ye güvenilmez.** Çalışan app'te anonim olarak
   kesin 200 dönen public sayfalar `/` ve `/haberler`. Diğer içerik sayfaları
   veri/CMS durumuna bağlı; bu yüzden "5xx atmasın / JS patlamasın" seviyesinde
   gevşek doğrulanır.

---

## 7. Yapılandırma Notları (`playwright.config.ts`)

| Ayar | Değer | Anlamı |
|---|---|---|
| `testDir` | `./e2e` | Testlerin kök klasörü. |
| `testIdAttribute` | `data-pw` | `getByTestId()` bu attribute'u arar. Kritik UI öğelerine `data-pw="..."` ekleyince testler kırılgan olmaz. |
| `retries` | CI'da `1`, lokalde `0` | CI'da geçici (flaky) hatalar bir kez tekrar denenir. |
| `webServer` | `BASE_URL` yoksa `next build && next start` | Lokalde otomatik build+serve. `BASE_URL` varsa devre dışı. |
| `reporter` | `html` + `list` | Terminalde liste, diskte HTML rapor. |
| `trace` | `retain-on-failure` | Sadece başarısız testte trace saklanır (debug için). |

---

## 8. Yeni Test Eklerken (kılavuz)

1. İlgili `.spec.ts` dosyasını `e2e/<alan>/` altına koy.
2. **Her test bağımsız olsun** — paylaşılan state, sıraya bağımlılık yok.
   (Bu repoda bilinçli kural: "toollar kendi içlerinde tutarlı ve bağımsız.")
3. Selector önceliği: önce `getByRole(...)`/metin, gerekirse `data-pw` test-id.
4. Gerçek davranışa karşı **çalıştırarak** doğrula — kod okuyup varsayma.
   (Bu repoda varsayımlar birden çok kez yanlış çıktı.)
5. Login gerektiren araç testleri için: önce bir `storageState` auth fixture
   kur (test kullanıcısıyla `/giris`'ten geçip cookie sakla), sonra o state'i
   `test.use({ storageState })` ile yükle.

---

## 9. Sık Sorunlar

| Belirti | Sebep / Çözüm |
|---|---|
| Tüm public testler 404 / kaldı | Lokal `.env.local` Supabase ulaşılamıyor olabilir; `next dev` log'una bak. Production'a (`BASE_URL`) karşı koş. |
| `webServer` timeout | İlk `next build` uzun sürer (180s timeout). Hızlı doğrulama için `npm run dev` + `BASE_URL=http://127.0.0.1:3000`. |
| Gated araç testi beklenmedik | 8 araç login arkasında (bkz. Bölüm 6.1). Anonim erişim `/giris`'e gider — bu DOĞRU davranıştır. |
| `chromium` bulunamadı | `npx playwright install chromium` çalıştır. |
| Rapor açılmıyor | `playwright-report/index.html` çift tıkla veya `npx playwright show-report`. |
