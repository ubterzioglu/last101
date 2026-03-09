import { Card } from '@/components/ui/Card';
import type { InfoBlock as InfoBlockType } from '@/types';

interface InfoBlockProps extends InfoBlockType {
  className?: string;
}

export function InfoBlock({ title, items, icon, className }: InfoBlockProps) {
  return (
    <Card className={className}>
      {icon && <div className="text-4xl mb-4">{icon}</div>}
      <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start text-gray-600">
            <span className="text-google-blue mr-2 flex-shrink-0">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

interface InfoGridProps {
  blocks: InfoBlockType[];
  columns?: 1 | 2 | 3;
}

export function InfoGrid({ blocks, columns = 2 }: InfoGridProps) {
  const gridCols =
    columns === 1
      ? 'grid-cols-1'
      : columns === 2
      ? 'grid-cols-1 md:grid-cols-2'
      : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  return (
    <div className={`grid ${gridCols} gap-6`}>
      {blocks.map((block) => (
        <InfoBlock key={block.id} {...block} />
      ))}
    </div>
  );
}
