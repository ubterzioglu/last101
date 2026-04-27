alter table public.founder_submissions
  alter column full_name drop not null,
  alter column linkedin_url drop not null,
  alter column whatsapp drop not null,
  alter column phone drop not null,
  alter column project_name drop not null,
  alter column project_url drop not null,
  alter column short_description drop not null,
  alter column admin_comment drop not null;

update public.founder_submissions
set
  full_name = nullif(btrim(full_name), ''),
  linkedin_url = nullif(btrim(linkedin_url), ''),
  whatsapp = nullif(btrim(whatsapp), ''),
  phone = nullif(btrim(phone), ''),
  project_name = nullif(btrim(project_name), ''),
  project_url = nullif(btrim(project_url), ''),
  short_description = nullif(btrim(short_description), ''),
  admin_comment = nullif(btrim(admin_comment), '');
