"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function SearchBox({ initialQuery = "" }: { initialQuery?: string }) {
  const [q, setQ] = React.useState(initialQuery);
  const router = useRouter();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  }

  return (
    <form onSubmit={onSubmit} className="relative max-w-xl">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search news, serials, videos, celebrities…"
        className="w-full rounded-full border border-border bg-secondary/60 pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
    </form>
  );
}
