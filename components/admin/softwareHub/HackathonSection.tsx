import { AdminEmptyState } from '@/components/admin/ui/AdminEmptyState';
import { AdminStatusBadge } from '@/components/admin/ui/AdminStatusBadge';
import { AdminTabs } from '@/components/admin/ui/AdminTabs';
import { AdminTable, AdminTd, AdminTh, AdminThead, AdminTr } from '@/components/admin/ui/AdminTable';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import { escapeHtml, formatDate } from './api';
import type { HackathonSectionProps } from './types';

export default function HackathonSection({
  active,
  showMenu,
  hackathonParticipants,
  hackathonTab,
  setHackathonTab,
  filteredHackathon,
  runParticipantAdminAction,
  loadHackathonData,
}: HackathonSectionProps) {
  const statCards = [
    { label: 'Toplam Kayıt', value: hackathonParticipants.length },
    { label: 'Onaylı', value: hackathonParticipants.filter((p) => p.approved).length },
    { label: 'Onay Bekleyen', value: hackathonParticipants.filter((p) => !p.approved).length },
  ];
  const tabs = ['all', 'pending', 'approved'].map((t) => ({
    key: t,
    label: t === 'all' ? 'Tümü' : t === 'pending' ? 'Onay Bekleyen' : 'Onaylı',
  }));

  return (
    <div className={cn(active ? 'block' : 'hidden')}>
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-card border border-line bg-white p-5 text-center">
            <div className="mb-1 text-[32px] font-extrabold leading-tight text-ink">{card.value}</div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted">{card.label}</div>
          </div>
        ))}
      </div>
      <div className="rounded-card border border-line bg-white p-5 sm:p-7">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h3 className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight text-ink">💻 Vibecoding Takım Yönetimi</h3>
          <Button variant="outline" size="sm" className="min-h-[44px]" onClick={showMenu}>← Menüye Dön</Button>
        </div>
        <AdminTabs tabs={tabs} active={hackathonTab} onChange={setHackathonTab} className="mb-5" />
        <AdminTable>
          <AdminThead>
            <AdminTr><AdminTh>#</AdminTh><AdminTh>Takım/İsim</AdminTh><AdminTh>WhatsApp</AdminTh><AdminTh>Kayıt Tarihi</AdminTh><AdminTh>Durum</AdminTh><AdminTh>İşlemler</AdminTh></AdminTr>
          </AdminThead>
          <tbody>
            {filteredHackathon.length === 0 ? (
              <AdminTr><AdminTd colSpan={6}><AdminEmptyState title="Bu kategoride kayıtlı katılımcı yok" className="border-0" /></AdminTd></AdminTr>
            ) : filteredHackathon.map((p) => (
              <AdminTr key={p.id}>
                <AdminTd>{hackathonParticipants.indexOf(p) + 1}</AdminTd>
                <AdminTd><div className="text-[15px] font-semibold">{escapeHtml(p.name)}</div></AdminTd>
                <AdminTd>{p.whatsapp ? escapeHtml(p.whatsapp) : '-'}</AdminTd>
                <AdminTd>{formatDate(p.created_at)}</AdminTd>
                <AdminTd>{p.approved ? <AdminStatusBadge status="approved" label="✓ Onaylı" /> : <AdminStatusBadge status="pending" label="⏳ Onay Bekliyor" />}</AdminTd>
                <AdminTd>
                  <div className="flex flex-wrap gap-2">
                    {!p.approved
                      ? <Button variant="success" size="sm" className="min-h-[44px]" onClick={() => runParticipantAdminAction('vct', 'approve', p.id, loadHackathonData)}>✓ Onayla</Button>
                      : <Button variant="danger" size="sm" className="min-h-[44px]" onClick={() => { if (confirm('Onayı iptal etmek istediğinize emin misiniz?')) runParticipantAdminAction('vct', 'unapprove', p.id, loadHackathonData); }}>✗ İptal</Button>}
                    <Button variant="danger" size="sm" className="min-h-[44px]" onClick={() => { if (confirm('Bu katılımcıyı silmek istediğinize emin misiniz?')) runParticipantAdminAction('vct', 'delete', p.id, loadHackathonData); }}>🗑 Sil</Button>
                  </div>
                </AdminTd>
              </AdminTr>
            ))}
          </tbody>
        </AdminTable>
      </div>
    </div>
  );
}
