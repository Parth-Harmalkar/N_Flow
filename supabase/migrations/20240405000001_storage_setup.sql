-- 1. Create logs bucket
insert into storage.buckets (id, name, public)
values ('logs', 'logs', false)
on conflict (id) do nothing;

-- 2. Storage Policies

-- Allow authenticated users to upload their own logs
create policy "Authenticated users can upload logs"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'logs' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow users to view their own uploaded logs
create policy "Users can view own logs"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'logs' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow admins to view all logs
create policy "Admins can view all logs"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'logs' AND
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );
