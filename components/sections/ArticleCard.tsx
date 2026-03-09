import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { Article } from '@/types';
import { cn } from '@/lib/utils/cn';

interface ArticleCardProps extends Article {
  showImage?: boolean;
  showCategory?: boolean;
  className?: string;
}

export function ArticleCard({
  title,
  excerpt,
  category,
  image,
  date,
  readTime,
  showImage = true,
  showCategory = true,
  className,
}: ArticleCardProps) {
  return (
    <Card variant="hoverable" className={cn('flex flex-col h-full', className)}>
      {showImage && image && (
        <div className="relative w-full h-48 mb-4 -mx-6 -mt-6 rounded-t-lg overflow-hidden bg-gray-100">
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      )}

      <div className="flex-grow">
        {showCategory && category && (
          <Badge color="blue" size="sm" className="mb-2">
            {category}
          </Badge>
        )}
        <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">{title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{excerpt}</p>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500 mt-auto pt-4 border-t border-gray-200">
        <span>{date}</span>
        <span>{readTime} okuma</span>
      </div>
    </Card>
  );
}

interface ArticleGridProps {
  articles: Article[];
  columns?: 2 | 3;
}

export function ArticleGrid({ articles, columns = 3 }: ArticleGridProps) {
  const gridCols = columns === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  return (
    <div className={`grid ${gridCols} gap-6`}>
      {articles.map((article) => (
        <ArticleCard key={article.id} {...article} />
      ))}
    </div>
  );
}
