import React from "react";
import { getAllTags } from "@/lib/server/blog";
import Link from "next/link";
import Icon from "@/components/atoms/Icon";
import { siteMetadata } from "../../../site.config.mjs";

export async function generateMetadata() {
  return {
    title: `Explore Tags | ${siteMetadata.title}`,
    description: "Browse all topics and categories covered in our blog.",
    alternates: {
      canonical: `${siteMetadata.siteUrl}/tags`,
    },
  };
}

export default async function TagsPage() {
  const tags = await getAllTags();
  
  // Sort tags by count
  const sortedTags = [...tags].sort((a, b) => b.count - a.count);

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Explore Tags",
    "description": "Browse all topics and categories covered in our blog.",
    "url": `${siteMetadata.siteUrl}/tags`,
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
        "name": "Tags",
        "item": `${siteMetadata.siteUrl}/tags`,
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
      <main className="relative z-10 flex min-h-screen flex-col">
      <div className="container mx-auto max-w-4xl px-6 pt-32 md:px-10 lg:px-16">
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight md:text-6xl">
            Topics & <span className="text-indigo-500">Categories</span>
          </h1>
          <p className="mx-auto max-w-xl text-lg text-muted-foreground">
            Explore the different topics I write about, from deep dives into Linux to quick snippets and visualizers.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {sortedTags.map((tag) => (
            <Link
              key={tag.id}
              href={`/search?tag=${tag.name}`} // Use tag name for easier search matching
              className="group relative flex items-center space-x-3 rounded-2xl border border-border bg-background px-6 py-4 transition-all hover:border-indigo-500 hover:shadow-lg active:scale-95"
              style={{ "--tag-color": tag.color }}
            >
              <div 
                className="h-3 w-3 rounded-full" 
                style={{ backgroundColor: tag.color }}
              />
              <span className="text-lg font-semibold capitalize">{tag.name}</span>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-bold text-secondary-foreground group-hover:bg-indigo-500 group-hover:text-white">
                {tag.count}
              </span>
            </Link>
          ))}
        </div>

        {tags.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">
             <Icon kind="tag" className="mx-auto h-12 w-12 opacity-20" />
             <p className="mt-4">No topics found yet.</p>
          </div>
        )}
      </div>
      </main>
    </>
  );
}
