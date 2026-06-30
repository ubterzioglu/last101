'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAdminGate } from '@/hooks/useAdminGate';

/**
 * In-app operator guide for the WHOLE admin panel.
 *
 * This is a read-only documentation page rendered inside the admin shell so an
 * operator can learn every section — what it does, which buttons exist, and how
 * the data flows — without leaving the dashboard. Each guide card links directly
 * to the matching admin screen so the reader can jump from a description to the
 * live tool. Content mirrors the actual admin sections (Software Hub, Haber
 * Yönetimi, Hizmet Rehberi, Recruitment Agencies, Service Finder, Kırık Link
 * Bildirimleri) and their real actions.
 */

interface GuideEntry {
  /** Stable anchor + filter key. */
  key: string;
  /** Card heading. */
  title: string;
  /** Short one-line summary shown in the index and under the title. */
  summary: string;
  /** Left-border accent color class. */
  accent: string;
  /** Eyebrow color class. */
  eyebrow: string;
  /** Primary admin route this guide documents. */
  href?: string;
  /** Label for the primary link button. */
  hrefLabel?: string;
  /** Rich body. */
  body: React.ReactNode;
}

const GUIDES: GuideEntry[] = [
  {
    key: 'genel',
    title: 'Genel Bakış ve Giriş',
    summary: 'Tek şifreyle giriş, sol menü, rozetler ve oturum davranışı.',
    accent: 'border-google-blue',
    eyebrow: 'text-google-blue',
    href: '/admin',
    hrefLabel: 'Ana Panele Git',
    body: (
      <>
        <p className="mt-3 text-sm leading-7 text-white/72">
          Admin paneline <strong className="text-white">tek bir şifreyle</strong> giriş yaparsın. Oturum açıldıktan
          sonra alt sayfalar tekrar şifre sormaz; sol menüden istediğin bölüme geçebilirsin. Çıkış yapana kadar oturum
          tarayıcı sekmesinde saklı kalır.
        </p>
        <ul className="mt-4 space-y-2 text-sm leading-7 text-white/75">
          <Bullet><strong className="text-white">Sol menü (sidebar)</strong>: Tüm bölümler burada listelenir; aktif bölüm vurgulanır.</Bullet>
          <Bullet><strong className="text-white">Rozetler</strong>: Bekleyen iş olan bölümlerin yanında kırmızı sayaç görünür (ör. bekleyen hizmet önerisi, kırık link).</Bullet>
          <Bullet><strong className="text-white">Ana sayfa kartları</strong>: Giriş ekranında bekleyen işler özetlenir; karta tıklayınca ilgili bölüme gidersin.</Bullet>
          <Bullet><strong className="text-white">Çıkış Yap</strong>: Sol menünün altındaki buton oturumu kapatır ve seni giriş ekranına döndürür.</Bullet>
        </ul>
        <Tip>
          Bir bölümde işlem yaptıktan sonra rozet sayıları otomatik güncellenir. Sayfayı yenilemene gerek yoktur.
        </Tip>
      </>
    ),
  },
  {
    key: 'uyeler',
    title: 'Üyeler — Yeni Kayıtlar & Profiller',
    summary: 'Araçlara giriş yapan tüm Supabase üyeleri ve devuser profilleri.',
    accent: 'border-google-blue',
    eyebrow: 'text-google-blue',
    href: '/admin/uyeler',
    hrefLabel: 'Üyeler Bölümüne Git',
    body: (
      <>
        <p className="mt-3 text-sm leading-7 text-white/72">
          Araçların tamamı artık <strong className="text-white">üyelik (giriş) zorunlu</strong> çalışıyor. Bu bölüm,{' '}
          <strong className="text-white">yeni üye olan herkesi</strong> tek listede gösterir. İki sekmeye ayrılır:
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Mini title="👥 Üyeler (Auth)">
            Araçlara erişmek için <strong className="text-white">Supabase hesabı</strong> oluşturan herkes (e-posta veya
            Google ile). Her satırda e-posta, kayıt tarihi, son giriş, sağlayıcı, e-posta doğrulama durumu ve devuser
            profili olup olmadığı görünür.
          </Mini>
          <Mini title="🧑‍💻 DevUser Profili">
            Developer topluluğuna katılmak için <strong className="text-white">detaylı profil</strong> oluşturanlar.
            Ad-soyad, şehir, rol, kayıt tarihi ve <strong className="text-white">onay durumu</strong> (Bekliyor / Onaylı /
            Reddedildi) ile listelenir.
          </Mini>
        </div>
        <ul className="mt-4 space-y-2 text-sm leading-7 text-white/75">
          <Bullet><strong className="text-white">İstatistik kartları</strong>: Toplam üye, devuser profili, onay bekleyen devuser ve profilsiz üye sayısı.</Bullet>
          <Bullet><strong className="text-white">Arama</strong>: E-posta, isim, şehir veya role göre anlık filtreleme.</Bullet>
          <Bullet><strong className="text-white">Yenile</strong>: Listeyi en güncel haliyle yeniden çeker. En yeni kayıt her zaman en üstte.</Bullet>
          <Bullet><strong className="text-white">Toplam Üye</strong> sayısı ana panel ekranındaki kartta da görünür.</Bullet>
        </ul>
        <Tip>
          “Üyeler” sekmesindeki bir kişide <strong className="text-white">DevUser ✓ Var</strong> görmüyorsan, o kişi araca
          giriş yapmış ama henüz developer profili oluşturmamış demektir. DevUser onaylarını{' '}
          <Link href="/admin/software-hub" className="font-semibold text-google-blue hover:underline">Software Hub → Yeni Üye Onayla</Link>{' '}
          bölümünden yaparsın.
        </Tip>
      </>
    ),
  },
  {
    key: 'software-hub',
    title: 'Software Hub — Topluluk & Turnuva',
    summary: '11 alt bölüm: üye onayı, turnuvalar, tartışma, news, founder başvuruları.',
    accent: 'border-google-blue',
    eyebrow: 'text-google-blue',
    href: '/admin/software-hub',
    hrefLabel: 'Software Hub’a Git',
    body: (
      <>
        <p className="mt-3 text-sm leading-7 text-white/72">
          Developer topluluğunun ve etkinliklerinin merkezi. Ara menüden bir alt bölüm seçersin; her bölüm kendi
          listesini, sekmelerini (<code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">Tümü</code> /{' '}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">Onay Bekleyen</code> /{' '}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">Onaylanan</code>) ve aksiyonlarını taşır. Sol
          menüde de her alt bölüm kısayol olarak görünür.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Mini title="👤 Yeni Üye Onayla (devuser)">
            Topluluğa katılan yeni üyeleri incele. <strong className="text-white">Onayla</strong> /{' '}
            <strong className="text-white">Reddet</strong> ile durumu belirle. Onaysız üyeler kısıtlı sayfaları göremez.
          </Mini>
          <Mini title="🎲 Tavla Katılımcısı">
            Tavla turnuvası kayıtlarını onayla/reddet ve <strong className="text-white">playoff tablosunu</strong>{' '}
            (Son 16 → Final) düzenle: slota katılımcı ata, <strong className="text-white">kazananı işaretle</strong> veya
            slotu temizle.
          </Mini>
          <Mini title="💻 Vibecoding (hackathon)">
            Vibecoding Tournament’a kayıt olan takımları yönet ve onayla.
          </Mini>
          <Mini title="📢 Promote">
            “Promote Your Product” kayıtlarını incele ve onayla/reddet.
          </Mini>
          <Mini title="📄 CV Opt">
            CV + LinkedIn iyileştirme başvurularını incele, sırayı yönet, onayla/reddet.
          </Mini>
          <Mini title="⌨️ Typing">
            Klavye hız yarışması katılımcılarını onayla ve playoff tablosunu (kazanan/temizle) düzenle.
          </Mini>
          <Mini title="💬 Discussion">
            Topluluk tartışma konularını modere et: <strong className="text-white">Onayla</strong>,{' '}
            <strong className="text-white">Reddet</strong> veya <strong className="text-white">Sil</strong> (silme onay ister).
          </Mini>
          <Mini title="📰 News Yönetimi">
            Topluluk içi haber/duyuru kayıtlarını listele, ara ve yayın durumunu (taslak/yayında) yönet.
          </Mini>
          <Mini title="🚀 Founder Başvuruları">
            Founder başvurularını incele; bekleyen başvurular rozetle gösterilir.
          </Mini>
          <Mini title="🗳️ Founder Event Survey">
            Founder etkinlik anketi oylarını ve sonuçlarını görüntüle.
          </Mini>
          <Mini title="📅 Toplantı Anketi (meeting)">
            Toplantı katılım kayıtlarını tarih bazında gör. <strong className="text-white">Sıfırla</strong> tüm kayıtları
            kalıcı siler — geri alınamaz, çift onay ister.
          </Mini>
        </div>
        <Warning>
          <strong className="text-white">Toplantı Anketi → Sıfırla</strong> ve <strong className="text-white">Discussion → Sil</strong>{' '}
          gibi yıkıcı işlemler geri alınamaz. Onay penceresini dikkatle oku.
        </Warning>
      </>
    ),
  },
  {
    key: 'haberler',
    title: 'Haber Yönetimi — Pipeline & Kuyruk',
    summary: 'RSS pipeline’dan gelen haber adaylarını incele, Türkçeleştir ve yayınla.',
    accent: 'border-google-yellow',
    eyebrow: 'text-google-yellow',
    href: '/admin/haberler?tab=kuyruk',
    hrefLabel: 'Haber Yönetimine Git',
    body: (
      <>
        <p className="mt-3 text-sm leading-7 text-white/72">
          Public haber sayfasının editoryal merkezi. Beş sekme tek operatörlü akışla çalışır. Hiçbir haber otomatik
          yayınlanmaz — son karar her zaman senindir.
        </p>
        <ul className="mt-4 space-y-2 text-sm leading-7 text-white/75">
          <Bullet>
            <strong className="text-white">Kuyruk</strong>{' '}
            (<Link href="/admin/haberler?tab=kuyruk" className="font-semibold text-google-blue hover:underline">aç</Link>):
            İnceleme bekleyen adaylar. <strong className="text-white">Düzelt</strong> ile editöre gir,{' '}
            <strong className="text-white">Yayınla</strong> / <strong className="text-white">Hero Yap</strong> /{' '}
            <strong className="text-white">Reddet</strong> / arşivle.
          </Bullet>
          <Bullet>
            <strong className="text-white">Yeni Haber</strong>{' '}
            (<Link href="/admin/haberler?tab=editor" className="font-semibold text-google-blue hover:underline">aç</Link>):
            Sıfırdan elle haber oluştur (başlık, özet, metin, görsel, kategori).
          </Bullet>
          <Bullet>
            <strong className="text-white">Kaynaklar</strong>{' '}
            (<Link href="/admin/haberler?tab=kaynaklar" className="font-semibold text-google-blue hover:underline">aç</Link>):
            RSS/MRSS kaynaklarını ekle, <strong className="text-white">Test Et</strong>, <strong className="text-white">Şimdi Çek</strong>, öncelik/limit ayarla.
          </Bullet>
          <Bullet>
            <strong className="text-white">Pipeline</strong>{' '}
            (<Link href="/admin/haberler?tab=pipeline" className="font-semibold text-google-blue hover:underline">aç</Link>):
            “Pipeline’ı Şimdi Çalıştır” ile elle tetikle; son çalışmaların durumunu (cron/manual, yeni aday, duplicate, hata) gör.
          </Bullet>
          <Bullet>
            <strong className="text-white">Ayarlar</strong>{' '}
            (<Link href="/admin/haberler?tab=ayarlar" className="font-semibold text-google-blue hover:underline">aç</Link>):
            Pipeline aç/kapat, AI (Gemini) taslak ve günlük limit, kaynak başına max aday, retention günleri, hariç/öncelikli kelimeler.
          </Bullet>
        </ul>
        <Tip>
          Akışın tam adım adım kılavuzu için{' '}
          <Link href="/admin/haberler-rehberi" className="font-semibold text-google-blue hover:underline">
            Haber RSS Rehberi
          </Link>{' '}
          bölümüne bak.
        </Tip>
      </>
    ),
  },
  {
    key: 'haberler-rehberi',
    title: 'Haber RSS Rehberi',
    summary: 'Otomatik haber pipeline’ının ayrıntılı, adım adım operatör kılavuzu.',
    accent: 'border-google-green',
    eyebrow: 'text-google-green',
    href: '/admin/haberler-rehberi',
    hrefLabel: 'RSS Rehberine Git',
    body: (
      <p className="mt-3 text-sm leading-7 text-white/72">
        Haber pipeline’ının uçtan uca nasıl çalıştığını anlatan ayrı bir rehber sayfasıdır: RSS kaynağı ekleme,
        pipeline’ı çalıştırma (cron + manuel), kuyruğu inceleyip yayınlama ve ayarlarla davranışı yönetme. Sorun giderme
        bölümü de içerir. Haber yönetimini ilk kez kullanıyorsan önce burayı oku.
      </p>
    ),
  },
  {
    key: 'yazi-dizisi',
    title: 'Arkadaşın Köşesi — Köşe Yazıları',
    summary: 'Köşe yazısı / yazı dizisi içeriklerini oluştur ve yönet.',
    accent: 'border-google-blue',
    eyebrow: 'text-google-blue',
    href: '/admin/yazi-dizisi',
    hrefLabel: 'Arkadaşın Köşesine Git',
    body: (
      <>
        <p className="mt-3 text-sm leading-7 text-white/72">
          Çok yazarlı köşe yazısı sistemini buradan yönetirsin. Her yazarın kendi public sayfası (
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">/&lt;yazar&gt;</code>), kendi{' '}
          <strong className="text-white">ayrı giriş ekranı</strong> (
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">/kose-giris/&lt;yazar&gt;</code>) ve kendi{' '}
          <strong className="text-white">yönetim paneli</strong> (
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">/kose-panel/&lt;yazar&gt;</code>) vardır.
        </p>
        <ul className="mt-4 space-y-2 text-sm leading-7 text-white/75">
          <Bullet><strong className="text-white">Yazarlar</strong> sekmesi: public link, giriş linki, düzenle, aktif/pasif toggle ve <strong className="text-white">şifre sıfırlama</strong>.</Bullet>
          <Bullet><strong className="text-white">Yeni Yazar</strong>: Ad, slug (otomatik üretilir), profil görseli, kısa bio, profil metni, sıralama ve <strong className="text-white">yazar şifresi</strong> (min 6 karakter) gir.</Bullet>
          <Bullet><strong className="text-white">Yazılar</strong> sekmesi: tüm yazarların yazıları; tek tıkla taslak ↔ yayında.</Bullet>
        </ul>
        <Tip>
          Yeni bir yazar eklediğinde ona <strong className="text-white">giriş linkini</strong> (
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">/kose-giris/&lt;yazar&gt;</code>) ve belirlediğin{' '}
          <strong className="text-white">şifreyi</strong> ilet. Yazar kendi panelinden yazı + kapak görseli yükleyip
          yayınlar; içerik onayı için sana ihtiyaç duymaz ama tüm yazıları bu admin bölümünden görebilir/yönetebilirsin.
        </Tip>
        <Warning>
          Yazar şifresini admin <strong className="text-white">göremez</strong>, yalnızca sıfırlayabilir. Yazar şifresini
          unutursa “şifre sıfırlama” ile yeni bir şifre belirleyip ona iletmen gerekir.
        </Warning>
      </>
    ),
  },
  {
    key: 'hizmet-rehberi',
    title: 'Hizmet Rehberi — Öneri Onayları',
    summary: 'Kullanıcıların önerdiği hizmet sağlayıcılarını onayla, reddet veya sil.',
    accent: 'border-google-red',
    eyebrow: 'text-google-red',
    href: '/admin/hizmet-rehberi',
    hrefLabel: 'Hizmet Rehberine Git',
    body: (
      <>
        <p className="mt-3 text-sm leading-7 text-white/72">
          Kullanıcılar hizmet rehberine yeni sağlayıcı önerebilir. Bekleyen öneriler bu bölümde toplanır ve sol menüde
          rozetle gösterilir.
        </p>
        <ul className="mt-4 space-y-2 text-sm leading-7 text-white/75">
          <Bullet><strong className="text-white">Onayla</strong>: Öneriyi public rehbere ekler.</Bullet>
          <Bullet><strong className="text-white">Reddet</strong>: Öneriyi listeden çıkarır (yayınlanmaz).</Bullet>
          <Bullet><strong className="text-white">Sil</strong>: Kaydı tamamen kaldırır.</Bullet>
        </ul>
        <Tip>Bekleyen öneri sayısı sol menüdeki rozette ve ana sayfa kartında görünür.</Tip>
      </>
    ),
  },
  {
    key: 'recruitment-agencies',
    title: 'Recruitment Agencies — Ajans Listesi',
    summary: 'İşe alım ajansı kayıtlarını ekle, düzenle ve sil.',
    accent: 'border-google-green',
    eyebrow: 'text-google-green',
    href: '/admin/recruitment-agencies',
    hrefLabel: 'Recruitment Agencies’e Git',
    body: (
      <>
        <p className="mt-3 text-sm leading-7 text-white/72">
          Sitede listelenen işe alım / recruitment ajanslarını yönettiğin bölüm. Liste tamamen elle yönetilir.
        </p>
        <ul className="mt-4 space-y-2 text-sm leading-7 text-white/75">
          <Bullet><strong className="text-white">Yeni / Ekle</strong>: Yeni bir ajans kaydı oluştur.</Bullet>
          <Bullet><strong className="text-white">Düzenle</strong>: Mevcut bir ajansın bilgilerini güncelle.</Bullet>
          <Bullet><strong className="text-white">Sil</strong>: Ajans kaydını listeden kaldır.</Bullet>
        </ul>
      </>
    ),
  },
  {
    key: 'service-finder',
    title: 'Service Finder — Uzman Tarama',
    summary: 'Otomatik uzman tarama adaylarını çalıştır, incele ve onayla/reddet.',
    accent: 'border-google-blue',
    eyebrow: 'text-google-blue',
    href: '/admin/service-finder',
    hrefLabel: 'Service Finder’a Git',
    body: (
      <>
        <p className="mt-3 text-sm leading-7 text-white/72">
          Uzman / hizmet sağlayıcı adaylarını otomatik tarayan modül. Tarama çalıştırılır, bulunan adaylar listelenir ve
          her aday için karar verilir.
        </p>
        <ul className="mt-4 space-y-2 text-sm leading-7 text-white/75">
          <Bullet><strong className="text-white">Tara / Çalıştır</strong>: Yeni aday taraması başlatır.</Bullet>
          <Bullet><strong className="text-white">Onayla</strong>: Adayı geçerli bir sonuç olarak kabul eder.</Bullet>
          <Bullet><strong className="text-white">Reddet</strong>: Adayı eler.</Bullet>
        </ul>
        <Warning>
          Tarama dış kaynaklara istek atar; çalıştırmadan önce sonuçların onayını senin vereceğini unutma — hiçbir aday
          otomatik yayınlanmaz.
        </Warning>
      </>
    ),
  },
  {
    key: 'broken-link-reports',
    title: 'Kırık Link Bildirimleri',
    summary: 'Kullanıcıların bildirdiği kırık bağlantı raporlarını incele ve temizle.',
    accent: 'border-google-orange',
    eyebrow: 'text-google-orange',
    href: '/admin/broken-link-reports',
    hrefLabel: 'Kırık Link Bildirimlerine Git',
    body: (
      <>
        <p className="mt-3 text-sm leading-7 text-white/72">
          Kullanıcılar bir bağlantının çalışmadığını bildirebilir. Bu raporlar burada toplanır; ajans adı, rapor metni ve
          tarih ile listelenir. Bekleyen rapor sayısı sol menüde rozetle gösterilir.
        </p>
        <ul className="mt-4 space-y-2 text-sm leading-7 text-white/75">
          <Bullet><strong className="text-white">İncele</strong>: Bildirilen linki kontrol et ve ilgili kaydı düzelt.</Bullet>
          <Bullet><strong className="text-white">Sil</strong>: Çözülen veya geçersiz raporu listeden kaldır.</Bullet>
        </ul>
      </>
    ),
  },
];

export function GuidesAdminClient() {
  const gateStatus = useAdminGate();
  const [filter, setFilter] = useState('');

  if (gateStatus !== 'authed') {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container py-20 text-center text-sm text-white/60">Admin oturumu doğrulanıyor...</div>
      </div>
    );
  }

  const query = filter.trim().toLowerCase();
  const visible = query
    ? GUIDES.filter(
        (g) =>
          g.title.toLowerCase().includes(query) ||
          g.summary.toLowerCase().includes(query) ||
          g.key.toLowerCase().includes(query),
      )
    : GUIDES;

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-google-blue/10 via-transparent to-google-green/10" />
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-google-blue/20 blur-3xl"
          aria-hidden="true"
        />
        <div className="container relative py-12">
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-google-blue">Rehber</div>
          <h1 className="mt-3 text-4xl font-black md:text-5xl">Admin Paneli Kullanım Kılavuzu</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/68">
            Bu sayfa, admin panelindeki <strong className="text-white">tüm bölümleri</strong> tek tek anlatır: her bölümün
            ne işe yaradığı, hangi butonların bulunduğu ve verinin nasıl aktığı. Aşağıdaki dizinden bir bölüme atlayabilir
            ya da arama kutusuyla filtreleyebilirsin.
          </p>

          <div className="mt-6 max-w-md">
            <label className="block">
              <span className="sr-only">Bölüm ara</span>
              <input
                type="search"
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                placeholder="Bölüm ara (ör. haber, tavla, link)..."
                className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition focus:border-google-blue focus-visible:ring-2 focus-visible:ring-google-blue"
              />
            </label>
          </div>
        </div>
      </section>

      <div className="container space-y-6 py-10">
        {/* Hızlı dizin */}
        <nav
          aria-label="Rehber dizini"
          className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-6"
        >
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">İçindekiler</div>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {GUIDES.map((g) => (
              <li key={g.key}>
                <a
                  href={`#${g.key}`}
                  className="block rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm transition hover:border-google-blue/40 hover:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-google-blue"
                >
                  <span className="block font-semibold text-white">{g.title}</span>
                  <span className="mt-1 block text-[12px] leading-5 text-white/50">{g.summary}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {visible.length === 0 ? (
          <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-10 text-center text-sm text-white/55">
            “{filter}” için bölüm bulunamadı.
          </div>
        ) : (
          visible.map((g) => (
            <Card key={g.key} id={g.key} accent={g.accent}>
              <Eyebrow color={g.eyebrow}>{g.summary}</Eyebrow>
              <h2 className="mt-2 text-2xl font-bold">{g.title}</h2>
              {g.body}
              {g.href ? (
                <div className="mt-5">
                  <Link
                    href={g.href}
                    className="inline-flex items-center gap-2 rounded-full bg-google-blue px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
                  >
                    {g.hrefLabel ?? 'Bölüme Git'}
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              ) : null}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

function Card({ children, accent, id }: { children: React.ReactNode; accent: string; id?: string }) {
  return (
    <section
      id={id}
      className={`scroll-mt-24 rounded-[1.6rem] border-l-4 ${accent} border-y border-r border-white/10 bg-white/[0.03] p-6`}
    >
      {children}
    </section>
  );
}

function Eyebrow({ children, color }: { children: React.ReactNode; color: string }) {
  return <div className={`text-xs font-semibold uppercase tracking-[0.18em] ${color}`}>{children}</div>;
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-white/40" aria-hidden="true" />
      <span>{children}</span>
    </li>
  );
}

function Mini({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
      <div className="text-sm font-semibold text-white">{title}</div>
      <p className="mt-2 text-sm leading-7 text-white/72">{children}</p>
    </div>
  );
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 rounded-2xl border border-google-blue/25 bg-google-blue/10 px-4 py-3 text-sm leading-7 text-white/80">
      <span className="font-semibold text-google-blue">İpucu: </span>
      {children}
    </div>
  );
}

function Warning({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 rounded-2xl border border-google-red/25 bg-google-red/10 px-4 py-3 text-sm leading-7 text-white/80">
      <span className="font-semibold text-google-red">Önemli: </span>
      {children}
    </div>
  );
}
