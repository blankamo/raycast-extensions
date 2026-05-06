# Pinwork Raycast Extension - Architecture Refactor Plan

## Scope
This document captures the current architecture, the verified issues, and the step-by-step refactor plan to reach a more robust, maintainable Raycast extension. It is intended to be a living reference during implementation.

## Current Architecture (Verified)
- Commands are React views in `src/` (`show-today.tsx`, `show-inbox.tsx`, `show-next.tsx`, `search-tasks.tsx`, `show-projects.tsx`, `quick-add.tsx`).
- The bridge layer is `src/api/pinwork.ts`:
  - Reads via `runAppleScript`.
  - Writes via URL scheme `open("pinwork://...")`.
  - App availability check via System Events process lookup.
- UI components in `src/components/` call API functions directly.
- Utilities in `src/utils/` handle dates, icons, preferences.

## Verified Issues
- Legacy delimiter parsing remains as a fallback until the app always returns JSON.
- "Next" view still fetches all tasks, then filters locally (requires app-side support to avoid).
- Write operations are fire-and-forget (toasts now indicate request sent, not confirmed completion).
- Running-state check still relies on System Events (no app API for this yet).

## Target Architecture
- Infrastructure layer: AppleScript runner (with timeout, abort, JSON parsing), URL scheme helper.
- Domain layer: runtime-validated schemas and parsing.
- UI layer: hooks for data access, thin command views.

## Step-by-Step Plan
1. Data Contract and Script Runner
   - Add a `runPinworkScript` helper with:
     - `humanReadableOutput: false`
     - `timeout`
     - optional `AbortSignal`
   - Normalize AppleScript output (quoted strings) safely.
   - Prefer JSON output from the app and parse JSON.
   - Fallback to legacy delimiter parsing for backward compatibility.

2. Runtime Validation
   - Introduce Zod schemas for Task/Project/Tag payloads.
   - Validate parsed JSON and surface errors explicitly.

3. Hooks Layer (useCachedPromise)
   - Implement:
     - `useTodayTasks`
     - `useInboxTasks`
     - `useProjects`
     - `useTaskSearch` (abortable)
     - `usePinworkAvailability`
   - Centralize error handling with `showFailureToast`.

4. UI Refactor
   - Convert command views to use hooks.
   - Remove local `useEffect`/`useState` boilerplate.

5. Write Semantics
   - Keep URL scheme for now, but change toast copy to "Sent to Pinwork".
   - Wire optional optimistic UI updates using `mutate` when feasible.

6. Availability UX
   - Use `getApplications()` to check install status.
   - Use a single running check in `usePinworkAvailability`.
   - Show EmptyView with actions when app is missing or not running.

7. Performance Hardening
   - Replace `getAllTasks()` for "Next" with a targeted API when app support exists.
   - Until then, keep local filtering but encapsulate in a hook.

8. Repo Hygiene
   - Remove `src/.DS_Store`.
   - Remove unused constants.
   - Wire or remove `TaskDetail`.
   - Add `platforms: ["macos"]` to manifest.

## External Dependencies (Requires macOS App Changes)
- Add AppleScript commands that return JSON for tasks/projects/tags/search.
- Optional: add a date-window query for upcoming tasks.

## Definition of Done
- No delimiter parsing in default code path (legacy fallback remains until app JSON is guaranteed).
- All commands use hooks (`useCachedPromise`).
- Search is abortable.
- App availability handled once per command view.
- UI reflects correct success semantics for writes.
- Documentation updated and repo clean.
