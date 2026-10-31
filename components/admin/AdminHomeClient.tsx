'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  clearAdminAuth,
  getAdminHeaders,
  loadAdminAuth,
  saveAdminAuth,
  verifyAdminKey,
} from '@/lib/admin/clientAuth';
import { AuthSplitLayout } from '@/components/auth/AuthSplitLayout';
import { AdminField, ADMIN_CONTROL_CLASS } from '@/components/admin/ui/AdminField';
import { AdminPageHeader } from '@/components/admin/ui/AdminPageHeader';
import { AdminStatCard } from '@/components/admin/ui/AdminStatCard';
import { TONE_STYLES } from '@/components/site/tones';
import type { SiteTone } from '@/components/site/tones';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils/cn';

const LOGIN_HIGHLIGHTS = [
  'Üyeler, haberler ve köşe yazıları',
  'Hizmet rehberi öneri onayları',
  'Kırık link ve güvenlik bildirimleri',
] as const;

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
      <div className="min-h-screen bg-page text-muted">
        <div className="py-20 text-center text-sm text-muted">Admin oturumu doğrulanıyor...</div>
      </div>
    );
  }

  if (!authed) {
    return (
      <AuthSplitLayout
        tone="light"
        title="Admin Paneli"
        subtitle="Tüm yönetim bölümlerine tek şifreyle giriş yapın. Oturum açıkken alt sayfalar tekrar şifre sormaz."
        heroTitle="Yönetim Paneli"
        heroSubtitle="Üyeler, haberler, köşe yazarları, hizmet rehberi ve daha fazlasını tek yerden yönetin."
        highlights={LOGIN_HIGHLIGHTS}
      >
        <form className="space-y-4" onSubmit={handleLogin}>
          <AdminField label="Şifre">
            <input
              type="password"
              autoComplete="current-password"
              value={authPassword}
              onChange={(event) => setAuthPassword(event.target.value)}
              className={ADMIN_CONTROL_CLASS}
              placeholder="••••••••"
              autoFocus
            />
          </AdminField>

          {authError ? (
            <div
              className={cn(
                'rounded-card border px-4 py-3 text-sm',
                TONE_STYLES.red.tint,
                TONE_STYLES.red.border,
                TONE_STYLES.red.text,
              )}
            >
              {authError}
            </div>
          ) : null}

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </Button>
        </form>
      </AuthSplitLayout>
    );
  }

  return (
    <div className="min-h-screen bg-page text-ink">
      <AdminPageHeader
        eyebrow="Yönetim"
        title="Hoş geldin"
        description="Soldaki menüden bir bölüm seçerek yönetime başlayabilirsin. Bekleyen işler aşağıda özetleniyor."
      />

      <section className="px-4 py-8 sm:px-6 lg:px-9">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AdminStatCard label="Toplam Üye" value={stats.totalMembers} tone="blue" href="/admin/uyeler" />
          <AdminStatCard
            label="Bekleyen Hizmet Önerisi"
            value={stats.pendingProviders}
            tone="red"
            href="/admin/hizmet-rehberi"
          />
          <AdminStatCard
            label="Kırık Link Bildirimi"
            value={stats.brokenLinks}
            tone="orange"
            href="/admin/broken-link-reports"
          />
          <AdminStatCard
            label="Service Finder (Uzman Tarama)"
            value={0}
            tone="blue"
            href="/admin/service-finder"
          />
        </div>

        <div className="mt-4 space-y-4">
          <DashboardLinkCard
            href="/admin/araclar"
            tone="blue"
            eyebrow="Araçlar"
            title="İnteraktif Araçlar"
            description="Tüm planlama araçları — kategori, açıklama ve gerçek soru sayıları tek listede."
          />
          <DashboardLinkCard
            href="/admin/rehber"
            tone="green"
            eyebrow="Rehberler"
            title="Kullanım Kılavuzu"
            description="Admin paneli ve uygulama (kullanıcı tarafı) kılavuzları — iki sekme tek sayfada."
          />
        </div>
      </section>
    </div>
  );
}

interface DashboardLinkCardProps {
  href: string;
  tone: SiteTone;
  eyebrow: string;
  title: string;
  description: string;
}

function DashboardLinkCard({ href, tone, eyebrow, title, description }: DashboardLinkCardProps) {
  return (
    <Card variant="hoverable" noPadding>
      <Link href={href} className="group flex w-full items-center justify-between gap-4 rounded-card p-6 text-left">
        <span>
          <span className={cn('block text-xs font-semibold uppercase tracking-wider', TONE_STYLES[tone].text)}>
            {eyebrow}
          </span>
          <span className="mt-1 block text-lg font-bold text-ink">{title}</span>
          <span className="mt-1 block text-sm text-muted">{description}</span>
        </span>
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 transition-all group-hover:gap-2">
          Aç
          <span aria-hidden="true">→</span>
        </span>
      </Link>
    </Card>
  );
}