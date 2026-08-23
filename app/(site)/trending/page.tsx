import Image from "next/image";
import Link from "next/link";
import { getTrendingNews } from "@/lib/data";
import { formatDate, formatViews } from "@/lib/utils";

export const metadata = { title: "Trending" };
export const revalidate = 60;

export default async function TrendingPage() {
  const items = await getTrendingNews(20);

  return (
    <div className="container py-10">
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">Trending Now</h1>
      {items.length === 0 ? (
        <p className="text-muted-foreground py-16 text-center">Nothing trending yet.</p>
      ) : (
        <div className="space-y-4">
          {items.map((item, i) => (
            <Link
              key={item.id}
              href={`/news/${item.slug}`}
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-3 hover:border-primary transition-colors group"
            >
              <span className="font-display text-3xl font-bold text-muted-foreground/40 w-12 text-center shrink-0 group-hover:text-primary transition-colors">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg">
                <Image src={item.featuredImage} alt={item.title} fill className="object-cover" sizes="128px" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-primary uppercase tracking-wide">{item.category?.name}</p>
                <h3 className="font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatViews(item.views)} views · {item.publishedAt ? formatDate(item.publishedAt) : ""}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
