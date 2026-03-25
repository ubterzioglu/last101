alter table public.news_posts
add column if not exists show_in_carousel boolean not null default true;

update public.news_posts
set show_in_carousel = true
where show_in_carousel is null;
