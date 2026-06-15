# Tek Sayfalık Dark-Mode Haber Admin Paneli (SPA)

**Tarih:** 2026-06-15
**Durum:** Tasarım — uygulama bekliyor

## Amaç

Bugün haber yönetimi beş ayrı route'tan oluşuyor: `/admin/haberler` (kuyruk),
`/yeni`, `/[id]`, `/kaynaklar`, `/pipeline`, `/ayarlar`. Her route ince bir
`page.tsx` wrapper'ı ve onun içindeki bir `*AdminClient` bileşeninden ibaret.
**Her `*AdminClient` kendini `<NewsAdminShell>` ile sarıyor**; shell auth gate
+ pill nav + logout sahibi. Sekmeler arası geçiş tam sayfa yenileme demek ve
auth her yüklemede yeniden doğrulanıyor.

Ekteki `admin.md` E2E test planının asıl hedefi olarak **tek sayfalık, koyu
temalı bir admin panel** tarif ediyor. Bu tasarım o paneli, mevcut beş client
bileşenini yeniden yazmadan, tek route altında client-side sekmelerle birleştirir.

## Kapsam

**Dahil:**
- Haber yönetiminin beş bölümünü (Kuyruk, Editör, Kaynaklar, Pipeline, Ayarlar)
  tek route altında client-side sekmeli SPA olarak birleştirmek.
- `?tab=` ve `?id=` URL senkronu ile derin linkleme ve tarayıcı geri/ileri desteği.
- Editör'ün create-sonrası `router.push` redirect'ini SPA içi state geçişine çevirmek.
- Kuyruk'taki "Düzenle" ve "Yeni Haber" linklerini SPA içi geçişe çevirmek.
- Mevcut koyu tema görsel dilini koruyarak erişilebilirlik iyileştirmeleri
  (focus-visible halkaları, ARIA tab rolleri, semantik başlık hiyerarşisi).

**Dahil değil (YAGNI):**
- Public haber tarafı (`/haberler`, `/haberler/[slug]`) — dokunulmuyor.
- E2E test altyapısı (Playwright/Cypress) — ayrı iş, kullanıcı bu turda istemedi.
- `data-testid` sözleşmesi — ayrı iş.
- Diğer admin modülleri (Software Hub, Hizmet Rehberi vb.).
- Haber API route'ları (`/api/admin/news/*`) — değişmiyor.

## Mimari

### Sorumluluk ayrımı

Üç katman:

1. **Host route** — `app/admin/haberler/page.tsx`
   Tek giriş noktası. `?tab` ve `?id` query parametrelerini okur, `NewsAdminPanel`'i
   başlangıç sekmesi/post id'si ile render eder. (Server Component; sadece
   `searchParams`'ı client panel'e geçirir.)

2. **SPA container** — `components/admin/news/NewsAdminPanel.tsx` (yeni)
   `'use client'`. Auth gate'i, tab state'ini ve aktif bölümün render'ını sahiplenir.
   - `activeTab` state'i: `'kuyruk' | 'editor' | 'kaynaklar' | 'pipeline' | 'ayarlar'`.
   - `editingPostId` state'i: `string | null` (editör'ün hangi postu açtığı).
   - Auth gate `NewsAdminShell`'den buraya taşınır (aşağıya bakın).
   - Tab değişiminde `history.replaceState` / `router.replace` ile `?tab=` ve `?id=`
     URL'yi günceller (tam yenileme olmadan, scroll sıfırlanmadan).

3. **Panel gövdeleri** — mevcut beş `*AdminClient`, shell wrapper'ı kaldırılmış halde
   Her biri artık sadece kendi **içeriğini** döndürür (dıştaki `<NewsAdminShell>`
   kaldırılır). Panel başlık/açıklamasını prop olarak yukarı taşırlar veya panel
   bunları sabit bir haritadan verir.

### NewsAdminShell'in dönüşümü

`NewsAdminShell` bugün üç şey yapıyor: (a) auth gate, (b) pill nav, (c) başlık+logout
çerçevesi + `{children}`. SPA'da:

- **Auth gate** `NewsAdminPanel`'e taşınır (tek noktada, bir kez doğrulanır).
- **Nav** `<Link>` yerine, `activeTab`'i değiştiren `<button role="tab">`'lara dönüşür.
- **Çerçeve** (başlık, açıklama, logout, geri linki) panel container'ın kendisinde
  yaşar ve aktif sekmeye göre başlık/açıklama gösterir.

`NewsAdminShell.tsx` ya tamamen `NewsAdminPanel` içine erir, ya da yalnızca görsel
çerçeveyi (`role="tablist"` nav + başlık bandı) sunan saf bir layout bileşenine
indirgenir. **Karar:** Shell'i saf bir sunum çerçevesine indirgeyip auth ve tab
mantığını panel'e koymak — böylece auth tek yerde test edilebilir ve shell yeniden
kullanılabilir kalır.

### Editör entegrasyonu (en kritik nokta)

`NewsEditorAdminClient` bugün create sonrası `router.push('/admin/haberler/${id}')`
yapıyor. SPA'da bu çalışmaz (route değişmeden editör'ün postId'si güncellenmeli).

**Çözüm:** Editör'e opsiyonel bir `onCreated?: (id: string) => void` callback prop'u
eklenir.
- `onCreated` verilmişse (SPA modu): redirect yerine `onCreated(created.item.id)`
  çağrılır; panel `editingPostId`'yi set eder ve editör postId prop'uyla yeniden
  render olur (detayı yükler).
- `onCreated` verilmemişse (geriye dönük uyumluluk / standalone): eski
  `router.push` davranışı korunur.

