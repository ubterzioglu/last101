# DevUser - Agent Dokümantasyonu

## Proje Özeti

**DevUser**, Almanya'da yaşayan Türk developer, QA, DevOps ve tech profesyonelleri için bir topluluk platformudur. Üyeler networking, iş birliği, mentorluk ve freelance fırsatları için bir araya gelir.

- **Domain**: https://almanya101.de/devuser/
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Supabase (PostgreSQL + Row Level Security)
- **API**: Supabase Edge Functions (Deno/TypeScript)
- **Deployment**: Statik hosting (almanya101.de)

---

## Proje Yapısı

```
/devuser/
├── du.html              # Kayıt formu (~1078 satır, 30 adımlı wizard)
├── list.html          # Üye arama ve listeleme sayfası (~340 satır)
├── devuser.css               # Kayıt formu stilleri (~421 satır)
├── devuserlist.css           # Arama sayfası stilleri (~373 satır)
├── *.backup                  # Yedek dosyalar (versiyon kontrolünde tutulmamalı)
│
supabase/
├── functions/
│   ├── get-users/
│   │   └── index.ts          # Güvenli kullanıcı listesi API'si
│   └── register-user/
│       └── index.ts          # Güvenli kayıt API'si
└── migrations/
    └── 20260211_security_hardening.sql  # Güvenlik sertleştirme migration'ı

plans/
├── project-analysis.md       # Detaylı proje analizi
└── security-fix-plan.md      # Güvenlik düzeltme planı

README.md                     # Genel dokümantasyon (Türkçe)
KURULUM.md                    # Kurulum talimatları (Türkçe)
SECURITY_UPDATE_README.md     # Güvenlik güncellemesi dökümanı
AGENTS.md                     # Bu dosya
```

---

## Teknoloji Stack

| Katman | Teknoloji | Açıklama |
|--------|-----------|----------|
| Frontend | Vanilla HTML/CSS/JS | Framework kullanılmıyor, vanilla JS ile DOM manipülasyonu |
| Backend | Supabase PostgreSQL | Veritabanı ve RLS politikaları |
| API | Supabase Edge Functions | Deno/TypeScript ile yazılmış serverless fonksiyonlar |
| Hosting | Statik | HTML dosyaları doğrudan sunuluyor |
| CDN | jsdelivr.net | Supabase JS client CDN üzerinden yükleniyor |

---

## Mimari

```
┌─────────────────┐     ┌──────────────────────┐     ┌─────────────────┐
│  du.html   │────▶│  register-user       │────▶│  devuser        │
│  (Kayıt Formu)  │     │  (Edge Function)     │     │  (PostgreSQL)   │
└─────────────────┘     └──────────────────────┘     └─────────────────┘
                                                         │
┌─────────────────┐     ┌──────────────────────┐         │
│ list.html│◀────│  get-users           │◀────────┤
│ (Arama Sayfası) │     │  (Edge Function)     │         │
└─────────────────┘     └──────────────────────┘         │
                                                         │
                                                  ┌──────┴──────┐
                                                  │devuser_public│
                                                  │   (View)    │
                                                  └─────────────┘
```

**Güvenlik Katmanları:**
1. **Origin kontrolü**: Edge Functions sadece almanya101.de'den gelen istekleri kabul eder
2. **Rate limiting**: 30 istek/dakika sınırı
3. **RLS politikaları**: Anon kullanıcılar doğrudan tabloya erişemez
4. **Secure view**: Hassas alanlar filtrelenir (WhatsApp numarası sadece izin verenlerde görünür)
5. **Input validation**: Tüm girdiler sanitize edilir ve doğrulanır

---

## Veritabanı Şeması

**Tablo**: `devuser`

