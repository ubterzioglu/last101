export type ArticleTone = 'dark' | 'light';

interface ToneClasses {
  panel: string;
  title: string;
  muted: string;
  link: string;
  chip: string;
}

export const ARTICLE_TONE_CLASSES: Record<ArticleTone, ToneClasses> = {
  dark: {
    panel: 'border-white/10 bg-white/[0.03]',
    title: 'text-white',
    muted: 'text-white/60',
    link: 'text-white/80 hover:text-white',
    chip: 'border-white/15 bg-white/[0.05] text-white hover:bg-white/[0.1]',
  },
  light: {
    panel: 'border-gray-200 bg-gray-50',
    title: 'text-gray-900',
    muted: 'text-gray-500',
    link: 'text-gray-700 hover:text-google-blue',
    chip: 'border-gray-200 bg-white text-gray-800 hover:border-google-blue hover:text-google-blue',
  },
};
