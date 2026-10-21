# Supabase Entegrasyon Yapılacaklar Listesi

## DevUser Sistemi

### Edge Functions Deploy
- [ ] `supabase/functions/get-users/index.ts` - Üye listesi API
- [ ] `supabase/functions/register-user/index.ts` - Kayıt API

### SQL Migration
- [ ] `supabase/migrations/20260211_security_hardening.sql` çalıştır
- [ ] `devuser` tablosu oluştur
- [ ] RLS politikaları aktif et
- [ ] `devuser_public` view oluştur

### Environment Variables
- [ ] `SUPABASE_URL` ayarla
- [ ] `SUPABASE_SERVICE_ROLE_KEY` ayarla
- [ ] CORS origin'leri yapılandır

### Test
- [ ] Kayıt formu test et
- [ ] Üye listesi test et
- [ ] Rate limiting kontrol et
- [ ] Duplicate kontrolü test et

## Diğer Supabase İhtiyaçları

### Ana Sayfa
- [ ] Dinamik içerik (haberler, duyurular)
- [ ] Kullanıcı kayıt/giriş sistemi (gelecekte)

### Topluluk Sayfası
- [ ] Forum/etkinlik verileri

### İş İlanları
- [ ] İlan listesi
- [ ] Başvuru sistemi

### Rehber (Türk Hizmet)
- [ ] Uzman/doktor/avukat listesi
- [ ] Filtreleme (şehir, uzmanlık)
- [ ] Yeni kayıt ekleme formu

### Haberler
- [ ] Haber listesi
- [ ] Kategori filtresi
- [ ] Admin paneli

### Yazı Dizisi
- [ ] Makale listesi
- [ ] Kategori/sıralama

## Taşınan Eski Sayfalar (Supabase Bağlantılı)

Bu sayfalar `public/` klasöründe statik olarak var ama Supabase bağlantısı için güncellenmeli:

- [ ] `public/rehber-old/ua.html` - Türk Doktor & Avukat Rehberi
- [ ] `public/rehber-old/ue.html` - Uzman Ekle
- [ ] `public/article-old/article.html` - Yazı Dizisi
- [ ] `public/haberler-old/haberler.html` - Haberler
- [ ] `public/haberler-old/haberdetay.html` - Haber Detay

## Deploy Komutları

```bash
# Supabase CLI ile login
supabase login

# Project link
supabase link --project-ref ldptefnpiudquipdsezr

# Edge Functions deploy
supabase functions deploy get-users
supabase functions deploy register-user

# Migration çalıştır
supabase db push
```

## Notlar
- Edge Functions sadece almanya101.de'den gelen istekleri kabul eder (origin kontrolü)
- Rate limiting: 30 istek/dakika
- Anon key frontend'de yok, service role key ile çalışır
- Eski HTML dosyaları `public/*-old/` klasörlerinde yedeklendi
