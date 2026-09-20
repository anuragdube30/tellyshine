import { ChangePasswordForm } from "@/components/admin/change-password-form";

export default function SecurityPage() {
  return <section><h1 className="text-2xl font-bold">Security</h1><p className="mb-6 mt-1 text-sm text-muted-foreground">Use a unique password with at least 12 characters.</p><ChangePasswordForm /></section>;
}
