import { Button } from '@/components/ui/Button';
import { AdminTable, AdminTd, AdminTh, AdminThead, AdminTr } from '@/components/admin/ui/AdminTable';
import { escapeHtml, formatDateLabel } from './api';
import type { MeetingSectionProps } from './types';

export default function MeetingSection({
  active,
  showMenu,
  meetingTotal,
  meetingLoading,
  meetingDateStats,
  meetingParticipants,
  resetMeetingData,
}: MeetingSectionProps) {
  return (
    <div className={active ? 'block' : 'hidden'}>
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-card border border-line bg-white p-5 text-center">
          <div className="mb-1 text-2xl font-extrabold text-ink sm:text-[32px]">{meetingTotal}</div>
          <div className="text-xs uppercase tracking-wide text-muted">Toplam Katılımcı</div>
        </div>
      </div>
      <div className="rounded-card border border-line bg-white p-5 sm:p-7">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h3 className="flex items-center gap-2.5 text-xl font-bold text-ink">📅 Toplantı Anketi Sonuçları</h3>
          <div className="flex flex-wrap gap-2.5">
            <Button type="button" variant="danger" size="sm" onClick={resetMeetingData}>
              🗑 Tümünü Sıfırla
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={showMenu}>
              ← Menüye Dön
            </Button>
          </div>
        </div>
        {meetingLoading ? (
          <div className="p-10 text-center text-muted" role="status">
            <div
              className="mb-4 inline-block h-10 w-10 animate-spin rounded-full border-[3px] border-line border-t-brand-700"
              aria-hidden="true"
            />
            <p>Veriler yükleniyor...</p>
          </div>
        ) : (
          <>
            <h4 className="mb-4 text-base font-bold text-ink">Tarih Dağılımı</h4>
            <div className="mb-6">
              {meetingDateStats.length === 0 ? (
                <p className="text-muted">Henüz veri yok.</p>
              ) : (() => {
                const maxVotes = Math.max(...meetingDateStats.map((d) => d.vote_count));
                return meetingDateStats.map((item) => {
                  const percentage = maxVotes > 0 ? (item.vote_count / maxVotes * 100) : 0;
                  return (
                    <div
                      key={item.date_option}
                      className="mb-2 flex items-center justify-between rounded-card border border-line bg-band px-4 py-3"
                    >
                      <div>
                        <div className="font-semibold text-ink">{formatDateLabel(item.date_option)}</div>
                        <div className="text-xs text-muted">20:00 - 21:00 TSİ</div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="h-1.5 w-[100px] overflow-hidden rounded-full bg-line">
                          <div
                            className="h-full rounded-full bg-brand-600"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="min-w-6 text-right font-semibold text-ink">{item.vote_count}</span>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>

            <h4 className="mb-4 text-base font-bold text-ink">Katılımcı Listesi</h4>
            <AdminTable caption="Katılımcı Listesi">
              <AdminThead>
                <AdminTr>
                  <AdminTh>Ad Soyad</AdminTh>
                  <AdminTh>WhatsApp</AdminTh>
                  <AdminTh>Uygun Tarihler</AdminTh>
                  <AdminTh>Kayıt Tarihi</AdminTh>
                </AdminTr>
              </AdminThead>
              <tbody>
                {meetingParticipants.length === 0 ? (
                  <AdminTr>
                    <AdminTd colSpan={4} className="text-center text-muted">Henüz katılımcı yok.</AdminTd>
                  </AdminTr>
                ) : meetingParticipants.map((p) => {
                  const dates = p.available_dates?.map((d: string) => formatDateLabel(d)).join(', ') || '-';
                  const createdAt = new Date(p.created_at);
                  const cleanNumber = p.whatsapp ? p.whatsapp.replace(/[\s\+\-\(\)]/g, '') : '';
                  return (
                    <AdminTr key={p.id || p.whatsapp}>
                      <AdminTd>{escapeHtml(p.full_name)}</AdminTd>
                      <AdminTd>
                        {p.whatsapp ? (
                          <a
                            href={`https://wa.me/${cleanNumber}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-brand-700 hover:underline"
                          >
                            {escapeHtml(p.whatsapp)} ↗
                          </a>
                        ) : '-'}
                      </AdminTd>
                      <AdminTd>{escapeHtml(dates)}</AdminTd>
                      <AdminTd>{createdAt.toLocaleDateString('tr-TR')} {createdAt.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</AdminTd>
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
