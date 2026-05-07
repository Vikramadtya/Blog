# Feature Prompt

Use this repo's AI docs first.

Task:
- Implement: <feature>
- Success: <observable outcome>
- Constraints: <must/never>

Workflow:
1. Create branch/worktree for this task.
2. Read `ai/agent-rules.md`, `ai/search-boundaries.md`, and relevant `ai/indexes/*`.
3. Search only inside listed boundaries; stop once context is sufficient.
4. Implement with existing patterns and minimal files.
5. Run `cd blog-frontend && npm run lint`; run `npm run build` if app/data/rendering changed.
6. Update relevant `/ai` docs if boundaries, commands, conventions, architecture, or workflows changed.
7. Summarize code changes, AI doc changes, checks, assumptions.

Relevant index:
- <auth/api/ui/database/testing>

Known files:
- <exact paths>
