# Architecture

Repo shape:
- `blog-frontend/`: only runnable app.
- `blog-frontend/src/app/`: Next.js 14 App Router pages/routes.
- `blog-frontend/src/components/`: UI by atomic-ish folders: `atoms/`, `molecules/`, `organisms/`, `providers/`, `utils/`.
- `blog-frontend/src/lib/server/`: server data/business/API helpers.
- `blog-frontend/src/lib/client/api.js`: browser API wrapper for runtime interactions.
- `blog-frontend/src/hooks/useBlogMetrics.js`: client metrics state.
- `blog-frontend/blog-datastore/blogs/`: local markdown posts plus `tags.json`.
- `blog-frontend/config/*.json` + `blog-frontend/site.config.mjs`: site/content/nav config.
- `blog-frontend/public/`: SVG icons, images, logos, sounds.

Major layers:
- Config: `site.config.mjs` imports `config/site.json` and `config/content.json`; exposes `siteMetadata`.
- Static content: `src/lib/server/local-datastore.js` reads `blog-datastore/blogs/*.md` with `gray-matter`.
- Server facade: `src/lib/server/blog.js` re-exports local datastore functions and owns dynamic metadata/subscription logic.
- Pages: `src/app/**/page.js(x)` fetch server data directly and render static-first UI.
- Client runtime: client components call `src/lib/client/api.js`; metrics flow through `useBlogMetrics`.

Service boundaries:
- Local datastore only touches filesystem and in-memory indexes/cache.
- Firebase REST code stays in `src/lib/server/firebase.js`; no Firebase SDK usage in app code.
- API response helpers and logging stay in `src/lib/server/api-utils.js`.
- Client code should not import from `src/lib/server/*`.
- UI components should receive hydrated blog objects; avoid filesystem/Firebase calls inside components.

Auth flow:
- No first-party auth, sessions, cookies, middleware, login, or protected routes.
- Giscus comments use GitHub auth externally in `src/components/atoms/Comment.jsx`.
- Firebase access is env-key based server REST; see `.env.example`.

API structure:
- `src/app/api/blog/data/route.js`
  - `GET /api/blog/data?id=<blogId>`: live likes/views from Firestore.
  - `POST /api/blog/data`: `{ id, field }`, where `field` is in `VALID_INCREMENT_FIELDS`.
  - `dynamic = "force-dynamic"`, `runtime = "nodejs"`.
- `src/app/api/blog/notify/route.js`
  - `POST /api/blog/notify`: validates email, stores subscription, optional Slack notification.
- `src/app/feed.xml/route.js`: RSS XML from local blogs.
- `next.config.mjs`: CORS headers for `/api/:path*`, root redirect `/ -> /home`, SVG via SVGR.

Database/content access:
- Primary source: local markdown files in `blog-datastore/blogs/*.md`.
- Frontmatter includes `id`, `slug`, `type`, `publish`, `tags`, `previewImageSrc`, `readingTime`, dates.
- `tags.json` stores tag objects with `{ id, name, color, count, blogs }`.
- `local-datastore.js` builds `slugIndex`, `tagIndex`, `idToFilename`; cache TTL from `src/lib/constants.js`.
- Production filters out `publish: false`; development shows drafts.
- Firestore REST collections in `src/lib/server/firebase.js`: `blogs-metadata`, `subscriptions`.

State management:
- Server components fetch static data directly.
- Client local state: `useState`, `useMemo`, `useEffect`.
- Metrics context: `src/components/providers/BlogMetricsProvider.jsx`.
- Like persistence: `localStorage` key `liked_posts`.
- View persistence: `sessionStorage` key `viewed_posts`.
- Theme: `next-themes` via `src/components/utils/ThemeProvider.jsx`.
- No Redux/Zustand/global store.

Important decisions:
- JavaScript/JSX only; `jsconfig.json` provides `@/* -> src/*`.
- Static-first pages; runtime APIs only for metrics/subscriptions/RSS.
- MDX rendering in `src/app/blogs/[slug]/page.js` with `next-mdx-remote/rsc`, `rehype-slug`, `rehype-pretty-code`.
- Styling is Tailwind plus CSS variables in `src/app/globals.css`.
- Icons are imported SVGs through `src/components/atoms/Icon.jsx`.
- No test framework or typecheck script is configured.
