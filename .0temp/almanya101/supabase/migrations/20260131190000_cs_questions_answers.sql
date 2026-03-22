-- Create anonymous Q&A tables for sc/cs.html

create table if not exists cs_questions (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  question text not null,
  status text not null default 'approved',
  ip_hash text,
  user_agent text,
  answer_count integer not null default 0
);

create table if not exists cs_answers (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  question_id bigint not null references cs_questions(id) on delete cascade,
  message text not null,
  status text not null default 'approved',
  ip_hash text,
  user_agent text
);

create index if not exists cs_questions_created_at_idx on cs_questions (created_at desc);
create index if not exists cs_questions_status_idx on cs_questions (status);
create index if not exists cs_answers_question_id_idx on cs_answers (question_id);
create index if not exists cs_answers_created_at_idx on cs_answers (created_at desc);
