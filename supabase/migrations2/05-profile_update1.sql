/*
  # Profile Updates Enhancement

  1. Changes
    - Add function to handle partial profile updates
    - Update users table policies
    - Add validation for profile updates

  2. Security
    - Maintain RLS policies
    - Add validation checks
*/

-- Function to handle partial profile updates
create or replace function update_user_profile(
  user_id uuid,
  new_full_name text default null,
  new_avatar_url text default null
)
returns void as $$
begin
  update users
  set
    full_name = coalesce(new_full_name, full_name),
    avatar_url = coalesce(new_avatar_url, avatar_url),
    updated_at = now()
  where id = user_id;
end;
$$ language plpgsql security definer;

-- Update the users table policies
drop policy if exists "Users can update own profile" on users;

create policy "Users can update own profile"
  on users for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and (
      (full_name is null or length(full_name) >= 2)
      and (avatar_url is null or avatar_url ~ '^https?://')
    )
  );
