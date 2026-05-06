import React from "react";
import MarkdownContentList from "@/components/molecules/MarkdownContentList";
import { getBlogsByType } from "@/lib/server/blog";
import { BLOG_TYPES } from "@/lib/constants";

import { siteMetadata } from "../../../site.config.mjs";
import content from "../../../config/content.json";

export async function generateMetadata() {
  return {
    title: `${content.blogs.title} | ${siteMetadata.title}`,
    description: content.blogs.description,
    alternates: {
      canonical: `${siteMetadata.siteUrl}/blogs`,
    },
  };
}

export default async function Blog() {
  const blogs = await getBlogsByType(BLOG_TYPES.blog.type);
  const blogIdToMetadata = blogs.reduce((acc, data) => {
    acc[data.id] = data;
    return acc;
  }, {});

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": content.blogs.title,
    "description": content.blogs.description,
    "url": `${siteMetadata.siteUrl}/blogs`,
  };

  const breadcrumbsJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `${siteMetadata.siteUrl}/home`,
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blogs",
        "item": `${siteMetadata.siteUrl}/blogs`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
      <main className="min-h-screen w-full bg-background px-6 pt-20 md:px-12 lg:px-24 xl:px-32">
      {/* Header Section */}
      <section className="mx-auto mb-12 w-full max-w-5xl">
        <h1 className="text-4xl font-bold tracking-tight text-primary dark:text-white sm:text-5xl md:text-6xl">
          {content.blogs.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          {content.blogs.description}
        </p>
        {/* Blog Grid */}
        <section className="mx-auto w-full max-w-7xl">
          <MarkdownContentList
            blogs={blogs}
            blogIdToMetadata={blogIdToMetadata}
          />
        </section>
      </section>
    </main>
    </>
  );
}
