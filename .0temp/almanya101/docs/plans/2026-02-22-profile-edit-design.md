# Profil Düzenleme Sistemi Tasarım Dokümanı

**Tarih**: 2026-02-22
**Durum**: Onaylandı
**Yaklaşım**: Basit Form Düzenleme

## Özet

Kullanıcıların devuser topluluğunda kendi profillerini düzenleyebilecekleri bir sistem oluşturulacak. Sistem, kullanıcıların e-posta/şifre ile giriş yaptıktan sonra list.html'den erişebileceği bir profil düzenleme sayfası ve bunu destekleyen API endpoint'i içerir.

## Gereksinimler

### Kullanıcı Gereksinimleri
- Kullanıcılar kendi profillerindeki **tüm alanları** düzenleyebilmeli
- Profil düzenleme arayüzüne **list.html'deki buton** ile erişebilmeli
- Güncelleme sırasında **katı validasyon** uygulanmalı
- Güncelleme başarılı/başarısız olduğunda kullanıcıya **geri bildirim** verilmeli

### Teknik Gereksinimler
- Supabase authentication ile entegre çalışmalı
- RLS policies ile güvenli güncelleme sağlamalı
- Mobile responsive tasarım olmalı
- Mevcut CSS (devuserlist.css) yeniden kullanılmalı

## UI/UX Tasarımı

### list.html Değişiklikleri

**Buton Ekleme:**
```html
<!-- account-card içinde, logoutBtn'un yanına -->
<button type="button" class="btn btn-secondary" id="editProfileBtn">Profil Düzenle</button>
```

**JavaScript Ekleme:**
```javascript
const editProfileBtn = document.getElementById('editProfileBtn');
editProfileBtn.addEventListener('click', () => {
  window.location.href = 'profile-edit.html';
});
```

### profile-edit.html Yapısı

**Sayfa Bölümleri:**

1. **Hero Card**
   - Başlık: "Profil Düzenle"
   - Alt başlık: "Bilgilerinizi güncelleyin"

2. **Form Bölümleri** (her biri ayrı card):

   a. **Kişisel Bilgiler**
   - ad_soyad (text, required)
   - sehir (text)
   - linkedin_url (url)
   - whatsapp_tel (tel)
   - almanya_yasam (checkbox)

   b. **Profil Bilgileri**
   - rol (select: Software Developer, QA/Test, DevOps, vb.)
   - deneyim_seviye (select: 0-1 yıl, 1-3 yıl, 3-5 yıl, 5-10 yıl, 10+ yıl)
   - guclu_alanlar (checkbox group: Backend, Frontend, Mobile, vb.)
   - aktif_kod (checkbox)
   - acik_kaynak (checkbox)
   - kendi_proje (checkbox)
   - proje_link (url)

   c. **Teknoloji Stack**
   - programlama_dilleri (checkbox group: JavaScript, TypeScript, Python, vb.)
   - framework_platformlar (checkbox group: React, Angular, Vue, Node.js, vb.)
   - devops_cloud (checkbox group: Docker, Kubernetes, AWS, vb.)

   d. **İlgi Alanları**
   - ilgi_konular (checkbox group: AI araçları, Startup, Freelance, vb.)
   - ogrenmek_istenen (checkbox group: Backend, Frontend, Mobile, vb.)

   e. **İş Durumu**
   - is_arama_durumu (select: Hayır, Evet pasif, Evet aktif, Sadece freelance)
   - freelance_aciklik (select: Hayır, Evet hafta içi, Evet hafta sonu, vb.)
   - gonullu_proje (checkbox)

   f. **İş Birliği**
   - katilma_amaci (select: Networking, İş bulmak, İş arkadaşı bulmak, vb.)
   - isbirligi_turu (checkbox group: Side project, Startup, MVP, vb.)
   - profesyonel_destek_verebilir (checkbox)
   - profesyonel_destek_almak (checkbox)

   g. **Görünürlük**
   - aratilabilir (checkbox)
   - iletisim_izni (checkbox)

3. **Aksiyon Bölümü**
   - "Kaydet" butonu (btn-primary)
   - "İptal" butonu (btn-secondary → list.html)

**Styling:**
- devuserlist.css'i kullan
- Form alanları için input-group wrapper'lar
- Checkbox grupları için flex-wrap container
- Error mesajları için .error-message class
- Loading state için .loading class

## API Tasarımı

### Endpoint: /api/devuser-update.js

**Method:** PATCH

**Authentication:**
- Supabase JWT token gerekli (Authorization header)
- Token'dan user_id alınır

