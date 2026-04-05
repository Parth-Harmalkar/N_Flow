-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- 1. PROFILES Table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  role text not null check (role in ('admin', 'employee')),
  employee_id text unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies for Profiles
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can update their own profiles."
  on profiles for update
  using ( auth.uid() = id );

-- 2. TASKS Table
create table public.tasks (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  deadline timestamp with time zone not null,
  priority text check (priority in ('low', 'medium', 'high', 'urgent')),
  status text default 'pending' check (status in ('pending', 'in_progress', 'completed', 'overdue')),
  assigned_to uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.tasks enable row level security;

-- Policies for Tasks
create policy "Admins can do everything on tasks."
  on tasks for all
  using ( exists (select 1 from profiles where id = auth.uid() and role = 'admin') );

create policy "Employees can view their assigned tasks."
  on tasks for select
  using ( assigned_to = auth.uid() );

-- 3. LOGS Table
create table public.logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  task_id uuid references public.tasks(id) on delete set null,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone not null,
  description text not null,
  proof_url text,
  file_hash text,
  is_duplicate boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.logs enable row level security;

-- Policies for Logs
create policy "Admins can view all logs."
  on logs for select
  using ( exists (select 1 from profiles where id = auth.uid() and role = 'admin') );

create policy "Employees can manage their own logs."
  on logs for all
  using ( user_id = auth.uid() );

-- 4. NOTIFICATIONS Table
create table public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  message text not null,
  type text not null,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.notifications enable row level security;

-- Policies for Notifications
create policy "Users can view and update their own notifications."
  on notifications for all
  using ( user_id = auth.uid() );

-- 5. FUNCTION & TRIGGER: Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, role, employee_id)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', 'Anonymous'),
    coalesce(new.raw_user_meta_data->>'role', 'employee'),
    coalesce(new.raw_user_meta_data->>'employee_id', null)
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
