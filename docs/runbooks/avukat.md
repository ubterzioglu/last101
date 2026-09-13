# Avukat24 Backfill Brief

> Güncel ve birleşik sürüm: [BACKFILL_AGENT_MASTER.md](/c:/.temp_private/.0000last/BACKFILL_AGENT_MASTER.md)

## Amaç

`https://avukat24.de/` kaynağındaki avukat profillerinden `providers` tablosundaki `type='lawyer'` kayıtlarını iletişim bilgileri açısından zenginleştirmek.

Bu görevde öncelik yeni kayıt açmak değil, mevcut kayıtlardaki eksik alanları tamamlamaktır.

Birincil alanlar:

- `address`
- `phone`
- `email`

İkincil alanlar:

- `website`
- `google_maps_url`
- `notes_public`
- `languages`

## Kısa Problem Tanımı

Projede zaten [scripts/import-avukat24.mjs](/c:/.temp_private/.0000last/scripts/import-avukat24.mjs) var. Bu script profil detaylarını parse ediyor ama mevcut kayıtları `display_name + city` ile skip ettiği için backfill yapmıyor.

Ayrıca kritik bir eksik var:

- `email` parse edilse bile DB payload'ına ayrı kolon olarak her zaman yazılmıyor

Asıl ihtiyaç:

- `insert-only` akışı değil
- `update/backfill` odaklı akış

## Veri Kaynağı Notu

Kullanıcı örnek arama URL'si verdi:

- `https://avukat24.de/avukat-arama-sonuclari/?start_adresse=44139+Dortmund%2C+Germany&radius=50`

Ama profil keşfi için daha güvenli kaynak:

- `https://avukat24.de/wp-json/wp/v2/avukat`

Önerilen yaklaşım:

- profil keşfi için WordPress JSON endpoint'i kullan
- detay alanlar için profil HTML sayfasını ayrı fetch et

## İlgili Dosyalar

- [scripts/import-avukat24.mjs](/c:/.temp_private/.0000last/scripts/import-avukat24.mjs)
- [scripts/backfill-tuerkische-aerzte.mjs](/c:/.temp_private/.0000last/scripts/backfill-tuerkische-aerzte.mjs)
- [scripts/verify-backfill.mjs](/c:/.temp_private/.0000last/scripts/verify-backfill.mjs)
- [lib/rehber/types.ts](/c:/.temp_private/.0000last/lib/rehber/types.ts)
- [lib/rehber/data.ts](/c:/.temp_private/.0000last/lib/rehber/data.ts)

## Hedef Tablo

Tablo:

- `providers`

Filtre:

- `type = 'lawyer'`

İlgili kolonlar:

- `display_name`
- `city`
- `address`
- `phone`
- `email`
- `website`
- `google_maps_url`
- `notes_public`
- `status`

## Agent İçin Çalışma Kuralı

Bu brief tek seferde komple uygulanmak için değil. Agent her run'da yalnızca bir fazı tamamlamalı ve o fazın çıktısını vermeli.

Bir faz tamamlanmadan bir sonrakine geçilmemeli.

## Fazlar

### Faz 1: İnceleme ve Haritalama

Bu fazda yapılacaklar:

- [scripts/import-avukat24.mjs](/c:/.temp_private/.0000last/scripts/import-avukat24.mjs) dosyasını oku
- şu alanların gerçekten parse edilip edilmediğini doğrula:
  - `display_name`
  - `city`
  - `address`
  - `phone`
  - `email`
  - `website`
  - `google_maps_url`
  - `languages`
  - `notes_public`
- mevcut dedupe mantığını çıkar
- `email` parse edilip payload'a yazılmayan kısmı net olarak tespit et
- neden backfill yapılamadığını 5-10 maddelik net bir özetle yaz

Bu fazın çıktısı:

- `mevcut parser alanları`
- `mevcut dedupe davranışı`
- `email write-path eksikliği`
- `backfill blocker listesi`
- `önerilen yaklaşım: mevcut scripti genişlet / ayrı backfill scripti yaz`

Bu fazda yapılmayacaklar:

- kod yazma
- script çalıştırma
- DB update

### Faz 2: Dry-Run Tasarımı

Bu fazda yapılacaklar:

