import Link from "next/link";
import { globalSearch } from "@/lib/data";
import { NewsCard } from "@/components/shared/news-card";
import { SearchBox } from "@/components/shared/search-box";

export const metadata = { title: "Search" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = searchParams.q?.trim() || "";
  const results = q ? await globalSearch(q) : { news: [], serials: [], videos: [], celebrities: [] };
  const totalResults =
    results.news.length + results.serials.length + results.videos.length + results.celebrities.length;

  return (
    <div className="container py-10">
      <h1 className="font-display text-3xl font-bold mb-6">Search</h1>
      <SearchBox initialQuery={q} />

      {!q && (
        <p className="text-muted-foreground mt-10 text-center">
          Search for TV serials, entertainment news, videos and celebrities.
        </p>
      )}

      {q && totalResults === 0 && (
        <p className="text-muted-foreground mt-10 text-center">
          No results found for <strong>&ldquo;{q}&rdquo;</strong>. Try a different keyword.
        </p>
      )}

      {results.news.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-xl font-bold mb-4">News ({results.news.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {results.news.map((n) => (
              <NewsCard
                key={n.id}
                slug={n.slug}
                title={n.title}
                excerpt={n.excerpt}
                featuredImage={n.featuredImage}
                publishedAt={n.publishedAt}
              />
            ))}
          </div>
        </section>
      )}

      {results.serials.length > 0 && (
        <ResultRow title="TV Serials" items={results.serials.map((s) => ({ href: `/tv-serials/${s.slug}`, label: s.name }))} />
      )}
      {results.videos.length > 0 && (
        <ResultRow title="Videos" items={results.videos.map((v) => ({ href: `/videos/${v.slug}`, label: v.title }))} />
      )}
      {results.celebrities.length > 0 && (
        <ResultRow title="Celebrities" items={results.celebrities.map((c) => ({ href: `/celebrities/${c.slug}`, label: c.name }))} />
      )}
    </div>
  );
}

function ResultRow({ title, items }: { title: string; items: { href: string; label: string }[] }) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-xl font-bold mb-4">{title} ({items.length})</h2>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="rounded-full border border-border px-4 py-2 text-sm hover:border-primary hover:text-primary transition-colors">
            {item.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
