-- User Management Queries

-- Get user profile with role
create or replace function get_user_profile(user_id uuid)
returns json as $$
  select json_build_object(
    'id', u.id,
    'email', u.email,
    'fullName', u.full_name,
    'avatarUrl', u.avatar_url,
    'role', u.role,
    'createdAt', u.created_at
  )
  from users u
  where u.id = user_id;
$$ language sql security definer;

-- Update user role
create or replace function update_user_role(user_id uuid, new_role user_role)
returns void as $$
begin
  update users
  set role = new_role,
      updated_at = now()
  where id = user_id;
end;
$$ language plpgsql security definer;

-- Course Management Queries

-- Get course with instructor details
create or replace function get_course_details(course_id uuid)
returns json as $$
  select json_build_object(
    'id', c.id,
    'title', c.title,
    'description', c.description,
    'price', c.price,
    'category', c.category,
    'difficulty', c.difficulty,
    'thumbnailUrl', c.thumbnail_url,
    'studentCount', c.student_count,
    'instructor', json_build_object(
      'id', u.id,
      'fullName', u.full_name,
      'avatarUrl', u.avatar_url
    ),
    'lessons', (
      select json_agg(json_build_object(
        'id', l.id,
        'title', l.title,
        'description', l.description,
        'videoUrl', l.video_url,
        'duration', l.duration,
        'order', l."order"
      ) order by l."order")
      from lessons l
      where l.course_id = c.id
    )
  )
  from courses c
  join users u on u.id = c.instructor_id
  where c.id = course_id;
$$ language sql security definer;

-- Increment course student count
create or replace function increment_course_student_count(course_id uuid)
returns void as $$
begin
  update courses
  set student_count = student_count + 1,
      updated_at = now()
  where id = course_id;
end;
$$ language plpgsql security definer;

-- Enrollment and Progress Queries

-- Get user's course progress
create or replace function get_user_course_progress(p_user_id uuid, p_course_id uuid)
returns json as $$
  select json_build_object(
    'enrollmentId', e.id,
    'progress', e.progress,
    'status', e.status,
    'lastActiveAt', e.last_active_at,
    'lessonProgress', (
      select json_agg(json_build_object(
        'lessonId', lp.lesson_id,
        'progress', lp.progress,
        'watchTime', lp.watch_time,
        'completed', lp.completed,
        'completedAt', lp.completed_at
      ))
      from lesson_progress lp
      where lp.enrollment_id = e.id
    )
  )
  from enrollments e
  where e.user_id = p_user_id
  and e.course_id = p_course_id;
$$ language sql security definer;

-- Update lesson progress
create or replace function update_lesson_progress(
  p_enrollment_id uuid,
  p_lesson_id uuid,
  p_progress integer,
  p_watch_time integer
)
returns void as $$
declare
  v_completed boolean;
begin
  v_completed := p_progress >= 100;
  
  insert into lesson_progress (
    enrollment_id, lesson_id, progress, watch_time, completed, completed_at
  )
  values (
    p_enrollment_id,
    p_lesson_id,
    p_progress,
    p_watch_time,
    v_completed,
    case when v_completed then now() else null end
  )
  on conflict (enrollment_id, lesson_id)
  do update set
    progress = excluded.progress,
    watch_time = excluded.watch_time,
    completed = excluded.completed,
    completed_at = excluded.completed_at,
    updated_at = now();
    
  -- Update overall course progress
  update enrollments e
  set progress = (
    select avg(lp.progress)::integer
    from lesson_progress lp
    where lp.enrollment_id = e.id
  ),
  status = case
    when (
      select bool_and(lp.completed)
      from lesson_progress lp
      where lp.enrollment_id = e.id
    ) then 'completed'::enrollment_status
    else 'active'::enrollment_status
  end,
  last_active_at = now(),
  updated_at = now()
  where id = p_enrollment_id;
end;
$$ language plpgsql security definer;

-- Discussion and Comments Queries

-- Get course discussions with comments
create or replace function get_course_discussions(course_id uuid)
returns json as $$
  select json_agg(
    json_build_object(
      'id', d.id,
      'title', d.title,
      'content', d.content,
      'createdAt', d.created_at,
      'user', json_build_object(
        'id', u.id,
        'fullName', u.full_name,
        'avatarUrl', u.avatar_url
      ),
      'comments', (
        select json_agg(json_build_object(
          'id', c.id,
          'content', c.content,
          'createdAt', c.created_at,
          'user', json_build_object(
            'id', cu.id,
            'fullName', cu.full_name,
            'avatarUrl', cu.avatar_url
          )
        ) order by c.created_at)
        from comments c
        join users cu on cu.id = c.user_id
        where c.discussion_id = d.id
        and c.parent_id is null
      )
    )
  )
  from discussions d
  join users u on u.id = d.user_id
  where d.course_id = course_id
  group by d.id, d.title, d.content, d.created_at, u.id, u.full_name, u.avatar_url
  order by d.created_at desc;
