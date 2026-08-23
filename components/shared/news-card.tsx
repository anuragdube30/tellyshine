import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

type Props = {
  slug: string;
  title: string;
  excerpt: string;
  featuredImage: string;
  categoryName?: string;
  publishedAt?: Date | string | null;
  size?: "default" | "compact";
};

export function NewsCard({
  slug,
  title,
  excerpt,
  featuredImage,
  categoryName,
  publishedAt,
  size = "default",
}: Props) {
  return (
    <Link
      href={`/news/${slug}`}
      className="group block rounded-xl overflow-hidden bg-card border border-border card-hover"
    >
      <div className={`relative w-full overflow-hidden ${size === "compact" ? "aspect-[16/10]" : "aspect-[16/9]"}`}>
        <Image
          src={featuredImage}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {categoryName && (
          <span className="absolute top-3 left-3 rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-primary-foreground">
            {categoryName}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{excerpt}</p>
        {publishedAt && (
          <p className="mt-3 text-xs text-muted-foreground">{formatDate(publishedAt)}</p>
        )}
      </div>
    </Link>
  );
}
