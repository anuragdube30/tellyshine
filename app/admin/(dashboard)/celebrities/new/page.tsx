import { CelebrityForm } from "@/components/admin/celebrity-form";

export const metadata = { title: "Add Celebrity" };

export default function NewCelebrityPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add Celebrity</h1>
      <CelebrityForm />
    </div>
  );
}
