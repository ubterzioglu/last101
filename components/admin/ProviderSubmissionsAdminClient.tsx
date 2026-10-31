'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminEmptyState } from '@/components/admin/ui/AdminEmptyState';
import { ADMIN_CONTROL_CLASS } from '@/components/admin/ui/AdminField';
import { AdminPageHeader } from '@/components/admin/ui/AdminPageHeader';
import { AdminStatusBadge } from '@/components/admin/ui/AdminStatusBadge';
import { Chip } from '@/components/site/Chip';
import { TONE_STYLES, type SiteTone } from '@/components/site/tones';
import { Button } from '@/components/ui/Button';
import { clearAdminAuth, getAdminHeaders } from '@/lib/admin/clientAuth';
import { useAdminGate } from '@/hooks/useAdminGate';
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
  const router = useRouter();
  const gateStatus = useAdminGate();
  const authed = gateStatus === 'authed';

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
          router.replace('/admin');
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
    [router, search, statusFilter, typeFilter]
  );

  useEffect(() => {
    if (!authed) return;
    void loadRows();
  }, [authed, loadRows]);

  const countLabel = useMemo(() => `${rows.length} kayıt`, [rows.length]);

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
        router.replace('/admin');
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
      <div className="min-h-screen bg-page text-ink">
        <div className="container flex min-h-screen items-center justify-center py-12 text-sm text-muted">
          Admin oturumu doğrulanıyor...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page text-ink">
      <AdminPageHeader
        eyebrow="Hizmet Rehberi Admin"
        title="Hizmet önerilerini yayın akışına dönüştür."
        description="Yeni gelen önerileri hızlıca incele, not bırak, tek tıkla rehbere ekle veya reddet."
        actions={
          <>
            <Button href="/admin" variant="outline" size="sm">
              Admin ana ekrana dön
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={() => {
                clearAdminAuth();
                router.replace('/admin');
              }}
            >
              Çıkış Yap
            </Button>
          </>
        }
      />

      <section className="container py-10">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Toplam öneri" value={stats.total} tone="blue" />
          <StatCard label="Bekleyen" value={stats.pending} tone="yellow" />
          <StatCard label="Onaylanan" value={stats.approved} tone="green" />
          <StatCard label="Reddedilen" value={stats.rejected} tone="red" />
        </div>

        <div className="mt-8 rounded-card border border-line bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
                Filtreler
              </div>
              <h2 className="mt-2 text-2xl font-bold text-ink">Öneri kuyruğu</h2>
            </div>
            <div className="text-sm text-muted">{countLabel}</div>
          </div>

          <div className="mt-6 grid gap-3 rounded-card bg-band p-4 lg:grid-cols-[1fr_220px_220px_auto]">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="İsim, şehir veya notta ara..."
              className={ADMIN_CONTROL_CLASS}
            />

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as SubmissionStatus)}
              className={ADMIN_CONTROL_CLASS}
            >
              <option value="all">Tüm durumlar</option>
              <option value="pending">Bekleyen</option>
              <option value="approved">Onaylanan</option>
              <option value="rejected">Reddedilen</option>
            </select>

            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              className={ADMIN_CONTROL_CLASS}
            >
              {TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <Button type="button" onClick={() => void loadRows(statusFilter, typeFilter, search)}>
              Filtrele
            </Button>
          </div>

          {listError ? <ErrorBox>{listError}</ErrorBox> : null}
          {actionError ? <ErrorBox>{actionError}</ErrorBox> : null}

          <div className="mt-6 space-y-4">
            {listLoading ? (
              <div className="rounded-card border border-line bg-band px-5 py-8 text-center text-sm text-muted">
                Öneriler yükleniyor...
              </div>
            ) : rows.length === 0 ? (
              <AdminEmptyState title="Bu filtre için kayıt bulunamadı." />
            ) : (
              rows.map((row) => {
                const isBusy = busyIds.includes(row.id);

                return (
                  <article key={row.id} className="rounded-card border border-line bg-white p-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="max-w-3xl">
                        <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.16em] text-muted">
                          <span>{getTypeLabel(row.type)}</span>
                          <StatusBadge status={row.status} />
                          <span>{formatDate(row.created_at)}</span>
                        </div>
                        <h3 className="mt-3 text-2xl font-bold text-ink">{row.display_name}</h3>
                        <p className="mt-2 text-sm text-muted">
                          {row.city}
                          {row.address ? ` • ${row.address}` : ''}
                        </p>
                      </div>

                      {row.approved_provider_id ? (
                        <Chip tone="green" className="uppercase tracking-[0.16em]">
                          Rehbere eklendi
                        </Chip>
                      ) : null}
                    </div>

                    <div className="mt-5 grid gap-3 md:grid-cols-2">
                      <InfoChip label="Telefon" value={row.phone} />
                      <InfoChip label="Website" value={row.website} href={row.website} />
                      <InfoChip label="Google Maps" value={row.google_maps_url} href={row.google_maps_url} />
                      <InfoChip label="Etiketler" value={row.tag_labels} />
                    </div>

                    {row.note ? (
                      <div className="mt-4 rounded-btn border border-line bg-band p-4 text-sm leading-7 text-muted">
                        {row.note}
                      </div>
                    ) : null}

                    <div className="mt-4">
                      <label
                        htmlFor={`admin-note-${row.id}`}
                        className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-muted"
                      >
                        Admin notu
                      </label>
                      <textarea
                        id={`admin-note-${row.id}`}
                        value={commentDrafts[row.id] || ''}
                        onChange={(event) =>
                          setCommentDrafts((prev) => ({
                            ...prev,
                            [row.id]: event.target.value,
                          }))
                        }
                        className={cn(ADMIN_CONTROL_CLASS, 'min-h-24 py-3 text-sm')}
                        placeholder="İç not, düzeltme talebi veya karar sebebi..."
                      />
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <Button
                        type="button"
                        variant="success"
                        size="sm"
                        disabled={isBusy}
                        onClick={() => void runAction(row.id, 'approve')}
                      >
                        {isBusy ? 'İşleniyor...' : 'Onayla ve rehbere ekle'}
                      </Button>

                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        disabled={isBusy}
                        onClick={() => void runAction(row.id, 'reject')}
                      >
                        Reddet
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isBusy}
                        onClick={() => void runAction(row.id, 'pending')}
                      >
                        Beklemeye al
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isBusy}
                        onClick={() => {
                          if (!window.confirm('Bu öneriyi kalıcı olarak silmek istediğinize emin misiniz?')) {
                            return;
                          }
                          void runAction(row.id, 'delete');
                        }}
                      >
                        Sil
                      </Button>
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

function ErrorBox({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="alert"
      className={cn(
        'mt-4 rounded-btn border px-4 py-3 text-sm',
        TONE_STYLES.red.tint,
        TONE_STYLES.red.border,
        TONE_STYLES.red.text,
      )}
    >
      {children}
    </div>
  );
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: SiteTone;
}) {
  return (
    <div className="rounded-card border border-line bg-white p-5">
      <div className="text-sm text-muted">{label}</div>
      <div className={cn('mt-2 text-3xl font-extrabold', TONE_STYLES[tone].text)}>{value}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: Exclude<SubmissionStatus, 'all'> }) {
  const label =
    status === 'approved' ? 'Onaylandı' : status === 'rejected' ? 'Reddedildi' : 'Bekliyor';

  return <AdminStatusBadge status={status} label={label} />;
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
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-brand-700 underline-offset-4 hover:underline"
    >
      {value}
    </a>
  ) : (
    value
  );

  return (
    <div className="rounded-btn border border-line bg-band px-4 py-3 text-sm text-ink">
      <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">{label}</div>
      <div className="break-all">{content}</div>
    </div>
  );
}
