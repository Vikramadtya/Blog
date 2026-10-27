import { blogService, noteService } from "@/core";
import { siteMetadata } from "../../site.config.mjs";
import { internalBookSlugs } from "@/lib/books";

export default async function sitemap() {
  const base = siteMetadata.siteUrl;
  const blogs = await blogService.getAllPosts();
  const blogUrls = blogs.map((blog) => ({
    url: `${base}/blogs/${blog.permalink}`,
    lastModified: new Date(blog.updatedAt || blog.createdAt),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const routes = ["", "/blogs", "/tags", "/snippets", "/notes"].map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1.0,
  }));

  const bookSlugs = internalBookSlugs;
  const noteUrls = (
    await Promise.all(
      bookSlugs.map(async (bookSlug) => {
        const flat = noteService.flattenTree(await noteService.getNoteTree(bookSlug));
        return flat.map((node) => ({
          url: `${base}/notes/${bookSlug}/${node.path.join("/")}`,
          changeFrequency: "monthly",
          priority: 0.6,
        }));
      }),
    )
  ).flat();

  return [...routes, ...blogUrls, ...noteUrls];
}
