import type {
  SoftwareHubDiscussionListPayload,
  SoftwareHubParticipantListAllPayload,
} from '@/types/software-hub';
import {
  PARTICIPANT_LIST_API_URL,
  DISCUSSION_LIST_API_URL,
  NEWS_ADMIN_LIST_API_URL,
  MEETING_ADMIN_LIST_API_URL,
  FOUNDER_SUBMISSIONS_ADMIN_LIST_API_URL,
  FOUNDER_EVENT_ADMIN_LIST_API_URL,
  getAdminHeaders,
} from './api';

// Fetches every pending/total counter shown on the main menu cards.
// Throws on network/parse failure; the caller swallows it (badges are best effort).
export async function fetchBadges(): Promise<Record<string, number | string>> {
  const newBadges: Record<string, number | string> = {};

  const participantRes = await fetch(`${PARTICIPANT_LIST_API_URL}?category=all`, {
    headers: getAdminHeaders({ Accept: 'application/json' }),
  });
  const participantPayload: SoftwareHubParticipantListAllPayload = await participantRes.json().catch(() => ({}));
  const pdata = participantPayload.data || {};

  newBadges.tavla = (pdata.tavla?.participants || []).filter((p) => !p.approved).length;
  newBadges.vct = (pdata.vct?.participants || []).filter((p) => !p.approved).length;
  newBadges.promote = (pdata.promote?.participants || []).filter((p) => !p.approved).length;
  newBadges.cvopt = (pdata.cvopt?.participants || []).filter((p) => !p.approved).length;
  newBadges.typing = (pdata.typing?.participants || []).filter((p) => !p.approved).length;

  const discRes = await fetch(`${DISCUSSION_LIST_API_URL}?status=pending&limit=1000`, {
    headers: getAdminHeaders({ Accept: 'application/json' }),
  });
  const discPayload: SoftwareHubDiscussionListPayload = await discRes.json().catch(() => ({}));
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

  const founderRes = await fetch(`${FOUNDER_SUBMISSIONS_ADMIN_LIST_API_URL}?status=pending&limit=1`, {
    headers: getAdminHeaders({ Accept: 'application/json' }),
  });
  const founderPayload = await founderRes.json().catch(() => ({}));
  newBadges.founders = founderRes.ok ? Number(founderPayload?.stats?.pending || 0) : 0;

  const founderEventRes = await fetch(FOUNDER_EVENT_ADMIN_LIST_API_URL, {
    headers: getAdminHeaders({ Accept: 'application/json' }),
  });
  const founderEventPayload = await founderEventRes.json().catch(() => ({}));
  newBadges.founderSurvey = founderEventRes.ok ? Number(founderEventPayload?.stats?.total_votes || 0) : 0;

  return newBadges;
}
