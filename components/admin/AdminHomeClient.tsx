'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  clearAdminAuth,
  loadAdminAuth,
  saveAdminAuth,
  verifyAdminKey,
} from '@/lib/admin/clientAuth';

interface AdminSection {
  href: string;
  title: string;
  description: string;
  accent: string;
  glow: string;
  icon: React.ReactNode;
}

const ADMIN_SECTIONS: AdminSection[] = [
  {
    href: '/admin/software-hub',
    title: 'Software Hub',
    description: 'Devuser, turnuva ve diğer topluluk operasyonları.',
    accent: 'border-google-blue/40 bg-google-blue/[0.07] text-google-blue',
    glow: 'hover:shadow-glow-blue',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6">
        <rect x="3" y="4" width="18" height="12" rx="2" />
        <path d="M8 20h8M12 16v4" />
      </svg>
    ),
  },
  {
    href: '/admin/haberler',
    title: 'Haber Yönetimi',
    description: 'Yeni haber pipeline, kuyruk, kaynak ve ayar ekranları.',
    accent: 'border-google-yellow/50 bg-google-yellow/[0.08] text-google-yellow',
    glow: 'hover:shadow-glow-yellow',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6">
        <path d="M4 5h16v14a1 1 0 0 1-1 1H6a2 2 0 0 1-2-2z" />
        <path d="M8 9h8M8 13h8M8 17h5" />
      </svg>
    ),
  },
  {
    href: '/admin/yazi-dizisi',
    title: 'Arkadaşın Köşesi',
    description: 'Köşe profili, yazılar ve görsel yüklemeleri.',
    accent: 'border-google-blue/40 bg-google-blue/[0.07] text-google-blue',
    glow: 'hover:shadow-glow-blue',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" />
      </svg>
    ),
  },
  {
    href: '/admin/hizmet-rehberi',
    title: 'Hizmet Rehberi',
    description: 'Doktor, avukat ve diğer hizmet önerilerini onayla.',
    accent: 'border-google-red/45 bg-google-red/[0.07] text-google-red',
    glow: 'hover:shadow-glow-red',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    href: '/admin/recruitment-agencies',
    title: 'Recruitment Agencies',
    description: '150 recruitment agency listesini yönet ve düzenle.',
    accent: 'border-google-green/45 bg-google-green/[0.07] text-google-green',
    glow: 'hover:shadow-glow-green',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    href: '/admin/broken-link-reports',
    title: 'Kırık Link Bildirimleri',
    description: 'Kullanıcıların gönderdiği kırık link bildirimlerini görüntüle.',
    accent: 'border-google-orange/45 bg-google-orange/[0.07] text-google-orange',
    glow: 'hover:shadow-glow-yellow',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <path d="M15 3h6v6M10 14L21 3" />
      </svg>
    ),
  },
];

function isSafeNext(next: string | null): next is string {
  return Boolean(next) && next!.startsWith('/admin');
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

  function handleLogout() {
    clearAdminAuth();
    setAuthed(false);
    setAuthPassword('');
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
      <div className="min-h-screen bg-black text-white">
        <div className="container flex min-h-screen items-center justify-center py-12">
          <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-black/40 animate-reveal-up">
            <div className="text-center">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-google-yellow">Yönetim</div>
              <h1 className="mt-3 text-3xl font-bold">Admin Paneli</h1>
              <p className="mt-3 text-sm leading-7 text-white/68">
                Tüm yönetim bölümlerine tek şifreyle giriş yapın. Oturum açıkken alt sayfalar tekrar şifre sormaz.
              </p>
            </div>

            <form className="mt-8 space-y-4" onSubmit={handleLogin}>
              <label className="block">
                <span className="mb-2 block text-sm text-white/70">Şifre</span>
                <input
                  type="password"
                  autoComplete="current-password"
                  value={authPassword}
                  onChange={(event) => setAuthPassword(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none transition focus:border-google-blue focus-visible:ring-2 focus-visible:ring-google-blue"
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
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-google-yellow/10 via-transparent to-google-blue/10" />
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-google-blue/20 blur-3xl animate-aurora"
          aria-hidden="true"
        />
        <div className="container relative py-12">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-google-yellow">Yönetim</div>
              <h1 className="mt-3 text-4xl font-black md:text-5xl">Admin Paneli</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/68">
                Tüm bölümleri buradan yönetin. Oturumunuz açık olduğu sürece alt sayfalar tekrar şifre sormaz.
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-red-400/20 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-100 transition hover:bg-red-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      </section>

      <section className="container py-10">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {ADMIN_SECTIONS.map((section, index) => (
            <Link
              key={section.href}
              href={section.href}
              style={{ animationDelay: `${index * 60}ms` }}
              className={`group relative flex flex-col rounded-2xl border bg-white/[0.03] p-6 transition duration-300 animate-reveal-up hover:-translate-y-1 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-google-blue focus-visible:ring-offset-2 focus-visible:ring-offset-black ${section.accent} ${section.glow}`}
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${section.accent}`}>
                {section.icon}
              </div>
              <h2 className="mt-5 text-xl font-bold text-white">{section.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-6 text-white/68">{section.description}</p>
              <div className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-white/80 transition group-hover:gap-2">
                Aç
                <span aria-hidden="true">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
