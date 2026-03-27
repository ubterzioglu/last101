'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  clearAdminAuth,
  getAdminHeaders,
  loadAdminAuth,
  saveAdminAuth,
  verifyAdminKey,
} from '@/lib/admin/clientAuth';
import { cn } from '@/lib/utils/cn';

type SubmissionStatus = 'all' | 'pending' | 'approved' | 'rejected';
type SubmissionAction = 'approve' | 'reject' | 'pending' | 'delete';

interface SubmissionRow {
  id: string;
  type: string;
  display_name: string;
  city: string;
  address: string | null;
  phone: string | null;
  website: string | null;
  tag_labels: string | null;
  google_maps_url: string | null;
  note: string | null;
  status: Exclude<SubmissionStatus, 'all'>;
  admin_comment: string | null;
  approved_provider_id: string | null;
  created_at: string | null;
}

interface SubmissionStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

const LIST_API_URL = '/api/provider-submissions-admin-list';
const ACTION_API_URL = '/api/provider-submissions-admin-action';
const TYPE_OPTIONS = [
  { value: 'all', label: 'Tümü' },
  { value: 'doctor', label: 'Doktor' },
  { value: 'lawyer', label: 'Avukat' },
  { value: 'terapist', label: 'Terapist' },
  { value: 'ebe', label: 'Ebe / Kadın Doğum' },
  { value: 'nakliyat', label: 'Nakliyat' },
  { value: 'sigorta', label: 'Sigorta' },
  { value: 'vergi_danismani', label: 'Vergi Danışmanı' },
  { value: 'berber', label: 'Berber' },
  { value: 'kuafor', label: 'Kuaför' },
  { value: 'surucu_kursu', label: 'Sürücü Kursu' },
  { value: 'tamirci_otomobil', label: 'Tamirci / Otomobil' },
  { value: 'tamirci_tesisat', label: 'Tamirci / Tesisat' },
  { value: 'tamirci_boyaci', label: 'Tamirci / Boyacı' },
] as const;

