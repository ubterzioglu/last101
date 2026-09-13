# AI İçin Güvenli Backfill Runbook

## Amaç

Bu dosya, backfill işlerini AI agent ile yürütürken loop'a girmeyi, aynı anda fazla yük binmesini ve gereksiz tekrarları engellemek için hazırlanmıştır.

Bu runbook hem doktor hem avukat backfill akışı için kullanılabilir.

Hazırlanma tarihi:

- `2026-03-29`

## Şu Anda Bildiğimiz Kritik Gerçekler

1. Doktor tarafında çalışan bir backfill script zaten var:
   [scripts/backfill-tuerkische-aerzte.mjs](/c:/.temp_private/.0000last/scripts/backfill-tuerkische-aerzte.mjs)

2. Avukat tarafında backfill script mevcut:
   [scripts/backfill-avukat24.mjs](/c:/.temp_private/.0000last/scripts/backfill-avukat24.mjs)

3. Canlı `providers` tablosunda `email` kolonu şu anda yok.
   Bu, `2026-03-29` tarihinde [scripts/generate-provider-report.mjs](/c:/.temp_private/.0000last/scripts/generate-provider-report.mjs) çalıştırılarak doğrulandı.

4. Bu yüzden agent'ın şu hataya takılıp loop'a girmemesi gerekir:
   - "`providers.email` var mı yok mu?"

5. Agent aynı run'da hem scrape, hem refactor, hem apply, hem rapor yapmaya çalıştığında bozuluyor.

## Ana Prensip

Bir run = tek hedef + tek faz + tek karar.

Yani agent aynı anda:

- hem `doctor` hem `lawyer`
- hem analiz hem uygulama
- hem dry-run hem apply

yapmamalı.

## Kesin Çalışma Kuralları

1. Tek hedef seç.
   - ya `doctor`
   - ya `lawyer`

2. Tek faz seç.
   - `inceleme`
   - `dry-run`
   - `uygulama`
   - `doğrulama`

3. Aynı run'da en fazla 2 dosya değiştir.

4. Aynı run'da en fazla 1 script çalıştırma türü kullan.
   Örnek:
   - sadece `dry-run`
   - sadece `preview`
   - sadece `verify`

5. `--apply` ancak şu 3 koşuldan sonra çalıştırılsın:
   - kod incelendi
   - dry-run temiz geldi
   - preview çıktısı okundu

6. Ağ yükünü küçük tut.
   - ilk deneme: `--limit 5`
   - ikinci deneme: `--limit 10`
   - sonra gerekirse `--limit 20`

7. Paralel fetch yapma.
   Profil fetch işlemleri tek tek veya çok küçük seri batch mantığıyla ilerlesin.

8. Üst üste iki adımda yeni bilgi çıkmadıysa dur.

9. Aynı hata iki kez tekrar ettiyse dur ve blocker yaz.

10. Yeni şema keşfi açma.
    Repo veya canlı DB açıkça bir şey söylüyorsa agent bunu tekrar tekrar sorgulamasın.

## Neden Agent Loop'a Giriyor

En yaygın nedenler:

1. Aynı anda iki kaynağı çözmeye çalışıyor.
   - hem `tuerkischeaerzte`
   - hem `avukat24`

2. Aynı anda hem parser hem DB hem rapor katmanını çözmeye çalışıyor.

3. Limit koymadan büyük scrape başlatıyor.

4. Aynı dosyayı tekrar tekrar okuyup yeni karar üretemiyor.

5. `email` gibi şema uyumsuzluklarında "önce migration mı yazayım, script mi düzelteyim, verify mı yapayım" döngüsüne giriyor.

## Faz Modeli

### Faz 1: İnceleme

Amaç:

- mevcut script ne yapıyor, ne yapmıyor

Bu fazda yapılacaklar:

- hedef script'i oku
- hangi alanlar parse ediliyor yaz
- hangi alanlar update ediliyor yaz
- hangi dedupe mantığı var yaz
- blocker listesini çıkar

Bu fazda yapılmayacaklar:

- kod değişikliği
- network fetch
- apply

Çıktı formatı:

1. `Hedef`
2. `İncelenen dosyalar`
3. `Parse edilen alanlar`
4. `Update edilen alanlar`
5. `Blocker listesi`
6. `Sonraki tek önerilen adım`

### Faz 2: Dry-Run Tasarımı

Amaç:

- güvenli güncelleme kurallarını sabitlemek

Bu fazda yapılacaklar:

- eşleşme kuralını yaz
- hangi alan hangi şartta güncellenir yaz
- küçük `limit` ile dry-run komutunu belirle

Bu fazda yapılmayacaklar:

- apply
- geniş refactor

Çıktı formatı:

1. `Eşleşme kuralı`
2. `Field update kuralları`
3. `Kullanılacak komut`
4. `Beklenen dry-run çıktısı`

### Faz 3: Uygulama

Amaç:

- minimum patch ile backfill mantığını çalışır hale getirmek

Bu fazda yapılacaklar:

- en fazla 2 dosyada edit
- mümkünse mevcut script'i genişlet
- sıfırdan büyük sistem yazma

Bu fazda yapılmayacaklar:

- ek feature
- unrelated cleanup

Çıktı formatı:

1. `Değişen dosyalar`
2. `Yapılan minimum değişiklik`
3. `Çalıştırılacak dry-run komutu`

### Faz 4: Doğrulama

Amaç:

