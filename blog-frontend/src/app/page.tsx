import LatestPost from "@/components/atom/latestPost";
import BackGroundParticle from "@/components/atom/backGroundParticle";
import FeaturedPost from "@/components/atom/featuredPost";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <LatestPost />
      <FeaturedPost />
      <BackGroundParticle />
    </main>
  );
}
