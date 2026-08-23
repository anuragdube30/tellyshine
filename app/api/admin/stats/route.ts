import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
      take: 5,
      select: { id: true, title: true, status: true, createdAt: true, slug: true },
    }),
    prisma.message.count({ where: { isRead: false } }),
  ]);

  return NextResponse.json({
    totalNews,
    publishedNews,
    draftNews,
    totalVideos,
    totalSerials,
    totalCelebrities,
    totalCategories,
    totalViews: viewsAgg._sum.views || 0,
    recentNews,
    unreadMessages,
  });
}
