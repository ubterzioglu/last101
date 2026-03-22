drop extension if exists "pg_net";
create sequence "public"."qa1_code_seq";
create sequence "public"."zgen_compat_id_seq";
create table "public"."bookmark_submissions" (
    "id" uuid not null default gen_random_uuid(),
    "title" character varying(255) not null,
    "url" text not null,
    "description" text,
    "category" character varying(100) default 'tools'::character varying,
    "img" text,
    "submitted_by" character varying(255),
    "ip_hash" character varying(50),
    "user_agent" character varying(255),
    "status" character varying(20) default 'pending'::character varying,
    "admin_notes" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );
alter table "public"."bookmark_submissions" enable row level security;
create table "public"."feedback_submissions" (
    "id" uuid not null default gen_random_uuid(),
    "message" text not null,
    "created_at" timestamp with time zone default now(),
    "ip_hash" text,
    "user_agent" text,
    "status" text default 'pending'::text
      );
alter table "public"."feedback_submissions" enable row level security;
create table "public"."news_posts" (
    "id" uuid not null default gen_random_uuid(),
    "category" text not null,
    "title" text not null,
    "summary" text,
    "content" text,
    "cover_image_url" text,
    "source_name" text,
    "source_url" text,
    "reading_minutes" integer default 3,
    "published_at" timestamp with time zone default now(),
    "created_at" timestamp with time zone default now(),
    "status" text not null default 'draft'::text
      );
alter table "public"."news_posts" enable row level security;
create table "public"."question_submissions" (
    "id" uuid not null default gen_random_uuid(),
    "question_text" text not null,
    "status" text not null default 'pending'::text,
    "created_at" timestamp with time zone not null default now()
      );
alter table "public"."question_submissions" enable row level security;
create table "public"."zgen_compat" (
    "id" integer not null default nextval('public.zgen_compat_id_seq'::regclass),
    "from_gen_id" text not null,
    "to_gen_id" text not null,
    "dos" jsonb not null default '[]'::jsonb,
    "donts" jsonb not null default '[]'::jsonb,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );
alter table "public"."zgen_compat" enable row level security;
create table "public"."zgen_generations" (
    "id" text not null,
    "name" text not null,
    "range_start" integer not null,
    "range_end" integer not null,
    "avatar_m" text,
    "avatar_f" text,
    "avatar_alt" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );
alter table "public"."zgen_generations" enable row level security;
create table "public"."zgen_profiles" (
    "gen_id" text not null,
    "traits" jsonb not null default '[]'::jsonb,
    "vibes" jsonb not null default '[]'::jsonb,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );
