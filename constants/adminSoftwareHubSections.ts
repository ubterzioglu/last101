/**
 * Single source of truth for the Software Hub admin sub-sections.
 *
 * Used by:
 *  - `SoftwareHubAdminClient` to validate the `?section=` deep-link param and
 *    render the intermediate menu cards.
 *  - `AdminSidebar` to expose each section as a left-nav shortcut that links to
 *    `/admin/software-hub?section=<key>` (the intermediate menu stays reachable
 *    via `/admin/software-hub` with no `?section=`).
 */
export interface SoftwareHubSection {
  /** Stable key persisted in the `?section=` query param. */
  key: string;
  /** Short label shown in the sidebar sub-menu. */
  label: string;
}

export const SOFTWARE_HUB_SECTIONS: readonly SoftwareHubSection[] = [
  { key: 'devuser', label: 'Yeni Üye Onayla' },
  { key: 'tournament', label: 'Tavla Katılımcısı' },
  { key: 'hackathon', label: 'Vibecoding' },
  { key: 'promote', label: 'Promote' },
  { key: 'cvopt', label: 'CV Opt' },
  { key: 'typing', label: 'Typing' },
  { key: 'discussion', label: 'Discussion' },
  { key: 'news', label: 'News Yönetimi' },
  { key: 'founders', label: 'Founder Başvuruları' },
  { key: 'founderSurvey', label: 'Founder Event Survey' },
  { key: 'meeting', label: 'Toplantı Anketi' },
] as const;

/** Fast membership check for validating an incoming `?section=` value. */
export const SOFTWARE_HUB_SECTION_KEYS: ReadonlySet<string> = new Set(
  SOFTWARE_HUB_SECTIONS.map((section) => section.key),
);
