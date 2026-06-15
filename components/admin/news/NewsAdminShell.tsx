'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  clearAdminAuth,
  loadAdminAuth,
  saveAdminAuth,
  verifyAdminKey,
} from '@/lib/admin/clientAuth';

const NAV_ITEMS = [
  { href: '/admin/haberler', label: 'Kuyruk' },
  { href: '/admin/haberler/yeni', label: 'Yeni Haber' },
  { href: '/admin/haberler/kaynaklar', label: 'Kaynaklar' },
  { href: '/admin/haberler/pipeline', label: 'Pipeline' },
  { href: '/admin/haberler/ayarlar', label: 'Ayarlar' },
];

export function NewsAdminShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [authed, setAuthed] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const current = loadAdminAuth();
    if (!current.password) {
      setAuthLoading(false);
      return;
    }

    verifyAdminKey(current.password)
      .then(() => setAuthed(true))
      .catch(() => clearAdminAuth())
      .finally(() => setAuthLoading(false));
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setAuthError('');
    try {
      await verifyAdminKey(authPassword);
      saveAdminAuth(authPassword);
      setAuthed(true);
    } catch (error) {
      setAuthError((error as Error).message || 'Giriş başarısız.');
    } finally {
      setSubmitting(false);
    }
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
          <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-black/40">
            <div className="text-center">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ffd24a]">
                Haber Admin
              </div>
              <h1 className="mt-3 text-3xl font-bold">{title}</h1>
              <p className="mt-3 text-sm leading-7 text-white/68">{description}</p>
            </div>

            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
              <label className="block">
                <span className="mb-2 block text-sm text-white/70">Şifre</span>
                <input
                  type="password"
                  autoComplete="current-password"
                  value={authPassword}
                  onChange={(event) => setAuthPassword(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none transition focus:border-[#01A1F1]"
                  placeholder="••••••••"
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
                className="w-full rounded-2xl bg-[#01A1F1] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#139ce6] disabled:cursor-not-allowed disabled:opacity-60"
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
      <section className="border-b border-white/10">
        <div className="container py-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <Link
                href="/admin"
                className="inline-flex rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/68 transition hover:bg-white/[0.1]"
              >
                Admin Ana Menü
              </Link>
              <h1 className="mt-4 text-4xl font-black">{title}</h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-white/68">{description}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                clearAdminAuth();
                setAuthed(false);
              }}
              className="rounded-full border border-red-400/20 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-100 transition hover:bg-red-500/20"
            >
              Çıkış Yap
            </button>
          </div>

          <nav className="mt-8 flex flex-wrap gap-2">
            {NAV_ITEMS.map((item) => {
              const active =
                pathname === item.href ||
                (item.href === '/admin/haberler' &&
                  pathname.startsWith('/admin/haberler/') &&
                  !pathname.startsWith('/admin/haberler/yeni') &&
                  !pathname.startsWith('/admin/haberler/kaynaklar') &&
                  !pathname.startsWith('/admin/haberler/pipeline') &&
                  !pathname.startsWith('/admin/haberler/ayarlar'));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    active
                      ? 'bg-google-yellow text-black'
                      : 'border border-white/10 bg-white/[0.04] text-white/74 hover:bg-white/[0.08]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </section>

      <section className="container py-8">{children}</section>
    </div>
  );
}
