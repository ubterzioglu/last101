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

type AgencyStatus = 'all' | 'active' | 'inactive';
type AgencyCategory = 'İş Bulma Ajansları' | 'İngilizce İşe Alan Şirketler';

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
  'İngilizce İşe Alan Şirketler'
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
  const [authed, setAuthed] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');

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

  useEffect(() => {
    const saved = loadAdminAuth();
    if (!saved.password) return;

    verifyAdminKey(saved.password)
      .then(() => setAuthed(true))
      .catch(() => clearAdminAuth());
  }, []);

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

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      await verifyAdminKey(authPassword);
      saveAdminAuth(authPassword);
      setAuthed(true);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Geçersiz şifre');
    } finally {
      setAuthLoading(false);
    }
  };

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
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-8">Recruitment Agencies Admin</h1>
          <form onSubmit={handleAuth} className="space-y-4">
            <input
              type="password"
              placeholder="Admin şifresi"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-google-yellow"
              disabled={authLoading}
            />
            <button
              type="submit"
              disabled={authLoading}
              className="w-full px-4 py-3 bg-google-yellow text-black font-semibold rounded-lg hover:bg-google-yellow/90 disabled:opacity-50"
            >
              {authLoading ? 'Kontrol ediliyor...' : 'Giriş Yap'}
            </button>
            {authError && (
              <div className="text-red-400 text-sm text-center">{authError}</div>
            )}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Recruitment Agencies Admin</h1>
            <div className="flex gap-4 mt-2 text-sm">
              <span>Toplam: {stats.total}</span>
              <span>Aktif: {stats.active}</span>
              <span>Pasif: {stats.inactive}</span>
            </div>
          </div>
          <Link
            href="/admin"
            className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
          >
            Admin Ana Sayfa
          </Link>
        </div>

        {/* Form */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">
            {editingId ? 'Agency Düzenle' : 'Yeni Agency Ekle'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Agency Adı
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-google-yellow"
                  disabled={submitLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Website URL
                </label>
                <input
                  type="url"
                  value={form.url}
                  onChange={(e) => setForm(prev => ({ ...prev, url: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-google-yellow"
                  disabled={submitLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Kategori
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value as AgencyCategory }))}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-google-yellow"
                  disabled={submitLoading}
                >
                  {CATEGORIES.map(category => (
                    <option key={category} value={category} className="bg-black">
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Durum
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm(prev => ({ ...prev, status: normalizeStatus(e.target.value) }))}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-google-yellow"
                  disabled={submitLoading}
                >
                  <option value="active" className="bg-black">Aktif</option>
                  <option value="inactive" className="bg-black">Pasif</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Açıklama
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-google-yellow resize-none"
                disabled={submitLoading}
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitLoading}
                className="px-6 py-2 bg-google-yellow text-black font-semibold rounded-lg hover:bg-google-yellow/90 disabled:opacity-50"
              >
                {submitLoading ? 'Kaydediliyor...' : editingId ? 'Güncelle' : 'Ekle'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setForm(initialForm);
                    setEditingId(null);
                    setSubmitMessage('');
                    setSubmitError('');
                  }}
                  className="px-6 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  İptal
                </button>
              )}
            </div>
            {submitMessage && (
              <div className="text-google-yellow text-sm">{submitMessage}</div>
            )}
            {submitError && (
              <div className="text-red-400 text-sm">{submitError}</div>
            )}
          </form>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Agency ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-google-yellow"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as AgencyStatus)}
            className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-google-yellow"
          >
            <option value="all" className="bg-black">Tüm Durumlar</option>
            <option value="active" className="bg-black">Aktif</option>
            <option value="inactive" className="bg-black">Pasif</option>
          </select>
          <button
            onClick={() => loadAgencies()}
            disabled={listLoading}
            className="px-6 py-3 bg-google-blue text-white rounded-lg hover:bg-google-blue/90 disabled:opacity-50 whitespace-nowrap"
          >
            {listLoading ? 'Yükleniyor...' : 'Yenile'}
          </button>
        </div>

        {listError && (
          <div className="text-red-400 mb-4">Hata: {listError}</div>
        )}

        {/* Agency List */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/10">
                <tr>
                  <th className="text-left px-6 py-4 font-medium">Agency Adı</th>
                  <th className="text-left px-6 py-4 font-medium">URL</th>
                  <th className="text-left px-6 py-4 font-medium">Kategori</th>
                  <th className="text-left px-6 py-4 font-medium">Durum</th>
                  <th className="text-left px-6 py-4 font-medium">Tarih</th>
                  <th className="text-left px-6 py-4 font-medium">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((agency) => (
                  <tr key={agency.id} className="border-t border-white/10 hover:bg-white/5">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium">{agency.name}</div>
                        <div className="text-sm text-white/60 line-clamp-2">
                          {agency.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={agency.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-google-blue hover:underline text-sm"
                      >
                        {agency.url.replace('https://', '').replace('http://', '')}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-google-blue/20 text-google-blue">
                        {agency.category || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          agency.status === 'active'
                            ? 'bg-google-green/20 text-google-green'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {agency.status === 'active' ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-white/60">
                      {formatDate(agency.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(agency)}
                          className="px-3 py-1 text-sm bg-google-yellow/20 text-google-yellow rounded hover:bg-google-yellow/30"
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() => handleDelete(agency.id)}
                          className="px-3 py-1 text-sm bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
                        >
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredRows.length === 0 && (
            <div className="text-center py-12 text-white/60">
              Henüz agency bulunmuyor.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}