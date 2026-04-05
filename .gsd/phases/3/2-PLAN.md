---
phase: 3
plan: 2
wave: 2
---

# Plan 3.2: Admin Risk Dashboard UI

## Objective
Create a dedicated administrative view to monitor, filter, and resolve flagged work logs.

## Context
- src/app/admin/dashboard/page.tsx
- src/components/layout/Sidebar.tsx

## Tasks

<task type="auto">
  <name>Admin Risk Counter (Badge)</name>
  <files>
    - src/components/layout/Sidebar.tsx
    - src/app/admin/actions/risks.ts
  </files>
  <action>
    Create a server action `getUnresolvedRiskCount`.
    Modify the Sidebar to show a red numeric badge on the "Risks" navigation item.
    Badge must update on dashboard refresh.
  </action>
  <verify>Check Sidebar as admin; badge should match unresolved rows in `risks` table.</verify>
  <done>Sidebar displays numeric badge for unresolved risks.</done>
</task>

<task type="auto">
  <name>Flagged Logs View</name>
  <files>
    - src/app/admin/risks/page.tsx
    - src/components/admin/RiskTable.tsx
  </files>
  <action>
    Create a new page `/admin/risks`.
    List logs with active (unresolved) risks.
    Display: Employee Name, Log Date, Risk Type, Severity.
    Include a "Resolve" button for each risk.
  </action>
  <verify>Login as Admin, navigate to /admin/risks, and see a list of flagged items.</verify>
  <done>Flagged logs are visible and filterable by severity.</done>
</task>

## Success Criteria
- [ ] Admin can see the counts of active risks at a glance.
- [ ] Admin can view detailed risk metadata for a specific log.
- [ ] Resolving a risk removes it from the "Active Risks" list and the sidebar count.
