import { ADMIN_KEY_HEADER, ADMIN_PASSWORD_HEADER } from '@/lib/admin/headers';
import type { SoftwareHubBracketSlot, SoftwareHubParticipant } from '@/types/software-hub';

// ==================== CONSTANTS ====================
export const ADMIN_AUTH_STORAGE_KEY = 'dad_admin_auth_v1';
export const USERS_API_URL = '/api/devuser-admin-list';
export const USER_UPDATE_API_URL = '/api/devuser-admin-update';
export const PARTICIPANT_ACTION_API_URL = '/api/participant-admin-action';
export const PARTICIPANT_LIST_API_URL = '/api/participant-admin-list';
export const PARTICIPANT_BRACKET_ACTION_API_URL = '/api/participant-admin-bracket-action';
export const DISCUSSION_LIST_API_URL = '/api/devuser-dis-admin-list';
export const DISCUSSION_ACTION_API_URL = '/api/devuser-dis-admin-action';
export const NEWS_ADMIN_LIST_API_URL = '/api/news-admin-list';
export const NEWS_ADMIN_ACTION_API_URL = '/api/news-admin-action';
export const MEETING_ADMIN_LIST_API_URL = '/api/meeting-attendance-admin-list';
export const MEETING_RESET_API_URL = '/api/meeting-attendance-reset';
export const FOUNDER_SUBMISSIONS_ADMIN_LIST_API_URL = '/api/founder-submissions-admin-list';
export const FOUNDER_EVENT_ADMIN_LIST_API_URL = '/api/founder-event-admin-list';

export const DATE_MAP: Record<string, string> = {
  '2026-03-20': '20 Mart Cuma', '2026-03-21': '21 Mart Cumartesi', '2026-03-22': '22 Mart Pazar',
  '2026-03-27': '27 Mart Cuma', '2026-03-28': '28 Mart Cumartesi', '2026-03-29': '29 Mart Pazar',
  '2026-04-03': '3 Nisan Cuma', '2026-04-04': '4 Nisan Cumartesi', '2026-04-05': '5 Nisan Pazar',
  '2026-04-10': '10 Nisan Cuma', '2026-04-11': '11 Nisan Cumartesi', '2026-04-12': '12 Nisan Pazar',
  '2026-04-17': '17 Nisan Cuma', '2026-04-18': '18 Nisan Cumartesi', '2026-04-19': '19 Nisan Pazar',
  '2026-04-24': '24 Nisan Cuma', '2026-04-25': '25 Nisan Cumartesi', '2026-04-26': '26 Nisan Pazar',
};

export const BRACKET_ROUND_NAMES = [
  'Son 16','Son 16','Son 16','Son 16','Son 16','Son 16','Son 16','Son 16',
  'Son 16','Son 16','Son 16','Son 16','Son 16','Son 16','Son 16','Son 16',
  'Çeyrek Final','Çeyrek Final','Çeyrek Final','Çeyrek Final',
  'Çeyrek Final','Çeyrek Final','Çeyrek Final','Çeyrek Final',
  'Yarı Final','Yarı Final','Yarı Final','Yarı Final',
  'Final','Final',
];

// ==================== HELPERS ====================
export function escapeHtml(text: string | null | undefined): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function formatDateLabel(dateValue: string): string {
  return DATE_MAP[dateValue] || dateValue;
}

export function normalizeLinkedinUrl(value: string): string {
  const raw = value.trim();
  if (!raw) return '';
  if (/^https?:\/\//i.test(raw)) {
    try {
      const parsed = new URL(raw);
      const host = parsed.hostname.toLowerCase();
      if (host === 'linkedin.com' || host === 'www.linkedin.com' || host.endsWith('.linkedin.com')) {
        return parsed.toString();
      }
    } catch { return ''; }
    return '';
  }
  if (/^(www\.)?linkedin\.com\//i.test(raw)) return `https://${raw}`;
  return '';
}

export function buildWaMeUrl(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';
  return `https://wa.me/${digits}`;
}

export function normalizeNewsStatus(status: string | undefined): string {
  return String(status || '').toLowerCase() === 'published' ? 'published' : 'draft';
}

export function normalizeNewsCategory(category: string | undefined): string {
  const safe = String(category || '').trim();
  if (['Almanya', 'Türkiye', 'Avrupa', 'Dünya'].includes(safe)) return safe;
  return 'Almanya';
}

export function normalizeDiscussionStatus(status: string | undefined): string {
  return String(status || '').toLowerCase() === 'approved' ? 'approved' : 'pending';
}

export const GENERIC_ERROR_MESSAGE = 'İşlem sırasında hata oluştu.';

export function errorMessage(err: unknown, fallback: string): string {
  return (err instanceof Error && err.message) || fallback;
}

// ==================== AUTH HELPERS ====================
// Session is established once at /admin (single-door gate). Here we only read
// the shared session to build authorized API headers; the password form lives
// on the main /admin page.
export function loadAdminAuth(): { email: string; password: string } {
  if (typeof window === 'undefined') return { email: '', password: '' };
  try {
    const parsed = JSON.parse(sessionStorage.getItem(ADMIN_AUTH_STORAGE_KEY) || '{}');
    return {
      email: String(parsed?.email || '').trim().toLowerCase(),
      password: String(parsed?.password || ''),
    };
  } catch {
    return { email: '', password: '' };
  }
}

export function getAdminHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const current = loadAdminAuth();
  return {
    ...extra,
    [ADMIN_KEY_HEADER]: current.password,
    [ADMIN_PASSWORD_HEADER]: current.password,
  };
}


// ==================== BRACKET HELPERS ====================
export const buildFullBracket = (bracket: SoftwareHubBracketSlot[]) => {
  const full = [...bracket];
  while (full.length < 30) full.push({ id: null, participant_id: null, winner: false });
  return full;
};

export const getParticipantNameById = (participants: SoftwareHubParticipant[], participantId: string | null) => {
  if (!participantId) return '';
  return participants.find((p) => p.id === participantId)?.name || '';
};
