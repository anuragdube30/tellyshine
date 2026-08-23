import Link from "next/link";
import { prisma } from "@/lib/prisma";

export async function BreakingNewsTicker() {
  let items: { id: string; text: string; link: string | null }[] = [];
  try {
    items = await prisma.breakingNews.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      select: { id: true, text: true, link: true },
      take: 10,
    });
  } catch {
    items = [];
  }

  if (items.length === 0) return null;

  return (
    <div className="w-full bg-accent text-accent-foreground overflow-hidden">
      <div className="container flex items-center h-9 gap-3">
        <span className="shrink-0 rounded bg-accent-foreground/15 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider">
          Breaking
        </span>
        <div className="relative flex-1 overflow-hidden no-scrollbar">
          <div className="flex whitespace-nowrap animate-ticker">
            {[...items, ...items].map((item, i) => (
              <Link
                key={`${item.id}-${i}`}
                href={item.link || "#"}
                className="mx-6 text-sm font-medium hover:underline"
              >
                {item.text}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
