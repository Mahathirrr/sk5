/*
  # Initial Schema Setup

  1. Users & Authentication
    - Enable auth schema and create users table
    - Add custom fields to auth.users
    - Setup user profiles

  2. Core Tables
    - courses: For storing course information
    - lessons: For course content/lessons
    - enrollments: Track student course enrollments
    - lesson_progress: Track student progress in lessons
    - discussions: Course discussions/forums
    - comments: Discussion comments
    - articles: Blog/article content
    - payments: Payment transactions
    - access_tokens: Course access tokens
    - certificates: Course completion certificates

  3. Security
    - Enable RLS on all tables
    - Setup access policies
    - Create necessary functions and triggers
*/

-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "citext";

-- Create custom types
create type user_role as enum ('student', 'instructor');
create type course_difficulty as enum ('beginner', 'intermediate', 'advanced');
create type enrollment_status as enum ('active', 'completed', 'cancelled');
create type payment_status as enum ('pending', 'success', 'failed', 'expired', 'refunded');

-- Create users table
create table if not exists users (
  id uuid references auth.users on delete cascade primary key,
  email citext not null unique,
  full_name text,
  avatar_url text,
  role user_role default 'student',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create courses table
create table if not exists courses (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  instructor_id uuid references users(id) on delete cascade not null,
  price integer not null default 0,
  category text not null,
  difficulty course_difficulty not null default 'beginner',
  thumbnail_url text,
  student_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create lessons table
create table if not exists lessons (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid references courses(id) on delete cascade not null,
  title text not null,
  description text not null,
  video_url text not null,
  duration integer not null, -- in seconds
  "order" integer not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create enrollments table
create table if not exists enrollments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade not null,
  course_id uuid references courses(id) on delete cascade not null,
  status enrollment_status default 'active',
  progress integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, course_id)
);

-- Create lesson_progress table
create table if not exists lesson_progress (
  id uuid primary key default uuid_generate_v4(),
  enrollment_id uuid references enrollments(id) on delete cascade not null,
  lesson_id uuid references lessons(id) on delete cascade not null,
  progress integer default 0,
  watch_time integer default 0,
  completed boolean default false,
  completed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(enrollment_id, lesson_id)
);

-- Create discussions table
create table if not exists discussions (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid references courses(id) on delete cascade not null,
  user_id uuid references users(id) on delete cascade not null,
  title text not null,
  content text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create comments table
create table if not exists comments (
  id uuid primary key default uuid_generate_v4(),
  discussion_id uuid references discussions(id) on delete cascade not null,
  user_id uuid references users(id) on delete cascade not null,
  content text not null,
  parent_id uuid references comments(id) on delete cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create articles table
create table if not exists articles (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  excerpt text not null,
  content text not null,
  cover_image text not null,
  published boolean default false,
  tags text[] default array[]::text[],
  author_id uuid references users(id) on delete cascade not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create payments table
create table if not exists payments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade not null,
  course_id uuid references courses(id) on delete cascade not null,
  amount integer not null,
  status payment_status default 'pending',
  payment_token text not null,
  payment_url text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create access_tokens table
create table if not exists access_tokens (
  id uuid primary key default uuid_generate_v4(),
  token text not null unique,
  course_id uuid references courses(id) on delete cascade not null,
  created_by uuid references users(id) on delete cascade not null,
  used_by uuid references users(id) on delete set null,
  used_at timestamptz,
  expires_at timestamptz not null,
  created_at timestamptz default now()
);

-- Create certificates table
create table if not exists certificates (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade not null,
  course_id uuid references courses(id) on delete cascade not null,
  certificate_number text not null unique,
  issued_at timestamptz not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table users enable row level security;
alter table courses enable row level security;
alter table lessons enable row level security;
alter table enrollments enable row level security;
alter table lesson_progress enable row level security;
alter table discussions enable row level security;
alter table comments enable row level security;
alter table articles enable row level security;
alter table payments enable row level security;
alter table access_tokens enable row level security;
alter table certificates enable row level security;

-- Create indexes
create index if not exists users_email_idx on users(email);
create index if not exists courses_instructor_id_idx on courses(instructor_id);
create index if not exists lessons_course_id_idx on lessons(course_id);
create index if not exists enrollments_user_id_idx on enrollments(user_id);
create index if not exists enrollments_course_id_idx on enrollments(course_id);
create index if not exists lesson_progress_enrollment_id_idx on lesson_progress(enrollment_id);
create index if not exists discussions_course_id_idx on discussions(course_id);
create index if not exists comments_discussion_id_idx on comments(discussion_id);
create index if not exists articles_author_id_idx on articles(author_id);
create index if not exists articles_slug_idx on articles(slug);
create index if not exists payments_user_id_idx on payments(user_id);
create index if not exists payments_course_id_idx on payments(course_id);
create index if not exists access_tokens_course_id_idx on access_tokens(course_id);
create index if not exists certificates_user_id_idx on certificates(user_id);
create index if not exists certificates_course_id_idx on certificates(course_id);

-- Create updated_at trigger function
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create updated_at triggers
create trigger users_updated_at
  before update on users
  for each row
  execute function update_updated_at();

create trigger courses_updated_at
  before update on courses
  for each row
  execute function update_updated_at();

create trigger lessons_updated_at
  before update on lessons
  for each row
  execute function update_updated_at();

create trigger enrollments_updated_at
  before update on enrollments
  for each row
  execute function update_updated_at();

create trigger lesson_progress_updated_at
  before update on lesson_progress
  for each row
  execute function update_updated_at();

create trigger discussions_updated_at
  before update on discussions
  for each row
  execute function update_updated_at();

create trigger comments_updated_at
  before update on comments
  for each row
  execute function update_updated_at();

create trigger articles_updated_at
  before update on articles
  for each row
  execute function update_updated_at();

create trigger payments_updated_at
  before update on payments
  for each row
  execute function update_updated_at();
