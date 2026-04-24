create table if not exists public.corner_author_profile (
  id uuid primary key default gen_random_uuid(),
  display_name text not null default 'Arkadaşın Köşesi',
  short_bio text,
  bio_content text,
  avatar_image_url text,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.corner_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text,
  content text,
  cover_image_url text,
  reading_minutes integer not null default 3 check (reading_minutes between 1 and 60),
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists corner_posts_status_published_at_idx
  on public.corner_posts (status, published_at desc, created_at desc);

alter table public.corner_author_profile enable row level security;
alter table public.corner_posts enable row level security;

drop policy if exists "Public can read corner profile" on public.corner_author_profile;
create policy "Public can read corner profile"
  on public.corner_author_profile
  for select
  using (true);

drop policy if exists "Public can read published corner posts" on public.corner_posts;
create policy "Public can read published corner posts"
  on public.corner_posts
  for select
  using (status = 'published');

insert into public.corner_author_profile (display_name, short_bio, bio_content)
select
  'Arkadaşın Köşesi',
  'Almanya yolculuğunu, gündelik hayatı ve kişisel notları samimi bir dille paylaşan özel köşe.',
  '## Ben kimim?\n\nBu alan köşe admin panelinden düzenlenecek.'
where not exists (select 1 from public.corner_author_profile);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'corner',
  'corner',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read corner storage" on storage.objects;
create policy "Public can read corner storage"
  on storage.objects
  for select
  using (bucket_id = 'corner');

comment on table public.corner_posts is 'Single-author corner/blog posts for Arkadaşın Köşesi';
comment on table public.corner_author_profile is 'Singleton public profile for Arkadaşın Köşesi';
