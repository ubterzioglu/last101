'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAdminGate } from '@/hooks/useAdminGate';

/**
 * In-app operator guide for the PUBLIC-FACING application (not the admin panel).
 *
 * Where GuidesAdminClient documents the admin sections, this page explains how
 * end users experience the product: the new auth requirement and member login,
 * the interactive tools + hubs, the corner-author (Arkadaşın Köşesi) flow, and
 * the DevUser dashboard. It is read-only and rendered inside the admin shell so
 * the operator understands every user journey from one place.
 */

interface GuideEntry {
  key: string;
  title: string;
  summary: string;
  accent: string;
  eyebrow: string;
  href?: string;
  hrefLabel?: string;
  body: React.ReactNode;
}

const GUIDES: GuideEntry[] = [
  {
    key: 'genel',
    title: 'Genel Bakış — Uygulama Nasıl Çalışır',
    summary: 'Public site, route grupları ve kullanıcı tipleri.',
    accent: 'border-google-blue',
    eyebrow: 'text-google-blue',
    body: (
      <>
        <p className="mt-3 text-sm leading-7 text-white/72">
          almanya101, Almanya’ya gitmek veya orada yaşamak isteyen Türkler için bir Next.js uygulamasıdır. Site dört ana
          alandan oluşur ve her alanın farklı bir kullanıcı tipi vardır:
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Mini title="🌐 Pazarlama & İçerik">
            Ana sayfa, haberler, köşe yazıları (Arkadaşın Köşesi), hizmet rehberi gibi <strong className="text-white">herkese açık</strong> sayfalar. Giriş gerektirmez.
          </Mini>
          <Mini title="🧰 İnteraktif Araçlar">
            Maaş hesaplama, vize/banka/sigorta seçimi, planlama araçları. <strong className="text-white">Artık üyelik (giriş) zorunlu.</strong>
          </Mini>
          <Mini title="🧑‍💻 DevUser Dashboard">
            Developer topluluğu paneli. Supabase girişi + onaylı devuser profili gerektirir.
          </Mini>
          <Mini title="✍️ Köşe Yazarı Paneli">
            Köşe yazarlarının kendi yazılarını yönettiği ayrı şifreli panel.
          </Mini>
        </div>
        <Tip>
          Kullanıcı tarafındaki tüm giriş ekranları artık <strong className="text-white">“solda görsel + sağda form”</strong>{' '}
          tasarımındadır: üye girişi, köşe yazarı girişi ve admin girişi aynı görsel dili paylaşır.
        </Tip>
      </>
    ),
  },
  {
    key: 'uye-giris',
    title: 'Üye Girişi & Araçlar',
    summary: 'Auth zorunluluğu, /giris akışı ve araç hub’ları.',
    accent: 'border-google-blue',
    eyebrow: 'text-google-blue',
    href: '/giris',
    hrefLabel: 'Üye Giriş Ekranını Aç',
    body: (
      <>
        <p className="mt-3 text-sm leading-7 text-white/72">
          İnteraktif araçların tamamı artık <strong className="text-white">giriş zorunlu</strong> çalışır. Giriş yapmamış
          bir kullanıcı bir aracı açmaya çalıştığında <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">/giris</code>{' '}
          ekranına yönlendirilir; giriş sonrası kaldığı araca geri döner.
        </p>
        <ul className="mt-4 space-y-2 text-sm leading-7 text-white/75">
          <Bullet><strong className="text-white">Kayıt / Giriş</strong>: E-posta + şifre ya da <strong className="text-white">Google ile</strong> tek tıkla. Aynı ekranda “Giriş Yap” ↔ “Üye Ol” sekmeleri var.</Bullet>
          <Bullet><strong className="text-white">E-posta doğrulama</strong>: E-posta ile kayıtta, kullanıcıya doğrulama bağlantısı gider. Doğrulanana kadar oturum açılmaz.</Bullet>
          <Bullet><strong className="text-white">Araç hub’ları</strong>: Tüm araçlar <Link href="/almanya-araclari" className="font-semibold text-google-blue hover:underline">/almanya-araclari</Link> ve <Link href="/yeniarachub" className="font-semibold text-google-blue hover:underline">/yeniarachub</Link> sayfalarında kategori bazında listelenir.</Bullet>
          <Bullet><strong className="text-white">Araçlar</strong>: Maaş hesaplama, vize/banka/sigorta seçimi, para transferi, vatandaşlık testi, StepStone karşılaştırma ve 10+ planlama aracı (yolunu seç, şehir uyumu, ilk 90 gün, iş bulma olasılığı vb.).</Bullet>
        </ul>
        <Tip>
          Yeni üye olan herkesi <Link href="/admin/uyeler" className="font-semibold text-google-blue hover:underline">Admin → Üyeler</Link> bölümünden görebilirsin. Bu, araca giriş yapan ama henüz devuser profili oluşturmamış kişileri de kapsar.
        </Tip>
      </>
    ),
  },
  {
    key: 'kose-yazari',
    title: 'Köşe Yazarı Paneli — Arkadaşın Köşesi',
    summary: 'Yazarların ayrı giriş + yazı/foto yükleme akışı.',
    accent: 'border-google-green',
    eyebrow: 'text-google-green',
    href: '/admin/yazi-dizisi',
    hrefLabel: 'Yazar Yönetimine Git',
    body: (
      <>
        <p className="mt-3 text-sm leading-7 text-white/72">
          Köşe yazarları, ana üyelik sisteminden <strong className="text-white">bağımsız</strong> çalışır. Her yazarın
          kendi şifresi ve kendi paneli vardır. Yazar yönetimini (yeni yazar ekleme, şifre) admin{' '}
          <Link href="/admin/yazi-dizisi" className="font-semibold text-google-green hover:underline">Arkadaşın Köşesi</Link>{' '}
          bölümünden yaparsın.
        </p>
        <ul className="mt-4 space-y-2 text-sm leading-7 text-white/75">
          <Bullet><strong className="text-white">1. Giriş</strong>: Yazar <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">/kose-giris/&lt;yazar&gt;</code> adresinden, admin’in verdiği şifreyle girer.</Bullet>
          <Bullet><strong className="text-white">2. Panel</strong>: <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">/kose-panel/&lt;yazar&gt;</code> — profilini (ad, bio, profil görseli) düzenler.</Bullet>
          <Bullet><strong className="text-white">3. Yazı yaz</strong>: Başlık, özet, kapak görseli, okuma süresi ve Markdown içerik. <strong className="text-white">Canlı önizleme</strong> ile yazarken sonucu görür.</Bullet>
          <Bullet><strong className="text-white">4. Yayınla</strong>: Taslak olarak kaydeder veya doğrudan yayına alır. Yayındaki yazı <Link href="/yazi-dizisi" className="font-semibold text-google-green hover:underline">/yazi-dizisi</Link> ve yazarın kendi sayfasında (<code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">/&lt;yazar&gt;</code>) görünür.</Bullet>
        </ul>
        <Warning>
          Görsel yükleme JPG/PNG/WEBP/GIF ve <strong className="text-white">en fazla 5 MB</strong> ile sınırlıdır. Yazar
          şifresini admin göremez, yalnızca sıfırlayabilir.
        </Warning>
      </>
    ),
  },
  {
    key: 'devuser',
    title: 'DevUser Dashboard — Developer Topluluğu',
    summary: 'Profil, survey, turnuvalar ve topluluk araçları.',
    accent: 'border-google-yellow',
    eyebrow: 'text-google-yellow',
    href: '/admin/software-hub',
    hrefLabel: 'Software Hub’a Git',
    body: (
      <>
        <p className="mt-3 text-sm leading-7 text-white/72">
          DevUser dashboard, developer topluluğunun kendi alanıdır. Kullanıcı önce Supabase ile giriş yapar, sonra detaylı
          bir <strong className="text-white">developer profili</strong> oluşturur. Profil <strong className="text-white">admin onayından</strong>{' '}
          geçtikten sonra topluluk sayfaları açılır. URL’ler <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">/devuser/&lt;sayfa&gt;</code>{' '}
          biçimindedir.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Mini title="📝 Survey & Profil">
            Kullanıcı becerilerini, ilgi alanlarını ve iş arama durumunu girer (<code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">survey</code>, <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">profile-edit</code>).
          </Mini>
          <Mini title="📋 Liste & Özet">
            Onaylı üyeler birbirini görebilir (<code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">list</code>, <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">summary</code>).
          </Mini>
          <Mini title="🏆 Turnuvalar">
            Tavla, typing (klavye), vibecoding gibi etkinlik kayıtları (<code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">tavla</code>, <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">typing</code>).
          </Mini>
          <Mini title="📰 Haberler & Gelişmeler">
            Topluluk içi duyurular ve gündem (<code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">news</code>, <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">gelismeler</code>).
          </Mini>
        </div>
        <Tip>
          DevUser onaylarını <Link href="/admin/software-hub" className="font-semibold text-google-yellow hover:underline">Software Hub → Yeni Üye Onayla</Link>{' '}
          bölümünden yaparsın; tüm üye listesini ise <Link href="/admin/uyeler" className="font-semibold text-google-yellow hover:underline">Admin → Üyeler</Link>{' '}
          bölümünde görürsün.
        </Tip>
      </>
    ),
  },
  {
    key: 'admin-uyeler',
    title: 'Admin “Üyeler” Bölümü Nasıl Okunur',
    summary: 'Auth.users + devuser profillerini birlikte görüntüleme.',
    accent: 'border-google-blue',
    eyebrow: 'text-google-blue',
    href: '/admin/uyeler',
    hrefLabel: 'Üyeler Bölümüne Git',
    body: (
      <>
        <p className="mt-3 text-sm leading-7 text-white/72">
          <Link href="/admin/uyeler" className="font-semibold text-google-blue hover:underline">Admin → Üyeler</Link>{' '}
          bölümü iki veri kaynağını birlikte gösterir, böylece “kim yeni üye oldu” sorusunun tek cevabını bulursun:
        </p>
        <ul className="mt-4 space-y-2 text-sm leading-7 text-white/75">
          <Bullet><strong className="text-white">Üyeler sekmesi</strong>: Araca giriş yapan herkes (Supabase auth.users). En yeni kayıt en üstte.</Bullet>
          <Bullet><strong className="text-white">DevUser sekmesi</strong>: Sadece developer profili oluşturanlar; onay durumlarıyla.</Bullet>
          <Bullet><strong className="text-white">DevUser ✓ Var</strong> sütunu: Bir üyenin developer profili olup olmadığını gösterir.</Bullet>
          <Bullet><strong className="text-white">İstatistikler</strong>: Toplam üye, devuser profili, onay bekleyen ve profilsiz üye sayıları üstte özetlenir.</Bullet>
        </ul>
      </>
    ),
  },
];

export function UygulamaRehberiClient() {
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
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-google-green/10 via-transparent to-google-blue/10" />
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-google-green/20 blur-3xl"
          aria-hidden="true"
        />
        <div className="container relative py-12">
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-google-green">Rehber</div>
          <h1 className="mt-3 text-4xl font-black md:text-5xl">Uygulama Kullanım Kılavuzu</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/68">
            Bu sayfa <strong className="text-white">kullanıcı tarafını</strong> anlatır: üyelerin araçlara nasıl
            eriştiğini, köşe yazarlarının ve developer topluluğunun akışını. Admin bölümleri için{' '}
            <Link href="/admin/rehber" className="font-semibold text-google-green hover:underline">Admin Paneli Kullanım Kılavuzu</Link>’na bak.
          </p>

          <div className="mt-6 max-w-md">
            <label className="block">
              <span className="sr-only">Bölüm ara</span>
              <input
                type="search"
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                placeholder="Bölüm ara (ör. giriş, köşe, devuser)..."
                className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition focus:border-google-green focus-visible:ring-2 focus-visible:ring-google-green"
              />
            </label>
          </div>
        </div>
      </section>

      <div className="container space-y-6 py-10">
        <nav aria-label="Rehber dizini" className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">İçindekiler</div>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {GUIDES.map((g) => (
              <li key={g.key}>
                <a
                  href={`#${g.key}`}
                  className="block rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm transition hover:border-google-green/40 hover:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-google-green"
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
                    className="inline-flex items-center gap-2 rounded-full bg-google-green px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-600"
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
    <div className="mt-4 rounded-2xl border border-google-green/25 bg-google-green/10 px-4 py-3 text-sm leading-7 text-white/80">
      <span className="font-semibold text-google-green">İpucu: </span>
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
