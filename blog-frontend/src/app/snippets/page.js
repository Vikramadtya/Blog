import React from "react";
import { getBlogsByType } from "@/lib/server/blog";
import { BLOG_TYPES } from "@/lib/constants";
import ContentGrid from "@/components/molecules/ContentGrid";

import { siteMetadata } from "../../../site.config.mjs";
const { content } = siteMetadata;

export async function generateMetadata() {
  return {
    title: `${content.snippets.title} | ${siteMetadata.title}`,
    description: content.snippets.description,
    alternates: {
      canonical: `${siteMetadata.siteUrl}/snippets`,
    },
  };
}

export default async function Snippets() {
  const snippets = await getBlogsByType(BLOG_TYPES.snippet.type);

  const snippetIdToMetadata = snippets.reduce((acc, data) => {
    acc[data.id] = data;
    return acc;
  }, {});

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": content.snippets.title,
    "description": content.snippets.description,
    "url": `${siteMetadata.siteUrl}/snippets`,
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
        "name": "Snippets",
        "item": `${siteMetadata.siteUrl}/snippets`,
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
          {content.snippets.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          {content.snippets.description}
        </p>

        {/* Snippets Grid */}
        <section className="mx-auto w-full max-w-7xl">
          <ContentGrid
          blogs={snippets}
          blogIdToMetadata={snippetIdToMetadata}
        />
        </section>
      </section>
    </main>
    </>
  );
}
