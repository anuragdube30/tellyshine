import Image from "next/image";
import Link from "next/link";
import { getTrendingNews } from "@/lib/data";
import { SectionHeading } from "@/components/shared/section-heading";
import { formatDate, formatViews } from "@/lib/utils";

export async function Trending() {
  const items = await getTrendingNews(6);
  if (items.length === 0) return null;

  return (
    <section className="container py-14">
      <SectionHeading title="Trending Now" subtitle="What everyone's talking about" viewAllHref="/trending" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item, i) => (
          <Link
            key={item.id}
            href={`/news/${item.slug}`}
            className="group flex items-center gap-4 rounded-xl border border-border bg-card p-3 card-hover"
          >
            <span className="font-display text-3xl font-bold text-muted-foreground/40 w-10 shrink-0 group-hover:text-primary transition-colors">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg">
              <Image src={item.featuredImage} alt={item.title} fill className="object-cover" sizes="96px" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-primary uppercase tracking-wide">
                {item.category?.name}
              </p>
              <h3 className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {formatViews(item.views)} views · {item.publishedAt ? formatDate(item.publishedAt) : ""}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
