'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ADMIN_CONTROL_CLASS } from '@/components/admin/ui/AdminField';
import { TONE_STYLES, type SiteTone } from '@/components/site/tones';
import { Button } from '@/components/ui/Button';
import { useAdminGate } from '@/hooks/useAdminGate';
import { cn } from '@/lib/utils/cn';

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

type GuideTone = 'brand' | SiteTone;

function toneSolid(tone: GuideTone): string {
  return tone === 'brand' ? 'bg-brand-600' : TONE_STYLES[tone].solid;
}

function toneText(tone: GuideTone): string {
  return tone === 'brand' ? 'text-brand-700' : TONE_STYLES[tone].text;
}

interface GuideEntry {
  /** Stable anchor + filter key. */
  key: string;
  /** Card heading. */
  title: string;
  /** Short one-line summary shown in the index and under the title. */
  summary: string;
  /** Accent colour for the left bar and the eyebrow. */
  tone: GuideTone;
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
    tone: 'brand',
    href: '/admin',
    hrefLabel: 'Ana Panele Git',
    body: (
      <>
        <p className="mt-3 text-sm leading-7 text-muted">
          Admin paneline <strong className="text-ink">tek bir şifreyle</strong> giriş yaparsın. Oturum açıldıktan
          sonra alt sayfalar tekrar şifre sormaz; sol menüden istediğin bölüme geçebilirsin. Çıkış yapana kadar oturum
          tarayıcı sekmesinde saklı kalır.
        </p>
        <ul className="mt-4 space-y-2 text-sm leading-7 text-muted">
          <Bullet><strong className="text-ink">Sol menü (sidebar)</strong>: Tüm bölümler burada listelenir; aktif bölüm vurgulanır.</Bullet>
          <Bullet><strong className="text-ink">Rozetler</strong>: Bekleyen iş olan bölümlerin yanında kırmızı sayaç görünür (ör. bekleyen hizmet önerisi, kırık link).</Bullet>
          <Bullet><strong className="text-ink">Ana sayfa kartları</strong>: Giriş ekranında bekleyen işler özetlenir; karta tıklayınca ilgili bölüme gidersin.</Bullet>
          <Bullet><strong className="text-ink">Çıkış Yap</strong>: Sol menünün altındaki buton oturumu kapatır ve seni giriş ekranına döndürür.</Bullet>
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
    tone: 'brand',
    href: '/admin/uyeler',
    hrefLabel: 'Üyeler Bölümüne Git',
    body: (
      <>
        <p className="mt-3 text-sm leading-7 text-muted">
          Araçların tamamı artık <strong className="text-ink">üyelik (giriş) zorunlu</strong> çalışıyor. Bu bölüm,{' '}
          <strong className="text-ink">yeni üye olan herkesi</strong> tek listede gösterir. İki sekmeye ayrılır:
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Mini title="👥 Üyeler (Auth)">
            Araçlara erişmek için <strong className="text-ink">Supabase hesabı</strong> oluşturan herkes (e-posta veya
            Google ile). Her satırda e-posta, kayıt tarihi, son giriş, sağlayıcı, e-posta doğrulama durumu ve devuser
            profili olup olmadığı görünür.
          </Mini>
          <Mini title="🧑‍💻 DevUser Profili">
            Developer topluluğuna katılmak için <strong className="text-ink">detaylı profil</strong> oluşturanlar.
            Ad-soyad, şehir, rol, kayıt tarihi ve <strong className="text-ink">onay durumu</strong> (Bekliyor / Onaylı /
            Reddedildi) ile listelenir.
          </Mini>
        </div>
        <ul className="mt-4 space-y-2 text-sm leading-7 text-muted">
          <Bullet><strong className="text-ink">İstatistik kartları</strong>: Toplam üye, devuser profili, onay bekleyen devuser ve profilsiz üye sayısı.</Bullet>
          <Bullet><strong className="text-ink">Arama</strong>: E-posta, isim, şehir veya role göre anlık filtreleme.</Bullet>
          <Bullet><strong className="text-ink">Yenile</strong>: Listeyi en güncel haliyle yeniden çeker. En yeni kayıt her zaman en üstte.</Bullet>
          <Bullet><strong className="text-ink">Toplam Üye</strong> sayısı ana panel ekranındaki kartta da görünür.</Bullet>
        </ul>
        <Tip>
          “Üyeler” sekmesindeki bir kişide <strong className="text-ink">DevUser ✓ Var</strong> görmüyorsan, o kişi araca
          giriş yapmış ama henüz developer profili oluşturmamış demektir. DevUser onaylarını{' '}
          <Link href="/admin/software-hub" className="font-semibold text-brand-700 hover:underline">Software Hub → Yeni Üye Onayla</Link>{' '}
          bölümünden yaparsın.
        </Tip>
      </>
    ),
  },
  {
    key: 'software-hub',
    title: 'Software Hub — Topluluk & Turnuva',
    summary: '11 alt bölüm: üye onayı, turnuvalar, tartışma, news, founder başvuruları.',
    tone: 'brand',
    href: '/admin/software-hub',
    hrefLabel: 'Software Hub’a Git',
    body: (
      <>
        <p className="mt-3 text-sm leading-7 text-muted">
          Developer topluluğunun ve etkinliklerinin merkezi. Ara menüden bir alt bölüm seçersin; her bölüm kendi
          listesini, sekmelerini (<code className="rounded-tile bg-band px-1.5 py-0.5 text-xs text-ink">Tümü</code> /{' '}
          <code className="rounded-tile bg-band px-1.5 py-0.5 text-xs text-ink">Onay Bekleyen</code> /{' '}
          <code className="rounded-tile bg-band px-1.5 py-0.5 text-xs text-ink">Onaylanan</code>) ve aksiyonlarını taşır. Sol
          menüde de her alt bölüm kısayol olarak görünür.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Mini title="👤 Yeni Üye Onayla (devuser)">
            Topluluğa katılan yeni üyeleri incele. <strong className="text-ink">Onayla</strong> /{' '}
            <strong className="text-ink">Reddet</strong> ile durumu belirle. Onaysız üyeler kısıtlı sayfaları göremez.
          </Mini>
          <Mini title="🎲 Tavla Katılımcısı">
            Tavla turnuvası kayıtlarını onayla/reddet ve <strong className="text-ink">playoff tablosunu</strong>{' '}
            (Son 16 → Final) düzenle: slota katılımcı ata, <strong className="text-ink">kazananı işaretle</strong> veya
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
            Topluluk tartışma konularını modere et: <strong className="text-ink">Onayla</strong>,{' '}
            <strong className="text-ink">Reddet</strong> veya <strong className="text-ink">Sil</strong> (silme onay ister).
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
            Toplantı katılım kayıtlarını tarih bazında gör. <strong className="text-ink">Sıfırla</strong> tüm kayıtları
            kalıcı siler — geri alınamaz, çift onay ister.
          </Mini>
        </div>
        <Warning>
          <strong className="text-ink">Toplantı Anketi → Sıfırla</strong> ve <strong className="text-ink">Discussion → Sil</strong>{' '}
          gibi yıkıcı işlemler geri alınamaz. Onay penceresini dikkatle oku.
        </Warning>
      </>
    ),
  },
  {
    key: 'haberler',
    title: 'Haber Yönetimi — Pipeline & Kuyruk',
    summary: 'RSS pipeline’dan gelen haber adaylarını incele, Türkçeleştir ve yayınla.',
    tone: 'yellow',
    href: '/admin/haberler?tab=kuyruk',
    hrefLabel: 'Haber Yönetimine Git',
    body: (
      <>
        <p className="mt-3 text-sm leading-7 text-muted">
          Public haber sayfasının editoryal merkezi. Beş sekme tek operatörlü akışla çalışır. Hiçbir haber otomatik
          yayınlanmaz — son karar her zaman senindir.
        </p>
        <ul className="mt-4 space-y-2 text-sm leading-7 text-muted">
          <Bullet>
            <strong className="text-ink">Kuyruk</strong>{' '}
            (<Link href="/admin/haberler?tab=kuyruk" className="font-semibold text-brand-700 hover:underline">aç</Link>):
            İnceleme bekleyen adaylar. <strong className="text-ink">Düzelt</strong> ile editöre gir,{' '}
            <strong className="text-ink">Yayınla</strong> / <strong className="text-ink">Hero Yap</strong> /{' '}
            <strong className="text-ink">Reddet</strong> / arşivle.
          </Bullet>
          <Bullet>
            <strong className="text-ink">Yeni Haber</strong>{' '}
            (<Link href="/admin/haberler?tab=editor" className="font-semibold text-brand-700 hover:underline">aç</Link>):
            Sıfırdan elle haber oluştur (başlık, özet, metin, görsel, kategori).
          </Bullet>
          <Bullet>
            <strong className="text-ink">Kaynaklar</strong>{' '}
            (<Link href="/admin/haberler?tab=kaynaklar" className="font-semibold text-brand-700 hover:underline">aç</Link>):
            RSS/MRSS kaynaklarını ekle, <strong className="text-ink">Test Et</strong>, <strong className="text-ink">Şimdi Çek</strong>, öncelik/limit ayarla.
          </Bullet>
          <Bullet>
            <strong className="text-ink">Pipeline</strong>{' '}
            (<Link href="/admin/haberler?tab=pipeline" className="font-semibold text-brand-700 hover:underline">aç</Link>):
            “Pipeline’ı Şimdi Çalıştır” ile elle tetikle; son çalışmaların durumunu (cron/manual, yeni aday, duplicate, hata) gör.
          </Bullet>
          <Bullet>
            <strong className="text-ink">Ayarlar</strong>{' '}
            (<Link href="/admin/haberler?tab=ayarlar" className="font-semibold text-brand-700 hover:underline">aç</Link>):
            Pipeline aç/kapat, AI (Gemini) taslak ve günlük limit, kaynak başına max aday, retention günleri, hariç/öncelikli kelimeler.
          </Bullet>
        </ul>
        <Tip>
          Akışın tam adım adım kılavuzu için{' '}
          <Link href="/admin/haberler-rehberi" className="font-semibold text-brand-700 hover:underline">
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
    tone: 'green',
    href: '/admin/haberler-rehberi',
    hrefLabel: 'RSS Rehberine Git',
    body: (
      <p className="mt-3 text-sm leading-7 text-muted">
        Haber pipeline’ının uçtan uca nasıl çalıştığını anlatan ayrı bir rehber sayfasıdır: RSS kaynağı ekleme,
        pipeline’ı çalıştırma (cron + manuel), kuyruğu inceleyip yayınlama ve ayarlarla davranışı yönetme. Sorun giderme
        bölümü de içerir. Haber yönetimini ilk kez kullanıyorsan önce burayı oku.
      </p>
    ),
  },
  {
    key: 'yazi-dizisi',
    title: 'Blog / Köşe Yazıları',
    summary: 'Köşe yazısı / yazı dizisi içeriklerini oluştur ve yönet.',
    tone: 'brand',
    href: '/admin/yazi-dizisi',
    hrefLabel: 'Köşe Yazılarına Git',
    body: (
      <>
        <p className="mt-3 text-sm leading-7 text-muted">
          Çok yazarlı köşe yazısı sistemini buradan yönetirsin. Yazılar <code className="rounded-tile bg-band px-1.5 py-0.5 text-xs text-ink">/blog</code>{' '}
          altında yayınlanır. Her yazarın kendi public sayfası (
          <code className="rounded-tile bg-band px-1.5 py-0.5 text-xs text-ink">/blog/yazar/&lt;yazar&gt;</code>), kendi{' '}
          <strong className="text-ink">ayrı giriş ekranı</strong> (
          <code className="rounded-tile bg-band px-1.5 py-0.5 text-xs text-ink">/authors/&lt;yazar&gt;</code>) ve kendi{' '}
          <strong className="text-ink">yönetim paneli</strong> (
          <code className="rounded-tile bg-band px-1.5 py-0.5 text-xs text-ink">/authors/&lt;yazar&gt;/panel</code>) vardır.
        </p>
        <ul className="mt-4 space-y-2 text-sm leading-7 text-muted">
          <Bullet><strong className="text-ink">Yazarlar</strong> sekmesi: public link, giriş linki, düzenle, aktif/pasif toggle ve <strong className="text-ink">şifre sıfırlama</strong>.</Bullet>
          <Bullet><strong className="text-ink">Yeni Yazar</strong>: Ad, slug (otomatik üretilir), profil görseli, kısa bio, profil metni, sıralama ve <strong className="text-ink">yazar şifresi</strong> (min 6 karakter) gir.</Bullet>
          <Bullet><strong className="text-ink">Yazılar</strong> sekmesi: tüm yazarların yazıları; tek tıkla taslak ↔ yayında.</Bullet>
        </ul>
        <Tip>
          Yeni bir yazar eklediğinde ona <strong className="text-ink">giriş linkini</strong> (
          <code className="rounded-tile bg-band px-1.5 py-0.5 text-xs text-ink">/authors/&lt;yazar&gt;</code>) ve belirlediğin{' '}
          <strong className="text-ink">şifreyi</strong> ilet. Yazar kendi panelinden yazı + kapak görseli yükleyip
          yayınlar; içerik onayı için sana ihtiyaç duymaz ama tüm yazıları bu admin bölümünden görebilir/yönetebilirsin.
        </Tip>
        <Warning>
          Yazar şifresini admin <strong className="text-ink">göremez</strong>, yalnızca sıfırlayabilir. Yazar şifresini
          unutursa “şifre sıfırlama” ile yeni bir şifre belirleyip ona iletmen gerekir.
        </Warning>
      </>
    ),
  },
  {
    key: 'hizmet-rehberi',
    title: 'Hizmet Rehberi — Öneri Onayları',
    summary: 'Kullanıcıların önerdiği hizmet sağlayıcılarını onayla, reddet veya sil.',
    tone: 'red',
    href: '/admin/hizmet-rehberi',
    hrefLabel: 'Hizmet Rehberine Git',
    body: (
      <>
        <p className="mt-3 text-sm leading-7 text-muted">
          Kullanıcılar hizmet rehberine yeni sağlayıcı önerebilir. Bekleyen öneriler bu bölümde toplanır ve sol menüde
          rozetle gösterilir.
        </p>
        <ul className="mt-4 space-y-2 text-sm leading-7 text-muted">
          <Bullet><strong className="text-ink">Onayla</strong>: Öneriyi public rehbere ekler.</Bullet>
          <Bullet><strong className="text-ink">Reddet</strong>: Öneriyi listeden çıkarır (yayınlanmaz).</Bullet>
          <Bullet><strong className="text-ink">Sil</strong>: Kaydı tamamen kaldırır.</Bullet>
        </ul>
        <Tip>Bekleyen öneri sayısı sol menüdeki rozette ve ana sayfa kartında görünür.</Tip>
      </>
    ),
  },
  {
    key: 'recruitment-agencies',
    title: 'Recruitment Agencies — Ajans Listesi',
    summary: 'İşe alım ajansı kayıtlarını ekle, düzenle ve sil.',
    tone: 'green',
    href: '/admin/recruitment-agencies',
    hrefLabel: 'Recruitment Agencies’e Git',
    body: (
      <>
        <p className="mt-3 text-sm leading-7 text-muted">
          Sitede listelenen işe alım / recruitment ajanslarını yönettiğin bölüm. Liste tamamen elle yönetilir.
        </p>
        <ul className="mt-4 space-y-2 text-sm leading-7 text-muted">
          <Bullet><strong className="text-ink">Yeni / Ekle</strong>: Yeni bir ajans kaydı oluştur.</Bullet>
          <Bullet><strong className="text-ink">Düzenle</strong>: Mevcut bir ajansın bilgilerini güncelle.</Bullet>
          <Bullet><strong className="text-ink">Sil</strong>: Ajans kaydını listeden kaldır.</Bullet>
        </ul>
      </>
    ),
  },
  {
    key: 'service-finder',
    title: 'Service Finder — Uzman Tarama',
    summary: 'Otomatik uzman tarama adaylarını çalıştır, incele ve onayla/reddet.',
    tone: 'brand',
    href: '/admin/service-finder',
    hrefLabel: 'Service Finder’a Git',
    body: (
      <>
        <p className="mt-3 text-sm leading-7 text-muted">
          Uzman / hizmet sağlayıcı adaylarını otomatik tarayan modül. Tarama çalıştırılır, bulunan adaylar listelenir ve
          her aday için karar verilir.
        </p>
        <ul className="mt-4 space-y-2 text-sm leading-7 text-muted">
          <Bullet><strong className="text-ink">Tara / Çalıştır</strong>: Yeni aday taraması başlatır.</Bullet>
          <Bullet><strong className="text-ink">Onayla</strong>: Adayı geçerli bir sonuç olarak kabul eder.</Bullet>
          <Bullet><strong className="text-ink">Reddet</strong>: Adayı eler.</Bullet>
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
    tone: 'orange',
    href: '/admin/broken-link-reports',
    hrefLabel: 'Kırık Link Bildirimlerine Git',
    body: (
      <>
        <p className="mt-3 text-sm leading-7 text-muted">
          Kullanıcılar bir bağlantının çalışmadığını bildirebilir. Bu raporlar burada toplanır; ajans adı, rapor metni ve
          tarih ile listelenir. Bekleyen rapor sayısı sol menüde rozetle gösterilir.
        </p>
        <ul className="mt-4 space-y-2 text-sm leading-7 text-muted">
          <Bullet><strong className="text-ink">İncele</strong>: Bildirilen linki kontrol et ve ilgili kaydı düzelt.</Bullet>
          <Bullet><strong className="text-ink">Sil</strong>: Çözülen veya geçersiz raporu listeden kaldır.</Bullet>
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
      <div className="min-h-screen bg-page text-ink">
        <div className="container py-20 text-center text-sm text-muted">Admin oturumu doğrulanıyor...</div>
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
    <div className="min-h-screen bg-page text-ink">
      <section className="border-b border-line bg-page">
        <div className="container py-12">
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">Rehber</div>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-ink md:text-5xl">Kullanım Kılavuzu</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
            Bu sayfa, admin panelindeki <strong className="text-ink">tüm bölümleri</strong> tek tek anlatır: her bölümün
            ne işe yaradığı, hangi butonların bulunduğu ve verinin nasıl aktığı. Aşağıdaki dizinden bir bölüme atlayabilir
            ya da arama kutusuyla filtreleyebilirsin.
          </p>

          <div className="mt-6 inline-flex rounded-btn border border-line bg-band p-1">
            <span className="inline-flex min-h-[44px] items-center rounded-tile bg-brand-700 px-4 text-sm font-semibold text-white">
              Admin Paneli
            </span>
            <Link
              href="/admin/uygulama-rehberi"
              className="inline-flex min-h-[44px] items-center rounded-tile px-4 text-sm font-semibold text-muted transition-colors hover:text-ink"
            >
              Uygulama
            </Link>
          </div>

          <div className="mt-6 max-w-md">
            <label className="block">
              <span className="sr-only">Bölüm ara</span>
              <input
                type="search"
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                placeholder="Bölüm ara (ör. haber, tavla, link)..."
                className={ADMIN_CONTROL_CLASS}
              />
            </label>
          </div>
        </div>
      </section>

      <div className="container space-y-6 py-10">
        {/* Hızlı dizin */}
        <nav aria-label="Rehber dizini" className="rounded-card border border-line bg-band p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">İçindekiler</div>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {GUIDES.map((g) => (
              <li key={g.key}>
                <a
                  href={`#${g.key}`}
                  className="block rounded-btn border border-line bg-white px-4 py-3 text-sm transition-colors hover:border-brand-700"
                >
                  <span className="block font-semibold text-ink">{g.title}</span>
                  <span className="mt-1 block text-[12px] leading-5 text-muted">{g.summary}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {visible.length === 0 ? (
          <div className="rounded-card border border-line bg-white p-10 text-center text-sm text-muted">
            “{filter}” için bölüm bulunamadı.
          </div>
        ) : (
          visible.map((g) => (
            <GuideCard key={g.key} id={g.key} tone={g.tone}>
              <Eyebrow tone={g.tone}>{g.summary}</Eyebrow>
              <h2 className="mt-2 text-2xl font-bold text-ink">{g.title}</h2>
              {g.body}
              {g.href ? (
                <div className="mt-5">
                  <Button href={g.href} variant="primary" size="sm">
                    {g.hrefLabel ?? 'Bölüme Git'}
                    <span aria-hidden="true">→</span>
                  </Button>
                </div>
              ) : null}
            </GuideCard>
          ))
        )}
      </div>
    </div>
  );
}

function GuideCard({ children, tone, id }: { children: React.ReactNode; tone: GuideTone; id?: string }) {
  return (
    <section
      id={id}
      className="relative scroll-mt-24 overflow-hidden rounded-card border border-line bg-white p-6 pl-7"
    >
      <span aria-hidden="true" className={cn('absolute inset-y-0 left-0 w-1', toneSolid(tone))} />
      {children}
    </section>
  );
}

function Eyebrow({ children, tone }: { children: React.ReactNode; tone: GuideTone }) {
  return <div className={cn('text-xs font-semibold uppercase tracking-[0.18em]', toneText(tone))}>{children}</div>;
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-muted" aria-hidden="true" />
      <span>{children}</span>
    </li>
  );
}

function Mini({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-btn border border-line bg-band p-4">
      <div className="text-sm font-semibold text-ink">{title}</div>
      <p className="mt-2 text-sm leading-7 text-muted">{children}</p>
    </div>
  );
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        'mt-4 rounded-btn border px-4 py-3 text-sm leading-7 text-ink',
        TONE_STYLES.blue.border,
        TONE_STYLES.blue.tint,
      )}
    >
      <span className="font-semibold text-brand-700">İpucu: </span>
      {children}
    </div>
  );
}

function Warning({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        'mt-4 rounded-btn border px-4 py-3 text-sm leading-7 text-ink',
        TONE_STYLES.red.border,
        TONE_STYLES.red.tint,
      )}
    >
      <span className={cn('font-semibold', TONE_STYLES.red.text)}>Önemli: </span>
      {children}
    </div>
  );
}
