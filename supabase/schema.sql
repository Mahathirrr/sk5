-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Set up storage buckets
insert into storage.buckets (id, name)
values ('avatars', 'avatars'), ('thumbnails', 'thumbnails');

-- Create custom types
create type user_role as enum ('student', 'instructor');
create type course_difficulty as enum ('beginner', 'intermediate', 'advanced');
create type enrollment_status as enum ('active', 'completed', 'cancelled');
create type payment_status as enum ('pending', 'success', 'failed', 'expired', 'refunded');

-- Create tables
create table public.users (
  id uuid references auth.users on delete cascade,
  email text unique not null,
  full_name text,
  avatar_url text,
  role user_role default 'student',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

create table public.courses (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  instructor_id uuid references public.users(id) on delete cascade not null,
  price integer not null default 0,
  category text not null,
  difficulty course_difficulty not null default 'beginner',
  thumbnail_url text,
  student_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.lessons (
  id uuid default uuid_generate_v4() primary key,
  course_id uuid references public.courses(id) on delete cascade not null,
  title text not null,
  description text not null,
  video_url text not null,
  duration integer not null, -- in seconds
  "order" integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.enrollments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  course_id uuid references public.courses(id) on delete cascade not null,
  status enrollment_status default 'active',
  progress integer default 0,
  last_active_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, course_id)
);

create table public.lesson_progress (
  id uuid default uuid_generate_v4() primary key,
  enrollment_id uuid references public.enrollments(id) on delete cascade not null,
  lesson_id uuid references public.lessons(id) on delete cascade not null,
  progress integer default 0,
  watch_time integer default 0, -- in seconds
  completed boolean default false,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(enrollment_id, lesson_id)
);

create table public.access_tokens (
  id uuid default uuid_generate_v4() primary key,
  token text unique not null,
  course_id uuid references public.courses(id) on delete cascade not null,
  created_by uuid references public.users(id) on delete cascade not null,
  used_by uuid references public.users(id),
  used_at timestamp with time zone,
  expires_at timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.payments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  course_id uuid references public.courses(id) on delete cascade not null,
  amount integer not null,
  status payment_status default 'pending',
  payment_token text,
  payment_url text,
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.certificates (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  course_id uuid references public.courses(id) on delete cascade not null,
  certificate_number text unique not null,
  metadata jsonb not null,
  issued_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.discussions (
  id uuid default uuid_generate_v4() primary key,
  course_id uuid references public.courses(id) on delete cascade not null,
  user_id uuid references public.users(id) on delete cascade not null,
  title text not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.comments (
  id uuid default uuid_generate_v4() primary key,
  discussion_id uuid references public.discussions(id) on delete cascade not null,
  user_id uuid references public.users(id) on delete cascade not null,
  content text not null,
  parent_id uuid references public.comments(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes
create index courses_instructor_id_idx on public.courses(instructor_id);
create index lessons_course_id_idx on public.lessons(course_id);
create index enrollments_user_id_idx on public.enrollments(user_id);
create index enrollments_course_id_idx on public.enrollments(course_id);
create index lesson_progress_enrollment_id_idx on public.lesson_progress(enrollment_id);
create index lesson_progress_lesson_id_idx on public.lesson_progress(lesson_id);
create index access_tokens_course_id_idx on public.access_tokens(course_id);
create index payments_user_id_idx on public.payments(user_id);
create index payments_course_id_idx on public.payments(course_id);
create index discussions_course_id_idx on public.discussions(course_id);
create index comments_discussion_id_idx on public.comments(discussion_id);

-- Set up RLS policies
alter table public.users enable row level security;
alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.enrollments enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.access_tokens enable row level security;
alter table public.payments enable row level security;
alter table public.certificates enable row level security;
alter table public.discussions enable row level security;
alter table public.comments enable row level security;

-- Create policies
create policy "Users can view their own data"
  on public.users for select
  using (auth.uid() = id);

create policy "Public courses are viewable by everyone"
  on public.courses for select
  using (true);

create policy "Instructors can create courses"
  on public.courses for insert
  with check (exists (
    select 1 from public.users
    where id = auth.uid()
    and role = 'instructor'
  ));

create policy "Instructors can update their own courses"
  on public.courses for update
  using (instructor_id = auth.uid())
  with check (instructor_id = auth.uid());

-- Add more policies for other tables...

-- Create functions
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Create triggers
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();