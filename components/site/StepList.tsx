import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export interface StepItem {
  title: ReactNode;
  description?: ReactNode;
}

export type StepListLayout = 'vertical' | 'inline' | 'columns';

export interface StepListProps {
  steps: StepItem[];
  /** `ink` on light surfaces, `light` on the dark band. */
  tone?: 'ink' | 'light';
  /**
   * `vertical`: stacked rows (default). `inline`: one wrapping row joined by arrows
   * (Corteqs home community block). `columns`: stacked on mobile, 3 columns from md
   * (Corteqs listing dark band).
   */
  layout?: StepListLayout;
  className?: string;
}

interface ToneColors {
  strong: string;
  soft: string;
}

interface StepProps {
  step: StepItem;
  number: number;
  isLast: boolean;
  colors: ToneColors;
}

const TONES: Record<NonNullable<StepListProps['tone']>, ToneColors> = {
  ink: { strong: 'text-ink', soft: 'text-muted' },
  light: { strong: 'text-white', soft: 'text-white/75' },
};

const LIST_LAYOUTS: Record<StepListLayout, string> = {
  vertical: 'space-y-5',
  inline: 'flex flex-wrap items-center gap-x-3 gap-y-3',
  columns: 'grid gap-8 md:grid-cols-3 md:gap-10',
};

function StepBadge({ number, className }: { number: number; className: string }) {
  return (
    <span
      className={cn(
        'flex size-7 shrink-0 items-center justify-center rounded-full border border-current text-sm font-bold',
        className
      )}
    >
      {number}
    </span>
  );
}

function VerticalStep({ step, number, colors }: StepProps) {
  return (
    <li className="flex gap-4">
      <StepBadge number={number} className={colors.strong} />
      <div className="min-w-0 pt-[3px]">
        <p className={cn('font-bold leading-snug', colors.strong)}>{step.title}</p>
        {step.description ? (
          <p className={cn('mt-1 text-sm leading-relaxed', colors.soft)}>{step.description}</p>
        ) : null}
      </div>
    </li>
  );
}

function InlineStep({ step, number, isLast, colors }: StepProps) {
  return (
    <li className="flex items-center gap-2 text-sm">
      <StepBadge number={number} className={colors.strong} />
      <span className={cn('font-medium', colors.strong)}>{step.title}</span>
      {step.description ? <span className={colors.soft}>{step.description}</span> : null}
      {isLast ? null : (
        <ArrowRight aria-hidden="true" size={14} className={cn('ml-1 shrink-0', colors.soft)} />
      )}
    </li>
  );
}

function ColumnStep({ step, number, colors }: StepProps) {
  return (
    <li className="min-w-0">
      <StepBadge number={number} className={colors.strong} />
      <p className={cn('mt-4 text-[19px] font-extrabold leading-snug tracking-[-0.02em]', colors.strong)}>
        {step.title}
      </p>
      {step.description ? (
        <p className={cn('mt-2 text-[15px] leading-relaxed', colors.soft)}>{step.description}</p>
      ) : null}
    </li>
  );
}

const STEP_COMPONENTS: Record<StepListLayout, (props: StepProps) => ReactNode> = {
  vertical: VerticalStep,
  inline: InlineStep,
  columns: ColumnStep,
};

/** Numbered steps with 28px circle badges, rendered as an ordered list. */
export function StepList({ steps, tone = 'ink', layout = 'vertical', className }: StepListProps) {
  const Step = STEP_COMPONENTS[layout];

  return (
    <ol className={cn(LIST_LAYOUTS[layout], className)}>
      {steps.map((step, index) => (
        <Step
          key={`step-${index}`}
          step={step}
          number={index + 1}
          isLast={index === steps.length - 1}
          colors={TONES[tone]}
        />
      ))}
    </ol>
  );
}
