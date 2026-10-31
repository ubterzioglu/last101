import { escapeHtml, formatDate, normalizeNewsStatus, normalizeNewsCategory, errorMessage, GENERIC_ERROR_MESSAGE } from './api';
import type { NewsSectionProps } from './types';
import NewsCategorySelect from './NewsCategorySelect';
import { Button } from '@/components/ui/Button';
import { ADMIN_CONTROL_CLASS } from '@/components/admin/ui/AdminField';
import { AdminEmptyState } from '@/components/admin/ui/AdminEmptyState';
import { AdminFilterBar } from '@/components/admin/ui/AdminFilterBar';
import { AdminStatusBadge } from '@/components/admin/ui/AdminStatusBadge';
import { AdminTable, AdminThead, AdminTh, AdminTr, AdminTd } from '@/components/admin/ui/AdminTable';
import { AdminTabs } from '@/components/admin/ui/AdminTabs';
import { cn } from '@/lib/utils/cn';

const NEWS_TABS = [
  { key: 'all', label: 'Tümü' },
  { key: 'draft', label: 'Taslak' },
  { key: 'published', label: 'Yayında' },
] as const;

interface NewsStatCardProps {
  value: number;
  label: string;
}

function NewsStatCard({ value, label }: NewsStatCardProps) {
  return (
    <div className="rounded-card border border-line bg-white p-5 text-center">
      <div className="mb-1 text-[28px] font-extrabold leading-none text-ink">{value}</div>
      <div className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</div>
    </div>
  );
}

export default function NewsSection({
  active,
  showMenu,
  newsRows,
  newsStats,
  newsTab,
  setNewsTab,
  newsSearch,
  setNewsSearch,
  newsLoading,
  loadNewsAdminData,
  runNewsAdminAction,
}: NewsSectionProps) {
  return (
      <div className={cn(active ? 'block' : 'hidden')}>
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <NewsStatCard value={newsStats.total} label="Toplam Haber" />
          <NewsStatCard value={newsStats.draft} label="Taslak" />
          <NewsStatCard value={newsStats.published} label="Yayında" />
          <NewsStatCard value={newsRows.length} label="Filtre Sonucu" />
        </div>
        <div className="rounded-card border border-line bg-white p-5 md:p-7">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <h3 className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight text-ink">📰 Haber Yönetimi</h3>
            <Button variant="outline" size="sm" className="min-h-[44px]" onClick={showMenu}>← Menüye Dön</Button>
          </div>
          <AdminTabs
            className="mb-5"
            ariaLabel="Haber durumu"
            tabs={NEWS_TABS}
            active={newsTab}
            onChange={(t) => { setNewsTab(t); loadNewsAdminData(t, newsSearch); }}
          />
          <AdminFilterBar className="mb-4">
            <input
              type="text"
              placeholder="Başlıkta ara..."
              aria-label="Başlıkta ara"
              value={newsSearch}
              onChange={(e) => {
                setNewsSearch(e.target.value);
                setTimeout(() => loadNewsAdminData(newsTab, e.target.value), 260);
              }}
              className={cn(ADMIN_CONTROL_CLASS, 'min-w-[220px] flex-1')}
            />
            <Button variant="outline" size="sm" className="min-h-[44px]" onClick={() => loadNewsAdminData()}>Yenile</Button>
          </AdminFilterBar>
          {newsLoading ? (
            <div role="status" className="p-10 text-center text-muted">
              <div className="mb-4 inline-block size-10 animate-spin rounded-full border-[3px] border-line border-t-brand-700" />
              <p>Yükleniyor...</p>
            </div>
          ) : (
            <AdminTable caption="Haber listesi">
              <AdminThead>
                <AdminTr><AdminTh>Başlık</AdminTh><AdminTh>Kategori</AdminTh><AdminTh>Durum</AdminTh><AdminTh>Tarih</AdminTh><AdminTh>İşlemler</AdminTh></AdminTr>
              </AdminThead>
              <tbody>
                {newsRows.length === 0 ? (
                  <tr><AdminTd colSpan={5}><AdminEmptyState title="Bu filtre için haber bulunamadı" className="border-0" /></AdminTd></tr>
                ) : newsRows.map((item, index) => {
                  const status = normalizeNewsStatus(item.status);
                  const publishedDate = item.published_at || item.created_at;
                  const categories = ['Almanya', 'Türkiye', 'Avrupa', 'Dünya'];
                  const selectedCat = normalizeNewsCategory(item.category);
                  return (
                    <AdminTr key={item.id}>
                      <AdminTd>
                        <div className="mb-1 font-semibold text-ink">{escapeHtml(item.title || '(Başlıksız)')}</div>
                        {item.summary && <div className="mt-1.5 block text-xs text-muted">{escapeHtml(item.summary)}</div>}
                      </AdminTd>
                      <AdminTd>
                        <div className="flex flex-wrap items-center gap-2">
                          <NewsCategorySelect item={item} index={index} selectedCat={selectedCat} categories={categories} onSave={async (id, category) => { try { await runNewsAdminAction({ action: 'set_category', id, category }); } catch (err) { alert(errorMessage(err, GENERIC_ERROR_MESSAGE)); } }} />
                        </div>
                      </AdminTd>
                      <AdminTd>{status === 'published' ? <AdminStatusBadge status="approved" label="✓ Yayında" /> : <AdminStatusBadge status="pending" label="⏳ Taslak" />}</AdminTd>
                      <AdminTd>{formatDate(publishedDate)}</AdminTd>
                      <AdminTd>
                        <div className="flex flex-wrap gap-2">
                          {status === 'published'
                            ? <Button variant="outline" size="sm" className="min-h-[44px]" onClick={async () => { try { await runNewsAdminAction({ action: 'set_status', id: item.id, status: 'draft' }); } catch (err) { alert(errorMessage(err, GENERIC_ERROR_MESSAGE)); } }}>Taslağa Al</Button>
                            : <Button variant="success" size="sm" className="min-h-[44px]" onClick={async () => { try { await runNewsAdminAction({ action: 'set_status', id: item.id, status: 'published' }); } catch (err) { alert(errorMessage(err, GENERIC_ERROR_MESSAGE)); } }}>Yayınla</Button>}
                          <Button variant="danger" size="sm" className="min-h-[44px]" onClick={async () => { if (!confirm('Bu haberi tamamen silmek istediğinize emin misiniz?')) return; try { await runNewsAdminAction({ action: 'delete', id: item.id }); } catch (err) { alert(errorMessage(err, GENERIC_ERROR_MESSAGE)); } }}>Sil</Button>
                        </div>
                      </AdminTd>
                    </AdminTr>
                  );
                })}
              </tbody>
            </AdminTable>
          )}
        </div>
      </div>
  );
}
