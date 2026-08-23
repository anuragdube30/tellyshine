import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Instagram, Twitter, Facebook } from "lucide-react";
import { getCelebrityBySlug } from "@/lib/data";
import { NewsCard } from "@/components/shared/news-card";
import { parseSocialLinks } from "@/lib/utils";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const celeb = await getCelebrityBySlug(params.slug);
  if (!celeb) return { title: "Celebrity Not Found" };
  return { title: celeb.name, description: celeb.biography.slice(0, 160) };
}

export default async function CelebrityDetailPage({ params }: Props) {
  const celeb = await getCelebrityBySlug(params.slug);
  if (!celeb) notFound();

  const social = parseSocialLinks(celeb.socialLinks);

  return (
    <div>
      {celeb.coverImage && (
        <div className="relative h-64 w-full overflow-hidden">
          <Image src={celeb.coverImage} alt="" fill className="object-cover" />
          <div className="absolute inset-0 hero-gradient" />
        </div>
      )}

      <div className={`container ${celeb.coverImage ? "-mt-20" : "pt-10"} relative pb-16`}>
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="relative h-40 w-40 rounded-full overflow-hidden border-4 border-background shadow-xl shrink-0 mx-auto md:mx-0">
            <Image src={celeb.profileImage} alt={celeb.name} fill className="object-cover" />
          </div>
          <div className="pt-4">
            <h1 className="font-display text-3xl font-bold text-center md:text-left">{celeb.name}</h1>
            <p className="text-primary font-medium mt-1 text-center md:text-left">{celeb.profession}</p>
            <div className="flex gap-3 mt-4 justify-center md:justify-start">
              {social.instagram && <SocialLink href={social.instagram} icon={<Instagram className="h-4 w-4" />} />}
              {social.twitter && <SocialLink href={social.twitter} icon={<Twitter className="h-4 w-4" />} />}
              {social.facebook && <SocialLink href={social.facebook} icon={<Facebook className="h-4 w-4" />} />}
            </div>
            <p className="mt-5 text-muted-foreground leading-relaxed max-w-2xl">{celeb.biography}</p>
          </div>
        </div>

        {celeb.serials.length > 0 && (
          <section className="mt-14">
            <h2 className="font-display text-2xl font-bold mb-5">Known For</h2>
            <div className="flex gap-5 overflow-x-auto no-scrollbar pb-2">
              {celeb.serials.map(({ serial }) => (
                <Link key={serial.id} href={`/tv-serials/${serial.slug}`} className="shrink-0 w-32 group">
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden border border-border">
                    <Image src={serial.poster} alt={serial.name} fill className="object-cover" />
                  </div>
                  <p className="mt-2 text-sm font-medium line-clamp-1 group-hover:text-primary">{serial.name}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {celeb.news.length > 0 && (
          <section className="mt-14">
            <h2 className="font-display text-2xl font-bold mb-5">Related News</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {celeb.news.map(({ news }) => (
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

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors">
      {icon}
    </a>
  );
}
