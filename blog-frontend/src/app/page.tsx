import LatestPost from "@/components/atom/latestPost";
import BackGroundParticle from "@/components/atom/backGroundParticle";
import FeaturedPost from "@/components/atom/featuredPost";
import InDevelopment from "@/components/molecules/inDevelopment";
import React from "react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <main className="flex flex-col items-center justify-between pt-32 px-12 md:px-24 lg:px-32 xl:px-48">
        <InDevelopment />
      </main>
      <BackGroundParticle />
    </main>
  );
}
