import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SerialForm } from "@/components/admin/serial-form";
import { parseCast } from "@/lib/utils";

export const metadata = { title: "Edit Serial" };

export default async function EditSerialPage({ params }: { params: { id: string } }) {
  const [serial, categories] = await Promise.all([
    prisma.serial.findUnique({ where: { id: params.id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!serial) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Serial</h1>
      <SerialForm
        categories={categories}
        serialId={serial.id}
        initialData={{
          name: serial.name,
          poster: serial.poster,
          banner: serial.banner,
          description: serial.description,
          channel: serial.channel,
          genre: serial.genre,
          cast: parseCast(serial.cast),
          status: serial.status,
          startDate: serial.startDate?.toISOString().slice(0, 10) || null,
          latestEpisode: serial.latestEpisode,
          upcomingEpisode: serial.upcomingEpisode,
          categoryId: serial.categoryId,
          featured: serial.featured,
        }}
      />
    </div>
  );
}
