'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AdminEmptyState } from '@/components/admin/ui/AdminEmptyState';
import { ADMIN_CONTROL_CLASS, AdminField } from '@/components/admin/ui/AdminField';
import { AdminFilterBar } from '@/components/admin/ui/AdminFilterBar';
import { AdminPageHeader } from '@/components/admin/ui/AdminPageHeader';
import { AdminStatusBadge } from '@/components/admin/ui/AdminStatusBadge';
import { AdminTable, AdminTd, AdminTh, AdminThead, AdminTr } from '@/components/admin/ui/AdminTable';
import { Chip } from '@/components/site/Chip';
import { TONE_STYLES } from '@/components/site/tones';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { getAdminHeaders } from '@/lib/admin/clientAuth';
import { useAdminGate } from '@/hooks/useAdminGate';
import { cn } from '@/lib/utils/cn';

type AgencyStatus = 'all' | 'active' | 'inactive';
type AgencyCategory = 'İş Bulma Ajansları' | 'İngilizce İşe Alan Şirketler' | 'İş ve Kariyer Platformları';

interface AgencyRow {
  id: string;
  name: string;
  url: string;
  description: string;
  category: string | null;
  status: 'active' | 'inactive';
  created_at: string | null;
  updated_at: string | null;
}

interface AgencyStats {
  total: number;
  active: number;
  inactive: number;
}

const AGENCIES_API_URL = '/api/recruitment-agencies-admin-list';
const AGENCIES_ACTION_API_URL = '/api/recruitment-agencies-admin-action';
const CATEGORIES: AgencyCategory[] = [
  'İş Bulma Ajansları',
  'İngilizce İşe Alan Şirketler',
  'İş ve Kariyer Platformları'
];

const initialForm = {
  name: '',
  url: '',
  description: '',
  category: 'İş Bulma Ajansları' as AgencyCategory,
  status: 'active' as 'active' | 'inactive',
};