| Alan | Tip | Açıklama |
|------|-----|----------|
| id | UUID | Birincil anahtar |
| ad_soyad | TEXT | Ad soyad (zorunlu) |
| linkedin_url | TEXT | LinkedIn profil URL'si |
| whatsapp_tel | TEXT | WhatsApp telefon numarası |
| yasam_yeri | TEXT | Yaşanılan yer (Almanya/Türkiye/Diğer) |
| sehir | TEXT | Şehir (zorunlu) |
| rol | TEXT | Meslek rolü (zorunlu) |
| deneyim_seviye | TEXT | Deneyim seviyesi (zorunlu) |
| aktif_kod | BOOLEAN | Aktif olarak kod yazıyor mu |
| guclu_alanlar | TEXT[] | Güçlü alanlar (array) |
| programlama_dilleri | TEXT[] | Programlama dilleri (array) |
| framework_platformlar | TEXT[] | Framework'ler (array) |
| devops_cloud | TEXT[] | DevOps/Cloud araçları (array) |
| ilgi_konular | TEXT[] | İlgi konuları (array) |
| is_arama_durumu | TEXT | İş arama durumu (zorunlu) |
| freelance_aciklik | TEXT | Freelance açıklığı (zorunlu) |
| katilma_amaci | TEXT | Topluluğa katılma amacı (zorunlu) |
| aratilabilir | BOOLEAN | Profil aratılabilir mi (zorunlu) |
| iletisim_izni | BOOLEAN | WhatsApp iletişim izni (zorunlu) |
| veri_paylasim_onay | BOOLEAN | Veri paylaşım onayı (zorunlu) |
| created_at | TIMESTAMPTZ | Oluşturulma tarihi |

**View**: `devuser_public`
- Sadece `aratilabilir = true` olan kayıtları gösterir
- WhatsApp numarasını sadece `iletisim_izni = true` olanlarda gösterir
- Hassas alanları filtreler

---

## Edge Functions

### 1. get-users

**Amaç**: Üye listesini güvenli şekilde getirme

**Endpoint**: `GET /functions/v1/get-users`

**Query Parameters**:
- `sehir` - Şehir filtresi (partial match)
- `rol` - Rol filtresi (exact match)
- `deneyim` - Deneyim seviyesi filtresi
- `is_arama` - İş arama durumu filtresi
- `tech` - Teknoloji araması (programlama dilleri, framework, devops)
- `ilgi` - İlgi alanı araması
- `page` - Sayfa numarası (default: 1)
- `limit` - Sayfa başına sonuç (default: 50, max: 100)

**Güvenlik özellikleri**:
- Origin kontrolü
- Rate limiting (30 req/min)
- Sadece güvenli alanları seçer
- WhatsApp numarasını izne göre filtreler

### 2. register-user

**Amaç**: Yeni üye kaydı

**Endpoint**: `POST /functions/v1/register-user`

**Body**: Tüm form alanları (JSON)

**Güvenlik özellikleri**:
- Origin kontrolü
- Input validation (tüm zorunlu alanlar kontrol edilir)
- Input sanitization (max length, trim)
- URL format doğrulama (LinkedIn, proje linki)
- Telefon format doğrulama
- Duplicate kontrolü (LinkedIn URL, WhatsApp, son 24 saatte aynı isim)

---

## Kod Organizasyonu

### Frontend (HTML/JS)

**du.html**:
- 30 adımlık wizard form
- Her adım `data-step` attribute'ü ile işaretlenmiş
- JavaScript form doğrulama ve navigasyonu yönetir
- Edge Function'a POST isteği gönderir

**list.html**:
- Filtreleme UI'sı
- Kart bazlı liste görünümü
- Edge Function'a GET isteği gönderir
- LinkedIn ve WhatsApp butonları (izne göre)

### Backend (Edge Functions)

**get-users/index.ts**:
- CORS headers yapılandırması
- Rate limiting (in-memory Map)
- Origin kontrolü
- Supabase service role ile sorgu
- Filtre mantığı
- Response formatlama

**register-user/index.ts**:
- CORS headers yapılandırması
- Input validation fonksiyonları
- Sanitization fonksiyonları
- Duplicate check
- Veri dönüşümleri (boolean, array)

---

## Geliştirme ve Deployment

### Gereksinimler

- Supabase CLI (Edge Functions deploy için)
- Supabase project access (service role key gerekli)

### Deployment Adımları

**1. SQL Migration'ı Çalıştır:**
```bash
supabase db push
# veya Supabase Dashboard > SQL Editor'den manuel çalıştır
```

**2. Edge Function'ları Deploy Et:**
```bash
supabase login
supabase link --project-ref ldptefnpiudquipdsezr
supabase functions deploy get-users
supabase functions deploy register-user
```

**3. Frontend'i Deploy Et:**
```bash
# HTML/CSS dosyalarını statik hosting'e yükle
# Vercel/Netlify/GitHub Pages vb.
```

### Ortam Değişkenleri

Edge Functions şu ortam değişkenlerini kullanır:
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (RLS bypass için)

---

## Güvenlik Hususları

