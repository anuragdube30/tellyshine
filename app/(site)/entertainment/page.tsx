import Link from "next/link";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCategories } from "@/lib/data";
import { NewsCard } from "@/components/shared/news-card";
import { cn } from "@/lib/utils";

export const metadata = { title: "Entertainment" };
export const revalidate = 60;

export default async function EntertainmentPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const categories = await getCategories();
  const activeSlug = searchParams.category;

  let news: Prisma.NewsGetPayload<{
  include: { category: true };
      }>[] = [];
  try {
    news = await prisma.news.findMany({
      where: {
        status: "PUBLISHED",
        ...(activeSlug ? { category: { slug: activeSlug } } : {}),
      },
      include: { category: true },
      orderBy: { publishedAt: "desc" },
      take: 24,
    });
  } catch {
    news = [];
  }

  return (
    <div className="container py-10">
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-6">Entertainment</h1>

      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          href="/entertainment"
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium border transition-colors",
            !activeSlug ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary"
          )}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/entertainment?category=${c.slug}`}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium border transition-colors",
              activeSlug === c.slug ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary"
            )}
          >
            {c.name}
          </Link>
        ))}
      </div>

      {news.length === 0 ? (
        <p className="text-muted-foreground py-16 text-center">No stories in this category yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {news.map((n) => (
            <NewsCard
              key={n.id}
              slug={n.slug}
              title={n.title}
              excerpt={n.excerpt}
              featuredImage={n.featuredImage}
              categoryName={n.category?.name}
              publishedAt={n.publishedAt}
            />
          ))}
        </div>
      )}
    </div>
  );
}
