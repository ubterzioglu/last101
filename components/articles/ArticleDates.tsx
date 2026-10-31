import { formatArticleDate, hasMeaningfulUpdate } from '@/lib/articles/headings';

interface ArticleDatesProps {
  publishedAt: string;
  updatedAt?: string | null;
}

/** "Yayın" ve (anlamlı bir güncelleme varsa) "Güncelleme" tarihlerini <time> ile gösterir. */
export function ArticleDates({ publishedAt, updatedAt }: ArticleDatesProps) {
  const publishedLabel = formatArticleDate(publishedAt);
  const showUpdate = Boolean(updatedAt) && hasMeaningfulUpdate(publishedAt, updatedAt);

  return (
    <>
      {publishedLabel ? (
        <span>
          <span className="font-semibold">Yayın:</span> <time dateTime={publishedAt}>{publishedLabel}</time>
        </span>
      ) : null}
      {showUpdate && updatedAt ? (
        <span>
          <span className="font-semibold">Güncelleme:</span>{' '}
          <time dateTime={updatedAt}>{formatArticleDate(updatedAt)}</time>
        </span>
      ) : null}
    </>
  );
}