Bu, editör'ün iç mantığını minimum değiştirir ve standalone kullanımı bozmaz.

### Kuyruk → Editör geçişi

`NewsQueueAdminClient`'taki "Düzenle" `<Link href="/admin/haberler/${id}">` ve
"Yeni Haber" `<Link href="/admin/haberler/yeni">` linkleri, opsiyonel callback'lere
çevrilir:
- `onEdit?: (id: string) => void` ve `onCreateNew?: () => void` prop'ları eklenir.
- Prop verilmişse `<button>` + callback; verilmemişse mevcut `<Link>` davranışı korunur.

Panel bu callback'leri `activeTab='editor'` + `editingPostId=id` set edecek şekilde bağlar.

### URL senkronu ve derin linkleme

- Başlangıç: host page `searchParams.tab` / `searchParams.id` okur → panel başlangıç state'i.
- Tab/post değişiminde: `router.replace('/admin/haberler?tab=...&id=...', { scroll: false })`.
- Eski route'lar (`/yeni`, `/kaynaklar`, `/pipeline`, `/ayarlar`, `/[id]`):
  ilgili `?tab=`'a `redirect()` eden ince server wrapper'lara dönüştürülür; böylece
  eski bookmark'lar ve dış linkler çalışmaya devam eder. Bu, route dosyalarını
  silmeden geriye dönük uyumluluk sağlar.

## Veri akışı

```
Host page (server) ──searchParams──► NewsAdminPanel (client)
                                          │
                          auth gate (clientAuth, bir kez)
                                          │
                              ┌───────────┼───────────────┐
                         activeTab    editingPostId    logout
                              │
        ┌────────┬───────────┼───────────┬──────────┐
     Queue    Editor      Sources    Pipeline    Settings
   (onEdit,  (onCreated,  (içerik)   (içerik)    (içerik)
   onCreateNew)  postId)
```

Her panel gövdesi kendi API çağrılarını (`adminJsonFetch`) eskisi gibi yapar.
Panel sadece hangi gövdenin görüneceğini ve aralarındaki geçişi yönetir.

## Hata yönetimi

- Auth hatası: panel auth gate'inde kalır, hata mesajı gösterir (mevcut davranış korunur).
- Panel gövdelerinin kendi hata state'leri (error/message kutuları) değişmez.
- Geçersiz `?tab=` değeri: varsayılan `kuyruk`'a düşülür.
- Geçersiz `?id=`: editör mevcut "Detay yüklenemedi" hatasını gösterir.

## Erişilebilirlik (admin.md gereksinimleri)

- Tab nav: `role="tablist"` / `role="tab"` / `aria-selected` / klavye ok tuşu gezinme.
- Tüm interaktif öğelere `focus-visible` halkası (sadece hover'a güvenilmez).
- Başlık hiyerarşisi: panel başlığı `<h1>`, bölüm başlıkları `<h2>` korunur.
- Form alan-etiket eşlemesi: mevcut `Field`/`<label>` yapısı korunur.
- Kontrast: sarı CTA üstünde siyah metin (mevcut `bg-google-yellow text-black`) korunur.
- Responsive: 375/768/1280 px'de tab bar ve tablo taşması kontrol edilir
  (mevcut `overflow-x-auto` korunur).

## Test / doğrulama

- `npm run lint` temiz olmalı.
- `npx tsc --noEmit` hatasız olmalı.
- `npm run build` başarılı olmalı.
- Manuel doğrulama (admin.md ana akışı): login → sekme geçişleri (yenileme yok) →
  yeni haber oluştur → editör'e SPA içi geçiş → kaydet/yayınla → kuyrukta görün →
  kaynaklar/pipeline/ayarlar sekmeleri açılır → logout.
- Derin link doğrulaması: `/admin/haberler?tab=ayarlar` doğru sekmeyi açar;
  eski `/admin/haberler/ayarlar` redirect ile aynı yere gider.

## Dosya değişiklikleri (özet)

| Dosya | Değişiklik |
|---|---|
| `components/admin/news/NewsAdminPanel.tsx` | **Yeni** — SPA container (auth + tab state + URL senkron) |
| `components/admin/news/NewsAdminShell.tsx` | Saf sunum çerçevesine indirgenir veya panel'e erir |
| `components/admin/news/NewsQueueAdminClient.tsx` | Shell wrapper kaldırılır; `onEdit`/`onCreateNew` prop'ları |
| `components/admin/news/NewsEditorAdminClient.tsx` | Shell wrapper kaldırılır; `onCreated` callback prop'u |
| `components/admin/news/NewsSourcesAdminClient.tsx` | Shell wrapper kaldırılır (içerik döner) |
| `components/admin/news/NewsPipelineAdminClient.tsx` | Shell wrapper kaldırılır (içerik döner) |
| `components/admin/news/NewsSettingsAdminClient.tsx` | Shell wrapper kaldırılır (içerik döner) |
| `app/admin/haberler/page.tsx` | `NewsAdminPanel`'i searchParams ile render eder |
| `app/admin/haberler/{yeni,kaynaklar,pipeline,ayarlar}/page.tsx` | `?tab=`'a redirect eden ince wrapper |
| `app/admin/haberler/[id]/page.tsx` | `?tab=editor&id=`'a redirect eden ince wrapper |

## Riskler / açık noktalar

- Eski route'ları redirect'e çevirmek mevcut bookmark'ları korur ama route
  dosyalarını silmiyoruz — bu bilinçli bir geriye dönük uyumluluk kararı.
- `NewsAdminShell` başka bir yerde kullanılmıyor (grep ile doğrulandı: sadece
  beş news client'ı import ediyor), bu yüzden dönüşümü güvenli.
