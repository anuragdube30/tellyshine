import { notFound } from "next/navigation";
import { parseSocialLinks } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { CelebrityForm } from "@/components/admin/celebrity-form";

export const metadata = { title: "Edit Celebrity" };

export default async function EditCelebrityPage({ params }: { params: { id: string } }) {
  const celebrity = await prisma.celebrity.findUnique({ where: { id: params.id } });
  if (!celebrity) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Celebrity</h1>
      <CelebrityForm
        celebrityId={celebrity.id}
        initialData={{
          name: celebrity.name,
          profileImage: celebrity.profileImage,
          coverImage: celebrity.coverImage,
          biography: celebrity.biography,
          profession: celebrity.profession,
          featured: celebrity.featured,
          socialLinks: parseSocialLinks(celebrity.socialLinks),
        }}
      />
    </div>
  );
}
