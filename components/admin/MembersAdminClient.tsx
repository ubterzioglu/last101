'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { getAdminHeaders } from '@/lib/admin/clientAuth';
import { useAdminGate } from '@/hooks/useAdminGate';
import { cn } from '@/lib/utils/cn';
import { TONE_STYLES } from '@/components/site/tones';
import type { SiteTone } from '@/components/site/tones';
import { Button } from '@/components/ui/Button';
import { AdminPageHeader } from '@/components/admin/ui/AdminPageHeader';
import { AdminFilterBar } from '@/components/admin/ui/AdminFilterBar';
import { ADMIN_CONTROL_CLASS } from '@/components/admin/ui/AdminField';
import { AdminTabs } from '@/components/admin/ui/AdminTabs';
import { AdminEmptyState } from '@/components/admin/ui/AdminEmptyState';
import { AdminStatusBadge } from '@/components/admin/ui/AdminStatusBadge';
import type { AdminStatusTone } from '@/components/admin/ui/AdminStatusBadge';
import { AdminTable, AdminThead, AdminTh, AdminTr, AdminTd } from '@/components/admin/ui/AdminTable';

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

function statusBadge(status: string): { label: string; tone: AdminStatusTone } {
  const normalized = String(status || 'pending').toLowerCase();
  if (normalized === 'approved') return { label: 'Onaylı', tone: 'green' };
  if (normalized === 'rejected') return { label: 'Reddedildi', tone: 'red' };
  return { label: 'Bekliyor', tone: 'yellow' };
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
      <div className="bg-page px-4 py-20 text-center text-sm text-muted">
        {gateStatus === 'redirecting' ? 'Admin girişine yönlendiriliyor...' : 'Admin oturumu doğrulanıyor...'}
      </div>
    );
  }

  const tabItems = [
    { key: 'auth', label: `Üyeler (${stats.totalAuthUsers})` },
    { key: 'devuser', label: `DevUser (${stats.totalDevusers})` },
  ];
  const activeRows = tab === 'auth' ? filteredAuthUsers : filteredDevusers;

  return (
    <div className="min-h-screen bg-page text-ink">
      <AdminPageHeader
        eyebrow="Yönetim"
        title="Üyeler"
        description="Araçlara giriş yapan tüm Supabase kullanıcıları ve oluşturulan devuser profilleri burada listelenir."
      />

      <section className="px-4 py-8 sm:px-6 lg:px-9">
        {/* İstatistik kartları */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Toplam Üye (Auth)" value={stats.totalAuthUsers} tone="blue" />
          <StatCard label="DevUser Profili" value={stats.totalDevusers} tone="green" />
          <StatCard label="Onay Bekleyen DevUser" value={stats.pendingDevusers} tone="yellow" />
          <StatCard label="Profilsiz Üye" value={stats.withoutProfile} tone="orange" />
        </div>

        {/* Sekmeler */}
        <AdminTabs
          className="mt-8"
          ariaLabel="Üye türleri"
          tabs={tabItems}
          active={tab}
          onChange={(key) => setTab(key === 'devuser' ? 'devuser' : 'auth')}
        />

        {/* Arama + yenile */}
        <AdminFilterBar className="mt-6">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="E-posta, isim, şehir ara..."
            aria-label="Üye ara"
            className={cn(ADMIN_CONTROL_CLASS, 'sm:w-72')}
          />
          <Button type="button" variant="outline" onClick={loadMembers} disabled={loading} className="shrink-0">
            {loading ? 'Yükleniyor...' : 'Yenile'}
          </Button>
        </AdminFilterBar>

        {error ? (
          <div
            role="alert"
            className={cn(
              'mt-6 rounded-card border px-4 py-3 text-sm',
              TONE_STYLES.red.tint,
              TONE_STYLES.red.border,
              TONE_STYLES.red.text,
            )}
          >
            {error}
          </div>
        ) : null}

        {/* Tablo */}
        <div className="mt-6">
          {tab === 'auth' ? (
            <AdminTable className="min-w-[720px]" caption="Üye listesi">
              <AdminThead>
                <AdminTr className="hover:bg-transparent">
                  <AdminTh>E-posta</AdminTh>
                  <AdminTh>Kayıt</AdminTh>
                  <AdminTh>Son Giriş</AdminTh>
                  <AdminTh>Sağlayıcı</AdminTh>
                  <AdminTh>Durum</AdminTh>
                  <AdminTh>DevUser</AdminTh>
                </AdminTr>
              </AdminThead>
              <tbody>
                {filteredAuthUsers.map((u) => (
                  <AdminTr key={u.id}>
                    <AdminTd className="font-medium">{u.email || '—'}</AdminTd>
                    <AdminTd className="text-muted">{formatDate(u.created_at)}</AdminTd>
                    <AdminTd className="text-muted">{formatDate(u.last_sign_in_at)}</AdminTd>
                    <AdminTd className="text-muted">{u.provider || 'email'}</AdminTd>
                    <AdminTd>
                      {u.email_confirmed_at ? (
                        <AdminStatusBadge status="approved" label="Doğrulandı" />
                      ) : (
                        <AdminStatusBadge status="pending" label="Bekliyor" />
                      )}
                    </AdminTd>
                    <AdminTd>
                      {u.has_devuser_profile ? (
                        <span className={cn('font-semibold', TONE_STYLES.green.text)}>✓ Var</span>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </AdminTd>
                  </AdminTr>
                ))}
              </tbody>
            </AdminTable>
          ) : (
            <AdminTable className="min-w-[720px]" caption="DevUser listesi">
              <AdminThead>
                <AdminTr className="hover:bg-transparent">
                  <AdminTh>Ad Soyad</AdminTh>
                  <AdminTh>E-posta</AdminTh>
                  <AdminTh>Şehir</AdminTh>
                  <AdminTh>Rol</AdminTh>
                  <AdminTh>Kayıt</AdminTh>
                  <AdminTh>Onay</AdminTh>
                </AdminTr>
              </AdminThead>
              <tbody>
                {filteredDevusers.map((u) => {
                  const badge = statusBadge(u.approval_status);
                  return (
                    <AdminTr key={u.id}>
                      <AdminTd className="font-medium">{u.ad_soyad || '—'}</AdminTd>
                      <AdminTd className="text-muted">{u.login_email || '—'}</AdminTd>
                      <AdminTd className="text-muted">{u.sehir || '—'}</AdminTd>
                      <AdminTd className="text-muted">{u.rol || '—'}</AdminTd>
                      <AdminTd className="text-muted">{formatDate(u.created_at)}</AdminTd>
                      <AdminTd>
                        <AdminStatusBadge status={u.approval_status} label={badge.label} tone={badge.tone} />
                      </AdminTd>
                    </AdminTr>
                  );
                })}
              </tbody>
            </AdminTable>
          )}
          {!loading && activeRows.length === 0 ? (
            <AdminEmptyState className="mt-4" title="Kayıt bulunamadı." />
          ) : null}
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value, tone }: { label: string; value: number; tone: SiteTone }) {
  return (
    <div className="rounded-card border border-line bg-white p-5">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</span>
      <span className={cn('mt-3 block text-[28px] font-extrabold leading-none', TONE_STYLES[tone].text)}>{value}</span>
    </div>
  );
}
