import React from "react";
import ContentGrid from "@/presentation/ui/ContentGrid";
import { blogService } from "@/core";

import { siteMetadata } from "../../../site.config.mjs";
const { content } = siteMetadata;

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
  const isDev = process.env.NODE_ENV === "development";
  const allBlogs = isDev
    ? await blogService.getAllPosts({ includeUnpublished: true })
    : await blogService.getPublishedBlogs();

  // Only show top-level posts. Sub-pages (those with a `series` field pointing
  // to another post's slug) are shown inside the parent series page, not here.
  const blogs = allBlogs.filter((b) => !b.series).map((p) => p.toSummary());

  // Build a set of slugs that have children (i.e. are a series parent)
  const seriesParentSlugs = new Set(
    allBlogs.filter((b) => b.series).map((b) => b.series)
  );

  const blogIdToMetadata = blogs.reduce((acc, data) => {
    acc[data.id] = data;
    return acc;
  }, {});

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: content.blogs.title,
    description: content.blogs.description,
    url: `${siteMetadata.siteUrl}/blogs`,
  };

  const breadcrumbsJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${siteMetadata.siteUrl}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blogs",
        item: `${siteMetadata.siteUrl}/blogs`,
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
      <main className="min-h-screen w-full bg-background px-6 pt-16 md:px-12 lg:px-24 xl:px-32">
        {/* Header Section with Editorial & Terminal Aesthetic */}
        <section className="mx-auto mb-12 w-full max-w-5xl border-b border-dashed border-border pb-8">
          <p className="mb-2 text-xs font-mono text-muted-foreground">
            <span className="text-primary font-semibold">$ cd ~/blog</span>
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground">
            {content.blogs.title || "Notes from the lab."}
          </h1>
          <p className="mt-3 text-lg leading-relaxed text-muted-foreground font-sans max-w-3xl">
            {content.blogs.description}
          </p>
          <p className="mt-4 text-xs font-mono text-muted-foreground">
            [{blogs.length} posts
            {seriesParentSlugs.size > 0 && ` · ${seriesParentSlugs.size} series`}]
          </p>
        </section>

        {/* Blog Grid */}
        <section className="mx-auto w-full max-w-7xl">
          <ContentGrid
            blogs={blogs}
            blogIdToMetadata={blogIdToMetadata}
            seriesParentSlugs={seriesParentSlugs}
          />
        </section>
      </main>
    </>
  );
}
