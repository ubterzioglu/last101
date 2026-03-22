# 🚨 ACİL GÜVENLİK UYARISI

## ⚠️ Kritik Durum: Anon Key Açıkta

`config.js` dosyası production sunucusunda hâlâ mevcut ve içinde **anon key açıkça görünüyor**.

### 🔴 Hemen Yapılması Gerekenler

#### 1. Sunucudan config.js Dosyasını Sil (ACİL)
```bash
# SSH ile sunucuya bağlan
ssh user@almanya101.de

# config.js dosyasını sil
cd /var/www/almanya101.de/devuser  # (dosya yeri sunucuya göre değişebilir)
rm config.js

# Veya FTP/SFTP ile sil
```

#### 2. Supabase Anon Key'i Revoke Et (ÇOK ACİL)

**Adımlar:**
1. Supabase Dashboard'a git: https://supabase.com/dashboard
2. Proje: `ldptefnpiudquipdsezr`
3. Sol menü: `Project Settings` → `API`
4. `anon key` bölümünde `Regenerate` butonuna tıkla
5. Yeni key oluşturulacak, eski key artık çalışmayacak

**Not:** Bu işlem sonrası:
- Eski `config.js` artık çalışmayacak ✅
- Edge Function'lar çalışmaya devam edecek (service role key kullanıyorlar) ✅

#### 3. RLS Politikalarını Kontrol Et

Migration çalıştırıldıktan sonra bu SQL'i çalıştır:

```sql
-- Anon kullanıcının doğrudan tablo erişimini engelle
SELECT * FROM pg_policies WHERE tablename = 'devuser';

-- Bu policy'ler olmalı:
-- block_anon_direct_read (USING false)
-- block_anon_insert (WITH CHECK false)
-- block_anon_update (USING false)
-- block_anon_delete (USING false)
```

#### 4. Test Et

```bash
# Eski anon key ile erişim denemesi (BAŞARISIZ olmalı)
curl 'https://ldptefnpiudquipdsezr.supabase.co/rest/v1/devuser?select=*' \
  -H 'apikey: ESKI_ANON_KEY'

# Sonuç: 403 Forbidden veya boş array olmalı
```

---

## 📋 Dosya Checklist

### Silinmesi Gereken Dosyalar (Sunucuda)
- [ ] `config.js` (kök dizinde)
- [ ] `config.js` (devuser/ dizininde)
- [ ] `config.js` (varsa başka dizinlerde)

### Yedeklenmesi Gereken Dosyalar
- [ ] Mevcut veritabanı (Supabase otomatik yedekliyor)

---

## 🔒 Güvenlik Önlemleri Durumu

| Önlem | Durum | Not |
|-------|-------|-----|
| Anon Key Revoke | ⏳ BEKLENİYOR | Abinin yapması gerekiyor |
| config.js silme | ⏳ BEKLENİYOR | Sunucudan silinmeli |
| RLS Policies | ✅ HAZIR | Migration'da tanımlı |
| Edge Functions | ✅ GÜNCELLENDİ | Rate limiting + validation eklendi |
| SQL Injection Koruması | ✅ EKLENDİ | Input sanitization eklendi |

---

## 🆘 Sorun Olursa

### Anon Key Revoke Edilirse Ne Olur?
- ✅ Edge Function'lar çalışmaya devam eder (service role key kullanıyor)
- ✅ Yeni kayıtlar alınmaya devam eder
- ✅ Üye listesi görüntülenmeye devam eder
- ❌ Eski `config.js` artık çalışmaz (iyi bir şey!)

### Geri Alma Gerekirse
Supabase Dashboard'dan yeni anon key alınıp `config.js` yeniden oluşturulabilir, ama **ÖNERİLMİYOR**.

---

## 📞 İletişim

Sorular için: [almanya101.de/contact](https://almanya101.de/contact)
