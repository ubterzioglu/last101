'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AdminEmptyState } from '@/components/admin/ui/AdminEmptyState';
import { AdminFilterBar } from '@/components/admin/ui/AdminFilterBar';
import { ADMIN_CONTROL_CLASS } from '@/components/admin/ui/AdminField';
import { AdminStatusBadge } from '@/components/admin/ui/AdminStatusBadge';
import { AdminTabs } from '@/components/admin/ui/AdminTabs';
import { TONE_STYLES } from '@/components/site/tones';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { getAdminHeaders } from '@/lib/admin/clientAuth';
import { normalizeFounderStatus } from '@/lib/founder';
import { cn } from '@/lib/utils/cn';

type FounderSubmissionStatusFilter = 'all' | 'pending' | 'approved' | 'rejected';
type FounderSubmissionAction = 'approve' | 'reject' | 'pending' | 'delete';

interface FounderSubmissionRow {
  id: string;
  full_name: string | null;
  linkedin_url: string | null;
  whatsapp: string | null;
  phone: string | null;
  project_name: string | null;
  project_url: string | null;
  short_description: string | null;
  status: 'pending' | 'approved' | 'rejected';
  admin_comment: string | null;
  created_at: string | null;
  updated_at: string | null;
}

/** /api/founder-submissions-admin-list yanıtı (hata durumunda yalnızca error döner). */
interface FounderListPayload {
  items?: FounderSubmissionRow[];
  stats?: Partial<Record<'total' | 'pending' | 'approved' | 'rejected', number>>;
  error?: string;
}

const LIST_API_URL = '/api/founder-submissions-admin-list';
const ACTION_API_URL = '/api/founder-submissions-admin-action';

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

const STATUS_TABS = [
  { key: 'all', label: 'Tümü' },
  { key: 'pending', label: 'Bekleyen' },
  { key: 'approved', label: 'Onaylı' },
  { key: 'rejected', label: 'Reddedilen' },
] as const;

const SMALL_LABEL_CLASS = 'text-xs font-semibold uppercase tracking-wider text-muted';

function isStatusFilter(value: string): value is FounderSubmissionStatusFilter {
  return STATUS_TABS.some((tab) => tab.key === value);
}

function buildWaUrl(value: string | null) {
  const digits = String(value || '').replace(/\D/g, '');
  return digits ? `https://wa.me/${digits}` : '';
}

