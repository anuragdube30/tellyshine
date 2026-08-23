"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Item = { id: string; text: string; link: string | null; isActive: boolean; order: number };

export function BreakingNewsManager({ initialItems }: { initialItems: Item[] }) {
  const router = useRouter();
  const [items, setItems] = React.useState(initialItems);
  const [text, setText] = React.useState("");
  const [link, setLink] = React.useState("");
  const [creating, setCreating] = React.useState(false);

  React.useEffect(() => setItems(initialItems), [initialItems]);

  async function addItem(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/breaking-news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, link: link || null, isActive: true }),
      });
      if (!res.ok) throw new Error();
      toast.success("Breaking news added");
      setText("");
      setLink("");
      router.refresh();
    } catch {
      toast.error("Failed to add item");
    } finally {
      setCreating(false);
    }
  }

  async function toggleActive(item: Item) {
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, isActive: !i.isActive } : i)));
    try {
      await fetch(`/api/breaking-news/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !item.isActive }),
      });
      router.refresh();
    } catch {
      toast.error("Failed to update");
    }
  }

  async function deleteItem(id: string) {
    try {
      const res = await fetch(`/api/breaking-news/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Deleted");
      setItems((prev) => prev.filter((i) => i.id !== id));
      router.refresh();
    } catch {
      toast.error("Failed to delete");
    }
  }

  async function move(index: number, direction: -1 | 1) {
    const newItems = [...items];
    const target = index + direction;
    if (target < 0 || target >= newItems.length) return;
    [newItems[index], newItems[target]] = [newItems[target], newItems[index]];
    setItems(newItems);
    try {
      await fetch("/api/breaking-news/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds: newItems.map((i) => i.id) }),
      });
      router.refresh();
    } catch {
      toast.error("Failed to reorder");
    }
  }

  return (
    <div>
      <form onSubmit={addItem} className="flex flex-wrap gap-3 mb-6 rounded-xl border border-border bg-card p-4">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Breaking news text" className="admin-input flex-1 min-w-[220px]" />
        <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="Link (optional)" className="admin-input flex-1 min-w-[180px]" />
        <button type="submit" disabled={creating} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:scale-105 transition-transform disabled:opacity-60">
          {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Add
        </button>
      </form>

      <div className="rounded-xl border border-border bg-card divide-y divide-border">
        {items.map((item, i) => (
          <div key={item.id} className="flex items-center gap-3 p-4">
            <div className="flex flex-col">
              <button onClick={() => move(i, -1)} disabled={i === 0} className="disabled:opacity-30"><ArrowUp className="h-3.5 w-3.5" /></button>
              <button onClick={() => move(i, 1)} disabled={i === items.length - 1} className="disabled:opacity-30"><ArrowDown className="h-3.5 w-3.5" /></button>
            </div>
            <p className="flex-1 text-sm font-medium">{item.text}</p>
            <button
              onClick={() => toggleActive(item)}
              className={`text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full shrink-0 ${item.isActive ? "bg-green-500/15 text-green-600 dark:text-green-400" : "bg-muted text-muted-foreground"}`}
            >
              {item.isActive ? "Active" : "Disabled"}
            </button>
            <button onClick={() => deleteItem(item.id)} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-destructive/10 hover:text-destructive shrink-0">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        {items.length === 0 && <p className="p-8 text-center text-muted-foreground text-sm">No breaking news items yet.</p>}
      </div>
    </div>
  );
}