alter table "public"."zgen_profiles" enable row level security;
alter sequence "public"."zgen_compat_id_seq" owned by "public"."zgen_compat"."id";
CREATE UNIQUE INDEX bookmark_submissions_pkey ON public.bookmark_submissions USING btree (id);
CREATE UNIQUE INDEX feedback_submissions_pkey ON public.feedback_submissions USING btree (id);
CREATE INDEX idx_bookmark_category ON public.bookmark_submissions USING btree (category);
CREATE INDEX idx_bookmark_created ON public.bookmark_submissions USING btree (created_at DESC);
CREATE INDEX idx_bookmark_status ON public.bookmark_submissions USING btree (status);
CREATE INDEX idx_feedback_created ON public.feedback_submissions USING btree (created_at DESC);
CREATE INDEX idx_feedback_created_at ON public.feedback_submissions USING btree (created_at DESC);
CREATE INDEX idx_feedback_status ON public.feedback_submissions USING btree (status);
CREATE INDEX idx_news_posts_category_published ON public.news_posts USING btree (category, published_at DESC);
CREATE INDEX idx_news_posts_status_published ON public.news_posts USING btree (status, published_at DESC);
CREATE INDEX idx_zgen_compat_from ON public.zgen_compat USING btree (from_gen_id);
CREATE INDEX idx_zgen_compat_to ON public.zgen_compat USING btree (to_gen_id);
CREATE UNIQUE INDEX news_posts_pkey ON public.news_posts USING btree (id);
CREATE UNIQUE INDEX news_posts_source_url_unique ON public.news_posts USING btree (source_url);
CREATE UNIQUE INDEX question_submissions_pkey ON public.question_submissions USING btree (id);
CREATE UNIQUE INDEX zgen_compat_from_gen_id_to_gen_id_key ON public.zgen_compat USING btree (from_gen_id, to_gen_id);
CREATE UNIQUE INDEX zgen_compat_pkey ON public.zgen_compat USING btree (id);
CREATE UNIQUE INDEX zgen_generations_pkey ON public.zgen_generations USING btree (id);
CREATE UNIQUE INDEX zgen_profiles_pkey ON public.zgen_profiles USING btree (gen_id);
alter table "public"."bookmark_submissions" add constraint "bookmark_submissions_pkey" PRIMARY KEY using index "bookmark_submissions_pkey";
alter table "public"."feedback_submissions" add constraint "feedback_submissions_pkey" PRIMARY KEY using index "feedback_submissions_pkey";
alter table "public"."news_posts" add constraint "news_posts_pkey" PRIMARY KEY using index "news_posts_pkey";
alter table "public"."question_submissions" add constraint "question_submissions_pkey" PRIMARY KEY using index "question_submissions_pkey";
alter table "public"."zgen_compat" add constraint "zgen_compat_pkey" PRIMARY KEY using index "zgen_compat_pkey";
alter table "public"."zgen_generations" add constraint "zgen_generations_pkey" PRIMARY KEY using index "zgen_generations_pkey";
alter table "public"."zgen_profiles" add constraint "zgen_profiles_pkey" PRIMARY KEY using index "zgen_profiles_pkey";
alter table "public"."feedback_submissions" add constraint "feedback_submissions_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'reviewed'::text, 'resolved'::text]))) not valid;
alter table "public"."feedback_submissions" validate constraint "feedback_submissions_status_check";
alter table "public"."news_posts" add constraint "news_posts_category_check" CHECK ((category = ANY (ARRAY['Almanya'::text, 'Türkiye'::text, 'Avrupa'::text, 'Dünya'::text]))) not valid;
alter table "public"."news_posts" validate constraint "news_posts_category_check";
alter table "public"."news_posts" add constraint "news_posts_status_check" CHECK ((status = ANY (ARRAY['draft'::text, 'published'::text]))) not valid;
alter table "public"."news_posts" validate constraint "news_posts_status_check";
alter table "public"."zgen_compat" add constraint "zgen_compat_from_gen_id_fkey" FOREIGN KEY (from_gen_id) REFERENCES public.zgen_generations(id) ON DELETE CASCADE not valid;
alter table "public"."zgen_compat" validate constraint "zgen_compat_from_gen_id_fkey";
alter table "public"."zgen_compat" add constraint "zgen_compat_from_gen_id_to_gen_id_key" UNIQUE using index "zgen_compat_from_gen_id_to_gen_id_key";
alter table "public"."zgen_compat" add constraint "zgen_compat_to_gen_id_fkey" FOREIGN KEY (to_gen_id) REFERENCES public.zgen_generations(id) ON DELETE CASCADE not valid;
alter table "public"."zgen_compat" validate constraint "zgen_compat_to_gen_id_fkey";
alter table "public"."zgen_profiles" add constraint "zgen_profiles_gen_id_fkey" FOREIGN KEY (gen_id) REFERENCES public.zgen_generations(id) ON DELETE CASCADE not valid;
alter table "public"."zgen_profiles" validate constraint "zgen_profiles_gen_id_fkey";
set check_function_bodies = off;
CREATE OR REPLACE FUNCTION public.set_qa1_code()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF NEW.qa_code IS NULL OR NEW.qa_code = '' THEN
    NEW.qa_code := 'QA' || LPAD(nextval('qa1_code_seq')::text, 4, '0');
  END IF;
  RETURN NEW;
