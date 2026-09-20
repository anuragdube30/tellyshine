import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SubscribersPage() {
  const subscribers = await prisma.subscriber.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <section>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Newsletter Subscribers</h1>
        <p className="text-sm text-muted-foreground">{subscribers.length} total subscriber{subscribers.length === 1 ? "" : "s"}</p>
      </div>
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-left">
            <tr><th className="px-4 py-3">Email</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Joined</th></tr>
          </thead>
          <tbody>
            {subscribers.map((subscriber) => (
              <tr key={subscriber.id} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{subscriber.email}</td>
                <td className="px-4 py-3">{subscriber.isActive ? "Active" : "Inactive"}</td>
                <td className="px-4 py-3 text-muted-foreground">{subscriber.createdAt.toLocaleDateString("en-IN")}</td>
              </tr>
            ))}
            {!subscribers.length && <tr><td colSpan={3} className="px-4 py-10 text-center text-muted-foreground">No subscribers yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}
