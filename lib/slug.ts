import slugify from "slugify";
import { prisma } from "./prisma";

type SlugModel = "news" | "serial" | "video" | "celebrity" | "category";

export function toSlug(input: string) {
  return slugify(input, { lower: true, strict: true, trim: true });
}

/**
 * Generates a unique slug for the given model by appending -2, -3, etc.
 * if the base slug is already taken.
 */
export async function generateUniqueSlug(
  model: SlugModel,
  title: string,
  excludeId?: string
): Promise<string> {
  const base = toSlug(title);
  let slug = base;
  let counter = 2;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await findBySlug(model, slug);
    if (!existing || existing.id === excludeId) return slug;
    slug = `${base}-${counter}`;
    counter++;
  }
}

async function findBySlug(model: SlugModel, slug: string) {
  switch (model) {
    case "news":
      return prisma.news.findUnique({ where: { slug }, select: { id: true } });
    case "serial":
      return prisma.serial.findUnique({ where: { slug }, select: { id: true } });
    case "video":
      return prisma.video.findUnique({ where: { slug }, select: { id: true } });
    case "celebrity":
      return prisma.celebrity.findUnique({ where: { slug }, select: { id: true } });
    case "category":
      return prisma.category.findUnique({ where: { slug }, select: { id: true } });
  }
}
