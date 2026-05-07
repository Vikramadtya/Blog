# Commands

Run from repo root unless noted.

Setup:
- `cd blog-frontend`
- `npm ci` - deterministic install from `package-lock.json`.
- `npm install` - alternative install/update workflow.

Development:
- `cd blog-frontend && npm run dev` - Next dev server.
- `cd blog-frontend && npm run start` - serve production build.

Checks:
- `cd blog-frontend && npm run lint` - `next lint`.
- `cd blog-frontend && npm run build` - `next build`.
- `cd blog-frontend && npm run format` - Prettier write over project.

Content CLI:
- `cd blog-frontend && npm run blog` - interactive local post manager from `scripts/blog-cli.js`.

Tests/typecheck:
- No `npm test` script.
- No typecheck script.
- No `tsconfig.json`; app is JS/JSX with `jsconfig.json`.

Database/Firebase:
- No local DB command or migration script is wired into `package.json`.
- Runtime Firestore REST uses `.env.local` keys from `blog-frontend/.env.example`.
- Collections are defined in `src/lib/server/firebase.js`.

Docker:
- No `Dockerfile` or compose file found.

Useful read-only discovery:
- `rg --files -g '!node_modules/**' -g '!.next/**'`
- `rg "<term>" blog-frontend/src blog-frontend/config blog-frontend/site.config.mjs`