function formatDate(dateValue: string | null) {
  if (!dateValue) return '-';
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function normalizeStatus(value: string): 'active' | 'inactive' {
  return value === 'active' ? 'active' : 'inactive';
}

export default function RecruitmentAgenciesAdminClient() {
  const gateStatus = useAdminGate();
  const authed = gateStatus === 'authed';

  const [rows, setRows] = useState<AgencyRow[]>([]);
  const [stats, setStats] = useState<AgencyStats>({ total: 0, active: 0, inactive: 0 });
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<AgencyStatus>('all');

  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitError, setSubmitError] = useState('');

  const loadAgencies = useCallback(async (status = statusFilter, query = search) => {
    setListLoading(true);
    setListError('');

    try {
      const params = new URLSearchParams();
      if (status && status !== 'all') params.append('status', status);
      if (query.trim()) params.append('search', query.trim());

      const response = await fetch(`${AGENCIES_API_URL}?${params}`, {
        headers: getAdminHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      setRows(data.agencies || []);
      setStats(data.stats || { total: 0, active: 0, inactive: 0 });
    } catch (error) {
      console.error('Load agencies error:', error);
      setListError(error instanceof Error ? error.message : 'Bilinmeyen hata');
    } finally {
      setListLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    if (authed) {
      loadAgencies();
    }
  }, [authed, loadAgencies]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.url.trim() || !form.description.trim()) {
      setSubmitError('Tüm alanları doldurun');
      return;
    }

    setSubmitLoading(true);
    setSubmitError('');
    setSubmitMessage('');

    try {
      const body = {
        name: form.name.trim(),
        url: form.url.trim(),
        description: form.description.trim(),
        category: form.category,
        status: form.status,
      };

      const response = await fetch(AGENCIES_ACTION_API_URL, {
        method: 'POST',
        headers: {
          ...getAdminHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: editingId ? 'update' : 'create',
          id: editingId || undefined,
          ...body,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      
      if (editingId) {
        setSubmitMessage('Agency güncellendi');
        setRows(prev => prev.map(row => row.id === editingId ? result.agency : row));
      } else {
        setSubmitMessage('Agency eklendi');
        setRows(prev => [result.agency, ...prev]);
      }

      setForm(initialForm);
      setEditingId(null);
      loadAgencies();
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitError(error instanceof Error ? error.message : 'Bilinmeyen hata');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (agency: AgencyRow) => {
    setForm({
      name: agency.name,
      url: agency.url,
      description: agency.description,
      category: agency.category as AgencyCategory || 'İş Bulma Ajansları',
      status: agency.status,
    });
    setEditingId(agency.id);
    setSubmitMessage('');
    setSubmitError('');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu agency silinecek. Emin misiniz?')) return;

    try {
      const response = await fetch(AGENCIES_ACTION_API_URL, {
        method: 'POST',
        headers: {
          ...getAdminHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'delete', id }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      setRows(prev => prev.filter(row => row.id !== id));
      loadAgencies();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Silme hatası: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata'));
    }
  };

  const filteredRows = useMemo(() => {
    return rows.filter(row => {
      const matchesSearch = search.trim() === '' || 
        row.name.toLowerCase().includes(search.toLowerCase()) ||
        row.description.toLowerCase().includes(search.toLowerCase()) ||
        row.url.toLowerCase().includes(search.toLowerCase());
      return matchesSearch;
    });
  }, [rows, search]);

  if (!authed) {
    return (
      <div className="flex items-center justify-center bg-page p-4 py-20 text-ink">
        <div className="text-sm text-muted">Admin oturumu doğrulanıyor...</div>
      </div>
    );
  }

  return (
    <div className="bg-page text-ink">
      <AdminPageHeader
        title="Recruitment Agencies Admin"
        description={`Toplam: ${stats.total} · Aktif: ${stats.active} · Pasif: ${stats.inactive}`}
        actions={
          <Button href="/admin" variant="outline">
            Admin Ana Sayfa
          </Button>
        }
      />

      <div className="space-y-8 px-4 py-8 sm:px-6 lg:px-9">
        {/* Form */}
        <Card>
          <h2 className="mb-4 text-xl font-extrabold tracking-tight text-ink">
            {editingId ? 'Agency Düzenle' : 'Yeni Agency Ekle'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <AdminField label="Agency Adı">
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                  className={ADMIN_CONTROL_CLASS}
                  disabled={submitLoading}
                />
              </AdminField>
              <AdminField label="Website URL">
                <input
                  type="url"
                  value={form.url}
                  onChange={(e) => setForm(prev => ({ ...prev, url: e.target.value }))}
                  className={ADMIN_CONTROL_CLASS}
                  disabled={submitLoading}
                />
              </AdminField>
              <AdminField label="Kategori">
                <select
                  value={form.category}
                  onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value as AgencyCategory }))}
                  className={ADMIN_CONTROL_CLASS}
                  disabled={submitLoading}
                >
                  {CATEGORIES.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </AdminField>
              <AdminField label="Durum">
                <select
                  value={form.status}
                  onChange={(e) => setForm(prev => ({ ...prev, status: normalizeStatus(e.target.value) }))}
                  className={ADMIN_CONTROL_CLASS}
                  disabled={submitLoading}
                >
                  <option value="active">Aktif</option>
                  <option value="inactive">Pasif</option>
                </select>
              </AdminField>
            </div>
            <AdminField label="Açıklama">
              <textarea
                value={form.description}
                onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className={cn(ADMIN_CONTROL_CLASS, 'resize-none py-2')}
                disabled={submitLoading}
              />
            </AdminField>
            <div className="flex gap-4">
              <Button type="submit" disabled={submitLoading}>
                {submitLoading ? 'Kaydediliyor...' : editingId ? 'Güncelle' : 'Ekle'}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setForm(initialForm);
                    setEditingId(null);
                    setSubmitMessage('');
                    setSubmitError('');
                  }}
                >
                  İptal
                </Button>
              )}
            </div>
            {submitMessage && (
              <div className={cn('rounded-btn border px-4 py-3 text-sm', TONE_STYLES.green.tint, TONE_STYLES.green.border, TONE_STYLES.green.text)}>
                {submitMessage}
              </div>
            )}
            {submitError && (
              <div role="alert" className={cn('rounded-btn border px-4 py-3 text-sm', TONE_STYLES.red.tint, TONE_STYLES.red.border, TONE_STYLES.red.text)}>
                {submitError}
              </div>
            )}
          </form>
        </Card>

        {/* Filters */}
        <AdminFilterBar>
          <input
            type="text"
            placeholder="Agency ara..."
            aria-label="Agency ara"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={cn(ADMIN_CONTROL_CLASS, 'min-w-[200px] flex-1')}
          />
          <select
            value={statusFilter}
            aria-label="Durum filtresi"
            onChange={(e) => setStatusFilter(e.target.value as AgencyStatus)}
            className={cn(ADMIN_CONTROL_CLASS, 'w-auto')}
          >
            <option value="all">Tüm Durumlar</option>
            <option value="active">Aktif</option>
            <option value="inactive">Pasif</option>
          </select>
          <Button onClick={() => loadAgencies()} disabled={listLoading} className="whitespace-nowrap">
            {listLoading ? 'Yükleniyor...' : 'Yenile'}
          </Button>
        </AdminFilterBar>

        {listError && (
          <div role="alert" className={cn('rounded-btn border px-4 py-3 text-sm', TONE_STYLES.red.tint, TONE_STYLES.red.border, TONE_STYLES.red.text)}>
            Hata: {listError}
          </div>
        )}

        {/* Agency List */}
        <div className="space-y-4">
          <AdminTable caption="Agency listesi">
            <AdminThead>
              <AdminTr className="hover:bg-transparent">
                <AdminTh>Agency Adı</AdminTh>
                <AdminTh>URL</AdminTh>
                <AdminTh>Kategori</AdminTh>
                <AdminTh>Durum</AdminTh>
                <AdminTh>Tarih</AdminTh>
                <AdminTh>İşlemler</AdminTh>
              </AdminTr>
            </AdminThead>
            <tbody>
              {filteredRows.map((agency) => (
                <AdminTr key={agency.id}>
                  <AdminTd>
                    <div className="font-medium">{agency.name}</div>
                    <div className="line-clamp-2 text-sm text-muted">{agency.description}</div>
                  </AdminTd>
                  <AdminTd>
                    <a
                      href={agency.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-brand-700 hover:underline"
                    >
                      {agency.url.replace('https://', '').replace('http://', '')}
                    </a>
                  </AdminTd>
                  <AdminTd>
                    <Chip tone="brand">{agency.category || '-'}</Chip>
                  </AdminTd>
                  <AdminTd>
                    <AdminStatusBadge
                      status={agency.status}
                      tone={agency.status === 'active' ? 'green' : 'red'}
                      label={agency.status === 'active' ? 'Aktif' : 'Pasif'}
                    />
                  </AdminTd>
                  <AdminTd className="text-muted">{formatDate(agency.created_at)}</AdminTd>
                  <AdminTd>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(agency)}>
                        Düzenle
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleDelete(agency.id)}>
                        Sil
                      </Button>
                    </div>
                  </AdminTd>
                </AdminTr>
              ))}
            </tbody>
          </AdminTable>
          {filteredRows.length === 0 && <AdminEmptyState title="Henüz agency bulunmuyor." />}
        </div>
      </div>
    </div>
  );
}
