import { escapeHtml, formatDate, errorMessage, GENERIC_ERROR_MESSAGE, buildFullBracket, getParticipantNameById, BRACKET_ROUND_NAMES } from './api';
import type { TypingSectionProps } from './types';
import { TONE_STYLES } from '@/components/site/tones';
import { cn } from '@/lib/utils/cn';

const STAT_CARD = 'rounded-card border border-line bg-white p-5 text-center';
const STAT_VALUE = 'mb-1 text-[32px] font-extrabold leading-none text-ink';
const STAT_LABEL = 'text-xs font-semibold uppercase tracking-wide text-muted';
const SECTION_CARD = 'relative mb-6 rounded-card border border-line bg-white p-5 md:p-7';
const SECTION_TITLE = 'flex items-center gap-2.5 text-xl font-extrabold tracking-tight text-ink';
const TABLE_HEAD = 'px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-muted';
const TABLE_CELL = 'px-4 py-3 text-left align-top text-sm text-ink';
const BADGE = 'inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold';
const ACTION_BTN = 'min-h-[44px] rounded-btn border px-3.5 text-[13px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40';
const ACTION_GREEN = cn(ACTION_BTN, TONE_STYLES.green.tint, TONE_STYLES.green.border, TONE_STYLES.green.text, 'hover:bg-alm-green/20');
const ACTION_RED = cn(ACTION_BTN, TONE_STYLES.red.tint, TONE_STYLES.red.border, TONE_STYLES.red.text, 'hover:bg-alm-red/20');
const ACTION_VIEW = 'min-h-[44px] rounded-btn border border-brand-700 bg-brand-50 px-3.5 text-[13px] font-semibold text-brand-800 transition-colors hover:bg-brand-100 disabled:cursor-not-allowed disabled:opacity-40';
const SLOT_BTN = 'flex min-h-[44px] min-w-[44px] items-center justify-center rounded-btn border text-sm transition-colors';
const TABLE_HEADERS = ['#', 'Katılımcı', 'WhatsApp', 'Kayıt Tarihi', 'Durum', 'İşlemler'];

