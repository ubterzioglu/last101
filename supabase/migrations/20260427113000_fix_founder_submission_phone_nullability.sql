alter table public.founder_submissions
  alter column phone drop not null;

update public.founder_submissions
set phone = null
where btrim(coalesce(phone, '')) = '';
