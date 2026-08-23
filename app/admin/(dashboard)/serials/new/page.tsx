import { prisma } from "@/lib/prisma";
import { SerialForm } from "@/components/admin/serial-form";

export const metadata = { title: "New Serial" };

export default async function NewSerialPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">New TV Serial</h1>
      <SerialForm categories={categories} />
    </div>
  );
}
