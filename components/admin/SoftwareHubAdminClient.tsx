'use client';

import Image from 'next/image';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

const css = `
  :root {
    --google-blue: #4285F4;
    --google-red: #EA4335;
    --google-yellow: #FBBC05;
    --google-green: #34A853;
    --dark-bg: #000000;
    --card-bg: rgba(255, 255, 255, 0.03);
    --glass-border: rgba(255, 255, 255, 0.08);
    --text-primary: #ffffff;
    --text-secondary: rgba(255, 255, 255, 0.6);
    --gradient-1: linear-gradient(135deg, #4285F4 0%, #EA4335 50%, #FBBC05 100%);
    --gradient-2: linear-gradient(135deg, #34A853 0%, #4285F4 100%);
    --gradient-3: linear-gradient(135deg, #FBBC05 0%, #EA4335 100%);
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background: var(--dark-bg); min-height: 100vh; color: var(--text-primary); overflow-x: hidden; }
  .admin-wrap { min-height: 100vh; background: #000; color: #fff; font-family: 'Inter', -apple-system, sans-serif; overflow-x: hidden; }
  .bg-animation { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; overflow: hidden; background: #000; }
  #code-canvas { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0.28; }
  .grid-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-image: linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px); background-size: 50px 50px; z-index: 0; pointer-events: none; }
  .container { max-width: 1400px; margin: 0 auto; padding: 20px; min-height: 100vh; display: flex; flex-direction: column; position: relative; z-index: 1; }
  .top-logo { text-align: center; margin-bottom: 20px; padding-top: 10px; }
  .top-logo-image { width: 300px; height: auto; object-fit: contain; box-shadow: 0 8px 32px rgba(66,133,244,0.3); }
  .header { display: flex; align-items: center; justify-content: center; padding: 10px 0 30px; border-bottom: 1px solid var(--glass-border); margin-bottom: 30px; position: relative; }
  .title-group h1 { font-family: 'Space Grotesk', sans-serif; font-size: 22px; font-weight: 700; background: var(--gradient-1); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; letter-spacing: -0.5px; }
  .back-link { display: inline-flex; align-items: center; gap: 8px; color: var(--text-secondary); text-decoration: none; font-size: 14px; padding: 8px 16px; background: var(--card-bg); border: 1px solid var(--glass-border); border-radius: 50px; backdrop-filter: blur(10px); transition: all 0.3s ease; position: absolute; left: 0; }
  .back-link:hover { color: var(--google-blue); border-color: var(--google-blue); transform: translateX(-3px); }
  .main-content { flex: 1; display: flex; flex-direction: column; gap: 24px; }
  .card { background: var(--card-bg); border: 1px solid var(--glass-border); border-radius: 24px; padding: 28px; backdrop-filter: blur(20px); position: relative; overflow: hidden; animation: fadeInUp 0.6s ease backwards; }
  .hero-card { border-color: rgba(234,67,53,0.3); text-align: center; }
  .hero-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--gradient-3); }
  .hero-domain { font-size: 14px; font-weight: 600; color: var(--google-red); text-transform: lowercase; margin-bottom: 8px; }
  .hero-card h2 { font-family: 'Space Grotesk', sans-serif; font-size: 28px; font-weight: 700; margin-bottom: 8px; }
  .hero-card p { color: var(--text-secondary); font-size: 15px; }
  .main-menu { display: grid; grid-template-columns: repeat(5, 1fr); gap: 20px; margin-bottom: 8px; }
  .menu-card { background: var(--card-bg); border: 1px solid var(--glass-border); border-radius: 20px; padding: 32px; text-align: center; cursor: pointer; transition: all 0.3s ease; color: inherit; }
  .menu-card:hover { transform: translateY(-5px); border-color: rgba(255,255,255,0.2); box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
  .menu-card.primary { border-color: rgba(66,133,244,0.3); }
  .menu-card.primary:hover { border-color: rgba(66,133,244,0.5); box-shadow: 0 20px 40px rgba(66,133,244,0.15); }
  .menu-card.secondary { border-color: rgba(251,188,5,0.3); }
  .menu-card.secondary:hover { border-color: rgba(251,188,5,0.5); box-shadow: 0 20px 40px rgba(251,188,5,0.15); }
  .menu-icon { font-size: 48px; margin-bottom: 16px; }
  .menu-title { font-family: 'Space Grotesk', sans-serif; font-size: 20px; font-weight: 600; margin-bottom: 8px; }
  .menu-desc { font-size: 14px; color: var(--text-secondary); }
  .menu-badge { display: inline-block; margin-top: 12px; padding: 6px 14px; background: rgba(234,67,53,0.15); border: 1px solid rgba(234,67,53,0.3); border-radius: 20px; color: #f28b82; font-size: 12px; font-weight: 600; }
  .menu-badge.hidden { display: none; }
  .section { display: none; }
  .section.active { display: block; animation: fadeIn 0.3s ease; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
  .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; }
  .section-title { font-family: 'Space Grotesk', sans-serif; font-size: 20px; font-weight: 600; display: flex; align-items: center; gap: 10px; }
  .back-btn { padding: 10px 20px; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); border-radius: 10px; color: var(--text-secondary); font-size: 14px; cursor: pointer; transition: all 0.3s ease; font-family: inherit; }
  .back-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }
  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
  .stat-card { background: var(--card-bg); border: 1px solid var(--glass-border); border-radius: 16px; padding: 20px; text-align: center; }
  .stat-value { font-family: 'Space Grotesk', sans-serif; font-size: 32px; font-weight: 700; color: #fff; margin-bottom: 4px; }
  .stat-label { font-size: 12px; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; }
  .tabs { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
  .tab-btn { padding: 10px 20px; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); border-radius: 10px; color: var(--text-secondary); font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.3s ease; font-family: inherit; }
  .tab-btn:hover { background: rgba(255,255,255,0.08); color: #fff; }
  .tab-btn.active { background: rgba(66,133,244,0.15); border-color: var(--google-blue); color: #fff; }
  .table-container { overflow-x: auto; }
  .data-table { width: 100%; border-collapse: collapse; font-size: 14px; }
  .data-table th, .data-table td { padding: 14px 16px; text-align: left; border-bottom: 1px solid var(--glass-border); }
  .data-table th { font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-secondary); background: rgba(255,255,255,0.03); }
  .data-table tr:hover { background: rgba(255,255,255,0.02); }
  .user-name { font-weight: 600; font-size: 15px; }
  .user-email { font-size: 13px; color: var(--text-secondary); }
  .user-cell { display: flex; align-items: center; gap: 8px; flex-wrap: nowrap; }
  .user-cell .user-name { font-weight: 600; font-size: 14px; white-space: nowrap; }
  .user-cell .contact-link { padding: 2px 6px; font-size: 10px; }
  .contact-links { display: flex; flex-wrap: wrap; gap: 6px; }
  .contact-link { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; line-height: 1.1; text-decoration: none; border: 1px solid transparent; transition: all 0.18s ease; white-space: nowrap; }
  .contact-link.linkedin { color: #8ab4f8; background: rgba(66,133,244,0.16); border-color: rgba(66,133,244,0.42); }
  .contact-link.linkedin:hover { background: rgba(66,133,244,0.25); color: #cde1ff; }
  .contact-link.whatsapp { color: #8ee6a8; background: rgba(52,168,83,0.16); border-color: rgba(52,168,83,0.42); }
  .contact-link.whatsapp:hover { background: rgba(52,168,83,0.25); color: #d6fbe3; }
  .topic-cell { min-width: 300px; max-width: 520px; white-space: pre-wrap; word-break: break-word; line-height: 1.4; }
  .meta-line { display: block; margin-top: 6px; color: var(--text-secondary); font-size: 12px; }
  .user-role { display: inline-block; padding: 4px 10px; background: rgba(66,133,244,0.1); border: 1px solid rgba(66,133,244,0.3); border-radius: 20px; font-size: 12px; color: #8ab4f8; }
  .status-badge { display: inline-block; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
  .status-stack { display: flex; flex-wrap: wrap; gap: 6px; }
  .status-badge.approved { background: rgba(52,168,83,0.15); color: #81c995; }
  .status-badge.pending { background: rgba(251,188,5,0.15); color: #fde293; }
  .status-badge.review { background: rgba(66,133,244,0.15); color: #8ab4f8; }
  .status-badge.muted { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.72); }
  .action-btns { display: flex; gap: 8px; flex-wrap: wrap; }
  .action-btn { padding: 8px 14px; border: none; border-radius: 8px; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s ease; font-family: inherit; }
  .action-btn.approve { background: rgba(52,168,83,0.15); color: #81c995; border: 1px solid rgba(52,168,83,0.3); }
  .action-btn.approve:hover { background: rgba(52,168,83,0.25); }
  .action-btn.reject { background: rgba(234,67,53,0.15); color: #f28b82; border: 1px solid rgba(234,67,53,0.3); }
  .action-btn.reject:hover { background: rgba(234,67,53,0.25); }
  .action-btn.view { background: rgba(66,133,244,0.15); color: #8ab4f8; border: 1px solid rgba(66,133,244,0.3); }
  .action-btn.view:hover { background: rgba(66,133,244,0.25); }
  .action-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .bracket-slots { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; }
  .bracket-slot { background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border); border-radius: 12px; padding: 16px; display: flex; align-items: center; gap: 12px; }
  .bracket-slot.occupied { border-color: rgba(66,133,244,0.3); background: rgba(66,133,244,0.05); }
  .slot-number { width: 32px; height: 32px; background: var(--google-blue); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; flex-shrink: 0; }
  .slot-info { flex: 1; }
  .slot-name { font-weight: 600; font-size: 14px; margin-bottom: 2px; }
  .slot-round { font-size: 12px; color: var(--text-secondary); }
  .slot-actions { display: flex; gap: 6px; }
  .slot-btn { width: 28px; height: 28px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease; }
  .slot-btn.winner { background: rgba(52,168,83,0.15); color: #81c995; }
  .slot-btn.winner:hover, .slot-btn.winner.active { background: var(--google-green); color: #fff; }
  .slot-btn.clear { background: rgba(234,67,53,0.15); color: #f28b82; }
  .slot-btn.clear:hover { background: var(--google-red); color: #fff; }
  .loading { text-align: center; padding: 40px; color: var(--text-secondary); }
  .loading-spinner { display: inline-block; width: 40px; height: 40px; border: 3px solid var(--glass-border); border-top-color: var(--google-blue); border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 16px; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .empty-state { text-align: center; padding: 60px 20px; color: var(--text-secondary); }
  .empty-state-icon { font-size: 48px; margin-bottom: 16px; }
  .auth-gate { max-width: 480px; margin: 0 auto; padding: 40px 20px; position: relative; z-index: 1; }
  .auth-card { background: var(--card-bg); border: 1px solid var(--glass-border); border-radius: 24px; padding: 32px; backdrop-filter: blur(20px); position: relative; }
  .auth-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--gradient-1); border-radius: 24px 24px 0 0; }
  .auth-title { font-family: 'Space Grotesk', sans-serif; font-size: 24px; font-weight: 700; margin-bottom: 8px; text-align: center; }
  .auth-subtitle { color: var(--text-secondary); font-size: 14px; text-align: center; margin-bottom: 24px; }
  .form-group { margin-bottom: 16px; }
  .form-group label { display: block; font-size: 14px; font-weight: 500; color: var(--text-secondary); margin-bottom: 8px; }
  .form-group input { width: 100%; padding: 14px 18px; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); border-radius: 12px; font-size: 15px; color: #fff; font-family: inherit; transition: all 0.3s ease; outline: none; }
  .form-group input:focus { border-color: var(--google-blue); box-shadow: 0 0 0 3px rgba(66,133,244,0.2); }
  .form-group input::placeholder { color: rgba(255,255,255,0.3); }
  .auth-btn { width: 100%; padding: 16px 24px; font-size: 16px; font-weight: 600; background: var(--gradient-1); border: none; border-radius: 12px; color: #fff; cursor: pointer; transition: all 0.3s ease; font-family: inherit; margin-top: 8px; }
  .auth-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(66,133,244,0.3); }
  .auth-error { padding: 12px 16px; background: rgba(234,67,53,0.15); border: 1px solid rgba(234,67,53,0.3); border-radius: 12px; color: #f28b82; font-size: 14px; margin-bottom: 16px; }
  @media (max-width: 768px) {
    .container { padding: 15px; }
    .top-logo img { width: 220px; }
    .header { flex-direction: column; gap: 15px; padding: 15px 0 25px; }
    .back-link { position: static; align-self: flex-start; }
    .title-group h1 { font-size: 18px; }
    .main-menu { grid-template-columns: repeat(2, 1fr); }
    .card { padding: 22px; border-radius: 20px; }
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
    .stat-value { font-size: 24px; }
    .data-table { font-size: 13px; }
    .data-table th, .data-table td { padding: 10px 12px; }
    .action-btns { flex-direction: column; gap: 6px; }
    .action-btn { padding: 6px 10px; font-size: 12px; }
    .contact-link { font-size: 10px; padding: 4px 8px; }
  }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
  }
`;

