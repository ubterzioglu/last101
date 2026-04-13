-- Add content column to news_posts table
alter table public.news_posts
add column if not exists content text;

-- Add comment for documentation
comment on column public.news_posts.content is 'Full article content in Markdown format';
comment on column public.news_posts.summary is 'Short excerpt for listings (150-200 characters)';
