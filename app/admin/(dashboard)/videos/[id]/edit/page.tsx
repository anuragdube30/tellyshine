import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { VideoForm } from "@/components/admin/video-form";

export const metadata = { title: "Edit Video" };

export default async function EditVideoPage({ params }: { params: { id: string } }) {
  const [video, categories, serials] = await Promise.all([
    prisma.video.findUnique({ where: { id: params.id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.serial.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!video) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Video</h1>
      <VideoForm
        categories={categories}
        serials={serials}
        videoId={video.id}
        initialData={{
          title: video.title,
          description: video.description,
          youtubeUrl: video.youtubeUrl,
          duration: video.duration,
          categoryId: video.categoryId,
          serialId: video.serialId,
          isPublished: video.isPublished,
        }}
      />
    </div>
  );
}
