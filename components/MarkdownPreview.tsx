'use client';

import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { cn } from '@/lib/utils/cn';

export type MarkdownTone = 'dark' | 'light';

interface MarkdownPreviewProps {
  content: string;
  className?: string;
  /** `dark` (default) keeps the admin/editor look on black; public article pages pass `light`. */
  tone?: MarkdownTone;
}

// Admin editors and the author panel render previews on black: keep this set unchanged.
const DARK_COMPONENTS: Components = {
  h1: ({ children }) => <h1 className="text-3xl font-bold mb-4">{children}</h1>,
  h2: ({ children }) => <h2 className="text-2xl font-bold mb-3">{children}</h2>,
  h3: ({ children }) => <h3 className="text-xl font-bold mb-2">{children}</h3>,
  p: ({ children }) => <p className="mb-4 leading-7">{children}</p>,
  a: ({ href, children }) => (
    <a href={href} className="text-[#7fd5ff] hover:underline" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  ul: ({ children }) => <ul className="list-disc list-inside mb-4">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal list-inside mb-4">{children}</ol>,
  li: ({ children }) => <li className="mb-1">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-white/20 pl-4 italic text-white/80 my-4">
      {children}
    </blockquote>
  ),
  code: ({ children }) => (
    <code className="bg-white/10 px-2 py-1 rounded text-sm">{children}</code>
  ),
  pre: ({ children }) => (
    <pre className="bg-white/10 p-4 rounded-lg overflow-x-auto my-4">
      {children}
    </pre>
  ),
};

const LIGHT_HEADING = 'font-extrabold text-ink';

// Public article body: prose spacing, ink text, brand links, hairlines. Paragraphs
// and lists keep the prose rhythm; images are rounded through the root modifier.
const LIGHT_COMPONENTS: Components = {
  h1: ({ children }) => <h1 className={cn(LIGHT_HEADING, 'text-3xl tracking-[-0.03em]')}>{children}</h1>,
  h2: ({ children }) => <h2 className={cn(LIGHT_HEADING, 'text-2xl tracking-[-0.025em]')}>{children}</h2>,
  h3: ({ children }) => <h3 className={cn(LIGHT_HEADING, 'text-xl tracking-[-0.02em]')}>{children}</h3>,
  h4: ({ children }) => <h4 className={cn(LIGHT_HEADING, 'text-lg tracking-[-0.01em]')}>{children}</h4>,
  a: ({ href, children }) => (
    <a
      href={href}
      className="font-semibold text-brand-700 underline decoration-brand-700/40 underline-offset-4 transition-colors hover:text-brand-800 hover:decoration-brand-800"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-brand-500 pl-5 font-normal not-italic text-ink">
      {children}
    </blockquote>
  ),
  code: ({ children }) => (
    <code className="rounded-tile bg-band px-1.5 py-0.5 text-[0.875em] font-medium text-ink before:content-none after:content-none">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="overflow-x-auto rounded-card border border-line bg-band p-4 text-ink [&_code]:bg-transparent [&_code]:p-0">
      {children}
    </pre>
  ),
  hr: () => <hr className="border-line" />,
  table: ({ children }) => (
    <div className="my-8 overflow-x-auto">
      <table className="my-0 w-full">{children}</table>
    </div>
  ),
};

const TONE_STYLES: Record<MarkdownTone, { root: string; components: Components }> = {
  dark: { root: 'prose prose-invert max-w-none', components: DARK_COMPONENTS },
  light: {
    root: 'prose max-w-none text-ink marker:text-muted prose-strong:text-ink prose-thead:border-line prose-tr:border-line prose-th:text-ink prose-img:rounded-card',
    components: LIGHT_COMPONENTS,
  },
};

export default function MarkdownPreview({ content, className = '', tone = 'dark' }: MarkdownPreviewProps) {
  if (!content) return null;

  const styles = TONE_STYLES[tone];

  return (
    <div className={cn(styles.root, className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={styles.components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
