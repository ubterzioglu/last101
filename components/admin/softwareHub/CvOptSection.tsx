import { AdminEmptyState } from '@/components/admin/ui/AdminEmptyState';
import { AdminStatusBadge } from '@/components/admin/ui/AdminStatusBadge';
import { AdminTabs } from '@/components/admin/ui/AdminTabs';
import { AdminTable, AdminTd, AdminTh, AdminThead, AdminTr } from '@/components/admin/ui/AdminTable';
import { TONE_STYLES } from '@/components/site/tones';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import { escapeHtml, formatDate, normalizeLinkedinUrl, buildWaMeUrl } from './api';
import type { CvOptSectionProps } from './types';

const CONTACT_LINK_BASE =
  'inline-flex min-h-[28px] items-center rounded-full border px-2.5 text-[11px] font-semibold leading-none whitespace-nowrap transition-colors';
const LINKEDIN_LINK_CLASS = 'border-brand-700/30 bg-brand-50 text-brand-800 hover:bg-brand-100';
const WHATSAPP_LINK_CLASS = cn(
  TONE_STYLES.green.tint,
  TONE_STYLES.green.border,
  TONE_STYLES.green.text,
  'hover:bg-alm-green/20'
);

const ACTION_BTN_CLASS = 'min-h-[44px]';

const CVOPT_TABS = [
  { key: 'all', label: 'Tümü' },
  { key: 'pending', label: 'Onay Bekleyen' },
  { key: 'approved', label: 'Onaylı' },
] as const;

export default function CvOptSection({
  active,
  showMenu,
  cvoptParticipants,
  cvoptTab,
  setCvoptTab,
  filteredCvopt,
  runParticipantAdminAction,
  loadCvoptData,
}: CvOptSectionProps) {
  return (
      <div className={active ? 'block' : 'hidden'}>
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-card border border-line bg-white p-5 text-center"><div className="mb-1 text-2xl font-extrabold text-ink md:text-[32px]">{cvoptParticipants.length}</div><div className="text-xs font-semibold uppercase tracking-wider text-muted">Toplam Kayıt</div></div>
          <div className="rounded-card border border-line bg-white p-5 text-center"><div className="mb-1 text-2xl font-extrabold text-ink md:text-[32px]">{cvoptParticipants.filter(p => p.approved).length}</div><div className="text-xs font-semibold uppercase tracking-wider text-muted">Onaylı</div></div>
          <div className="rounded-card border border-line bg-white p-5 text-center"><div className="mb-1 text-2xl font-extrabold text-ink md:text-[32px]">{cvoptParticipants.filter(p => !p.approved).length}</div><div className="text-xs font-semibold uppercase tracking-wider text-muted">Onay Bekleyen</div></div>
        </div>
        <div className="rounded-card border border-line bg-white p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <h3 className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight text-ink">📄 CV + LinkedIn İyileştirme Başvuruları</h3>
            <Button type="button" variant="outline" onClick={showMenu}>← Menüye Dön</Button>
          </div>
          <AdminTabs
            className="mb-5"
            tabs={CVOPT_TABS}
            active={cvoptTab}
            onChange={setCvoptTab}
          />
          <AdminTable>
            <AdminThead><AdminTr><AdminTh>#</AdminTh><AdminTh>Kullanıcı</AdminTh><AdminTh>Tarih</AdminTh><AdminTh>Durum</AdminTh><AdminTh>İşlem</AdminTh></AdminTr></AdminThead>
            <tbody>
              {filteredCvopt.length === 0 ? (
                <tr><AdminTd colSpan={5}><AdminEmptyState title="📄 Bu kategoride kayıtlı katılımcı yok" /></AdminTd></tr>
              ) : filteredCvopt.map((p) => {
                const linkedinUrl = normalizeLinkedinUrl(String(p.linkedin || '').trim());
                const whatsappUrl = buildWaMeUrl(String(p.whatsapp || '').trim());
                return (
                  <AdminTr key={p.id}>
                    <AdminTd>{cvoptParticipants.indexOf(p) + 1}</AdminTd>
                    <AdminTd>
                      <div className="flex flex-nowrap items-center gap-2">
                        <span className="whitespace-nowrap text-sm font-semibold text-ink">{escapeHtml(p.name || '-')}</span>
                        {linkedinUrl && <a className={cn(CONTACT_LINK_BASE, LINKEDIN_LINK_CLASS)} href={linkedinUrl} target="_blank" rel="noopener noreferrer">in</a>}
                        {whatsappUrl && <a className={cn(CONTACT_LINK_BASE, WHATSAPP_LINK_CLASS)} href={whatsappUrl} target="_blank" rel="noopener noreferrer">wa</a>}
                      </div>
                    </AdminTd>
                    <AdminTd>{formatDate(p.created_at)}</AdminTd>
                    <AdminTd>
                      <div className="flex flex-wrap gap-1.5">
                        {p.approved ? <AdminStatusBadge status="approved" label="✓ Onaylı" /> : <AdminStatusBadge status="pending" label="⏳ Onay Bekliyor" />}
                        {p.linkedin_ok ? <AdminStatusBadge status="review" tone="blue" label="in LinkedIn OK" /> : <AdminStatusBadge status="muted" tone="neutral" label="in LinkedIn Bekliyor" />}
                        {p.cv_ok ? <AdminStatusBadge status="review" tone="blue" label="📄 CV OK" /> : <AdminStatusBadge status="muted" tone="neutral" label="📄 CV Bekliyor" />}
                      </div>
                    </AdminTd>
                    <AdminTd>
                      <div className="flex flex-wrap gap-2">
                        {!p.approved
                          ? <Button type="button" size="sm" variant="success" className={ACTION_BTN_CLASS} onClick={() => runParticipantAdminAction('cvopt', 'approve', p.id, loadCvoptData)}>Onayla</Button>
                          : <Button type="button" size="sm" variant="danger" className={ACTION_BTN_CLASS} onClick={() => { if (confirm('Onayı iptal etmek istediğinize emin misiniz?')) runParticipantAdminAction('cvopt', 'unapprove', p.id, loadCvoptData); }}>İptal</Button>}
                        {!p.linkedin_ok
                          ? <Button type="button" size="sm" variant="outline" className={ACTION_BTN_CLASS} onClick={() => runParticipantAdminAction('cvopt', 'linkedin_ok', p.id, loadCvoptData)}>in ✓</Button>
                          : <Button type="button" size="sm" variant="danger" className={ACTION_BTN_CLASS} onClick={() => runParticipantAdminAction('cvopt', 'linkedin_pending', p.id, loadCvoptData)}>in ✗</Button>}
                        {!p.cv_ok
                          ? <Button type="button" size="sm" variant="outline" className={ACTION_BTN_CLASS} onClick={() => runParticipantAdminAction('cvopt', 'cv_ok', p.id, loadCvoptData)}>CV ✓</Button>
                          : <Button type="button" size="sm" variant="danger" className={ACTION_BTN_CLASS} onClick={() => runParticipantAdminAction('cvopt', 'cv_pending', p.id, loadCvoptData)}>CV ✗</Button>}
                        <Button type="button" size="sm" variant="danger" className={ACTION_BTN_CLASS} onClick={() => { if (confirm('Bu katılımcıyı silmek istediğinize emin misiniz?')) runParticipantAdminAction('cvopt', 'delete', p.id, loadCvoptData); }}>Sil</Button>
                      </div>
                    </AdminTd>
                  </AdminTr>
                );
              })}
            </tbody>
          </AdminTable>
        </div>
      </div>
  );
}
