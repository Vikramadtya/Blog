import LatestPost from "../components/molecules/latestPost";
import BackGroundParticle from "../components/atom/backGroundParticle";
import React from "react";
import MarkDownContentList from "../components/molecules/markDownContentList";
import {
  getIdToMetadata,
  getFeaturedBlogs,
  getLatestBlogs,
  getFeaturedSnippets,
} from "../services/apiServices";
import Subscribe from "../components/atom/subscribe";

export default async function Home() {
  const latestBlog = await getLatestBlogs();
  const blogs = await getFeaturedBlogs();
  const snippets = await getFeaturedSnippets();

  const blogIdToMetadata = await getIdToMetadata();

  return (
    <main className="flex min-h-screen flex-col">
      <main className="flex flex-col items-center justify-between px-12 pt-32 md:px-24 lg:px-32 xl:px-48">
        <LatestPost
          title={latestBlog[0].title}
          description={latestBlog[0].description}
          tags={latestBlog[0].tags}
          slug={latestBlog[0].slug}
          previewImageSrc={latestBlog[0].previewImageSrc}
        />
        <div className="mt-5 md:pb-5 md:pt-10">
          <h1 className="text-4xl font-bold tracking-widest">Featured Blogs</h1>
        </div>
        <MarkDownContentList
          blogs={blogs}
          blogIdToMetadata={blogIdToMetadata}
        />
        <div className="mt-5 md:pb-5 md:pt-10">
          <h1 className="text-4xl font-bold tracking-widest">
            Featured Snippets
          </h1>
        </div>
        <MarkDownContentList
          blogs={snippets}
          blogIdToMetadata={blogIdToMetadata}
        />
        <Subscribe />
      </main>
      <BackGroundParticle />
    </main>
  );
}
