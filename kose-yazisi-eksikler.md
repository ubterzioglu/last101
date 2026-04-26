# Köşe Yazısı Modülü — Eksikler Listesi

**Tarih:** 2026-04-26
**Modül:** Arkadaşın Köşesi (`corner_*`)

Aşağıdaki maddeler kod tabanı incelenerek bulundu. **Kategoriler:**

- 🔴 **Bug / yanlış davranış** — ya da çok büyük olasılıkla yanlış
- 🟠 **Eksik temel özellik** — modülün düzgün çalışması için olması gereken
- 🟡 **İyileştirme** — olsa iyi olur, eksik kalmış
- 🟢 **Nice-to-have** — opsiyonel

---

## 🔴 Gerçek bug/yanlış davranış

### 1. Yazı sıralaması ters
**Yer:** `lib/corner.ts:228` ve `lib/corner.ts:271`
```ts
.order('published_at', { ascending: true, nullsFirst: false })
```
Hem `/yazi-dizisi` listesinde hem de yazar sayfasında yazılar **eskiden yeniye** sıralanıyor. Blog UX'inde standart **yeniden eskiye**'dir. Sayfada da etiket "eskiden yeniye" diyor — yani niyet ile kod tutarlı, fakat **niyet yanlış**. Kullanıcı en yeni yazıyı en altta görüyor.

> **Kontrol:** `ascending: false` olmalı. Aksi halde kullanıcı 50 yazı arasında en yeniye scroll yapmak zorunda.

### 2. Sitemap'te köşe rotaları yok
**Yer:** `app/sitemap.ts`
Sitemap'te yalnızca 7 statik rota var. Eksikler:
- `/yazi-dizisi` (liste)
- `/yazi-dizisi/<slug>` (her yayında yazı)
- `/<authorSlug>` (her aktif yazar)

> **SEO etkisi:** Google köşe yazılarını keşfetmekte zorlanır. Sitemap'i `corner_authors` ve `corner_posts` tablolarından dinamik üretmek gerek.