**Request Body:**
```json
{
  "ad_soyad": "John Doe",
  "sehir": "Berlin",
  "linkedin_url": "https://linkedin.com/in/...",
  "whatsapp_tel": "+49123456789",
  "almanya_yasam": true,
  "rol": "Software Developer",
  "deneyim_seviye": "3-5 yıl",
  "guclu_alanlar": ["Backend", "Frontend"],
  "programlama_dilleri": ["JavaScript", "Python"],
  "framework_platformlar": ["React", "Node.js"],
  "devops_cloud": ["Docker", "GitHub Actions"],
  "ilgi_konular": ["AI araçları", "Startup"],
  "ogrenmek_istenen": ["Backend"],
  "is_arama_durumu": "Evet aktif",
  "freelance_aciklik": "Hayır",
  "gonullu_proje": false,
  "katilma_amaci": "Networking",
  "isbirligi_turu": ["Side project"],
  "profesyonel_destek_verebilir": true,
  "profesyonel_destek_almak": false,
  "aratilabilir": true,
  "iletisim_izni": true,
  "aktif_kod": false,
  "acik_kaynak": false,
  "kendi_proje": false,
  "proje_link": ""
}
```

**Response:**
- Başarılı (200): `{ success: true, data: { güncellenmiş_profil } }`
- Validation Hatası (400): `{ error: "Hata mesajı", field_errors: { alan: "hata" } }`
- Unauthorized (401): `{ error: "Unauthorized" }`
- Forbidden (403): `{ error: "Bu profili düzenleme izniniz yok" }`
- Not Found (404): `{ error: "Profil bulunamadı" }`
- Server Error (500): `{ error: "Internal server error" }`

**Validasyon Kuralları:**
- `ad_soyad`: required, min 2 karakter, max 200 karakter
- `sehir`: optional, max 100 karakter
- `linkedin_url`: optional, valid URL
- `whatsapp_tel`: optional, 8-15 digits
- `rol`: optional, enum değerlerinden biri
- `deneyim_seviye`: optional, enum değerlerinden biri
- `guclu_alanlar`: optional, array of strings
- `programlama_dilleri`: optional, array of strings
- `framework_platformlar`: optional, array of strings
- `devops_cloud`: optional, array of strings
- `ilgi_konular`: optional, array of strings
- `ogrenmek_istenen`: optional, array of strings
- `is_arama_durumu`: optional, enum değerlerinden biri
- `freelance_aciklik`: optional, enum değerlerinden biri
- `katilma_amaci`: optional, enum değerlerinden biri
- `isbirligi_turu`: optional, array of strings
- Boolean alanlar: true veya false

**Güvenlik:**
- CORS: Sadece izinli origin'lerden istek kabul et
- Authentication: Supabase JWT token doğrulama
- Authorization: Sadece kendi profilini güncelleyebilir (user_id kontrolü)
- Input sanitization: Supabase otomatik SQL injection koruması sağlar

**CORS Yapılandırması:**
```javascript
const ALLOWED_ORIGINS = new Set([
  'https://almanya101.de',
  'https://www.almanya101.de',
  'http://localhost:3000',
  'http://localhost:5173',
]);
```

## JavaScript Akışı

### profile-edit.html

**Sayfa Yükleme:**
1. Supabase client'ı başlat
2. Mevcut session'ı al
3. `/api/devuser-me`'den profil verilerini çek
4. Form alanlarını mevcut değerlerle doldur (populateForm)
5. Loading state'i kaldır

**Form Doldurma (populateForm):**
- Text input'lar için value atama
- Select'ler için selected index belirleme
- Checkbox grupları için value array'i kontrol edip işaretleme
- Boş array için hiçbir checkbox seçili değil

**Form Validasyonu (Client-side):**
- Required alanları kontrol et
- Email/URL formatı kontrolü (eğer varsa)
- Boolean alanların doğru tipte olmasını kontrol et
- Array alanların array tipinde olmasını kontrol et

**Kaydetme İşlemi:**
1. Form verilerini topla (serializeForm)
2. Client-side validasyon yap
3. Hata varsa göster ve güncellemeyi durdur
4. Loading state'i göster ("Güncelleniyor...")
5. `/api/devuser-update`'e PATCH isteği gönder
6. Başarılı ise: Başarı mesajı, 1.5s bekle, list.html'e yönlendir
7. Hata ise: Hata mesajı göster, field_errors varsa ilgili alanları vurgula

**İptal İşlemi:**
- Doğrudan list.html'e yönlendir

## Error Handling

### API Hataları

**401 Unauthorized:**
- Oturum süresi dolmuş
- Kullanıcıya: "Oturum süresi doldu. Lütfen tekrar giriş yapın."
- Action: list.html'e yönlendir

**403 Forbidden:**
- Kullanıcı bu profili düzenleme iznine sahip değil
- Kullanıcıya: "Bu profili düzenleme izniniz yok."

**400 Validation Error:**
- Validation hatası
- Kullanıcıya: field_errors içindeki alanlar için hata mesajları
- Action: Hatalı alanları formda vurgula

