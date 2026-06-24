-- Admin Güvenlik Notları / Uyarıları tablosu.
-- Amaç: Çalışma sırasında ortaya çıkan güvenlik uyarılarını (sızan secret,
-- yanlış RLS, eksik doğrulama vb.) kalıcı olarak kaydetmek ki admin sonradan
-- hatırlayıp aksiyon alabilsin. Kayıtlar API (isAdminAuthorized) üzerinden veya
-- otomatik (sistem) eklenir.
--
-- Güvenlik: tablo public erişime TAMAMEN kapalıdır. RLS açık ve hiçbir public
-- policy yok → yalnızca service_role (server-side admin route) erişebilir.

create table if not exists public.security_notes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  severity text not null default 'medium'
    check (severity in ('low', 'medium', 'high', 'critical')),
  category text not null default 'general'
    check (category in ('secret', 'auth', 'rls', 'validation', 'dependency', 'config', 'general')),
  status text not null default 'open'
    check (status in ('open', 'in_progress', 'resolved', 'wontfix')),
  related_path text,
  source text not null default 'manual'
    check (source in ('manual', 'agent', 'system')),
  resolution_note text,
  resolved_at timestamptz,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists security_notes_status_severity_idx
  on public.security_notes (status, severity desc, created_at desc);
create index if not exists security_notes_category_idx
  on public.security_notes (category, created_at desc);
create index if not exists security_notes_created_at_idx
  on public.security_notes (created_at desc);

-- updated_at otomatik güncelleme.
create or replace function public.set_security_notes_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := timezone('utc'::text, now());
  return new;
end;
$$;

drop trigger if exists trg_security_notes_updated_at on public.security_notes;
create trigger trg_security_notes_updated_at
  before update on public.security_notes
  for each row execute function public.set_security_notes_updated_at();

-- RLS: açık, public policy yok → yalnızca service_role erişir (deny-by-default).
alter table public.security_notes enable row level security;

comment on table public.security_notes is
  'Admin güvenlik notları/uyarıları. Public erişime kapalı; yalnızca admin server route (service_role) erişir.';
