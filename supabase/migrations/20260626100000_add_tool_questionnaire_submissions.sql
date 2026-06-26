create table if not exists public.tool_questionnaire_submissions (
  id uuid primary key default gen_random_uuid(),
  tool_slug text not null,
  survey_version text not null,
  session_id text not null,
  result_id text null,
  answers jsonb not null,
  tool_score numeric(5,2) not null,
  dimension_scores jsonb not null default '{}'::jsonb,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.tool_questionnaire_submissions enable row level security;

create index if not exists idx_tool_questionnaire_tool_slug
  on public.tool_questionnaire_submissions(tool_slug);

create index if not exists idx_tool_questionnaire_created_at
  on public.tool_questionnaire_submissions(created_at desc);
