# Refactor Template

Goal:
- Refactor <area> while preserving behavior.

Scope:
- In scope: <files/modules>.
- Out of scope: <explicit exclusions>.

Constraints:
- No behavior changes unless listed.
- No dependency changes unless justified.
- Keep public exports/routes/data shapes stable.
- Avoid formatting-only churn outside touched files.

Search boundaries:
- Start: `ai/search-boundaries.md`.
- Relevant index: <ui/api/database/testing>.
- Target files: <exact paths>.

Definition of done:
- Refactor complete in scoped files.
- Behavior-preserving checks pass.
- Any changed convention/boundary is reflected in `/ai`.
- Final summary notes what stayed intentionally unchanged.

Testing requirements:
- `cd blog-frontend && npm run lint`.
- `cd blog-frontend && npm run build` for app/server/data refactors.
- Manual route check if UI output can shift.

Risks:
- Client/server import leaks.
- Over-abstracting small local patterns.
- Moving code that App Router or webpack expects by path/name.

Rollback notes:
- Revert scoped files and `/ai` updates together.
