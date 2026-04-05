---
phase: 2
plan: 3
wave: 3
---

# Plan 2.3: Employee Log Submission & Storage

## Objective
Enable employees to view their assigned tasks and submit daily work logs with multi-media proof (images/videos) stored in Supabase.

## Context
- .gsd/SPEC.md
- frontend/src/utils/supabase/client.ts
- Supabase Storage Documentation

## Tasks

<task type="auto">
  <name>Setup logs Storage Bucket</name>
  <files>
    - supabase/migrations/20240405000000_init_schema.sql
  </files>
  <action>
    Add a manual check/script to ensure the 'logs' bucket is created in Supabase Storage.
    - Set bucket to non-public (authenticated only).
    - Add RLS policies:
        - `Allow authenticated users to upload to logs/`
        - `Allow owners to read their own logs/`
        - `Allow admins to read all logs/`
  </action>
  <verify>Check SQL for storage policy definitions.</verify>
  <done>Storage policies are defined in migrations.</done>
</task>

<task type="auto">
  <name>Employee Log Form Component</name>
  <files>
    - frontend/src/app/employee/logs/page.tsx
    - frontend/src/components/employee/LogForm.tsx
  </files>
  <action>
    - Create a form to select a task, enter start/end times, and description.
    - Implement file input for proof (limit to images/videos).
    - Logic for direct client-side upload to Supabase Storage.
    - On success, insert a row into the 'logs' table with 'proof_url'.
  </action>
  <verify>Check for client-side storage upload and database record creation logic.</verify>
  <done>Employees can successfully submit logs with verified proof.</done>
</task>

<task type="auto">
  <name>Employee My Tasks Dashboard Page</name>
  <files>
    - frontend/src/app/employee/dashboard/page.tsx
    - frontend/src/app/employee/tasks/page.tsx
  </files>
  <action>
    - Build a "My Tasks" view for employees to see assigned items.
    - Status badges (Pending, In Progress, Completed).
    - Redirect to Log form with pre-selected task ID.
  </action>
  <verify>Check task filtering by assignee_id.</verify>
  <done>Employees only see their own assigned tasks.</done>
</task>

## Success Criteria
- [ ] Employees can view their assigned tasks.
- [ ] Employees can submit a daily work log for an assigned task.
- [ ] Media proof is successfully uploaded to Supabase Storage.
- [ ] Logs are correctly linked to both user_id and task_id.
- [ ] Future-dated logs are blocked by validation.