END;
$function$;
grant delete on table "public"."bookmark_submissions" to "anon";
grant insert on table "public"."bookmark_submissions" to "anon";
grant references on table "public"."bookmark_submissions" to "anon";
grant select on table "public"."bookmark_submissions" to "anon";
grant trigger on table "public"."bookmark_submissions" to "anon";
grant truncate on table "public"."bookmark_submissions" to "anon";
grant update on table "public"."bookmark_submissions" to "anon";
grant delete on table "public"."bookmark_submissions" to "authenticated";
grant insert on table "public"."bookmark_submissions" to "authenticated";
grant references on table "public"."bookmark_submissions" to "authenticated";
grant select on table "public"."bookmark_submissions" to "authenticated";
grant trigger on table "public"."bookmark_submissions" to "authenticated";
grant truncate on table "public"."bookmark_submissions" to "authenticated";
grant update on table "public"."bookmark_submissions" to "authenticated";
grant delete on table "public"."bookmark_submissions" to "service_role";
grant insert on table "public"."bookmark_submissions" to "service_role";
grant references on table "public"."bookmark_submissions" to "service_role";
grant select on table "public"."bookmark_submissions" to "service_role";
grant trigger on table "public"."bookmark_submissions" to "service_role";
grant truncate on table "public"."bookmark_submissions" to "service_role";
grant update on table "public"."bookmark_submissions" to "service_role";
grant delete on table "public"."feedback_submissions" to "anon";
grant insert on table "public"."feedback_submissions" to "anon";
grant references on table "public"."feedback_submissions" to "anon";
grant select on table "public"."feedback_submissions" to "anon";
grant trigger on table "public"."feedback_submissions" to "anon";
grant truncate on table "public"."feedback_submissions" to "anon";
grant update on table "public"."feedback_submissions" to "anon";
grant delete on table "public"."feedback_submissions" to "authenticated";
grant insert on table "public"."feedback_submissions" to "authenticated";
grant references on table "public"."feedback_submissions" to "authenticated";
grant select on table "public"."feedback_submissions" to "authenticated";
grant trigger on table "public"."feedback_submissions" to "authenticated";
grant truncate on table "public"."feedback_submissions" to "authenticated";
grant update on table "public"."feedback_submissions" to "authenticated";
grant delete on table "public"."feedback_submissions" to "service_role";
grant insert on table "public"."feedback_submissions" to "service_role";
grant references on table "public"."feedback_submissions" to "service_role";
grant select on table "public"."feedback_submissions" to "service_role";
grant trigger on table "public"."feedback_submissions" to "service_role";
grant truncate on table "public"."feedback_submissions" to "service_role";
grant update on table "public"."feedback_submissions" to "service_role";
grant delete on table "public"."news_posts" to "anon";
grant insert on table "public"."news_posts" to "anon";
grant references on table "public"."news_posts" to "anon";
grant select on table "public"."news_posts" to "anon";
grant trigger on table "public"."news_posts" to "anon";
grant truncate on table "public"."news_posts" to "anon";
grant update on table "public"."news_posts" to "anon";
grant delete on table "public"."news_posts" to "authenticated";
grant insert on table "public"."news_posts" to "authenticated";
grant references on table "public"."news_posts" to "authenticated";
grant select on table "public"."news_posts" to "authenticated";
grant trigger on table "public"."news_posts" to "authenticated";
grant truncate on table "public"."news_posts" to "authenticated";
grant update on table "public"."news_posts" to "authenticated";
grant delete on table "public"."news_posts" to "service_role";
grant insert on table "public"."news_posts" to "service_role";
grant references on table "public"."news_posts" to "service_role";
grant select on table "public"."news_posts" to "service_role";
grant trigger on table "public"."news_posts" to "service_role";
grant truncate on table "public"."news_posts" to "service_role";
grant update on table "public"."news_posts" to "service_role";
grant delete on table "public"."question_submissions" to "anon";
grant insert on table "public"."question_submissions" to "anon";
grant references on table "public"."question_submissions" to "anon";
grant select on table "public"."question_submissions" to "anon";
grant trigger on table "public"."question_submissions" to "anon";
grant truncate on table "public"."question_submissions" to "anon";
grant update on table "public"."question_submissions" to "anon";
grant delete on table "public"."question_submissions" to "authenticated";
grant insert on table "public"."question_submissions" to "authenticated";
grant references on table "public"."question_submissions" to "authenticated";
grant select on table "public"."question_submissions" to "authenticated";
grant trigger on table "public"."question_submissions" to "authenticated";
grant truncate on table "public"."question_submissions" to "authenticated";
grant update on table "public"."question_submissions" to "authenticated";
grant delete on table "public"."question_submissions" to "service_role";
grant insert on table "public"."question_submissions" to "service_role";
grant references on table "public"."question_submissions" to "service_role";
grant select on table "public"."question_submissions" to "service_role";
grant trigger on table "public"."question_submissions" to "service_role";
grant truncate on table "public"."question_submissions" to "service_role";
grant update on table "public"."question_submissions" to "service_role";
grant delete on table "public"."zgen_compat" to "anon";
grant insert on table "public"."zgen_compat" to "anon";
grant references on table "public"."zgen_compat" to "anon";
grant select on table "public"."zgen_compat" to "anon";
grant trigger on table "public"."zgen_compat" to "anon";
grant truncate on table "public"."zgen_compat" to "anon";
grant update on table "public"."zgen_compat" to "anon";
grant delete on table "public"."zgen_compat" to "authenticated";
grant insert on table "public"."zgen_compat" to "authenticated";
grant references on table "public"."zgen_compat" to "authenticated";
grant select on table "public"."zgen_compat" to "authenticated";
grant trigger on table "public"."zgen_compat" to "authenticated";
grant truncate on table "public"."zgen_compat" to "authenticated";
grant update on table "public"."zgen_compat" to "authenticated";
grant delete on table "public"."zgen_compat" to "service_role";
grant insert on table "public"."zgen_compat" to "service_role";
grant references on table "public"."zgen_compat" to "service_role";
grant select on table "public"."zgen_compat" to "service_role";
grant trigger on table "public"."zgen_compat" to "service_role";
grant truncate on table "public"."zgen_compat" to "service_role";
grant update on table "public"."zgen_compat" to "service_role";
grant delete on table "public"."zgen_generations" to "anon";
grant insert on table "public"."zgen_generations" to "anon";
grant references on table "public"."zgen_generations" to "anon";
grant select on table "public"."zgen_generations" to "anon";
grant trigger on table "public"."zgen_generations" to "anon";
grant truncate on table "public"."zgen_generations" to "anon";
grant update on table "public"."zgen_generations" to "anon";
grant delete on table "public"."zgen_generations" to "authenticated";
grant insert on table "public"."zgen_generations" to "authenticated";
grant references on table "public"."zgen_generations" to "authenticated";
grant select on table "public"."zgen_generations" to "authenticated";
grant trigger on table "public"."zgen_generations" to "authenticated";
grant truncate on table "public"."zgen_generations" to "authenticated";
grant update on table "public"."zgen_generations" to "authenticated";
grant delete on table "public"."zgen_generations" to "service_role";
grant insert on table "public"."zgen_generations" to "service_role";
grant references on table "public"."zgen_generations" to "service_role";
grant select on table "public"."zgen_generations" to "service_role";
grant trigger on table "public"."zgen_generations" to "service_role";
grant truncate on table "public"."zgen_generations" to "service_role";
grant update on table "public"."zgen_generations" to "service_role";
grant delete on table "public"."zgen_profiles" to "anon";
grant insert on table "public"."zgen_profiles" to "anon";
grant references on table "public"."zgen_profiles" to "anon";
grant select on table "public"."zgen_profiles" to "anon";
grant trigger on table "public"."zgen_profiles" to "anon";
grant truncate on table "public"."zgen_profiles" to "anon";
grant update on table "public"."zgen_profiles" to "anon";
grant delete on table "public"."zgen_profiles" to "authenticated";
grant insert on table "public"."zgen_profiles" to "authenticated";
grant references on table "public"."zgen_profiles" to "authenticated";
grant select on table "public"."zgen_profiles" to "authenticated";
grant trigger on table "public"."zgen_profiles" to "authenticated";
grant truncate on table "public"."zgen_profiles" to "authenticated";
grant update on table "public"."zgen_profiles" to "authenticated";
grant delete on table "public"."zgen_profiles" to "service_role";
grant insert on table "public"."zgen_profiles" to "service_role";
grant references on table "public"."zgen_profiles" to "service_role";
grant select on table "public"."zgen_profiles" to "service_role";
grant trigger on table "public"."zgen_profiles" to "service_role";
grant truncate on table "public"."zgen_profiles" to "service_role";
grant update on table "public"."zgen_profiles" to "service_role";
create policy "Service role can do everything on bookmarks"
  on "public"."bookmark_submissions"
  as permissive
  for all
  to public
using (true)
with check (true);
create policy "Allow anonymous feedback submission"
  on "public"."feedback_submissions"
  as permissive
  for insert
  to anon
with check (true);
create policy "Only authenticated can read feedback"
  on "public"."feedback_submissions"
  as permissive
  for select
  to authenticated
using (true);
create policy "Service role can do everything on feedback"
  on "public"."feedback_submissions"
  as permissive
  for all
  to public
using (true)
with check (true);
create policy "Public can read published news"
  on "public"."news_posts"
  as permissive
  for select
  to public
using ((status = 'published'::text));
create policy "anon can insert submissions"
  on "public"."question_submissions"
  as permissive
  for insert
  to anon
with check (true);
create policy "Allow public read access on zgen_compat"
  on "public"."zgen_compat"
  as permissive
  for select
  to public
using (true);
create policy "Allow public read access on zgen_generations"
  on "public"."zgen_generations"
  as permissive
  for select
  to public
using (true);
create policy "Allow public read access on zgen_profiles"
  on "public"."zgen_profiles"
  as permissive
  for select
  to public
using (true);
