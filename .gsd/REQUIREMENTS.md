# REQUIREMENTS.md

## Functional Requirements

| ID | Requirement | Source | Status |
|----|-------------|--------|--------|
| REQ-01 | Email/Password Auth (Supabase) | SPEC Goal 1 | Pending |
| REQ-02 | Role-Based Access Control (Admin/Employee) | SPEC Goal 1 | Pending |
| REQ-03 | Admin Task Creation (title, desc, deadline, priority, assigned_to) | SPEC Goal 1 | Pending |
| REQ-04 | Employee view assigned tasks (filtered by status) | SPEC Goal 1 | Pending |
| REQ-05 | Work log submission (start/end time, description) | SPEC Goal 2 | Pending |
| REQ-06 | Multi-media proof upload (Supabase Storage) | SPEC Goal 2 | Pending |
| REQ-07 | Analytics: Total hours worked per employee (Chart) | SPEC Goal 4 | Pending |
| REQ-08 | Analytics: Task completion rate (Chart) | SPEC Goal 4 | Pending |
| REQ-09 | Analytics: Late submission & log count (Table/Chart) | SPEC Goal 4 | Pending |
| REQ-10 | Risk: Overlapping time entry detection | SPEC Goal 3 | Pending |
| REQ-11 | Risk: Work duration check (> 12 hrs) | SPEC Goal 3 | Pending |
| REQ-12 | Duplicate: File hash comparison for proof uploads | SPEC Goal 3 | Pending |
| REQ-13 | AI: Admin-triggered weekly performance summary (OpenAI) | SPEC Goal 4 | Pending |
| REQ-14 | UI: Persistent Future Fashion / Fluid Glassmorphic Design | SPEC Goal 5 | Pending |
| REQ-15 | UI: Dashboard with Cards & Tables (Responsive) | SPEC Goal 5 | Pending |
| REQ-16 | Notifications: In-app alerts for late logs and deadlines | SPEC Goal 5 | Pending |

## Non-Functional Requirements

- **Performance**: SSR with Next.js for fast initial load.
- **Security**: Supabase RLS (Row Level Security) on all tables.
- **Scalability**: Scalable Postgres on Supabase.
- **Aesthetics**: Premium modern design using Framer Motion.
