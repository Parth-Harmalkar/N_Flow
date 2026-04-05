# Phase 4 Research - Analytics & AI Integration

## Overview
Phase 4 focuses on visual data representation (Analytics) and AI-assisted performance evaluation (OpenAI). The goal is to provide Admins with high-level oversight of employee efficiency and automated summaries.

## Key Research Outcomes

### 1. Visualization Strategy (Charts)
- **Library Selection**: **Recharts**.
  - **Pros**: Declarative, handles responsive layouts well, integrates seamlessly with Next.js (Client Components).
  - **Cons**: Requires standard React Client Component wrappers.
- **Key Charts**:
  - **Bar Chart**: Total hours worked per employee (REQ-07).
  - **Pie/Radial Chart**: Task completion status (REQ-08).
  - **Line Chart**: Log submission volume over time (REQ-09).

### 2. OpenAI Performance Summaries (AI)
- **Integration**: **OpenAI Node SDK v4**.
- **Model**: `gpt-4o-mini` (cost-effective and efficient for text summaries).
- **Prompt Strategy**: 
  - Input: JSON dump of user's logs and tasks for the week.
  - Output: Structured Markdown with:
    - Overall Efficiency Rating.
    - Key Achievements.
    - Potential Risks/Bottlenecks.
    - Recommendations.
- **Trigger**: Server Action `generatePerformanceSummary(userId)`.

### 3. Data Fetching & Analytics Logic
- **Hours Calculation**: 
  - `sum(EXTRACT(EPOCH FROM (end_time - start_time)) / 3600.0)` in PostgreSQL.
- **Late Logs**:
  - Definition: `logs.created_at - logs.end_time > interval '24 hours'`.
- **Performance**:
  - Use a dedicated `analytics` utility to aggregate data server-side before passing to charts.

### 4. Implementation Constraints
- **Client Components**: Charts MUST be in `'use client'` files.
- **API Keys**: OpenAI Key must be stored in `.env.local` and accessed via `process.env.OPEN_AI_KEY`.

## Decision Summary
- **Primary Viz Library**: Recharts.
- **AI Model**: GPT-4o-mini.
- **State Management**: React Server Components (RSC) for data loading, Server Actions for AI triggers.
- **UI Elements**: 
  - New "Strategic Analytics" section in Admin.
  - "Generate AI Insight" button on Employee profiles.
  - Premium glassmorphic containers for all charts.