export default function TypingSection({
  active,
  showMenu,
  typingParticipants,
  typingBracket,
  typingTab,
  setTypingTab,
  filteredTyping,
  runParticipantAdminAction,
  runBracketAdminAction,
  loadTypingData,
}: TypingSectionProps) {
  return (
      <div className={active ? 'block' : 'hidden'}>
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className={STAT_CARD}><div className={STAT_VALUE}>{typingParticipants.length}</div><div className={STAT_LABEL}>Toplam Kayıt</div></div>
          <div className={STAT_CARD}><div className={STAT_VALUE}>{typingParticipants.filter(p => p.approved).length}</div><div className={STAT_LABEL}>Onaylı</div></div>
          <div className={STAT_CARD}><div className={STAT_VALUE}>{typingParticipants.filter(p => !p.approved).length}</div><div className={STAT_LABEL}>Onay Bekleyen</div></div>
          <div className={STAT_CARD}><div className={STAT_VALUE}>{typingBracket.filter(s => s.participant_id).length}</div><div className={STAT_LABEL}>Turnuvada</div></div>
        </div>
        <div className={SECTION_CARD}>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <h3 className={SECTION_TITLE}>⌨️ Klavye Hız Yarışması Yönetimi</h3>
            <button className="min-h-[44px] rounded-btn border border-line bg-white px-5 text-sm font-semibold text-muted transition-colors hover:bg-band hover:text-ink" onClick={showMenu}>← Menüye Dön</button>
          </div>
          <div className="mb-5 flex flex-wrap gap-2">
            {['all', 'pending', 'approved'].map((t) => (
              <button
                key={t}
                className={cn(
                  'min-h-[44px] rounded-btn border px-5 text-sm font-medium transition-colors',
                  typingTab === t ? 'border-brand-700 bg-brand-50 text-brand-800' : 'border-line bg-white text-muted hover:bg-band hover:text-ink',
                )}
                onClick={() => setTypingTab(t)}
              >
                {t === 'all' ? 'Tümü' : t === 'pending' ? 'Onay Bekleyen' : 'Onaylı'}
              </button>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-band"><tr>{TABLE_HEADERS.map((h) => <th key={h} scope="col" className={TABLE_HEAD}>{h}</th>)}</tr></thead>
              <tbody>
                {filteredTyping.length === 0 ? (
                  <tr><td colSpan={6} className={TABLE_CELL}><div className="px-5 py-14 text-center text-muted"><div className="mb-4 text-5xl">⌨️</div><p>Bu kategoride kayıtlı katılımcı yok</p></div></td></tr>
                ) : filteredTyping.map((p) => {
                  const inBracket = typingBracket.some(s => s.participant_id === p.id);
                  const slotIndex = typingBracket.findIndex(s => s.participant_id === p.id);
                  return (
                    <tr key={p.id} className="border-t border-line hover:bg-page">
                      <td className={TABLE_CELL}>{typingParticipants.indexOf(p) + 1}</td>
                      <td className={TABLE_CELL}><div className="text-[15px] font-semibold text-ink">{escapeHtml(p.name)}</div></td>
                      <td className={TABLE_CELL}>{p.whatsapp ? escapeHtml(p.whatsapp) : '-'}</td>
                      <td className={TABLE_CELL}>{formatDate(p.created_at)}</td>
                      <td className={TABLE_CELL}>{p.approved ? <span className={cn(BADGE, TONE_STYLES.green.tint, TONE_STYLES.green.text)}>✓ Onaylı</span> : <span className={cn(BADGE, TONE_STYLES.yellow.tint, TONE_STYLES.yellow.text)}>⏳ Onay Bekliyor</span>}</td>
                      <td className={TABLE_CELL}>
                        <div className="flex flex-wrap gap-2">
                          {!p.approved
                            ? <button className={ACTION_GREEN} onClick={() => runParticipantAdminAction('typing', 'approve', p.id, loadTypingData)}>✓ Onayla</button>
                            : <button className={ACTION_RED} onClick={() => { if (confirm('Onayı iptal etmek istediğinize emin misiniz?')) runParticipantAdminAction('typing', 'unapprove', p.id, loadTypingData); }}>✗ İptal</button>}
                          {p.approved && !inBracket && (
                            <button className={ACTION_VIEW} onClick={async () => { try { await runBracketAdminAction('typing', 'add', { participantId: p.id }); await loadTypingData(); } catch (err) { alert('Ekleme hatası: ' + errorMessage(err, GENERIC_ERROR_MESSAGE)); } }}>➕ Turnuvaya Ekle</button>
                          )}
                          {inBracket && (
                            <button className={ACTION_GREEN} onClick={async () => { try { await runBracketAdminAction('typing', 'remove_participant', { participantId: p.id }); await loadTypingData(); } catch (err) { alert(errorMessage(err, GENERIC_ERROR_MESSAGE)); } }}>✓ Turnuvada (#{slotIndex + 1})</button>
                          )}
                          <button className={ACTION_RED} onClick={() => { if (confirm('Bu katılımcıyı silmek istediğinize emin misiniz?')) runParticipantAdminAction('typing', 'delete', p.id, loadTypingData); }}>🗑 Sil</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className={SECTION_CARD}>
          <h3 className={SECTION_TITLE}>🎯 Turnuva Tablosu Yönetimi</h3>
          <p className="mb-5 mt-3 text-sm text-muted">Turnuva tablosuna katılımcı eklemek için yukarıdaki &quot;Turnuvaya Ekle&quot; butonunu kullan.</p>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3">
            {buildFullBracket(typingBracket).map((slot, index) => {
              const slotName = getParticipantNameById(typingParticipants, slot.participant_id);
              return (
                <div
                  key={index}
                  className={cn(
                    'flex items-center gap-3 rounded-card border p-4',
                    slot.participant_id ? 'border-brand-700/30 bg-brand-50' : 'border-line bg-white',
                  )}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-700 text-sm font-bold text-white">{index + 1}</div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-0.5 text-sm font-semibold text-ink">{slotName || 'Boş'}</div>
                    <div className="text-xs text-muted">{BRACKET_ROUND_NAMES[index]}</div>
                  </div>
                  {slot.participant_id && (
                    <div className="flex gap-1.5">
                      <button
                        className={cn(
                          SLOT_BTN,
                          slot.winner
                            ? cn(TONE_STYLES.green.tint, TONE_STYLES.green.text, 'border-alm-green')
                            : 'border-line bg-white text-muted hover:border-alm-green hover:text-ink',
                        )}
                        title="Galip"
                        onClick={async () => { try { await runBracketAdminAction('typing', 'toggle_winner', { slotIndex: index }); await loadTypingData(); } catch (err) { alert(errorMessage(err, GENERIC_ERROR_MESSAGE)); } }}
                      >🏆</button>
                      <button
                        className={cn(SLOT_BTN, TONE_STYLES.red.tint, TONE_STYLES.red.border, TONE_STYLES.red.text, 'hover:bg-alm-red/20')}
                        title="Temizle"
                        onClick={async () => { if (!confirm('Bu slotu temizlemek istediğinize emin misiniz?')) return; try { await runBracketAdminAction('typing', 'clear_slot', { slotIndex: index }); await loadTypingData(); } catch (err) { alert(errorMessage(err, GENERIC_ERROR_MESSAGE)); } }}
                      >✕</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
  );
}
