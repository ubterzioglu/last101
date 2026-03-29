# Rehber Backfill Agent Master Brief

## Amaç

Bu dosya [ta.md](/c:/.temp_private/.0000last/ta.md) ve [avukat.md](/c:/.temp_private/.0000last/avukat.md) içeriğinin birleştirilmiş, agent için daha güvenli ve daha modüler sürümüdür.

Ana hedef:

- doktor ve avukat rehberi kayıtlarındaki eksik iletişim bilgilerini backfill etmek
- agent'ın loop'a girmesini önlemek
- işi küçük, sınırları net run'lara bölmek

Bu dosya tek kaynak kabul edilsin. Eski iki brief referans olarak kalabilir ama uygulama planı için bu dosya kullanılmalı.

## Bu Repo'da Zaten Bildiğimiz Net Gerçekler

### Doktor tarafı

- [scripts/import-tuerkische-aerzte.mjs](/c:/.temp_private/.0000last/scripts/import-tuerkische-aerzte.mjs) mevcut
- bu script profil parse ediyor ama mevcut kayıtları skip ediyor
- [scripts/backfill-tuerkische-aerzte.mjs](/c:/.temp_private/.0000last/scripts/backfill-tuerkische-aerzte.mjs) mevcut
- bu backfill script'i şu modları destekliyor:
  - default dry-run
  - `--preview`
  - `--apply`
  - `--max-pages`
  - `--limit`
- doktor backfill script'i mevcut kayıtlarda özellikle şu alanları güncelliyor:
  - `phone`
  - `address`
  - `website`
  - `google_maps_url`
  - `notes_public`
- [scripts/verify-backfill.mjs](/c:/.temp_private/.0000last/scripts/verify-backfill.mjs) mevcut ve istatistik + örnek kontrol yapabiliyor

### Avukat tarafı

- [scripts/import-avukat24.mjs](/c:/.temp_private/.0000last/scripts/import-avukat24.mjs) mevcut
- bu script profil keşfi için doğrudan `https://avukat24.de/wp-json/wp/v2/avukat` endpoint'ini kullanıyor
- script profil HTML sayfasından şunları parse ediyor:
  - `display_name`
  - `city`
  - `address`
  - `phone`
  - `emailLinks`
  - `website`
  - `google_maps_url`
  - `languages`
  - `notes_public`
- kritik eksik:
  - `emailLinks` parse edilse bile dönüş nesnesinde ayrı `email` alanı yazılmıyor
- ikinci kritik eksik:
  - mevcut avukat kayıtları `display_name + city` ile skip ediliyor

### Şema ve UI tarafı

- [lib/rehber/types.ts](/c:/.temp_private/.0000last/lib/rehber/types.ts) içinde `Provider.email?: string` var
- [lib/rehber/data.ts](/c:/.temp_private/.0000last/lib/rehber/data.ts) içinde `row.email` normalize ediliyor
- `/hizmet-rehberi` UI tarafı `provider.email` alanını kullanıyor

Sonuç:

- avukat için `email` alanını DB'ye yazmak repo tarafında meşru ve beklenen bir davranış

## Agent'ı Loop'tan Koruyan Kurallar

Bu görevde agent aşağıdaki kurallara uymalı:

1. Aynı run'da sadece tek hedefle çalış.
   Hedef ya `doctor` ya da `lawyer` olabilir. İkisini aynı anda ele alma.

2. Aynı run'da sadece tek faz tamamla.
   Analiz yaptıysan kod yazma. Kod yazdıysan doğrulama raporunu aynı run'a sıkıştırma.

3. Mevcut script varken sıfırdan yeniden yazma.
   Önce mevcut parser veya backfill script'ini genişletmeyi düşün.

4. Aynı dosyayı üçten fazla tekrar okuma.
   Üç okumadan sonra hâlâ netlik yoksa blocker yaz ve dur.

5. Yeni belirsizlik üretme.
   Örneğin mevcut şema açıkça `email` destekliyorsa agent bunun için ayrı keşif loop'una girmesin.

