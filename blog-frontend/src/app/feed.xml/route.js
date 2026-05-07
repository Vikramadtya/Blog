import { getAllBlogs } from "@/lib/server/blog";
import { siteMetadata } from "../../../site.config.mjs";

export async function GET() {
  const blogs = await getAllBlogs();
  const now = new Date().toUTCString();

  const items = blogs
    .map((blog) => {
      const url = `${siteMetadata.siteUrl}/blogs/${blog.slug}`;
      return `
    <item>
      <title><![CDATA[${blog.title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(blog.createdAt).toUTCString()}</pubDate>
      <description><![CDATA[${blog.summary}]]></description>
      <author>${siteMetadata.email} (${siteMetadata.author})</author>
      ${blog.tags ? blog.tags.map(t => `<category>${t.name}</category>`).join("") : ""}
    </item>`;
    })
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteMetadata.title}</title>
    <link>${siteMetadata.siteUrl}</link>
    <description>${siteMetadata.description}</description>
    <language>${siteMetadata.language || "en-us"}</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${siteMetadata.siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
