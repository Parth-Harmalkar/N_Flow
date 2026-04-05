---
phase: 4
plan: 1
wave: 1
---

# Plan 4.1: Foundation & Analytics Logic

## Objective
Establish the technical foundation for Phase 4 by installing necessary dependencies and implementing the core data aggregation logic for employee performance.

## Context
- .gsd/SPEC.md
- .gsd/phases/4/RESEARCH.md
- supabase/migrations/20240405000000_init_schema.sql

## Tasks

<task type="auto">
  <name>Install dependencies</name>
  <files>frontend/package.json</files>
  <action>
    Run `npm install recharts openai` in the frontend directory.
  </action>
  <verify>Check package.json for the new dependencies.</verify>
  <done>recharts and openai are successfully installed.</done>
</task>

<task type="auto">
  <name>Implement Analytics Library</name>
  <files>frontend/src/lib/analytics.ts</files>
  <action>
    Create a utility library to fetch and aggregate performance data from Supabase.
    - `getPerformanceMetrics()`: Fetch aggregated hours and task counts.
    - `getEmployeeDetailMetrics(userId)`: Fetch weekly log history and task status for a specific user.
  </action>
  <verify>Unit test or console log check for data structure.</verify>
  <done>lib/analytics.ts exists and returns expected data structures.</done>
</task>

## Success Criteria
- [ ] Dependencies installed without conflicts.
- [ ] Analytics utility correctly aggregates hours from the `logs` table.
