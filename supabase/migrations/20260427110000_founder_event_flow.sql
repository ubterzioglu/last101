create table if not exists public.founder_submissions (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  linkedin_url text not null,
  whatsapp text not null,
  phone text not null,
  project_name text not null,
  project_url text not null,
  short_description text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  admin_comment text,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create unique index if not exists founder_submissions_whatsapp_uidx
  on public.founder_submissions (whatsapp);

create index if not exists founder_submissions_status_idx
  on public.founder_submissions (status, created_at desc);

create index if not exists founder_submissions_project_name_idx
  on public.founder_submissions (project_name);

create table if not exists public.founder_event_slots (
  id uuid primary key default gen_random_uuid(),
  starts_at timestamptz not null,
  ends_at timestamptz,
  title text,
  is_active boolean not null default true,
  sort_order integer not null default 100,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  check (ends_at is null or ends_at >= starts_at)
);

create index if not exists founder_event_slots_active_sort_idx
  on public.founder_event_slots (is_active, sort_order asc, starts_at asc);

create table if not exists public.founder_event_votes (
  id uuid primary key default gen_random_uuid(),
  founder_submission_id uuid not null references public.founder_submissions(id) on delete cascade,
  selected_slot_ids uuid[] not null default '{}',
  notes text,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create unique index if not exists founder_event_votes_founder_submission_uidx
  on public.founder_event_votes (founder_submission_id);

create index if not exists founder_event_votes_updated_at_idx
  on public.founder_event_votes (updated_at desc);

alter table public.founder_submissions enable row level security;
alter table public.founder_event_slots enable row level security;
alter table public.founder_event_votes enable row level security;

comment on table public.founder_submissions is 'Founder basvurulari ve admin onay durumu';
comment on table public.founder_event_slots is 'Founder etkinligi icin admin tarafindan yonetilen tarih saat slotlari';
comment on table public.founder_event_votes is 'Onayli founder kayitlarinin secili slot oyları';
