import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { AdminEmptyState } from '@/components/admin/ui/AdminEmptyState';
import { AdminStatusBadge } from '@/components/admin/ui/AdminStatusBadge';
import { AdminTable, AdminTd, AdminTh, AdminThead, AdminTr } from '@/components/admin/ui/AdminTable';
import { AdminTabs } from '@/components/admin/ui/AdminTabs';
import { cn } from '@/lib/utils/cn';
import { escapeHtml, formatDate } from './api';
import type { PromoteSectionProps } from './types';

const PROMOTE_TABS = [
  { key: 'all', label: 'Tümü' },
  { key: 'pending', label: 'Onay Bekleyen' },
  { key: 'approved', label: 'Onaylı' },
] as const;

interface PromoteStatProps {
  value: number;
  label: string;
}

function PromoteStat({ value, label }: PromoteStatProps) {
  return (
    <div className="rounded-card border border-line bg-white p-5 text-center">
      <div className="mb-1 text-[28px] font-extrabold leading-none text-ink">{value}</div>
      <div className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</div>
    </div>
  );
}

export default function PromoteSection({
  active,
  showMenu,
  promoteParticipants,
  promoteTab,
  setPromoteTab,
  filteredPromote,
  runParticipantAdminAction,
  loadPromoteData,
}: PromoteSectionProps) {
  return (
    <div className={cn(active ? 'block' : 'hidden')}>
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <PromoteStat value={promoteParticipants.length} label="Toplam Kayıt" />
        <PromoteStat value={promoteParticipants.filter((p) => p.approved).length} label="Onaylı" />
        <PromoteStat value={promoteParticipants.filter((p) => !p.approved).length} label="Onay Bekleyen" />
      </div>
      <Card>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h3 className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight text-ink">
            📢 Promote Your Product Yönetimi
          </h3>
          <Button variant="outline" size="sm" className="min-h-[44px]" onClick={showMenu}>
            ← Menüye Dön
          </Button>
        </div>
        <AdminTabs
          className="mb-4"
          tabs={PROMOTE_TABS}
          active={promoteTab}
          onChange={setPromoteTab}
          ariaLabel="Promote kayıt filtreleri"
        />
        <AdminTable>
          <AdminThead>
            <AdminTr className="hover:bg-transparent">
              <AdminTh>#</AdminTh>
              <AdminTh>Katılımcı</AdminTh>
              <AdminTh>Ürün/Proje</AdminTh>
              <AdminTh>WhatsApp</AdminTh>
              <AdminTh>Kayıt Tarihi</AdminTh>
              <AdminTh>Durum</AdminTh>
              <AdminTh>İşlemler</AdminTh>
            </AdminTr>
          </AdminThead>
          <tbody>
            {filteredPromote.length === 0 ? (
              <AdminTr className="hover:bg-transparent">
                <AdminTd colSpan={7}>
                  <AdminEmptyState title="📢 Bu kategoride kayıtlı katılımcı yok" />
                </AdminTd>
              </AdminTr>
            ) : (
              filteredPromote.map((p) => (
                <AdminTr key={p.id}>
                  <AdminTd>{promoteParticipants.indexOf(p) + 1}</AdminTd>
                  <AdminTd>
                    <div className="font-semibold text-ink">{escapeHtml(p.name)}</div>
                  </AdminTd>
                  <AdminTd>
                    <div className="font-semibold text-ink">{escapeHtml(p.product_name || '-')}</div>
                    <div className="max-w-[200px] truncate text-xs text-muted">{escapeHtml(p.product_desc || '')}</div>
                  </AdminTd>
                  <AdminTd>{p.whatsapp ? escapeHtml(p.whatsapp) : '-'}</AdminTd>
                  <AdminTd>{formatDate(p.created_at)}</AdminTd>
                  <AdminTd>
                    {p.approved ? (
                      <AdminStatusBadge status="approved" label="✓ Onaylı" />
                    ) : (
                      <AdminStatusBadge status="pending" label="⏳ Onay Bekliyor" />
                    )}
                  </AdminTd>
                  <AdminTd>
                    <div className="flex flex-wrap gap-2">
                      {!p.approved ? (
                        <Button
                          size="sm"
                          variant="success"
                          className="min-h-[44px]"
                          onClick={() => runParticipantAdminAction('promote', 'approve', p.id, loadPromoteData)}
                        >
                          ✓ Onayla
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="danger"
                          className="min-h-[44px]"
                          onClick={() => {
                            if (confirm('Onayı iptal etmek istediğinize emin misiniz?'))
                              runParticipantAdminAction('promote', 'unapprove', p.id, loadPromoteData);
                          }}
                        >
                          ✗ İptal
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="danger"
                        className="min-h-[44px]"
                        onClick={() => {
                          if (confirm('Bu katılımcıyı silmek istediğinize emin misiniz?'))
                            runParticipantAdminAction('promote', 'delete', p.id, loadPromoteData);
                        }}
                      >
                        🗑 Sil
                      </Button>
                    </div>
                  </AdminTd>
                </AdminTr>
              ))
            )}
          </tbody>
        </AdminTable>
      </Card>
    </div>
  );
}
