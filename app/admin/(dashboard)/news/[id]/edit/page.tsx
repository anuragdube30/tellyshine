import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { NewsForm } from "@/components/admin/news-form";

export const metadata = { title: "Edit Article" };

export default async function EditNewsPage({ params }: { params: { id: string } }) {
  const [news, categories] = await Promise.all([
    prisma.news.findUnique({ where: { id: params.id }, include: { tags: true } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!news) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Article</h1>
      <NewsForm
        categories={categories}
        newsId={news.id}
        initialData={{
          title: news.title,
          excerpt: news.excerpt,
          content: news.content,
          featuredImage: news.featuredImage,
          categoryId: news.categoryId,
          status: news.status,
          scheduledFor: news.scheduledFor?.toISOString().slice(0, 16) || null,
          seoTitle: news.seoTitle,
          seoDescription: news.seoDescription,
          tagNames: news.tags.map((t) => t.name),
        }}
      />
    </div>
  );
}
