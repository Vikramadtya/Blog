# Bugfix Template

Goal:
- Fix <bug> without changing unrelated behavior.

Observed behavior:
- <symptom, route, error, reproduction>

Expected behavior:
- <correct behavior>

Constraints:
- Start with the narrowest failing path.
- Use targeted `rg`; stop when root cause is found.
- Avoid opportunistic refactors.
- Preserve public API/data shapes unless bug requires change.

Search boundaries:
- Start: `ai/search-boundaries.md`.
- Relevant indexes: <auth/api/ui/database/testing>.
- Suspect files: <exact paths>.

Definition of done:
- Root cause identified.
- Minimal fix implemented.
- Regression path verified.
- Relevant `/ai` stale notes corrected.

Testing requirements:
- Run check closest to failure.
- Default: `cd blog-frontend && npm run lint`.
- Add `cd blog-frontend && npm run build` for build/server/content bugs.
- Manual repro: <steps>.

Risks:
- Masking errors with broad catches.
- Breaking static rendering or metrics counting.
- Editing content IDs/slugs/tags unnecessarily.

Rollback notes:
- Revert changed code/docs for this bug only.
