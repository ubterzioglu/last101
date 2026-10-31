'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import FounderSubmissionsAdminSection from '@/components/admin/FounderSubmissionsAdminSection';
import FounderEventSurveyAdminSection from '@/components/admin/FounderEventSurveyAdminSection';
import { useAdminGate } from '@/hooks/useAdminGate';
import { SOFTWARE_HUB_SECTION_KEYS } from '@/constants/adminSoftwareHubSections';
import {
  USERS_API_URL,
  USER_UPDATE_API_URL,
  PARTICIPANT_ACTION_API_URL,
  PARTICIPANT_LIST_API_URL,
  PARTICIPANT_BRACKET_ACTION_API_URL,
  DISCUSSION_LIST_API_URL,
  DISCUSSION_ACTION_API_URL,
  NEWS_ADMIN_LIST_API_URL,
  NEWS_ADMIN_ACTION_API_URL,
  MEETING_ADMIN_LIST_API_URL,
  MEETING_RESET_API_URL,
  GENERIC_ERROR_MESSAGE,
  errorMessage,
  loadAdminAuth,
  getAdminHeaders,
  normalizeDiscussionStatus,
} from '@/components/admin/softwareHub/api';
import { fetchBadges } from '@/components/admin/softwareHub/fetchBadges';
import { AdminPageHeader } from '@/components/admin/ui/AdminPageHeader';
import FooterLinks from '@/components/admin/softwareHub/FooterLinks';
import MainMenu from '@/components/admin/softwareHub/MainMenu';
import DevUserSection from '@/components/admin/softwareHub/DevUserSection';
import TournamentSection from '@/components/admin/softwareHub/TournamentSection';
import HackathonSection from '@/components/admin/softwareHub/HackathonSection';
import TypingSection from '@/components/admin/softwareHub/TypingSection';
import PromoteSection from '@/components/admin/softwareHub/PromoteSection';
import CvOptSection from '@/components/admin/softwareHub/CvOptSection';
import DiscussionSection from '@/components/admin/softwareHub/DiscussionSection';
import NewsSection from '@/components/admin/softwareHub/NewsSection';
import MeetingSection from '@/components/admin/softwareHub/MeetingSection';
import type {
  SoftwareHubApiErrorPayload,
  SoftwareHubBracketSlot,
  SoftwareHubDevUser,
  SoftwareHubDiscussionListPayload,
  SoftwareHubDiscussionRow,
  SoftwareHubMeetingDateStat,
  SoftwareHubMeetingListPayload,
  SoftwareHubMeetingParticipant,
  SoftwareHubNewsListPayload,
  SoftwareHubNewsRow,
  SoftwareHubNewsStats,
  SoftwareHubParticipant,
  SoftwareHubParticipantCategoryData,
  SoftwareHubParticipantListPayload,
} from '@/types/software-hub';

