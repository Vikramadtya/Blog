# blog-datastore

All content lives here as plain markdown so it can be edited in **any** markdown editor (Obsidian,
VS Code, Typora, GitHub's web editor…) and is rendered by the site from the same files.

```
blog-datastore/
├── blogs/                  one file per post, frontmatter + markdown
│   └── tags.json           tag names/colours (kept in sync by the admin UI)
├── notes/
│   └── <book>/             one folder per book (slug = folder name, see config/notes.json)
│       ├── <note>.md
│       └── <section>/…     sub-folders become sections in the sidebar and contents page
└── images/                 every image, shared by blogs and notes
```

## Images: one rule that works everywhere

Reference images with a **relative path** from the markdown file to the image:

```md
![Waterfall trace](../images/waterfall-trace.svg)            <!-- from blogs/post.md -->
![Namespace](../../images/dns-namespace.png)                 <!-- from notes/system-design/DNS.md -->
```

- Editors resolve the path against the file, so previews work while you write.
- The site rewrites relative image paths to `/media/<path>` at render time and serves the file
  straight out of this folder. Nothing needs copying into `blog-frontend/public`.
- Spaces and parentheses in file names must be URL-encoded (`my%20pic%20%281%29.png`); the admin
  uploader does this for you.

**Adding an image**

- In the site's admin editor (`npm run dev`, then "Edit this note"): drag, drop, paste, or use
  *Insert image*. The file is saved to `images/` and the correct relative link is inserted.
- In another editor: drop the file into `images/` and link to it as above. Any folder inside the
  datastore works, so images next to a note (`./pics/a.png`) are fine too.

Allowed types: png, jpg, gif, webp, avif, svg. Only images inside this folder are served.

### Legacy paths

Older notes used `/notes-assets/…` and `/uploads/…`, which only work on the site (the files live in
`blog-frontend/public`). They still render, and `node scripts/migrate-images.mjs [--write]`
(run from `blog-frontend`) converts them to relative links. Images that are missing from
`public/` stay broken until the original file is restored.

## Grouping notes into sections

Loose notes in a book can be grouped without moving files by listing their URL paths in
`blog-frontend/config/note-sections.json`. `About.md` / `index.md` files are not listed in navigation.

## Ordering

Inside a book, files sort by leading number (`1. Intro.md`), then by name; folders come after files.
