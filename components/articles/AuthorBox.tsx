import Image from 'next/image';
import Link from 'next/link';

interface AuthorBoxProps {
  name: string;
  href: string;
  avatarImageUrl: string;
  bio?: string;
}

export function AuthorBox({ name, href, avatarImageUrl, bio }: AuthorBoxProps) {
  return (
    <section aria-label="Yazar hakkında" className="flex gap-4 rounded-card border border-line bg-white p-5">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-line bg-band">
        <Image src={avatarImageUrl} alt="" fill sizes="56px" className="object-cover" />
      </div>
      <div className="min-w-0">
        <p className="text-[13px] font-bold uppercase tracking-[0.13em] text-muted">Yazar</p>
        <Link
          href={href}
          className="mt-1 block break-words text-[17px] font-extrabold leading-snug tracking-[-0.02em] text-ink transition-colors hover:text-brand-700 motion-reduce:transition-none"
        >
          {name}
        </Link>
        {bio ? <p className="mt-2 text-sm leading-relaxed text-muted">{bio}</p> : null}
      </div>
    </section>
  );
}
