import { Chip } from '@/components/site/Chip';
import { TONE_STYLES } from '@/components/site/tones';
import { AdminEmptyState } from '@/components/admin/ui/AdminEmptyState';
import { AdminStatusBadge } from '@/components/admin/ui/AdminStatusBadge';
import { AdminTable, AdminTd, AdminTh, AdminThead, AdminTr } from '@/components/admin/ui/AdminTable';
import { AdminTabs } from '@/components/admin/ui/AdminTabs';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import { escapeHtml, normalizeLinkedinUrl, buildWaMeUrl } from './api';
import type { DevUserSectionProps } from './types';

const TAB_ITEMS = [
  { key: 'all', label: 'Tümü' },
  { key: 'pending', label: 'Onay Bekleyen' },
  { key: 'approved', label: 'Onaylı' },
] as const;

const CONTACT_LINK_CLASS =
  'inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-semibold leading-tight transition-colors hover:brightness-95';

export default function DevUserSection({
  active,
  showMenu,
  devUserTotal,
  devUserApproved,
  devUserPending,
  devuserLoading,
  devuserTab,
  setDevuserTab,
  filteredDevUsers,
  updateDevUserStatus,
}: DevUserSectionProps) {
  const stats = [
    { value: devUserTotal, label: 'Toplam Üye' },
    { value: devUserApproved, label: 'Onaylı' },
    { value: devUserPending, label: 'Onay Bekleyen' },
  ];

  return (
    <div className={active ? 'block' : 'hidden'}>
      <div className="rounded-card border border-line bg-white p-5 sm:p-7">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h3 className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight text-ink">👤 Yeni Üye Onaylama</h3>
          <Button variant="outline" size="sm" onClick={showMenu}>← Menüye Dön</Button>
        </div>
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-card border border-line bg-band p-5 text-center">
              <div className="mb-1 text-2xl font-extrabold text-ink sm:text-[32px]">{stat.value}</div>
              <div className="text-xs font-semibold uppercase tracking-wide text-muted">{stat.label}</div>
            </div>
          ))}
        </div>
        {devuserLoading ? (
          <div className="p-10 text-center text-muted">
            <div className="mb-4 inline-block h-10 w-10 animate-spin rounded-full border-[3px] border-line border-t-brand-700" />
            <p>Üyeler yükleniyor...</p>
          </div>
        ) : (
          <>
            <AdminTabs
              className="mb-5"
              ariaLabel="Üye durumu"
              tabs={TAB_ITEMS}
              active={devuserTab}
              onChange={setDevuserTab}
            />
            <AdminTable caption="Üye listesi">
              <AdminThead>
                <AdminTr>
                  <AdminTh>Ad Soyad</AdminTh>
                  <AdminTh>İletişim</AdminTh>
                  <AdminTh>Rol</AdminTh>
                  <AdminTh>Kayıt Tarihi</AdminTh>
                  <AdminTh>Durum</AdminTh>
                  <AdminTh>İşlemler</AdminTh>
                </AdminTr>
              </AdminThead>
              <tbody>
                {filteredDevUsers.length === 0 ? (
                  <AdminTr>
                    <AdminTd colSpan={6}>
                      <AdminEmptyState title="👤 Bu kategoride üye yok" className="border-0" />
                    </AdminTd>
                  </AdminTr>
                ) : filteredDevUsers.map((user) => {
                  const isApproved = user.approval_status === 'approved' || user.onay_durumu === 'approved' || user.admin_onayli;
                  const linkedinUrl = normalizeLinkedinUrl(String(user.linkedin_url || user.linkedin || '').trim());
                  const whatsappRaw = String(user.whatsapp_tel || user.whatsapp || user.telefon || user.phone || '').trim();
                  const whatsappUrl = buildWaMeUrl(whatsappRaw);
                  return (
                    <AdminTr key={user.id}>
                      <AdminTd><div className="text-[15px] font-semibold text-ink">{escapeHtml(user.ad_soyad || '-')}</div></AdminTd>
                      <AdminTd>
                        <div className="flex flex-wrap gap-1.5">
                          {linkedinUrl && (
                            <a
                              className={cn(CONTACT_LINK_CLASS, TONE_STYLES.blue.tint, TONE_STYLES.blue.border, TONE_STYLES.blue.text)}
                              href={linkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              in LinkedIn
                            </a>
                          )}
                          {whatsappUrl && (
                            <a
                              className={cn(CONTACT_LINK_CLASS, TONE_STYLES.green.tint, TONE_STYLES.green.border, TONE_STYLES.green.text)}
                              href={whatsappUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              wa.me/{whatsappUrl.replace('https://wa.me/', '')}
                            </a>
                          )}
                          {!linkedinUrl && !whatsappUrl && '-'}
                        </div>
                      </AdminTd>
                      <AdminTd><Chip tone="brand">{escapeHtml(user.rol || 'Developer')}</Chip></AdminTd>
                      <AdminTd>{user.created_at ? new Date(user.created_at).toLocaleDateString('tr-TR') : '-'}</AdminTd>
                      <AdminTd>
                        {isApproved
                          ? <AdminStatusBadge status="approved" label="✓ Onaylı" />
                          : <AdminStatusBadge status="pending" label="⏳ Onay Bekliyor" />}
                      </AdminTd>
                      <AdminTd>
                        <div className="flex flex-wrap gap-2">
                          {!isApproved
                            ? <Button variant="success" size="sm" className="min-h-[44px]" onClick={() => updateDevUserStatus(user.id, 'approve')}>✓ Onayla</Button>
                            : <Button variant="danger" size="sm" className="min-h-[44px]" onClick={() => updateDevUserStatus(user.id, 'pending')}>✗ İptal</Button>}
                          <Button
                            variant="danger"
                            size="sm"
                            className="min-h-[44px]"
                            onClick={() => { if (confirm('Bu üyeyi kalıcı olarak silmek istediğinize emin misiniz?')) updateDevUserStatus(user.id, 'delete'); }}
                          >
                            🗑 Sil
                          </Button>
                        </div>
                      </AdminTd>
                    </AdminTr>
                  );
                })}
              </tbody>
            </AdminTable>
          </>
        )}
      </div>
    </div>
  );
}
