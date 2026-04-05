# Implementation Plan — Phase 2: Core Task & Log Management

Phase 2 builds the core business logic of the platform. We will implement the dual-dashboard system for Admins and Employees, enabling task assignment and performance tracking with media-verified work logs.

## User Review Required

> [!IMPORTANT]
> **Dashboard Navigation**: I will implement a persistent glassmorphic sidebar for both roles. Please confirm if you have any specific requirements for the sidebar items (currently: Dashboard, Tasks, Logs, Analytics).
> **Storage Strategy**: Based on research, I will implement **Direct Client-Side Upload** for proof images/videos to avoid Next.js payload limits, but the database record will be created via **Server Actions**.
> **Employee ID**: As requested, we will not use `employee_id` for login, but I will display it in the Employee Profile/Sidebar for reference.

## Proposed Changes

### 1. Layout & Shell (Wave 1)

#### [NEW] [DashboardLayout.tsx](file:///d:/Newrro/N_Flow/frontend/src/components/layout/DashboardLayout.tsx)
- Reusable shell containing the glassmorphic Sidebar and Title bar.
- Uses `FluidBackground` as the foundation.

#### [NEW] [Sidebar.tsx](file:///d:/Newrro/N_Flow/frontend/src/components/layout/Sidebar.tsx)
- Glassmorphic navigation component.
- Conditional links based on user role (Admin/Employee).

---

### 2. Admin Task Management (Wave 2)

#### [NEW] [admin/tasks/page.tsx](file:///d:/Newrro/N_Flow/frontend/src/app/admin/tasks/page.tsx)
- Table view of all tasks with status and assignee.
- "Create Task" button opening a glassmorphic sidebar/modal.

#### [NEW] [tasks.ts](file:///d:/Newrro/N_Flow/frontend/src/app/admin/actions/tasks.ts)
- Server action to create/assign tasks in the database.

---

### 3. Employee Log Submission (Wave 3)

#### [NEW] [employee/tasks/page.tsx](file:///d:/Newrro/N_Flow/frontend/src/app/employee/tasks/page.tsx)
- Kanban or list view of "My Assigned Tasks".

#### [NEW] [logs/page.tsx](file:///d:/Newrro/N_Flow/frontend/src/app/employee/logs/page.tsx)
- Daily work log submission form.
- Multi-media proof upload integrated with Supabase Storage (`logs` bucket).
- Logic to prevent log submission for dates in the future.

---

### 4. Database & Storage Setup (Wave 4)

#### [MODIFY] [init_schema.sql](file:///d:/Newrro/N_Flow/supabase/migrations/20240405000000_init_schema.sql)
- Add RLS policies for Supabase Storage if not already present.
- Ensure `logs` bucket creation script is documented.

---

## Open Questions

> [!CAUTION]
> **Storage Bucket Creation**: I cannot create the Supabase Storage bucket via SQL alone (it usually requires CLI or Dashboard). I will provide the instructions/scripts to initialize it.
> **Proof Media Types**: Should we limit proof uploads to specific formats (e.g., JPEG/PNG for images, MP4 for video)? I'll default to standard web formats.

## Verification Plan

### Automated Tests
- `npm run build` in `frontend/` to ensure path consistency and type safety.
- Verify RLS policies using `supabase-js` mock tests where possible.

### Manual Verification
- Login as Admin -> Create Task -> Assign to Employee.
- Login as Employee -> View Task -> Submit Log with Image Proof.
- Verify file exists in Supabase Storage dashboard.
