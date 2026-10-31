import { AdminEmptyState } from '@/components/admin/ui/AdminEmptyState';
import { AdminStatusBadge } from '@/components/admin/ui/AdminStatusBadge';
import { AdminTabs } from '@/components/admin/ui/AdminTabs';
import { AdminTable, AdminTd, AdminTh, AdminThead, AdminTr } from '@/components/admin/ui/AdminTable';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import { escapeHtml, formatDate, normalizeDiscussionStatus } from './api';
import type { DiscussionSectionProps } from './types';

const DISCUSSION_TABS = [
  { key: 'all', label: 'Tümü' },
  { key: 'pending', label: 'Onay Bekleyen' },
  { key: 'approved', label: 'Onaylı' },
] as const;

interface StatTileProps {
  value: number;
  label: string;
}

function StatTile({ value, label }: StatTileProps) {
  return (
    <div className="rounded-card border border-line bg-white p-5 text-center">
      <div className="mb-1 text-2xl font-extrabold text-ink sm:text-[32px]">{value}</div>
      <div className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</div>
    </div>
  );
}

export default function DiscussionSection({
  active,
  showMenu,
  discussionRows,
  discussionTab,
  setDiscussionTab,
  discussionLoading,
  filteredDiscussion,
  runDiscussionAction,
}: DiscussionSectionProps) {
  return (
      <div className={cn(active ? 'block' : 'hidden')}>
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatTile value={discussionRows.length} label="Toplam Konu" />
          <StatTile value={discussionRows.filter(i => normalizeDiscussionStatus(i.status) === 'pending').length} label="Onay Bekleyen" />
          <StatTile value={discussionRows.filter(i => normalizeDiscussionStatus(i.status) === 'approved').length} label="Onaylı" />
          <StatTile value={filteredDiscussion.length} label="Filtre Sonucu" />
        </div>
        <div className="rounded-card border border-line bg-white p-5 sm:p-7">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <h3 className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight text-ink">💬 Yeni Tartışma Konuları</h3>
            <Button variant="outline" size="sm" onClick={showMenu}>← Menüye Dön</Button>
          </div>
          <AdminTabs
            className="mb-5"
            tabs={DISCUSSION_TABS}
            active={discussionTab}
            onChange={setDiscussionTab}
            ariaLabel="Tartışma konusu durumu"
          />
          {discussionLoading ? (
            <div className="p-10 text-center text-muted">
              <div className="mb-4 inline-block h-10 w-10 animate-spin rounded-full border-[3px] border-line border-t-brand-700" />
              <p>Yükleniyor...</p>
            </div>
          ) : (
            <AdminTable caption="Tartışma konuları">
              <AdminThead>
                <AdminTr className="hover:bg-transparent">
                  <AdminTh>Konu</AdminTh>
                  <AdminTh>Gönderen</AdminTh>
                  <AdminTh>Durum</AdminTh>
                  <AdminTh>Tarih</AdminTh>
                  <AdminTh>İşlemler</AdminTh>
                </AdminTr>
              </AdminThead>
              <tbody>
                {filteredDiscussion.length === 0 ? (
                  <AdminTr className="hover:bg-transparent">
                    <AdminTd colSpan={5}>
                      <AdminEmptyState title="Bu kategoride kayıtlı tartışma konusu yok" className="border-0" />
                    </AdminTd>
                  </AdminTr>
                ) : filteredDiscussion.map((item) => {
                  const approved = normalizeDiscussionStatus(item.status) === 'approved';
                  const sender = item.anonymous ? 'Anonim' : (item.full_name || '-');
                  return (
                    <AdminTr key={item.id}>
                      <AdminTd className="min-w-[300px] max-w-[520px] whitespace-pre-wrap break-words leading-snug">
                        {escapeHtml(item.topic || '')}
                      </AdminTd>
                      <AdminTd>
                        {escapeHtml(sender)}
                        {item.anonymous && <span className="mt-1.5 block text-xs text-muted">anonim</span>}
                      </AdminTd>
                      <AdminTd>
                        {approved
                          ? <AdminStatusBadge status="approved" label="✓ Onaylı" />
                          : <AdminStatusBadge status="pending" label="⏳ Onay Bekliyor" />}
                      </AdminTd>
                      <AdminTd>{formatDate(item.created_at)}</AdminTd>
                      <AdminTd>
                        <div className="flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:gap-2">
                          <Button variant="success" size="sm" onClick={() => runDiscussionAction('approve', item.id)} disabled={approved}>✓ Onayla</Button>
                          <Button variant="outline" size="sm" onClick={() => runDiscussionAction('pending', item.id)} disabled={!approved}>⏳ Beklemeye Al</Button>
                          <Button variant="danger" size="sm" onClick={() => runDiscussionAction('delete', item.id)}>🗑 Sil</Button>
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
