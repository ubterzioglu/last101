/**
 * Google Color Palette
 * almanya101 uses Google's official color palette
 */

export const COLORS = {
  google: {
    blue: '#4285F4',
    red: '#EA4335',
    yellow: '#FBBC05',
    green: '#34A853',
  },
  neutral: {
    black: '#000000',
    white: '#FFFFFF',
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
  },
} as const;

export type Color = keyof typeof COLORS.google | keyof typeof COLORS.neutral.gray;
export type GoogleColor = keyof typeof COLORS.google;
