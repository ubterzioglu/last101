'use client';

import Link from 'next/link';
import { useAdminGate } from '@/hooks/useAdminGate';

/**
 * In-app operator guide for the automatic news RSS pipeline.
 *
 * This is a read-only documentation page rendered inside the admin panel so the
 * editor can learn how the RSS → pipeline → review queue → publish flow works
 * without leaving the dashboard. It links directly to the relevant Haber
 * Yönetimi tabs so the reader can jump from a step to the matching screen.
 */
export function NewsGuideAdminClient() {
  const gateStatus = useAdminGate();

  if (gateStatus !== 'authed') {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container py-20 text-center text-sm text-white/60">Admin oturumu doğrulanıyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-google-yellow/10 via-transparent to-google-blue/10" />
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-google-yellow/20 blur-3xl"
          aria-hidden="true"
        />
        <div className="container relative py-12">
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-google-yellow">Rehber</div>
          <h1 className="mt-3 text-4xl font-black md:text-5xl">Otomatik Haber RSS Kılavuzu</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/68">
            Haber pipeline&apos;ı, ücretsiz RSS kaynaklarından gün içinde haber adayı toplar, tekrarları eler ve
            <strong className="text-white"> hiçbir haberi otomatik yayınlamaz</strong>. Son karar her zaman senin.
            Aşağıdaki adımlar, sistemi günlük olarak nasıl kullanacağını sırayla anlatır.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/admin/haberler?tab=kaynaklar"
              className="rounded-full bg-google-blue px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              Kaynak Yönetimine Git
            </Link>
            <Link
              href="/admin/haberler?tab=pipeline"
              className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/[0.1]"
            >
              Pipeline Ekranına Git
            </Link>
          </div>
        </div>
      </section>

      <div className="container space-y-6 py-10">
        <Card accent="border-google-blue">
          <Eyebrow color="text-google-blue">Nasıl çalışır?</Eyebrow>
          <h2 className="mt-2 text-2xl font-bold">Akışın özeti</h2>
          <p className="mt-3 text-sm leading-7 text-white/72">
            Sistem yedi aşamada çalışır. Otomatik olan kısım yalnızca <strong className="text-white">toplama ve kuyruğa düşürme</strong>;
            yayınlama tamamen senin kontrolünde kalır.
          </p>
          <ol className="mt-4 space-y-3 text-sm leading-7 text-white/75">
            <Step n={1}>Tanımlı RSS / MRSS kaynakları belirli aralıklarla otomatik taranır (Supabase Cron).</Step>
            <Step n={2}>Gelen içerikler önce ham veri tablosuna kaydedilir.</Step>
            <Step n={3}>Aynı haber URL ve hash kontrolüyle elenir; tekrarlar kuyruğa girmez.</Step>
            <Step n={4}>Opsiyonel AI (Gemini) yalnızca Türkçe taslak başlık, özet, kategori ve önem puanı üretir.</Step>
            <Step n={5}>Her aday <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">pending_review</code> durumuyla inceleme kuyruğuna düşer.</Step>
            <Step n={6}>Sen kuyruktaki haberi düzeltir, görselini yükler ve yayınlarsın.</Step>
            <Step n={7}>Public sayfada yalnızca senin onayladığın özgün Türkçe içerik görünür.</Step>
          </ol>
        </Card>

        <Card accent="border-google-green">
          <Eyebrow color="text-google-green">Adım 1</Eyebrow>
          <h2 className="mt-2 text-2xl font-bold">Kaynak ekle ve test et</h2>
          <p className="mt-3 text-sm leading-7 text-white/72">
            <Link href="/admin/haberler?tab=kaynaklar" className="font-semibold text-google-blue hover:underline">
              Haber Yönetimi → Kaynaklar
            </Link>{' '}
            sekmesinden yeni bir RSS kaynağı tanımlarsın.
          </p>
          <ul className="mt-4 space-y-2 text-sm leading-7 text-white/75">
            <Bullet><strong className="text-white">Kaynak Adı</strong> ve <strong className="text-white">Feed URL</strong>: RSS/MRSS adresini gir (ör. tagesschau Inland RSS).</Bullet>
            <Bullet><strong className="text-white">Tür</strong>: <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">rss</code>, <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">mrss</code>, <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">api</code> veya <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">manual</code> seç.</Bullet>
            <Bullet><strong className="text-white">Kategori</strong>: Almanya / Türkiye / Avrupa / Dünya arasından varsayılanı seç.</Bullet>
            <Bullet><strong className="text-white">Usage Mode</strong>: V1&apos;de güvenli varsayılan <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">signal_only</code> — kaynak yalnızca admin kuyruğuna sinyal taşır, otomatik içerik yayınlanmaz.</Bullet>
            <Bullet><strong className="text-white">Öncelik</strong>: Resmî kurumlar (BAMF, Bundesregierung) için yüksek; dünya gündemi için düşük.</Bullet>
            <Bullet><strong className="text-white">Fetch Limit</strong>: Her çalışmada o kaynaktan çekilecek en fazla kayıt sayısı (varsayılan 10).</Bullet>
          </ul>
          <Tip>
            Kaydettikten sonra kaynak satırındaki <strong className="text-white">Test Et</strong> butonuyla feed&apos;in çalışıp
            çalışmadığını ve ilk kaydı gör; <strong className="text-white">Şimdi Çek</strong> ile sadece o kaynağı tek seferlik çalıştır.
          </Tip>
        </Card>

        <Card accent="border-google-blue">
          <Eyebrow color="text-google-blue">Adım 2</Eyebrow>
          <h2 className="mt-2 text-2xl font-bold">Pipeline&apos;ı çalıştır (otomatik + manuel)</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Mini title="Otomatik (Cron)">
              Supabase Cron, <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">news-ingest</code> Edge Function&apos;ını
              her gün <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">0 6 * * *</code> (06:00 UTC ≈ Almanya saatiyle
              07:00–08:00) tetikler. Bunun için ekstra bir şey yapman gerekmez — kaynaklar aktifse adaylar her sabah kuyruğa düşer.
            </Mini>
            <Mini title="Manuel">
              <Link href="/admin/haberler?tab=pipeline" className="font-semibold text-google-blue hover:underline">
                Pipeline
              </Link>{' '}
              sekmesinde <strong className="text-white">&ldquo;Pipeline&apos;ı Şimdi Çalıştır&rdquo;</strong> butonu aynı fonksiyonu
              anında tetikler. Açılır menüden tek bir kaynağı ya da &ldquo;Tüm aktif kaynaklar&rdquo;ı seçebilirsin.
            </Mini>
          </div>
          <Tip>
            Çalışma bitince aynı sekmedeki <strong className="text-white">Son Çalışmalar</strong> tablosunda tetikleyici tipi
            (<code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">cron</code> / <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">manual</code>),
            durum, yeni aday, duplicate ve hata sayılarını görürsün. Bir kaynak hata verse bile pipeline durmaz; diğer kaynaklar işlenir.
          </Tip>
        </Card>

        <Card accent="border-google-yellow">
          <Eyebrow color="text-google-yellow">Adım 3</Eyebrow>
          <h2 className="mt-2 text-2xl font-bold">Kuyruğu incele ve yayınla</h2>
          <p className="mt-3 text-sm leading-7 text-white/72">
            Toplanan adaylar{' '}
            <Link href="/admin/haberler?tab=kuyruk" className="font-semibold text-google-blue hover:underline">
              Haber Yönetimi → Kuyruk
            </Link>{' '}
            sekmesinde <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">İnceleme</code> durumunda listelenir.
          </p>
          <ul className="mt-4 space-y-2 text-sm leading-7 text-white/75">
            <Bullet>Durum, kategori veya metin araması ile kuyruğu filtrele.</Bullet>
            <Bullet><strong className="text-white">Düzelt</strong> ile editöre gir: başlığı, özeti ve metni Türkçeleştir, kapak görselini yükle, kaynak bağlantısını doğrula.</Bullet>
            <Bullet><strong className="text-white">Yayınla</strong> ile haberi public sayfaya çıkar; <strong className="text-white">Hero Yap</strong> ile üst karta taşı.</Bullet>
            <Bullet>Uygun olmayan adayları <strong className="text-white">Reddet</strong>; eski içerikleri arşivle. İşlemlerin tamamı denetim kaydına yazılır.</Bullet>
          </ul>
          <Warning>
            Hiçbir haber otomatik yayınlanmaz. Pipeline yalnızca aday üretir; public sayfada görünmesi için senin
            <strong className="text-white"> Yayınla</strong> demen gerekir.
          </Warning>
        </Card>

        <Card accent="border-google-orange">
          <Eyebrow color="text-google-orange">Adım 4</Eyebrow>
          <h2 className="mt-2 text-2xl font-bold">Ayarlarla davranışı yönet</h2>
          <p className="mt-3 text-sm leading-7 text-white/72">
            Kod değiştirmeden{' '}
            <Link href="/admin/haberler?tab=ayarlar" className="font-semibold text-google-blue hover:underline">
              Haber Yönetimi → Ayarlar
            </Link>{' '}
            sekmesinden pipeline davranışını güncelleyebilirsin:
          </p>
          <ul className="mt-4 space-y-2 text-sm leading-7 text-white/75">
            <Bullet><strong className="text-white">Pipeline aktif</strong>: Kapatırsan otomatik ve manuel çalışmalar aday üretmez.</Bullet>
            <Bullet><strong className="text-white">AI aktif / AI günlük limit</strong>: Gemini taslaklarını aç/kapat ve günlük çağrı limitini belirle (varsayılan 10).</Bullet>
            <Bullet><strong className="text-white">Kaynak başına max aday</strong> ve <strong className="text-white">retention günleri</strong>: Ham veri, run log ve reddedilen haberlerin saklanma süresi.</Bullet>
            <Bullet><strong className="text-white">Hariç / Yüksek öncelikli kelimeler</strong>: Filtrelemeyi ve önceliklendirmeyi yönlendir.</Bullet>
          </ul>
        </Card>

        <Card accent="border-google-red">
          <Eyebrow color="text-google-red">Sorun giderme</Eyebrow>
          <h2 className="mt-2 text-2xl font-bold">Bir şeyler ters giderse</h2>
          <ul className="mt-4 space-y-2 text-sm leading-7 text-white/75">
            <Bullet><strong className="text-white">Kaynak hata veriyor</strong>: Kaynaklar tablosundaki &ldquo;Son hata&rdquo; sütununu kontrol et, &ldquo;Test Et&rdquo; ile feed&apos;i doğrula.</Bullet>
            <Bullet><strong className="text-white">Kuyruğa yeni aday düşmüyor</strong>: Ayarlar&apos;da Pipeline aktif mi, kaynak aktif mi ve Pipeline sekmesinde son çalışmanın durumu &ldquo;success&rdquo; mı bak.</Bullet>
            <Bullet><strong className="text-white">Pipeline tetiklenmiyor</strong>: <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">NEWS_PIPELINE_SECRET</code> ve <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">SUPABASE_SERVICE_ROLE_KEY</code> tanımlı olmalı.</Bullet>
            <Bullet><strong className="text-white">Aynı haber tekrar ediyor</strong>: Duplicate kontrolü URL + SHA-256 hash ile çalışır; çok benzer başlıklar &ldquo;olası tekrar&rdquo; olarak kuyruğa düşebilir.</Bullet>
          </ul>
          <p className="mt-4 text-xs leading-6 text-white/45">
            Tam teknik dökümantasyon için repo kökündeki <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">news.md</code> dosyasına bakabilirsin.
          </p>
        </Card>
      </div>
    </div>
  );
}

function Card({ children, accent }: { children: React.ReactNode; accent: string }) {
  return (
    <section className={`rounded-[1.6rem] border-l-4 ${accent} border-y border-r border-white/10 bg-white/[0.03] p-6`}>
      {children}
    </section>
  );
}

function Eyebrow({ children, color }: { children: React.ReactNode; color: string }) {
  return <div className={`text-xs font-semibold uppercase tracking-[0.18em] ${color}`}>{children}</div>;
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-google-blue/20 text-xs font-bold text-google-blue">
        {n}
      </span>
      <span>{children}</span>
    </li>
  );
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
