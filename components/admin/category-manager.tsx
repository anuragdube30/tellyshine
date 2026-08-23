"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Loader2, Check, X } from "lucide-react";
import { toast } from "sonner";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
};

export function CategoryManager({ initialCategories }: { initialCategories: Category[] }) {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [creating, setCreating] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editName, setEditName] = React.useState("");

  async function createCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, isActive: true }),
      });
      if (!res.ok) throw new Error();
      toast.success("Category created");
      setName("");
      setDescription("");
      router.refresh();
    } catch {
      toast.error("Failed to create category");
    } finally {
      setCreating(false);
    }
  }

  async function saveEdit(cat: Category) {
    try {
      const res = await fetch(`/api/categories/${cat.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, description: cat.description, isActive: cat.isActive }),
      });
      if (!res.ok) throw new Error();
      toast.success("Category updated");
      setEditingId(null);
      router.refresh();
    } catch {
      toast.error("Failed to update category");
    }
  }

  async function toggleActive(cat: Category) {
    try {
      const res = await fetch(`/api/categories/${cat.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: cat.name, description: cat.description, isActive: !cat.isActive }),
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      toast.error("Failed to update category");
    }
  }

  async function deleteCategory(id: string) {
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Category deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete — it may still have content assigned to it.");
    }
  }

  return (
    <div>
      <form onSubmit={createCategory} className="flex flex-wrap gap-3 mb-6 rounded-xl border border-border bg-card p-4">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Category name" className="admin-input flex-1 min-w-[180px]" />
        <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description (optional)" className="admin-input flex-1 min-w-[220px]" />
        <button type="submit" disabled={creating} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:scale-105 transition-transform disabled:opacity-60">
          {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Add
        </button>
      </form>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Slug</th>
              <th className="p-4">Active</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {initialCategories.map((c) => (
              <tr key={c.id} className="hover:bg-secondary/30 transition-colors">
                <td className="p-4">
                  {editingId === c.id ? (
                    <input value={editName} onChange={(e) => setEditName(e.target.value)} className="admin-input" />
                  ) : (
                    <span className="font-medium">{c.name}</span>
                  )}
                </td>
                <td className="p-4 text-muted-foreground">{c.slug}</td>
                <td className="p-4">
                  <button onClick={() => toggleActive(c)} className={`text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full ${c.isActive ? "bg-green-500/15 text-green-600 dark:text-green-400" : "bg-muted text-muted-foreground"}`}>
                    {c.isActive ? "Active" : "Disabled"}
                  </button>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-1.5">
                    {editingId === c.id ? (
                      <>
                        <button onClick={() => saveEdit(c)} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-secondary"><Check className="h-3.5 w-3.5" /></button>
                        <button onClick={() => setEditingId(null)} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-secondary"><X className="h-3.5 w-3.5" /></button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => { setEditingId(c.id); setEditName(c.name); }} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-secondary"><Pencil className="h-3.5 w-3.5" /></button>
                        <button onClick={() => deleteCategory(c.id)} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {initialCategories.length === 0 && (
              <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No categories yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
