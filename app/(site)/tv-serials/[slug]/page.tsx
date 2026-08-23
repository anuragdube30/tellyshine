import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSerialBySlug } from "@/lib/data";
import { NewsCard } from "@/components/shared/news-card";
import { formatDate, parseCast } from "@/lib/utils";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const serial = await getSerialBySlug(params.slug);
  if (!serial) return { title: "Serial Not Found" };
  return {
    title: serial.name,
    description: serial.description.slice(0, 160),
    openGraph: { images: [serial.banner] },
  };
}

export default async function SerialDetailPage({ params }: Props) {
  const serial = await getSerialBySlug(params.slug);
  if (!serial) notFound();

  const cast = parseCast(serial.cast);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TVSeries",
    name: serial.name,
    description: serial.description,
    image: serial.poster,
    genre: serial.genre,
    actor: cast.map((name) => ({ "@type": "Person", name })),
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="relative h-[380px] w-full overflow-hidden">
        <Image src={serial.banner} alt={serial.name} fill priority className="object-cover" />
        <div className="absolute inset-0 hero-gradient" />
      </div>

      <div className="container -mt-32 relative pb-16">
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8">
          <div className="relative aspect-[2/3] w-48 md:w-full rounded-xl overflow-hidden border-4 border-background shadow-2xl mx-auto md:mx-0">
            <Image src={serial.poster} alt={serial.name} fill className="object-cover" />
          </div>

          <div>
            <span className="inline-block rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground mb-3">
              {serial.status}
            </span>
            <h1 className="font-display text-3xl md:text-4xl font-bold">{serial.name}</h1>
            <div className="flex flex-wrap gap-x-6 gap-y-1 mt-3 text-sm text-muted-foreground">
              <span><strong className="text-foreground">Channel:</strong> {serial.channel}</span>
              <span><strong className="text-foreground">Genre:</strong> {serial.genre}</span>
              {serial.startDate && (
                <span><strong className="text-foreground">Since:</strong> {formatDate(serial.startDate)}</span>
              )}
            </div>
            <p className="mt-5 text-muted-foreground leading-relaxed">{serial.description}</p>

            {cast.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Cast</h3>
                <div className="flex flex-wrap gap-2">
                  {cast.map((name) => (
                    <span key={name} className="rounded-full bg-secondary px-3 py-1 text-sm">
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {serial.latestEpisode && (
                <div className="rounded-xl border border-border bg-card p-4">
                  <p className="text-xs uppercase text-muted-foreground font-semibold">Latest Episode</p>
                  <p className="mt-1 font-medium">{serial.latestEpisode}</p>
                </div>
              )}
              {serial.upcomingEpisode && (
                <div className="rounded-xl border border-border bg-card p-4">
                  <p className="text-xs uppercase text-muted-foreground font-semibold">Upcoming Episode</p>
                  <p className="mt-1 font-medium">{serial.upcomingEpisode}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {serial.celebrities.length > 0 && (
          <section className="mt-14">
            <h2 className="font-display text-2xl font-bold mb-5">Cast &amp; Crew</h2>
            <div className="flex gap-5 overflow-x-auto no-scrollbar pb-2">
              {serial.celebrities.map(({ celebrity, role }) => (
                <Link
                  key={celebrity.id}
                  href={`/celebrities/${celebrity.slug}`}
                  className="shrink-0 w-28 text-center group"
                >
                  <div className="relative h-28 w-28 rounded-full overflow-hidden border border-border mx-auto">
                    <Image src={celebrity.profileImage} alt={celebrity.name} fill className="object-cover" />
                  </div>
                  <p className="mt-2 text-sm font-medium group-hover:text-primary line-clamp-1">
                    {celebrity.name}
                  </p>
                  {role && <p className="text-xs text-muted-foreground line-clamp-1">{role}</p>}
                </Link>
              ))}
            </div>
          </section>
        )}

        {serial.news.length > 0 && (
          <section className="mt-14">
            <h2 className="font-display text-2xl font-bold mb-5">Related News</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {serial.news.map(({ news }) => (
                <NewsCard
                  key={news.id}
                  slug={news.slug}
                  title={news.title}
                  excerpt={news.excerpt}
                  featuredImage={news.featuredImage}
                  publishedAt={news.publishedAt}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
