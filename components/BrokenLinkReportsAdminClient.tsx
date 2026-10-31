'use client';

import { useMemo, useState } from 'react';
import { AdminEmptyState } from '@/components/admin/ui/AdminEmptyState';
import { ADMIN_CONTROL_CLASS } from '@/components/admin/ui/AdminField';
import { AdminFilterBar } from '@/components/admin/ui/AdminFilterBar';
import { AdminPageHeader } from '@/components/admin/ui/AdminPageHeader';
import { AdminTable, AdminTd, AdminTh, AdminThead, AdminTr } from '@/components/admin/ui/AdminTable';
import { TONE_STYLES } from '@/components/site/tones';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import { getErrorMessage, postAdminAction } from '@/lib/admin/adminResource';
import { useAdminGate } from '@/hooks/useAdminGate';
import { useAdminResource } from '@/hooks/useAdminResource';

interface BrokenLinkReport {
  id: number;
  agency_id: string | null;
  agency_name: string;
  report_text: string;
  created_at: string;
  updated_at: string;
}

interface ReportsResponse {
  reports?: BrokenLinkReport[];
}

const REPORTS_API_URL = '/api/broken-link-reports-admin-list';
const REPORTS_ACTION_API_URL = '/api/broken-link-reports-admin-action';

function selectReports(payload: unknown): BrokenLinkReport[] {
  return (payload as ReportsResponse).reports || [];
}

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
  const gateStatus = useAdminGate();
  const authed = gateStatus === 'authed';

  const [search, setSearch] = useState('');
  const {
    data: reports,
    setData: setReports,
    loading: listLoading,
    error: listError,
    reload: loadReports,
  } = useAdminResource({
    url: REPORTS_API_URL,
    query: { search },
    enabled: authed,
    initialData: [],
    select: selectReports,
    errorLogLabel: 'Load reports error:',
  });

  const handleDelete = async (id: number) => {
    if (!confirm('Bu rapor silinecek. Emin misiniz?')) return;

    try {
      await postAdminAction(REPORTS_ACTION_API_URL, { action: 'delete', id });
      setReports(prev => prev.filter(report => report.id !== id));
    } catch (error) {
      console.error('Delete error:', error);
      alert('Silme hatası: ' + getErrorMessage(error));
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
      <div className="flex items-center justify-center bg-page p-4 py-20 text-ink">
        <div className="text-sm text-muted">Admin oturumu doğrulanıyor...</div>
      </div>
    );
  }

  return (
    <div className="bg-page text-ink">
      <AdminPageHeader
        title="Kırık Link Bildirimleri Admin"
        description={`Toplam: ${reports.length}`}
        actions={
          <Button href="/admin" variant="outline">
            Admin Ana Sayfa
          </Button>
        }
      />

      <div className="space-y-6 px-4 py-8 sm:px-6 lg:px-9">
        {/* Filters */}
        <AdminFilterBar>
          <input
            type="text"
            placeholder="Rapor ara..."
            aria-label="Rapor ara"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={cn(ADMIN_CONTROL_CLASS, 'min-w-[200px] flex-1')}
          />
          <Button onClick={() => loadReports()} disabled={listLoading} className="whitespace-nowrap">
            {listLoading ? 'Yükleniyor...' : 'Yenile'}
          </Button>
        </AdminFilterBar>

        {listError && (
          <div
            role="alert"
            className={cn('rounded-btn border px-4 py-3 text-sm', TONE_STYLES.red.tint, TONE_STYLES.red.border, TONE_STYLES.red.text)}
          >
            Hata: {listError}
          </div>
        )}

        {/* Reports List */}
        <AdminTable caption="Kırık link bildirimleri">
          <AdminThead>
            <AdminTr className="hover:bg-transparent">
              <AdminTh>ID</AdminTh>
              <AdminTh>Agency Adı</AdminTh>
              <AdminTh>Rapor</AdminTh>
              <AdminTh>Tarih</AdminTh>
              <AdminTh>İşlemler</AdminTh>
            </AdminTr>
          </AdminThead>
          <tbody>
            {filteredReports.map((report) => (
              <AdminTr key={report.id}>
                <AdminTd className="text-muted">{report.id}</AdminTd>
                <AdminTd>
                  <div className="font-medium">{report.agency_name}</div>
                </AdminTd>
                <AdminTd>
                  <div className="line-clamp-2 text-sm text-ink">{report.report_text}</div>
                </AdminTd>
                <AdminTd className="text-muted">{formatDate(report.created_at)}</AdminTd>
                <AdminTd>
                  <div className="flex gap-2">
                    <Button size="sm" variant="danger" onClick={() => handleDelete(report.id)}>
                      Sil
                    </Button>
                  </div>
                </AdminTd>
              </AdminTr>
            ))}
          </tbody>
        </AdminTable>
        {filteredReports.length === 0 && <AdminEmptyState title="Henüz rapor bulunmuyor." />}
      </div>
    </div>
  );
}
