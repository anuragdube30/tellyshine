import { prisma } from "@/lib/prisma";
import { VideoForm } from "@/components/admin/video-form";

export const metadata = { title: "Add Video" };

export default async function NewVideoPage() {
  const [categories, serials] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.serial.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add Video</h1>
      <VideoForm categories={categories} serials={serials} />
    </div>
  );
}
