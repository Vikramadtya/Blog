# Refactor Prompt

Use this repo's AI docs first.

Refactor:
- Area: <module/files>
- Goal: <why>
- Behavior changes allowed: <none/list>

Workflow:
1. Create branch/worktree for this refactor.
2. Read `ai/agent-rules.md`, `ai/search-boundaries.md`, and relevant `ai/indexes/*`.
3. Define tight scope before editing.
4. Preserve routes, exports, response shapes, content IDs/slugs, and visual behavior unless specified.
5. Prefer local helpers/patterns over new abstractions.
6. Run `cd blog-frontend && npm run lint`; run `npm run build` for app/server/data changes.
7. Update `/ai` docs if conventions, ownership, or boundaries changed.
8. Summarize scope, preserved behavior, checks, assumptions.

Relevant index:
- <ui/api/database/testing>

Target files:
- <exact paths>
