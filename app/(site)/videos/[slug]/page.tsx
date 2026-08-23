import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getVideoBySlug, getVideos } from "@/lib/data";
import { extractYoutubeId, formatDate, formatViews } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const video = await getVideoBySlug(params.slug);
  if (!video) return { title: "Video Not Found" };
  return { title: video.title, description: video.description || undefined };
}

export default async function VideoDetailPage({ params }: Props) {
  const video = await getVideoBySlug(params.slug);
  if (!video || !video.isPublished) notFound();

  prisma.video.update({ where: { id: video.id }, data: { views: { increment: 1 } } }).catch(() => {});

  const embedId = extractYoutubeId(video.youtubeUrl);
  const related = await getVideos({ take: 6 });

  return (
    <div className="container py-10">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
        <div>
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black">
            {embedId ? (
              <iframe
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube.com/embed/${embedId}`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                Invalid video URL
              </div>
            )}
          </div>
          <h1 className="font-display text-2xl font-bold mt-5">{video.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {formatViews(video.views)} views · {formatDate(video.createdAt)}
          </p>
          {video.description && <p className="mt-4 leading-relaxed text-muted-foreground">{video.description}</p>}
        </div>

        <aside>
          <h3 className="font-display text-lg font-bold mb-4">More Videos</h3>
          <div className="space-y-4">
            {related.filter((r) => r.slug !== video.slug).slice(0, 5).map((r) => (
              <Link key={r.id} href={`/videos/${r.slug}`} className="flex gap-3 group">
                <div className="relative h-16 w-28 shrink-0 rounded-lg overflow-hidden">
                  <Image src={r.thumbnail} alt={r.title} fill className="object-cover" />
                </div>
                <p className="text-sm font-medium leading-snug group-hover:text-primary line-clamp-2">
                  {r.title}
                </p>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