// ==================== CONSTANTS ====================
const ADMIN_AUTH_STORAGE_KEY = 'dad_admin_auth_v1';
const USERS_API_URL = '/api/devuser-admin-list';
const USER_UPDATE_API_URL = '/api/devuser-admin-update';
const PARTICIPANT_ACTION_API_URL = '/api/participant-admin-action';
const PARTICIPANT_LIST_API_URL = '/api/participant-admin-list';
const PARTICIPANT_BRACKET_ACTION_API_URL = '/api/participant-admin-bracket-action';
const DISCUSSION_LIST_API_URL = '/api/devuser-dis-admin-list';
const DISCUSSION_ACTION_API_URL = '/api/devuser-dis-admin-action';
const NEWS_ADMIN_LIST_API_URL = '/api/news-admin-list';
const NEWS_ADMIN_ACTION_API_URL = '/api/news-admin-action';
const MEETING_ADMIN_LIST_API_URL = '/api/meeting-attendance-admin-list';
const MEETING_RESET_API_URL = '/api/meeting-attendance-reset';

const DATE_MAP: Record<string, string> = {
  '2026-03-20': '20 Mart Cuma', '2026-03-21': '21 Mart Cumartesi', '2026-03-22': '22 Mart Pazar',
  '2026-03-27': '27 Mart Cuma', '2026-03-28': '28 Mart Cumartesi', '2026-03-29': '29 Mart Pazar',
  '2026-04-03': '3 Nisan Cuma', '2026-04-04': '4 Nisan Cumartesi', '2026-04-05': '5 Nisan Pazar',
  '2026-04-10': '10 Nisan Cuma', '2026-04-11': '11 Nisan Cumartesi', '2026-04-12': '12 Nisan Pazar',
  '2026-04-17': '17 Nisan Cuma', '2026-04-18': '18 Nisan Cumartesi', '2026-04-19': '19 Nisan Pazar',
  '2026-04-24': '24 Nisan Cuma', '2026-04-25': '25 Nisan Cumartesi', '2026-04-26': '26 Nisan Pazar',
};

const BRACKET_ROUND_NAMES = [
  'Son 16','Son 16','Son 16','Son 16','Son 16','Son 16','Son 16','Son 16',
  'Son 16','Son 16','Son 16','Son 16','Son 16','Son 16','Son 16','Son 16',
  'Çeyrek Final','Çeyrek Final','Çeyrek Final','Çeyrek Final',
  'Çeyrek Final','Çeyrek Final','Çeyrek Final','Çeyrek Final',
  'Yarı Final','Yarı Final','Yarı Final','Yarı Final',
  'Final','Final',
];

// ==================== HELPERS ====================
function escapeHtml(text: string | null | undefined): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function formatDateLabel(dateValue: string): string {
  return DATE_MAP[dateValue] || dateValue;
}

function normalizeLinkedinUrl(value: string): string {
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

function buildWaMeUrl(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';
  return `https://wa.me/${digits}`;
}

function normalizeNewsStatus(status: string | undefined): string {
  return String(status || '').toLowerCase() === 'published' ? 'published' : 'draft';
}

function normalizeNewsCategory(category: string | undefined): string {
  const safe = String(category || '').trim();
  if (['Almanya', 'Türkiye', 'Avrupa', 'Dünya'].includes(safe)) return safe;
  return 'Almanya';
}

function normalizeDiscussionStatus(status: string | undefined): string {
  return String(status || '').toLowerCase() === 'approved' ? 'approved' : 'pending';
}

// ==================== AUTH HELPERS ====================
function saveAdminAuth(email: string, password: string) {
  if (typeof window === 'undefined') return;
  const auth = { email: String(email || '').trim().toLowerCase(), password: String(password || '') };
  sessionStorage.setItem(ADMIN_AUTH_STORAGE_KEY, JSON.stringify(auth));
}

function loadAdminAuth(): { email: string; password: string } {
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

function clearAdminAuth() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
}

function getAdminHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const current = loadAdminAuth();
  return {
    ...extra,
    'x-admin-key': current.password,
    'x-admin-email': current.email,
    'x-admin-password': current.password,
  };
}

async function verifyAdminKey(password: string): Promise<true> {
  const response = await fetch('/api/admin-auth-verify', {
    method: 'GET',
    headers: { Accept: 'application/json', 'x-admin-key': String(password || '').trim() },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401) throw new Error('Sifre hatali.');
    throw new Error(payload.error || `Admin dogrulama basarisiz (${response.status})`);
  }
  return true;
}

