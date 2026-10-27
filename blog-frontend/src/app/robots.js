import { siteMetadata } from "../../site.config.mjs";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/"],
    },
    sitemap: `${siteMetadata.siteUrl}/sitemap.xml`,
  };
}
