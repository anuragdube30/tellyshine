import { getLatestNews } from "@/lib/data";
import { SectionHeading } from "@/components/shared/section-heading";
import { NewsCard } from "@/components/shared/news-card";

export async function LatestNews() {
  const news = await getLatestNews(8);
  if (news.length === 0) return null;

  return (
    <section className="container py-14">
      <SectionHeading
        title="Latest Entertainment News"
        subtitle="Fresh off the press"
        viewAllHref="/entertainment"
      />
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
    </section>
  );
}
