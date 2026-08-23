import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SectionHeading({
  title,
  subtitle,
  viewAllHref,
}: {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
}) {
  return (
    <div className="flex items-end justify-between mb-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-display font-bold">
          {title}
        </h2>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all"
        >
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
