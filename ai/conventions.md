# Conventions

Language/modules:
- App code is JS/JSX ESM (`"type": "module"`).
- No TS source, no `tsconfig.json`, no typecheck script.
- Use `@/*` imports for `src/*`; config imports often use relative paths to `site.config.mjs`.

Naming:
- React component files: PascalCase `.jsx` (`Card.jsx`, `BlogHero.jsx`).
- Route files follow App Router names: `page.js(x)`, `route.js`, `layout.jsx`.
- Hooks: `use*.js` in `src/hooks/`.
- Server utilities use kebab/lowercase (`api-utils.js`, `local-datastore.js`).
- Legacy duplicate: `src/lib/server/ApiUtils.js` imports missing `./Errors`; prefer `api-utils.js`.

Component structure:
- Server components by default in `src/app/**`.
- Client components start with `"use client"` before imports.
- UI folders are practical, not strict: `atoms`, `molecules`, `organisms`.
- Shared wrappers for Radix live in `atoms/DropdownMenu.jsx`, `atoms/Tooltip.jsx`, `atoms/Separator.jsx`.
- Use `Icon` with `kind` mapped to `public/icons/*.svg` before adding inline SVG.

API patterns:
- Route handlers return `successResponse(data)` or `errorResponse(message, error, status)`.
- API JSON shape: success `{ success: true, data }`; failure `{ success: false, message, error?, code? }`.
- Runtime API routes set `dynamic = "force-dynamic"` and `runtime = "nodejs"`.
- Browser API calls go through `src/lib/client/api.js`.

Validation:
- Manual validation in route handlers and service helpers.
- Email validation: `validateEmail()` in `src/lib/server/blog.js`.
- Increment fields: `VALID_INCREMENT_FIELDS` in `src/lib/constants.js`.
- No Joi/Zod/schema validation in current app.

Async/error handling:
- Server data functions are async and log with `logger` from `api-utils.js`.
- Domain errors use `AppError`/`ErrorCode` from `src/lib/server/errors.js`.
- Firebase REST helpers log and return `null` for some read failures; write failures throw.
- Pages use `Promise.all` for independent fetches.
- Client `fetcher()` has an abort timeout and one GET retry.

Styling:
- Tailwind utility classes dominate.
- Theme tokens live in `src/app/globals.css`; Tailwind maps HSL CSS vars in `tailwind.config.js`.
- Class merge helper exists in both `src/lib/utils.js` and `src/utils/cn.js`; reuse existing import style near touched code.
- Dark mode uses `.dark` and `next-themes`.
- Prettier uses `prettier-plugin-tailwindcss`.

Content:
- Blog posts are one `.md` file per slug in `blog-datastore/blogs/`.
- Tags in post frontmatter are names; datastore hydrates them from `tags.json`.
- Keep `id` stable; slug controls filename and route.
- `scripts/blog-cli.js` can create/publish/sync local posts interactively.

Testing:
- No tests are present.
- Current verification is `npm run lint` and `npm run build` from `blog-frontend/`.
- For risky UI work, manually inspect with local dev server/browser.

Import organization:
- Existing files loosely group React/Next imports, local components, then config/utils.
- Avoid churn from reordering unrelated imports.
- Do not introduce new path aliases.
