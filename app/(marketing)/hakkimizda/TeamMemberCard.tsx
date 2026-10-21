import Image from 'next/image';
import { ArrowLink } from '@/components/site/ArrowLink';
import { Chip } from '@/components/site/Chip';
import { TONE_STYLES } from '@/components/site/tones';
import { cn } from '@/lib/utils/cn';
import type { TeamMember } from './team';

/** Founder profile: photo, name, role chip, link or badge, bio and a tinted quote box. */
export function TeamMemberCard({ member }: { member: TeamMember }) {
  const tone = TONE_STYLES[member.tone];

  return (
    <article className="flex h-full flex-col rounded-card border border-line bg-white p-6 md:p-8">
      <div className="flex items-center gap-5">
        <Image
          src={member.photo}
          alt={member.name}
          width={96}
          height={96}
          className="h-20 w-20 shrink-0 rounded-full object-cover md:h-24 md:w-24"
        />
        <div className="min-w-0">
          <h3 className="text-[22px] font-extrabold leading-tight tracking-[-0.02em] text-ink md:text-2xl">
            {member.name}
          </h3>
          {/* Brand chip: tone text on its own 10% tint can drop below AA at 12px. */}
          <Chip tone="brand" className="mt-2">
            {member.role}
          </Chip>
        </div>
      </div>

      {member.link || member.badge ? (
        <div className="mt-5 flex flex-wrap items-center gap-3">
          {member.link ? <ArrowLink href={member.link.href}>{member.link.label}</ArrowLink> : null}
          {member.badge ? <Chip>{member.badge}</Chip> : null}
        </div>
      ) : null}

      <div className="mt-6 space-y-4 text-base leading-relaxed text-muted">
        {member.bio.map((paragraph) => (
          <p key={paragraph.slice(0, 32)}>{paragraph}</p>
        ))}
      </div>

      {/* mt-auto keeps both quote boxes on the same baseline; pt-8 keeps the gap. */}
      <div className="mt-auto pt-8">
        <blockquote className={cn('rounded-card border p-5', tone.border, tone.wash)}>
          <p className="text-base font-medium leading-relaxed text-ink">{member.quote}</p>
        </blockquote>
      </div>
    </article>
  );
}
