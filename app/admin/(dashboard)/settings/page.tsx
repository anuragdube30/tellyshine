import { prisma } from "@/lib/prisma";
import { parseSocialLinks } from "@/lib/utils";
import { SettingsForm } from "@/components/admin/settings-form";

export const metadata = { title: "Site Settings" };
export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Site Settings</h1>
      <SettingsForm
        initialData={{
          siteName: settings?.siteName || "Telly Shine",
          logoUrl: settings?.logoUrl || "",
          faviconUrl: settings?.faviconUrl || "",
          description: settings?.description || "",
          contactEmail: settings?.contactEmail || "",
          footerText: settings?.footerText || "",
          accentColor: settings?.accentColor || "#f2a71b",
          socialLinks: parseSocialLinks(settings?.socialLinks),
        }}
      />
    </div>
  );
}
