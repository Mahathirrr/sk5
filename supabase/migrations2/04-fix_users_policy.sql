/*
  # Fix Users Table RLS Policy
  
  Add policy to allow new user creation from auth.users trigger
*/

-- Drop existing policies if any
drop policy if exists "Users can read own profile" on users;
drop policy if exists "Users can update own profile" on users;
drop policy if exists "Public can read basic user info" on users;

-- Recreate policies including insert permission
create policy "Enable insert for authentication trigger"
  on users for insert
  with check (true);  -- Allow insert from trigger

create policy "Users can read own profile"
  on users for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on users for update
  using (auth.uid() = id);

create policy "Public can read basic user info"
  on users for select
  using (true);
