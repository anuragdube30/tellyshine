import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { EntityTableActions } from "@/components/admin/entity-table-actions";

export const metadata = { title: "Manage News" };
export const dynamic = "force-dynamic";

export default async function AdminNewsListPage({
  searchParams,
}: {
  searchParams: { status?: string; q?: string; page?: string };
}) {
  const page = Number(searchParams.page || 1);
  const pageSize = 15;
  const where = {
    ...(searchParams.status ? { status: searchParams.status as "DRAFT" | "PUBLISHED" | "SCHEDULED" } : {}),
    ...(searchParams.q ? { title: { contains: searchParams.q } } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.news.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.news.count({ where }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">News</h1>
        <Link href="/admin/news/new" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:scale-105 transition-transform">
          <Plus className="h-4 w-4" /> New Article
        </Link>
      </div>

      <form className="flex flex-wrap gap-3 mb-5">
        <input
          type="text"
          name="q"
          defaultValue={searchParams.q}
          placeholder="Search by title…"
          className="rounded-full border border-border bg-secondary/60 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring w-64"
        />
        <select name="status" defaultValue={searchParams.status || ""} className="rounded-full border border-border bg-secondary/60 px-4 py-2 text-sm outline-none">
          <option value="">All Status</option>
          <option value="PUBLISHED">Published</option>
          <option value="DRAFT">Draft</option>
          <option value="SCHEDULED">Scheduled</option>
        </select>
        <button type="submit" className="rounded-full border border-border px-4 py-2 text-sm hover:border-primary transition-colors">
          Filter
        </button>
      </form>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Status</th>
              <th className="p-4">Views</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((n) => (
              <tr key={n.id} className="hover:bg-secondary/30 transition-colors">
                <td className="p-4 font-medium max-w-xs truncate">{n.title}</td>
                <td className="p-4 text-muted-foreground">{n.category?.name}</td>
                <td className="p-4">
                  <span
                    className={`text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                      n.status === "PUBLISHED"
                        ? "bg-green-500/15 text-green-600 dark:text-green-400"
                        : n.status === "DRAFT"
                        ? "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400"
                        : "bg-blue-500/15 text-blue-600 dark:text-blue-400"
                    }`}
                  >
                    {n.status}
                  </span>
                </td>
                <td className="p-4 text-muted-foreground">{n.views}</td>
                <td className="p-4 text-muted-foreground">{formatDate(n.createdAt)}</td>
                <td className="p-4">
                  <EntityTableActions
                    apiPath={`/api/news/${n.id}`}
                    editPath={`/admin/news/${n.id}/edit`}
                    viewPath={`/news/${n.slug}`}
                    label="article"
                  />
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted-foreground">
                  No articles found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/news?page=${p}${searchParams.status ? `&status=${searchParams.status}` : ""}`}
              className={`h-9 w-9 flex items-center justify-center rounded-full text-sm border ${
                p === page ? "bg-primary text-primary-foreground border-primary" : "border-border"
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