// ==================== MAIN COMPONENT ====================
export default function AdminPage() {
  const badgeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auth state — single-door gate via /admin
  const gateStatus = useAdminGate();
  const authed = gateStatus === 'authed';

  // Navigation — `?section=` query param drives which section is open.
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Badges
  const [badges, setBadges] = useState<Record<string, number | string>>({});

  // DevUsers
  const [devUsers, setDevUsers] = useState<SoftwareHubDevUser[]>([]);
  const [devuserTab, setDevuserTab] = useState('all');
  const [devuserLoading, setDevuserLoading] = useState(false);

  // Tournament
  const [tournamentParticipants, setTournamentParticipants] = useState<SoftwareHubParticipant[]>([]);
  const [tournamentBracket, setTournamentBracket] = useState<SoftwareHubBracketSlot[]>([]);
  const [tournamentTab, setTournamentTab] = useState('all');

  // Hackathon
  const [hackathonParticipants, setHackathonParticipants] = useState<SoftwareHubParticipant[]>([]);
  const [hackathonTab, setHackathonTab] = useState('all');

  // Typing
  const [typingParticipants, setTypingParticipants] = useState<SoftwareHubParticipant[]>([]);
  const [typingBracket, setTypingBracket] = useState<SoftwareHubBracketSlot[]>([]);
  const [typingTab, setTypingTab] = useState('all');

  // Promote
  const [promoteParticipants, setPromoteParticipants] = useState<SoftwareHubParticipant[]>([]);
  const [promoteTab, setPromoteTab] = useState('all');

  // CvOpt
  const [cvoptParticipants, setCvoptParticipants] = useState<SoftwareHubParticipant[]>([]);
  const [cvoptTab, setCvoptTab] = useState('all');

  // Discussion
  const [discussionRows, setDiscussionRows] = useState<SoftwareHubDiscussionRow[]>([]);
  const [discussionTab, setDiscussionTab] = useState('all');
  const [discussionLoading, setDiscussionLoading] = useState(false);

  // News
  const [newsRows, setNewsRows] = useState<SoftwareHubNewsRow[]>([]);
  const [newsStats, setNewsStats] = useState<SoftwareHubNewsStats>({ total: 0, draft: 0, published: 0 });
  const [newsTab, setNewsTab] = useState('all');
  const [newsSearch, setNewsSearch] = useState('');
  const [newsLoading, setNewsLoading] = useState(false);

  // Meeting
  const [meetingParticipants, setMeetingParticipants] = useState<SoftwareHubMeetingParticipant[]>([]);
  const [meetingDateStats, setMeetingDateStats] = useState<SoftwareHubMeetingDateStat[]>([]);
  const [meetingTotal, setMeetingTotal] = useState(0);
  const [meetingLoading, setMeetingLoading] = useState(false);

  // Site header/footer hiding is owned by the admin layout (data-devuser is
  // set before paint in app/admin/layout.tsx and managed by AdminLayoutShell).

  // ==================== BADGES ====================
  const updateBadges = useCallback(async () => {
    if (!authed) return;
    const saved = loadAdminAuth();
    if (!saved.password) return;
    try {
      setBadges(await fetchBadges());
    } catch { /* silent */ }
  }, [authed]);

  useEffect(() => {
    if (!authed) return;
    updateBadges();
    badgeIntervalRef.current = setInterval(updateBadges, 5000);
    return () => { if (badgeIntervalRef.current) clearInterval(badgeIntervalRef.current); };
  }, [authed, updateBadges]);

  // ==================== NAVIGATION ====================
  // `?section=` is the single source of truth. Navigation helpers update the
  // URL; the effect below reconciles `activeSection` + lazy data loading. The
  // intermediate menu page is `/admin/software-hub` with no `?section=`.
  const loadSectionData = useCallback((section: string) => {
    if (section === 'devuser') loadDevUsers();
    else if (section === 'tournament') loadTournamentData();
    else if (section === 'hackathon') loadHackathonData();
    else if (section === 'typing') loadTypingData();
    else if (section === 'promote') loadPromoteData();
    else if (section === 'cvopt') loadCvoptData();
    else if (section === 'discussion') loadDiscussionData();
    else if (section === 'news') loadNewsAdminData('all', '', false);
    else if (section === 'meeting') loadMeetingData();
    else if (section === 'founders') updateBadges();
    else if (section === 'founderSurvey') updateBadges();
    // Bilinçli: kimliği sabit kalmalı (bölüm effect'inin bağımlılığı); load* fonksiyonları her render'da
    // yeniden oluştuğu için bağımlılığa eklemek sürekli yeniden yüklemeye yol açar. Çözüm: B2.4
    // (react-hooks v7 + useEffectEvent) veya load* fonksiyonlarının memoize edilmesi (B5.7).
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const showSection = useCallback((section: string) => {
    router.push(`/admin/software-hub?section=${section}`, { scroll: false });
  }, [router]);

  const showMenu = () => {
    router.push('/admin/software-hub', { scroll: false });
  };

  // The `?section=` query param is the source of truth for which section is
  // open. This keeps deep links and the left-sidebar shortcuts working even
  // when navigating between sections without a full remount. `useSearchParams`
  // is reactive to client navigation, so this re-runs on every section change.
  const requestedSection = searchParams.get('section');
  const loadedSectionRef = useRef<string | null>(null);
  useEffect(() => {
    if (!authed) return;
    const next = requestedSection && SOFTWARE_HUB_SECTION_KEYS.has(requestedSection)
      ? requestedSection
      : null;
    setActiveSection(next);
    // Lazy-load each section's data the first time it becomes active.
    if (loadedSectionRef.current === next) return;
    loadedSectionRef.current = next;
    if (next) loadSectionData(next);
    else updateBadges();
  }, [authed, requestedSection, loadSectionData, updateBadges]);

  // ==================== DEV USERS ====================
  const loadDevUsers = async () => {
    setDevuserLoading(true);
    try {
      const res = await fetch(USERS_API_URL, { headers: getAdminHeaders({ Accept: 'application/json' }) });
      if (res.status === 401) throw new Error('Admin yetkisi doğrulanamadı.');
      if (!res.ok) throw new Error('API Hatası');
      const result: { data?: SoftwareHubDevUser[] } = await res.json();
      setDevUsers(result.data || []);
    } catch (err) {
      alert(errorMessage(err, GENERIC_ERROR_MESSAGE));
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
      const payload: SoftwareHubApiErrorPayload = await res.json().catch(() => ({}));
      if (res.status === 401) throw new Error('Admin yetkisi doğrulanamadı.');
      if (!res.ok) throw new Error(payload.error || 'İşlem başarısız.');
      await loadDevUsers();
      updateBadges();
    } catch (err) {
      alert(errorMessage(err, GENERIC_ERROR_MESSAGE));
    }
  };

  // ==================== PARTICIPANT HELPERS ====================
  const fetchParticipantAdminData = async (category: string): Promise<SoftwareHubParticipantCategoryData> => {
    const res = await fetch(`${PARTICIPANT_LIST_API_URL}?category=${encodeURIComponent(category)}`, {
      headers: getAdminHeaders({ Accept: 'application/json' }),
    });
    const payload: SoftwareHubParticipantListPayload = await res.json().catch(() => ({}));
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
      const payload: SoftwareHubApiErrorPayload = await res.json().catch(() => ({}));
      if (res.status === 401) throw new Error('Yetki doğrulanamadı.');
      if (!res.ok) throw new Error(payload.error || 'İşlem başarısız.');
      await reload();
      updateBadges();
    } catch (err) {
      alert(errorMessage(err, GENERIC_ERROR_MESSAGE));
    }
  };

  const runBracketAdminAction = async (category: string, action: string, data: Record<string, unknown> = {}) => {
    const res = await fetch(PARTICIPANT_BRACKET_ACTION_API_URL, {
      method: 'POST',
      headers: getAdminHeaders({ 'Content-Type': 'application/json', Accept: 'application/json' }),
      body: JSON.stringify({ category, action, ...data }),
    });
    const payload: SoftwareHubApiErrorPayload & { data?: unknown } = await res.json().catch(() => ({}));
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
    } catch (err) {
      alert('Veriler yüklenirken hata: ' + errorMessage(err, GENERIC_ERROR_MESSAGE));
    }
  };

  // ==================== HACKATHON ====================
  const loadHackathonData = async () => {
    try {
      const data = await fetchParticipantAdminData('vct');
      setHackathonParticipants(Array.isArray(data.participants) ? data.participants : []);
    } catch (err) {
      alert('Veriler yüklenirken hata: ' + errorMessage(err, GENERIC_ERROR_MESSAGE));
    }
  };

  // ==================== TYPING ====================
  const loadTypingData = async () => {
    try {
      const data = await fetchParticipantAdminData('typing');
      setTypingParticipants(Array.isArray(data.participants) ? data.participants : []);
      setTypingBracket(Array.isArray(data.bracket) ? data.bracket : []);
    } catch (err) {
      alert('Veriler yüklenirken hata: ' + errorMessage(err, GENERIC_ERROR_MESSAGE));
    }
  };

  // ==================== PROMOTE ====================
  const loadPromoteData = async () => {
    try {
      const data = await fetchParticipantAdminData('promote');
      setPromoteParticipants(Array.isArray(data.participants) ? data.participants : []);
    } catch (err) {
      alert('Veriler yüklenirken hata: ' + errorMessage(err, GENERIC_ERROR_MESSAGE));
    }
  };

  // ==================== CVOPT ====================
  const loadCvoptData = async () => {
    try {
      const data = await fetchParticipantAdminData('cvopt');
      setCvoptParticipants(Array.isArray(data.participants) ? data.participants : []);
    } catch (err) {
      alert('Veriler yüklenirken hata: ' + errorMessage(err, GENERIC_ERROR_MESSAGE));
    }
  };

  // ==================== DISCUSSION ====================
  const loadDiscussionData = async () => {
    setDiscussionLoading(true);
    try {
      const res = await fetch(`${DISCUSSION_LIST_API_URL}?status=all&limit=1000`, {
        headers: getAdminHeaders({ Accept: 'application/json' }),
      });
      const payload: SoftwareHubDiscussionListPayload = await res.json().catch(() => ({}));
      if (res.status === 401) throw new Error('Admin yetkisi doğrulanamadı.');
      if (!res.ok) throw new Error(payload.error || 'Veriler yüklenemedi.');
      setDiscussionRows(Array.isArray(payload.items) ? payload.items : []);
    } catch (err) {
      alert(errorMessage(err, GENERIC_ERROR_MESSAGE));
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
      const payload: SoftwareHubApiErrorPayload = await res.json().catch(() => ({}));
      if (res.status === 401) throw new Error('Admin yetkisi doğrulanamadı.');
      if (!res.ok) throw new Error(payload.error || 'İşlem başarısız.');
      await loadDiscussionData();
      updateBadges();
    } catch (err) {
      alert(errorMessage(err, GENERIC_ERROR_MESSAGE));
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
      const payload: SoftwareHubNewsListPayload = await res.json().catch(() => ({}));
      if (res.status === 401) throw new Error('Admin yetkisi doğrulanamadı.');
      if (!res.ok) throw new Error(payload.error || 'Haberler yüklenemedi.');
      setNewsRows(Array.isArray(payload.items) ? payload.items : []);
      setNewsStats(payload.stats && typeof payload.stats === 'object' ? payload.stats : { total: 0, draft: 0, published: 0 });
    } catch (err) {
      alert(errorMessage(err, GENERIC_ERROR_MESSAGE));
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
    const result: SoftwareHubApiErrorPayload = await res.json().catch(() => ({}));
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
      const payload: SoftwareHubMeetingListPayload = await res.json().catch(() => ({}));
      if (res.status === 401) throw new Error('Admin yetkisi doğrulanamadı.');
      if (!res.ok) throw new Error(payload.error || 'Toplantı kayıtları alınamadı.');
      setMeetingTotal(Number(payload?.stats?.total || 0));
      setMeetingDateStats(Array.isArray(payload.date_stats) ? payload.date_stats : []);
      setMeetingParticipants(Array.isArray(payload.items) ? payload.items : []);
    } catch (err) {
      alert(errorMessage(err, GENERIC_ERROR_MESSAGE));
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
      if (!res.ok) { const p: SoftwareHubApiErrorPayload = await res.json().catch(() => ({})); throw new Error(p.error || 'Sıfırlama başarısız'); }
      alert('✅ Tüm kayıtlar başarıyla silindi!');
      await loadMeetingData();
    } catch (err) {
      alert(`❌ Hata: ${errorMessage(err, GENERIC_ERROR_MESSAGE)}`);
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


  // ==================== DEVUSER STATS ====================
  const devUserTotal = devUsers.length;
  const devUserApproved = devUsers.filter((u) => u.approval_status === 'approved' || u.onay_durumu === 'approved' || u.admin_onayli).length;
  const devUserPending = devUserTotal - devUserApproved;

  const pendingDevUsers = devUsers.filter((u) => u.onay_durumu !== 'approved' && !u.admin_onayli).length;

  // ==================== RENDER ====================
  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-page p-4 text-ink">
        <div role="status" className="text-sm text-muted">Admin oturumu doğrulanıyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page text-ink">
      <AdminPageHeader
        eyebrow="almanya101.de"
        title="👑 Admin Paneli"
        description="Yönetim işlemleri için bir bölüm seçin."
      />

      <div className="px-4 py-8 sm:px-6 lg:px-9">
        <div className="flex flex-col gap-6">
          {/* Main Menu */}
          {activeSection === null && (
            <MainMenu badges={badges} pendingDevUsers={pendingDevUsers} showSection={showSection} />
          )}

          <DevUserSection
            active={activeSection === 'devuser'}
            showMenu={showMenu}
            devUserTotal={devUserTotal}
            devUserApproved={devUserApproved}
            devUserPending={devUserPending}
            devuserLoading={devuserLoading}
            devuserTab={devuserTab}
            setDevuserTab={setDevuserTab}
            filteredDevUsers={filteredDevUsers}
            updateDevUserStatus={updateDevUserStatus}
          />

          <TournamentSection
            active={activeSection === 'tournament'}
            showMenu={showMenu}
            tournamentParticipants={tournamentParticipants}
            tournamentBracket={tournamentBracket}
            tournamentTab={tournamentTab}
            setTournamentTab={setTournamentTab}
            filteredTournament={filteredTournament}
            runParticipantAdminAction={runParticipantAdminAction}
            runBracketAdminAction={runBracketAdminAction}
            loadTournamentData={loadTournamentData}
          />

          <HackathonSection
            active={activeSection === 'hackathon'}
            showMenu={showMenu}
            hackathonParticipants={hackathonParticipants}
            hackathonTab={hackathonTab}
            setHackathonTab={setHackathonTab}
            filteredHackathon={filteredHackathon}
            runParticipantAdminAction={runParticipantAdminAction}
            loadHackathonData={loadHackathonData}
          />

          <TypingSection
            active={activeSection === 'typing'}
            showMenu={showMenu}
            typingParticipants={typingParticipants}
            typingBracket={typingBracket}
            typingTab={typingTab}
            setTypingTab={setTypingTab}
            filteredTyping={filteredTyping}
            runParticipantAdminAction={runParticipantAdminAction}
            runBracketAdminAction={runBracketAdminAction}
            loadTypingData={loadTypingData}
          />

          <PromoteSection
            active={activeSection === 'promote'}
            showMenu={showMenu}
            promoteParticipants={promoteParticipants}
            promoteTab={promoteTab}
            setPromoteTab={setPromoteTab}
            filteredPromote={filteredPromote}
            runParticipantAdminAction={runParticipantAdminAction}
            loadPromoteData={loadPromoteData}
          />

          <CvOptSection
            active={activeSection === 'cvopt'}
            showMenu={showMenu}
            cvoptParticipants={cvoptParticipants}
            cvoptTab={cvoptTab}
            setCvoptTab={setCvoptTab}
            filteredCvopt={filteredCvopt}
            runParticipantAdminAction={runParticipantAdminAction}
            loadCvoptData={loadCvoptData}
          />

          <DiscussionSection
            active={activeSection === 'discussion'}
            showMenu={showMenu}
            discussionRows={discussionRows}
            discussionTab={discussionTab}
            setDiscussionTab={setDiscussionTab}
            discussionLoading={discussionLoading}
            filteredDiscussion={filteredDiscussion}
            runDiscussionAction={runDiscussionAction}
          />

          <NewsSection
            active={activeSection === 'news'}
            showMenu={showMenu}
            newsRows={newsRows}
            newsStats={newsStats}
            newsTab={newsTab}
            setNewsTab={setNewsTab}
            newsSearch={newsSearch}
            setNewsSearch={setNewsSearch}
            newsLoading={newsLoading}
            loadNewsAdminData={loadNewsAdminData}
            runNewsAdminAction={runNewsAdminAction}
          />

          <FounderSubmissionsAdminSection active={activeSection === 'founders'} onBack={showMenu} />

          <FounderEventSurveyAdminSection active={activeSection === 'founderSurvey'} onBack={showMenu} />

          <MeetingSection
            active={activeSection === 'meeting'}
            showMenu={showMenu}
            meetingTotal={meetingTotal}
            meetingLoading={meetingLoading}
            meetingDateStats={meetingDateStats}
            meetingParticipants={meetingParticipants}
            resetMeetingData={resetMeetingData}
          />
        </div>
        <FooterLinks />
      </div>
    </div>
  );
}
