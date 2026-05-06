# Blog Datastore

This directory contains all the static content for the blog. It is designed to be "local-first" and easy to maintain.

## Structure

```text
blog-datastore/
├── blogs/
│   ├── [slug]/
│   │   ├── metadata.json  # Metadata about the post
│   │   └── blog.md       # The actual content in Markdown/MDX
├── tags.json             # Registry of tags and their associated blogs
└── README.md
```

## Adding a New Post

The official way to manage content is using the **Blog CLI** located in the `blog-backend` directory.

```bash
cd ../blog-backend
npm run start create
```

This CLI provides advanced features like image processing, SEO analysis, and cloud synchronization.

## Metadata Schema (`metadata.json`)

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `title` | `string` | Yes | Display title of the post |
| `createdAt` | `string` | Yes | ISO date string for sorting |
| `slug` | `string` | Yes | URL-safe identifier |
| `type` | `string` | Yes | `blog` or `snippet` |
| `summary` | `string` | No | Short excerpt shown on cards |
| `tags` | `array` | No | List of tag objects `{ id, name }` |
| `previewImageSrc` | `string` | No | Path to cover image |

## Tag Management

Tagging is now **fully automatic**. Simply add the tag names to the `tags` array in your `metadata.json`. If the tag name exists in `tags.json`, the post will be automatically indexed under that tag.

> [!NOTE]
> All posts are automatically added to the "all" category.

> [!TIP]
> The build process automatically validates your metadata and warns you if something is missing!
