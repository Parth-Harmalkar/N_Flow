# SPEC.md — Project Specification

> **Status**: `FINALIZED`

## Vision
A premium, production-ready internal platform for employee monitoring and task management. It combines rigorous task tracking and work logging with advanced analytics, risk detection (overlapping entries, duplicate proofs), and AI-driven performance summaries, all wrapped in a "Future Fashion" inspired fluid, glassmorphic UI.

## Goals
1. **Robust Task Management**: End-to-end task lifecycle (creation, assignment, status tracking).
2. **Accountable Work Logging**: Verified daily logs with start/end times and multi-media proof (images/videos).
3. **Advanced Risk & Duplicate Detection**: Rule-based detection of overlapping entries, excessive hours, and duplicate proof uploads (via file hashing).
4. **AI-Enhanced Insights**: ManualAdmin-triggered, OpenAI-powered weekly performance summaries for employees.
5. **State-of-the-Art UX**: A high-end, responsive UI featuring glassmorphism, neumorphism, and fluid layouts inspired by futuristic design aesthetics.

## Non-Goals (Out of Scope)
- **Employee ID Login**: Simplified to Email/Password authentication.
- **Automated AI Summaries**: Manual trigger only.
- **External Notifications**: Push or Email notifications (In-app alerts only).
- **Mobile Native App**: Responsive web only.

## Users
- **Admins**: Manage users, assign tasks, audit logs, view analytics, run risk detection, and generate AI summaries.
- **Employees**: View assigned tasks, submit daily logs with proof, and track personal history.

## Constraints
- **Tech Stack**: Next.js (App Router), Supabase (Auth, DB, Storage), Tailwind CSS, Framer Motion (for fluid UI), OpenAI API.
- **Design**: Must strictly adhere to "Future/Fluid" aesthetic (glassmorphism/neumorphism).
- **Logic**: No simplification of core business rules (Risk/Duplicates/Time validation).

## Success Criteria
- [ ] Successful role-based authentication (Admin/Employee).
- [ ] Task creation and assignment flow fully functional.
- [ ] Log submission with media proof stored in Supabase Storage.
- [ ] Working dashboard with charts (hours, tasks, late logs).
- [ ] Functional duplicate detection via hash comparison.
- [ ] OpenAI-powered weekly summary generation on button click.