$$ language sql security definer;

-- Certificate Management Queries

-- Generate certificate
create or replace function generate_certificate(
  p_user_id uuid,
  p_course_id uuid
)
returns uuid as $$
declare
  v_certificate_id uuid;
  v_certificate_number text;
  v_metadata jsonb;
begin
  -- Generate unique certificate number
  v_certificate_number := 'CERT-' || 
    to_char(now(), 'YYYYMMDD') || '-' ||
    substring(md5(random()::text), 1, 6);
    
  -- Build certificate metadata
  select jsonb_build_object(
    'userName', u.full_name,
    'courseName', c.title,
    'instructorName', i.full_name,
    'completionDate', now()
  )
  into v_metadata
  from users u
  cross join courses c
  join users i on i.id = c.instructor_id
  where u.id = p_user_id
  and c.id = p_course_id;
  
  -- Insert certificate
  insert into certificates (
    user_id,
    course_id,
    certificate_number,
    metadata
  )
  values (
    p_user_id,
    p_course_id,
    v_certificate_number,
    v_metadata
  )
  returning id into v_certificate_id;
  
  return v_certificate_id;
end;
$$ language plpgsql security definer;

-- Access Token Management Queries

-- Generate access token
create or replace function generate_access_token(
  p_course_id uuid,
  p_created_by uuid,
  p_expires_in interval default interval '30 days'
)
returns text as $$
declare
  v_token text;
begin
  -- Generate unique token
  v_token := encode(gen_random_bytes(16), 'hex');
  
  -- Insert token
  insert into access_tokens (
    token,
    course_id,
    created_by,
    expires_at
  )
  values (
    v_token,
    p_course_id,
    p_created_by,
    now() + p_expires_in
  );
  
  return v_token;
end;
$$ language plpgsql security definer;

-- Use access token
create or replace function use_access_token(
  p_token text,
  p_user_id uuid
)
returns boolean as $$
declare
  v_course_id uuid;
begin
  -- Get and validate token
  select course_id into v_course_id
  from access_tokens
  where token = p_token
  and used_by is null
  and expires_at > now();
  
  if v_course_id is null then
    return false;
  end if;
  
  -- Mark token as used
  update access_tokens
  set used_by = p_user_id,
      used_at = now()
  where token = p_token;
  
  -- Create enrollment
  insert into enrollments (
    user_id,
    course_id,
    status,
    progress
  )
  values (
    p_user_id,
    v_course_id,
    'active',
    0
  );
  
  -- Increment course student count
  perform increment_course_student_count(v_course_id);
  
  return true;
end;
$$ language plpgsql security definer;

-- Payment Management Queries

-- Create payment record
create or replace function create_payment(
  p_user_id uuid,
  p_course_id uuid,
  p_amount integer,
  p_payment_token text,
  p_payment_url text,
  p_metadata jsonb
)
returns uuid as $$
declare
  v_payment_id uuid;
begin
  insert into payments (
    user_id,
    course_id,
    amount,
    payment_token,
    payment_url,
    metadata
  )
  values (
    p_user_id,
    p_course_id,
    p_amount,
    p_payment_token,
    p_payment_url,
    p_metadata
  )
  returning id into v_payment_id;
  
  return v_payment_id;
end;
$$ language plpgsql security definer;

-- Update payment status
create or replace function update_payment_status(
  p_payment_id uuid,
  p_status payment_status
)
returns void as $$
begin
  update payments
  set status = p_status,
      updated_at = now()
  where id = p_payment_id;
  
  -- If payment is successful, create enrollment
  if p_status = 'success' then
    insert into enrollments (
      user_id,
      course_id,
      status,
      progress
    )
    select
      p.user_id,
      p.course_id,
      'active',
      0
    from payments p
    where p.id = p_payment_id;
    
    -- Increment course student count
    perform increment_course_student_count(
      (select course_id from payments where id = p_payment_id)
    );
  end if;
end;
$$ language plpgsql security definer;
