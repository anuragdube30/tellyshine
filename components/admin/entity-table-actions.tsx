"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function EntityTableActions({
  apiPath,
  editPath,
  viewPath,
  label = "item",
}: {
  apiPath: string;
  editPath: string;
  viewPath?: string;
  label?: string;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = React.useState(false);
  const [confirming, setConfirming] = React.useState(false);

  async function handleDelete() {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000);
      return;
    }
    setDeleting(true);
    try {
      const res = await fetch(apiPath, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success(`${label} deleted`);
      router.refresh();
    } catch {
      toast.error(`Failed to delete ${label}`);
    } finally {
      setDeleting(false);
      setConfirming(false);
    }
  }

  return (
    <div className="flex items-center justify-end gap-1.5">
      {viewPath && (
        <Link
          href={viewPath}
          target="_blank"
          title="View live"
          className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-secondary transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      )}
      <Link
        href={editPath}
        title="Edit"
        className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-secondary transition-colors"
      >
        <Pencil className="h-3.5 w-3.5" />
      </Link>
      <button
        onClick={handleDelete}
        disabled={deleting}
        title={confirming ? "Click again to confirm" : "Delete"}
        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
          confirming ? "bg-destructive text-destructive-foreground" : "hover:bg-destructive/10 hover:text-destructive"
        }`}
      >
        {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}
