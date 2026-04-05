---
phase: 2
plan: 2
wave: 2
---

# Plan 2.2: Admin Task Management

## Objective
Implement a workspace for Admins to manage the task lifecycle, including creation, assignment, and status tracking.

## Context
- .gsd/SPEC.md
- frontend/src/utils/supabase/server.ts
- frontend/src/app/admin/tasks/page.tsx

## Tasks

<task type="auto">
  <name>Create Admin Task Actions</name>
  <files>
    - frontend/src/app/admin/actions/tasks.ts
  </files>
  <action>
    Implement Server Actions for:
    - Create Task (with title, description, priority, deadline).
    - Assign Task (linking to an employee profile).
    - Update Task Status.
    - Delete Task.
    - Fetch all tasks for Admin view.
  </action>
  <verify>Check for Supabase database operations (insert/update).</verify>
  <done>Actions correctly update the 'tasks' table in Supabase.</done>
</task>

<task type="auto">
  <name>Admin Tasks Dashboard Page</name>
  <files>
    - frontend/src/app/admin/tasks/page.tsx
    - frontend/src/components/admin/CreateTaskModal.tsx
  </files>
  <action>
    - Build a table-style task list with filtering by priority/status.
    - "Add Task" button launches a modal.
    - Task creation form with user-selector dropdown (admins choose assignees).
    - Error handling for invalid deadlines or missing fields.
  </action>
  <verify>Check UI rendering and form submission logic.</verify>
  <done>Tasks can be created and assigned to employees via the Admin UI.</done>
</task>

## Success Criteria
- [ ] Admin can view the list of all tasks.
- [ ] Admin can create a new task and assign it to an employee.
- [ ] Deadlines are validated to be in the future.
- [ ] UI is glassmorphic and styled with Lucide icons.
