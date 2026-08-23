import { prisma } from "@/lib/prisma";
import { NewsForm } from "@/components/admin/news-form";

export const metadata = { title: "New Article" };

export default async function NewNewsPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">New Article</h1>
      <NewsForm categories={categories} />
    </div>
  );
}
