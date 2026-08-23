import { prisma } from "@/lib/prisma";
import { BreakingNewsManager } from "@/components/admin/breaking-news-manager";

export const metadata = { title: "Breaking News" };
export const dynamic = "force-dynamic";

export default async function AdminBreakingNewsPage() {
  const items = await prisma.breakingNews.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Breaking News</h1>
      <p className="text-sm text-muted-foreground mb-6">
        These items scroll in the ticker below the header. Use the arrows to reorder.
      </p>
      <BreakingNewsManager initialItems={items} />
    </div>
  );
}
