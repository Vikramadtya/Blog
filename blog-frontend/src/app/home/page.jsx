import React, { Suspense } from "react";
import LatestPost from "./components/molecules/latestPost";
import BackGroundParticle from "./components/atoms/backGroundParticle";
import Subscribe from "./components/atoms/subscribe";
import {
  getIdToMetadata,
  getLatestBlogs,
  getFeaturedSnippets,
} from "../../services/apiServices";
import LoadingSpinner from "../../components/atom/loadingSpinner";
import FeaturedSection from "./components/atoms/featuredSection";

export default async function Home() {
  const [latestBlog, snippets, blogIdToMetadata] = await Promise.all([
    getLatestBlogs(),
    getFeaturedSnippets(),
    getIdToMetadata(),
  ]);

  const [firstLatestBlog] = latestBlog;

  return (
    <>
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
                title="Featured Blogs"
                blogs={latestBlog}
                blogIdToMetadata={blogIdToMetadata}
              />
            </section>

            <section className="mt-20 border-t pt-10">
              <FeaturedSection
                title="Featured Code Snippets"
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
