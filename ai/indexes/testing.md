# Testing Index

Current state:
- No test framework configured.
- No `npm test` script.
- No typecheck script.
- No TS source or `tsconfig.json`.

Available checks:
- `cd blog-frontend && npm run lint`
- `cd blog-frontend && npm run build`

When to run:
- Docs-only changes: verify `/ai` structure and paths; app checks optional unless docs changed commands.
- UI/page/component changes: lint, build, manual browser inspection.
- API/server/data changes: lint, build, manual route check when behavior changes.
- Content/frontmatter changes: build.

Manual checks:
- Dev server: `cd blog-frontend && npm run dev`.
- Key routes: `/home`, `/blogs`, `/blogs/<slug>`, `/search`, `/tags`, `/newsletter`.
- API: `/api/blog/data?id=<id>`, POST `/api/blog/data`, POST `/api/blog/notify`.

Debugging notes:
- `next lint` is the configured lint command.
- Build may read all local markdown posts and expose frontmatter issues.
- Firebase-dependent runtime behavior needs env keys and manual route/browser testing.

Dangerous areas:
- Do not add a new test stack casually; align with user request.
- Do not claim automated tests passed beyond lint/build.
