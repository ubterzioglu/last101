# 2026-03-13 Meeting Attendance ve Admin Panel Fixleri

## Özet

Bu çalışma, `devuser/survey.html`, toplantı katılım API'leri, Supabase migration akışı ve `ubt.html` admin paneli etrafındaki canlı sorunları çözmek için yapıldı.

## Çözülen Sorunlar

### 1. `meeting_attendance` tablo hatası

- Hata: `Could not find the table 'public.meeting_attendance' in the schema cache`
- Kök neden: Kod deploy edilmişti ancak ilgili Supabase migration'ı production veritabanında uygulanmamıştı.
- Çözüm:
  - `supabase/migrations/20260313003000_reconcile_meeting_attendance.sql` eklendi.
  - Migration production'a `supabase db push` ile uygulandı.
  - Tablo, index ve view'lar idempotent şekilde güvence altına alındı.

### 2. Toplantı verisinin istemci tarafında okunması

- Sorun: `ubt.html` doğrudan client-side Supabase anon key ile `meeting_attendance` okuyordu.
- Risk: Yönetici verisi istemci tarafında açığa çıkabilirdi.
- Çözüm:
  - `api/meeting-attendance-admin-list.js` eklendi.
  - `ubt.html` toplantı verisini artık bu admin-auth korumalı endpoint üzerinden alıyor.
  - `meeting_attendance_public_read` politikası kaldırıldı.

### 3. Form submit sonrası `reset()` hatası

- Hata: `Cannot read properties of null (reading 'reset')`
- Kök neden: `await` sonrası `event.currentTarget` güvenilmez hale geliyordu.
- Çözüm:
  - Form referansı submit başında `const form = event.currentTarget;` ile sabitlendi.
  - `event.currentTarget.reset()` yerine `form.reset()` kullanıldı.

### 4. `ubt.html` admin gate kırılması

- Sorun: Bazı badge ve meeting çağrıları login tamamlanmadan da tetiklenebiliyordu.
- Çözüm:
  - `ubt.html` içinde `adminGateUnlocked` guard'ı eklendi.
  - Meeting yükleme ve badge yenileme akışları login sonrası çalışacak şekilde sınırlandı.

### 5. ContentSquare kaynaklı sandbox uyarısı

- Hata örneği: `Blocked script execution in 'about:blank' because the document's frame is sandboxed...`
- Kök neden: Varsayılan ContentSquare script URL'si otomatik inject ediliyordu.
- Çözüm:
  - `app/_lib/tracking.ts` içinde ContentSquare varsayılanı kaldırıldı.
  - Script artık sadece `CONTENTSQUARE_SCRIPT_URL` veya `NEXT_PUBLIC_CONTENTSQUARE_SCRIPT_URL` açıkça verilirse yükleniyor.

### 6. Yanlış admin panel URL'si

- Sorun: Bazı akışlarda `https://www.almanya101.de/devuser/ubt.html` kullanılıyordu.
- Gerçek sayfa: `https://www.almanya101.de/ubt.html`
- Çözüm:
  - `devuser/ubt.html` eklendi.
  - Bu dosya `/ubt.html` adresine geriye dönük uyumluluk yönlendirmesi yapıyor.

## Deploy Adımları

1. Supabase projesi linklendi.
2. `supabase db push` çalıştırıldı.
3. Vercel projesi `almanya101` ile linklendi.
4. Production deploy yapıldı.
5. Canlı smoke testler uygulandı.

## Operasyonel Notlar

- Admin panelin ana adresi: `/ubt.html`
- Eski uyumluluk adresi: `/devuser/ubt.html`
- Meeting admin verisi sadece backend API üzerinden okunmalı.
- ContentSquare sadece bilinçli olarak env ile açılmalı.
- Supabase migration workflow secret'ları:
  - `SUPABASE_ACCESS_TOKEN`
  - `SUPABASE_PROJECT_ID`
  - `SUPABASE_DB_PASSWORD`

## İlgili Dosyalar

- `api/meeting-attendance-admin-list.js`
- `api/meeting-attendance-submit.js`
- `app/_lib/tracking.ts`
- `devuser/survey.html`
- `devuser/ubt.html`
- `ubt.html`
- `.github/workflows/supabase-deploy.yml`
- `supabase/migrations/20260313003000_reconcile_meeting_attendance.sql`
