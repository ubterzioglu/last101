'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  clearAdminAuth,
  getAdminHeaders,
  loadAdminAuth,
  saveAdminAuth,
  verifyAdminKey,
} from '@/lib/admin/clientAuth';
import { AuthSplitLayout } from '@/components/auth/AuthSplitLayout';

function isSafeNext(next: string | null): next is string {
  return Boolean(next) && next!.startsWith('/admin');
}

interface DashboardStats {
  pendingProviders: number;
  brokenLinks: number;
  totalMembers: number;
}

export function AdminHomeClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get('next');

  const [authed, setAuthed] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({ pendingProviders: 0, brokenLinks: 0, totalMembers: 0 });

  useEffect(() => {
    const saved = loadAdminAuth();
    if (!saved.password) {
      setAuthLoading(false);
      return;
    }

    verifyAdminKey(saved.password)
      .then(() => setAuthed(true))
      .catch(() => clearAdminAuth())
      .finally(() => setAuthLoading(false));
  }, []);

  useEffect(() => {
    if (!authed) return;
    let cancelled = false;

    async function loadStats() {
      const next: DashboardStats = { pendingProviders: 0, brokenLinks: 0, totalMembers: 0 };
      try {
        const res = await fetch('/api/provider-submissions-admin-list?status=pending&limit=1', {
          headers: getAdminHeaders({ Accept: 'application/json' }),
        });
        if (res.ok) {
          const payload = await res.json().catch(() => ({}));
          next.pendingProviders = Number(payload?.stats?.pending || 0);
        }
      } catch {
        // yok say
      }
      try {
        const res = await fetch('/api/broken-link-reports-admin-list', {
          headers: getAdminHeaders({ Accept: 'application/json' }),
        });
        if (res.ok) {
          const payload = await res.json().catch(() => ({}));
          next.brokenLinks = Array.isArray(payload?.reports) ? payload.reports.length : 0;
        }
      } catch {
        // yok say
      }
      try {
        const res = await fetch('/api/members-admin-list?limit=1000', {
          headers: getAdminHeaders({ Accept: 'application/json' }),
        });
        if (res.ok) {
          const payload = await res.json().catch(() => ({}));
          next.totalMembers = Number(payload?.stats?.totalAuthUsers || 0);
        }
      } catch {
        // yok say
      }
      if (!cancelled) setStats(next);
    }

    loadStats();
    return () => {
      cancelled = true;
    };
  }, [authed]);

  function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setAuthError('');
    verifyAdminKey(authPassword)
      .then(() => {
        saveAdminAuth(authPassword);
        if (isSafeNext(nextParam)) {
          router.replace(nextParam);
          return;
        }
        setAuthed(true);
      })
      .catch((error: unknown) => {
        setAuthError(error instanceof Error ? error.message : 'Giriş başarısız.');
      })
      .finally(() => setSubmitting(false));
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container py-20 text-center text-sm text-white/60">Admin oturumu doğrulanıyor...</div>
      </div>
    );
  }

  if (!authed) {
    return (
      <AuthSplitLayout
        title="Admin Paneli"
        subtitle="Tüm yönetim bölümlerine tek şifreyle giriş yapın. Oturum açıkken alt sayfalar tekrar şifre sormaz."
        accent="yellow"
        heroTitle="Yönetim Paneli"
        heroSubtitle="Üyeler, haberler, köşe yazarları, hizmet rehberi ve daha fazlasını tek yerden yönetin."
      >
        <form className="space-y-4" onSubmit={handleLogin}>
          <label className="block">
            <span className="mb-2 block text-sm text-white/70">Şifre</span>
            <input
              type="password"
              autoComplete="current-password"
              value={authPassword}
              onChange={(event) => setAuthPassword(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none transition focus:border-google-yellow focus-visible:ring-2 focus-visible:ring-google-yellow"
              placeholder="••••••••"
              autoFocus
            />
          </label>

          {authError ? (
            <div className="rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {authError}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-2xl bg-google-blue px-4 py-3 text-sm font-semibold text-white transition hover:bg-google-blue/90 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-google-blue focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            {submitting ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
      </AuthSplitLayout>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-google-yellow/10 via-transparent to-google-blue/10" />
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-google-blue/20 blur-3xl"
          aria-hidden="true"
        />
        <div className="container relative py-12">
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-google-yellow">Yönetim</div>
          <h1 className="mt-3 text-4xl font-black md:text-5xl">Hoş geldin 👋</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/68">
            Soldaki menüden bir bölüm seçerek yönetime başlayabilirsin. Bekleyen işler aşağıda özetleniyor.
          </p>
        </div>
      </section>

      <section className="container py-10">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <DashboardStatCard
            label="Toplam Üye"
            value={stats.totalMembers}
            accent="text-google-blue"
            href="/admin/uyeler"
            router={router}
          />
          <DashboardStatCard
            label="Bekleyen Hizmet Önerisi"
            value={stats.pendingProviders}
            accent="text-google-red"
            href="/admin/hizmet-rehberi"
            router={router}
          />
          <DashboardStatCard
            label="Kırık Link Bildirimi"
            value={stats.brokenLinks}
            accent="text-google-orange"
            href="/admin/broken-link-reports"
            router={router}
          />
          <DashboardStatCard
            label="Service Finder (Uzman Tarama)"
            value={0}
            accent="text-google-blue"
            href="/admin/service-finder"
            router={router}
          />
        </div>

        <div className="mt-5">
          <button
            type="button"
            onClick={() => router.push('/admin/araclar')}
            className="group flex w-full items-center justify-between gap-4 rounded-2xl border border-google-blue/30 bg-white/[0.03] p-6 text-left transition hover:-translate-y-0.5 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-google-blue focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <span>
              <span className="block text-xs font-semibold uppercase tracking-wider text-google-blue">Araçlar</span>
              <span className="mt-1 block text-lg font-bold text-white">İnteraktif Araçlar</span>
              <span className="mt-1 block text-sm text-white/55">
                Tüm planlama araçları — kategori, açıklama ve gerçek soru sayıları tek listede.
              </span>
            </span>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-white/70 transition group-hover:gap-2">
              Aç
              <span aria-hidden="true">→</span>
            </span>
          </button>
        </div>

        <div className="mt-5">
          <button
            type="button"
            onClick={() => router.push('/admin/rehber')}
            className="group flex w-full items-center justify-between gap-4 rounded-2xl border border-google-green/30 bg-white/[0.03] p-6 text-left transition hover:-translate-y-0.5 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-google-green focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <span>
              <span className="block text-xs font-semibold uppercase tracking-wider text-google-green">Rehberler</span>
              <span className="mt-1 block text-lg font-bold text-white">Kullanım Kılavuzu</span>
              <span className="mt-1 block text-sm text-white/55">
                Admin paneli ve uygulama (kullanıcı tarafı) kılavuzları — iki sekme tek sayfada.
              </span>
            </span>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-white/70 transition group-hover:gap-2">
              Aç
              <span aria-hidden="true">→</span>
            </span>
          </button>
        </div>
      </section>
    </div>
  );
}

interface DashboardStatCardProps {
  label: string;
  value: number;
  accent: string;
  href: string;
  router: ReturnType<typeof useRouter>;
}

function DashboardStatCard({ label, value, accent, href, router }: DashboardStatCardProps) {
  return (
    <button
      type="button"
      onClick={() => router.push(href)}
      className="group flex flex-col items-start rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-left transition hover:-translate-y-0.5 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-google-blue focus-visible:ring-offset-2 focus-visible:ring-offset-black"
    >
      <span className="text-xs font-semibold uppercase tracking-wider text-white/45">{label}</span>
      <span className={`mt-3 text-4xl font-black ${accent}`}>{value}</span>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-white/70 transition group-hover:gap-2">
        Görüntüle
        <span aria-hidden="true">→</span>
      </span>
    </button>
  );
}
