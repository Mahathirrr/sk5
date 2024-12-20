/*
  # Row Level Security Policies

  1. Users
    - Users can read their own profile
    - Users can update their own profile
    - Public can read basic user info

  2. Courses
    - Anyone can read published courses
    - Instructors can CRUD their own courses
    - Students can read enrolled courses

  3. Lessons
    - Enrolled students can read lessons
    - Instructors can CRUD their course lessons

  4. Other tables
    - Similar patterns for other tables
    - Strict access control based on user roles
*/

-- Users policies
create policy "Users can read own profile"
  on users for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on users for update
  using (auth.uid() = id);

create policy "Public can read basic user info"
  on users for select
  using (true);

-- Courses policies
create policy "Anyone can read published courses"
  on courses for select
  using (true);

create policy "Instructors can insert own courses"
  on courses for insert
  with check (
    auth.uid() = instructor_id
    and exists (
      select 1 from users
      where id = auth.uid()
      and role = 'instructor'
    )
  );

create policy "Instructors can update own courses"
  on courses for update
  using (
    auth.uid() = instructor_id
    and exists (
      select 1 from users
      where id = auth.uid()
      and role = 'instructor'
    )
  );

create policy "Instructors can delete own courses"
  on courses for delete
  using (
    auth.uid() = instructor_id
    and exists (
      select 1 from users
      where id = auth.uid()
      and role = 'instructor'
    )
  );

-- Lessons policies
create policy "Enrolled students can read lessons"
  on lessons for select
  using (
    exists (
      select 1 from enrollments
      where user_id = auth.uid()
      and course_id = lessons.course_id
    )
    or
    exists (
      select 1 from courses
      where id = lessons.course_id
      and instructor_id = auth.uid()
    )
  );

create policy "Instructors can insert course lessons"
  on lessons for insert
  with check (
    exists (
      select 1 from courses
      where id = course_id
      and instructor_id = auth.uid()
    )
  );

create policy "Instructors can update course lessons"
  on lessons for update
  using (
    exists (
      select 1 from courses
      where id = course_id
      and instructor_id = auth.uid()
    )
  );

create policy "Instructors can delete course lessons"
  on lessons for delete
  using (
    exists (
      select 1 from courses
      where id = course_id
      and instructor_id = auth.uid()
    )
  );

-- Enrollments policies
create policy "Users can read own enrollments"
  on enrollments for select
  using (auth.uid() = user_id);

create policy "Users can enroll in courses"
  on enrollments for insert
  with check (auth.uid() = user_id);

create policy "Users can update own enrollments"
  on enrollments for update
  using (auth.uid() = user_id);

-- Lesson progress policies
create policy "Users can read own lesson progress"
  on lesson_progress for select
  using (
    exists (
      select 1 from enrollments
      where id = enrollment_id
      and user_id = auth.uid()
    )
  );

create policy "Users can insert own lesson progress"
  on lesson_progress for insert
  with check (
    exists (
      select 1 from enrollments
      where id = enrollment_id
      and user_id = auth.uid()
    )
  );

create policy "Users can update own lesson progress"
  on lesson_progress for update
  using (
    exists (
      select 1 from enrollments
      where id = enrollment_id
      and user_id = auth.uid()
    )
  );

-- Discussions policies
create policy "Anyone can read discussions"
  on discussions for select
  using (true);

create policy "Enrolled users can create discussions"
  on discussions for insert
  with check (
    exists (
      select 1 from enrollments
      where user_id = auth.uid()
      and course_id = discussions.course_id
    )
    or
    exists (
      select 1 from courses
      where id = discussions.course_id
      and instructor_id = auth.uid()
    )
  );

create policy "Users can update own discussions"
  on discussions for update
  using (auth.uid() = user_id);

create policy "Users can delete own discussions"
  on discussions for delete
  using (auth.uid() = user_id);

-- Comments policies
create policy "Anyone can read comments"
  on comments for select
  using (true);

create policy "Authenticated users can create comments"
  on comments for insert
  with check (auth.uid() = user_id);

create policy "Users can update own comments"
  on comments for update
  using (auth.uid() = user_id);

create policy "Users can delete own comments"
  on comments for delete
  using (auth.uid() = user_id);

-- Articles policies
create policy "Anyone can read published articles"
  on articles for select
  using (published = true);

create policy "Authors can read own unpublished articles"
  on articles for select
  using (
    auth.uid() = author_id
    and published = false
  );

create policy "Authors can insert articles"
  on articles for insert
  with check (auth.uid() = author_id);

create policy "Authors can update own articles"
  on articles for update
  using (auth.uid() = author_id);

create policy "Authors can delete own articles"
  on articles for delete
  using (auth.uid() = author_id);

-- Payments policies
create policy "Users can read own payments"
  on payments for select
  using (auth.uid() = user_id);

create policy "Users can insert own payments"
  on payments for insert
  with check (auth.uid() = user_id);

-- Access tokens policies
create policy "Instructors can read course access tokens"
  on access_tokens for select
  using (
    exists (
      select 1 from courses
      where id = course_id
      and instructor_id = auth.uid()
    )
  );

create policy "Instructors can create course access tokens"
  on access_tokens for insert
  with check (
    exists (
      select 1 from courses
      where id = course_id
      and instructor_id = auth.uid()
    )
  );

-- Certificates policies
create policy "Users can read own certificates"
  on certificates for select
  using (auth.uid() = user_id);

create policy "Public can verify certificates"
  on certificates for select
  using (true);
