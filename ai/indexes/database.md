# Database/Content Index

Primary datastore:
- `blog-frontend/blog-datastore/blogs/*.md` - one markdown file per slug.
- `blog-frontend/blog-datastore/blogs/tags.json` - tag registry.
- There is no local DB server.

Server files:
- `src/lib/server/local-datastore.js` - filesystem reads, cache, slug/tag/id indexes.
- `src/lib/server/blog.js` - facade plus Firestore dynamic metadata/subscriptions.
- `src/lib/server/firebase.js` - Firestore REST reads/writes.
- `src/lib/constants.js` - cache TTL, blog types, metric fields.

Entry points:
- Lists: `getAllBlogs()`, `getBlogsByType(type)`, `getBlogsByTagId(tagId)`.
- Detail: `getBlogBySlug(slug)`, `getBlogContent(id)`, `getBlogMetadataById(id)`.
- Tags: `getAllTags()`, `getTagById(id)`, `getTagToBlogMap(tags)`.
- Dynamic metrics: `getDynamicMetadataById(id)`, `incrementMetadataField(id, field)`.
- Subscriptions: `addSubscription(email)`.

Firestore:
- Collections: `blogs-metadata`, `subscriptions`.
- Env gate: `siteMetadata.firebaseEnabled`.
- REST helpers unwrap Firestore typed values manually; nested maps are shallow.

Common edit locations:
- Content normalization: `local-datastore.js normalize()`.
- New content type: `src/lib/constants.js`, datastore filters, list pages.
- Metrics fields: `VALID_INCREMENT_FIELDS`, `firebase.js`, API route, client hook.
- CLI content operations: `scripts/blog-cli.js`.

Tests/checks:
- `cd blog-frontend && npm run build` catches content/frontmatter/read errors.
- `cd blog-frontend && npm run lint`.

Debugging notes:
- `getAllBlogs()` must warm indexes before slug/tag/id lookups.
- Production hides `publish: false`; development includes drafts.
- Tags in frontmatter are names; hydrated objects come from `tags.json`.

Dangerous areas:
- Do not change existing `id` values; Firestore docs and tag lists depend on them.
- Slug controls filename and `/blogs/<slug>` route.
- `blog-datastore/README.md` is stale about old folder-per-post layout; trust actual `.md` files.
