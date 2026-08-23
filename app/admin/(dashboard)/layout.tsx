import { AuthProvider } from "@/components/admin/auth-provider";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminTopbar } from "@/components/admin/topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen bg-surface">
        <AdminSidebar className="hidden lg:flex" />
        <div className="flex-1 min-w-0 flex flex-col">
          <AdminTopbar />
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </AuthProvider>
  );
}
