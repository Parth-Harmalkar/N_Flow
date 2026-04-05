# Implementation Plan — Employee Monitoring & Task Management System

Build a high-end, production-ready internal platform using Next.js, Supabase, Tailwind CSS, and OpenAI. The project features role-based access, task lifecycle management, daily-verified work logs, risk detection, and AI-generated performance summaries, all with a futuristic, glassmorphic UI.

## User Review Required

> [!IMPORTANT]
> **Authentication**: Email/Password only. No Employee ID login as per the latest decision.
> **AI Trigger**: Weekly summaries are manually triggered by Admins via a button.
> **File Hashing**: Duplicate detection will use a basic file hashing strategy (SHA-256) on upload.
> **UI Aesthetic**: We will use **Framer Motion** extensively to achieve the "fluid" and "flowy" paths seen in the inspiration image. This will involve custom SVG paths and transition-heavy layouts.

## Proposed Changes

### 1. Database & Supabase (Backend)
Setup the core schema and storage on Supabase.

#### [NEW] `supabase/migrations/20240405000000_init_schema.sql`
- **Tables**:
  - `profiles`: `id` (references auth.users), `name`, `role` (admin/employee), `employee_id`.
  - `tasks`: `id`, `title`, `description`, `deadline`, `priority`, `status`, `assigned_to`.
  - `logs`: `id`, `user_id`, `task_id`, `start_time`, `end_time`, `description`, `proof_url`, `file_hash`, `is_duplicate`.
  - `notifications`: `id`, `user_id`, `message`, `type` (deadline/missing_log), `is_read`.
- **Policies (RLS)**:
  - Admins: CRUD on everything.
  - Employees: Read assigned tasks, CRUD their own logs, read their own profile/notifications.
- **Storage**: `proofs` bucket with RLS for authenticated uploads.

---

### 2. Frontend Foundation & UI (Design System)
Implement the "Future Fashion" inspired theme.

#### [NEW] `src/styles/globals.css`
- Custom Tailwind tokens for glassmorphism (`backdrop-blur`, semi-transparent borders).
- Gradient definitions for fluidity.

#### [NEW] `src/components/ui/FluidBackground.tsx`
- Animated SVG blobs and paths using Framer Motion to create the "flowy" background effect.

#### [NEW] `src/components/ui/GlassCard.tsx`
- Reusable "Glassmorphic" card component with borders and shadow effects.

---

### 3. Core Features Implementation

#### [NEW] `src/app/login/page.tsx`
- Form for email/password auth.

#### [NEW] `src/app/admin/dashboard/page.tsx`
- Stats overview (Total hours, tasks completed, late logs).
- "Generate Weekly Summary" button (triggers OpenAI API).
- Risk detection warnings (Overlaps, >12h, Duplicates).

#### [NEW] `src/app/employee/dashboard/page.tsx`
- Personal task list and history view.
- Log submission form with file upload and hashing.

#### [NEW] `src/app/api/ai/summarize/route.ts`
- Edge Function/Route to handle OpenAI requests for log summarization.

#### [NEW] `src/lib/hashing.ts`
- Client-side SHA-256 implementation to hash files before/during upload.

---

## Open Questions

> [!WARNING]
> **OpenAI API Key**: User will need to provide their own OpenAI API key in `.env.local`.
> **Hashing Efficiency**: For very large video files, client-side hashing might be slow. Should we limit hashing to the first X MB for speed, or perform a full hash? (Recommendation: Full hash for accurate duplicate detection).

## Verification Plan

### Automated Tests
- `npm run build` to ensure type safety and SSR readiness.
- Manual verification of Supabase RLS policies via SQL CLI.

### Manual Verification
- Test login with Admin/Employee roles.
- Create a task as Admin, verify visibility for Employee.
- Submit a log as Employee, check storage for proof file.
- Try uploading the same file twice, check for `is_duplicate` flag.
- Trigger AI Weekly Summary from Admin dashboard and verify result.
- Verify "Fluid" UI transitions on different screen sizes.
