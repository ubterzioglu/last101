/**
 * Public site design tokens.
 * Colours follow firmascope.com; text tones are darkened where the original
 * hue fails WCAG AA (see tests/design-tokens.test.ts). Tailwind reads these
 * values, so this file is the single source for the public palette.
 * The legacy `google.*` palette stays separate because admin/devuser use it.
 */

export const SITE_COLORS = {
  page: '#F6F7F9',
  ink: {
    DEFAULT: '#252B37',
    soft: '#353E50',
  },
  muted: '#606E80',
  line: '#E3E7ED',
  band: '#EDF0F3',
  brand: {
    50: '#EBFAFF',
    100: '#D6F5FF',
    500: '#00A1D6',
    600: '#0086B3',
    700: '#007AA3',
    800: '#006B8F',
  },
  // Category colours: fills, tints, icons and markers only. Use `.ink` for text.
  alm: {
    // `ink` passes AA on page, white and on the colour's own 10% tint.
    blue: { DEFAULT: '#01A3EF', ink: '#0170A3' },
    green: { DEFAULT: '#81BD00', ink: '#507600' },
    orange: { DEFAULT: '#F54114', ink: '#C42D08' },
    yellow: { DEFAULT: '#FFBB00', ink: '#8B6700' },
    teal: { DEFAULT: '#13AE8F', ink: '#0D7662' },
    red: { DEFAULT: '#EA1F48', ink: '#C71336' },
  },
} as const;

export type AlmTone = keyof typeof SITE_COLORS.alm;

export const SITE_RADIUS = {
  tile: '6px',
  btn: '10px',
  card: '12px',
} as const;

export const SITE_SHADOWS = {
  float: '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.06)',
} as const;
