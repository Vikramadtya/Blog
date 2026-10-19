import React from "react";
import { blogService } from "@/core";
import { siteMetadata } from "../../../site.config.mjs";
import { buildBlogIndexData } from "@/lib/blogCategories";
import BlogExplorerSidebar from "@/presentation/blog/BlogExplorerSidebar";
import BlogIndexHero from "@/presentation/blog/BlogIndexHero";
import BlogCategorizedView from "@/presentation/blog/BlogCategorizedView";

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
  // In development, show all posts (including drafts with Draft badges); in prod, show published
  const allPosts = isDev
    ? await blogService.getAllPosts({ includeUnpublished: true })
    : await blogService.getPublishedBlogs();

  const {
    categories,
    totalPosts,
    totalSeries,
  } = buildBlogIndexData(allPosts);

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
        item: `${siteMetadata.siteUrl}/home`,
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

      <div className="blog-page-layout">
        {/* Left: Code-Editor File Tree Explorer */}
        <BlogExplorerSidebar categories={categories} />

        {/* Main: Hero + Terminal Filter Chips + Categorized Series Grid */}
        <main className="blog-index min-w-0">
          <BlogIndexHero
            totalPosts={totalPosts}
            totalSeries={totalSeries}
            totalCategories={categories.length}
          />

          <BlogCategorizedView categories={categories} />
        </main>
      </div>
    </>
  );
}
