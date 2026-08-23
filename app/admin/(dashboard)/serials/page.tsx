import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { EntityTableActions } from "@/components/admin/entity-table-actions";

export const metadata = { title: "Manage TV Serials" };
export const dynamic = "force-dynamic";

export default async function AdminSerialsPage() {
  const serials = await prisma.serial.findMany({ orderBy: { updatedAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">TV Serials</h1>
        <Link href="/admin/serials/new" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:scale-105 transition-transform">
          <Plus className="h-4 w-4" /> New Serial
        </Link>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="p-4">Serial</th>
              <th className="p-4">Channel</th>
              <th className="p-4">Genre</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {serials.map((s) => (
              <tr key={s.id} className="hover:bg-secondary/30 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-9 rounded overflow-hidden shrink-0">
                      <Image src={s.poster} alt={s.name} fill className="object-cover" />
                    </div>
                    <span className="font-medium">{s.name}</span>
                  </div>
                </td>
                <td className="p-4 text-muted-foreground">{s.channel}</td>
                <td className="p-4 text-muted-foreground">{s.genre}</td>
                <td className="p-4">
                  <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-primary/15 text-primary">
                    {s.status}
                  </span>
                </td>
                <td className="p-4">
                  <EntityTableActions
                    apiPath={`/api/serials/${s.id}`}
                    editPath={`/admin/serials/${s.id}/edit`}
                    viewPath={`/tv-serials/${s.slug}`}
                    label="serial"
                  />
                </td>
              </tr>
            ))}
            {serials.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted-foreground">No serials found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
