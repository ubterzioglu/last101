import type { ReactNode } from 'react';
import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/utils/cn';

interface ToolPanelProps {
  children: ReactNode;
  id?: string;
  className?: string;
}

/** Corteqs filter-panel surface that holds the interactive part of a tool. */
export function ToolPanel({ children, id, className }: ToolPanelProps) {
  return (
    <Container id={id} className="py-10 md:py-12">
      <div className={cn('space-y-4 rounded-card bg-band p-4 md:p-6', className)}>{children}</div>
    </Container>
  );
}