6. `--apply` çalıştırma eşiğini yükselt.
   Açıkça istenmeden veya dry-run / preview görülmeden gerçek update yapma.

7. Ağır scrape'i analiz fazında yapma.
   Analiz için birkaç örnek ve kod incelemesi yeterliyse tüm dataset'i çekmeye çalışma.

8. Agresif fuzzy match yapma.
   Düşük güvenli eşleşmede update yerine `manual review` notu bırak.

9. İlerleme yoksa dur.
   Son iki adımda yeni bulgu veya yeni kod değişikliği yoksa agent sonucu raporlayıp durmalı.

10. Karar veremiyorsa seçenek üretip bırakma.
    Tek önerilen yolu seç, gerekçesini yaz, sonra orada dur.

## Run Başına Maksimum Kapsam

Bir run için güvenli üst sınır:

- en fazla 1 hedef alan
- en fazla 2 dosya edit'i
- en fazla 1 script çalıştırma türü
- en fazla 1 rapor çıktısı

Bu sınır aşılacaksa run bölünmeli.

## Fazlar

### Faz 1: Kod İncelemesi

Amaç:

- mevcut script gerçekten ne yapıyor, onu çıkarmak

Çıktı:

- parse edilen alanlar
- dedupe mantığı
- blocker listesi
- önerilen minimum değişiklik

Bu fazda yapılmayacaklar:

- kod yazma
- script çalıştırma
- DB update

### Faz 2: Dry-Run Tasarımı

Amaç:

- hangi alan hangi şartta güncellenecek, bunu netleştirmek

Çıktı:

- eşleşme kuralı
- field update kuralları
- dry-run beklenen rapor formatı

Bu fazda yapılmayacaklar:

- gerçek update
- büyük refactor

### Faz 3: Uygulama

Amaç:

- tek hedef için minimum kod değişikliği ile backfill akışını çalışır hale getirmek

Çıktı:

- değişen dosyalar
- script kullanım örneği
- dry-run örnek sonucu

Bu fazda yapılmayacaklar:

- doktor ve avukatı aynı patch'e koymak
- unrelated cleanup

### Faz 4: Doğrulama

Amaç:

- backfill gerçekten işe yaradı mı, bunu göstermek

Çıktı:

- önce/sonra metrikleri
- örnek kayıt kontrolü
- duplicate kontrolü
- açık riskler

Bu fazda yapılmayacaklar:

- yeni feature ekleme
- parser refactor

## Hedef 1: Doktor

### Veri Kaynağı

- `https://tuerkischeaerzte.de/aerzte/`

### Hedef Tablo

- `providers`
- filtre: `type='doctor'`

### Öncelikli Alanlar

- `address`
- `phone`

### İkincil Alanlar

- `website`
- `google_maps_url`
- `notes_public`

### Mevcut Kullanılabilir Araçlar

- [scripts/backfill-tuerkische-aerzte.mjs](/c:/.temp_private/.0000last/scripts/backfill-tuerkische-aerzte.mjs)
- [scripts/verify-backfill.mjs](/c:/.temp_private/.0000last/scripts/verify-backfill.mjs)

### Doktor İçin Ek Kural

- yeni insert ikinci planda olsun
- öncelik mevcut kayıtları zenginleştirmek

### Doktor İçin Güvenli Komut Sırası

1. `node scripts/backfill-tuerkische-aerzte.mjs --limit 10`
2. `node scripts/backfill-tuerkische-aerzte.mjs --preview --limit 10`
3. yalnızca istenirse `--apply`
4. ardından `node scripts/verify-backfill.mjs --sample 5`

## Hedef 2: Avukat

### Veri Kaynağı

- keşif: `https://avukat24.de/wp-json/wp/v2/avukat`
- detay: profil HTML sayfaları

### Hedef Tablo

- `providers`
- filtre: `type='lawyer'`

### Öncelikli Alanlar

- `address`
- `phone`
- `email`

### İkincil Alanlar

- `website`
- `google_maps_url`
- `notes_public`
- `languages`