- yapılan backfill gerçekten işe yarıyor mu

Bu fazda yapılacaklar:

- verify script çalıştır
- önce/sonra sayıları yaz
- örnek kayıtları göster

Bu fazda yapılmayacaklar:

- yeni patch
- yeni scrape mantığı

Çıktı formatı:

1. `Çalıştırılan komut`
2. `Önce/sonra farkı`
3. `Açık riskler`
4. `Sonraki tek önerilen adım`

## Yükü Azaltan Teknik Kurallar

### 1. Küçük Limit Politikası

İlk denemeler daima küçük başlamalı:

1. `--limit 5`
2. `--limit 10`
3. `--limit 20`
4. daha sonra gerekirse büyüt

Doğrudan tüm dataset ile başlama.

### 2. Tek Kaynak Politikası

Doktor için sadece:

- `https://tuerkischeaerzte.de/aerzte/`

Avukat için sadece:

- keşif: `https://avukat24.de/wp-json/wp/v2/avukat`
- detay: profil HTML

Aynı run'da ek kaynak keşfi açma.

### 3. Tek Komut Politikası

Bir run'da aşağıdakilerden yalnızca biri çalıştırılsın:

- dry-run
- preview
- verify
- report

Hepsini art arda aynı run'a doldurma.

### 4. Tek Kayıt Tipi Politikası

Bir run'da sadece biri:

- `type='doctor'`
- `type='lawyer'`

## Doktor İçin Güvenli Sıra

### Adım 1

Kod incele:

- [scripts/import-tuerkische-aerzte.mjs](/c:/.temp_private/.0000last/scripts/import-tuerkische-aerzte.mjs)
- [scripts/backfill-tuerkische-aerzte.mjs](/c:/.temp_private/.0000last/scripts/backfill-tuerkische-aerzte.mjs)

### Adım 2

Küçük dry-run:

```bash
node scripts/backfill-tuerkische-aerzte.mjs --limit 5
```

### Adım 3

Preview:

```bash
node scripts/backfill-tuerkische-aerzte.mjs --preview --limit 5
```

### Adım 4

Gerekirse limit yükselt:

```bash
node scripts/backfill-tuerkische-aerzte.mjs --preview --limit 10
```

### Adım 5

Ancak onaylıysa apply:

```bash
node scripts/backfill-tuerkische-aerzte.mjs --apply --limit 10
```

### Adım 6

Doğrulama:

```bash
node scripts/verify-backfill.mjs --sample 5
```

## Avukat İçin Güvenli Sıra

### Adım 1

Kod incele:

- [scripts/import-avukat24.mjs](/c:/.temp_private/.0000last/scripts/import-avukat24.mjs)
- [scripts/backfill-avukat24.mjs](/c:/.temp_private/.0000last/scripts/backfill-avukat24.mjs)

### Adım 2

Şema notunu sabitle:

- canlı `providers.email` kolonu yok
- bu yüzden agent email backfill hedefini "ayrı kolon yazımı" yerine
  - mevcut şemaya uyumlu davranış
  - veya ayrı migration kararı
  olarak bölmeli

Bu karar aynı run'da verilmezse agent loop'a girer.

### Adım 3

Küçük dry-run:

```bash
node scripts/backfill-avukat24.mjs --limit 5
```

### Adım 4

Preview:

```bash
node scripts/backfill-avukat24.mjs --preview --limit 5
```

### Adım 5

Gerekirse limit yükselt:

```bash
node scripts/backfill-avukat24.mjs --preview --limit 10
```

### Adım 6

Ancak onaylıysa apply:

```bash
node scripts/backfill-avukat24.mjs --apply --limit 10
```

### Adım 7

Doğrulama:

```bash
node scripts/verify-lawyers.mjs --sample 5
```

## Zorunlu Stop Conditions

Agent aşağıdaki durumlardan biri olursa durmalı:

1. Aynı hata iki kez tekrar ettiyse
2. Aynı dosyayı üçüncü kez okuyorsa
3. Son iki adımda yeni bilgi çıkmadıysa
4. Sonraki adım `--apply` ise ama preview henüz görülmediyse
5. Sonraki adım migration gerektiriyorsa ama görev sadece backfill ise
6. Aynı anda hem doktor hem avukat tarafına kaydıysa

Durduğunda şu formatta dönmeli:

1. `Nerede durdu`
2. `Neden durdu`
3. `Çözüme en yakın sonraki küçük adım`

## Agent'a Verilecek En Güvenli Prompt Şablonu

```text
Bu run'da sadece tek hedefle çalış: [doctor veya lawyer].
Sadece tek faz uygula: [inceleme / dry-run / uygulama / doğrulama].
Maksimum 2 dosya değiştir.
Maksimum --limit 5 ile başla.
Apply çalıştırma.
Aynı hata iki kez olursa dur.
Sonuçta şu formatta dön:
1. Hedef
2. Tamamlanan faz
3. Yapılan işler
4. Değişen dosyalar
5. Çalıştırılan komutlar
6. Riskler
7. Sonraki tek önerilen adım
```

## Bu Dosyanın Amacı

Bu runbook'un amacı AI'ı daha akıllı yapmak değil, daha dar çalıştırmaktır.

Yani hedef:

- daha çok iş yüklemek değil
- daha küçük, daha kararlı adımlar tanımlamak

Çünkü bu problemde zaman değil, aynı anda fazla yük binmesi asıl sorun gibi görünüyor.
