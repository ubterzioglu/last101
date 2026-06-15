create extension if not exists pgcrypto;

create table if not exists public.news_sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  source_type text not null default 'rss' check (source_type in ('rss', 'mrss', 'api', 'manual')),
  feed_url text,
  homepage_url text,
  default_category text not null default 'almanya' check (default_category in ('almanya', 'turkiye', 'avrupa', 'dunya', 'duyuru')),
  language_code text,
  country_code text,
  usage_mode text not null default 'signal_only' check (usage_mode in ('signal_only', 'short_excerpt_allowed', 'licensed', 'manual_only')),
  priority integer not null default 50 check (priority between 0 and 100),
  is_active boolean not null default true,
  fetch_limit integer not null default 10 check (fetch_limit between 1 and 50),
  last_fetched_at timestamptz,
  last_success_at timestamptz,
  last_error text,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.news_ingest_runs (
  id uuid primary key default gen_random_uuid(),
  trigger_type text not null default 'manual' check (trigger_type in ('cron', 'manual', 'retry', 'source_test')),
  status text not null default 'running' check (status in ('running', 'success', 'partial', 'failed')),
  started_at timestamptz not null default timezone('utc'::text, now()),
  finished_at timestamptz,
  source_count integer not null default 0,
  fetched_count integer not null default 0,
  inserted_count integer not null default 0,
  duplicate_count integer not null default 0,
  error_count integer not null default 0,
  log_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.news_raw_items (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references public.news_sources(id) on delete set null,
  ingest_run_id uuid references public.news_ingest_runs(id) on delete set null,
  external_id text,
  canonical_url text not null,
  original_title text,
  original_description text,
  original_image_url text,
  original_published_at timestamptz,
  unique_hash text not null,
  is_duplicate boolean not null default false,
  duplicate_reason text,
  possible_duplicate boolean not null default false,
  raw_payload jsonb not null default '{}'::jsonb,
  fetched_at timestamptz not null default timezone('utc'::text, now()),
  created_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.news_editor_actions (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.news_posts(id) on delete cascade,
  actor_user_id text,
  action_type text not null check (action_type in ('create', 'update', 'approve', 'publish', 'reject', 'archive', 'feature', 'pipeline_run', 'source_run')),
  note text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.news_pipeline_settings (
  id boolean primary key default true check (id = true),
  pipeline_enabled boolean not null default true,
  ai_enabled boolean not null default false,
  ai_daily_limit integer not null default 10 check (ai_daily_limit between 0 and 500),
  max_items_per_source integer not null default 10 check (max_items_per_source between 1 and 50),
  raw_retention_days integer not null default 30 check (raw_retention_days between 1 and 365),
  ingest_run_retention_days integer not null default 90 check (ingest_run_retention_days between 1 and 365),
  rejected_posts_retention_days integer not null default 180 check (rejected_posts_retention_days between 1 and 3650),
  auto_create_pending_review boolean not null default true,
  excluded_keywords text[] not null default '{}'::text[],
  high_priority_keywords text[] not null default '{}'::text[],
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

alter table public.news_posts
  add column if not exists raw_item_id uuid,
  add column if not exists slug text,
  add column if not exists source_published_at timestamptz,
  add column if not exists cover_image_alt text,
  add column if not exists cover_image_credit text,
  add column if not exists is_featured boolean not null default false,
  add column if not exists featured_rank integer,
  add column if not exists whatsapp_share_text text,
  add column if not exists relevance_score integer,
  add column if not exists relevance_reason text,
  add column if not exists ai_model text,
  add column if not exists ai_generated_fields jsonb not null default '{}'::jsonb,
  add column if not exists editor_notes text,
  add column if not exists reviewed_at timestamptz,
  add column if not exists reviewed_by text,
  add column if not exists updated_at timestamptz not null default timezone('utc'::text, now());

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'news_posts_raw_item_id_fkey'
  ) then
    alter table public.news_posts
      add constraint news_posts_raw_item_id_fkey
      foreign key (raw_item_id)
      references public.news_raw_items(id)
      on delete set null;
  end if;
end $$;

drop index if exists news_posts_slug_key;
create unique index if not exists news_posts_slug_idx on public.news_posts (slug);
create index if not exists news_posts_status_published_at_idx
  on public.news_posts (status, published_at desc, created_at desc);
create index if not exists news_posts_category_published_at_idx
  on public.news_posts (category, published_at desc, created_at desc);
create index if not exists news_posts_featured_idx
  on public.news_posts (is_featured desc, featured_rank asc, published_at desc, created_at desc);
create unique index if not exists news_raw_items_canonical_url_idx
  on public.news_raw_items (canonical_url);
create unique index if not exists news_raw_items_unique_hash_idx
  on public.news_raw_items (unique_hash);
create index if not exists news_raw_items_source_id_idx
  on public.news_raw_items (source_id, fetched_at desc);
create index if not exists news_editor_actions_post_id_idx
  on public.news_editor_actions (post_id, created_at desc);
create index if not exists news_sources_priority_idx
  on public.news_sources (is_active desc, priority desc, created_at asc);
create index if not exists news_ingest_runs_started_at_idx
  on public.news_ingest_runs (started_at desc);

update public.news_posts
set
  category = case
    when lower(trim(category)) = 'almanya' then 'almanya'
    when lower(trim(category)) = 'türkiye' then 'turkiye'
    when lower(trim(category)) = 'turkiye' then 'turkiye'
    when lower(trim(category)) = 'avrupa' then 'avrupa'
    when lower(trim(category)) = 'dünya' then 'dunya'
    when lower(trim(category)) = 'dunya' then 'dunya'
    when lower(trim(category)) = 'duyuru' then 'duyuru'
    else 'almanya'
  end,
  status = case
    when lower(trim(status)) = 'published' then 'published'
    when lower(trim(status)) = 'draft' then 'draft'
    when published_at is not null then 'published'
    else 'draft'
  end,
  source_published_at = coalesce(source_published_at, published_at),
  slug = coalesce(
    nullif(trim(slug), ''),
    trim(both '-' from regexp_replace(
      translate(lower(coalesce(title, 'haber')), 'çğıöşüâîû', 'cgiosuaiu'),
      '[^a-z0-9]+',
      '-',
      'g'
    )) || '--' || id::text
  ),
  cover_image_alt = coalesce(nullif(trim(cover_image_alt), ''), title),
  whatsapp_share_text = coalesce(
    nullif(trim(whatsapp_share_text), ''),
    concat_ws(
      E'\n\n',
      coalesce(title, ''),
      coalesce(summary, ''),
      concat('Devamini oku: https://almanya101.de/haberler/', coalesce(
        nullif(trim(slug), ''),
        trim(both '-' from regexp_replace(
          translate(lower(coalesce(title, 'haber')), 'çğıöşüâîû', 'cgiosuaiu'),
          '[^a-z0-9]+',
          '-',
          'g'
        )) || '--' || id::text
      ))
    )
  ),
  updated_at = timezone('utc'::text, now());

alter table public.news_posts
  drop constraint if exists news_posts_status_check;
alter table public.news_posts
  add constraint news_posts_status_check
  check (status in ('pending_review', 'draft', 'published', 'rejected', 'archived'));

alter table public.news_posts
  drop constraint if exists news_posts_category_check;
alter table public.news_posts
  add constraint news_posts_category_check
  check (category in ('almanya', 'turkiye', 'avrupa', 'dunya', 'duyuru'));

insert into public.news_pipeline_settings (id)
values (true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'news',
  'news',
  true,
  52428800,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

alter table public.news_posts enable row level security;
alter table public.news_sources enable row level security;
alter table public.news_ingest_runs enable row level security;
alter table public.news_raw_items enable row level security;
alter table public.news_editor_actions enable row level security;
alter table public.news_pipeline_settings enable row level security;

drop policy if exists "Public can read published news posts" on public.news_posts;
create policy "Public can read published news posts"
  on public.news_posts
  for select
  using (status = 'published' and (published_at is null or published_at <= now()));

drop policy if exists "Public can read news storage" on storage.objects;
create policy "Public can read news storage"
  on storage.objects
  for select
  using (bucket_id = 'news');

comment on table public.news_sources is 'Configured RSS, MRSS, API, and manual news sources';
comment on table public.news_ingest_runs is 'Execution log for automated and manual news ingest runs';
comment on table public.news_raw_items is 'Private normalized raw source items used to build editor-facing drafts';
comment on table public.news_editor_actions is 'Audit trail for editor actions in the news module';
comment on table public.news_pipeline_settings is 'Singleton configuration row for the news ingest pipeline';
