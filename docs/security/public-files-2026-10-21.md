# Yayımlanmış dosyalar: 21 Ekim 2026 güvenlik kaydı

Bu kayıt kimlik bilgisi, kullanıcı adresi veya eski dosya içeriği içermez.

## Saptanan durum

- `public/devuser/devuser-sifre-listesi.txt` Git'te takip ediliyordu. `public/` altındaki dosyalar doğrudan sunulduğundan içeriği erişilebilir kabul edilmelidir.
- `.env.example` Git'te takip ediliyordu. Eski `DIRECT_CONNECTION_STRING` örneği bağlantı adresi biçimindeydi, ancak proje ve parola alanları açıkça yer tutucuydu; bu değer için yenileme gerekmiyor.

## Bu düzenlemede yapılanlar

- Parola listesi çalışma ağacından ve Git takibinden kaldırıldı. Eski commit'lerdeki kopyalar bu değişiklikle silinmez.
- `.env.example` yalnızca boş veya herkese açık örnek değerler içerecek biçimde düzenlendi.
- Eski DevUser geliştirme belgeleri yayımlanan `public/` dizininden arşive taşındı.

## Açık not

Listedeki dokuz adres canlı Supabase Auth kullanıcısıyla eşleşiyor. Bu doküman düzenlemesinde hesap parolaları veya oturumlar değiştirilmedi ve e-posta gönderilmedi. Hesap müdahalesi ayrı bir operasyon olarak ele alınmalıdır.

Yeni sürüm yayımlandıktan sonra eski statik dosya yolunun erişilemediği doğrulanmalıdır. Git geçmişi bu düzenlemeyle yeniden yazılmadı; eski kopyalar orada kalabilir.