**404 Not Found:**
- Profil bulunamadı
- Kullanıcıya: "Profil bulunamadı. Lütfen önce kayıt formunu doldurun."
- Action: Kayıt sayfasına yönlendir

**500 Internal Server Error:**
- Sunucu hatası
- Kullanıcıya: "Bir hata oluştu, lütfen tekrar deneyin."

### Client-side Error Handling

**Network Error:**
- Kullanıcıya: "Bağlantı hatası. İnternet bağlantınızı kontrol edin."

**Timeout Error:**
- Kullanıcıya: "İstek zaman aşımına uğradı. Lütfen tekrar deneyin."

**Invalid JSON Response:**
- Kullanıcıya: "Sunucu hatası. Lütfen tekrar deneyin."

## Güvenlik

### RLS Policies

Mevcut policy zaten authenticated kullanıcıların update yapmasına izin veriyor:
```sql
CREATE POLICY "Users can update own profile"
  ON public.devuser
  FOR UPDATE
  USING (true)
  WITH CHECK (true);
```

API'de ek olarak `user_id` kontrolü yaparak sadece kendi profilini güncellediğinden emin olacağız.

### Input Validation

- Client-side: Her alan için type ve format kontrolü
- Server-side: Her alan için strict validation
- SQL Injection: Supabase prepared statements kullanır

### CORS

Sadece izinli origin'lerden istek kabul edilecek:
- https://almanya101.de
- https://www.almanya101.de
- http://localhost:3000
- http://localhost:5173

## Mobile Responsiveness

**Breakpoints:**
- 640px: Mobile (vertical stack, full-width butonlar)
- 768px: Tablet
- 1024px: Desktop

**Mobile Optimizasyonları:**
- Form alanları vertical stack
- Checkbox grupları flex-wrap ile wrap
- Kaydet/İptal butonları full-width
- Daha fazla padding ve spacing
- Font boyutları okunabilir

## Dosya Yapısı

Yeni dosyalar:
```
profile-edit.html          # Profil düzenleme sayfası
api/devuser-update.js      # Profil güncelleme API endpoint
```

Değiştirilecek dosyalar:
```
list.html                 # "Profil Düzenle" butonu ekle
```

Yeniden kullanılacak dosyalar:
```
devuserlist.css           # Styling
supabase-config.js        # Supabase configuration
api/_supabase-user.js     # User authentication helper
api/devuser-me.js         # Profil verisi okuma (GET)
```

## Veri Akışı

```
Kullanıcı
  |
  v
list.html (Giriş yapıldı)
  |
  v
"Profil Düzenle" butonu
  |
  v
profile-edit.html
  |
  v
GET /api/devuser-me (Supabase JWT token ile)
  |
  v
Form popülasyon
  |
  v
Kullanıcı düzenler
  |
  v
"Kaydet" butonu
  |
  v
Client-side validasyon
  |
  v
PATCH /api/devuser-update
  |
  v
Server-side validasyon
  |
  v
Supabase UPDATE devuser SET ...
  |
  v
{ success: true, data: ... }
  |
  v
Başarı mesajı + list.html'e yönlendir
```

## Test Senaryoları

1. **Başarılı Güncelleme:**
   - Formu doldur, tüm alanları güncelle, kaydet
   - Sonuç: Başarılı, list.html'e yönlendir, profil güncellenmiş

2. **Validation Hatası:**
   - Ad soyad boş, diğer alanlar dolu, kaydet
   - Sonuç: Hata mesajı, form güncellenmez

3. **Yetkisiz Erişim:**
   - Oturum olmadan profile-edit.html'e git
   - Sonuç: list.html'e yönlendir, giriş ekranı göster

4. **Başka Profil Düzenleme:**
   - API'ye başka bir user_id ile PATCH isteği gönder
   - Sonuç: 403 Forbidden

5. **Network Error:**
   - İnternet kesikken kaydet
   - Sonuç: Hata mesajı

6. **Mobile Test:**
   - Mobil cihazda test et
   - Sonuç: Tüm alanlar erişilebilir, butonlar çalışıyor

## Başarı Kriterleri

- [ ] Kullanıcı list.html'den profil düzenleme sayfasına erişebilmeli
- [ ] Mevcut profil verileri formda gösterilmeli
- [ ] Tüm devuser alanları düzenlenebilmeli
- [ ] Validasyon hatası olduğunda kullanıcıya bildirim verilmeli
- [ ] Başarılı güncelleme sonrası list.html'e yönlendirilmeli
- [ ] Yetkisiz erişim engellenmeli
- [ ] Mobile responsive tasarım çalışmalı
- [ ] Güvenlik kuralları uygulanmalı

## Sonraki Adımlar

1. Tasarım onaylandı ✓
2. Implementation planı oluştur (writing-plans skill)
3. Kod implementasyonu
4. Test
5. Git commit ve push