export default function FounderSubmissionsAdminSection({
  active,
  onBack,
}: {
  active: boolean;
  onBack: () => void;
}) {
  const [rows, setRows] = useState<FounderSubmissionRow[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [statusFilter, setStatusFilter] = useState<FounderSubmissionStatusFilter>('pending');
  const [search, setSearch] = useState('');
  const [listLoading, setListLoading] = useState(false);
  const [error, setError] = useState('');
  const [busyIds, setBusyIds] = useState<string[]>([]);
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});

  const loadRows = useCallback(
    async (nextStatus = statusFilter, nextSearch = search) => {
      if (!active) return;
      setListLoading(true);
      setError('');

      try {
        const params = new URLSearchParams();
        params.set('status', nextStatus);
        params.set('limit', '400');
        if (nextSearch.trim()) params.set('q', nextSearch.trim());

        const response = await fetch(`${LIST_API_URL}?${params.toString()}`, {
          headers: getAdminHeaders({ Accept: 'application/json' }),
        });
        const payload: FounderListPayload = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(payload.error || 'Founder kayıtları yüklenemedi.');
        }

        const items = Array.isArray(payload.items) ? payload.items : [];
        setRows(items);
        setStats({
          total: Number(payload.stats?.total || 0),
          pending: Number(payload.stats?.pending || 0),
          approved: Number(payload.stats?.approved || 0),
          rejected: Number(payload.stats?.rejected || 0),
        });

        setCommentDrafts((prev) => {
          const next = { ...prev };
          for (const item of items) {
            if (!(item.id in next)) next[item.id] = item.admin_comment || '';
          }
          return next;
        });
      } catch (loadError) {
        setError((loadError as Error)?.message || 'Beklenmeyen bir hata oluştu.');
      } finally {
        setListLoading(false);
      }
    },
    [active, search, statusFilter]
  );

  useEffect(() => {
    if (!active) return;
    void loadRows();
  }, [active, loadRows]);

  useEffect(() => {
    if (!active) return;
    void loadRows(statusFilter, search);
  }, [active, loadRows, search, statusFilter]);

  const visibleCountLabel = useMemo(() => `${rows.length} kayıt`, [rows.length]);

  async function runAction(id: string, action: FounderSubmissionAction) {
    if (action === 'delete' && !window.confirm('Bu founder kaydını kalıcı olarak silmek istediğinize emin misiniz?')) {
      return;
    }

    setBusyIds((prev) => [...prev, id]);
    setError('');

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
          admin_comment: commentDrafts[id] || '',
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error((payload as { error?: string }).error || 'İşlem başarısız.');
      }

      await loadRows();
    } catch (actionError) {
      setError((actionError as Error)?.message || 'İşlem başarısız.');
    } finally {
      setBusyIds((prev) => prev.filter((entry) => entry !== id));
    }
  }

  async function copySurveyLink(row: FounderSubmissionRow) {
    const origin = window.location.origin;
    const link = `${origin}/devuser/founder-survey?founder=${encodeURIComponent(row.id)}`;
    try {
      await navigator.clipboard.writeText(link);
      window.alert('Survey linki panoya kopyalandı.');
    } catch {
      window.prompt('Linki kopyalayın:', link);
    }
  }

  if (!active) return null;

  const statCards = [
    { label: 'Toplam Başvuru', value: stats.total },
    { label: 'Bekleyen', value: stats.pending },
    { label: 'Onaylı', value: stats.approved },
    { label: 'Reddedilen', value: stats.rejected },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-card border border-line bg-white p-5">
            <div className="text-[28px] font-extrabold leading-none text-ink">{card.value}</div>
            <div className={cn('mt-3', SMALL_LABEL_CLASS)}>{card.label}</div>
          </div>
        ))}
      </div>

      <Card className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-xl font-extrabold tracking-tight text-ink">🚀 Founder Başvuruları</h3>
          <Button variant="outline" size="sm" onClick={onBack}>← Menüye Dön</Button>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-3">
          <AdminTabs
            ariaLabel="Başvuru durumu"
            tabs={STATUS_TABS}
            active={statusFilter}
            onChange={(key) => {
              if (isStatusFilter(key)) setStatusFilter(key);
            }}
          />
          <div className="pb-2 text-sm text-muted">{visibleCountLabel}</div>
        </div>

        <AdminFilterBar>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="İsim, proje, WhatsApp veya LinkedIn ara..."
            className={cn(ADMIN_CONTROL_CLASS, 'w-auto min-w-[240px] flex-1')}
          />
          <Button variant="outline" onClick={() => void loadRows(statusFilter, search)}>Filtrele</Button>
          <Button variant="primary" onClick={() => void loadRows()}>Yenile</Button>
        </AdminFilterBar>

        {error ? (
          <div
            role="alert"
            className={cn(
              'rounded-btn border px-4 py-3 text-sm font-medium',
              TONE_STYLES.red.tint,
              TONE_STYLES.red.border,
              TONE_STYLES.red.text
            )}
          >
            {error}
          </div>
        ) : null}

        {listLoading ? (
          <div role="status" className="flex flex-col items-center gap-3 py-10 text-sm text-muted">
            <div
              aria-hidden="true"
              className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-brand-700"
            />
            <p>Founder başvuruları yükleniyor...</p>
          </div>
        ) : rows.length === 0 ? (
          <AdminEmptyState title="Bu filtre için founder kaydı yok." />
        ) : (
          <div className="grid gap-4">
            {rows
              .filter((row) => statusFilter === 'all' || normalizeFounderStatus(row.status) === statusFilter)
              .map((row) => {
                const status = normalizeFounderStatus(row.status);
                const isBusy = busyIds.includes(row.id);
                const waUrl = buildWaUrl(row.whatsapp);
                return (
                  <article key={row.id} className="rounded-card border border-line bg-white p-5 md:p-6">
                    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="mb-2 flex flex-wrap gap-2">
                          <AdminStatusBadge
                            status={status}
                            tone={status === 'approved' ? 'green' : status === 'rejected' ? 'red' : 'yellow'}
                            label={status === 'approved' ? 'Onaylı' : status === 'rejected' ? 'Reddedildi' : 'Onay Bekliyor'}
                          />
                          <AdminStatusBadge status="date" tone="neutral" label={formatDate(row.created_at)} />
                        </div>
                        <h4 className="m-0 text-2xl font-extrabold tracking-tight text-ink">{row.full_name || 'İsimsiz kayıt'}</h4>
                        <div className="mt-1.5 text-muted">{row.project_name || 'Proje adı belirtilmedi'}</div>
                      </div>
                      {status === 'approved' ? (
                        <Button variant="outline" size="sm" onClick={() => void copySurveyLink(row)}>
                          Survey Linkini Kopyala
                        </Button>
                      ) : null}
                    </div>

                    <div className="mb-4 grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
                      <InfoChip label="LinkedIn" value={row.linkedin_url} href={row.linkedin_url} />
                      <InfoChip label="WhatsApp" value={row.whatsapp} href={waUrl || null} />
                    </div>

                    <div className="rounded-card border border-line bg-band p-4">
                      <div className={cn('mb-1.5', SMALL_LABEL_CLASS)}>Kısa Açıklama</div>
                      <div className="whitespace-pre-wrap leading-relaxed text-ink">
                        {row.short_description || 'Açıklama bırakılmadı.'}
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className={cn('mb-2', SMALL_LABEL_CLASS)}>Admin Notu</div>
                      <textarea
                        value={commentDrafts[row.id] || ''}
                        onChange={(event) =>
                          setCommentDrafts((prev) => ({
                            ...prev,
                            [row.id]: event.target.value,
                          }))
                        }
                        className={cn(ADMIN_CONTROL_CLASS, 'min-h-[90px] py-3')}
                        placeholder="İç not, dönüş notu veya karar gerekçesi..."
                      />
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button variant="success" size="sm" disabled={isBusy} onClick={() => void runAction(row.id, 'approve')}>
                        Onayla
                      </Button>
                      <Button variant="outline" size="sm" disabled={isBusy} onClick={() => void runAction(row.id, 'pending')}>
                        Beklemeye Al
                      </Button>
                      <Button variant="danger" size="sm" disabled={isBusy} onClick={() => void runAction(row.id, 'reject')}>
                        Reddet
                      </Button>
                      <Button variant="danger" size="sm" disabled={isBusy} onClick={() => void runAction(row.id, 'delete')}>
                        Sil
                      </Button>
                    </div>
                  </article>
                );
              })}
          </div>
        )}
      </Card>
    </div>
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
  return (
    <div className="rounded-btn border border-line bg-band px-4 py-3">
      <div className={cn('mb-1.5', SMALL_LABEL_CLASS)}>{label}</div>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all text-brand-700 underline underline-offset-4 hover:text-brand-800"
        >
          {value}
        </a>
      ) : (
        <div className="break-all text-ink">{value}</div>
      )}
    </div>
  );
}
