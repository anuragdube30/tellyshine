import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { getVideos } from "@/lib/data";
import { formatDate, formatViews } from "@/lib/utils";

export const metadata: Metadata = { title: "Videos" };
export const revalidate = 60;

export default async function VideosPage() {
  const videos = await getVideos({ take: 24 });

  return (
    <div className="container py-10">
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-8">Videos</h1>
      {videos.length === 0 ? (
        <p className="text-muted-foreground py-16 text-center">No videos published yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((v) => (
            <Link key={v.id} href={`/videos/${v.slug}`} className="group">
              <div className="relative aspect-video rounded-xl overflow-hidden border border-border">
                <Image src={v.thumbnail} alt={v.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="h-12 w-12 rounded-full bg-primary/90 flex items-center justify-center">
                    <Play className="h-5 w-5 text-primary-foreground fill-primary-foreground ml-0.5" />
                  </div>
                </div>
                {v.duration && (
                  <span className="absolute bottom-2 right-2 rounded bg-background/80 px-1.5 py-0.5 text-[11px] font-medium">
                    {v.duration}
                  </span>
                )}
              </div>
              <h3 className="mt-2 font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                {v.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {formatViews(v.views)} views · {formatDate(v.createdAt)}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
