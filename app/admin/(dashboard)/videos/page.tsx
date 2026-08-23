import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { EntityTableActions } from "@/components/admin/entity-table-actions";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Manage Videos" };
export const dynamic = "force-dynamic";

export default async function AdminVideosPage() {
  const videos = await prisma.video.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Videos</h1>
        <Link href="/admin/videos/new" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:scale-105 transition-transform">
          <Plus className="h-4 w-4" /> Add Video
        </Link>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="p-4">Video</th>
              <th className="p-4">Status</th>
              <th className="p-4">Views</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {videos.map((v) => (
              <tr key={v.id} className="hover:bg-secondary/30 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-16 rounded overflow-hidden shrink-0">
                      <Image src={v.thumbnail} alt={v.title} fill className="object-cover" />
                    </div>
                    <span className="font-medium line-clamp-1 max-w-xs">{v.title}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full ${v.isPublished ? "bg-green-500/15 text-green-600 dark:text-green-400" : "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400"}`}>
                    {v.isPublished ? "Published" : "Unpublished"}
                  </span>
                </td>
                <td className="p-4 text-muted-foreground">{v.views}</td>
                <td className="p-4 text-muted-foreground">{formatDate(v.createdAt)}</td>
                <td className="p-4">
                  <EntityTableActions apiPath={`/api/videos/${v.id}`} editPath={`/admin/videos/${v.id}/edit`} viewPath={`/videos/${v.slug}`} label="video" />
                </td>
              </tr>
            ))}
            {videos.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No videos found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
