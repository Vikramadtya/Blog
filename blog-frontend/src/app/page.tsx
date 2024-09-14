import LatestPost from "@/components/molecules/latestPost";
import BackGroundParticle from "@/components/atom/backGroundParticle";
import React from "react";
import MarkDownContentList from "@/components/molecules/markDownContentList";
import {
  getFeaturedBlogsMetaData,
  getLatestBlogsMetaData,
} from "@/services/apiServices";
import Subscribe from "@/components/atom/subscribe";

export default async function Home() {
  const latestBlog = await getLatestBlogsMetaData();
  const blogs = await getFeaturedBlogsMetaData();

  return (
    <main className="flex min-h-screen flex-col">
      <main className="flex flex-col items-center justify-between px-12 pt-32 md:px-24 lg:px-32 xl:px-48">
        <LatestPost
          title={latestBlog[0].title}
          description={latestBlog[0].description}
          tags={latestBlog[0].tags}
          slug={latestBlog[0].slug}
        />
        <div className="mt-5 md:pb-5 md:pt-10">
          <h1 className="text-4xl font-bold tracking-widest">Featured Blogs</h1>
        </div>
        <MarkDownContentList blogs={blogs} />
        <Subscribe />
      </main>
      <BackGroundParticle />
    </main>
  );
}
