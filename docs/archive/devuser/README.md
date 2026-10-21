# DevUser - Developer Topluluğu

Almanya'daki Türk developer, QA, DevOps ve tech profesyonelleri için topluluk platformu.

## Dosyalar

- **du.html** - Kayıt formu (25 soru)
- **list.html** - Üye arama ve filtreleme sayfası
- **config.js** - Supabase yapılandırması

## Veritabanı

Migration dosyası: `/supabase/migrations/20260211000000_create_devuser_table.sql`

### Tablo: `devuser`

Tablo aşağıdaki bilgileri içerir:
- Kimlik ve iletişim (ad, LinkedIn, WhatsApp, şehir)
- Profil ve teknik arka plan (rol, deneyim, güçlü alanlar)
- Teknoloji bilgisi (diller, framework'ler, DevOps araçları)
- İlgi alanları ve yönelim
- İş durumu ve fırsatlar
- İş birliği ve topluluk amacı
- Görünürlük ve iletişim izinleri

### RLS Politikaları

- **Public read**: Sadece `aratilabilir = true` olan profiller görünür
- **Public insert**: Herkes kayıt olabilir
- **Public update**: Herkes güncelleyebilir (gelecekte auth ile sınırlanabilir)

## Özellikler

### Kayıt Formu (du.html)
- 25 soruluk kapsamlı form
- Çoklu seçim ve tekli seçim soruları
- Koşullu alanlar (örn: proje linki)
- Minimum efor ile doldurulabilir
- Responsive tasarım

### Arama Sayfası (list.html)
- Filtreleme: şehir, rol, deneyim, iş arama durumu, teknoloji, ilgi alanı
- Kart bazlı görünüm
- LinkedIn ve WhatsApp iletişim butonları
- Badge'ler: iş arama durumu, freelance açıklık, mentorluk
- Responsive grid layout

## Kurulum

### 1. Migration'ı Çalıştır

```bash
# Supabase CLI ile
supabase db push

# Veya migration dosyasını manuel olarak Supabase Dashboard'dan çalıştır
```

### 2. Dosyaları Deploy Et

Dosyalar `/devuser/` dizininde bulunur ve doğrudan erişilebilir:
- https://almanya101.de/devuser/du.html
- https://almanya101.de/devuser/list.html

### 3. Config Kontrolü

`config.js` dosyasında Supabase URL ve anon key'in doğru olduğundan emin olun.

## Kullanım

### Kayıt Olmak
1. `/devuser/du.html` adresine git
2. Formu doldur (zorunlu alanlar: ad soyad, Almanya'da yaşama durumu, rol, deneyim)
3. "Kayıt Ol" butonuna tıkla
4. Başarılı mesajından sonra listeye yönlendir

### Üyeleri Aramak
1. `/devuser/list.html` adresine git
2. Filtreleri kullanarak arama yap
3. Üye kartlarında LinkedIn/WhatsApp ile iletişime geç

## Güvenlik

- Supabase RLS aktif
- Anon key frontend'de güvenli
- Sadece izin verilen profiller görünür
- WhatsApp iletişimi için açık izin gerekli

## Geliştirme Notları

### Gelecek İyileştirmeler
- [ ] Kullanıcı authentication (profil düzenleme için)
- [ ] E-posta doğrulama
- [ ] Profil fotoğrafı yükleme
- [ ] Mesajlaşma sistemi
- [ ] Bildirim sistemi
- [ ] Admin paneli
- [ ] Analytics ve raporlama

### Teknik İyileştirmeler
- [ ] Form validasyonu geliştirme
- [ ] Loading state'leri iyileştirme
- [ ] Error handling geliştirme
- [ ] Pagination ekleme (çok sayıda üye için)
- [ ] Advanced search (full-text search)
- [ ] Export functionality (CSV, PDF)

## Destek

Sorular için: https://almanya101.de/contact

