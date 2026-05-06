import { getAllBlogs } from "@/lib/server/blog";
import { siteMetadata } from "../../site.config.mjs";

export default async function sitemap() {
  const blogs = await getAllBlogs();
  const blogUrls = blogs.map((blog) => ({
    url: `${siteMetadata.siteUrl}/blogs/${blog.slug}`,
    lastModified: new Date(blog.updatedAt || blog.createdAt),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const routes = ["", "/blogs", "/tags", "/snippets", "/notes"].map((route) => ({
    url: `${siteMetadata.siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1.0,
  }));

  return [...routes, ...blogUrls];
}
