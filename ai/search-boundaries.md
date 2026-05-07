# Search Boundaries

Authentication:
- Important: no first-party auth/middleware/session layer.
- Files: `src/components/atoms/Comment.jsx`, `site.config.mjs`, `config/site.json`.
- Entry points: Giscus comments, Firebase env-gated server REST.
- Avoid: searching for auth frameworks; none exist.

APIs:
- Folders: `blog-frontend/src/app/api/`, `blog-frontend/src/app/feed.xml/`.
- Files: `api/blog/data/route.js`, `api/blog/notify/route.js`, `feed.xml/route.js`.
- Services: `src/lib/server/blog.js`, `src/lib/server/firebase.js`, `src/lib/server/api-utils.js`, `src/lib/constants.js`.
- Dangerous: `next.config.mjs` CORS affects all `/api/:path*`.
- Avoid: scanning components for route logic unless debugging caller UI.

Database/content:
- Folders: `blog-frontend/blog-datastore/blogs/`, `blog-frontend/src/lib/server/`.
- Files: `local-datastore.js`, `blog.js`, `firebase.js`, `constants.js`, `tags.json`.
- Entry points: `getAllBlogs`, `getBlogBySlug`, `getBlogContent`, `getDynamicMetadataById`, `incrementMetadataField`.
- Dangerous: stable frontmatter `id`; slug/filename coupling; `tags.json` IDs/counts/blog lists.
- Avoid: `.DS_Store`, unrelated post bodies unless content bug is specific.

UI:
- Folders: `src/app/`, `src/components/`, `src/hooks/`, `public/icons/`.
- Entry points: `layout.jsx`, route `page.*`, `Header.jsx`, `Footer.jsx`, `Card.jsx`, `ContentGrid.jsx`, `Search.jsx`, `BlogHero.jsx`.
- Dangerous: client/server boundary, MDX rendering in `src/app/blogs/[slug]/page.js`, `Icon.jsx` SVG map.
- Avoid: `public/images/` unless image paths are involved.

Middleware:
- No `middleware.js` found.
- Avoid searching for request guards unless adding a new middleware feature.

Realtime/runtime metrics:
- Files: `src/hooks/useBlogMetrics.js`, `src/components/providers/BlogMetricsProvider.jsx`, `src/lib/client/api.js`, `src/app/api/blog/data/route.js`.
- Storage: `localStorage liked_posts`, `sessionStorage viewed_posts`.
- Dangerous: double-counting views, optimistic like rollback, Firestore disabled behavior.
- Avoid: treating metrics as build-time data.

Shared utilities:
- Files: `src/lib/utils.js`, `src/utils/cn.js`, `src/utils/readingTime.js`, `src/utils/navLinks.js`, `src/utils/markdownConstants.js`.
- Dangerous: duplicate `cn` helpers; reuse local import style.
- Avoid: creating new utility modules before checking these.

Tests:
- No test folders/framework.
- Use `npm run lint` and `npm run build`.
- Avoid inventing a test stack unless task asks for it.

Configuration:
- Files: `package.json`, `next.config.mjs`, `tailwind.config.js`, `jsconfig.json`, `mdx.config.mjs`, `.eslintrc.json`, `.prettierrc`, `.env.example`.
- Content config: `config/site.json`, `config/content.json`, `config/nav.json`, `config/notes.json`.
- Dangerous: `site.config.mjs` feature flags/env checks; `output: "standalone"`; SVGR webpack rule.
- Avoid: editing `.env.local` or secrets.
