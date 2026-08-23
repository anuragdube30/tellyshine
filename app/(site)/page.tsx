import { Hero } from "@/components/home/hero";
import { LatestNews } from "@/components/home/latest-news";
import { Trending } from "@/components/home/trending";

export default function HomePage() {
  return (
    <>
      <Hero />
      <LatestNews />
      <Trending />
    </>
  );
}
