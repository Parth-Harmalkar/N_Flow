# Implementation Plan — Project Structure Cleanup & Organization

The current project structure is cluttered with stray dependency folders and build artifacts, causing git to track over 10,000 changes. This plan will organize the codebase into a clean `frontend` directory and fix the Git configuration.

## User Review Required

> [!IMPORTANT]
> **Structural Change**: All Next.js files (pages, components, styles, config) will be moved into a new `frontend/` directory.
> **Git Reset**: I will update the `.gitignore` to properly ignore `node_modules` and then perform a git reset on the index to remove the tracked dependency files.
> **Backend Location**: The `supabase/` folder will remain in the root (standard for monorepos or simplified projects), or I can move it to a `backend/` folder if you prefer. (Currently keeping it in root as per initial plan).

## Proposed Changes

### 1. Re-organization

#### [NEW] `frontend/`
- Move `src/`, `public/`, `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`, `eslint.config.mjs` into this directory.

#### [CLEANUP] Root Directory
- Delete all stray dependency folders (e.g., `emoji-regex`, `nanoid`, `damerau-levenshtein`, etc.) that were accidentally moved to the root.
- Remove the root `node_modules/` and `.next/` folders.

---

### 2. Git Configuration & Cleanup

#### [MODIFY] [.gitignore](file:///d:/Newrro/N_Flow/.gitignore)
- Add entries for:
  - `**/node_modules/`
  - `**/.next/`
  - `**/.DS_Store`
  - `dist/`
  - `build/`
- Ensure it covers both the root and the `frontend/` subdirectory.

---

### 3. Restoration

#### [EXECUTE] `npm install` in `frontend/`
- Re-run dependency installation inside the correct project folder.

---

## Open Questions

> [!WARNING]
> **Supabase CLI**: Do you use a local Supabase CLI? If so, the `supabase/` folder location is important for its `init` command. I'll keep it in the root for now.

## Verification Plan

### Automated Verification
- Verify `git status` shows a manageable number of changes (ideally < 100 for a fresh project).
- Run `npm run build` inside the `frontend/` directory to ensure path imports are still correct.

### Manual Verification
- Confirm the `frontend/` folder contains only the necessary source and config files.
- Ensure the root directory is clean of "junk" folders.
