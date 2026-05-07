# API Index

Routes:
- `blog-frontend/src/app/api/blog/data/route.js`
  - `GET ?id=<blogId>` returns live Firestore metadata.
  - `POST { id, field }` increments `likes` or `views`.
- `blog-frontend/src/app/api/blog/notify/route.js`
  - `POST { email }` validates and stores subscription.
- `blog-frontend/src/app/feed.xml/route.js`
  - `GET` returns RSS XML from local posts.

Related services:
- `src/lib/server/blog.js` - domain facade, validation, Slack notification, dynamic metadata.
- `src/lib/server/firebase.js` - Firestore REST helpers and collection constants.
- `src/lib/server/api-utils.js` - `successResponse`, `errorResponse`, `logger`.
- `src/lib/server/errors.js` - `AppError`, `ErrorCode`.
- `src/lib/constants.js` - `VALID_INCREMENT_FIELDS`.
- `src/lib/client/api.js` - browser client for routes.

Common edit locations:
- Add API route: `src/app/api/<domain>/<name>/route.js`.
- Add response/error behavior: `src/lib/server/api-utils.js`.
- Add Firebase collection/helper: `src/lib/server/firebase.js`.
- Add browser call: `src/lib/client/api.js`.

Response convention:
- Success: `{ success: true, data }`.
- Error: `{ success: false, message, error?, code? }`.

Tests/checks:
- `cd blog-frontend && npm run lint`.
- `cd blog-frontend && npm run build` for route/config changes.
- Manual: call local route with dev server for POST/GET behavior.

Debugging notes:
- `data/route.js` is node runtime and force dynamic.
- Firebase disabled returns `null` for dynamic metadata.
- `notify` can still log/send Slack when Firebase is disabled.

Dangerous areas:
- `next.config.mjs` CORS applies to all `/api/:path*`.
- Do not expose server env/secrets to client code.
- Keep client API calls in `src/lib/client/api.js`.
