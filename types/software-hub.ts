/**
 * Data shapes used by the admin Software Hub client
 * (components/admin/SoftwareHubAdminClient.tsx).
 *
 * These describe the JSON returned by the admin list APIs. They are unchecked
 * assertions on `response.json()` and only list the fields the component reads.
 */

/** Row of the `devuser` table (`/api/devuser-admin-list`, `select('*')`). */
export interface SoftwareHubDevUser {
  id: string;
  ad_soyad?: string | null;
  rol?: string | null;
  created_at?: string | null;
  approval_status?: string | null;
  onay_durumu?: string | null;
  admin_onayli?: boolean | null;
  linkedin_url?: string | null;
  linkedin?: string | null;
  whatsapp_tel?: string | null;
  whatsapp?: string | null;
  telefon?: string | null;
  phone?: string | null;
}

/**
 * Participant row shared by the tavla / typing / vct / promote / cvopt tables
 * (`/api/participant-admin-list`). Fields that only exist on some categories
 * are optional.
 */
export interface SoftwareHubParticipant {
  id: string;
  name?: string | null;
  whatsapp?: string | null;
  created_at?: string | null;
  approved?: boolean | null;
  product_name?: string | null;
  product_desc?: string | null;
  linkedin?: string | null;
  linkedin_ok?: boolean | null;
  cv_ok?: boolean | null;
}

/** Bracket slot of the tavla / typing tables (or an empty placeholder slot). */
export interface SoftwareHubBracketSlot {
  id: string | null;
  participant_id: string | null;
  winner?: boolean | null;
}

/** Payload of a single participant category (`bracket` only for tavla / typing). */
export interface SoftwareHubParticipantCategoryData {
  participants?: SoftwareHubParticipant[];
  bracket?: SoftwareHubBracketSlot[];
}

export type SoftwareHubParticipantCategory = 'tavla' | 'typing' | 'vct' | 'promote' | 'cvopt';

/** Response of `/api/participant-admin-list?category=all`. */
export interface SoftwareHubParticipantListAllPayload {
  data?: Partial<Record<SoftwareHubParticipantCategory, SoftwareHubParticipantCategoryData>>;
  error?: string;
}

/** Response of `/api/participant-admin-list?category=<one category>`. */
export interface SoftwareHubParticipantListPayload {
  data?: SoftwareHubParticipantCategoryData;
  error?: string;
}

/** Item of `/api/devuser-dis-admin-list`. */
export interface SoftwareHubDiscussionRow {
  id: string;
  topic?: string | null;
  anonymous?: boolean | null;
  full_name?: string | null;
  created_at?: string | null;
  status?: string;
}

export interface SoftwareHubDiscussionListPayload {
  items?: SoftwareHubDiscussionRow[];
  error?: string;
}

/** Item of `/api/news-admin-list` (legacy-mapped admin post). */
export interface SoftwareHubNewsRow {
  id: string;
  title?: string | null;
  summary?: string | null;
  status?: string;
  category?: string;
  published_at?: string | null;
  created_at?: string | null;
}

export interface SoftwareHubNewsStats {
  total: number;
  draft: number;
  published: number;
}

export interface SoftwareHubNewsListPayload {
  items?: SoftwareHubNewsRow[];
  stats?: SoftwareHubNewsStats;
  error?: string;
}

/** Item of `/api/meeting-attendance-admin-list`. */
export interface SoftwareHubMeetingParticipant {
  id?: string;
  full_name: string;
  whatsapp: string;
  available_dates?: string[];
  created_at: string;
}

export interface SoftwareHubMeetingDateStat {
  date_option: string;
  vote_count: number;
}

export interface SoftwareHubMeetingListPayload {
  items?: SoftwareHubMeetingParticipant[];
  date_stats?: SoftwareHubMeetingDateStat[];
  stats?: { total?: number };
  error?: string;
}

/** Generic `{ error }` body returned by the admin list/action APIs on failure. */
export interface SoftwareHubApiErrorPayload {
  error?: string;
}
