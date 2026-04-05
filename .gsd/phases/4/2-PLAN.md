---
phase: 4
plan: 2
wave: 1
---

# Plan 4.2: High-Value Analytics Dashboard

## Objective
Connect real-time data from Supabase to create dynamic visualizations for employee productivity and task completion.

## Context
- .gsd/SPEC.md
- .gsd/phases/4/RESEARCH.md
- frontend/src/lib/analytics.ts

## Tasks

<task type="auto">
  <name>Create Analytics Chart Components</name>
  <files>frontend/src/components/analytics/PerformanceChart.tsx, frontend/src/components/analytics/CompletionRadial.tsx</files>
  <action>
    Develop reusable charting components for the analytics dashboard.
    - `PerformanceChart.tsx`: BarChart for total hours worked per employee.
    - `CompletionRadial.tsx`: Radial chart for aggregate task completion status.
    - Ensure animations and responsive design.
  </action>
  <verify>Check charts render in the browser with sample data.</verify>
  <done>Chart components render correctly and adapt to container size.</done>
</task>

<task type="auto">
  <name>Update Analytics Admin Page</name>
  <files>frontend/src/app/admin/analytics/page.tsx</files>
  <action>
    Implement data fetching for the analytics dashboard using Next.js Server Components.
    - Replace the static "Execution Velocity" and "Mitigation Power" cards with dynamic data.
    - Feed aggregated user data into the PerformanceChart.
  </action>
  <verify>Admin analytics page displays dynamic data from Supabase.</verify>
  <done>Charts show real-time productivity data for employees.</done>
</task>

## Success Criteria
- [ ] Admin can view total hours worked by each employee.
- [ ] Task completion trends are accurately displayed.
