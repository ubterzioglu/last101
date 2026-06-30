'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { getAdminHeaders } from '@/lib/admin/clientAuth';
import { useAdminGate } from '@/hooks/useAdminGate';
import { cn } from '@/lib/utils/cn';

const MEMBERS_API_URL = '/api/members-admin-list';

interface AuthUser {
  id: string;
  email: string | null;
  created_at: string | null;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
  provider: string | null;
  has_devuser_profile: boolean;
}

interface DevUser {
  id: string;
  user_id: string | null;
  login_email: string | null;
  ad_soyad: string | null;
  sehir: string | null;
  rol: string | null;
  approval_status: string;
  created_at: string | null;
}

interface MembersStats {
  totalAuthUsers: number;
  totalDevusers: number;
  pendingDevusers: number;
  withoutProfile: number;
}

interface MembersResponse {
  authUsers: AuthUser[];
  devusers: DevUser[];
  stats: MembersStats;
}

type TabKey = 'auth' | 'devuser';

const EMPTY_STATS: MembersStats = {
  totalAuthUsers: 0,
  totalDevusers: 0,
  pendingDevusers: 0,
  withoutProfile: 0,
};

function formatDate(value: string | null): string {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function statusBadge(status: string): { label: string; className: string } {
  const normalized = String(status || 'pending').toLowerCase();
  if (normalized === 'approved') {
    return { label: 'Onaylı', className: 'border-google-green/30 bg-green-500/10 text-green-200' };
  }
  if (normalized === 'rejected') {
    return { label: 'Reddedildi', className: 'border-google-red/30 bg-red-500/10 text-red-200' };
  }
  return { label: 'Bekliyor', className: 'border-google-yellow/30 bg-yellow-500/10 text-yellow-200' };
}

export default function MembersAdminClient() {
  const gateStatus = useAdminGate();
  const authed = gateStatus === 'authed';

  const [authUsers, setAuthUsers] = useState<AuthUser[]>([]);
  const [devusers, setDevusers] = useState<DevUser[]>([]);
  const [stats, setStats] = useState<MembersStats>(EMPTY_STATS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<TabKey>('auth');
  const [search, setSearch] = useState('');

  const loadMembers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(MEMBERS_API_URL, {
        headers: getAdminHeaders({ Accept: 'application/json' }),
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.error || `HTTP ${response.status}`);
      }
      const data: MembersResponse = await response.json();
      setAuthUsers(Array.isArray(data.authUsers) ? data.authUsers : []);
      setDevusers(Array.isArray(data.devusers) ? data.devusers : []);
      setStats(data.stats ?? EMPTY_STATS);
    } catch (err) {
      console.error('Load members error:', err);
      setError(err instanceof Error ? err.message : 'Bilinmeyen hata');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed) loadMembers();
  }, [authed, loadMembers]);

  const filteredAuthUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return authUsers;
    return authUsers.filter((u) => (u.email || '').toLowerCase().includes(q) || u.id.toLowerCase().includes(q));
  }, [authUsers, search]);

  const filteredDevusers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return devusers;
    return devusers.filter(
      (u) =>
        (u.login_email || '').toLowerCase().includes(q) ||
        (u.ad_soyad || '').toLowerCase().includes(q) ||
        (u.sehir || '').toLowerCase().includes(q) ||
        (u.rol || '').toLowerCase().includes(q),
    );
  }, [devusers, search]);

  if (gateStatus !== 'authed') {
    return (
      <div className="container py-20 text-center text-sm text-white/60">
        {gateStatus === 'redirecting' ? 'Admin girişine yönlendiriliyor...' : 'Admin oturumu doğrulanıyor...'}
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-google-blue/10 via-transparent to-google-green/10" />
        <div className="container relative py-10">
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-google-blue">Yönetim</div>
          <h1 className="mt-3 text-3xl font-black md:text-4xl">Üyeler</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/68">
            Araçlara giriş yapan tüm Supabase kullanıcıları ve oluşturulan devuser profilleri burada listelenir.
          </p>
        </div>
      </section>

      <section className="container py-8">
        {/* İstatistik kartları */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Toplam Üye (Auth)" value={stats.totalAuthUsers} accent="text-google-blue" />
          <StatCard label="DevUser Profili" value={stats.totalDevusers} accent="text-google-green" />
          <StatCard label="Onay Bekleyen DevUser" value={stats.pendingDevusers} accent="text-google-yellow" />
          <StatCard label="Profilsiz Üye" value={stats.withoutProfile} accent="text-google-orange" />
        </div>

        {/* Sekmeler + arama + yenile */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex rounded-xl border border-white/10 bg-black/40 p-1">
            <TabButton active={tab === 'auth'} onClick={() => setTab('auth')}>
              Üyeler ({stats.totalAuthUsers})
            </TabButton>
            <TabButton active={tab === 'devuser'} onClick={() => setTab('devuser')}>
              DevUser ({stats.totalDevusers})
            </TabButton>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="E-posta, isim, şehir ara..."
              className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm text-white outline-none transition focus:border-google-blue sm:w-72"
            />
            <button
              type="button"
              onClick={loadMembers}
              disabled={loading}
              className="shrink-0 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-white/85 transition hover:border-white/35 hover:bg-white/[0.06] disabled:opacity-60"
            >
              {loading ? 'Yükleniyor...' : 'Yenile'}
            </button>
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        {/* Tablo */}
        <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02]">
          {tab === 'auth' ? (
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-white/10 text-xs uppercase tracking-wider text-white/45">
                <tr>
                  <th className="px-4 py-3">E-posta</th>
                  <th className="px-4 py-3">Kayıt</th>
                  <th className="px-4 py-3">Son Giriş</th>
                  <th className="px-4 py-3">Sağlayıcı</th>
                  <th className="px-4 py-3">Durum</th>
                  <th className="px-4 py-3">DevUser</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredAuthUsers.map((u) => (
                  <tr key={u.id} className="text-white/80 transition hover:bg-white/[0.03]">
                    <td className="px-4 py-3 font-medium text-white">{u.email || '—'}</td>
                    <td className="px-4 py-3 text-white/60">{formatDate(u.created_at)}</td>
                    <td className="px-4 py-3 text-white/60">{formatDate(u.last_sign_in_at)}</td>
                    <td className="px-4 py-3 text-white/60">{u.provider || 'email'}</td>
                    <td className="px-4 py-3">
                      {u.email_confirmed_at ? (
                        <span className="inline-flex rounded-full border border-google-green/30 bg-green-500/10 px-2.5 py-0.5 text-xs font-semibold text-green-200">
                          Doğrulandı
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full border border-google-yellow/30 bg-yellow-500/10 px-2.5 py-0.5 text-xs font-semibold text-yellow-200">
                          Bekliyor
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {u.has_devuser_profile ? (
                        <span className="text-google-green">✓ Var</span>
                      ) : (
                        <span className="text-white/35">—</span>
                      )}
                    </td>
                  </tr>
                ))}
                {!loading && filteredAuthUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-white/45">
                      Kayıt bulunamadı.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          ) : (
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-white/10 text-xs uppercase tracking-wider text-white/45">
                <tr>
                  <th className="px-4 py-3">Ad Soyad</th>
                  <th className="px-4 py-3">E-posta</th>
                  <th className="px-4 py-3">Şehir</th>
                  <th className="px-4 py-3">Rol</th>
                  <th className="px-4 py-3">Kayıt</th>
                  <th className="px-4 py-3">Onay</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredDevusers.map((u) => {
                  const badge = statusBadge(u.approval_status);
                  return (
                    <tr key={u.id} className="text-white/80 transition hover:bg-white/[0.03]">
                      <td className="px-4 py-3 font-medium text-white">{u.ad_soyad || '—'}</td>
                      <td className="px-4 py-3 text-white/60">{u.login_email || '—'}</td>
                      <td className="px-4 py-3 text-white/60">{u.sehir || '—'}</td>
                      <td className="px-4 py-3 text-white/60">{u.rol || '—'}</td>
                      <td className="px-4 py-3 text-white/60">{formatDate(u.created_at)}</td>
                      <td className="px-4 py-3">
                        <span className={cn('inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold', badge.className)}>
                          {badge.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {!loading && filteredDevusers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-white/45">
                      Kayıt bulunamadı.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <span className="text-xs font-semibold uppercase tracking-wider text-white/45">{label}</span>
      <span className={cn('mt-3 block text-3xl font-black', accent)}>{value}</span>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-lg px-4 py-2 text-sm font-semibold transition',
        active ? 'bg-google-blue text-white' : 'text-white/60 hover:text-white',
      )}
    >
      {children}
    </button>
  );
}
