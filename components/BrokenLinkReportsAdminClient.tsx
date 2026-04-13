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

interface BrokenLinkReport {
  id: number;
  agency_id: string | null;
  agency_name: string;
  report_text: string;
  created_at: string;
  updated_at: string;
}

const REPORTS_API_URL = '/api/broken-link-reports-admin-list';
const REPORTS_ACTION_API_URL = '/api/broken-link-reports-admin-action';

function formatDate(dateValue: string) {
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

export default function BrokenLinkReportsAdminClient() {
  const [authed, setAuthed] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [reports, setReports] = useState<BrokenLinkReport[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const saved = loadAdminAuth();
    if (!saved.password) return;

    verifyAdminKey(saved.password)
      .then(() => setAuthed(true))
      .catch(() => clearAdminAuth());
  }, []);

  const loadReports = useCallback(async () => {
    setListLoading(true);
    setListError('');

    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());

      const response = await fetch(`${REPORTS_API_URL}?${params}`, {
        headers: getAdminHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      setReports(data.reports || []);
    } catch (error) {
      console.error('Load reports error:', error);
      setListError(error instanceof Error ? error.message : 'Bilinmeyen hata');
    } finally {
      setListLoading(false);
    }
  }, [search]);

  useEffect(() => {
    if (authed) {
      loadReports();
    }
  }, [authed, loadReports]);

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

  const handleDelete = async (id: number) => {
    if (!confirm('Bu rapor silinecek. Emin misiniz?')) return;

    try {
      const response = await fetch(REPORTS_ACTION_API_URL, {
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

      setReports(prev => prev.filter(report => report.id !== id));
    } catch (error) {
      console.error('Delete error:', error);
      alert('Silme hatası: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata'));
    }
  };

  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      const matchesSearch = search.trim() === '' || 
        report.agency_name.toLowerCase().includes(search.toLowerCase()) ||
        report.report_text.toLowerCase().includes(search.toLowerCase());
      return matchesSearch;
    });
  }, [reports, search]);

  if (!authed) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-8">Kırık Link Bildirimleri Admin</h1>
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
            <h1 className="text-3xl font-bold">Kırık Link Bildirimleri Admin</h1>
            <div className="flex gap-4 mt-2 text-sm">
              <span>Toplam: {reports.length}</span>
            </div>
          </div>
          <Link
            href="/admin"
            className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
          >
            Admin Ana Sayfa
          </Link>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Rapor ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-google-yellow"
          />
          <button
            onClick={() => loadReports()}
            disabled={listLoading}
            className="px-6 py-3 bg-google-blue text-white rounded-lg hover:bg-google-blue/90 disabled:opacity-50 whitespace-nowrap"
          >
            {listLoading ? 'Yükleniyor...' : 'Yenile'}
          </button>
        </div>

        {listError && (
          <div className="text-red-400 mb-4">Hata: {listError}</div>
        )}

        {/* Reports List */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/10">
                <tr>
                  <th className="text-left px-6 py-4 font-medium">ID</th>
                  <th className="text-left px-6 py-4 font-medium">Agency Adı</th>
                  <th className="text-left px-6 py-4 font-medium">Rapor</th>
                  <th className="text-left px-6 py-4 font-medium">Tarih</th>
                  <th className="text-left px-6 py-4 font-medium">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report) => (
                  <tr key={report.id} className="border-t border-white/10 hover:bg-white/5">
                    <td className="px-6 py-4 text-sm text-white/60">
                      {report.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{report.agency_name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-white/80 line-clamp-2">
                        {report.report_text}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-white/60">
                      {formatDate(report.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDelete(report.id)}
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
          {filteredReports.length === 0 && (
            <div className="text-center py-12 text-white/60">
              Henüz rapor bulunmuyor.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
