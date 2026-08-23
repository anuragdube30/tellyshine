import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { EntityTableActions } from "@/components/admin/entity-table-actions";

export const metadata = { title: "Manage Celebrities" };
export const dynamic = "force-dynamic";

export default async function AdminCelebritiesPage() {
  const celebrities = await prisma.celebrity.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Celebrities</h1>
        <Link href="/admin/celebrities/new" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:scale-105 transition-transform">
          <Plus className="h-4 w-4" /> Add Celebrity
        </Link>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Profession</th>
              <th className="p-4">Featured</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {celebrities.map((c) => (
              <tr key={c.id} className="hover:bg-secondary/30 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 rounded-full overflow-hidden shrink-0">
                      <Image src={c.profileImage} alt={c.name} fill className="object-cover" />
                    </div>
                    <span className="font-medium">{c.name}</span>
                  </div>
                </td>
                <td className="p-4 text-muted-foreground">{c.profession}</td>
                <td className="p-4 text-muted-foreground">{c.featured ? "Yes" : "No"}</td>
                <td className="p-4">
                  <EntityTableActions apiPath={`/api/celebrities/${c.id}`} editPath={`/admin/celebrities/${c.id}/edit`} viewPath={`/celebrities/${c.slug}`} label="celebrity" />
                </td>
              </tr>
            ))}
            {celebrities.length === 0 && (
              <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No celebrity profiles yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
