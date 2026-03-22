# almanya101 — TR ↔ DE Para Transferi Seçim Aracı (v2)

Bu paket, mevcut 20 soruluk karar motoruna **gerçek dünya sağlayıcıları (30+)** ekler.

## Ne değişti?
- Sonuç kartlarında artık sadece "profil" değil, o profile uygun **gerçek sistemler / bankalar** listelenir.
- "Sonucu kopyala" metni, her öneri için sistem listesini de içerir.
- Sağlayıcı listesi `providers.js` dosyasında tutulur.

## Dosyalar
- `paratransfer.html` → `providers.js` + `script.js` include edildi
- `providers.js` → profil → sağlayıcı listeleri
- `script.js` → sonuç render + copy text güncellendi
- `styles.css` → sağlayıcı pill UI eklendi

## Not
Bu araç yönlendirme amaçlıdır. Ücret/kur/limit ve KYC koşulları sağlayıcıya göre değişir; karar öncesi sağlayıcıların güncel hesaplayıcısında toplam maliyeti kontrol edin.
