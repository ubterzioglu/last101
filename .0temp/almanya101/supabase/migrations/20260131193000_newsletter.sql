-- Newsletter subscribers
create table if not exists newsletter_subscribers (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  email text not null,
  ip_hash text,
  user_agent text
);

create unique index if not exists newsletter_subscribers_email_idx on newsletter_subscribers (lower(email));
