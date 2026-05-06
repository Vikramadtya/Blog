import React, { Suspense } from "react";
import LatestPost from "@/components/molecules/LatestPost";
import BackGroundParticle from "@/components/atoms/BackgroundParticle";
import Subscribe from "@/components/atoms/Subscribe";
import { getBlogsByType, getAllBlogs } from "@/lib/server/blog";
import { BLOG_TYPES } from "@/lib/constants";
import LoadingSpinner from "@/components/atoms/LoadingSpinner";
import FeaturedSection from "@/components/atoms/FeaturedSection";
import { siteMetadata } from "../../../site.config.mjs";

import content from "../../../config/content.json";

export async function generateMetadata() {
  return {
    title: `${siteMetadata.title} | ${siteMetadata.headerTitle}`,
    description: siteMetadata.description,
  };
}

export default async function Home() {
  const [latestBlog, snippets, blogs] = await Promise.all([
    getBlogsByType(BLOG_TYPES.blog.type),
    getBlogsByType(BLOG_TYPES.snippet.type),
    getAllBlogs(),
  ]);

  const blogIdToMetadata = blogs.reduce((acc, data) => {
    acc[data.id] = data;
    return acc;
  }, {});

  const [firstLatestBlog] = latestBlog;

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": siteMetadata.title,
    "url": siteMetadata.siteUrl,
    "description": siteMetadata.description,
    "publisher": {
      "@type": "Organization",
      "name": siteMetadata.author,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteMetadata.siteUrl}/logo.png`,
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      {/* Background FX */}
      <BackGroundParticle />

      {/* Page Content */}
      <main className="relative z-10 flex min-h-screen flex-col">
        <Suspense fallback={<LoadingSpinner />}>
          <div className="container mx-auto px-6 pt-24 md:px-10 lg:px-16 xl:px-24">
            {/* Hero Post */}
            {firstLatestBlog && (
              <LatestPost
                title={firstLatestBlog.title}
                description={firstLatestBlog.description}
                tags={firstLatestBlog.tags}
                slug={firstLatestBlog.slug}
                previewImageSrc={firstLatestBlog.previewImageSrc}
              />
            )}

            {/* Featured Sections */}
            <section className="mt-20 border-t pt-10">
              <FeaturedSection
                title={content.home.featuredBlogsTitle}
                blogs={latestBlog}
                blogIdToMetadata={blogIdToMetadata}
              />
            </section>

            <section className="mt-20 border-t pt-10">
              <FeaturedSection
                title={content.home.featuredSnippetsTitle}
                blogs={snippets}
                blogIdToMetadata={blogIdToMetadata}
              />
            </section>

            {/* Subscribe */}
            <section className="mt-24 border-t pt-12">
              <Subscribe />
            </section>
          </div>
        </Suspense>
      </main>
    </>
  );
}
