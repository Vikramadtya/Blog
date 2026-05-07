# Feature Template

Goal:
- Add <feature> for <user/outcome>.

Requirements:
- UI/API/data behavior:
- Config/content changes:
- Backward compatibility:

Constraints:
- Create a branch/worktree for the feature.
- Read `ai/agent-rules.md`, `ai/search-boundaries.md`, then relevant indexes.
- Prefer existing components/services before new abstractions.
- Avoid new dependencies unless necessary.

Search boundaries:
- UI: `ai/indexes/ui.md` if user-facing.
- API: `ai/indexes/api.md` if route/client calls change.
- Data: `ai/indexes/database.md` if blog/frontmatter/Firebase changes.
- Auth: `ai/indexes/auth.md` if comments/env-gated access changes.

Definition of done:
- Feature works through the intended route/component/API.
- Existing behavior remains compatible.
- Checks run: lint; build if route/server/data changes.
- `/ai` docs updated for new routes, commands, conventions, data flow, or search boundaries.

Testing requirements:
- Automated: `cd blog-frontend && npm run lint`.
- Build: `cd blog-frontend && npm run build` when relevant.
- Manual: verify <route/flow> in browser or route call.

Risks:
- Breaking static build by importing client-only code into server pages.
- Adding unknown `Icon` kinds without updating `Icon.jsx`.
- Changing blog IDs/slugs/tags incorrectly.

Rollback notes:
- Revert feature files and matching `/ai` doc edits.
