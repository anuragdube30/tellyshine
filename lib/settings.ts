import { prisma } from "./prisma";
import { cache } from "react";

/**
 * Cached per-request fetch of the singleton SiteSettings row.
 * Falls back to sane defaults if the DB isn't reachable yet (e.g. first boot
 * before seeding) so the site never hard-crashes on missing settings.
 */
export const getSiteSettings = cache(async () => {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "singleton" },
    });
    return settings;
  } catch {
    return null;
  }
});
