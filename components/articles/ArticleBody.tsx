import MarkdownPreview from '@/components/MarkdownPreview';
import { ArticleToc } from '@/components/articles/ArticleToc';

/**
 * Makale gövdesi: İçindekiler + açık temalı markdown. Sayfa başlığı zaten tek H1
 * olduğundan gövdedeki `#` başlıklar H2'ye düşürülür (demoteH1).
 */
export function ArticleBody({ content }: { content: string }) {
  return (
    <>
      <ArticleToc content={content} className="mb-8" />
      <MarkdownPreview content={content} tone="light" demoteH1 />
    </>
  );
}