// ==================== MAIN COMPONENT ====================
export default function AdminPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const codeRainRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const badgeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auth state
  const [authed, setAuthed] = useState(false);
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Navigation
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Badges
  const [badges, setBadges] = useState<Record<string, number | string>>({});

  // DevUsers
  const [devUsers, setDevUsers] = useState<any[]>([]);
  const [devuserTab, setDevuserTab] = useState('all');
  const [devuserLoading, setDevuserLoading] = useState(false);

  // Tournament
  const [tournamentParticipants, setTournamentParticipants] = useState<any[]>([]);
  const [tournamentBracket, setTournamentBracket] = useState<any[]>([]);
  const [tournamentTab, setTournamentTab] = useState('all');

  // Hackathon
  const [hackathonParticipants, setHackathonParticipants] = useState<any[]>([]);
  const [hackathonTab, setHackathonTab] = useState('all');

  // Typing
  const [typingParticipants, setTypingParticipants] = useState<any[]>([]);
  const [typingBracket, setTypingBracket] = useState<any[]>([]);
  const [typingTab, setTypingTab] = useState('all');

  // Promote
  const [promoteParticipants, setPromoteParticipants] = useState<any[]>([]);
  const [promoteTab, setPromoteTab] = useState('all');

  // CvOpt
  const [cvoptParticipants, setCvoptParticipants] = useState<any[]>([]);
  const [cvoptTab, setCvoptTab] = useState('all');

  // Discussion
  const [discussionRows, setDiscussionRows] = useState<any[]>([]);
  const [discussionTab, setDiscussionTab] = useState('all');
  const [discussionLoading, setDiscussionLoading] = useState(false);

  // News
  const [newsRows, setNewsRows] = useState<any[]>([]);
  const [newsStats, setNewsStats] = useState({ total: 0, draft: 0, published: 0 });
  const [newsTab, setNewsTab] = useState('all');
  const [newsSearch, setNewsSearch] = useState('');
  const [newsLoading, setNewsLoading] = useState(false);

  // Meeting
  const [meetingParticipants, setMeetingParticipants] = useState<any[]>([]);
  const [meetingDateStats, setMeetingDateStats] = useState<any[]>([]);
  const [meetingTotal, setMeetingTotal] = useState(0);
  const [meetingLoading, setMeetingLoading] = useState(false);

  // ==================== CODE RAIN ====================
  const startCodeRain = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノABCDEFGHIJKLMNOPQRSTUVWXYZ<>/{}[]();:=-+*/&|%$#@!';
    const fontSize = 14;
    let columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = [];
    for (let i = 0; i < columns; i++) drops[i] = Math.random() * -100;

    const draw = () => {
      ctx.fillStyle = 'rgba(0,0,0,0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#4285F4';
      ctx.font = fontSize + 'px monospace';
      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };

    codeRainRef.current = setInterval(draw, 35);
    return () => {
      window.removeEventListener('resize', resize);
      if (codeRainRef.current) clearInterval(codeRainRef.current);
    };
  }, []);

  // Hide site header/footer (same as devuser pages)
  useEffect(() => {
    document.body.setAttribute('data-devuser', 'true');
    return () => { document.body.removeAttribute('data-devuser'); };
  }, []);

  // ==================== AUTH ====================
  useEffect(() => {
    const saved = loadAdminAuth();
    if (saved.password) {
      verifyAdminKey(saved.password)
        .then(() => setAuthed(true))
        .catch(() => clearAdminAuth());
    }
  }, []);

  useEffect(() => {
    if (authed) {
      const cleanup = startCodeRain();
      return cleanup;
    }
  }, [authed, startCodeRain]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!authPassword) { setAuthError('Lutfen sifre girin.'); return; }
    setAuthLoading(true);
    try {
      await verifyAdminKey(authPassword);
      saveAdminAuth('admin@almanya101.de', authPassword);
      setAuthed(true);
    } catch (err: any) {
      setAuthError(err.message || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
    } finally {
      setAuthLoading(false);
    }
  };

  // ==================== BADGES ====================
  const updateBadges = useCallback(async () => {
    if (!authed) return;
    const saved = loadAdminAuth();
    if (!saved.password) return;
    try {
      const newBadges: Record<string, number | string> = {};

      const participantRes = await fetch(`${PARTICIPANT_LIST_API_URL}?category=all`, {
        headers: getAdminHeaders({ Accept: 'application/json' }),
      });
      const participantPayload = await participantRes.json().catch(() => ({}));
      const pdata = participantPayload.data || {};

      newBadges.tavla = (pdata.tavla?.participants || []).filter((p: any) => !p.approved).length;
      newBadges.vct = (pdata.vct?.participants || []).filter((p: any) => !p.approved).length;
      newBadges.promote = (pdata.promote?.participants || []).filter((p: any) => !p.approved).length;
      newBadges.cvopt = (pdata.cvopt?.participants || []).filter((p: any) => !p.approved).length;
      newBadges.typing = (pdata.typing?.participants || []).filter((p: any) => !p.approved).length;

      const discRes = await fetch(`${DISCUSSION_LIST_API_URL}?status=pending&limit=1000`, {
        headers: getAdminHeaders({ Accept: 'application/json' }),
      });
      const discPayload = await discRes.json().catch(() => ({}));
      newBadges.discussion = Array.isArray(discPayload.items) ? discPayload.items.length : 0;

      const newsRes = await fetch(`${NEWS_ADMIN_LIST_API_URL}?status=all&limit=1`, {
        headers: getAdminHeaders({ Accept: 'application/json' }),
      });
      const newsPayload = await newsRes.json().catch(() => ({}));
      newBadges.news = newsRes.ok ? Number(newsPayload?.stats?.draft || 0) : 0;

      const meetRes = await fetch(`${MEETING_ADMIN_LIST_API_URL}?limit=1`, {
        headers: getAdminHeaders({ Accept: 'application/json' }),
      });
      const meetPayload = await meetRes.json().catch(() => ({}));
      newBadges.meeting = meetRes.ok ? Number(meetPayload?.stats?.total || 0) : 0;

      setBadges(newBadges);
    } catch { /* silent */ }
  }, [authed]);

  useEffect(() => {
    if (!authed) return;
    updateBadges();
    badgeIntervalRef.current = setInterval(updateBadges, 5000);
    return () => { if (badgeIntervalRef.current) clearInterval(badgeIntervalRef.current); };
  }, [authed, updateBadges]);

  // ==================== NAVIGATION ====================
  const showSection = useCallback((section: string) => {
    setActiveSection(section);
    if (section === 'devuser') loadDevUsers();
    else if (section === 'tournament') loadTournamentData();
    else if (section === 'hackathon') loadHackathonData();
    else if (section === 'typing') loadTypingData();
    else if (section === 'promote') loadPromoteData();
    else if (section === 'cvopt') loadCvoptData();
    else if (section === 'discussion') loadDiscussionData();
    else if (section === 'news') loadNewsAdminData('all', '', false);
    else if (section === 'meeting') loadMeetingData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const showMenu = () => {
    setActiveSection(null);
    updateBadges();
  };

  // ==================== DEV USERS ====================
  const loadDevUsers = async () => {
    setDevuserLoading(true);
    try {
      const res = await fetch(USERS_API_URL, { headers: getAdminHeaders({ Accept: 'application/json' }) });
      if (res.status === 401) throw new Error('Admin yetkisi doğrulanamadı.');
      if (!res.ok) throw new Error('API Hatası');
      const result = await res.json();
      setDevUsers(result.data || []);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDevuserLoading(false);
    }
  };

  const updateDevUserStatus = async (userId: string, action: string) => {
    try {
      const res = await fetch(USER_UPDATE_API_URL, {
        method: 'POST',
        headers: getAdminHeaders({ 'Content-Type': 'application/json', Accept: 'application/json' }),
        body: JSON.stringify({ id: userId, action }),
      });
      const payload = await res.json().catch(() => ({}));
      if (res.status === 401) throw new Error('Admin yetkisi doğrulanamadı.');
      if (!res.ok) throw new Error(payload.error || 'İşlem başarısız.');
      await loadDevUsers();
      updateBadges();
    } catch (err: any) {
      alert(err.message || 'İşlem sırasında hata oluştu.');
    }
  };

  // ==================== PARTICIPANT HELPERS ====================
  const fetchParticipantAdminData = async (category: string) => {
    const res = await fetch(`${PARTICIPANT_LIST_API_URL}?category=${encodeURIComponent(category)}`, {
      headers: getAdminHeaders({ Accept: 'application/json' }),
    });
    const payload = await res.json().catch(() => ({}));
    if (res.status === 401) throw new Error('Yetki doğrulanamadı.');
    if (!res.ok) throw new Error(payload.error || 'Veriler alınamadı.');
    return payload.data || {};
  };

  const runParticipantAdminAction = async (category: string, action: string, id: string, reload: () => Promise<void>) => {
    try {
      const res = await fetch(PARTICIPANT_ACTION_API_URL, {
        method: 'POST',
        headers: getAdminHeaders({ 'Content-Type': 'application/json', Accept: 'application/json' }),
        body: JSON.stringify({ category, action, id }),
      });
      const payload = await res.json().catch(() => ({}));
      if (res.status === 401) throw new Error('Yetki doğrulanamadı.');
      if (!res.ok) throw new Error(payload.error || 'İşlem başarısız.');
      await reload();
      updateBadges();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const runBracketAdminAction = async (category: string, action: string, data: Record<string, unknown> = {}) => {
    const res = await fetch(PARTICIPANT_BRACKET_ACTION_API_URL, {
      method: 'POST',
      headers: getAdminHeaders({ 'Content-Type': 'application/json', Accept: 'application/json' }),
      body: JSON.stringify({ category, action, ...data }),
    });
    const payload = await res.json().catch(() => ({}));
    if (res.status === 401) throw new Error('Yetki doğrulanamadı.');
    if (!res.ok) throw new Error(payload.error || 'İşlem başarısız.');
    return payload.data || null;
  };

  // ==================== TOURNAMENT ====================
  const loadTournamentData = async () => {
    try {
      const data = await fetchParticipantAdminData('tavla');
      setTournamentParticipants(Array.isArray(data.participants) ? data.participants : []);
      setTournamentBracket(Array.isArray(data.bracket) ? data.bracket : []);
    } catch (err: any) {
      alert('Veriler yüklenirken hata: ' + err.message);
    }
  };

  // ==================== HACKATHON ====================
  const loadHackathonData = async () => {
    try {
      const data = await fetchParticipantAdminData('vct');
      setHackathonParticipants(Array.isArray(data.participants) ? data.participants : []);
    } catch (err: any) {
      alert('Veriler yüklenirken hata: ' + err.message);
    }
  };

  // ==================== TYPING ====================
  const loadTypingData = async () => {
    try {
      const data = await fetchParticipantAdminData('typing');
      setTypingParticipants(Array.isArray(data.participants) ? data.participants : []);
      setTypingBracket(Array.isArray(data.bracket) ? data.bracket : []);
    } catch (err: any) {
      alert('Veriler yüklenirken hata: ' + err.message);
    }
  };

  // ==================== PROMOTE ====================
  const loadPromoteData = async () => {
    try {
      const data = await fetchParticipantAdminData('promote');
      setPromoteParticipants(Array.isArray(data.participants) ? data.participants : []);
    } catch (err: any) {
      alert('Veriler yüklenirken hata: ' + err.message);
    }
  };

  // ==================== CVOPT ====================
  const loadCvoptData = async () => {
    try {
      const data = await fetchParticipantAdminData('cvopt');
      setCvoptParticipants(Array.isArray(data.participants) ? data.participants : []);
    } catch (err: any) {
      alert('Veriler yüklenirken hata: ' + err.message);
    }
  };

  // ==================== DISCUSSION ====================
  const loadDiscussionData = async () => {
    setDiscussionLoading(true);
    try {
      const res = await fetch(`${DISCUSSION_LIST_API_URL}?status=all&limit=1000`, {
        headers: getAdminHeaders({ Accept: 'application/json' }),
      });
      const payload = await res.json().catch(() => ({}));
      if (res.status === 401) throw new Error('Admin yetkisi doğrulanamadı.');
      if (!res.ok) throw new Error(payload.error || 'Veriler yüklenemedi.');
      setDiscussionRows(Array.isArray(payload.items) ? payload.items : []);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDiscussionLoading(false);
    }
  };

  const runDiscussionAction = async (action: string, id: string) => {
    if (!id) return;
    if (action === 'delete' && !confirm('Bu tartışma konusunu silmek istediğinize emin misiniz?')) return;
    try {
      const res = await fetch(DISCUSSION_ACTION_API_URL, {
        method: 'POST',
        headers: getAdminHeaders({ 'Content-Type': 'application/json', Accept: 'application/json' }),
        body: JSON.stringify({ action, id }),
      });
      const payload = await res.json().catch(() => ({}));
      if (res.status === 401) throw new Error('Admin yetkisi doğrulanamadı.');
      if (!res.ok) throw new Error(payload.error || 'İşlem başarısız.');
      await loadDiscussionData();
      updateBadges();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // ==================== NEWS ====================
  const loadNewsAdminData = async (tab?: string, search?: string, showLoading = true) => {
    const currentTab = tab ?? newsTab;
    const currentSearch = search ?? newsSearch;
    if (showLoading) setNewsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('status', currentTab || 'all');
      params.set('limit', '600');
      if (currentSearch) params.set('q', currentSearch);
      const res = await fetch(`${NEWS_ADMIN_LIST_API_URL}?${params.toString()}`, {
        headers: getAdminHeaders({ Accept: 'application/json' }),
      });
      const payload = await res.json().catch(() => ({}));
      if (res.status === 401) throw new Error('Admin yetkisi doğrulanamadı.');
      if (!res.ok) throw new Error(payload.error || 'Haberler yüklenemedi.');
      setNewsRows(Array.isArray(payload.items) ? payload.items : []);
      setNewsStats(payload.stats && typeof payload.stats === 'object' ? payload.stats : { total: 0, draft: 0, published: 0 });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setNewsLoading(false);
    }
  };

  const runNewsAdminAction = async (payload: Record<string, unknown>) => {
    const res = await fetch(NEWS_ADMIN_ACTION_API_URL, {
      method: 'POST',
      headers: getAdminHeaders({ 'Content-Type': 'application/json', Accept: 'application/json' }),
      body: JSON.stringify(payload),
    });
    const result = await res.json().catch(() => ({}));
    if (res.status === 401) throw new Error('Admin yetkisi doğrulanamadı.');
    if (!res.ok) throw new Error(result.error || 'İşlem başarısız.');
    await loadNewsAdminData();
    updateBadges();
    return result;
  };

  // ==================== MEETING ====================
  const loadMeetingData = async () => {
    setMeetingLoading(true);
    try {
      const res = await fetch(`${MEETING_ADMIN_LIST_API_URL}?limit=1000`, {
        headers: getAdminHeaders({ Accept: 'application/json' }),
      });
      const payload = await res.json().catch(() => ({}));
      if (res.status === 401) throw new Error('Admin yetkisi doğrulanamadı.');
      if (!res.ok) throw new Error(payload.error || 'Toplantı kayıtları alınamadı.');
      setMeetingTotal(Number(payload?.stats?.total || 0));
      setMeetingDateStats(Array.isArray(payload.date_stats) ? payload.date_stats : []);
      setMeetingParticipants(Array.isArray(payload.items) ? payload.items : []);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setMeetingLoading(false);
    }
  };

  const resetMeetingData = async () => {
    if (!confirm('⚠️ TÜM toplantı kayıtları silinecek. Bu işlem geri alınamaz!\n\nDevam etmek istediğinize emin misiniz?')) return;
    try {
      const res = await fetch(MEETING_RESET_API_URL, {
        method: 'DELETE',
        headers: getAdminHeaders({ Accept: 'application/json' }),
      });
      if (res.status === 401) { alert('Oturum süreniz doldu.'); return; }
      if (!res.ok) { const p = await res.json().catch(() => ({})); throw new Error(p.error || 'Sıfırlama başarısız'); }
      alert('✅ Tüm kayıtlar başarıyla silindi!');
      await loadMeetingData();
    } catch (err: any) {
      alert(`❌ Hata: ${err.message}`);
    }
  };

  // ==================== FILTERED DATA ====================
  const filteredDevUsers = devUsers.filter((u) => {
    const isApproved = u.approval_status === 'approved' || u.onay_durumu === 'approved' || u.admin_onayli;
    if (devuserTab === 'pending') return !isApproved;
    if (devuserTab === 'approved') return isApproved;
    return true;
  });

  const filteredTournament = tournamentParticipants.filter((p) => {
    if (tournamentTab === 'pending') return !p.approved;
    if (tournamentTab === 'approved') return p.approved;
    return true;
  });

  const filteredHackathon = hackathonParticipants.filter((p) => {
    if (hackathonTab === 'pending') return !p.approved;
    if (hackathonTab === 'approved') return p.approved;
    return true;
  });

  const filteredTyping = typingParticipants.filter((p) => {
    if (typingTab === 'pending') return !p.approved;
    if (typingTab === 'approved') return p.approved;
    return true;
  });

  const filteredPromote = promoteParticipants.filter((p) => {
    if (promoteTab === 'pending') return !p.approved;
    if (promoteTab === 'approved') return p.approved;
    return true;
  });

  const filteredCvopt = cvoptParticipants.filter((p) => {
    if (cvoptTab === 'pending') return !p.approved;
    if (cvoptTab === 'approved') return p.approved;
    return true;
  });

  const filteredDiscussion = discussionRows.filter((item) => {
    const s = normalizeDiscussionStatus(item.status);
    if (discussionTab === 'pending') return s === 'pending';
    if (discussionTab === 'approved') return s === 'approved';
    return true;
  });

  // ==================== BRACKET HELPERS ====================
  const buildFullBracket = (bracket: any[]) => {
    const full = [...bracket];
    while (full.length < 30) full.push({ id: null, participant_id: null, winner: false });
    return full;
  };

  const getParticipantNameById = (participants: any[], participantId: string | null) => {
    if (!participantId) return '';
    return participants.find((p) => p.id === participantId)?.name || '';
  };

  // ==================== DEVUSER STATS ====================
  const devUserTotal = devUsers.length;
  const devUserApproved = devUsers.filter((u) => u.approval_status === 'approved' || u.onay_durumu === 'approved' || u.admin_onayli).length;
  const devUserPending = devUserTotal - devUserApproved;

  const pendingDevUsers = devUsers.filter((u) => u.onay_durumu !== 'approved' && !u.admin_onayli).length;

  // ==================== RENDER ====================
  if (!authed) {
    return (
      <div className="admin-wrap">
        <style>{css}</style>
        <div className="bg-animation"><canvas ref={canvasRef} id="code-canvas" /></div>
        <div className="grid-overlay" />
          <div className="auth-gate">
          <div className="top-logo">
            <Image
              src="/almanya101lragetransparent.png"
              alt="almanya101"
              width={420}
              height={140}
              className="top-logo-image"
              priority
            />
          </div>
          <div className="auth-card">
            <div style={{ textAlign: 'center', fontSize: 14, fontWeight: 600, color: 'var(--google-red)', textTransform: 'lowercase', marginBottom: 8 }}>almanya101.de</div>
            <h2 className="auth-title">🔐 Admin Girişi</h2>
            <p className="auth-subtitle">Devam etmek için giriş yapın</p>
            {authError && <div className="auth-error">{authError}</div>}
            <form onSubmit={handleAuthSubmit}>
              <div className="form-group">
                <label htmlFor="authPassword">Şifre</label>
                <input
                  type="password"
                  id="authPassword"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="auth-btn" disabled={authLoading}>
                {authLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-wrap">
      <style>{css}</style>
      <div className="bg-animation"><canvas ref={canvasRef} id="code-canvas" /></div>
      <div className="grid-overlay" />

      <div className="container">
        <div className="top-logo">
          <Image
            src="/almanya101lragetransparent.png"
            alt="almanya101"
            width={420}
            height={140}
            className="top-logo-image"
            priority
          />
        </div>

        <header className="header">
          <a href="/devuser" className="back-link">← dashboard&apos;a dön</a>
          <div className="title-group"><h1>de tr software dashboard</h1></div>
        </header>

        <main className="main-content">
          {/* Hero */}
          <div className="card hero-card">
            <div className="hero-domain">almanya101.de</div>
            <h2>👑 Admin Paneli</h2>
            <p>Yönetim işlemleri için bir bölüm seçin.</p>
          </div>

          {/* Main Menu */}
          {activeSection === null && (
            <div className="main-menu">
              <div className="menu-card primary" onClick={() => showSection('devuser')}>
                <div className="menu-icon">👤</div>
                <div className="menu-title">Yeni Üye Onayla</div>
                <div className="menu-desc">Developer topluluğuna katılan yeni üyeleri incele ve onayla.</div>
                {pendingDevUsers > 0 && <div className="menu-badge">{pendingDevUsers} onay bekliyor</div>}
              </div>

              <div className="menu-card secondary" onClick={() => showSection('tournament')}>
                <div className="menu-icon">🎲</div>
                <div className="menu-title">Tavla Katılımcısı Onayla</div>
                <div className="menu-desc">Tavla turnuvasına kayıt olan katılımcıları yönet ve playoff tablosunu düzenle.</div>
                {Number(badges.tavla) > 0 && <div className="menu-badge">{badges.tavla} onay bekliyor</div>}
              </div>

              <div className="menu-card" style={{ borderColor: 'rgba(52,168,83,0.3)' }} onClick={() => showSection('hackathon')}>
                <div className="menu-icon">💻</div>
                <div className="menu-title">Vibecoding Onayla</div>
                <div className="menu-desc">Vibecoding Tournament&apos;a kayıt olan takımları yönet ve onayla.</div>
                {Number(badges.vct) > 0 && <div className="menu-badge">{badges.vct} onay bekliyor</div>}
              </div>

              <div className="menu-card" style={{ borderColor: 'rgba(234,67,53,0.3)' }} onClick={() => showSection('promote')}>
                <div className="menu-icon">📢</div>
                <div className="menu-title">Promote Onayla</div>
                <div className="menu-desc">Promote Your Product kayıtlarını yönet ve onayla.</div>
                {Number(badges.promote) > 0 && <div className="menu-badge">{badges.promote} onay bekliyor</div>}
              </div>

              <div className="menu-card" style={{ borderColor: 'rgba(52,168,83,0.3)' }} onClick={() => showSection('cvopt')}>
                <div className="menu-icon">📄</div>
                <div className="menu-title">CV Opt Onayla</div>
                <div className="menu-desc">CV + LinkedIn iyileştirme başvurularını incele, sırayı yönet ve onayla.</div>
                {Number(badges.cvopt) > 0 && <div className="menu-badge">{badges.cvopt} onay bekliyor</div>}
              </div>

              <div className="menu-card" style={{ borderColor: 'rgba(66,133,244,0.3)' }} onClick={() => showSection('typing')}>
                <div className="menu-icon">⌨️</div>
                <div className="menu-title">Typing Onayla</div>
                <div className="menu-desc">Klavye Hız Yarışması katılımcılarını yönet ve playoff tablosunu düzenle.</div>
                {Number(badges.typing) > 0 && <div className="menu-badge">{badges.typing} onay bekliyor</div>}
              </div>

              <div className="menu-card" style={{ borderColor: 'rgba(251,188,5,0.3)' }} onClick={() => showSection('discussion')}>
                <div className="menu-icon">💬</div>
                <div className="menu-title">Discussion Onayla</div>
                <div className="menu-desc">Yeni tartışma konusu başvurularını incele, onayla veya beklemeye al.</div>
                {Number(badges.discussion) > 0 && <div className="menu-badge">{badges.discussion} onay bekliyor</div>}
              </div>

              <div className="menu-card" style={{ borderColor: 'rgba(66,133,244,0.3)' }} onClick={() => showSection('news')}>
                <div className="menu-icon">📰</div>
                <div className="menu-title">News Yönetimi</div>
                <div className="menu-desc">Haberleri listele, kategori/durum güncelle ve gereksiz haberleri sil.</div>
                {Number(badges.news) > 0 && <div className="menu-badge">{badges.news} taslak</div>}
              </div>

              <div className="menu-card" style={{ borderColor: 'rgba(52,168,83,0.3)' }} onClick={() => showSection('meeting')}>
                <div className="menu-icon">📅</div>
                <div className="menu-title">Toplantı Anketi Sonuçları</div>
                <div className="menu-desc">Tanışma toplantısı için katılımcı listesi ve tarih oyları.</div>
                <div className="menu-badge" style={{ display: 'inline-block' }}>{badges.meeting ?? 0} katılımcı</div>
              </div>
            </div>
          )}

          {/* ==================== DEVUSER SECTION ==================== */}
          <div className={`section ${activeSection === 'devuser' ? 'active' : ''}`}>
            <div className="card">
              <div className="section-header">
                <h3 className="section-title">👤 Yeni Üye Onaylama</h3>
                <button className="back-btn" onClick={showMenu}>← Menüye Dön</button>
              </div>
              <div className="stats-grid">
                <div className="stat-card"><div className="stat-value">{devUserTotal}</div><div className="stat-label">Toplam Üye</div></div>
                <div className="stat-card"><div className="stat-value">{devUserApproved}</div><div className="stat-label">Onaylı</div></div>
                <div className="stat-card"><div className="stat-value">{devUserPending}</div><div className="stat-label">Onay Bekleyen</div></div>
              </div>
              {devuserLoading ? (
                <div className="loading"><div className="loading-spinner" /><p>Üyeler yükleniyor...</p></div>
              ) : (
                <>
                  <div className="tabs">
                    {['all', 'pending', 'approved'].map((t) => (
                      <button key={t} className={`tab-btn ${devuserTab === t ? 'active' : ''}`} onClick={() => setDevuserTab(t)}>
                        {t === 'all' ? 'Tümü' : t === 'pending' ? 'Onay Bekleyen' : 'Onaylı'}
                      </button>
                    ))}
                  </div>
                  <div className="table-container">
                    <table className="data-table">
                      <thead><tr><th>Ad Soyad</th><th>İletişim</th><th>Rol</th><th>Kayıt Tarihi</th><th>Durum</th><th>İşlemler</th></tr></thead>
                      <tbody>
                        {filteredDevUsers.length === 0 ? (
                          <tr><td colSpan={6}><div className="empty-state"><div className="empty-state-icon">👤</div><p>Bu kategoride üye yok</p></div></td></tr>
                        ) : filteredDevUsers.map((user) => {
                          const isApproved = user.approval_status === 'approved' || user.onay_durumu === 'approved' || user.admin_onayli;
                          const linkedinUrl = normalizeLinkedinUrl(String(user.linkedin_url || user.linkedin || '').trim());
                          const whatsappRaw = String(user.whatsapp_tel || user.whatsapp || user.telefon || user.phone || '').trim();
                          const whatsappUrl = buildWaMeUrl(whatsappRaw);
                          return (
                            <tr key={user.id}>
                              <td><div className="user-name">{escapeHtml(user.ad_soyad || '-')}</div></td>
                              <td>
                                <div className="contact-links">
                                  {linkedinUrl && <a className="contact-link linkedin" href={linkedinUrl} target="_blank" rel="noopener noreferrer">in LinkedIn</a>}
                                  {whatsappUrl && <a className="contact-link whatsapp" href={whatsappUrl} target="_blank" rel="noopener noreferrer">wa.me/{whatsappUrl.replace('https://wa.me/', '')}</a>}
                                  {!linkedinUrl && !whatsappUrl && '-'}
                                </div>
                              </td>
                              <td><span className="user-role">{escapeHtml(user.rol || 'Developer')}</span></td>
                              <td>{user.created_at ? new Date(user.created_at).toLocaleDateString('tr-TR') : '-'}</td>
                              <td>{isApproved ? <span className="status-badge approved">✓ Onaylı</span> : <span className="status-badge pending">⏳ Onay Bekliyor</span>}</td>
                              <td>
                                <div className="action-btns">
                                  {!isApproved
                                    ? <button className="action-btn approve" onClick={() => updateDevUserStatus(user.id, 'approve')}>✓ Onayla</button>
                                    : <button className="action-btn reject" onClick={() => updateDevUserStatus(user.id, 'pending')}>✗ İptal</button>}
                                  <button className="action-btn reject" onClick={() => { if (confirm('Bu üyeyi kalıcı olarak silmek istediğinize emin misiniz?')) updateDevUserStatus(user.id, 'delete'); }}>🗑 Sil</button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ==================== TOURNAMENT SECTION ==================== */}
          <div className={`section ${activeSection === 'tournament' ? 'active' : ''}`}>
            <div className="stats-grid">
              <div className="stat-card"><div className="stat-value">{tournamentParticipants.length}</div><div className="stat-label">Toplam Kayıt</div></div>
              <div className="stat-card"><div className="stat-value">{tournamentParticipants.filter(p => p.approved).length}</div><div className="stat-label">Onaylı</div></div>
              <div className="stat-card"><div className="stat-value">{tournamentParticipants.filter(p => !p.approved).length}</div><div className="stat-label">Onay Bekleyen</div></div>
              <div className="stat-card"><div className="stat-value">{tournamentBracket.filter(s => s.participant_id).length}</div><div className="stat-label">Playoff&apos;ta</div></div>
            </div>
            <div className="card">
              <div className="section-header">
                <h3 className="section-title">👥 Katılımcı Yönetimi</h3>
                <button className="back-btn" onClick={showMenu}>← Menüye Dön</button>
              </div>
              <div className="tabs">
                {['all', 'pending', 'approved'].map((t) => (
                  <button key={t} className={`tab-btn ${tournamentTab === t ? 'active' : ''}`} onClick={() => setTournamentTab(t)}>
                    {t === 'all' ? 'Tümü' : t === 'pending' ? 'Onay Bekleyen' : 'Onaylı'}
                  </button>
                ))}
              </div>
              <div className="table-container">
                <table className="data-table">
                  <thead><tr><th>#</th><th>Ad Soyad</th><th>İletişim</th><th>Kayıt Tarihi</th><th>Durum</th><th>İşlemler</th></tr></thead>
                  <tbody>
                    {filteredTournament.length === 0 ? (
                      <tr><td colSpan={6}><div className="empty-state"><div className="empty-state-icon">🎲</div><p>Bu kategoride kayıtlı katılımcı yok</p></div></td></tr>
                    ) : filteredTournament.map((p) => {
                      const inBracket = tournamentBracket.some(s => s.participant_id === p.id);
                      const slotIndex = tournamentBracket.findIndex(s => s.participant_id === p.id);
                      return (
                        <tr key={p.id}>
                          <td>{tournamentParticipants.indexOf(p) + 1}</td>
                          <td><div className="user-name">{escapeHtml(p.name)}</div></td>
                          <td>{p.whatsapp ? <div>💬 {escapeHtml(p.whatsapp)}</div> : '-'}</td>
                          <td>{formatDate(p.created_at)}</td>
                          <td>{p.approved ? <span className="status-badge approved">✓ Onaylı</span> : <span className="status-badge pending">⏳ Onay Bekliyor</span>}</td>
                          <td>
                            <div className="action-btns">
                              {!p.approved
                                ? <button className="action-btn approve" onClick={() => runParticipantAdminAction('tavla', 'approve', p.id, loadTournamentData)}>✓ Onayla</button>
                                : <button className="action-btn reject" onClick={() => { if (confirm('Onayı iptal etmek istediğinize emin misiniz?')) runParticipantAdminAction('tavla', 'unapprove', p.id, loadTournamentData); }}>✗ İptal</button>}
                              {p.approved && !inBracket && (
                                <button className="action-btn view" onClick={async () => { try { await runBracketAdminAction('tavla', 'add', { participantId: p.id }); await loadTournamentData(); } catch (err: any) { alert('Ekleme hatası: ' + err.message); } }}>➕ Playoff&apos;a Ekle</button>
                              )}
                              {inBracket && (
                                <button className="action-btn approve" onClick={async () => { try { await runBracketAdminAction('tavla', 'remove_participant', { participantId: p.id }); await loadTournamentData(); } catch (err: any) { alert(err.message); } }}>✓ Playoff&apos;ta (#{slotIndex + 1})</button>
                              )}
                              <button className="action-btn reject" onClick={() => { if (confirm('Bu katılımcıyı silmek istediğinize emin misiniz?')) runParticipantAdminAction('tavla', 'delete', p.id, loadTournamentData); }}>🗑 Sil</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card">
              <h3 className="section-title">🎯 Playoff Tablosu Yönetimi</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 20, fontSize: 14 }}>Playoff tablosuna katılımcı eklemek için yukarıdaki &quot;Playoff&apos;a Ekle&quot; butonunu kullan.</p>
              <div className="bracket-slots">
                {buildFullBracket(tournamentBracket).map((slot, index) => {
                  const slotName = getParticipantNameById(tournamentParticipants, slot.participant_id);
                  return (
                    <div key={index} className={`bracket-slot ${slot.participant_id ? 'occupied' : ''}`}>
                      <div className="slot-number">{index + 1}</div>
                      <div className="slot-info">
                        <div className="slot-name">{slotName || 'Boş'}</div>
                        <div className="slot-round">{BRACKET_ROUND_NAMES[index]}</div>
                      </div>
                      {slot.participant_id && (
                        <div className="slot-actions">
                          <button className={`slot-btn winner ${slot.winner ? 'active' : ''}`} title="Galip" onClick={async () => { try { await runBracketAdminAction('tavla', 'toggle_winner', { slotIndex: index }); await loadTournamentData(); } catch (err: any) { alert(err.message); } }}>🏆</button>
                          <button className="slot-btn clear" title="Temizle" onClick={async () => { if (!confirm('Bu slotu temizlemek istediğinize emin misiniz?')) return; try { await runBracketAdminAction('tavla', 'clear_slot', { slotIndex: index }); await loadTournamentData(); } catch (err: any) { alert(err.message); } }}>✕</button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ==================== HACKATHON SECTION ==================== */}
          <div className={`section ${activeSection === 'hackathon' ? 'active' : ''}`}>
            <div className="stats-grid">
              <div className="stat-card"><div className="stat-value">{hackathonParticipants.length}</div><div className="stat-label">Toplam Kayıt</div></div>
              <div className="stat-card"><div className="stat-value">{hackathonParticipants.filter(p => p.approved).length}</div><div className="stat-label">Onaylı</div></div>
              <div className="stat-card"><div className="stat-value">{hackathonParticipants.filter(p => !p.approved).length}</div><div className="stat-label">Onay Bekleyen</div></div>
            </div>
            <div className="card">
              <div className="section-header">
                <h3 className="section-title">💻 Vibecoding Takım Yönetimi</h3>
                <button className="back-btn" onClick={showMenu}>← Menüye Dön</button>
              </div>
              <div className="tabs">
                {['all', 'pending', 'approved'].map((t) => (
                  <button key={t} className={`tab-btn ${hackathonTab === t ? 'active' : ''}`} onClick={() => setHackathonTab(t)}>
                    {t === 'all' ? 'Tümü' : t === 'pending' ? 'Onay Bekleyen' : 'Onaylı'}
                  </button>
                ))}
              </div>
              <div className="table-container">
                <table className="data-table">
                  <thead><tr><th>#</th><th>Takım/İsim</th><th>WhatsApp</th><th>Kayıt Tarihi</th><th>Durum</th><th>İşlemler</th></tr></thead>
                  <tbody>
                    {filteredHackathon.length === 0 ? (
                      <tr><td colSpan={6}><div className="empty-state"><div className="empty-state-icon">💻</div><p>Bu kategoride kayıtlı katılımcı yok</p></div></td></tr>
                    ) : filteredHackathon.map((p) => (
                      <tr key={p.id}>
                        <td>{hackathonParticipants.indexOf(p) + 1}</td>
                        <td><div className="user-name">{escapeHtml(p.name)}</div></td>
                        <td>{p.whatsapp ? escapeHtml(p.whatsapp) : '-'}</td>
                        <td>{formatDate(p.created_at)}</td>
                        <td>{p.approved ? <span className="status-badge approved">✓ Onaylı</span> : <span className="status-badge pending">⏳ Onay Bekliyor</span>}</td>
                        <td>
                          <div className="action-btns">
                            {!p.approved
                              ? <button className="action-btn approve" onClick={() => runParticipantAdminAction('vct', 'approve', p.id, loadHackathonData)}>✓ Onayla</button>
                              : <button className="action-btn reject" onClick={() => { if (confirm('Onayı iptal etmek istediğinize emin misiniz?')) runParticipantAdminAction('vct', 'unapprove', p.id, loadHackathonData); }}>✗ İptal</button>}
                            <button className="action-btn reject" onClick={() => { if (confirm('Bu katılımcıyı silmek istediğinize emin misiniz?')) runParticipantAdminAction('vct', 'delete', p.id, loadHackathonData); }}>🗑 Sil</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ==================== TYPING SECTION ==================== */}
          <div className={`section ${activeSection === 'typing' ? 'active' : ''}`}>
            <div className="stats-grid">
              <div className="stat-card"><div className="stat-value">{typingParticipants.length}</div><div className="stat-label">Toplam Kayıt</div></div>
              <div className="stat-card"><div className="stat-value">{typingParticipants.filter(p => p.approved).length}</div><div className="stat-label">Onaylı</div></div>
              <div className="stat-card"><div className="stat-value">{typingParticipants.filter(p => !p.approved).length}</div><div className="stat-label">Onay Bekleyen</div></div>
              <div className="stat-card"><div className="stat-value">{typingBracket.filter(s => s.participant_id).length}</div><div className="stat-label">Turnuvada</div></div>
            </div>
            <div className="card">
              <div className="section-header">
                <h3 className="section-title">⌨️ Klavye Hız Yarışması Yönetimi</h3>
                <button className="back-btn" onClick={showMenu}>← Menüye Dön</button>
              </div>
              <div className="tabs">
                {['all', 'pending', 'approved'].map((t) => (
                  <button key={t} className={`tab-btn ${typingTab === t ? 'active' : ''}`} onClick={() => setTypingTab(t)}>
                    {t === 'all' ? 'Tümü' : t === 'pending' ? 'Onay Bekleyen' : 'Onaylı'}
                  </button>
                ))}
              </div>
              <div className="table-container">
                <table className="data-table">
                  <thead><tr><th>#</th><th>Katılımcı</th><th>WhatsApp</th><th>Kayıt Tarihi</th><th>Durum</th><th>İşlemler</th></tr></thead>
                  <tbody>
                    {filteredTyping.length === 0 ? (
                      <tr><td colSpan={6}><div className="empty-state"><div className="empty-state-icon">⌨️</div><p>Bu kategoride kayıtlı katılımcı yok</p></div></td></tr>
                    ) : filteredTyping.map((p) => {
                      const inBracket = typingBracket.some(s => s.participant_id === p.id);
                      const slotIndex = typingBracket.findIndex(s => s.participant_id === p.id);
                      return (
                        <tr key={p.id}>
                          <td>{typingParticipants.indexOf(p) + 1}</td>
                          <td><div className="user-name">{escapeHtml(p.name)}</div></td>
                          <td>{p.whatsapp ? escapeHtml(p.whatsapp) : '-'}</td>
                          <td>{formatDate(p.created_at)}</td>
                          <td>{p.approved ? <span className="status-badge approved">✓ Onaylı</span> : <span className="status-badge pending">⏳ Onay Bekliyor</span>}</td>
                          <td>
                            <div className="action-btns">
                              {!p.approved
                                ? <button className="action-btn approve" onClick={() => runParticipantAdminAction('typing', 'approve', p.id, loadTypingData)}>✓ Onayla</button>
                                : <button className="action-btn reject" onClick={() => { if (confirm('Onayı iptal etmek istediğinize emin misiniz?')) runParticipantAdminAction('typing', 'unapprove', p.id, loadTypingData); }}>✗ İptal</button>}
                              {p.approved && !inBracket && (
                                <button className="action-btn view" onClick={async () => { try { await runBracketAdminAction('typing', 'add', { participantId: p.id }); await loadTypingData(); } catch (err: any) { alert('Ekleme hatası: ' + err.message); } }}>➕ Turnuvaya Ekle</button>
                              )}
                              {inBracket && (
                                <button className="action-btn approve" onClick={async () => { try { await runBracketAdminAction('typing', 'remove_participant', { participantId: p.id }); await loadTypingData(); } catch (err: any) { alert(err.message); } }}>✓ Turnuvada (#{slotIndex + 1})</button>
                              )}
                              <button className="action-btn reject" onClick={() => { if (confirm('Bu katılımcıyı silmek istediğinize emin misiniz?')) runParticipantAdminAction('typing', 'delete', p.id, loadTypingData); }}>🗑 Sil</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card">
              <h3 className="section-title">🎯 Turnuva Tablosu Yönetimi</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 20, fontSize: 14 }}>Turnuva tablosuna katılımcı eklemek için yukarıdaki &quot;Turnuvaya Ekle&quot; butonunu kullan.</p>
              <div className="bracket-slots">
                {buildFullBracket(typingBracket).map((slot, index) => {
                  const slotName = getParticipantNameById(typingParticipants, slot.participant_id);
                  return (
                    <div key={index} className={`bracket-slot ${slot.participant_id ? 'occupied' : ''}`}>
                      <div className="slot-number">{index + 1}</div>
                      <div className="slot-info">
                        <div className="slot-name">{slotName || 'Boş'}</div>
                        <div className="slot-round">{BRACKET_ROUND_NAMES[index]}</div>
                      </div>
                      {slot.participant_id && (
                        <div className="slot-actions">
                          <button className={`slot-btn winner ${slot.winner ? 'active' : ''}`} title="Galip" onClick={async () => { try { await runBracketAdminAction('typing', 'toggle_winner', { slotIndex: index }); await loadTypingData(); } catch (err: any) { alert(err.message); } }}>🏆</button>
                          <button className="slot-btn clear" title="Temizle" onClick={async () => { if (!confirm('Bu slotu temizlemek istediğinize emin misiniz?')) return; try { await runBracketAdminAction('typing', 'clear_slot', { slotIndex: index }); await loadTypingData(); } catch (err: any) { alert(err.message); } }}>✕</button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ==================== PROMOTE SECTION ==================== */}
          <div className={`section ${activeSection === 'promote' ? 'active' : ''}`}>
            <div className="stats-grid">
              <div className="stat-card"><div className="stat-value">{promoteParticipants.length}</div><div className="stat-label">Toplam Kayıt</div></div>
              <div className="stat-card"><div className="stat-value">{promoteParticipants.filter(p => p.approved).length}</div><div className="stat-label">Onaylı</div></div>
              <div className="stat-card"><div className="stat-value">{promoteParticipants.filter(p => !p.approved).length}</div><div className="stat-label">Onay Bekleyen</div></div>
            </div>
            <div className="card">
              <div className="section-header">
                <h3 className="section-title">📢 Promote Your Product Yönetimi</h3>
                <button className="back-btn" onClick={showMenu}>← Menüye Dön</button>
              </div>
              <div className="tabs">
                {['all', 'pending', 'approved'].map((t) => (
                  <button key={t} className={`tab-btn ${promoteTab === t ? 'active' : ''}`} onClick={() => setPromoteTab(t)}>
                    {t === 'all' ? 'Tümü' : t === 'pending' ? 'Onay Bekleyen' : 'Onaylı'}
                  </button>
                ))}
              </div>
              <div className="table-container">
                <table className="data-table">
                  <thead><tr><th>#</th><th>Katılımcı</th><th>Ürün/Proje</th><th>WhatsApp</th><th>Kayıt Tarihi</th><th>Durum</th><th>İşlemler</th></tr></thead>
                  <tbody>
                    {filteredPromote.length === 0 ? (
                      <tr><td colSpan={7}><div className="empty-state"><div className="empty-state-icon">📢</div><p>Bu kategoride kayıtlı katılımcı yok</p></div></td></tr>
                    ) : filteredPromote.map((p) => (
                      <tr key={p.id}>
                        <td>{promoteParticipants.indexOf(p) + 1}</td>
                        <td><div className="user-name">{escapeHtml(p.name)}</div></td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{escapeHtml(p.product_name || '-')}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-secondary)', maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{escapeHtml(p.product_desc || '')}</div>
                        </td>
                        <td>{p.whatsapp ? escapeHtml(p.whatsapp) : '-'}</td>
                        <td>{formatDate(p.created_at)}</td>
                        <td>{p.approved ? <span className="status-badge approved">✓ Onaylı</span> : <span className="status-badge pending">⏳ Onay Bekliyor</span>}</td>
                        <td>
                          <div className="action-btns">
                            {!p.approved
                              ? <button className="action-btn approve" onClick={() => runParticipantAdminAction('promote', 'approve', p.id, loadPromoteData)}>✓ Onayla</button>
                              : <button className="action-btn reject" onClick={() => { if (confirm('Onayı iptal etmek istediğinize emin misiniz?')) runParticipantAdminAction('promote', 'unapprove', p.id, loadPromoteData); }}>✗ İptal</button>}
                            <button className="action-btn reject" onClick={() => { if (confirm('Bu katılımcıyı silmek istediğinize emin misiniz?')) runParticipantAdminAction('promote', 'delete', p.id, loadPromoteData); }}>🗑 Sil</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ==================== CVOPT SECTION ==================== */}
          <div className={`section ${activeSection === 'cvopt' ? 'active' : ''}`}>
            <div className="stats-grid">
              <div className="stat-card"><div className="stat-value">{cvoptParticipants.length}</div><div className="stat-label">Toplam Kayıt</div></div>
              <div className="stat-card"><div className="stat-value">{cvoptParticipants.filter(p => p.approved).length}</div><div className="stat-label">Onaylı</div></div>
              <div className="stat-card"><div className="stat-value">{cvoptParticipants.filter(p => !p.approved).length}</div><div className="stat-label">Onay Bekleyen</div></div>
            </div>
            <div className="card">
              <div className="section-header">
                <h3 className="section-title">📄 CV + LinkedIn İyileştirme Başvuruları</h3>
                <button className="back-btn" onClick={showMenu}>← Menüye Dön</button>
              </div>
              <div className="tabs">
                {['all', 'pending', 'approved'].map((t) => (
                  <button key={t} className={`tab-btn ${cvoptTab === t ? 'active' : ''}`} onClick={() => setCvoptTab(t)}>
                    {t === 'all' ? 'Tümü' : t === 'pending' ? 'Onay Bekleyen' : 'Onaylı'}
                  </button>
                ))}
              </div>
              <div className="table-container">
                <table className="data-table">
                  <thead><tr><th>#</th><th>Kullanıcı</th><th>Tarih</th><th>Durum</th><th>İşlem</th></tr></thead>
                  <tbody>
                    {filteredCvopt.length === 0 ? (
                      <tr><td colSpan={5}><div className="empty-state"><div className="empty-state-icon">📄</div><p>Bu kategoride kayıtlı katılımcı yok</p></div></td></tr>
                    ) : filteredCvopt.map((p) => {
                      const linkedinUrl = normalizeLinkedinUrl(String(p.linkedin || '').trim());
                      const whatsappUrl = buildWaMeUrl(String(p.whatsapp || '').trim());
                      return (
                        <tr key={p.id}>
                          <td>{cvoptParticipants.indexOf(p) + 1}</td>
                          <td>
                            <div className="user-cell">
                              <span className="user-name">{escapeHtml(p.name || '-')}</span>
                              {linkedinUrl && <a className="contact-link linkedin" href={linkedinUrl} target="_blank" rel="noopener noreferrer">in</a>}
                              {whatsappUrl && <a className="contact-link whatsapp" href={whatsappUrl} target="_blank" rel="noopener noreferrer">wa</a>}
                            </div>
                          </td>
                          <td>{formatDate(p.created_at)}</td>
                          <td>
                            <div className="status-stack">
                              {p.approved ? <span className="status-badge approved">✓ Onaylı</span> : <span className="status-badge pending">⏳ Onay Bekliyor</span>}
                              {p.linkedin_ok ? <span className="status-badge review">in LinkedIn OK</span> : <span className="status-badge muted">in LinkedIn Bekliyor</span>}
                              {p.cv_ok ? <span className="status-badge review">📄 CV OK</span> : <span className="status-badge muted">📄 CV Bekliyor</span>}
                            </div>
                          </td>
                          <td>
                            <div className="action-btns">
                              {!p.approved
                                ? <button className="action-btn approve" onClick={() => runParticipantAdminAction('cvopt', 'approve', p.id, loadCvoptData)}>Onayla</button>
                                : <button className="action-btn reject" onClick={() => { if (confirm('Onayı iptal etmek istediğinize emin misiniz?')) runParticipantAdminAction('cvopt', 'unapprove', p.id, loadCvoptData); }}>İptal</button>}
                              {!p.linkedin_ok
                                ? <button className="action-btn view" onClick={() => runParticipantAdminAction('cvopt', 'linkedin_ok', p.id, loadCvoptData)}>in ✓</button>
                                : <button className="action-btn reject" onClick={() => runParticipantAdminAction('cvopt', 'linkedin_pending', p.id, loadCvoptData)}>in ✗</button>}
                              {!p.cv_ok
                                ? <button className="action-btn view" onClick={() => runParticipantAdminAction('cvopt', 'cv_ok', p.id, loadCvoptData)}>CV ✓</button>
                                : <button className="action-btn reject" onClick={() => runParticipantAdminAction('cvopt', 'cv_pending', p.id, loadCvoptData)}>CV ✗</button>}
                              <button className="action-btn reject" onClick={() => { if (confirm('Bu katılımcıyı silmek istediğinize emin misiniz?')) runParticipantAdminAction('cvopt', 'delete', p.id, loadCvoptData); }}>Sil</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ==================== DISCUSSION SECTION ==================== */}
          <div className={`section ${activeSection === 'discussion' ? 'active' : ''}`}>
            <div className="stats-grid">
              <div className="stat-card"><div className="stat-value">{discussionRows.length}</div><div className="stat-label">Toplam Konu</div></div>
              <div className="stat-card"><div className="stat-value">{discussionRows.filter(i => normalizeDiscussionStatus(i.status) === 'pending').length}</div><div className="stat-label">Onay Bekleyen</div></div>
              <div className="stat-card"><div className="stat-value">{discussionRows.filter(i => normalizeDiscussionStatus(i.status) === 'approved').length}</div><div className="stat-label">Onaylı</div></div>
              <div className="stat-card"><div className="stat-value">{filteredDiscussion.length}</div><div className="stat-label">Filtre Sonucu</div></div>
            </div>
            <div className="card">
              <div className="section-header">
                <h3 className="section-title">💬 Yeni Tartışma Konuları</h3>
                <button className="back-btn" onClick={showMenu}>← Menüye Dön</button>
              </div>
              <div className="tabs">
                {['all', 'pending', 'approved'].map((t) => (
                  <button key={t} className={`tab-btn ${discussionTab === t ? 'active' : ''}`} onClick={() => setDiscussionTab(t)}>
                    {t === 'all' ? 'Tümü' : t === 'pending' ? 'Onay Bekleyen' : 'Onaylı'}
                  </button>
                ))}
              </div>
              {discussionLoading ? (
                <div className="loading"><div className="loading-spinner" /><p>Yükleniyor...</p></div>
              ) : (
                <div className="table-container">
                  <table className="data-table">
                    <thead><tr><th>Konu</th><th>Gönderen</th><th>Durum</th><th>Tarih</th><th>İşlemler</th></tr></thead>
                    <tbody>
                      {filteredDiscussion.length === 0 ? (
                        <tr><td colSpan={5}><div className="empty-state"><div className="empty-state-icon">💬</div><p>Bu kategoride kayıtlı tartışma konusu yok</p></div></td></tr>
                      ) : filteredDiscussion.map((item) => {
                        const approved = normalizeDiscussionStatus(item.status) === 'approved';
                        const sender = item.anonymous ? 'Anonim' : (item.full_name || '-');
                        return (
                          <tr key={item.id}>
                            <td className="topic-cell">{escapeHtml(item.topic || '')}</td>
                            <td>
                              {escapeHtml(sender)}
                              {item.anonymous && <span className="meta-line">anonim</span>}
                            </td>
                            <td>{approved ? <span className="status-badge approved">✓ Onaylı</span> : <span className="status-badge pending">⏳ Onay Bekliyor</span>}</td>
                            <td>{formatDate(item.created_at)}</td>
                            <td>
                              <div className="action-btns">
                                <button className="action-btn approve" onClick={() => runDiscussionAction('approve', item.id)} disabled={approved}>✓ Onayla</button>
                                <button className="action-btn view" onClick={() => runDiscussionAction('pending', item.id)} disabled={!approved}>⏳ Beklemeye Al</button>
                                <button className="action-btn reject" onClick={() => runDiscussionAction('delete', item.id)}>🗑 Sil</button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* ==================== NEWS SECTION ==================== */}
          <div className={`section ${activeSection === 'news' ? 'active' : ''}`}>
            <div className="stats-grid">
              <div className="stat-card"><div className="stat-value">{newsStats.total}</div><div className="stat-label">Toplam Haber</div></div>
              <div className="stat-card"><div className="stat-value">{newsStats.draft}</div><div className="stat-label">Taslak</div></div>
              <div className="stat-card"><div className="stat-value">{newsStats.published}</div><div className="stat-label">Yayında</div></div>
              <div className="stat-card"><div className="stat-value">{newsRows.length}</div><div className="stat-label">Filtre Sonucu</div></div>
            </div>
            <div className="card">
              <div className="section-header">
                <h3 className="section-title">📰 Haber Yönetimi</h3>
                <button className="back-btn" onClick={showMenu}>← Menüye Dön</button>
              </div>
              <div className="tabs">
                {['all', 'draft', 'published'].map((t) => (
                  <button key={t} className={`tab-btn ${newsTab === t ? 'active' : ''}`} onClick={() => { setNewsTab(t); loadNewsAdminData(t, newsSearch); }}>
                    {t === 'all' ? 'Tümü' : t === 'draft' ? 'Taslak' : 'Yayında'}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
                <input
                  type="text"
                  placeholder="Başlıkta ara..."
                  value={newsSearch}
                  onChange={(e) => {
                    setNewsSearch(e.target.value);
                    setTimeout(() => loadNewsAdminData(newsTab, e.target.value), 260);
                  }}
                  style={{ flex: 1, minWidth: 220, padding: '10px 12px', border: '1px solid var(--glass-border)', borderRadius: 10, background: 'rgba(255,255,255,0.04)', color: 'var(--text-primary)', outline: 'none' }}
                />
                <button className="action-btn view" onClick={() => loadNewsAdminData()}>Yenile</button>
              </div>
              {newsLoading ? (
                <div className="loading"><div className="loading-spinner" /><p>Yükleniyor...</p></div>
              ) : (
                <div className="table-container">
                  <table className="data-table">
                    <thead><tr><th>Başlık</th><th>Kategori</th><th>Durum</th><th>Tarih</th><th>İşlemler</th></tr></thead>
                    <tbody>
                      {newsRows.length === 0 ? (
                        <tr><td colSpan={5}><div className="empty-state"><div className="empty-state-icon">📰</div><p>Bu filtre için haber bulunamadı</p></div></td></tr>
                      ) : newsRows.map((item, index) => {
                        const status = normalizeNewsStatus(item.status);
                        const publishedDate = item.published_at || item.created_at;
                        const categories = ['Almanya', 'Türkiye', 'Avrupa', 'Dünya'];
                        const selectedCat = normalizeNewsCategory(item.category);
                        return (
                          <tr key={item.id}>
                            <td>
                              <div style={{ fontWeight: 600, marginBottom: 4 }}>{escapeHtml(item.title || '(Başlıksız)')}</div>
                              {item.summary && <div className="meta-line">{escapeHtml(item.summary)}</div>}
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                                <NewsCategorySelect item={item} index={index} selectedCat={selectedCat} categories={categories} onSave={async (id, category) => { try { await runNewsAdminAction({ action: 'set_category', id, category }); } catch (err: any) { alert(err.message); } }} />
                              </div>
                            </td>
                            <td>{status === 'published' ? <span className="status-badge approved">✓ Yayında</span> : <span className="status-badge pending">⏳ Taslak</span>}</td>
                            <td>{formatDate(publishedDate)}</td>
                            <td>
                              <div className="action-btns">
                                {status === 'published'
                                  ? <button className="action-btn view" onClick={async () => { try { await runNewsAdminAction({ action: 'set_status', id: item.id, status: 'draft' }); } catch (err: any) { alert(err.message); } }}>Taslağa Al</button>
                                  : <button className="action-btn approve" onClick={async () => { try { await runNewsAdminAction({ action: 'set_status', id: item.id, status: 'published' }); } catch (err: any) { alert(err.message); } }}>Yayınla</button>}
                                <button className="action-btn reject" onClick={async () => { if (!confirm('Bu haberi tamamen silmek istediğinize emin misiniz?')) return; try { await runNewsAdminAction({ action: 'delete', id: item.id }); } catch (err: any) { alert(err.message); } }}>Sil</button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* ==================== MEETING SECTION ==================== */}
          <div className={`section ${activeSection === 'meeting' ? 'active' : ''}`}>
            <div className="stats-grid">
              <div className="stat-card"><div className="stat-value">{meetingTotal}</div><div className="stat-label">Toplam Katılımcı</div></div>
            </div>
            <div className="card">
              <div className="section-header">
                <h3 className="section-title">📅 Toplantı Anketi Sonuçları</h3>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="action-btn reject" onClick={resetMeetingData} style={{ padding: '8px 16px', border: '1px solid var(--google-red)', background: 'rgba(234,67,53,0.1)', color: 'var(--google-red)', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>🗑 Tümünü Sıfırla</button>
                  <button className="back-btn" onClick={showMenu}>← Menüye Dön</button>
                </div>
              </div>
              {meetingLoading ? (
                <div className="loading"><div className="loading-spinner" /><p>Veriler yükleniyor...</p></div>
              ) : (
                <>
                  <h4 style={{ fontSize: 16, marginBottom: 16, color: 'var(--text-primary)' }}>Tarih Dağılımı</h4>
                  <div style={{ marginBottom: 24 }}>
                    {meetingDateStats.length === 0 ? (
                      <p style={{ color: 'var(--text-secondary)' }}>Henüz veri yok.</p>
                    ) : (() => {
                      const maxVotes = Math.max(...meetingDateStats.map((d: any) => d.vote_count));
                      return meetingDateStats.map((item: any) => {
                        const percentage = maxVotes > 0 ? (item.vote_count / maxVotes * 100) : 0;
                        return (
                          <div key={item.date_option} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--card-bg)', border: '1px solid var(--glass-border)', borderRadius: 12, marginBottom: 8 }}>
                            <div>
                              <div style={{ fontWeight: 600, color: '#fff' }}>{formatDateLabel(item.date_option)}</div>
                              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>20:00 - 21:00 TSİ</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{ width: 100, height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                                <div style={{ width: `${percentage}%`, height: '100%', background: 'linear-gradient(135deg, #34A853 0%, #4285F4 100%)', borderRadius: 3 }} />
                              </div>
                              <span style={{ fontWeight: 600, color: '#fff', minWidth: 24, textAlign: 'right' }}>{item.vote_count}</span>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>

                  <h4 style={{ fontSize: 16, marginBottom: 16, color: 'var(--text-primary)' }}>Katılımcı Listesi</h4>
                  <div className="table-container">
                    <table className="data-table">
                      <thead><tr><th>Ad Soyad</th><th>WhatsApp</th><th>Uygun Tarihler</th><th>Kayıt Tarihi</th></tr></thead>
                      <tbody>
                        {meetingParticipants.length === 0 ? (
                          <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Henüz katılımcı yok.</td></tr>
                        ) : meetingParticipants.map((p: any) => {
                          const dates = p.available_dates?.map((d: string) => formatDateLabel(d)).join(', ') || '-';
                          const createdAt = new Date(p.created_at);
                          const cleanNumber = p.whatsapp ? p.whatsapp.replace(/[\s\+\-\(\)]/g, '') : '';
                          return (
                            <tr key={p.id || p.whatsapp}>
                              <td>{escapeHtml(p.full_name)}</td>
                              <td>{p.whatsapp ? <a href={`https://wa.me/${cleanNumber}`} target="_blank" rel="noopener noreferrer" style={{ color: '#34A853', textDecoration: 'none', fontWeight: 500 }}>{escapeHtml(p.whatsapp)} ↗</a> : '-'}</td>
                              <td>{escapeHtml(dates)}</td>
                              <td>{createdAt.toLocaleDateString('tr-TR')} {createdAt.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', padding: '24px 0 32px' }}>
          <Link href="/" style={{ padding: '10px 24px', borderRadius: 10, background: 'rgba(255,255,255,0.08)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 500, fontSize: 14, transition: 'background 0.2s' }}
            onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
            onMouseOut={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}>
            Ana Sayfaya Dön
          </Link>
          <Link href="/devuser" style={{ padding: '10px 24px', borderRadius: 10, background: 'rgba(66,133,244,0.15)', border: '1px solid rgba(66,133,244,0.4)', color: '#4285F4', textDecoration: 'none', fontWeight: 500, fontSize: 14, transition: 'background 0.2s' }}
            onMouseOver={e => (e.currentTarget.style.background = 'rgba(66,133,244,0.25)')}
            onMouseOut={e => (e.currentTarget.style.background = 'rgba(66,133,244,0.15)')}>
            Software Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

// ==================== NEWS CATEGORY SELECT (sub-component to hold local state) ====================
function NewsategorySelect({ item, index, selectedCat, categories, onSave }: {
  item: any; index: number; selectedCat: string; categories: string[];
  onSave: (id: string, category: string) => Promise<void>;
}) {
  const [cat, setCat] = useState(selectedCat);
  return (
    <>
      <select
        value={cat}
        onChange={(e) => setCat(e.target.value)}
        style={{ padding: '6px 8px', border: '1px solid var(--glass-border)', borderRadius: 8, background: 'rgba(255,255,255,0.06)', color: 'var(--text-primary)', minWidth: 110 }}
      >
        {categories.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      <button className="action-btn view" onClick={() => onSave(item.id, cat)}>Kaydet</button>
    </>
  );
}

function NewsCategorySelect(props: Parameters<typeof NewsategorySelect>[0]) {
  return <NewsategorySelect {...props} />;
}