function formatDate(value: string | null) {
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

function getTypeLabel(value: string) {
  return TYPE_OPTIONS.find((item) => item.value === value)?.label || value;
}

export default function ProviderSubmissionsAdminClient() {
  const [authed, setAuthed] = useState(false);
  const [authPassword, setAuthPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const [rows, setRows] = useState<SubmissionRow[]>([]);
  const [stats, setStats] = useState<SubmissionStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus>('pending');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState('');
  const [actionError, setActionError] = useState('');
  const [busyIds, setBusyIds] = useState<string[]>([]);
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});

  useEffect(() => {
    const saved = loadAdminAuth();
    if (!saved.password) return;

    verifyAdminKey(saved.password)
      .then(() => setAuthed(true))
      .catch(() => clearAdminAuth());
  }, []);

  const loadRows = useCallback(
    async (nextStatus = statusFilter, nextType = typeFilter, nextSearch = search) => {
      setListLoading(true);
      setListError('');

      try {
        const params = new URLSearchParams();
        params.set('status', nextStatus);
        params.set('type', nextType);
        params.set('limit', '250');
        if (nextSearch.trim()) params.set('q', nextSearch.trim());

        const response = await fetch(`${LIST_API_URL}?${params.toString()}`, {
          headers: getAdminHeaders({ Accept: 'application/json' }),
        });
        const payload = await response.json().catch(() => ({}));

        if (response.status === 401) {
          clearAdminAuth();
          setAuthed(false);
          throw new Error('Oturum süresi doldu. Lütfen tekrar giriş yapın.');
        }

        if (!response.ok) throw new Error(payload.error || 'Kayıtlar yüklenemedi.');

        const items = Array.isArray(payload.items) ? payload.items : [];
        setRows(items);
        setStats({
          total: Number(payload?.stats?.total || 0),
          pending: Number(payload?.stats?.pending || 0),
          approved: Number(payload?.stats?.approved || 0),
          rejected: Number(payload?.stats?.rejected || 0),
        });

        setCommentDrafts((prev) => {
          const next = { ...prev };
          for (const row of items) {
            if (!(row.id in next)) next[row.id] = row.admin_comment || '';
          }
          return next;
        });
      } catch (error) {
        setListError((error as Error).message || 'Beklenmeyen bir hata oluştu.');
      } finally {
        setListLoading(false);
      }
    },
    [search, statusFilter, typeFilter]
  );

  useEffect(() => {
    if (!authed) return;
    void loadRows();
  }, [authed, loadRows]);

  const countLabel = useMemo(() => `${rows.length} kayıt`, [rows.length]);

  async function handleAuthSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      await verifyAdminKey(authPassword);
      saveAdminAuth(authPassword);
      setAuthed(true);
    } catch (error) {
      setAuthError((error as Error).message || 'Giriş başarısız.');
    } finally {
      setAuthLoading(false);
    }
  }

  async function runAction(id: string, action: SubmissionAction) {
    setBusyIds((prev) => [...prev, id]);
    setActionError('');

    try {
      const response = await fetch(ACTION_API_URL, {
        method: 'POST',
        headers: getAdminHeaders({
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          id,
          action,
          adminComment: commentDrafts[id] || '',
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (response.status === 401) {
        clearAdminAuth();
        setAuthed(false);
        throw new Error('Oturum süresi doldu. Lütfen tekrar giriş yapın.');
      }

      if (!response.ok) throw new Error(payload.error || 'İşlem başarısız.');

      await loadRows();
    } catch (error) {
      setActionError((error as Error).message || 'İşlem başarısız.');
    } finally {
      setBusyIds((prev) => prev.filter((entry) => entry !== id));
    }
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#050505] text-white">
        <div className="container flex min-h-screen items-center justify-center py-12">
          <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-black/40">
            <div className="text-center">
              <div className="text-sm font-semibold uppercase tracking-[0.22em] text-[#7fd5ff]">
                Hizmet Rehberi Admin
              </div>
              <h1 className="mt-3 text-3xl font-black">Öneri Yönetimi Girişi</h1>
              <p className="mt-3 text-sm leading-7 text-white/68">
                Kullanıcıların gönderdiği hizmet önerilerini görmek ve onaylamak için admin şifresini girin.
              </p>
            </div>

            <form className="mt-8 space-y-4" onSubmit={handleAuthSubmit}>
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
                disabled={authLoading}
                className="w-full rounded-2xl bg-[#01A1F1] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#139ce6] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {authLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </button>

              <Link
                href="/admin"
                className="block text-center text-sm text-white/55 transition hover:text-white"
              >
                Admin ana ekrana geri dön
              </Link>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(1,161,241,0.22),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(246,83,20,0.16),_transparent_34%)]" />
        <div className="container relative py-12 md:py-16">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="max-w-3xl">
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7fd5ff]">
                Hizmet Rehberi Admin
              </div>
              <h1 className="mt-3 text-4xl font-black leading-tight md:text-5xl">
                Hizmet önerilerini yayın akışına dönüştür.
              </h1>
              <p className="mt-4 text-base leading-7 text-white/72">
                Yeni gelen önerileri hızlıca incele, not bırak, tek tıkla rehbere ekle veya reddet.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/admin"
                className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/75 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
              >
                Admin ana ekrana dön
              </Link>
              <button
                type="button"
                onClick={() => {
                  clearAdminAuth();
                  setAuthed(false);
                }}
                className="rounded-full border border-red-400/20 bg-red-500/10 px-4 py-2 text-sm text-red-100 transition hover:border-red-300/35 hover:bg-red-500/20"
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-10">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Toplam öneri" value={stats.total} accent="text-[#7fd5ff]" />
          <StatCard label="Bekleyen" value={stats.pending} accent="text-[#ffd24a]" />
          <StatCard label="Onaylanan" value={stats.approved} accent="text-[#90e28d]" />
          <StatCard label="Reddedilen" value={stats.rejected} accent="text-[#ff8b8b]" />
        </div>

        <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-white/45">
                Filtreler
              </div>
              <h2 className="mt-2 text-2xl font-bold">Öneri kuyruğu</h2>
            </div>
            <div className="text-sm text-white/55">{countLabel}</div>
          </div>

          <div className="mt-6 grid gap-3 lg:grid-cols-[1fr_220px_220px_auto]">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="İsim, şehir veya notta ara..."
              className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none transition focus:border-[#01A1F1]"
            />

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as SubmissionStatus)}
              className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none transition focus:border-[#01A1F1]"
            >
              <option value="all" className="bg-black">Tüm durumlar</option>
              <option value="pending" className="bg-black">Bekleyen</option>
              <option value="approved" className="bg-black">Onaylanan</option>
              <option value="rejected" className="bg-black">Reddedilen</option>
            </select>

            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-white outline-none transition focus:border-[#01A1F1]"
            >
              {TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value} className="bg-black">
                  {option.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => void loadRows(statusFilter, typeFilter, search)}
              className="rounded-2xl bg-[#F65314] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#ff6c35]"
            >
              Filtrele
            </button>
          </div>

          {listError ? (
            <div className="mt-4 rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {listError}
            </div>
          ) : null}

          {actionError ? (
            <div className="mt-4 rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {actionError}
            </div>
          ) : null}

          <div className="mt-6 space-y-4">
            {listLoading ? (
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-5 py-8 text-center text-sm text-white/60">
                Öneriler yükleniyor...
              </div>
            ) : rows.length === 0 ? (
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-5 py-8 text-center text-sm text-white/60">
                Bu filtre için kayıt bulunamadı.
              </div>
            ) : (
              rows.map((row) => {
                const isBusy = busyIds.includes(row.id);

                return (
                  <article
                    key={row.id}
                    className="rounded-[1.7rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="max-w-3xl">
                        <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.16em] text-white/45">
                          <span>{getTypeLabel(row.type)}</span>
                          <StatusBadge status={row.status} />
                          <span>{formatDate(row.created_at)}</span>
                        </div>
                        <h3 className="mt-3 text-2xl font-bold">{row.display_name}</h3>
                        <p className="mt-2 text-sm text-white/68">
                          {row.city}
                          {row.address ? ` • ${row.address}` : ''}
                        </p>
                      </div>

                      {row.approved_provider_id ? (
                        <div className="rounded-full border border-emerald-300/20 bg-emerald-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-100">
                          Rehbere eklendi
                        </div>
                      ) : null}
                    </div>

                    <div className="mt-5 grid gap-3 md:grid-cols-2">
                      <InfoChip label="Telefon" value={row.phone} />
                      <InfoChip label="Website" value={row.website} href={row.website} />
                      <InfoChip label="Google Maps" value={row.google_maps_url} href={row.google_maps_url} />
                      <InfoChip label="Etiketler" value={row.tag_labels} />
                    </div>

                    {row.note ? (
                      <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-7 text-white/72">
                        {row.note}
                      </div>
                    ) : null}

                    <div className="mt-4">
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
                        Admin notu
                      </label>
                      <textarea
                        value={commentDrafts[row.id] || ''}
                        onChange={(event) =>
                          setCommentDrafts((prev) => ({
                            ...prev,
                            [row.id]: event.target.value,
                          }))
                        }
                        className="min-h-24 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition focus:border-[#01A1F1]"
                        placeholder="İç not, düzeltme talebi veya karar sebebi..."
                      />
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => void runAction(row.id, 'approve')}
                        className="rounded-full bg-[#7CBB00] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#89cc00] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isBusy ? 'İşleniyor...' : 'Onayla ve rehbere ekle'}
                      </button>

                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => void runAction(row.id, 'reject')}
                        className="rounded-full border border-red-400/20 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-100 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Reddet
                      </button>

                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => void runAction(row.id, 'pending')}
                        className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/[0.1] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Beklemeye al
                      </button>

                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => {
                          if (!window.confirm('Bu öneriyi kalıcı olarak silmek istediğinize emin misiniz?')) {
                            return;
                          }
                          void runAction(row.id, 'delete');
                        }}
                        className="rounded-full border border-white/10 bg-transparent px-4 py-2 text-sm font-semibold text-white/75 transition hover:border-red-300/35 hover:text-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Sil
                      </button>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
      <div className="text-sm text-white/55">{label}</div>
      <div className={cn('mt-2 text-3xl font-black', accent)}>{value}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: Exclude<SubmissionStatus, 'all'> }) {
  const className =
    status === 'approved'
      ? 'border-emerald-300/20 bg-emerald-500/10 text-emerald-100'
      : status === 'rejected'
        ? 'border-red-300/20 bg-red-500/10 text-red-100'
        : 'border-yellow-300/20 bg-yellow-500/10 text-yellow-100';

  const label =
    status === 'approved' ? 'Onaylandı' : status === 'rejected' ? 'Reddedildi' : 'Bekliyor';

  return (
    <span className={cn('rounded-full border px-3 py-1 text-[11px] font-semibold', className)}>
      {label}
    </span>
  );
}

function InfoChip({
  label,
  value,
  href,
}: {
  label: string;
  value: string | null;
  href?: string | null;
}) {
  if (!value) return null;

  const content = href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
      {value}
    </a>
  ) : (
    value
  );

  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/72">
      <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/45">{label}</div>
      <div className="break-all">{content}</div>
    </div>
  );
}
