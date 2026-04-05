---
phase: 2
plan: 1
wave: 1
---

# Plan 2.1: App Shell & Role-Based Navigation

## Objective
Create a premium, glassmorphic navigation shell for the application that adapts to the user's role (Admin/Employee).

## Context
- .gsd/SPEC.md
- frontend/src/components/ui/FluidBackground.tsx
- frontend/src/app/globals.css

## Tasks

<task type="auto">
  <name>Create Sidebar Component</name>
  <files>
    - frontend/src/components/layout/Sidebar.tsx
  </files>
  <action>
    Implement a glassmorphic sidebar using Framer Motion for hover/active states.
    - Admin links: Dashboard, Tasks, Employees, Logs, Analytics.
    - Employee links: Dashboard, My Tasks, Submit Log, My History.
    - Include a "Logout" button at the bottom.
    - Use 'Outfit' font and 'Lucide React' icons.
  </action>
  <verify>Check for file existence and Lucide icons imports.</verify>
  <done>Sidebar renders with role-based visibility logic.</done>
</task>

<task type="auto">
  <name>Create Dashboard Layout Wrapper</name>
  <files>
    - frontend/src/components/layout/DashboardLayout.tsx
  </files>
  <action>
    Create a wrapper layout that includes:
    - Sidebar on the left (hidden/hamburger on mobile).
    - Top Navigation Bar (Page Title + User Profile/Role display).
    - Content area with `FluidBackground` and glassmorphic padding.
  </action>
  <verify>Check component structure for Main and Sidebar elements.</verify>
  <done>Layout correctly wraps children and displays the current user's name/role from Supabase session.</done>
</task>

## Success Criteria
- [ ] Sidebar is glassmorphic and responsive.
- [ ] Navigation links correctly reflect the user's role.
- [ ] FluidBackground is visible behind the dashboard content.
