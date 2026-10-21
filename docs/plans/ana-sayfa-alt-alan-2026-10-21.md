# Ana Sayfa Alt Alanı ve Tarih Düzenlemesi

## Amaç

Ortak footer'ı tüm sayfalardan kaldırmak, ana sayfanın altında yalnızca site içi bağlantılardan oluşan okunaklı bir sütun düzeni sunmak ve ana sayfanın yayın ile güncelleme tarihlerini eşitlemek.

## Uygulama

1. `app/layout.tsx` içindeki ortak `Footer` kullanımını ve artık kullanılmayacak import'u kaldır. `components/layout/Footer.tsx` içindeki slogan, dış bağlantılar ve 8 piksel yazı düzeni yeni alana taşınmayacak. Bileşen artık kullanılmıyorsa silinecek.
2. `app/page.tsx` sonunda, tarih satırının yakınında site içi bağlantılar için semantik bir `<nav>` oluştur. Bağlantıları **Kurumsal** (Hakkımızda, Blog, İletişim, Kariyer) ve **Yasal Bilgiler** (Gizlilik Politikası, Kullanım Şartları, KVKK / GDPR / CCPA, Çerez Politikası, Impressum) başlıkları altında göster. Mobilde tek, geniş ekranda iki sütun kullan. Bağlantılar `next/link` ile gerçek sayfa yollarına gitsin; okunaklı yazı boyutu, yeterli kontrast ve belirgin klavye odağı olsun.
3. Ana sayfadaki görünür tarihi **Yayın tarihi: Ocak 2026 · Son güncelleme: Ekim 2026** olarak değiştir. `<time>` değerlerini sırasıyla `2026-01-01` ve `2026-10-21` yap; tarih satırının yazısını büyüt. Aynı sayfadaki `WebPageJsonLd` için `datePublished` ve `dateModified` değerlerini de bunlarla eşitle.
4. Çalışma ağacındaki mevcut, bu işle ilgisiz değişiklikleri koru.

## Doğrulama

- Ana sayfada dokuz iç bağlantının doğru adreslere gittiğini ve mobil ile masaüstünde sütun düzeninin okunaklı olduğunu kontrol et.
- Ortak footer'ın ve listedeki dış bağlantıların sayfalarda görünmediğini doğrula.
- Görünür tarihlerle yapılandırılmış veri tarihlerinin aynı olduğunu doğrula.
- `tests/footer.test.ts` içindeki eski footer beklentilerini yeni davranışa göre güncelle; ilgili birim testlerini, `npm run lint` ve `npm run build` komutlarını çalıştır.

## Kabul Edilen Yorum

“Footer komple kalkacak” ifadesi, ortak footer'ın tüm sayfalardan kaldırılması; site içi alt bağlantıların ise yalnızca ana sayfada yeni sütunlu alan olarak sunulması anlamına gelir. Güncelleme tarihi, planın hazırlandığı **21 Ekim 2026** günüdür.
