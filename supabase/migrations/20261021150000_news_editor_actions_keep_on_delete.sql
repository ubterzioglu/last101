-- Haber silindiğinde audit kaydı da cascade ile siliniyordu; kim neyi sildi bilgisi kayboluyordu.
-- post_id artık null olabilir ve FK `on delete set null`; silme işlemi ayrıca 'delete' eylemiyle kaydedilir.

alter table public.news_editor_actions
  alter column post_id drop not null;

alter table public.news_editor_actions
  drop constraint if exists news_editor_actions_post_id_fkey;

alter table public.news_editor_actions
  add constraint news_editor_actions_post_id_fkey
  foreign key (post_id) references public.news_posts(id) on delete set null;

alter table public.news_editor_actions
  drop constraint if exists news_editor_actions_action_type_check;

alter table public.news_editor_actions
  add constraint news_editor_actions_action_type_check
  check (action_type in (
    'create', 'update', 'approve', 'publish', 'reject', 'archive', 'feature', 'pipeline_run', 'source_run', 'delete'
  ));
