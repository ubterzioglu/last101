'use client';

import { isValidElement } from 'react';
import type { ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { createHeadingIdGenerator } from '@/lib/articles/headings';
import { cn } from '@/lib/utils/cn';

export type MarkdownTone = 'dark' | 'light';

interface MarkdownPreviewProps {
  content: string;
  className?: string;
  /** `dark` (default) keeps the admin/editor look on black; public article pages pass `light`. */
  tone?: MarkdownTone;
  /**
   * Herkese açık makale sayfalarında sayfa başlığı zaten tek H1'dir; gövdedeki
   * `#` başlıklar H2'ye düşürülerek çift H1 engellenir (bkz.
   * docs/plans/seo-geo-heading-schema-plan.md P0). Yönetici önizlemelerinde
   * davranış değişmez (varsayılan: false).
   */
  demoteH1?: boolean;
}

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4';

function childrenToText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(childrenToText).join('');
  if (isValidElement<{ children?: ReactNode }>(node)) return childrenToText(node.props.children);
  return '';
}

// Admin editors and the author panel render previews on black: keep this set unchanged.
const DARK_HEADING_CLASSES: Record<HeadingLevel, string> = {
  h1: 'text-3xl font-bold mb-4',
  h2: 'text-2xl font-bold mb-3',
  h3: 'text-xl font-bold mb-2',
  h4: '',
};

const DARK_COMPONENTS: Components = {
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

const LIGHT_HEADING_CLASSES: Record<HeadingLevel, string> = {
  h1: cn(LIGHT_HEADING, 'text-3xl tracking-[-0.03em]'),
  h2: cn(LIGHT_HEADING, 'text-2xl tracking-[-0.025em]'),
  h3: cn(LIGHT_HEADING, 'text-xl tracking-[-0.02em]'),
  h4: cn(LIGHT_HEADING, 'text-lg tracking-[-0.01em]'),
};

// Public article body: prose spacing, ink text, brand links, hairlines. Paragraphs
// and lists keep the prose rhythm; images are rounded through the root modifier.
const LIGHT_COMPONENTS: Components = {
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

const TONE_STYLES: Record<
  MarkdownTone,
  { root: string; components: Components; headings: Record<HeadingLevel, string> }
> = {
  dark: {
    root: 'prose prose-invert max-w-none',
    components: DARK_COMPONENTS,
    headings: DARK_HEADING_CLASSES,
  },
  light: {
    root: 'prose max-w-none text-ink marker:text-muted prose-strong:text-ink prose-thead:border-line prose-tr:border-line prose-th:text-ink prose-img:rounded-card',
    components: LIGHT_COMPONENTS,
    headings: LIGHT_HEADING_CLASSES,
  },
};

export default function MarkdownPreview({
  content,
  className = '',
  tone = 'dark',
  demoteH1 = false,
}: MarkdownPreviewProps) {
  if (!content) return null;

  const styles = TONE_STYLES[tone];
  // Başlık id'leri extractHeadings ile aynı kuralla üretilir; içindekiler bağlantıları bu id'lere gider.
  const nextHeadingId = createHeadingIdGenerator();

  const heading = (level: HeadingLevel): Components['h1'] =>
    function Heading({ children }) {
      // Yönetici önizlemelerinde işaretleme olduğu gibi kalır; id'ler yalnızca makale modunda üretilir.
      if (!demoteH1) {
        const Plain = level;
        return <Plain className={styles.headings[level] || undefined}>{children}</Plain>;
      }

      const Tag = level === 'h1' ? 'h2' : level;
      return (
        <Tag
          className={cn('scroll-mt-24', styles.headings[level])}
          id={nextHeadingId(childrenToText(children))}
        >
          {children}
        </Tag>
      );
    };

  const components: Components = {
    ...styles.components,
    h1: heading('h1'),
    h2: heading('h2'),
    h3: heading('h3'),
    h4: heading('h4'),
  };

  return (
    <div className={cn(styles.root, className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
