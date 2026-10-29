import { jsonLdString } from "@/lib/utils";
import React from "react";
import LatestPost from "@/presentation/blog/LatestPost";
import BackGroundParticle from "@/presentation/ui/LazyBackgroundParticle";
import { blogService } from "@/core";
import { BLOG_TYPES } from "@/lib/constants";
import FeaturedSection from "@/presentation/blog/FeaturedSection";
import Search from "@/presentation/blog/Search";
import { siteMetadata } from "../../site.config.mjs";
import HeroSection from "@/presentation/blog/HeroSection";

const { content } = siteMetadata;

export async function generateMetadata() {
  return {
    title: siteMetadata.title,
    description: siteMetadata.description,
    alternates: {
      canonical: `${siteMetadata.siteUrl}`,
    },
  };
}

export default async function Home() {
  const [latestBlog, snippets, blogs] = await Promise.all([
    blogService
      .getPublishedBlogs()
      .then((posts) => posts.map((p) => p.toSummary())),
    blogService
      .getPublishedSnippets()
      .then((posts) => posts.map((p) => p.toSummary())),
    blogService.getAllPosts().then((posts) => posts.map((p) => p.toSummary())),
  ]);

  const blogIdToMetadata = blogs.reduce((acc, data) => {
    acc[data.id] = data;
    return acc;
  }, {});

  const [firstLatestBlog] = latestBlog;

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteMetadata.title,
    url: siteMetadata.siteUrl,
    description: siteMetadata.description,
    publisher: {
      "@type": "Organization",
      name: siteMetadata.author,
      logo: {
        "@type": "ImageObject",
        url: `${siteMetadata.siteUrl}/logo.png`,
      },
    },
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
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumbsJsonLd) }}
      />
      {/* Background FX */}
      <BackGroundParticle />

      {/* Page Content */}
      <main className="relative z-10 flex min-h-screen flex-col">
        <div className="container mx-auto px-6 pt-24 md:px-10 lg:px-16 xl:px-24">
          {/* Hero Section */}
          <HeroSection />

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
        </div>
      </main>
    </>
  );
}
