---
phase: 4
plan: 3
wave: 1
---

# Plan 4.3: AI Performance Summaries

## Objective
Enable automatedAI-driven performance reports for employees, accessible as a manual trigger for Admins.

## Context
- .gsd/SPEC.md
- .gsd/phases/4/RESEARCH.md
- openai sdk documentation

## Tasks

<task type="auto">
  <name>Implement AI Performance Server Action</name>
  <files>frontend/src/app/admin/actions/ai-actions.ts</files>
  <action>
    Create a new server action `generatePerformanceSummary(userId)`.
    - Fetch logs and tasks for the last 7 days.
    - Format data for OpenAI.
    - Send request to GPT-4o-mini and return the markdown result.
  </action>
  <verify>Log the AI summary output for an example user.</verify>
  <done>AI Action returns structured markdown content.</done>
</task>

<task type="auto">
  <name>UI for AI Summaries</name>
  <files>frontend/src/app/admin/employees/[id]/page.tsx</files>
  <action>
    Add an "AI Analysis" section to the employee details page.
    - Button to trigger the summary generation.
    - Markdown renderer for the AI output.
    - Glassmorphic container for the AI insights.
  </action>
  <verify>Ensure the "AI Analysis" section displays and triggers for a logged-in admin.</verify>
  <done>Admins can view AI-generated insights on an employee profile.</done>
</task>

## Success Criteria
- [ ] Successful result from OpenAI for a mock user.
- [ ] Summary displays correctly in the dashboard interface.