### 3. `bio_content` hiçbir yerde gösterilmiyor
**Yer:** `app/(site)/[authorSlug]/page.tsx:70`
Yazar sayfasında yalnızca `shortBio` render ediliyor. Hâlbuki tabloda hem `short_bio` hem de `bio_content` (markdown, 1MB'a kadar) var. Admin panelinde "Profil metni" diye düzenleniyor ama public'te kayıp.

> Yazar sayfasında bir "Hakkında" bölümü olarak `MarkdownPreview` ile basılmalı.

### 4. Yazar slug değişirse görsel yolları kırılır (sessiz hata)
**Yer:** `app/api/corner-author-upload/route.ts:55`
```ts
const objectPath = `authors/${auth.author?.slug}/${folder}/...`
```
Yazar slug'ı admin tarafından güncellendiğinde (`update_author`), Storage'daki eski yol değişmez ama yeni yüklenenler yeni yola gider. Eski URL'ler hâlâ çalışır (gerçekten kırılmaz) ama listelerde tutarsızlık olur. Slug rename'de path migration yok.

### 5. Açık metin şifre `sessionStorage`'da
**Yer:** `components/CornerAuthorPanelClient.tsx:53`, `components/CornerAdminClient.tsx:48`
```ts
sessionStorage.setItem(authKey(slug), password);
```
Yazar şifresi tarayıcıda **plaintext** tutuluyor ve her API çağrısında header olarak gönderiliyor. XSS halinde ifşa olur. Doğrusu: HttpOnly cookie + token (JWT veya opaque session id).

---

## 🟠 Eksik temel özellik

### 6. Yazı içeriği için inline görsel yükleme yok
`corner-author-upload` rotasında `folder='posts'` parametresi var ama yazar paneli (`CornerAuthorPanelClient.tsx`) yalnızca **kapak görseli** için kullanıyor. Yazının içine markdown ile görsel eklemek isteyen yazarın elle URL bulması gerek. Editör içinde "görsel yükle ve markdown'a ekle" butonu yok.

### 7. Yazar kendi şifresini değiştiremiyor
Şifre sıfırlama yalnızca admin tarafından yapılabiliyor (`reset_author_password`). Yazar panelinde "şifremi değiştir" alanı yok. Bunun için yazarın admine yazması gerekiyor.

### 8. Şifremi unuttum akışı yok
Ne admin için ne yazar için. E-posta ya da geri kazanma mekanizması bulunmuyor. Şifre kaybedilirse admin tarafından elle resetlenmeli.

### 9. Yazar e-posta alanı yok
`corner_authors` tablosunda hiç e-posta sütunu yok. Bu yüzden:
- Şifre sıfırlama linki gönderilemez
- Yorum/geri bildirim toplama yapılamaz
- Yazıya tepki bildirimleri gönderilemez

### 10. Pagination yok
**Yer:** `lib/corner.ts:175,197,219`
- Yazarlar: hardcoded `limit = 48`
- Yazılar: hardcoded `limit = 100/120`

50+ yazar veya 200+ yazı olunca patlamaz ama tek sayfada renderlama maliyeti artar. Pagination veya infinite scroll yok.

### 11. Tag / kategori sistemi yok
Tüm yazılar düz bir liste. Filtreleme, kategori sayfaları, tag bulutu — hiçbiri yok. Yazı detay metadata'sında `tags` sabit:
```ts
tags: ['Arkadaşın Köşesi', 'Yazı Dizisi', 'Almanya']
```

### 12. Arama / filtreleme yok
`/yazi-dizisi` sayfasında ne arama kutusu, ne yazara göre filtre, ne tarih aralığı. Yazı sayısı arttıkça keşif zorlaşır.

### 13. Yazı detayında "ilgili yazılar" / yazardan diğer yazılar yok
Detay sayfasının altında ne aynı yazardan diğer yazılar var, ne ilgili yazı önerisi. Tek "Tüm yazılara dön" linki var.

### 14. Önceki / sonraki yazı navigasyonu yok
Detay sayfasında ileri-geri yok.

### 15. Autosave yok
Yazar uzun bir yazı yazarken sayfayı kapatırsa veya sekme çakarsa **her şey kaybolur**. Hiç autosave veya draft snapshot mekanizması yok. Form `useState` ile çalışıyor; localStorage'a bile yazılmıyor.

### 16. Yazı önizleme linki (taslak için) yok
Taslakta bir yazıyı admin/yazar haricinde kimseye gösterme imkânı yok. "Token ile preview link" yok. Editör birine "şuna bak" demek isterse yayına almak zorunda.

### 17. Yorumlar yok
Hiç yorum sistemi yok. (Bilinçli bir tercih olabilir, ama eksik olarak kayda geçer.)

### 18. View counter / okunma sayısı yok
Hiçbir yazının kaç kere okunduğu ölçülmüyor. Popüler yazıları sıralamak, "öne çıkanlar" rubriği yapmak imkânsız.

### 19. RSS / Atom feed yok
`/yazi-dizisi/feed.xml` veya benzer bir endpoint yok. Blog standardı.

### 20. Yazı içeriğinde ALT-text alanı yok
Kapak görseli alt'ı `post.title` olarak basılıyor, ayrı bir `cover_alt` sütunu yok. SEO + accessibility için ideal değil.

---

## 🟡 İyileştirme

### 21. `is_primary` legacy alanı kullanılmıyor
**Yer:** `corner_posts.is_primary` (migration'da var, kodda hiç okunmuyor)
Multi-author migration'dan kalma ölü alan. Temizlenmeli ya da gerçekten kullanılmalı.

### 22. Markdown editor'de toolbar yok
Yazar paneli `<textarea>` + canlı önizleme. Bold/italic/heading/link/görsel ekle butonları yok. Wysiwyg değil; markdown bilmeyen yazar zorlanır.

### 23. Karakter / kelime sayacı yok
Uzun yazılar için yazara geri bildirim yok. Aynısı özet için de geçerli (700 char limit ama görsel feedback yok).

### 24. `reading_minutes` elle giriliyor
Otomatik hesaplama yok. Yazar 3 dk yazıp 30 yazsa kimse fark etmez. Içerik uzunluğundan hesaplanmalı (ortalama 200 kelime/dk).

### 25. Tüm public sayfalar `force-dynamic`
Cache yok. Yazı sayısı arttıkça her istek Supabase'e gidiyor. ISR (`revalidate: 60`) ile 95% trafik cache'den dönebilir.

### 26. Yazar sayfası OG image olarak avatar kullanıyor
`createMetadata({ image: author.avatarImageUrl })` — Avatar genelde 80×80 küçük görsel. Sosyal paylaşımda boş/çirkin önizleme. Banner görsel veya köşe için ayrı OG image alanı eklenmeli.

### 27. Markdown render güvenlik kontrolü belirsiz
`MarkdownPreview` komponenti bu rapor sırasında okunmadı. Eğer raw HTML'i sanitize etmiyorsa XSS açığı olur. Yazar şifre ile giriyor olsa bile, kötü niyetli bir yazar markdown içine `<script>` koyabilir.

### 28. Sosyal paylaş butonları yok
Yazı detayında Twitter/X, WhatsApp, kopyala butonları yok.

### 29. Düzenleme geçmişi (revision log) yok
`updated_at` var ama eski içerik silinince geri dönüş yok. Yanlış güncelleme = veri kaybı.

### 30. Admin panelinde yazıyı doğrudan düzenleme yok
Admin yalnızca status değiştirebiliyor (draft↔published). İçeriği düzenlemesi gerekiyorsa yazarın paneline gitmeli — onun şifresine erişim yok.

### 31. Bulk işlemler yok
Admin panelinde yazıları toplu yayınlama/taslağa alma/silme yok.

### 32. Görsel yükleme retry/progress yok
Büyük görsel (5 MB sınırına yakın) yüklenirken progress bar yok, ağ koparsa direkt hata veriyor, retry yok.

---

## 🟢 Nice-to-have

### 33. Test yok
Modül için ne unit test var, ne E2E. Kritik akışlar (yazar girişi → yazı oluştur → yayınla) regresyon riskine açık.

### 34. Code-rain / parallax / animasyon zenginliği yok
Sayfa görsel olarak iyi (radial gradient hero), ama yazarın markası öne çıkmıyor.

### 35. Moderasyon kuyruğu yok
Yazar "yayınla" derse anında public. Editöryel kontrol noktası yok.

### 36. Çoklu dil desteği yok
Almanca/İngilizce versiyon olmadığı gibi altyapı da yok (`language` alanı vs.).

### 37. Yazı içerisinde TOC (içindekiler) otomatik üretilmiyor
Uzun yazılar için sticky table-of-contents yok.

### 38. Yazıya etiket olarak "tahmini okuma süresi/zorluk seviyesi" gibi badge'ler yok
Sadece "X dk okuma" var.

---

## Kritik 5 — Önce yapılması gerekenler

1. **Sıralama yönü** — `published_at: ascending: false` yap. (10 dakikalık iş, anlık UX kazancı)
2. **Sitemap'e köşe yazıları/yazarlar dinamik eklensin.** (SEO için kritik)
3. **`bio_content` yazar sayfasında render edilsin.** (Veri var, gösterim eksik)
4. **Yazar paneli için autosave** (localStorage'a periyodik draft) — uzun yazıların kaybolması ciddi UX katastrofu.
5. **Şifre auth modeli** sessionStorage → HttpOnly cookie. (Güvenlik)

Bu 5'i kapatınca modül "MVP+" seviyesinden "üretim sınıfı" seviyesine çıkar. Diğer maddeler içerik üretimi başlayıp gerçek geri bildirim geldikçe değerlendirilebilir.
