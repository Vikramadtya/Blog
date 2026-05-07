# UI Index

Entry points:
- Root: `blog-frontend/src/app/layout.jsx`.
- Pages: `home/page.jsx`, `blogs/page.js`, `blogs/[slug]/page.js`, `snippets/page.js`, `search/page.jsx`, `tags/page.jsx`, `notes/page.js`, `newsletter/page.jsx`.
- Shell: `src/components/organisms/header/Header.jsx`, `src/components/organisms/footer/Footer.jsx`.

Core components:
- Cards/grids: `src/components/atoms/Card.jsx`, `src/components/molecules/ContentGrid.jsx`, `LatestPost.jsx`, `FeaturedSection.jsx`.
- Blog detail: `BlogHero.jsx`, `StickyBar.jsx`, `TableOfContent.jsx`, `ShareBar.jsx`, `RelatedPosts.jsx`, `MdxComponents.jsx`.
- Search/nav: `Search.jsx`, `CommandPalette.jsx`, `MobileNavMenu.jsx`, `navLinks.js`.
- Metrics: `BlogMetricsProvider.jsx`, `useBlogMetrics.js`, `LikeButton.jsx`, `LikeCount.jsx`, `ViewCount.jsx`.
- Icons: `src/components/atoms/Icon.jsx`, `public/icons/*.svg`.

Styling:
- Global tokens: `src/app/globals.css`.
- Tailwind config: `tailwind.config.js`.
- Class merge: `src/lib/utils.js` or `src/utils/cn.js`.
- UI primitives: Radix wrappers in `DropdownMenu.jsx`, `Tooltip.jsx`, `Separator.jsx`.

Common edit locations:
- New page: add `src/app/<route>/page.jsx`; update `config/nav.json` if navigable.
- New card/list behavior: `Card.jsx`, `ContentGrid.jsx`.
- Blog MDX rendering: `src/app/blogs/[slug]/page.js`, `MdxComponents.jsx`, `markdownConstants.js`.
- Header/nav labels: `config/nav.json`, `utils/navLinks.js`, `Header.jsx`, `MobileNavMenu.jsx`.
- Page copy: `config/content.json`.

Tests/checks:
- `cd blog-frontend && npm run lint`.
- `cd blog-frontend && npm run build` for route/server-component changes.
- Manual responsive check for visual changes.

Debugging notes:
- Add `"use client"` only when using hooks/browser APIs.
- Server pages can call `src/lib/server/blog.js` directly.
- Client components should receive data props or call `src/lib/client/api.js`.

Dangerous areas:
- `Icon.jsx` will crash for unknown `kind`.
- MDX page mixes server rendering with client wrappers; keep imports boundary-aware.
- Do not scan/edit `public/images/` unless assets are part of the task.
