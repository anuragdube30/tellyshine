import { prisma } from "./prisma";

// Wraps a query so a fresh/unseeded DB never crashes page rendering.
async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export const getFeaturedStory = () =>
  safe(
    () =>
      prisma.news.findFirst({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
        include: { category: true },
      }),
    null
  );

export const getLatestNews = (take = 8, skip = 0) =>
  safe(
    () =>
      prisma.news.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
        include: { category: true },
        take,
        skip,
      }),
    []
  );

export const getTrendingNews = (take = 6) =>
  safe(
    () =>
      prisma.news.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { views: "desc" },
        include: { category: true },
        take,
      }),
    []
  );

export const getNewsBySlug = (slug: string) =>
  safe(
    () =>
      prisma.news.findUnique({
        where: { slug },
        include: {
          category: true,
          author: { select: { name: true, image: true } },
          tags: true,
          celebrities: { include: { celebrity: true } },
          serials: { include: { serial: true } },
        },
      }),
    null
  );

export const getSerials = (opts: { take?: number; skip?: number; genre?: string; q?: string } = {}) =>
  safe(
    () =>
      prisma.serial.findMany({
        where: {
          ...(opts.genre ? { genre: opts.genre } : {}),
          ...(opts.q
            ? { name: { contains: opts.q } }
            : {}),
        },
        orderBy: { updatedAt: "desc" },
        take: opts.take ?? 12,
        skip: opts.skip ?? 0,
      }),
    []
  );

export const getFeaturedSerial = () =>
  safe(
    () => prisma.serial.findFirst({ where: { featured: true }, orderBy: { updatedAt: "desc" } }),
    null
  );

export const getSerialBySlug = (slug: string) =>
  safe(
    () =>
      prisma.serial.findUnique({
        where: { slug },
        include: {
          episodes: { orderBy: { episodeNo: "desc" }, take: 10 },
          news: { include: { news: true }, take: 6 },
          celebrities: { include: { celebrity: true } },
          videos: { take: 6 },
        },
      }),
    null
  );

export const getVideos = (opts: { take?: number; skip?: number } = {}) =>
  safe(
    () =>
      prisma.video.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: "desc" },
        include: { category: true },
        take: opts.take ?? 12,
        skip: opts.skip ?? 0,
      }),
    []
  );

export const getVideoBySlug = (slug: string) =>
  safe(
    () =>
      prisma.video.findUnique({
        where: { slug },
        include: { category: true, serial: true },
      }),
    null
  );

export const getCelebrities = (opts: { take?: number; skip?: number } = {}) =>
  safe(
    () =>
      prisma.celebrity.findMany({
        orderBy: { name: "asc" },
        take: opts.take ?? 16,
        skip: opts.skip ?? 0,
      }),
    []
  );

export const getCelebrityBySlug = (slug: string) =>
  safe(
    () =>
      prisma.celebrity.findUnique({
        where: { slug },
        include: {
          news: { include: { news: true }, take: 6 },
          serials: { include: { serial: true } },
        },
      }),
    null
  );

export const getCategories = () =>
  safe(() => prisma.category.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }), []);

export const getActiveBreakingNews = () =>
  safe(
    () =>
      prisma.breakingNews.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
      }),
    []
  );

export async function globalSearch(q: string) {
  if (!q.trim()) return { news: [], serials: [], videos: [], celebrities: [] };
  return safe(
    async () => {
      const [news, serials, videos, celebrities] = await Promise.all([
        prisma.news.findMany({
          where: { status: "PUBLISHED", title: { contains: q } },
          include: { category: true },
          take: 10,
        }),
        prisma.serial.findMany({
          where: { name: { contains: q } },
          take: 10,
        }),
        prisma.video.findMany({
          where: { isPublished: true, title: { contains: q } },
          take: 10,
        }),
        prisma.celebrity.findMany({
          where: { name: { contains: q } },
          take: 10,
        }),
      ]);
      return { news, serials, videos, celebrities };
    },
    { news: [], serials: [], videos: [], celebrities: [] }
  );
}
