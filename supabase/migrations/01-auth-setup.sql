-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Set up storage buckets
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);
insert into storage.buckets (id, name, public) values ('thumbnails', 'thumbnails', true);

-- Create enum types
create type user_role as enum ('student', 'instructor');
create type course_difficulty as enum ('beginner', 'intermediate', 'advanced');
create type enrollment_status as enum ('active', 'completed', 'cancelled');
create type payment_status as enum ('pending', 'success', 'failed', 'expired', 'refunded');

-- Create users table
create table public.users (
    id uuid references auth.users on delete cascade primary key,
    email text unique not null,
    full_name text,
    avatar_url text,
    role user_role default 'student',
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Create courses table
create table public.courses (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    description text not null,
    instructor_id uuid references public.users(id) on delete cascade not null,
    price integer not null check (price >= 0),
    category text not null,
    difficulty course_difficulty not null,
    thumbnail_url text,
    student_count integer default 0,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Create lessons table
create table public.lessons (
    id uuid default uuid_generate_v4() primary key,
    course_id uuid references public.courses(id) on delete cascade not null,
    title text not null,
    description text not null,
    video_url text not null,
    duration integer not null check (duration > 0), -- in seconds
    "order" integer not null,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    unique (course_id, "order")
);

-- Create enrollments table
create table public.enrollments (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.users(id) on delete cascade not null,
    course_id uuid references public.courses(id) on delete cascade not null,
    status enrollment_status default 'active',
    progress integer default 0 check (progress >= 0 and progress <= 100),
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    unique (user_id, course_id)
);

-- Create lesson progress table
create table public.lesson_progress (
    id uuid default uuid_generate_v4() primary key,
    enrollment_id uuid references public.enrollments(id) on delete cascade not null,
    lesson_id uuid references public.lessons(id) on delete cascade not null,
    progress integer default 0 check (progress >= 0 and progress <= 100),
    watch_time integer default 0, -- in seconds
    completed boolean default false,
    completed_at timestamptz,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    unique (enrollment_id, lesson_id)
);

-- Create access tokens table
create table public.access_tokens (
    id uuid default uuid_generate_v4() primary key,
    token text unique not null,
    course_id uuid references public.courses(id) on delete cascade not null,
    created_by uuid references public.users(id) on delete cascade not null,
    used_by uuid references public.users(id) on delete set null,
    used_at timestamptz,
    expires_at timestamptz not null,
    created_at timestamptz default now()
);

-- Create discussions table
create table public.discussions (
    id uuid default uuid_generate_v4() primary key,
    course_id uuid references public.courses(id) on delete cascade not null,
    user_id uuid references public.users(id) on delete cascade not null,
    title text not null,
    content text not null,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Create comments table
create table public.comments (
    id uuid default uuid_generate_v4() primary key,
    discussion_id uuid references public.discussions(id) on delete cascade not null,
    user_id uuid references public.users(id) on delete cascade not null,
    content text not null,
    parent_id uuid references public.comments(id) on delete cascade,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Create articles table
create table public.articles (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    slug text unique not null,
    excerpt text not null,
    content text not null,
    cover_image text not null,
    published boolean default false,
    tags text[] default array[]::text[],
    author_id uuid references public.users(id) on delete cascade not null,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Create payments table
create table public.payments (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.users(id) on delete cascade not null,
    course_id uuid references public.courses(id) on delete cascade not null,
    amount integer not null check (amount >= 0),
    status payment_status default 'pending',
    payment_token text not null,
    payment_url text not null,
    metadata jsonb default '{}'::jsonb,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Create notifications table
create table public.notifications (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.users(id) on delete cascade not null,
    title text not null,
    message text not null,
    read boolean default false,
    created_at timestamptz default now()
);

-- Create certificates table
create table public.certificates (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.users(id) on delete cascade not null,
    course_id uuid references public.courses(id) on delete cascade not null,
    certificate_number text unique not null,
    issued_at timestamptz not null,
    metadata jsonb not null,
    created_at timestamptz default now()
);

-- Create indexes
create index idx_courses_instructor on public.courses(instructor_id);
create index idx_courses_category on public.courses(category);
create index idx_courses_difficulty on public.courses(difficulty);
create index idx_lessons_course on public.lessons(course_id);
create index idx_lessons_order on public.lessons(course_id, "order");
create index idx_enrollments_user on public.enrollments(user_id);
create index idx_enrollments_course on public.enrollments(course_id);
create index idx_lesson_progress_enrollment on public.lesson_progress(enrollment_id);
create index idx_lesson_progress_lesson on public.lesson_progress(lesson_id);
create index idx_access_tokens_course on public.access_tokens(course_id);
create index idx_access_tokens_token on public.access_tokens(token);
create index idx_discussions_course on public.discussions(course_id);
create index idx_discussions_user on public.discussions(user_id);
create index idx_comments_discussion on public.comments(discussion_id);
create index idx_comments_user on public.comments(user_id);
create index idx_articles_author on public.articles(author_id);
create index idx_articles_slug on public.articles(slug);
create index idx_articles_published on public.articles(published);
create index idx_payments_user on public.payments(user_id);
create index idx_payments_course on public.payments(course_id);
create index idx_payments_status on public.payments(status);
create index idx_notifications_user on public.notifications(user_id);
create index idx_certificates_user on public.certificates(user_id);
create index idx_certificates_course on public.certificates(course_id);
create index idx_certificates_number on public.certificates(certificate_number);

-- Create functions
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.users (id, email, full_name, avatar_url, role)
    values (
        new.id,
        new.email,
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'avatar_url',
        'student'
    );
    return new;
end;
$$ language plpgsql security definer;

create or replace function public.handle_enrollment_count()
returns trigger as $$
begin
    if (tg_op = 'INSERT') then
        update public.courses
        set student_count = student_count + 1
        where id = new.course_id;
    elsif (tg_op = 'DELETE') then
        update public.courses
        set student_count = student_count - 1
        where id = old.course_id;
    end if;
    return null;
end;
$$ language plpgsql security definer;

-- Create triggers
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

create trigger on_enrollment_changed
    after insert or delete on public.enrollments
    for each row execute procedure public.handle_enrollment_count();

-- Set up row level security (RLS)
alter table public.users enable row level security;
alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.enrollments enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.access_tokens enable row level security;
alter table public.discussions enable row level security;
alter table public.comments enable row level security;
alter table public.articles enable row level security;
alter table public.payments enable row level security;
alter table public.notifications enable row level security;
alter table public.certificates enable row level security;

-- Create policies
-- Users policies
create policy "Users can view their own profile"
    on public.users for select
    using (auth.uid() = id);

create policy "Users can update their own profile"
    on public.users for update
    using (auth.uid() = id);

-- Courses policies
create policy "Anyone can view published courses"
    on public.courses for select
    using (true);

create policy "Instructors can create courses"
    on public.courses for insert
    with check (
        exists (
            select 1 from public.users
            where id = auth.uid()
            and role = 'instructor'
        )
    );

create policy "Instructors can update their own courses"
    on public.courses for update
    using (instructor_id = auth.uid());

-- Lessons policies
create policy "Anyone can view lessons of enrolled courses"
    on public.lessons for select
    using (
        exists (
            select 1 from public.enrollments
            where course_id = lessons.course_id
            and user_id = auth.uid()
        )
        or
        exists (
            select 1 from public.courses
            where id = lessons.course_id
            and instructor_id = auth.uid()
        )
    );

create policy "Instructors can manage lessons"
    on public.lessons for all
    using (
        exists (
            select 1 from public.courses
            where id = lessons.course_id
            and instructor_id = auth.uid()
        )
    );

-- Enrollments policies
create policy "Users can view their own enrollments"
    on public.enrollments for select
    using (user_id = auth.uid());

create policy "Users can enroll in courses"
    on public.enrollments for insert
    with check (user_id = auth.uid());

-- Articles policies
create policy "Anyone can view published articles"
    on public.articles for select
    using (published = true);

create policy "Authors can manage their articles"
    on public.articles for all
    using (author_id = auth.uid());

-- Discussions policies
create policy "Users can view discussions of enrolled courses"
    on public.discussions for select
    using (
        exists (
            select 1 from public.enrollments
            where course_id = discussions.course_id
            and user_id = auth.uid()
        )
        or
        exists (
            select 1 from public.courses
            where id = discussions.course_id
            and instructor_id = auth.uid()
        )
    );

create policy "Users can create discussions in enrolled courses"
    on public.discussions for insert
    with check (
        exists (
            select 1 from public.enrollments
            where course_id = discussions.course_id
            and user_id = auth.uid()
        )
    );

-- Comments policies
create policy "Users can view comments"
    on public.comments for select
    using (true);

create policy "Users can create comments"
    on public.comments for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own comments"
    on public.comments for update
    using (auth.uid() = user_id);

-- Notifications policies
create policy "Users can view their own notifications"
    on public.notifications for select
    using (user_id = auth.uid());

create policy "Users can mark their notifications as read"
    on public.notifications for update
    using (user_id = auth.uid())
    with check (user_id = auth.uid());

-- Certificates policies
create policy "Anyone can view certificates"
    on public.certificates for select
    using (true);

-- Storage policies
create policy "Anyone can view avatars"
    on storage.objects for select
    using (bucket_id = 'avatars');

create policy "Users can upload their own avatar"
    on storage.objects for insert
    with check (
        bucket_id = 'avatars' and
        auth.uid() = (storage.foldername(name))[1]::uuid
    );

create policy "Anyone can view thumbnails"
    on storage.objects for select
    using (bucket_id = 'thumbnails');

create policy "Instructors can upload course thumbnails"
    on storage.objects for insert
    with check (
        bucket_id = 'thumbnails' and
        exists (
            select 1 from public.users
            where id = auth.uid()
            and role = 'instructor'
        )
    );
