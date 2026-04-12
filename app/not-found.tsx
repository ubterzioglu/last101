import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <section className="relative isolate overflow-hidden bg-[#f6f3ea] text-slate-900">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,_rgba(66,133,244,0.18),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(52,168,83,0.18),_transparent_32%),linear-gradient(135deg,_#f6f3ea_0%,_#fffdf8_45%,_#f3efe4_100%)]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-40 bg-[linear-gradient(90deg,_rgba(66,133,244,0.12),_rgba(251,188,5,0.14),_rgba(234,67,53,0.12),_rgba(52,168,83,0.12))] blur-3xl" />

      <div className="container flex min-h-[calc(100vh-10rem)] items-center py-16 md:py-24">
        <div className="grid w-full gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,420px)] lg:items-end">
          <div className="relative overflow-hidden rounded-[2rem] border border-black/10 bg-white/80 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur md:p-12">
            <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-[2rem] bg-google-blue/10" />
            <div className="absolute bottom-0 left-0 h-28 w-28 rounded-tr-[2rem] bg-google-yellow/10" />

            <div className="relative flex flex-col gap-8">
              <div className="inline-flex w-fit items-center gap-3 rounded-full border border-black/10 bg-white/90 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-google-red" />
                Bu bağlantı şu an bizde yok
              </div>

              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
                    <Image
                      src="/almanya101.png"
                      alt="almanya101 logosu"
                      fill
                      className="object-contain p-2"
                      priority
                    />
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.28em] text-slate-500">
                      almanya101
                    </p>
                    <p className="text-sm text-slate-600">
                      Almanya yolculuğunda güvenilir rehber
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-end gap-4">
                  <span className="text-7xl font-black leading-none text-google-blue md:text-8xl">
                    404
                  </span>
                  <div className="max-w-sm pb-2 text-sm uppercase tracking-[0.24em] text-slate-500">
                    yanlış rota, doğru rehber
                  </div>
                </div>

                <div className="max-w-2xl space-y-4">
                  <h1 className="text-balance text-4xl font-black tracking-[-0.04em] text-slate-950 md:text-6xl">
                    Aradığınız sayfa bulunamadı.
                  </h1>
                  <p className="max-w-xl text-lg leading-8 text-slate-600 md:text-xl">
                    Bağlantı eski olabilir, sayfa taşınmış olabilir ya da adres eksik yazılmış olabilir.
                    İsterseniz ana sayfaya dönün ya da aşağıdaki hızlı rotalardan devam edin.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button href="/" asChild size="lg" className="rounded-full px-7">
                  Ana sayfaya dön
                </Button>
                <Button href="/hizmet-rehberi" asChild variant="secondary" size="lg" className="rounded-full px-7">
                  Hizmet rehberine git
                </Button>
              </div>

              <div className="grid gap-3 pt-4 md:grid-cols-3">
                <Link
                  href="/belgeler"
                  className="group rounded-2xl border border-black/10 bg-[#f8f7f2] px-5 py-4 transition-transform duration-300 hover:-translate-y-1 hover:border-google-blue/30 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-google-blue focus-visible:ring-offset-2"
                >
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Belgeler</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">Resmi evrak rehberi</p>
                </Link>
                <Link
                  href="/is-ilanlari"
                  className="group rounded-2xl border border-black/10 bg-[#f8f7f2] px-5 py-4 transition-transform duration-300 hover:-translate-y-1 hover:border-google-green/30 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-google-green focus-visible:ring-offset-2"
                >
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">İş İlanları</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">Yeni fırsatlara bak</p>
                </Link>
                <Link
                  href="/topluluk"
                  className="group rounded-2xl border border-black/10 bg-[#f8f7f2] px-5 py-4 transition-transform duration-300 hover:-translate-y-1 hover:border-google-yellow/40 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-google-yellow focus-visible:ring-offset-2"
                >
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Topluluk</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">Doğru kişilere ulaş</p>
                </Link>
              </div>
            </div>
          </div>

          <aside className="relative overflow-hidden rounded-[2rem] border border-slate-900/10 bg-slate-950 p-8 text-white shadow-[0_30px_80px_rgba(15,23,42,0.24)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(66,133,244,0.35),_transparent_38%),radial-gradient(circle_at_bottom_left,_rgba(234,67,53,0.26),_transparent_30%)]" />
            <div className="relative space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="text-sm uppercase tracking-[0.24em] text-white/60">Hızlı kontrol</span>
                <span className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/70">
                  404 / Not Found
                </span>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-[-0.03em]">
                  Devam etmek için üç pratik seçenek
                </h2>
                <ul className="space-y-3 text-sm leading-7 text-white/75">
                  <li className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    Adresi yeniden kontrol edin; eksik harf veya eğik çizgi sorunu olabilir.
                  </li>
                  <li className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    Üst menüden ihtiyacınız olan kategoriye gidin.
                  </li>
                  <li className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    En çok kullanılan rehberlerden birini açıp aramaya oradan devam edin.
                  </li>
                </ul>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                <p className="text-sm uppercase tracking-[0.2em] text-white/55">Önerilen rota</p>
                <p className="mt-3 text-3xl font-black tracking-[-0.04em] text-white">
                  Almanya&apos;da iş, belge ve yaşam rehberi tek yerde.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
