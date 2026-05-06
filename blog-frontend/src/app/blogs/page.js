import React from "react";
import MarkDownContentList from "../../components/molecules/markDownContentList";
import { BLOG_TYPES, getBlogsByType } from "../../services/serverDataService";

export default async function Blog() {
  const blogs = await getBlogsByType(BLOG_TYPES.blog.type);
  const blogIdToMetadata = blogs.reduce((acc, data) => {
    acc[data.id] = data;
    return acc;
  }, {});

  return (
    <main className="min-h-screen w-full bg-background px-6 pt-20 md:px-12 lg:px-24 xl:px-32">
      {/* Header Section */}
      <section className="mx-auto mb-12 w-full max-w-5xl">
        <h1 className="text-4xl font-bold tracking-tight text-primary dark:text-white sm:text-5xl md:text-6xl">
          Blog Posts
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          Dive into my curated collection of blog posts covering tech insights,
          tutorials, and thoughts. Click on any post to explore its content,
          learn about the technologies involved, and see how I contributed.
        </p>
        {/* Blog Grid */}
        <section className="mx-auto w-full max-w-7xl">
          <MarkDownContentList
            blogs={blogs}
            blogIdToMetadata={blogIdToMetadata}
          />
        </section>
      </section>
    </main>
  );
}
