import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tellyshine-git-main-anuragdube30s-projects.vercel.app";
  const staticRoutes = ["", "/tv-serials", "/trending", "/videos", "/entertainment", "/celebrities", "/about", "/contact"];
  let dynamicRoutes: MetadataRoute.Sitemap = [];
  try {
    const [news, videos, serials, celebrities] = await Promise.all([
      prisma.news.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
      prisma.video.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
      prisma.serial.findMany({ select: { slug: true, updatedAt: true } }),
      prisma.celebrity.findMany({ select: { slug: true, updatedAt: true } }),
    ]);
    dynamicRoutes = [
      ...news.map((item) => ({ url: `${baseUrl}/news/${item.slug}`, lastModified: item.updatedAt })),
      ...videos.map((item) => ({ url: `${baseUrl}/videos/${item.slug}`, lastModified: item.updatedAt })),
      ...serials.map((item) => ({ url: `${baseUrl}/tv-serials/${item.slug}`, lastModified: item.updatedAt })),
      ...celebrities.map((item) => ({ url: `${baseUrl}/celebrities/${item.slug}`, lastModified: item.updatedAt })),
    ];
  } catch {}

  return [...staticRoutes.map((route) => ({ url: `${baseUrl}${route}`, lastModified: new Date() })), ...dynamicRoutes];
}
