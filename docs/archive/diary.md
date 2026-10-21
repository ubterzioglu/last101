# Diary

## 2026-03-27

### Hizmet öner akışı
- `provider_submissions` tablosunu kullanan yeni public submit endpoint'i eklendi: `app/api/provider-submissions/route.ts`
- Kullanıcıların hizmet önerebildiği yeni sayfa eklendi: `app/(site)/hizmet-rehberi/oneri/page.tsx`
- Form UI ve gönderim akışı eklendi: `app/(site)/hizmet-rehberi/oneri/HizmetOnerClient.tsx`
- Öneri formu artık server-side API üzerinden çalışıyor, eski statik `public/rehber-old/ue.*` yaklaşımına bağlı değil

### Hizmet rehberi admin paneli
- Hizmet önerilerini listeleyen admin endpoint'i eklendi: `app/api/provider-submissions-admin-list/route.ts`
- Önerileri onaylama, reddetme, beklemeye alma ve silme endpoint'i eklendi: `app/api/provider-submissions-admin-action/route.ts`
- Yeni admin panel sayfası eklendi: `app/admin/hizmet-rehberi/page.tsx`
- Admin UI bileşeni eklendi: `components/admin/ProviderSubmissionsAdminClient.tsx`
- Admin panelden onaylanan öneriler doğrudan `providers` tablosuna `active` kayıt olarak ekleniyor
- Ana admin index'e yeni modül kartı eklendi: `app/admin/page.tsx`

### Hizmet ara UX iyileştirmeleri
- `app/(site)/hizmet-rehberi/page.tsx` yeniden düzenlendi
- Hero alanı daha net CTA'larla sadeleştirildi
- `Hizmet Öner` ve `Hizmet Ara` çağrıları belirginleştirildi
- Filtre paneli daha okunur hale getirildi ve desktop'ta sticky davranışa taşındı
- Aktif filtre özeti eklendi
- Sonuç alanı daha net başlık, sayı ve hızlı kategori geçişleriyle güçlendirildi
- Provider kartları daha okunur ve aksiyon odaklı hale getirildi
- Boş sonuç durumuna filtre temizleme ve öneri bırakma yönlendirmesi eklendi

### Veri ve içerik importları
- `avukat24.de` kaynağından avukat import script'i eklendi: `scripts/import-avukat24.mjs`
- Avukat import komutları `package.json` içine eklendi
- `providers` tablosuna `177` adet `type='lawyer'` kayıt yazıldı
- Daha önce `tuerkischeaerzte.de` kaynağından doktor import akışı kurulmuş ve çalıştırılmıştı

### Doğrulama
- `npm run lint` temiz geçti
- `npm run build` temiz geçti