- mevcut parser mantığını yeniden kullanacak en güvenli yaklaşımı seç
- profil keşfi kaynağını netleştir:
  - `wp-json/wp/v2/avukat`
- dry-run modunda hangi kayıtların eşleşeceğini tarif et
- update edilecek alan kurallarını netleştir

Önerilen update kuralları:

- `address` sadece mevcut alan boşsa veya yeni veri daha belirginse güncellensin
- `phone` sadece mevcut alan boşsa veya yeni veri daha normalize ise güncellensin
- `email` sadece mevcut alan boşsa veya yeni veri daha güvenilir ise güncellensin
- `website` boşsa doldurulsun
- `google_maps_url` boşsa doldurulsun
- `notes_public` sadece ek bilgi katıyorsa güncellensin

Bu fazın çıktısı:

- `eşleştirme kuralları`
- `field update kuralları`
- `dry-run output şeması`
- `riskler`

Bu fazda yapılmayacaklar:

- gerçek update
- toplu insert

### Faz 3: Uygulama

Bu fazda yapılacaklar:

- mevcut parser mantığını kullan
- tercihen ayrı bir backfill script yaz
- script en az şu modları desteklesin:
  - `dry-run`
  - `apply`
- `email` alanının gerçekten DB payload'ına yazıldığını doğrula
- eşleşme anahtarı ilk etapta:
  - `normalize(display_name) + normalize(city)`

Bu fazın çıktısı:

- değişen dosya listesi
- script kullanım örneği
- dry-run örnek raporu

Bu fazda yapılmayacaklar:

- agresif fuzzy matching
- dolu alanları kalitesiz veriyle ezme

### Faz 4: Doğrulama

Bu fazda yapılacaklar:

- `type='lawyer'` kayıtlarında önce/sonra karşılaştırması yap
- özellikle şu metrikleri raporla:
  - `phone IS NOT NULL` artışı
  - `address IS NOT NULL` artışı
  - `email IS NOT NULL` artışı
  - güncellenen kayıt sayısı
  - yeni eklenen kayıt sayısı
  - parse edilemeyen profil sayısı
- rastgele örnek kayıtları kaynak profil ile karşılaştır

Bu fazın çıktısı:

- kısa doğrulama raporu
- açık kalan riskler

## Çıktı Sözleşmesi

Agent her run sonunda şu formatta dönsün:

1. `Tamamlanan faz`
2. `Yapılan işler`
3. `Değişen dosyalar`
4. `Riskler / açık noktalar`
5. `Sonraki faz için net öneri`

## Eşleştirme Kuralları

İlk tercih:

- `normalize(display_name) + normalize(city)`

Yardımcı sinyaller:

- profil URL
- normalize edilmiş isim

Ama düşük güvenli eşleşmede update yapılmamalı.

## Başarı Kriteri

Görev başarılı sayılması için en az şu koşullar sağlanmalı:

- mevcut avukat kayıtlarında eksik `address` alanlarının anlamlı kısmı dolmalı
- mevcut avukat kayıtlarında eksik `phone` alanlarının anlamlı kısmı dolmalı
- mevcut avukat kayıtlarında eksik `email` alanlarının anlamlı kısmı dolmalı
- duplicate üretimi kontrol altında kalmalı
- script dry-run ve apply modlarıyla çalışmalı

## İstenmeyen Davranışlar

- dolu `phone` alanını daha kötü veriyle ezmek
- dolu `address` alanını daha kısa veriyle ezmek
- `email` parse edilmesine rağmen DB'ye yazmamak
- mevcut kayıtları tamamen skip edip backfill'i fiilen yapmamak
- sadece `notes_public` güncelleyip asıl temas alanlarını boş bırakmak
- aynı run içinde hem parser refactor, hem backfill mantığı, hem doğrulama raporunu tek devasa değişiklikte toplamak

## Agent'a Verilecek En Güvenli İlk Görev

İlk run için yalnızca şu görev verilsin:

`Faz 1'i tamamla. scripts/import-avukat24.mjs dosyasını incele, parse edilen alanları, email write-path eksikliğini ve backfill'i engelleyen mevcut dedupe davranışını çıkar. Kod yazma, sadece analiz ve kısa uygulanabilir öneri ver.`
