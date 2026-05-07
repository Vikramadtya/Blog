# Auth Index

Status:
- No first-party auth system.
- No login pages, sessions, cookies, middleware, or protected routes.

Important files:
- `blog-frontend/src/components/atoms/Comment.jsx` - Giscus comments; GitHub auth happens externally.
- `blog-frontend/site.config.mjs` - `giscus` defaults and `firebaseEnabled` env gate.
- `blog-frontend/config/site.json` - Giscus repo/category/theme config.
- `blog-frontend/.env.example` - Firebase and Slack env names.

Entry points:
- Blog comments: rendered in `src/app/blogs/[slug]/page.js` via `Comments`.
- Firebase REST: server-only helpers in `src/lib/server/firebase.js`.

Common edit locations:
- Comment behavior/theme: `Comment.jsx`, `config/site.json`, `site.config.mjs`.
- Env-gated Firebase behavior: `site.config.mjs`, `src/lib/server/blog.js`.

Tests/checks:
- `cd blog-frontend && npm run lint`.
- For comment UI, run dev server and open a blog page.

Debugging notes:
- If comments disappear, check `siteMetadata.features.giscus`, `config/site.json.giscus`, and theme values.
- If Firebase calls return `null`, check `FIREBASE_CONFIG_API_KEY`, `FIREBASE_CONFIG_PROJECT_ID`, `FIREBASE_CONFIG_APP_ID`.

Dangerous areas:
- Do not add client imports from `src/lib/server/firebase.js`.
- Do not put secrets in `config/site.json`; use `.env.local`.
