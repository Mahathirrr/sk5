-- Enable anonymous access to public schema
grant usage on schema public to anon;
grant usage on schema public to authenticated;

-- Grant access to all tables for authenticated users
grant all on all tables in schema public to authenticated;

-- Grant select access to specific tables for anonymous users
grant select on public.courses to anon;
grant select on public.articles to anon;
grant select on public.users to anon;

-- Update RLS policies for courses
drop policy if exists "Anyone can view published courses" on public.courses;
create policy "Anyone can view courses"
    on public.courses for select
    to anon, authenticated
    using (true);

-- Update RLS policies for articles
drop policy if exists "Anyone can view published articles" on public.articles;
create policy "Anyone can view articles"
    on public.articles for select
    to anon, authenticated
    using (published = true);

-- Update RLS policies for users
drop policy if exists "Users can view their own profile" on public.users;
create policy "Anyone can view user profiles"
    on public.users for select
    to anon, authenticated
    using (true);
