import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { getFeaturedStory } from "@/lib/data";

export async function Hero() {
  const story = await getFeaturedStory();

  if (!story) {
    return (
      <section className="relative flex items-center justify-center h-[60vh] bg-gradient-to-br from-secondary to-background">
        <div className="text-center px-4">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-gradient-gold">
            Welcome to Telly Shine
          </h1>
          <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
            Add your first published story from the admin panel to feature it here.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[68vh] min-h-[440px] w-full overflow-hidden">
      <Image
        src={story.featuredImage}
        alt={story.title}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-background/20 to-transparent" />

      <div className="relative container h-full flex flex-col justify-end pb-14">
        <div className="max-w-2xl animate-fade-in">
          <span className="inline-block rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary-foreground">
            {story.category?.name ?? "Featured"}
          </span>
          <h1 className="mt-4 font-display text-3xl md:text-5xl font-bold leading-tight">
            {story.title}
          </h1>
          <p className="mt-4 text-muted-foreground text-base md:text-lg line-clamp-2">
            {story.excerpt}
          </p>
          <div className="mt-2 text-sm text-muted-foreground">
            {story.publishedAt && formatDate(story.publishedAt)}
          </div>
          <div className="mt-6 flex gap-3">
            <Link
              href={`/news/${story.slug}`}
              className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
            >
              Read More
            </Link>
            <Link
              href="/videos"
              className="inline-flex items-center rounded-full border border-foreground/30 bg-background/40 backdrop-blur px-6 py-3 text-sm font-semibold hover:bg-background/60 transition-colors"
            >
              Watch Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
