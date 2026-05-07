# Agent Rules

Start:
- Create a new branch per task unless user forbids git changes.
- Prefer git worktrees for parallel tasks.
- Read this file first, then `ai/search-boundaries.md`, then the relevant `ai/indexes/*`.
- Do not repo-scan before checking indexes.

Autonomy:
- Work autonomously once the task is clear.
- Avoid clarification unless blocked by missing info that cannot be safely inferred.
- If questions are unavoidable, batch them in one short message.
- Make reasonable assumptions and record them in the final summary.

Search/token discipline:
- Use targeted `rg`/file reads inside documented boundaries.
- Stop searching once enough context is found.
- Avoid broad `find`/tree dumps, full file dumps, and giant outputs.
- Prefer opening the exact files named in indexes.
- Exclude `node_modules/`, `.next/`, `public/images/`, and unrelated markdown content unless needed.

Implementation:
- Preserve architecture consistency.
- Prefer existing patterns, utilities, components, and helpers.
- Avoid unnecessary dependencies.
- Avoid opportunistic refactors unrelated to the task.
- Make surgical edits; never rewrite unrelated code.
- Do not move files or rename public APIs without a direct requirement.
- Keep client/server boundaries: client code must not import `src/lib/server/*`.
- Reuse `successResponse`/`errorResponse`, `AppError`, `VALID_INCREMENT_FIELDS`, `cn`, `Icon`, and existing Radix wrappers where applicable.

Parallel workflows:
- One task, one branch, one worktree.
- Do not let multiple agents edit the same file without coordination.
- Merge by small PRs; summarize conflict-prone files.
- Keep `/ai` docs synchronized in the same branch as code changes.

Verification:
- Run the smallest useful checks before completion.
- Default checks: `cd blog-frontend && npm run lint`; run `npm run build` for app/data/rendering changes.
- If no relevant automated check exists, state that and provide manual verification performed.
- Do not claim tests passed if the repo has no test script.

Docs maintenance:
- After every implementation, decide whether `/ai` docs changed.
- Update relevant docs when architecture, commands, dependencies, conventions, routes, data flow, risky files, or repo structure changes.
- Keep docs concise; surgically edit stale lines.
- A task is incomplete until implementation, checks, and relevant `/ai` updates are done.

Final response:
- Keep concise.
- Include code changes, `/ai` docs updated, checks run, assumptions.
- Summarize diffs by file/path, not with full file contents.
