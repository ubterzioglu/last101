'use client';

import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin/ui/AdminPageHeader';
import { TONE_STYLES } from '@/components/site/tones';
import type { SiteTone } from '@/components/site/tones';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAdminGate } from '@/hooks/useAdminGate';
import { cn } from '@/lib/utils/cn';

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
      <div className="min-h-screen bg-page text-ink">
        <div className="px-4 py-20 text-center text-sm text-muted sm:px-6 lg:px-9">Admin oturumu doğrulanıyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page text-ink">
      <AdminPageHeader
        eyebrow="Rehber"
        title="Otomatik Haber RSS Kılavuzu"
        actions={
          <>
            <Button href="/admin/haberler?tab=kaynaklar">Kaynak Yönetimine Git</Button>
            <Button href="/admin/haberler?tab=pipeline" variant="outline">
              Pipeline Ekranına Git
            </Button>
          </>
        }
      />
      <div className="px-4 pt-6 sm:px-6 lg:px-9">
        <p className="max-w-2xl text-sm leading-7 text-muted">
          Haber pipeline&apos;ı, ücretsiz RSS kaynaklarından gün içinde haber adayı toplar, tekrarları eler ve
          <strong className="text-ink"> hiçbir haberi otomatik yayınlamaz</strong>. Son karar her zaman senin.
          Aşağıdaki adımlar, sistemi günlük olarak nasıl kullanacağını sırayla anlatır.
        </p>
      </div>

      <div className="space-y-6 px-4 py-10 sm:px-6 lg:px-9">
        <GuideCard tone="brand">
          <Eyebrow tone="brand">Nasıl çalışır?</Eyebrow>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-ink">Akışın özeti</h2>
          <p className="mt-3 text-sm leading-7 text-muted">
            Sistem yedi aşamada çalışır. Otomatik olan kısım yalnızca <strong className="text-ink">toplama ve kuyruğa düşürme</strong>;
            yayınlama tamamen senin kontrolünde kalır.
          </p>
          <ol className="mt-4 space-y-3 text-sm leading-7 text-muted">
            <Step n={1}>Tanımlı RSS / MRSS kaynakları belirli aralıklarla otomatik taranır (Supabase Cron).</Step>
            <Step n={2}>Gelen içerikler önce ham veri tablosuna kaydedilir.</Step>
            <Step n={3}>Aynı haber URL ve hash kontrolüyle elenir; tekrarlar kuyruğa girmez.</Step>
            <Step n={4}>Opsiyonel AI (Gemini) yalnızca Türkçe taslak başlık, özet, kategori ve önem puanı üretir.</Step>
            <Step n={5}>Her aday <code className="rounded bg-band px-1.5 py-0.5 text-xs text-ink">pending_review</code> durumuyla inceleme kuyruğuna düşer.</Step>
            <Step n={6}>Sen kuyruktaki haberi düzeltir, görselini yükler ve yayınlarsın.</Step>
            <Step n={7}>Public sayfada yalnızca senin onayladığın özgün Türkçe içerik görünür.</Step>
          </ol>
        </GuideCard>

        <GuideCard tone="green">
          <Eyebrow tone="green">Adım 1</Eyebrow>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-ink">Kaynak ekle ve test et</h2>
          <p className="mt-3 text-sm leading-7 text-muted">
            <Link href="/admin/haberler?tab=kaynaklar" className="font-semibold text-brand-700 hover:underline">
              Haber Yönetimi → Kaynaklar
            </Link>{' '}
            sekmesinden yeni bir RSS kaynağı tanımlarsın.
          </p>
          <ul className="mt-4 space-y-2 text-sm leading-7 text-muted">
            <Bullet><strong className="text-ink">Kaynak Adı</strong> ve <strong className="text-ink">Feed URL</strong>: RSS/MRSS adresini gir (ör. tagesschau Inland RSS).</Bullet>
            <Bullet><strong className="text-ink">Tür</strong>: <code className="rounded bg-band px-1.5 py-0.5 text-xs text-ink">rss</code>, <code className="rounded bg-band px-1.5 py-0.5 text-xs text-ink">mrss</code>, <code className="rounded bg-band px-1.5 py-0.5 text-xs text-ink">api</code> veya <code className="rounded bg-band px-1.5 py-0.5 text-xs text-ink">manual</code> seç.</Bullet>
            <Bullet><strong className="text-ink">Kategori</strong>: Almanya / Türkiye / Avrupa / Dünya arasından varsayılanı seç.</Bullet>
            <Bullet><strong className="text-ink">Usage Mode</strong>: V1&apos;de güvenli varsayılan <code className="rounded bg-band px-1.5 py-0.5 text-xs text-ink">signal_only</code> — kaynak yalnızca admin kuyruğuna sinyal taşır, otomatik içerik yayınlanmaz.</Bullet>
            <Bullet><strong className="text-ink">Öncelik</strong>: Resmî kurumlar (BAMF, Bundesregierung) için yüksek; dünya gündemi için düşük.</Bullet>
            <Bullet><strong className="text-ink">Fetch Limit</strong>: Her çalışmada o kaynaktan çekilecek en fazla kayıt sayısı (varsayılan 10).</Bullet>
          </ul>
          <Tip>
            Kaydettikten sonra kaynak satırındaki <strong className="text-ink">Test Et</strong> butonuyla feed&apos;in çalışıp
            çalışmadığını ve ilk kaydı gör; <strong className="text-ink">Şimdi Çek</strong> ile sadece o kaynağı tek seferlik çalıştır.
          </Tip>
        </GuideCard>

        <GuideCard tone="brand">
          <Eyebrow tone="brand">Adım 2</Eyebrow>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-ink">Pipeline&apos;ı çalıştır (otomatik + manuel)</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Mini title="Otomatik (Cron)">
              Supabase Cron, <code className="rounded bg-band px-1.5 py-0.5 text-xs text-ink">news-ingest</code> Edge Function&apos;ını
              her gün <code className="rounded bg-band px-1.5 py-0.5 text-xs text-ink">0 6 * * *</code> (06:00 UTC ≈ Almanya saatiyle
              07:00–08:00) tetikler. Bunun için ekstra bir şey yapman gerekmez — kaynaklar aktifse adaylar her sabah kuyruğa düşer.
            </Mini>
            <Mini title="Manuel">
              <Link href="/admin/haberler?tab=pipeline" className="font-semibold text-brand-700 hover:underline">
                Pipeline
              </Link>{' '}
              sekmesinde <strong className="text-ink">&ldquo;Pipeline&apos;ı Şimdi Çalıştır&rdquo;</strong> butonu aynı fonksiyonu
              anında tetikler. Açılır menüden tek bir kaynağı ya da &ldquo;Tüm aktif kaynaklar&rdquo;ı seçebilirsin.
            </Mini>
          </div>
          <Tip>
            Çalışma bitince aynı sekmedeki <strong className="text-ink">Son Çalışmalar</strong> tablosunda tetikleyici tipi
            (<code className="rounded bg-band px-1.5 py-0.5 text-xs text-ink">cron</code> / <code className="rounded bg-band px-1.5 py-0.5 text-xs text-ink">manual</code>),
            durum, yeni aday, duplicate ve hata sayılarını görürsün. Bir kaynak hata verse bile pipeline durmaz; diğer kaynaklar işlenir.
          </Tip>
        </GuideCard>

        <GuideCard tone="yellow">
          <Eyebrow tone="yellow">Adım 3</Eyebrow>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-ink">Kuyruğu incele ve yayınla</h2>
          <p className="mt-3 text-sm leading-7 text-muted">
            Toplanan adaylar{' '}
            <Link href="/admin/haberler?tab=kuyruk" className="font-semibold text-brand-700 hover:underline">
              Haber Yönetimi → Kuyruk
            </Link>{' '}
            sekmesinde <code className="rounded bg-band px-1.5 py-0.5 text-xs text-ink">İnceleme</code> durumunda listelenir.
          </p>
          <ul className="mt-4 space-y-2 text-sm leading-7 text-muted">
            <Bullet>Durum, kategori veya metin araması ile kuyruğu filtrele.</Bullet>
            <Bullet><strong className="text-ink">Düzelt</strong> ile editöre gir: başlığı, özeti ve metni Türkçeleştir, kapak görselini yükle, kaynak bağlantısını doğrula.</Bullet>
            <Bullet><strong className="text-ink">Yayınla</strong> ile haberi public sayfaya çıkar; <strong className="text-ink">Hero Yap</strong> ile üst karta taşı.</Bullet>
            <Bullet>Uygun olmayan adayları <strong className="text-ink">Reddet</strong>; eski içerikleri arşivle. İşlemlerin tamamı denetim kaydına yazılır.</Bullet>
          </ul>
          <Warning>
            Hiçbir haber otomatik yayınlanmaz. Pipeline yalnızca aday üretir; public sayfada görünmesi için senin
            <strong className="text-ink"> Yayınla</strong> demen gerekir.
          </Warning>
        </GuideCard>

        <GuideCard tone="orange">
          <Eyebrow tone="orange">Adım 4</Eyebrow>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-ink">Ayarlarla davranışı yönet</h2>
          <p className="mt-3 text-sm leading-7 text-muted">
            Kod değiştirmeden{' '}
            <Link href="/admin/haberler?tab=ayarlar" className="font-semibold text-brand-700 hover:underline">
              Haber Yönetimi → Ayarlar
            </Link>{' '}
            sekmesinden pipeline davranışını güncelleyebilirsin:
          </p>
          <ul className="mt-4 space-y-2 text-sm leading-7 text-muted">
            <Bullet><strong className="text-ink">Pipeline aktif</strong>: Kapatırsan otomatik ve manuel çalışmalar aday üretmez.</Bullet>
            <Bullet><strong className="text-ink">AI aktif / AI günlük limit</strong>: Gemini taslaklarını aç/kapat ve günlük çağrı limitini belirle (varsayılan 10).</Bullet>
            <Bullet><strong className="text-ink">Kaynak başına max aday</strong> ve <strong className="text-ink">retention günleri</strong>: Ham veri, run log ve reddedilen haberlerin saklanma süresi.</Bullet>
            <Bullet><strong className="text-ink">Hariç / Yüksek öncelikli kelimeler</strong>: Filtrelemeyi ve önceliklendirmeyi yönlendir.</Bullet>
          </ul>
        </GuideCard>

        <GuideCard tone="red">
          <Eyebrow tone="red">Sorun giderme</Eyebrow>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-ink">Bir şeyler ters giderse</h2>
          <ul className="mt-4 space-y-2 text-sm leading-7 text-muted">
            <Bullet><strong className="text-ink">Kaynak hata veriyor</strong>: Kaynaklar tablosundaki &ldquo;Son hata&rdquo; sütununu kontrol et, &ldquo;Test Et&rdquo; ile feed&apos;i doğrula.</Bullet>
            <Bullet><strong className="text-ink">Kuyruğa yeni aday düşmüyor</strong>: Ayarlar&apos;da Pipeline aktif mi, kaynak aktif mi ve Pipeline sekmesinde son çalışmanın durumu &ldquo;success&rdquo; mı bak.</Bullet>
            <Bullet><strong className="text-ink">Pipeline tetiklenmiyor</strong>: <code className="rounded bg-band px-1.5 py-0.5 text-xs text-ink">NEWS_PIPELINE_SECRET</code> ve <code className="rounded bg-band px-1.5 py-0.5 text-xs text-ink">SUPABASE_SERVICE_ROLE_KEY</code> tanımlı olmalı.</Bullet>
            <Bullet><strong className="text-ink">Aynı haber tekrar ediyor</strong>: Duplicate kontrolü URL + SHA-256 hash ile çalışır; çok benzer başlıklar &ldquo;olası tekrar&rdquo; olarak kuyruğa düşebilir.</Bullet>
          </ul>
          <p className="mt-4 text-xs leading-6 text-muted">
            Tam teknik dökümantasyon için repo kökündeki <code className="rounded bg-band px-1.5 py-0.5 text-xs text-ink">news.md</code> dosyasına bakabilirsin.
          </p>
        </GuideCard>
      </div>
    </div>
  );
}

