-- 1. Create Risks Table
create table public.risks (
  id uuid default uuid_generate_v4() primary key,
  log_id uuid references public.logs(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null check (type in ('duplicate_hash', 'time_overlap', 'excessive_hours')),
  severity text not null check (severity in ('low', 'medium', 'high')),
  is_resolved boolean default false,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable RLS
alter table public.risks enable row level security;

-- 3. RLS Policies
create policy "Admins can manage all risks."
  on public.risks for all
  using ( exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') );

create policy "Employees can view their own log's risks."
  on public.risks for select
  to authenticated
  using ( user_id = auth.uid() );

-- 4. Helper Indexes
create index idx_risks_log_id on public.risks(log_id);
create index idx_risks_unresolved on public.risks(is_resolved) where is_resolved = false;
