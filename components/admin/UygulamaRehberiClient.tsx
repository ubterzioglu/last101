'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAdminGate } from '@/hooks/useAdminGate';
import { cn } from '@/lib/utils/cn';
import { TONE_STYLES } from '@/components/site/tones';
import type { SiteTone } from '@/components/site/tones';
import { Button } from '@/components/ui/Button';
import { AdminPageHeader } from '@/components/admin/ui/AdminPageHeader';
import { AdminFilterBar } from '@/components/admin/ui/AdminFilterBar';
import { ADMIN_CONTROL_CLASS } from '@/components/admin/ui/AdminField';
import { AdminEmptyState } from '@/components/admin/ui/AdminEmptyState';

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
  tone: SiteTone;
  href?: string;
  hrefLabel?: string;
  body: React.ReactNode;
}

const LINK_CLASS = 'font-semibold text-brand-700 hover:underline';
const CODE_CLASS = 'rounded-tile bg-band px-1.5 py-0.5 text-xs text-ink';

const GUIDES: GuideEntry[] = [
  {
    key: 'genel',
    title: 'Genel Bakış — Uygulama Nasıl Çalışır',
    summary: 'Public site, route grupları ve kullanıcı tipleri.',
    tone: 'blue',
    body: (
      <>
        <p className="mt-3 text-sm leading-7 text-muted">
          almanya101, Almanya’ya gitmek veya orada yaşamak isteyen Türkler için bir Next.js uygulamasıdır. Site dört ana
          alandan oluşur ve her alanın farklı bir kullanıcı tipi vardır:
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Mini title="🌐 Pazarlama & İçerik">
            Ana sayfa, haberler, köşe yazıları (Arkadaşın Köşesi), hizmet rehberi gibi <strong className="text-ink">herkese açık</strong> sayfalar. Giriş gerektirmez.
          </Mini>
          <Mini title="🧰 İnteraktif Araçlar">
            Maaş hesaplama, vize/banka/sigorta seçimi, planlama araçları. <strong className="text-ink">Artık üyelik (giriş) zorunlu.</strong>
          </Mini>
          <Mini title="🧑‍💻 DevUser Dashboard">
            Developer topluluğu paneli. Supabase girişi + onaylı devuser profili gerektirir.
          </Mini>
          <Mini title="✍️ Köşe Yazarı Paneli">
            Köşe yazarlarının kendi yazılarını yönettiği ayrı şifreli panel.
          </Mini>
        </div>
        <Tip>
          Kullanıcı tarafındaki tüm giriş ekranları artık <strong className="text-ink">“solda görsel + sağda form”</strong>{' '}
          tasarımındadır: üye girişi, köşe yazarı girişi ve admin girişi aynı görsel dili paylaşır.
        </Tip>
      </>
    ),
  },
  {
    key: 'uye-giris',
    title: 'Üye Girişi & Araçlar',
    summary: 'Auth zorunluluğu, /giris akışı ve araç hub’ları.',
    tone: 'blue',
    href: '/giris',
    hrefLabel: 'Üye Giriş Ekranını Aç',
    body: (
      <>
        <p className="mt-3 text-sm leading-7 text-muted">
          İnteraktif araçların tamamı artık <strong className="text-ink">giriş zorunlu</strong> çalışır. Giriş yapmamış
          bir kullanıcı bir aracı açmaya çalıştığında <code className={CODE_CLASS}>/giris</code>{' '}
          ekranına yönlendirilir; giriş sonrası kaldığı araca geri döner.
        </p>
        <ul className="mt-4 space-y-2 text-sm leading-7 text-muted">
          <Bullet><strong className="text-ink">Kayıt / Giriş</strong>: E-posta + şifre ya da <strong className="text-ink">Google ile</strong> tek tıkla. Aynı ekranda “Giriş Yap” ↔ “Üye Ol” sekmeleri var.</Bullet>
          <Bullet><strong className="text-ink">E-posta doğrulama</strong>: E-posta ile kayıtta, kullanıcıya doğrulama bağlantısı gider. Doğrulanana kadar oturum açılmaz.</Bullet>
          <Bullet><strong className="text-ink">Araç hub’ları</strong>: Tüm araçlar <Link href="/almanya-araclari" className={LINK_CLASS}>/almanya-araclari</Link> ve <Link href="/yeniarachub" className={LINK_CLASS}>/yeniarachub</Link> sayfalarında kategori bazında listelenir.</Bullet>
          <Bullet><strong className="text-ink">Araçlar</strong>: Maaş hesaplama, vize/banka/sigorta seçimi, para transferi, vatandaşlık testi, StepStone karşılaştırma ve 10+ planlama aracı (yolunu seç, şehir uyumu, ilk 90 gün, iş bulma olasılığı vb.).</Bullet>
        </ul>
        <Tip>
          Yeni üye olan herkesi <Link href="/admin/uyeler" className={LINK_CLASS}>Admin → Üyeler</Link> bölümünden görebilirsin. Bu, araca giriş yapan ama henüz devuser profili oluşturmamış kişileri de kapsar.
        </Tip>
      </>
    ),
  },
  {
    key: 'kose-yazari',
    title: 'Köşe Yazarı Paneli — Arkadaşın Köşesi',
    summary: 'Yazarların ayrı giriş + yazı/foto yükleme akışı.',
    tone: 'green',
    href: '/admin/yazi-dizisi',
    hrefLabel: 'Yazar Yönetimine Git',
    body: (
      <>
        <p className="mt-3 text-sm leading-7 text-muted">
          Köşe yazarları, ana üyelik sisteminden <strong className="text-ink">bağımsız</strong> çalışır. Her yazarın
          kendi şifresi ve kendi paneli vardır. Yazar yönetimini (yeni yazar ekleme, şifre) admin{' '}
          <Link href="/admin/yazi-dizisi" className={LINK_CLASS}>Arkadaşın Köşesi</Link>{' '}
          bölümünden yaparsın.
        </p>
        <ul className="mt-4 space-y-2 text-sm leading-7 text-muted">
          <Bullet><strong className="text-ink">1. Giriş</strong>: Yazar <code className={CODE_CLASS}>/authors/&lt;yazar&gt;</code> adresinden, admin’in verdiği şifreyle girer.</Bullet>
          <Bullet><strong className="text-ink">2. Panel</strong>: <code className={CODE_CLASS}>/authors/&lt;yazar&gt;/panel</code> — profilini (ad, bio, profil görseli) düzenler.</Bullet>
          <Bullet><strong className="text-ink">3. Yazı yaz</strong>: Başlık, özet, kapak görseli, okuma süresi ve Markdown içerik. <strong className="text-ink">Canlı önizleme</strong> ile yazarken sonucu görür.</Bullet>
          <Bullet><strong className="text-ink">4. Yayınla</strong>: Taslak olarak kaydeder veya doğrudan yayına alır. Yayındaki yazı <Link href="/yazi-dizisi" className={LINK_CLASS}>/yazi-dizisi</Link> ve yazarın kendi sayfasında (<code className={CODE_CLASS}>/&lt;yazar&gt;</code>) görünür.</Bullet>
        </ul>
        <Warning>
          Görsel yükleme JPG/PNG/WEBP/GIF ve <strong className="text-ink">en fazla 5 MB</strong> ile sınırlıdır. Yazar
          şifresini admin göremez, yalnızca sıfırlayabilir.
        </Warning>
      </>
    ),
  },
  {
    key: 'devuser',
    title: 'DevUser Dashboard — Developer Topluluğu',
    summary: 'Profil, survey, turnuvalar ve topluluk araçları.',
    tone: 'yellow',
    href: '/admin/software-hub',
    hrefLabel: 'Software Hub’a Git',
    body: (
      <>
        <p className="mt-3 text-sm leading-7 text-muted">
          DevUser dashboard, developer topluluğunun kendi alanıdır. Kullanıcı önce Supabase ile giriş yapar, sonra detaylı
          bir <strong className="text-ink">developer profili</strong> oluşturur. Profil <strong className="text-ink">admin onayından</strong>{' '}
          geçtikten sonra topluluk sayfaları açılır. URL’ler <code className={CODE_CLASS}>/devuser/&lt;sayfa&gt;</code>{' '}
          biçimindedir.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Mini title="📝 Survey & Profil">
            Kullanıcı becerilerini, ilgi alanlarını ve iş arama durumunu girer (<code className={CODE_CLASS}>survey</code>, <code className={CODE_CLASS}>profile-edit</code>).
          </Mini>
          <Mini title="📋 Liste & Özet">
            Onaylı üyeler birbirini görebilir (<code className={CODE_CLASS}>list</code>, <code className={CODE_CLASS}>summary</code>).
          </Mini>
          <Mini title="🏆 Turnuvalar">
            Tavla, typing (klavye), vibecoding gibi etkinlik kayıtları (<code className={CODE_CLASS}>tavla</code>, <code className={CODE_CLASS}>typing</code>).
          </Mini>
          <Mini title="📰 Haberler & Gelişmeler">
            Topluluk içi duyurular ve gündem (<code className={CODE_CLASS}>news</code>, <code className={CODE_CLASS}>gelismeler</code>).
          </Mini>
        </div>
        <Tip>
          DevUser onaylarını <Link href="/admin/software-hub" className={LINK_CLASS}>Software Hub → Yeni Üye Onayla</Link>{' '}
          bölümünden yaparsın; tüm üye listesini ise <Link href="/admin/uyeler" className={LINK_CLASS}>Admin → Üyeler</Link>{' '}
          bölümünde görürsün.
        </Tip>
      </>
    ),
  },
  {
    key: 'admin-uyeler',
    title: 'Admin “Üyeler” Bölümü Nasıl Okunur',
    summary: 'Auth.users + devuser profillerini birlikte görüntüleme.',
    tone: 'blue',
    href: '/admin/uyeler',
    hrefLabel: 'Üyeler Bölümüne Git',
    body: (
      <>
        <p className="mt-3 text-sm leading-7 text-muted">
          <Link href="/admin/uyeler" className={LINK_CLASS}>Admin → Üyeler</Link>{' '}
          bölümü iki veri kaynağını birlikte gösterir, böylece “kim yeni üye oldu” sorusunun tek cevabını bulursun:
        </p>
        <ul className="mt-4 space-y-2 text-sm leading-7 text-muted">
          <Bullet><strong className="text-ink">Üyeler sekmesi</strong>: Araca giriş yapan herkes (Supabase auth.users). En yeni kayıt en üstte.</Bullet>
          <Bullet><strong className="text-ink">DevUser sekmesi</strong>: Sadece developer profili oluşturanlar; onay durumlarıyla.</Bullet>
          <Bullet><strong className="text-ink">DevUser ✓ Var</strong> sütunu: Bir üyenin developer profili olup olmadığını gösterir.</Bullet>
          <Bullet><strong className="text-ink">İstatistikler</strong>: Toplam üye, devuser profili, onay bekleyen ve profilsiz üye sayıları üstte özetlenir.</Bullet>
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
      <div className="min-h-screen bg-page text-ink">
        <div className="px-4 py-20 text-center text-sm text-muted">Admin oturumu doğrulanıyor...</div>
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
      <AdminPageHeader
        eyebrow="Rehber"
        title="Kullanım Kılavuzu"
        description="Bu sekme kullanıcı tarafını anlatır: üyelerin araçlara nasıl eriştiğini, köşe yazarlarının ve developer topluluğunun akışını. Admin bölümleri için yukarıdaki Admin Paneli sekmesine geç."
      />

      <div className="space-y-6 px-4 py-8 sm:px-6 lg:px-9">
        <div className="flex flex-wrap gap-x-6 border-b border-line">
          <Link
            href="/admin/rehber"
            className="-mb-px inline-flex min-h-[44px] items-center border-b-2 border-transparent px-1 text-sm font-semibold text-muted transition-colors hover:text-ink"
          >
            Admin Paneli
          </Link>
          <span
            aria-current="page"
            className="-mb-px inline-flex min-h-[44px] items-center border-b-2 border-brand-700 px-1 text-sm font-semibold text-brand-800"
          >
            Uygulama
          </span>
        </div>

        <AdminFilterBar>
          <label className="block w-full max-w-md">
            <span className="sr-only">Bölüm ara</span>
            <input
              type="search"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              placeholder="Bölüm ara (ör. giriş, köşe, devuser)..."
              className={ADMIN_CONTROL_CLASS}
            />
          </label>
        </AdminFilterBar>

        <nav aria-label="Rehber dizini" className="rounded-card border border-line bg-white p-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted">İçindekiler</div>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {GUIDES.map((g) => (
              <li key={g.key}>
                <a
                  href={`#${g.key}`}
                  className="block rounded-btn border border-line bg-white px-4 py-3 text-sm transition-colors hover:border-ink/30 hover:bg-page"
                >
                  <span className="block font-semibold text-ink">{g.title}</span>
                  <span className="mt-1 block text-[12px] leading-5 text-muted">{g.summary}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {visible.length === 0 ? (
          <AdminEmptyState title={`“${filter}” için bölüm bulunamadı.`} />
        ) : (
          visible.map((g) => (
            <GuideCard key={g.key} id={g.key} tone={g.tone}>
              <div className={cn('text-xs font-semibold uppercase tracking-wider', TONE_STYLES[g.tone].text)}>
                {g.summary}
              </div>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-ink">{g.title}</h2>
              {g.body}
              {g.href ? (
                <div className="mt-5">
                  <Button href={g.href}>
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

function GuideCard({ children, tone, id }: { children: React.ReactNode; tone: SiteTone; id?: string }) {
  return (
    <section
      id={id}
      className="relative scroll-mt-24 overflow-hidden rounded-card border border-line bg-white p-6 pl-7"
    >
      <span aria-hidden="true" className={cn('absolute inset-y-0 left-0 w-1', TONE_STYLES[tone].solid)} />
      {children}
    </section>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="mt-2.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-muted" aria-hidden="true" />
      <span>{children}</span>
    </li>
  );
}

function Mini({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-card bg-band p-4">
      <div className="text-sm font-semibold text-ink">{title}</div>
      <p className="mt-2 text-sm leading-7 text-muted">{children}</p>
    </div>
  );
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        'mt-4 rounded-card border px-4 py-3 text-sm leading-7 text-muted',
        TONE_STYLES.green.wash,
        TONE_STYLES.green.border,
      )}
    >
      <span className={cn('font-semibold', TONE_STYLES.green.text)}>İpucu: </span>
      {children}
    </div>
  );
}

function Warning({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        'mt-4 rounded-card border px-4 py-3 text-sm leading-7 text-muted',
        TONE_STYLES.red.wash,
        TONE_STYLES.red.border,
      )}
    >
      <span className={cn('font-semibold', TONE_STYLES.red.text)}>Önemli: </span>
      {children}
    </div>
  );
}
