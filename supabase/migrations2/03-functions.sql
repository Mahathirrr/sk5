/*
  # Database Functions

  1. User Management
    - Handle user creation/updates
    - Role management functions

  2. Course Management
    - Update course statistics
    - Handle enrollment status changes

  3. Progress Tracking
    - Calculate and update progress
    - Handle lesson completion
*/

-- Function to handle new user creation
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into users (id, email, full_name, avatar_url, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'student')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Function to update course statistics
create or replace function update_course_stats()
returns trigger as $$
begin
  -- Update student count
  update courses
  set student_count = (
    select count(distinct user_id)
    from enrollments
    where course_id = new.course_id
    and status != 'cancelled'
  )
  where id = new.course_id;
  
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for course stats update
create trigger on_enrollment_change
  after insert or update or delete on enrollments
  for each row execute procedure update_course_stats();

-- Function to calculate lesson progress
create or replace function calculate_lesson_progress(
  p_enrollment_id uuid,
  p_lesson_id uuid
)
returns integer as $$
declare
  v_progress integer;
begin
  select progress into v_progress
  from lesson_progress
  where enrollment_id = p_enrollment_id
  and lesson_id = p_lesson_id;

  return coalesce(v_progress, 0);
end;
$$ language plpgsql security definer;

-- Function to update course progress
create or replace function update_course_progress(
  p_enrollment_id uuid
)
returns void as $$
declare
  v_total_lessons integer;
  v_completed_lessons integer;
  v_progress integer;
begin
  -- Get total lessons
  select count(*) into v_total_lessons
  from lessons l
  join enrollments e on e.course_id = l.course_id
  where e.id = p_enrollment_id;

  -- Get completed lessons
  select count(*) into v_completed_lessons
  from lesson_progress lp
  where lp.enrollment_id = p_enrollment_id
  and lp.completed = true;

  -- Calculate progress percentage
  if v_total_lessons > 0 then
    v_progress := (v_completed_lessons * 100) / v_total_lessons;
  else
    v_progress := 0;
  end if;

  -- Update enrollment progress
  update enrollments
  set progress = v_progress,
      status = case
        when v_progress = 100 then 'completed'::enrollment_status
        else status
      end
  where id = p_enrollment_id;
end;
$$ language plpgsql security definer;

-- Trigger function for lesson progress updates
create or replace function handle_lesson_progress_update()
returns trigger as $$
begin
  -- Update course progress when lesson progress changes
  perform update_course_progress(new.enrollment_id);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for lesson progress updates
create trigger on_lesson_progress_update
  after insert or update on lesson_progress
  for each row execute procedure handle_lesson_progress_update();
