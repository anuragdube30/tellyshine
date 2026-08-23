import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getCelebrities } from "@/lib/data";

export const metadata: Metadata = { title: "Celebrities" };
export const revalidate = 60;

export default async function CelebritiesPage() {
  const celebrities = await getCelebrities({ take: 40 });

  return (
    <div className="container py-10">
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">Celebrities</h1>
      {celebrities.length === 0 ? (
        <p className="text-muted-foreground py-16 text-center">No celebrity profiles yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {celebrities.map((c) => (
            <Link key={c.id} href={`/celebrities/${c.slug}`} className="text-center group">
              <div className="relative aspect-square rounded-full overflow-hidden border border-border">
                <Image src={c.profileImage} alt={c.name} fill sizes="160px" className="object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
              <h3 className="mt-3 text-sm font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                {c.name}
              </h3>
              <p className="text-xs text-muted-foreground">{c.profession}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
