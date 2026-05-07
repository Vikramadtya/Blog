# AI Operating System

Purpose:
- Give future coding agents a compact repo memory.
- Reduce repo-wide scans, repeated discovery, and clarification loops.
- Preserve the actual Next.js/blog architecture while agents work autonomously.
- Keep task prompts small: point agents here first, then to only relevant files.

How to use:
- Start with `ai/agent-rules.md`.
- Read `ai/search-boundaries.md` to avoid broad exploration.
- Read only the relevant index in `ai/indexes/`.
- Use `ai/commands.md` for checks.
- After code changes, update stale `/ai` docs before finishing.

Recommended workflow:
- Create one branch per task: `codex/<short-task>`, `claude/<short-task>`, etc.
- For parallel work, use git worktrees so agents do not share a mutable checkout.
- Search from indexes first, then targeted `rg` in listed folders.
- Make surgical edits, run checks, summarize changed files and assumptions.

Branch/worktree strategy:
- Branch per task from a clean base.
- Worktree pattern: `git worktree add ../Blog-<task> -b codex/<task> main`.
- One agent per worktree; never edit the same file in parallel unless coordinated.
- Merge by PR/review; delete worktrees after merge.

Task files:
- Use `ai/tasks/*-template.md` to define goal, constraints, search boundaries, done criteria, tests, risks, rollback.
- Store active task notes outside application code or in issue/PR text unless the user asks to create files.
- A task is not complete until implementation, checks, and relevant `/ai` doc updates are done.
