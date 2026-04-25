create table if not exists public.corner_authors (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  slug text not null unique,
  short_bio text,
  bio_content text,
  avatar_image_url text,
  display_order integer not null default 1000,
  password_hash text not null default '',
  password_salt text not null default '',
  hash_iterations integer not null default 210000,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

alter table public.corner_posts
add column if not exists author_id uuid references public.corner_authors(id) on delete cascade;

alter table public.corner_posts
add column if not exists is_primary boolean not null default true;

alter table public.corner_authors
add column if not exists display_order integer not null default 1000;

create index if not exists corner_authors_slug_idx on public.corner_authors (slug);
create index if not exists corner_authors_display_order_idx
  on public.corner_authors (display_order asc, created_at asc);
create index if not exists corner_posts_author_status_idx
  on public.corner_posts (author_id, status, published_at asc, created_at asc);

alter table public.corner_authors enable row level security;

drop policy if exists "Public can read active corner authors" on public.corner_authors;
create policy "Public can read active corner authors"
  on public.corner_authors
  for select
  using (is_active = true);

drop policy if exists "Public can read published corner posts" on public.corner_posts;
create policy "Public can read published corner posts"
  on public.corner_posts
  for select
  using (status = 'published');

do $$
declare
  default_author_id uuid;
begin
  if not exists (select 1 from public.corner_authors where slug = 'arkadasin-kosesi') then
    insert into public.corner_authors (
      display_name,
      slug,
      short_bio,
      bio_content,
      avatar_image_url,
      display_order,
      password_hash,
      password_salt
    )
    select
      coalesce(display_name, 'Arkadaşın Köşesi'),
      'arkadasin-kosesi',
      short_bio,
      bio_content,
      avatar_image_url,
      1,
      '',
      ''
    from public.corner_author_profile
    order by created_at asc
    limit 1;
  end if;

  select id into default_author_id from public.corner_authors where slug = 'arkadasin-kosesi' limit 1;

  if default_author_id is not null then
    update public.corner_posts
    set author_id = default_author_id
    where author_id is null;
  end if;
end $$;

comment on table public.corner_authors is 'Authors managed from the Arkadaşın Köşesi admin panel';
comment on column public.corner_posts.author_id is 'Owner author for multi-author corner pages';
