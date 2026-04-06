-- Alter Attendance Table to include timing information
alter table public.attendance 
add column if not exists login_time timestamp with time zone,
add column if not exists logout_time timestamp with time zone,
add column if not exists total_hours numeric(10, 2);

-- Update RLS Policies for Attendance
create policy "Users can update their own attendance timing."
  on public.attendance for update
  using ( user_id = auth.uid() );
