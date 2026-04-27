'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { getAdminHeaders } from '@/lib/admin/clientAuth';
import { normalizeFounderStatus } from '@/lib/founder';

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
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error((payload as { error?: string }).error || 'Founder kayıtları yüklenemedi.');
        }

        const items = Array.isArray((payload as { items?: FounderSubmissionRow[] }).items)
          ? ((payload as { items: FounderSubmissionRow[] }).items)
          : [];
        setRows(items);
        setStats({
          total: Number((payload as any)?.stats?.total || 0),
          pending: Number((payload as any)?.stats?.pending || 0),
          approved: Number((payload as any)?.stats?.approved || 0),
          rejected: Number((payload as any)?.stats?.rejected || 0),
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

  return (
    <div className="section active">
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-value">{stats.total}</div><div className="stat-label">Toplam Başvuru</div></div>
        <div className="stat-card"><div className="stat-value">{stats.pending}</div><div className="stat-label">Bekleyen</div></div>
        <div className="stat-card"><div className="stat-value">{stats.approved}</div><div className="stat-label">Onaylı</div></div>
        <div className="stat-card"><div className="stat-value">{stats.rejected}</div><div className="stat-label">Reddedilen</div></div>
      </div>

      <div className="card">
        <div className="section-header">
          <h3 className="section-title">🚀 Founder Başvuruları</h3>
          <button className="back-btn" onClick={onBack}>← Menüye Dön</button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 18 }}>
          <div className="tabs" style={{ marginBottom: 0 }}>
            {(['all', 'pending', 'approved', 'rejected'] as FounderSubmissionStatusFilter[]).map((tab) => (
              <button
                key={tab}
                className={`tab-btn ${statusFilter === tab ? 'active' : ''}`}
                onClick={() => setStatusFilter(tab)}
              >
                {tab === 'all' ? 'Tümü' : tab === 'pending' ? 'Bekleyen' : tab === 'approved' ? 'Onaylı' : 'Reddedilen'}
              </button>
            ))}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{visibleCountLabel}</div>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="İsim, proje, WhatsApp veya LinkedIn ara..."
            style={{ flex: 1, minWidth: 240, padding: '10px 12px', border: '1px solid var(--glass-border)', borderRadius: 10, background: 'rgba(255,255,255,0.04)', color: 'var(--text-primary)', outline: 'none' }}
          />
          <button className="action-btn view" onClick={() => void loadRows(statusFilter, search)}>Filtrele</button>
          <button className="action-btn approve" onClick={() => void loadRows()}>Yenile</button>
        </div>

        {error ? (
          <div className="auth-error" style={{ marginBottom: 16 }}>{error}</div>
        ) : null}

        {listLoading ? (
          <div className="loading"><div className="loading-spinner" /><p>Founder başvuruları yükleniyor...</p></div>
        ) : rows.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">🚀</div><p>Bu filtre için founder kaydı yok.</p></div>
        ) : (
          <div style={{ display: 'grid', gap: 16 }}>
            {rows
              .filter((row) => statusFilter === 'all' || normalizeFounderStatus(row.status) === statusFilter)
              .map((row) => {
                const status = normalizeFounderStatus(row.status);
                const isBusy = busyIds.includes(row.id);
                const waUrl = buildWaUrl(row.whatsapp);
                return (
                  <article key={row.id} className="card" style={{ padding: 22 }}>
                    <div className="section-header" style={{ marginBottom: 14 }}>
                      <div>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                          <span className={`status-badge ${status === 'approved' ? 'approved' : status === 'rejected' ? 'review' : 'pending'}`}>
                            {status === 'approved' ? 'Onaylı' : status === 'rejected' ? 'Reddedildi' : 'Onay Bekliyor'}
                          </span>
                          <span className="status-badge muted">{formatDate(row.created_at)}</span>
                        </div>
                        <h4 style={{ fontSize: 24, margin: 0 }}>{row.full_name || 'İsimsiz kayıt'}</h4>
                        <div style={{ color: 'var(--text-secondary)', marginTop: 6 }}>{row.project_name || 'Proje adı belirtilmedi'}</div>
                      </div>
                      {status === 'approved' ? (
                        <button className="action-btn view" onClick={() => void copySurveyLink(row)}>
                          Survey Linkini Kopyala
                        </button>
                      ) : null}
                    </div>

                    <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginBottom: 14 }}>
                      <InfoChip label="LinkedIn" value={row.linkedin_url} href={row.linkedin_url} />
                      <InfoChip label="WhatsApp" value={row.whatsapp} href={waUrl || null} />
                    </div>

                    <div style={{ border: '1px solid var(--glass-border)', borderRadius: 14, padding: 14, background: 'rgba(255,255,255,0.03)' }}>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Kısa Açıklama
                      </div>
                      <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{row.short_description || 'Açıklama bırakılmadı.'}</div>
                    </div>

                    <div style={{ marginTop: 14 }}>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Admin Notu
                      </div>
                      <textarea
                        value={commentDrafts[row.id] || ''}
                        onChange={(event) =>
                          setCommentDrafts((prev) => ({
                            ...prev,
                            [row.id]: event.target.value,
                          }))
                        }
                        style={{ width: '100%', minHeight: 90, borderRadius: 12, border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.04)', color: '#fff', padding: '12px 14px', outline: 'none' }}
                        placeholder="İç not, dönüş notu veya karar gerekçesi..."
                      />
                    </div>

                    <div className="action-btns" style={{ marginTop: 14 }}>
                      <button className="action-btn approve" disabled={isBusy} onClick={() => void runAction(row.id, 'approve')}>
                        Onayla
                      </button>
                      <button className="action-btn view" disabled={isBusy} onClick={() => void runAction(row.id, 'pending')}>
                        Beklemeye Al
                      </button>
                      <button className="action-btn reject" disabled={isBusy} onClick={() => void runAction(row.id, 'reject')}>
                        Reddet
                      </button>
                      <button className="action-btn reject" disabled={isBusy} onClick={() => void runAction(row.id, 'delete')}>
                        Sil
                      </button>
                    </div>
                  </article>
                );
              })}
          </div>
        )}
      </div>
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
    <div style={{ border: '1px solid var(--glass-border)', borderRadius: 12, padding: '12px 14px', background: 'rgba(255,255,255,0.03)' }}>
      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {label}
      </div>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: '#8ab4f8', textDecoration: 'none', wordBreak: 'break-all' }}>
          {value}
        </a>
      ) : (
        <div style={{ wordBreak: 'break-all' }}>{value}</div>
      )}
    </div>
  );
}
