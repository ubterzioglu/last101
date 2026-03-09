import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MapPin, Briefcase, DollarSign } from 'lucide-react';
import type { Job } from '@/types';
import { cn } from '@/lib/utils/cn';

interface JobCardProps extends Job {
  className?: string;
}

const jobTypeColors: Record<string, string> = {
  'Tam Zamanlı': 'green',
  'Yarı Zamanlı': 'yellow',
  'Freelance': 'blue',
  'Staj': 'red',
} as const;

export function JobCard({ title, company, location, salary, type, postedDate, className }: JobCardProps) {
  const typeColor = jobTypeColors[type] || 'gray';

  return (
    <Card variant="hoverable" className={cn('', className)}>
      <div className="mb-4">
        <Badge color={typeColor as any} size="sm" className="mb-2">
          {type}
        </Badge>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-gray-600">{company}</p>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <MapPin size={16} className="mr-2 flex-shrink-0" />
          <span>{location}</span>
        </div>
        {salary && (
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign size={16} className="mr-2 flex-shrink-0" />
            <span>{salary}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">{postedDate}</span>
        <Link
          href="#"
          className="text-google-blue hover:text-blue-700 font-medium transition-colors"
        >
          Başvur →
        </Link>
      </div>
    </Card>
  );
}

interface JobListProps {
  jobs: Job[];
  columns?: 2 | 3;
}

export function JobList({ jobs, columns = 2 }: JobListProps) {
  const gridCols = columns === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  return (
    <div className={`grid ${gridCols} gap-6`}>
      {jobs.map((job) => (
        <JobCard key={job.id} {...job} />
      ))}
    </div>
  );
}
