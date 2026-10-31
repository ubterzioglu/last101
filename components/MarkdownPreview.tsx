'use client';

import { isValidElement } from 'react';
import type { ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { createHeadingIdGenerator } from '@/lib/articles/headings';
import { cn } from '@/lib/utils/cn';

interface MarkdownPreviewProps {
  content: string;
  className?: string;
  /**
   * Herkese açık makale sayfalarında sayfa başlığı zaten tek H1'dir; gövdedeki
   * `#` başlıklar H2'ye düşürülerek çift H1 engellenir (bkz.
   * docs/plans/seo-geo-heading-schema-plan.md P0). Yönetici önizlemelerinde
   * davranış değişmez (varsayılan: false).
   */
  demoteH1?: boolean;
}

function childrenToText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(childrenToText).join('');
  if (isValidElement<{ children?: ReactNode }>(node)) return childrenToText(node.props.children);
  return '';
}

export default function MarkdownPreview({ content, className = '', demoteH1 = false }: MarkdownPreviewProps) {
  if (!content) return null;

  // Başlık id'leri extractHeadings ile aynı kuralla üretilir; içindekiler bağlantıları bu id'lere gider.
  const nextHeadingId = createHeadingIdGenerator();

  return (
    <div className={cn('prose prose-invert max-w-none', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={{
          h1: ({ children }) =>
            demoteH1 ? (
              <h2 id={nextHeadingId(childrenToText(children))} className="scroll-mt-24 text-3xl font-bold mb-4">
                {children}
              </h2>
            ) : (
              <h1 id={nextHeadingId(childrenToText(children))} className="scroll-mt-24 text-3xl font-bold mb-4">
                {children}
              </h1>
            ),
          h2: ({ children }) => (
            <h2 id={nextHeadingId(childrenToText(children))} className="scroll-mt-24 text-2xl font-bold mb-3">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 id={nextHeadingId(childrenToText(children))} className="scroll-mt-24 text-xl font-bold mb-2">
              {children}
            </h3>
          ),
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
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
