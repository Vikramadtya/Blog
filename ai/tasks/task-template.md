# Task Template

Goal:
- <one-sentence outcome>

Requirements:
- <required behavior>
- <required files/routes if known>

Constraints:
- Read `ai/agent-rules.md` first.
- Keep edits surgical and architecture-consistent.
- Do not touch unrelated code.
- Update `/ai` docs if architecture, commands, boundaries, conventions, or workflows change.

Search boundaries:
- Start: `ai/search-boundaries.md`.
- Indexes: <auth/api/ui/database/testing>.
- Target files: <exact paths>.

Definition of done:
- Implementation complete.
- Relevant lint/build/manual checks complete or explicitly blocked.
- Relevant `/ai` docs updated or confirmed unchanged.
- Final summary lists changes, checks, assumptions.

Testing requirements:
- Default: `cd blog-frontend && npm run lint`.
- Add `cd blog-frontend && npm run build` for app/data/rendering changes.
- Manual check: <route/API/user flow>.

Risks:
- <client/server boundary, data IDs, UI regression, env behavior>

Rollback notes:
- Revert touched files only.
- Restore prior config/data values if changed.
