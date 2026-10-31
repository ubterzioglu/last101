import { escapeHtml, formatDate, errorMessage, GENERIC_ERROR_MESSAGE, buildFullBracket, getParticipantNameById, BRACKET_ROUND_NAMES } from './api';
import type { TournamentSectionProps } from './types';
import { AdminEmptyState } from '@/components/admin/ui/AdminEmptyState';
import { AdminStatusBadge } from '@/components/admin/ui/AdminStatusBadge';
import { AdminTable, AdminTd, AdminTh, AdminThead, AdminTr } from '@/components/admin/ui/AdminTable';
import { AdminTabs } from '@/components/admin/ui/AdminTabs';
import { TONE_STYLES } from '@/components/site/tones';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils/cn';

const TOURNAMENT_TABS = [
  { key: 'all', label: 'Tümü' },
  { key: 'pending', label: 'Onay Bekleyen' },
  { key: 'approved', label: 'Onaylı' },
] as const;

const ACTION_BTN_CLASS = 'min-h-[44px] px-3';
const SLOT_BTN_CLASS =
  'flex h-11 w-11 items-center justify-center rounded-tile text-sm transition-colors';

interface StatTileProps {
  value: number;
  label: string;
}

function StatTile({ value, label }: StatTileProps) {
  return (
    <div className="rounded-card border border-line bg-white p-5 text-center">
      <div className="mb-1 text-[32px] font-extrabold leading-none text-ink">{value}</div>
      <div className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</div>
    </div>
  );
}

