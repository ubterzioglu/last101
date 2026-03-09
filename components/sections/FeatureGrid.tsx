import { Card } from '@/components/ui/Card';
import type { Feature } from '@/types';

interface FeatureGridProps {
  features: Feature[];
  columns?: 2 | 3 | 4;
}

const gridColumns = {
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
};

export function FeatureGrid({ features, columns = 3 }: FeatureGridProps) {
  return (
    <div className={`grid ${gridColumns[columns]} gap-6`}>
      {features.map((feature) => (
        <Card key={feature.id} variant="hoverable" className="text-center h-full">
          <div className="text-4xl mb-4">{feature.icon}</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
          <p className="text-gray-600">{feature.description}</p>
        </Card>
      ))}
    </div>
  );
}
