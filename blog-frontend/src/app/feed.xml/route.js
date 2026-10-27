import { blogService } from "@/core";
import { siteMetadata } from "../../../site.config.mjs";

const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const cdata = (s = "") => `<![CDATA[${String(s).replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;

export async function GET() {
  const blogs = (await blogService.getPublishedBlogs()).filter((b) => !b.series);
  const now = new Date().toUTCString();

  const items = blogs
    .map((blog) => {
      const url = `${siteMetadata.siteUrl}/blogs/${blog.permalink}`;
      return `
    <item>
      <title>${cdata(blog.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(blog.createdAt).toUTCString()}</pubDate>
      <description>${cdata(blog.summary)}</description>
      <author>${siteMetadata.email} (${siteMetadata.author})</author>
      ${blog.tags ? blog.tags.map((t) => `<category>${esc(t.name)}</category>`).join("") : ""}
    </item>`;
    })
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(siteMetadata.title)}</title>
    <link>${siteMetadata.siteUrl}</link>
    <description>${esc(siteMetadata.description)}</description>
    <language>${siteMetadata.language || "en-us"}</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${siteMetadata.siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