export default function TournamentSection({
  active,
  showMenu,
  tournamentParticipants,
  tournamentBracket,
  tournamentTab,
  setTournamentTab,
  filteredTournament,
  runParticipantAdminAction,
  runBracketAdminAction,
  loadTournamentData,
}: TournamentSectionProps) {
  return (
      <div className={active ? 'block space-y-6' : 'hidden'}>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatTile value={tournamentParticipants.length} label="Toplam Kayıt" />
          <StatTile value={tournamentParticipants.filter(p => p.approved).length} label="Onaylı" />
          <StatTile value={tournamentParticipants.filter(p => !p.approved).length} label="Onay Bekleyen" />
          <StatTile value={tournamentBracket.filter(s => s.participant_id).length} label="Playoff'ta" />
        </div>
        <Card>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <h3 className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight text-ink">👥 Katılımcı Yönetimi</h3>
            <Button variant="outline" size="sm" className="min-h-[44px]" onClick={showMenu}>← Menüye Dön</Button>
          </div>
          <AdminTabs
            className="mb-5"
            ariaLabel="Katılımcı filtresi"
            tabs={TOURNAMENT_TABS}
            active={tournamentTab}
            onChange={setTournamentTab}
          />
          <AdminTable caption="Turnuva katılımcıları">
            <AdminThead>
              <AdminTr><AdminTh>#</AdminTh><AdminTh>Ad Soyad</AdminTh><AdminTh>İletişim</AdminTh><AdminTh>Kayıt Tarihi</AdminTh><AdminTh>Durum</AdminTh><AdminTh>İşlemler</AdminTh></AdminTr>
            </AdminThead>
            <tbody>
              {filteredTournament.length === 0 ? (
                <AdminTr><AdminTd colSpan={6}><AdminEmptyState title="Bu kategoride kayıtlı katılımcı yok" className="border-0" /></AdminTd></AdminTr>
              ) : filteredTournament.map((p) => {
                const inBracket = tournamentBracket.some(s => s.participant_id === p.id);
                const slotIndex = tournamentBracket.findIndex(s => s.participant_id === p.id);
                return (
                  <AdminTr key={p.id}>
                    <AdminTd>{tournamentParticipants.indexOf(p) + 1}</AdminTd>
                    <AdminTd><div className="text-[15px] font-semibold text-ink">{escapeHtml(p.name)}</div></AdminTd>
                    <AdminTd>{p.whatsapp ? <div>💬 {escapeHtml(p.whatsapp)}</div> : '-'}</AdminTd>
                    <AdminTd>{formatDate(p.created_at)}</AdminTd>
                    <AdminTd>{p.approved ? <AdminStatusBadge status="approved" label="✓ Onaylı" /> : <AdminStatusBadge status="pending" label="⏳ Onay Bekliyor" />}</AdminTd>
                    <AdminTd>
                      <div className="flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:gap-2">
                        {!p.approved
                          ? <Button variant="success" size="sm" className={ACTION_BTN_CLASS} onClick={() => runParticipantAdminAction('tavla', 'approve', p.id, loadTournamentData)}>✓ Onayla</Button>
                          : <Button variant="danger" size="sm" className={ACTION_BTN_CLASS} onClick={() => { if (confirm('Onayı iptal etmek istediğinize emin misiniz?')) runParticipantAdminAction('tavla', 'unapprove', p.id, loadTournamentData); }}>✗ İptal</Button>}
                        {p.approved && !inBracket && (
                          <Button variant="primary" size="sm" className={ACTION_BTN_CLASS} onClick={async () => { try { await runBracketAdminAction('tavla', 'add', { participantId: p.id }); await loadTournamentData(); } catch (err) { alert('Ekleme hatası: ' + errorMessage(err, GENERIC_ERROR_MESSAGE)); } }}>➕ Playoff&apos;a Ekle</Button>
                        )}
                        {inBracket && (
                          <Button variant="success" size="sm" className={ACTION_BTN_CLASS} onClick={async () => { try { await runBracketAdminAction('tavla', 'remove_participant', { participantId: p.id }); await loadTournamentData(); } catch (err) { alert(errorMessage(err, GENERIC_ERROR_MESSAGE)); } }}>✓ Playoff&apos;ta (#{slotIndex + 1})</Button>
                        )}
                        <Button variant="danger" size="sm" className={ACTION_BTN_CLASS} onClick={() => { if (confirm('Bu katılımcıyı silmek istediğinize emin misiniz?')) runParticipantAdminAction('tavla', 'delete', p.id, loadTournamentData); }}>🗑 Sil</Button>
                      </div>
                    </AdminTd>
                  </AdminTr>
                );
              })}
            </tbody>
          </AdminTable>
        </Card>
        <Card>
          <h3 className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight text-ink">🎯 Playoff Tablosu Yönetimi</h3>
          <p className="mb-5 mt-2 text-sm text-muted">Playoff tablosuna katılımcı eklemek için yukarıdaki &quot;Playoff&apos;a Ekle&quot; butonunu kullan.</p>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3">
            {buildFullBracket(tournamentBracket).map((slot, index) => {
              const slotName = getParticipantNameById(tournamentParticipants, slot.participant_id);
              return (
                <div
                  key={index}
                  className={cn(
                    'flex items-center gap-3 rounded-card border p-4',
                    slot.participant_id ? 'border-brand-600 bg-brand-50' : 'border-line bg-band',
                  )}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-700 text-sm font-bold text-white">{index + 1}</div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-0.5 truncate text-sm font-semibold text-ink">{slotName || 'Boş'}</div>
                    <div className="text-xs text-muted">{BRACKET_ROUND_NAMES[index]}</div>
                  </div>
                  {slot.participant_id && (
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        className={cn(
                          SLOT_BTN_CLASS,
                          slot.winner
                            ? 'bg-alm-green-ink text-white'
                            : cn(TONE_STYLES.green.tint, TONE_STYLES.green.text, 'hover:bg-alm-green-ink hover:text-white'),
                        )}
                        title="Galip"
                        onClick={async () => { try { await runBracketAdminAction('tavla', 'toggle_winner', { slotIndex: index }); await loadTournamentData(); } catch (err) { alert(errorMessage(err, GENERIC_ERROR_MESSAGE)); } }}
                      >🏆</button>
                      <button
                        type="button"
                        className={cn(SLOT_BTN_CLASS, TONE_STYLES.red.tint, TONE_STYLES.red.text, 'hover:bg-alm-red-ink hover:text-white')}
                        title="Temizle"
                        onClick={async () => { if (!confirm('Bu slotu temizlemek istediğinize emin misiniz?')) return; try { await runBracketAdminAction('tavla', 'clear_slot', { slotIndex: index }); await loadTournamentData(); } catch (err) { alert(errorMessage(err, GENERIC_ERROR_MESSAGE)); } }}
                      >✕</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </div>
  );
}