### Mevcut Kullanılabilir Araçlar

- [scripts/import-avukat24.mjs](/c:/.temp_private/.0000last/scripts/import-avukat24.mjs)
- [scripts/backfill-tuerkische-aerzte.mjs](/c:/.temp_private/.0000last/scripts/backfill-tuerkische-aerzte.mjs)
- [scripts/verify-backfill.mjs](/c:/.temp_private/.0000last/scripts/verify-backfill.mjs)

Not:

- doktor backfill script'i avukat için birebir kullanılmayacak
- ama mod yapısı ve raporlama yaklaşımı template olarak kullanılabilir

### Avukat İçin Ek Kural

- `email` mutlaka ayrı DB alanına yazılmalı
- sadece `notes_public` içine gömülmesi yeterli sayılmamalı

### Avukat İçin Güvenli Komut Sırası

1. mevcut `import-avukat24.mjs` analiz et
2. küçük kapsamlı `dry-run` backfill script'i hazırla
3. limitli preview üret
4. ancak ondan sonra apply düşün

## Eşleştirme Kuralı

İlk tercih:

- `normalize(display_name) + normalize(city)`

İkincil sinyaller:

- profil URL
- normalize edilmiş isim

Güven düşükse:

- update yapma
- kaydı `manual review` olarak raporla

## Field Update Kuralı

Temel ilke:

- boş alanı doldur
- dolu alanı ancak yeni veri açıkça daha iyi ise güncelle

Örnek:

- `phone`: mevcut boşsa doldur
- `address`: mevcut boşsa doldur
- `email`: mevcut boşsa doldur
- `website`: boşsa doldur
- `google_maps_url`: boşsa doldur
- `notes_public`: yalnızca ek anlamlı bilgi taşıyorsa güncelle

## Başarı Kriteri

Bir hedef için iş başarılı sayılması için en az şu şartlar sağlanmalı:

- dry-run çıktısı okunabilir olmalı
- update edilecek kayıtlar net sayılmalı
- parse hataları listelenmeli
- duplicate üretimi kontrol edilmeli
- apply öncesi preview görülebilmeli

## Stop Conditions

Agent aşağıdaki durumlardan biri olursa durmalı:

- aynı bilgiye geri dönmeye başladıysa
- üçüncü kez aynı karar noktasına geldiyse
- schema / env / ağ erişimi yüzünden ilerleyemiyorsa
- sonraki adım ancak gerçek `apply` ile mümkünse
- yapılacak iş iki hedeften fazlasına yayılıyorsa

Durduğunda şu formatta rapor versin:

1. `Nerede durdu`
2. `Neden durdu`
3. `Sonraki en küçük güvenli adım`

## Her Run Sonunda Beklenen Çıktı

Agent her zaman şu şablonla dönsün:

1. `Hedef`
2. `Tamamlanan faz`
3. `Yapılan işler`
4. `Değişen dosyalar`
5. `Çalıştırılan komutlar`
6. `Riskler / açık noktalar`
7. `Sonraki tek önerilen adım`

## Agent'a Verilecek En Güvenli İlk Promptlar

### Doktor için

`Bu run'da sadece doctor hedefiyle çalış. BACKFILL_AGENT_MASTER.md dosyasındaki Faz 1'i uygula. scripts/import-tuerkische-aerzte.mjs ve scripts/backfill-tuerkische-aerzte.mjs dosyalarını incele. Kod yazma, script çalıştırma, apply yapma. Sadece mevcut parser alanları, dedupe/backfill mantığı, blocker listesi ve önerilen minimum değişikliği raporla.`

### Avukat için

`Bu run'da sadece lawyer hedefiyle çalış. BACKFILL_AGENT_MASTER.md dosyasındaki Faz 1'i uygula. scripts/import-avukat24.mjs dosyasını incele. Kod yazma, script çalıştırma, apply yapma. Sadece parse edilen alanları, email write-path eksikliğini, dedupe/backfill engelini ve önerilen minimum değişikliği raporla.`
