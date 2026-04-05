# Phase 3 Research - Risk & Duplicate Detection Logic

## Overview
Phase 3 requires the implementation of the "Antigravity" engine — the logic that detects anomalies, duplicates, and risks in work logs. We've evaluated two approaches: purely database-side (triggers) and server action-side (Next.js).

## Key Research Outcomes

### 1. Duplicate Detection (SHA-256)
- **Method**: Every log has a `file_hash` (generated client-side).
- **Trigger**: When inserting into `logs`, the system checks for existing identical `file_hash` in the last 30 days.
- **Action**: If match found, flag as `is_duplicate = true`.

### 2. Time Overlap Anomaly
- **The PostgreSQL `OVERLAPS` Operator**:
  ```sql
  SELECT * FROM logs
  WHERE user_id = :user_id 
  AND (start_time, end_time) OVERLAPS (:new_start, :new_end);
  ```
- **Thresholds**: 
  - Overlap > 5 minutes is a **Medium Risk**.
  - Total daily hours > 14h is a **Medium Risk**.
  - Duplicate proof hash is a **High Risk**.

### 3. Risk Data Model
A dedicated `risks` table is recommended to support multiple flags per log without cluttering the `logs` table with multiple boolean columns.

#### Proposed Table: `public.risks`
- `id`: UUID (Primary Key)
- `log_id`: UUID (Foreign Key to `logs`)
- `type`: Enum (`duplicate_hash`, `time_overlap`, `excessive_hours`, `late_submission`)
- `severity`: Enum (`low`, `medium`, `high`)
- `is_resolved`: Boolean (Admin manual resolution)
- `metadata`: JSONB (Stores specific overlap times, etc.)
- `created_at`: timestamptz

### 4. Detection Engine Implementation
- **Timing**: Detection should happen **immediately** after log submission via Next.js Server Actions.
- **Notifications**: On successful detection of a risk, insert a notification for **Admins** only.

## Decision Summary
- **Implementation Strategy**: Server Action-based detection (for flexibility) + SQL constraints (for data integrity).
- **UI Elements**: 
  - Risk badges in Admin Dashboard listing.
  - Alert banner for employees if their log is flagged (low friction).
  - Admin Resolution Panel.
