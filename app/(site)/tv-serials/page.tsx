import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getSerials, getFeaturedSerial } from "@/lib/data";

export const metadata: Metadata = {
  title: "TV Serials",
  description: "Browse the latest TV serials, cast details, episodes and updates on Telly Shine.",
};

export const revalidate = 60;

export default async function TvSerialsPage() {
  const [serials, featured] = await Promise.all([getSerials({ take: 24 }), getFeaturedSerial()]);

  return (
    <div className="container py-10">
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">TV Serials</h1>

      {featured && (
        <Link
          href={`/tv-serials/${featured.slug}`}
          className="relative block h-[360px] rounded-2xl overflow-hidden mb-12 group"
        >
          <Image
            src={featured.banner}
            alt={featured.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <span className="inline-block rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground mb-3">
              Featured Serial
            </span>
            <h2 className="font-display text-2xl md:text-4xl font-bold">{featured.name}</h2>
            <p className="text-muted-foreground mt-2 max-w-xl line-clamp-2">{featured.description}</p>
          </div>
        </Link>
      )}

      {serials.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {serials.map((s) => (
            <Link key={s.id} href={`/tv-serials/${s.slug}`} className="group">
              <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-border">
                <Image
                  src={s.poster}
                  alt={s.name}
                  fill
                  sizes="200px"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <span className="absolute top-2 left-2 rounded-full bg-background/80 backdrop-blur px-2 py-0.5 text-[10px] font-semibold uppercase">
                  {s.status}
                </span>
              </div>
              <h3 className="mt-2 text-sm font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                {s.name}
              </h3>
              <p className="text-xs text-muted-foreground">{s.channel}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-20 text-muted-foreground">
      <p>No TV serials added yet. Add some from the admin panel.</p>
    </div>
  );
}