type GuideTone = SiteTone | 'brand';

function toneText(tone: GuideTone): string {
  return tone === 'brand' ? 'text-brand-700' : TONE_STYLES[tone].text;
}

function toneBar(tone: GuideTone): string {
  return tone === 'brand' ? 'bg-brand-600' : TONE_STYLES[tone].solid;
}

function GuideCard({ children, tone }: { children: React.ReactNode; tone: GuideTone }) {
  return (
    <Card className="relative overflow-hidden pl-8">
      <span className={cn('absolute inset-y-0 left-0 w-1', toneBar(tone))} aria-hidden="true" />
      {children}
    </Card>
  );
}

function Eyebrow({ children, tone }: { children: React.ReactNode; tone: GuideTone }) {
  return <div className={cn('text-xs font-bold uppercase tracking-[0.13em]', toneText(tone))}>{children}</div>;
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-800">
        {n}
      </span>
      <span>{children}</span>
    </li>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" aria-hidden="true" />
      <span>{children}</span>
    </li>
  );
}

function Mini({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-card border border-line bg-band p-4">
      <div className="text-sm font-semibold text-ink">{title}</div>
      <p className="mt-2 text-sm leading-7 text-muted">{children}</p>
    </div>
  );
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 rounded-btn border border-brand-700/20 bg-brand-50 px-4 py-3 text-sm leading-7 text-ink">
      <span className="font-semibold text-brand-800">İpucu: </span>
      {children}
    </div>
  );
}

function Warning({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        'mt-4 rounded-btn border px-4 py-3 text-sm leading-7 text-ink',
        TONE_STYLES.red.tint,
        TONE_STYLES.red.border,
      )}
    >
      <span className={cn('font-semibold', TONE_STYLES.red.text)}>Önemli: </span>
      {children}
    </div>
  );
}
