import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getNewsBySlug, getTrendingNews, getLatestNews } from "@/lib/data";
import { NewsCard } from "@/components/shared/news-card";
import { ShareButtons } from "@/components/shared/share-buttons";
import { formatDate } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const news = await getNewsBySlug(params.slug);
  if (!news) return { title: "Article Not Found" };
  return {
    title: news.seoTitle || news.title,
    description: news.seoDescription || news.excerpt,
    openGraph: {
      title: news.title,
      description: news.excerpt,
      images: [news.featuredImage],
      type: "article",
      publishedTime: news.publishedAt?.toISOString(),
    },
    alternates: { canonical: `/news/${news.slug}` },
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const news = await getNewsBySlug(params.slug);
  if (!news || news.status !== "PUBLISHED") notFound();

  // Fire-and-forget view increment; safe even if it fails.
  prisma.news.update({ where: { id: news.id }, data: { views: { increment: 1 } } }).catch(() => {});

  const [related, trending] = await Promise.all([getLatestNews(4), getTrendingNews(5)]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: news.title,
    image: [news.featuredImage],
    datePublished: news.publishedAt,
    dateModified: news.updatedAt,
    author: { "@type": "Person", name: news.author?.name || "Telly Shine" },
    publisher: { "@type": "Organization", name: "Telly Shine" },
  };

  return (
    <div className="container py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
        <article>
          <span className="inline-block rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
            {news.category?.name}
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-bold mt-4 leading-tight">
            {news.title}
          </h1>
          <div className="flex items-center gap-3 mt-4 text-sm text-muted-foreground">
            <span>By {news.author?.name || "Telly Shine Desk"}</span>
            <span>·</span>
            <span>{news.publishedAt && formatDate(news.publishedAt)}</span>
          </div>

          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mt-6">
            <Image src={news.featuredImage} alt={news.title} fill priority className="object-cover" />
          </div>

          <div
            className="prose prose-neutral dark:prose-invert max-w-none mt-8 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: news.content }}
          />

          {news.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8">
              {news.tags.map((t) => (
                <span key={t.id} className="rounded-full bg-secondary px-3 py-1 text-xs">
                  #{t.name}
                </span>
              ))}
            </div>
          )}

          <ShareButtons title={news.title} />
        </article>

        <aside className="space-y-8">
          <div>
            <h3 className="font-display text-lg font-bold mb-4">Trending Stories</h3>
            <div className="space-y-4">
              {trending.map((t, i) => (
                <a
                  key={t.id}
                  href={`/news/${t.slug}`}
                  className="flex gap-3 items-start group"
                >
                  <span className="font-display text-xl font-bold text-muted-foreground/40 w-6">
                    {i + 1}
                  </span>
                  <p className="text-sm font-medium leading-snug group-hover:text-primary line-clamp-2">
                    {t.title}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold mb-5">Related Stories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((n) => (
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
      )}
    </div>
  );
}
