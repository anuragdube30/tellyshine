import Link from "next/link";
import { Newspaper, Tv, Video, Users, FolderTree, Eye, FileEdit, Mail, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDate, formatViews } from "@/lib/utils";

export const metadata = { title: "Admin Dashboard" };
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [
    totalNews,
    publishedNews,
    draftNews,
    totalVideos,
    totalSerials,
    totalCelebrities,
    totalCategories,
    viewsAgg,
    recentNews,
    unreadMessages,
  ] = await Promise.all([
    prisma.news.count(),
    prisma.news.count({ where: { status: "PUBLISHED" } }),
    prisma.news.count({ where: { status: "DRAFT" } }),
    prisma.video.count(),
    prisma.serial.count(),
    prisma.celebrity.count(),
    prisma.category.count(),
    prisma.news.aggregate({ _sum: { views: true } }),
    prisma.news.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      select: { id: true, title: true, status: true, createdAt: true, slug: true },
    }),
    prisma.message.count({ where: { isRead: false } }),
  ]);

  const stats = [
    { label: "Total News", value: totalNews, icon: Newspaper, href: "/admin/news" },
    { label: "Published", value: publishedNews, icon: Eye, href: "/admin/news?status=PUBLISHED" },
    { label: "Drafts", value: draftNews, icon: FileEdit, href: "/admin/news?status=DRAFT" },
    { label: "TV Serials", value: totalSerials, icon: Tv, href: "/admin/serials" },
    { label: "Videos", value: totalVideos, icon: Video, href: "/admin/videos" },
    { label: "Celebrities", value: totalCelebrities, icon: Users, href: "/admin/celebrities" },
    { label: "Categories", value: totalCategories, icon: FolderTree, href: "/admin/categories" },
    { label: "Total Views", value: formatViews(viewsAgg._sum.views || 0), icon: Eye, href: "/admin/news" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back to the Telly Shine control room.</p>
        </div>
        <Link
          href="/admin/news/new"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:scale-105 transition-transform"
        >
          <Plus className="h-4 w-4" /> New Article
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-xl border border-border bg-card p-4 hover:border-primary transition-colors"
          >
            <s.icon className="h-5 w-5 text-primary mb-3" />
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </Link>
        ))}
      </div>

      {unreadMessages > 0 && (
        <Link
          href="/admin/messages"
          className="flex items-center gap-3 rounded-xl border border-primary/40 bg-primary/10 p-4 mb-8 hover:bg-primary/15 transition-colors"
        >
          <Mail className="h-5 w-5 text-primary" />
          <p className="text-sm font-medium">
            You have {unreadMessages} unread contact message{unreadMessages > 1 ? "s" : ""}.
          </p>
        </Link>
      )}

      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-semibold">Recent Content</h2>
          <Link href="/admin/news" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="divide-y divide-border">
          {recentNews.length === 0 && (
            <p className="p-6 text-sm text-muted-foreground">No content yet. Create your first article.</p>
          )}
          {recentNews.map((n) => (
            <Link
              key={n.id}
              href={`/admin/news/${n.id}/edit`}
              className="flex items-center justify-between p-4 hover:bg-secondary/40 transition-colors"
            >
              <span className="text-sm font-medium line-clamp-1">{n.title}</span>
              <div className="flex items-center gap-3 shrink-0">
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
                <span className="text-xs text-muted-foreground">{formatDate(n.createdAt)}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