**Kritik güvenlik önlemleri** (uygulanmış):

1. ✅ **Anon key frontend'de yok** - Artık config.js dosyası yok, API key'ler açıkta değil
2. ✅ **Direct table access kapalı** - RLS politikaları anon kullanıcıların doğrudan tabloya erişimini engeller
3. ✅ **Secure view** - Hassas alanlar filtrelenir
4. ✅ **Input validation** - Tüm girdiler doğrulanır ve sanitize edilir
5. ✅ **Rate limiting** - API abuse engellenir
6. ✅ **Origin kontrolü** - Sadece almanya101.de erişebilir
7. ✅ **Duplicate check** - Spam kayıtlar engellenir

**Bilinen sınırlamalar**:
- Rate limiting in-memory (sunucu restart olursa sıfırlanır)
- Origin kontrolü localhost'a açık (development için)
- Pagination frontend'de henüz uygulanmadı

---

## Test Talimatları

### Manuel Test Senaryoları

**Kayıt Formu:**
1. Tüm alanları doldur ve kaydet
2. Aynı LinkedIn URL ile tekrar kaydolmaya çalış (hata almalı)
3. Geçersiz URL formatı gir (hata almalı)
4. Zorunlu alanları boş bırak (hata almalı)

**Arama Sayfası:**
1. Üyelerin yüklendiğini kontrol et
2. Filtreleri test et
3. WhatsApp butonunun sadece izin verenlerde göründüğünü kontrol et

**Güvenlik Testleri:**
```bash
# Anon key ile doğrudan erişim denemesi (başarısız olmalı)
curl 'https://ldptefnpiudquipdsezr.supabase.co/rest/v1/devuser?select=*' \
  -H 'apikey: <anon_key>'

# Edge Function'a erişim (başarılı olmalı)
curl https://ldptefnpiudquipdsezr.supabase.co/functions/v1/get-users

# Rate limiting testi (429 almalı)
for i in {1..35}; do
  curl https://ldptefnpiudquipdsezr.supabase.co/functions/v1/get-users
done
```

---

## Kod Stil Rehberi

### JavaScript
- ES6+ syntax kullanılır (arrow functions, const/let, async/await)
- Vanilla JS, framework kullanılmaz
- DOM manipülasyonu doğrudan yapılır
- Error handling try/catch ile yapılır

### TypeScript (Edge Functions)
- Strict mode etkin
- Explicit type annotation'lar
- Deno standart kütüphaneleri kullanılır
- Supabase client tip güvenli kullanılır

### CSS
- Mobile-first responsive tasarım
- CSS custom properties kullanılmaz (hardcoded değerler)
- BEM benzeri naming convention (`.card`, `.btn-primary`)
- Her sayfa için ayrı CSS dosyası

### SQL
- Migration dosyaları tarih prefix'i ile isimlendirilir
- RLS politikaları açıkça belgelenir
- Index'ler performans için eklenir

---

## Hata Ayıklama

### Yaygın Sorunlar

**Edge Function çalışmıyor:**
- Supabase Dashboard > Edge Functions > Logs kontrol et
- Service role key'in doğru ayarlandığından emin ol
- CORS origin'lerinin doğru yapılandırıldığını kontrol et

**Migration hatası:**
- SQL syntax hatası olabilir
- RLS politikaları çakışıyor olabilir
- Önce mevcut politikaları kaldır (`DROP POLICY IF EXISTS`)

**Frontend'den API çağrısı çalışmıyor:**
- Browser console'da CORS hatası olabilir
- Edge Function URL'sinin doğru olduğundan emin ol
- Network tab'inde istek/response'u kontrol et

---

## Gelecek İyileştirmeler

**Yüksek öncelikli:**
- [ ] Kullanıcı authentication (profil düzenleme için)
- [ ] Pagination frontend'de uygulama
- [ ] Admin paneli

**Orta öncelikli:**
- [ ] Form validasyonu geliştirme
- [ ] Loading state'leri iyileştirme
- [ ] Error handling geliştirme

**Düşük öncelikli:**
- [ ] Profil fotoğrafı yükleme
- [ ] Mesajlaşma sistemi
- [ ] Bildirim sistemi
- [ ] Analytics ve raporlama

---

## Kaynaklar

- [Supabase Dokümantasyonu](https://supabase.com/docs)
- [Deno Runtime](https://deno.land/)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)

---

## İletişim

Sorular için: https://almanya101.de/contact

