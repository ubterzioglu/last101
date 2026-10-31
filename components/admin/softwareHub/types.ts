import type {
  SoftwareHubApiErrorPayload,
  SoftwareHubBracketSlot,
  SoftwareHubDevUser,
  SoftwareHubDiscussionRow,
  SoftwareHubMeetingDateStat,
  SoftwareHubMeetingParticipant,
  SoftwareHubNewsRow,
  SoftwareHubNewsStats,
  SoftwareHubParticipant,
} from '@/types/software-hub';

// ==================== SHARED ====================
export type TabSetter = (tab: string) => void;

export type RunParticipantAdminAction = (
  category: string,
  action: string,
  id: string,
  reload: () => Promise<void>,
) => Promise<void>;

export type RunBracketAdminAction = (
  category: string,
  action: string,
  data?: Record<string, unknown>,
) => Promise<unknown>;

export interface SectionBaseProps {
  active: boolean;
  showMenu: () => void;
}

// ==================== MAIN MENU ====================
export interface MainMenuProps {
  badges: Record<string, number | string>;
  pendingDevUsers: number;
  showSection: (section: string) => void;
}

// ==================== SECTIONS ====================
export interface DevUserSectionProps extends SectionBaseProps {
  devUserTotal: number;
  devUserApproved: number;
  devUserPending: number;
  devuserLoading: boolean;
  devuserTab: string;
  setDevuserTab: TabSetter;
  filteredDevUsers: SoftwareHubDevUser[];
  updateDevUserStatus: (userId: string, action: string) => Promise<void>;
}

export interface TournamentSectionProps extends SectionBaseProps {
  tournamentParticipants: SoftwareHubParticipant[];
  tournamentBracket: SoftwareHubBracketSlot[];
  tournamentTab: string;
  setTournamentTab: TabSetter;
  filteredTournament: SoftwareHubParticipant[];
  runParticipantAdminAction: RunParticipantAdminAction;
  runBracketAdminAction: RunBracketAdminAction;
  loadTournamentData: () => Promise<void>;
}

export interface HackathonSectionProps extends SectionBaseProps {
  hackathonParticipants: SoftwareHubParticipant[];
  hackathonTab: string;
  setHackathonTab: TabSetter;
  filteredHackathon: SoftwareHubParticipant[];
  runParticipantAdminAction: RunParticipantAdminAction;
  loadHackathonData: () => Promise<void>;
}

export interface TypingSectionProps extends SectionBaseProps {
  typingParticipants: SoftwareHubParticipant[];
  typingBracket: SoftwareHubBracketSlot[];
  typingTab: string;
  setTypingTab: TabSetter;
  filteredTyping: SoftwareHubParticipant[];
  runParticipantAdminAction: RunParticipantAdminAction;
  runBracketAdminAction: RunBracketAdminAction;
  loadTypingData: () => Promise<void>;
}

export interface PromoteSectionProps extends SectionBaseProps {
  promoteParticipants: SoftwareHubParticipant[];
  promoteTab: string;
  setPromoteTab: TabSetter;
  filteredPromote: SoftwareHubParticipant[];
  runParticipantAdminAction: RunParticipantAdminAction;
  loadPromoteData: () => Promise<void>;
}

export interface CvOptSectionProps extends SectionBaseProps {
  cvoptParticipants: SoftwareHubParticipant[];
  cvoptTab: string;
  setCvoptTab: TabSetter;
  filteredCvopt: SoftwareHubParticipant[];
  runParticipantAdminAction: RunParticipantAdminAction;
  loadCvoptData: () => Promise<void>;
}

export interface DiscussionSectionProps extends SectionBaseProps {
  discussionRows: SoftwareHubDiscussionRow[];
  discussionTab: string;
  setDiscussionTab: TabSetter;
  discussionLoading: boolean;
  filteredDiscussion: SoftwareHubDiscussionRow[];
  runDiscussionAction: (action: string, id: string) => Promise<void>;
}

export interface NewsSectionProps extends SectionBaseProps {
  newsRows: SoftwareHubNewsRow[];
  newsStats: SoftwareHubNewsStats;
  newsTab: string;
  setNewsTab: TabSetter;
  newsSearch: string;
  setNewsSearch: (value: string) => void;
  newsLoading: boolean;
  loadNewsAdminData: (tab?: string, search?: string, showLoading?: boolean) => Promise<void>;
  runNewsAdminAction: (payload: Record<string, unknown>) => Promise<SoftwareHubApiErrorPayload>;
}

export interface MeetingSectionProps extends SectionBaseProps {
  meetingTotal: number;
  meetingLoading: boolean;
  meetingDateStats: SoftwareHubMeetingDateStat[];
  meetingParticipants: SoftwareHubMeetingParticipant[];
  resetMeetingData: () => Promise<void>;
}
