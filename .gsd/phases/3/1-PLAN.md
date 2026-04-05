---
phase: 3
plan: 1
wave: 1
---

# Plan 3.1: Risk Detection Engine (Database & Logic)

## Objective
Implement the foundational risk tracking table and the server-side detection logic to identify duplicate hashes, time overlaps, and excessive hours.

## Context
- .gsd/SPEC.md
- src/app/employee/actions/logs.ts

## Tasks

<task type="auto">
  <name>Database Schema Update</name>
  <files>
    - supabase/migrations/20240405000002_risks_schema.sql
  </files>
  <action>
    Create a `risks` table with:
    - `log_id` references `logs`
    - `type` (duplicate_hash, time_overlap, excessive_hours)
    - `severity` (low, medium, high)
    - `is_resolved` boolean
    - `metadata` jsonb
    Enable RLS: Admins have full access, Employees have READ access to their own log's risks.
  </action>
  <verify>Run `supabase db push` or verify in SQL Editor.</verify>
  <done>Record in `risks` table can be manually inserted and queried by admin.</done>
</task>

<task type="auto">
  <name>Implement Detection Engine</name>
  <files>
    - src/app/employee/actions/logs.ts
  </files>
  <action>
    Enhance `submitWorkLog` action:
    1. Create a `detectRisks` helper.
    2. Logic:
       - **Duplicate Check**: Query `logs` for identical `file_hash` NOT from the current log.
       - **Overlap Check**: Query user's logs for any where `new_start < existing_end AND new_end > existing_start`.
       - **Hours Check**: If `duration > 12h`, flag as `excessive_hours`.
    3. On detection, insert an entrance into the `risks` table with metadata.
  </action>
  <verify>Submit a log that overlaps with an existing one and check the `risks` table.</verify>
  <done>New logs with suspicious data successfully trigger `risks` row creation.</done>
</task>

## Success Criteria
- [ ] Overlapping logs are flagged as `time_overlap`.
- [ ] Duplicate file uploads are flagged as `duplicate_hash`.
- [ ] Logs >12h are flagged as `excessive_hours`.
