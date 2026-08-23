import Image from "next/image";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Media Library" };
export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const media = await prisma.media.findMany({ orderBy: { createdAt: "desc" }, take: 60 });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Media Library</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Images uploaded through the content forms are automatically logged here.
      </p>

      {media.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-10 text-center text-muted-foreground">
          No uploads yet. Images you upload via any content form (News, Serials, Videos, Celebrities) will appear here.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {media.map((m) => (
            <div key={m.id} className="group relative aspect-square rounded-xl overflow-hidden border border-border">
              <Image src={m.url} alt={m.alt || ""} fill className="object-cover" sizes="200px" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                <p className="text-[10px] text-white truncate">{m.alt || "Untitled"}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
