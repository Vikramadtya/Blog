# Bugfix Prompt

Use this repo's AI docs first.

Bug:
- Symptom: <what happens>
- Expected: <what should happen>
- Repro: <steps/route/log>

Workflow:
1. Create branch/worktree for this bug.
2. Read `ai/agent-rules.md`, `ai/search-boundaries.md`, and relevant `ai/indexes/*`.
3. Trace the narrow failing path with targeted `rg`.
4. Fix root cause with surgical edits; avoid unrelated refactors.
5. Verify repro and run relevant checks.
6. Update `/ai` docs if stale info caused or hid the bug.
7. Summarize root cause, fix, checks, assumptions.

Relevant index:
- <auth/api/ui/database/testing>

Suspect files:
- <exact paths>
