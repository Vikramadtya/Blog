import React, { Suspense } from "react";
import { getAllBlogs } from "@/lib/server/blog";
import Search from "@/components/molecules/Search";
import { siteMetadata } from "../../../site.config.mjs";

export async function generateMetadata() {
  return {
    title: `Search Blogs | ${siteMetadata.title}`,
    description: "Search across all blog posts, snippets, and topics.",
  };
}

export default async function SearchPage() {
  const blogs = await getAllBlogs();

  return (
    <main className="relative z-10 flex min-h-screen flex-col">
      <div className="container mx-auto max-w-6xl px-6 pt-32 md:px-10 lg:px-16">
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight md:text-6xl">
            Search <span className="text-indigo-500">Everything</span>
          </h1>
          <p className="mx-auto max-w-xl text-lg text-muted-foreground">
            Find the technical deep dives, snippets, and chronicles you&apos;re looking for.
          </p>
        </div>

        <Suspense fallback={<div className="text-center py-20 text-muted-foreground">Loading Search...</div>}>
          <Search blogs={blogs} />
        </Suspense>
      </div>
    </main>
  );
}
